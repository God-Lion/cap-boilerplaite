// packages/platform-core/src/services/nfc/nfc-provisioning.service.ts
// Runs on the machine with ACR122U physically attached

import { randomBytes } from 'node:crypto';

export class NfcProvisioningService {
  constructor(private nfc: any) {} // nfc instance from nfc-pcsc

  /**
   * Provision a new NTAG424 tag:
   * 1. Read UID
   * 2. Generate random AES-128 key
   * 3. Write SDM configuration (URL template with dynamic params)
   * 4. Change application key to generated key
   * 5. Return { uid, key } for database storage
   */
  async provisionTag(baseUrl: string): Promise<{ uid: string; aesKey: string }> {
    return new Promise((resolve, reject) => {
      this.nfc.on('reader', (reader: any) => {
        reader.on('card', async (card: any) => {
          try {
            const uid = card.uid;

            // Generate unique AES-128 key for this tag
            const aesKey = randomBytes(16).toString('hex');

            // Configure SDM (Secure Dynamic Messaging) on NTAG424
            // This tells the chip HOW to build the dynamic URL
            await this.configureSDM(reader, aesKey, baseUrl, uid);

            resolve({ uid, aesKey });
          } catch (err) {
            reject(err);
          }
        });

        reader.on('error', (err: any) => {
          reject(err);
        });
      });

      this.nfc.on('error', (err: any) => {
        reject(err);
      });
    });
  }

  private async configureSDM(
    reader: any,
    aesKey: string,
    baseUrl: string,
    uid: string
  ): Promise<void> {
    // NTAG424 uses ISO 7816-4 APDU commands
    // SDMFileData configuration — tells chip to append uid+ctr+cmac to URL

    // Template: https://your-app.com/nfc/verify?uid=XXXXXXXXXXXXXXXX&ctr=XXXXXX&cmac=XXXXXXXXXXXXXXXX
    // Chip fills in X's dynamically on each scan
    // Note: The specific offsets for UID, CTR, and CMAC depend on the URL length and tag configuration.
    // This is a simplified version based on the plan.

    const urlTemplate = `${baseUrl}/nfc/verify?uid=00000000000000&ctr=000000&cmac=0000000000000000`;

    // APDU: WriteSdmFileData (simplified — real impl uses nfc-pcsc APDU)
    const writeCommand = Buffer.from([
      0x90, 0x8D, 0x00, 0x00,  // CLA, INS (WriteData), P1, P2
      urlTemplate.length,       // Lc
      ...Buffer.from(urlTemplate, 'ascii'),
      0x00                      // Le
    ]);

    await reader.transmit(writeCommand, 256);

    // Change key from default 0x00..00 to our generated key
    await this.changeApplicationKey(reader, aesKey);
  }

  private async changeApplicationKey(reader: any, newKeyHex: string): Promise<void> {
    const newKey = Buffer.from(newKeyHex, 'hex');

    // ChangeKey APDU for NTAG424 (App 0x000000, Key 0x00)
    const changeKeyCmd = Buffer.from([
      0x90, 0xC4, 0x00, 0x00, 0x11,
      0x00,          // Key number
      ...newKey,     // New key (16 bytes)
      0x00           // Le
    ]);

    await reader.transmit(changeKeyCmd, 256);
  }
}

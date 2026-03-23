// packages/platform-core/src/services/nfc/nfc-crypto.utils.ts
// Runs SERVER-SIDE only — never expose AES keys to browser

import { createCipheriv } from 'node:crypto';

/**
 * AES-128 CMAC implementation for NTAG424 DNA verification
 * Based on RFC 4493
 */
export function computeAesCmac(keyHex: string, dataHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  const data = Buffer.from(dataHex, 'hex');

  // Generate subkeys K1, K2
  const L = aesCbc(key, Buffer.alloc(16, 0), Buffer.alloc(16, 0));
  const K1 = generateSubkey(L);
  const K2 = generateSubkey(K1);

  // Pad and XOR last block
  const blocks = splitIntoBlocks(data, 16);
  const lastBlock = blocks[blocks.length - 1];
  const isComplete = lastBlock.length === 16;
  const paddedLast = isComplete
    ? xor(lastBlock, K1)
    : xor(pad(lastBlock, 16), K2);

  // CBC-MAC
  let x = Buffer.alloc(16, 0);
  for (let i = 0; i < blocks.length - 1; i++) {
    x = aesCbc(key, x, blocks[i]) as any;
  }
  x = aesCbc(key, x, paddedLast) as any;

  // NTAG424 uses first 8 bytes of CMAC (truncated MAC)
  return x.slice(0, 8).toString('hex').toUpperCase();
}

function aesCbc(key: Buffer, iv: Buffer, data: Buffer): Buffer {
  const cipher = createCipheriv('aes-128-cbc', key, iv);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

function generateSubkey(L: Buffer): Buffer {
  const shifted = Buffer.alloc(16);
  let overflow = 0;
  for (let i = 15; i >= 0; i--) {
    shifted[i] = ((L[i] << 1) | overflow) & 0xff;
    overflow = (L[i] & 0x80) ? 1 : 0;
  }
  if (L[0] & 0x80) shifted[15] ^= 0x87;
  return shifted;
}

function xor(a: Buffer, b: Buffer): Buffer {
  return Buffer.from(a.map((byte, i) => byte ^ b[i]));
}

function pad(data: Buffer, blockSize: number): Buffer {
  const padded = Buffer.alloc(blockSize, 0);
  data.copy(padded);
  padded[data.length] = 0x80;
  return padded;
}

function splitIntoBlocks(data: Buffer, blockSize: number): Buffer[] {
  const blocks: Buffer[] = [];
  for (let i = 0; i < data.length; i += blockSize) {
    blocks.push(data.slice(i, i + blockSize));
  }
  if (blocks.length === 0) blocks.push(Buffer.alloc(0));
  return blocks;
}

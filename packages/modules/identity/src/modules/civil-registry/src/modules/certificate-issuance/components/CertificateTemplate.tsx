// modules/certificate-issuance/components/CertificateTemplate.tsx

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import QRCode from 'react-qr-code';

export function CertificateTemplate({ cert }: { cert: any }) {
  return (
    <Box sx={{
      width: '210mm',
      height: '297mm',
      p: '20mm',
      bgcolor: '#fff9f0', // Slight parchment feel
      border: '10px double #4a4a4a',
      fontFamily: '"Times New Roman", serif',
      position: 'relative',
      margin: 'auto',
      boxShadow: 3
    }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, letterSpacing: 2 }}>
          REPUBLIC OF ONEAUTH
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, fontStyle: 'italic' }}>
          CIVIL REGISTRY DEPARTMENT
        </Typography>
        <Divider sx={{ mb: 4, borderColor: '#000' }} />
        <Typography variant="h2" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          CERTIFICATE OF LIVE BIRTH
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <DetailRow label="Certificate Number" value={cert.certificateNumber} />
        <DetailRow label="Child's Full Name" value={`${cert.childName.firstName} ${cert.childName.lastName}`} />
        <DetailRow label="Date of Birth" value={cert.birthDetails.dateOfBirth} />
        <DetailRow label="Place of Birth" value={cert.birthDetails.placeOfBirth.facilityName} />
        <DetailRow label="Sex" value={cert.birthDetails.sex} />
        <DetailRow label="Social Security Number" value={`***-**-${cert.ssn?.serialNumber || 'XXXX'}`} />
      </Box>

      <Box sx={{ mb: 8, border: '1px solid #ddd', p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>PARENTAL INFORMATION</Typography>
        {cert.parents.map((parent: any, idx: number) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="body1">
              <strong>{parent.role}:</strong> {parent.fullName.firstName} {parent.fullName.lastName}
            </Typography>
            <Typography variant="body2">Nationality: {parent.nationality}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10, px: 4 }}>
        <SignatureBlock title="Hospital Registrar" />
        <SignatureBlock title="Civil Registrar" />
        <SignatureBlock title="Director General" />
      </Box>

      <Box sx={{ position: 'absolute', bottom: '40mm', right: '30mm', textAlign: 'center' }}>
        <QRCode value={`https://verify.oneauth.com/bc/${cert.id}`} size={100} />
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          Verified Digital Seal
        </Typography>
      </Box>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 1.5 }}>
      <Typography sx={{ width: '200px', fontWeight: 'bold', color: '#555' }}>{label}:</Typography>
      <Typography sx={{ fontSize: '1.2rem' }}>{value}</Typography>
    </Box>
  );
}

function SignatureBlock({ title }: { title: string }) {
  return (
    <Box sx={{ textAlign: 'center', width: '150px' }}>
      <Box sx={{ height: '50px', borderBottom: '2px solid #000', mb: 1 }} />
      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{title}</Typography>
    </Box>
  );
}

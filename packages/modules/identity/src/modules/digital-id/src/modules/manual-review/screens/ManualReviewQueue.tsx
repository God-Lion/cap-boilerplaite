// modules/manual-review/screens/ManualReviewQueue.tsx

import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DigitalIdPath from '../../../routes/path';

const mockPending = [
  { id: 'APP-001', citizenName: 'John Doe', submittedAt: '2023-10-25', reason: 'Low Face Quality' },
  { id: 'APP-002', citizenName: 'Jane Smith', submittedAt: '2023-10-26', reason: 'Uncertain Document Match' },
];

export function ManualReviewQueue() {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Manual Review Queue</Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>Citizen</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Escalation Reason</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPending.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.citizenName}</TableCell>
                <TableCell>{row.submittedAt}</TableCell>
                <TableCell>
                  <Chip label={row.reason} color="warning" size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate(DigitalIdPath.review.detail.replace(':id', row.id))}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

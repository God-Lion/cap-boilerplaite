// modules/registry-dashboard/screens/RegistryDashboard.tsx

import React from 'react';
import { 
  Grid, // Changed from Grid2 as Grid
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button
} from '@mui/material';

export function RegistryDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Civil Registry Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard title="Pending Review" value="12" color="warning.main" />
        <StatCard title="SSN Assigned" value="8" color="info.main" />
        <StatCard title="Issued Today" value="24" color="success.main" />
        <StatCard title="Monthly Total" value="482" color="primary.main" />
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Recent Declarations</Typography>
          <Button variant="outlined" size="small">View All</Button>
        </Box>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Child Name</TableCell>
              <TableCell>Hospital</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John Doe Jr.</TableCell>
              <TableCell>Central Hospital</TableCell>
              <TableCell><Chip label="SUBMITTED" size="small" color="warning" /></TableCell>
              <TableCell>2025-03-22</TableCell>
              <TableCell align="right">
                <Button size="small">Review</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>St. Mary Clinic</TableCell>
              <TableCell><Chip label="SSN_ASSIGNED" size="small" color="info" /></TableCell>
              <TableCell>2025-03-21</TableCell>
              <TableCell align="right">
                <Button size="small">Approve</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderLeft: `5px solid ${color}` }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

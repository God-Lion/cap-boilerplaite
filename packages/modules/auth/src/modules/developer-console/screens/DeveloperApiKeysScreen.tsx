import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export const DeveloperApiKeysScreen: React.FC = () => {
  const [keys, setKeys] = useState<{ id: number, name: string, prefix: string, createdAt: string }[]>([]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">Developer API Keys</Typography>
        <Button variant="contained" color="primary">Generate New Key</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Prefix</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No API Keys found.</TableCell>
              </TableRow>
            ) : (
              keys.map(key => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>{key.prefix}</TableCell>
                  <TableCell>{key.createdAt}</TableCell>
                  <TableCell align="right">
                    <Button color="error" size="small">Revoke</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

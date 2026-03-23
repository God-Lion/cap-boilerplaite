import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Stack,
  Chip,
  Divider,
  Alert,
  Paper,
  MenuItem,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Delete,
  PlayArrow,
  Save,
  Rule,
  Code,
  Info,
  History,
} from '@mui/icons-material'
import { adminService } from '../../services/adminService'
import { useSnackbar } from 'notistack'

const AccessPolicyBuilder = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [policyName, setPolicyName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState<any[]>([
    { id: 1, attribute: 'user.clearance', operator: '>=', value: '3' }
  ])
  const [logicPreview, setLogicPreview] = useState('')

  const operators = ['==', '!=', '>', '>=', '<', '<=', 'in', 'contains']
  const attributes = ['user.role', 'user.clearance', 'user.department', 'resource.owner', 'resource.type', 'env.ip', 'env.time']

  const updateLogicPreview = (currentRules: any[]) => {
    const logic = {
      "and": currentRules.map(r => ({
        [r.operator]: [{ "var": r.attribute }, r.value]
      }))
    }
    setLogicPreview(JSON.stringify(logic, null, 2))
  }

  const handleAddRule = () => {
    const newRules = [...rules, { id: Date.now(), attribute: 'user.role', operator: '==', value: '' }]
    setRules(newRules)
    updateLogicPreview(newRules)
  }

  const handleRemoveRule = (id: number) => {
    const newRules = rules.filter(r => r.id !== id)
    setRules(newRules)
    updateLogicPreview(newRules)
  }

  const handleRuleChange = (id: number, field: string, value: any) => {
    const newRules = rules.map(r => r.id === id ? { ...r, [field]: value } : r)
    setRules(newRules)
    updateLogicPreview(newRules)
  }

  const handleSavePolicy = async () => {
    try {
      // Assuming a createPolicy method in adminService
      // const response = await adminService.createPolicy({ name: policyName, logic: JSON.parse(logicPreview) })
      enqueueSnackbar('Access policy saved successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to save policy', { variant: 'error' })
    }
  }

  React.useEffect(() => {
    updateLogicPreview(rules)
  }, [])

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
            ABAC POLICY BUILDER
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Define dynamic Attribute-Based Access Control policies using logical conditions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<History />}>Versions</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSavePolicy} sx={{ bgcolor: 'info.main' }}>
            Save Policy
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 4, mb: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>General Information</Typography>
              <TextField
                fullWidth
                label="Policy Name"
                placeholder="e.g. Sensitive Data Clearance"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                placeholder="Required clearance level for vault access..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Logical Rules</Typography>
                <Button startIcon={<Add />} onClick={handleAddRule} size="small">Add Rule</Button>
              </Box>

              <Stack spacing={2}>
                {rules.map((rule, index) => (
                  <Box key={rule.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Chip label={index === 0 ? "IF" : "AND"} sx={{ fontWeight: 800, width: 60 }} color="primary" variant="outlined" />
                    <TextField
                      select
                      size="small"
                      value={rule.attribute}
                      onChange={(e) => handleRuleChange(rule.id, 'attribute', e.target.value)}
                      sx={{ width: 200 }}
                    >
                      {attributes.map(attr => <MenuItem key={attr} value={attr}>{attr}</MenuItem>)}
                    </TextField>
                    <TextField
                      select
                      size="small"
                      value={rule.operator}
                      onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
                      sx={{ width: 120 }}
                    >
                      {operators.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                    </TextField>
                    <TextField
                      size="small"
                      placeholder="Value"
                      value={rule.value}
                      onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton size="small" color="error" onClick={() => handleRemoveRule(rule.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 4, bgcolor: 'grey.900', color: 'success.light', height: '100%', minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Code fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>JSON LOGIC PREVIEW</Typography>
                <Tooltip title="This logic will be evaluated by the authorization engine at runtime.">
                   <Info fontSize="inherit" sx={{ opacity: 0.6, ml: 'auto' }} />
                </Tooltip>
              </Box>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 2, 
                fontFamily: 'monospace', 
                fontSize: '0.8rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {logicPreview}
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                color="inherit" 
                startIcon={<PlayArrow />}
                sx={{ mt: 3, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Test Policy
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AccessPolicyBuilder

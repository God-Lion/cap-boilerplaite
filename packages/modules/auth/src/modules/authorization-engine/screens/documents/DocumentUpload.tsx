import React, { useState, useCallback, useRef } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Stack,
  IconButton,
  Paper,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from '@mui/material'
import {
  CloudUpload,
  Description,
  Close,
  CheckCircle,
  AutoAwesome,
  Storage,
  Warning,
  Delete,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import {
  documentChunker,
  ChunkingConfig,
  ChunkingProgress,
  documentDeduplication,
  DeduplicationResult,
} from '@auth/modules/authorization-engine/services/document'

type FileStatus = 'pending' | 'processing' | 'completed' | 'error' | 'duplicate'

interface ProcessedFile {
  id: string
  name: string
  size: string
  sizeBytes: number
  progress: number
  status: FileStatus
  sector: string
  chunksIndexed: number
  duplicatesFound: number
  error?: string
  processingPhase?: ChunkingProgress['phase']
}

type Sector = 'healthcare' | 'legal' | 'finance' | 'supply_chain' | 'general'

const SECTOR_LABELS: Record<Sector, string> = {
  healthcare: 'Healthcare (HIPAA)',
  legal: 'Legal',
  finance: 'Finance',
  supply_chain: 'Supply Chain',
  general: 'General',
}

const SUPPORTED_TYPES = ['application/pdf', 'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/json', 'text/markdown']

const MAX_FILE_SIZE = 50 * 1024 * 1024

const DocumentUpload = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedSector, setSelectedSector] = useState<Sector>('general')
  const [storageUsed, setStorageUsed] = useState(14)
  const processingRef = useRef<Set<string>>(new Set())

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      processFiles(fileList)
    }
    e.target.value = ''
  }

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx?|txt|json|md)$/i)) {
      return 'Unsupported file type'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File exceeds 50MB limit'
    }
    return null
  }

  const processFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const error = validateFile(file)
      if (error) {
        enqueueSnackbar(`${file.name}: ${error}`, { variant: 'warning' })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const newProcessedFiles: ProcessedFile[] = validFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: formatFileSize(file.size),
      sizeBytes: file.size,
      progress: 0,
      status: 'pending' as FileStatus,
      sector: SECTOR_LABELS[selectedSector],
      chunksIndexed: 0,
      duplicatesFound: 0,
    }))

    setFiles(prev => [...prev, ...newProcessedFiles])

    for (const processedFile of newProcessedFiles) {
      if (!processingRef.current.has(processedFile.id)) {
        processingRef.current.add(processedFile.id)
        processFile(processedFile.id, validFiles.find(f => f.name === processedFile.name)!)
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const processFile = async (fileId: string, file: File) => {
    updateFileProgress(fileId, { status: 'processing', progress: 0, processingPhase: 'parsing' })

    try {
      const fileContent = await readFileContent(file)
      
      updateFileProgress(fileId, { progress: 10, processingPhase: 'chunking' })

      const isDuplicate = await documentDeduplication.checkDuplicate(fileContent)
      
      if (isDuplicate.isDuplicate) {
        updateFileProgress(fileId, {
          status: 'duplicate',
          progress: 100,
          duplicatesFound: 1,
          error: `Duplicate of: ${isDuplicate.duplicateDocumentId}`
        })
        enqueueSnackbar(`${file.name} is a duplicate document`, { variant: 'warning' })
        processingRef.current.delete(fileId)
        return
      }

      updateFileProgress(fileId, { progress: 30 })

      const chunks = await documentChunker.chunkText(fileContent, (progress) => {
        const adjustedProgress = 30 + Math.round(progress.percentage * 0.3)
        updateFileProgress(fileId, { 
          progress: adjustedProgress,
          processingPhase: progress.phase 
        })
      })

      updateFileProgress(fileId, { progress: 65, processingPhase: 'embedding' })

      const deduplicationResult = await documentDeduplication.deduplicateBatch(
        [{
          documentId: fileId,
          documentName: file.name,
          content: fileContent,
          size: file.size
        }]
      )

      await documentDeduplication.registerDocument(
        fileId,
        file.name,
        fileContent,
        file.size
      )

      updateFileProgress(fileId, { 
        progress: 85, 
        processingPhase: 'indexing',
        chunksIndexed: chunks.length 
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      updateFileProgress(fileId, {
        status: 'completed',
        progress: 100,
        processingPhase: 'complete',
        chunksIndexed: chunks.length,
        duplicatesFound: deduplicationResult.duplicatesFound
      })

      setStorageUsed(prev => Math.min(100, prev + Math.round(file.size / (100 * 1024 * 1024))))
      
      enqueueSnackbar(`${file.name} processed successfully (${chunks.length} chunks)`, { 
        variant: 'success' 
      })

    } catch (error) {
      console.error(`Error processing ${file.name}:`, error)
      updateFileProgress(fileId, {
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Processing failed'
      })
      enqueueSnackbar(`Failed to process ${file.name}`, { variant: 'error' })
    }

    processingRef.current.delete(fileId)
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const updateFileProgress = (fileId: string, updates: Partial<ProcessedFile>) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, ...updates } : f
    ))
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'))
  }

  const getStatusColor = (status: FileStatus): 'primary' | 'success' | 'error' | 'warning' | 'inherit' => {
    switch (status) {
      case 'completed': return 'success'
      case 'error': return 'error'
      case 'duplicate': return 'warning'
      case 'processing': return 'primary'
      default: return 'inherit'
    }
  }

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />
      case 'error': return <Warning color="error" />
      case 'duplicate': return <Delete color="warning" />
      default: return <Description color="action" />
    }
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const totalChunks = files.reduce((sum, f) => sum + f.chunksIndexed, 0)
  const duplicateCount = files.filter(f => f.status === 'duplicate').length

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AutoAwesome sx={{ color: 'primary.main', fontSize: '2.5rem' }} />
            AI DOCUMENT PROCESSING
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Upload documents for automated analysis, chunking, vector embeddings, and deduplication.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ opacity: 0.7 }}>
          <Storage fontSize="small" />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>STORAGE UTILIZATION: {storageUsed}%</Typography>
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Document Sector</InputLabel>
          <Select
            value={selectedSector}
            label="Document Sector"
            onChange={(e) => setSelectedSector(e.target.value as Sector)}
          >
            {Object.entries(SECTOR_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`${completedCount} Indexed`} color="success" size="small" />
          <Chip label={`${totalChunks} Chunks`} color="primary" size="small" />
          {duplicateCount > 0 && (
            <Chip label={`${duplicateCount} Duplicates`} color="warning" size="small" />
          )}
        </Stack>
      </Stack>

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 6,
          mb: 4,
          borderRadius: 6,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          bgcolor: isDragging ? alpha('#0061ff', 0.05) : 'background.paper',
          transition: 'all 0.3s ease',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: alpha('#0061ff', 0.02)
          }
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,.json,.md"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          bgcolor: 'primary.main', 
          color: 'white', 
          mx: 'auto', 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(0, 97, 255, 0.2)'
        }}>
          <CloudUpload sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Drag and drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Support for PDF, DOCX, TXT, JSON, and MD. Maximum 50MB per file.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Sector: {SECTOR_LABELS[selectedSector]}
        </Typography>
      </Paper>

      {files.some(f => f.status === 'duplicate') && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Duplicate documents detected. These files were not indexed as they match existing documents.
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              PROCESSING QUEUE ({files.length})
            </Typography>
            <Stack direction="row" spacing={1}>
              {completedCount > 0 && (
                <Button 
                  size="small" 
                  variant="text" 
                  sx={{ fontWeight: 700 }}
                  onClick={clearCompleted}
                >
                  Clear Completed
                </Button>
              )}
              {files.length > 0 && (
                <Button 
                  size="small" 
                  variant="text" 
                  sx={{ fontWeight: 700 }}
                  onClick={() => setFiles([])}
                >
                  Clear All
                </Button>
              )}
            </Stack>
          </Box>
          <Divider />
          <List disablePadding>
            {files.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                <Typography variant="body2" color="text.disabled">No files in queue.</Typography>
              </Box>
            ) : (
              files.map((file) => (
                <ListItem key={file.id} divider sx={{ py: 2, px: 3 }}>
                  <ListItemIcon>
                    {getStatusIcon(file.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{file.name}</Typography>
                          <Chip label={file.sector} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                          {file.size}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getStatusColor(file.status) === 'success' ? 'success.main' : 
                                       getStatusColor(file.status) === 'error' ? 'error.main' : 
                                       getStatusColor(file.status) === 'warning' ? 'warning.main' : 'primary.main',
                                fontWeight: 800 
                              }}
                            >
                              {file.status.toUpperCase()}
                              {file.processingPhase && file.status === 'processing' && ` - ${file.processingPhase.toUpperCase()}`}
                            </Typography>
                            {file.chunksIndexed > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {file.chunksIndexed} chunks
                              </Typography>
                            )}
                            {file.duplicatesFound > 0 && (
                              <Typography variant="caption" color="warning.main">
                                {file.duplicatesFound} duplicate(s)
                              </Typography>
                            )}
                          </Stack>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>
                            {Math.round(file.progress)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={file.progress} 
                          color={getStatusColor(file.status)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        {file.error && (
                          <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
                            {file.error}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <IconButton onClick={() => removeFile(file.id)} size="small" sx={{ ml: 2 }}>
                    <Close fontSize="small" />
                  </IconButton>
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DocumentUpload

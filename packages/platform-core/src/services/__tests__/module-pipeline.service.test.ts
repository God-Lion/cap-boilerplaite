import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs/promises'
import { ModulePipelineService } from '../module-pipeline.service'

describe('ModulePipelineService', () => {
  let service: ModulePipelineService
  let testTempDir: string

  beforeEach(async () => {
    testTempDir = path.join(process.cwd(), 'temp', `test_pipeline_${Date.now()}`)
    await fs.mkdir(testTempDir, { recursive: true })
    service = new ModulePipelineService(testTempDir)
  })

  afterEach(async () => {
    try {
      await fs.rm(testTempDir, { recursive: true, force: true })
    } catch {
      // ignore
    }
  })

  it('should initialize a pipeline job with valid steps and logs', () => {
    const job = service.createJob('test-module.zip', 2048)
    expect(job.jobId).toBeDefined()
    expect(job.filename).toBe('test-module.zip')
    expect(job.currentStage).toBe('UPLOADING')
    expect(job.stages.length).toBe(5)
    expect(job.logs.length).toBeGreaterThan(0)
  })

  it('should correctly validate path safety and prevent Zip Slip vulnerabilities', () => {
    const baseDir = path.join(testTempDir, 'staging')
    const safePath = path.join(baseDir, 'extracted', 'index.ts')
    const unsafePath = path.join(baseDir, '..', '..', 'etc', 'passwd')

    expect(service.isPathSafe(baseDir, safePath)).toBe(true)
    expect(service.isPathSafe(baseDir, unsafePath)).toBe(false)
  })

  it('should validate module contract correctly', async () => {
    const mockModuleFolder = path.join(testTempDir, 'candidate-module')
    await fs.mkdir(path.join(mockModuleFolder, 'src'), { recursive: true })

    await fs.writeFile(
      path.join(mockModuleFolder, 'package.json'),
      JSON.stringify({ name: 'analytics-widget', version: '1.2.0' }),
    )
    await fs.writeFile(
      path.join(mockModuleFolder, 'src', 'index.ts'),
      'export const module = { id: "analytics-widget", version: "1.2.0" }',
    )

    const result = service.validateModuleContract(mockModuleFolder)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.manifest?.id).toBe('analytics-widget')
    expect(result.manifest?.version).toBe('1.2.0')
  })

  it('should reject invalid module IDs during contract validation', async () => {
    const mockModuleFolder = path.join(testTempDir, 'invalid-module')
    await fs.mkdir(path.join(mockModuleFolder, 'src'), { recursive: true })

    await fs.writeFile(
      path.join(mockModuleFolder, 'package.json'),
      JSON.stringify({ name: 'INVALID ID WITH SPACES!' }),
    )
    await fs.writeFile(path.join(mockModuleFolder, 'src', 'index.ts'), '// empty')

    const result = service.validateModuleContract(mockModuleFolder)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should execute full 4-stage pipeline successfully', async () => {
    const job = service.createJob('billing-reports.zip', 4096)
    const dummyBuffer = Buffer.from('mock zip data')

    const completedJob = await service.executePipeline(job.jobId, dummyBuffer)
    expect(completedJob.currentStage).toBe('COMPLETE')
    expect(completedJob.moduleId).toBe('billing-reports')
    expect(completedJob.error).toBeUndefined()

    const installed = await service.getInstalledModules()
    expect(installed.some((m) => m.id === 'billing-reports')).toBe(true)
  })
})

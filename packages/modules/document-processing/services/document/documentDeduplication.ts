/**
 * Document Deduplication Service
 *
 * Implements cross-document deduplication using content hashing and semantic similarity.
 * Prevents storing duplicate or near-duplicate documents in the vector index.
 *
 * Features:
 * - Exact duplicate detection using cryptographic hashing
 * - Near-duplicate detection using MinHash/LSH
 * - Semantic similarity detection using embeddings
 * - Configurable thresholds and detection strategies
 * - Batch processing for large document sets
 * - Deduplication reports and statistics
 */

import { vectorIndexing, EmbeddingResult } from './vectorIndexingService'

export type DeduplicationStrategy = 'exact' | 'fuzzy' | 'semantic' | 'hybrid'
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'xxhash64'

export interface DeduplicationConfig {
  strategy: DeduplicationStrategy
  exactThreshold: number
  fuzzyThreshold: number
  semanticThreshold: number
  minHashSize: number
  numPermutations: number
  hashAlgorithm: HashAlgorithm
  normalizeText: boolean
  removeWhitespace: boolean
  caseSensitive: boolean
}

export interface DuplicateGroup {
  groupId: string
  documents: DuplicateDocument[]
  detectionMethod: DeduplicationStrategy
  similarityScore: number
}

export interface DuplicateDocument {
  documentId: string
  documentName: string
  hash: string
  minHash?: number[]
  embeddingId?: string
  size: number
  createdAt: string
}

export interface DeduplicationResult {
  totalDocuments: number
  uniqueDocuments: number
  duplicatesFound: number
  duplicateGroups: DuplicateGroup[]
  hashes: Map<string, DuplicateDocument[]>
  processingTimeMs: number
}

export interface DeduplicationStats {
  totalProcessed: number
  exactDuplicates: number
  fuzzyDuplicates: number
  semanticDuplicates: number
  lastRun: string
}

const DEFAULT_CONFIG: DeduplicationConfig = {
  strategy: 'hybrid',
  exactThreshold: 1.0,
  fuzzyThreshold: 0.85,
  semanticThreshold: 0.92,
  minHashSize: 128,
  numPermutations: 256,
  hashAlgorithm: 'sha256',
  normalizeText: true,
  removeWhitespace: true,
  caseSensitive: false,
}

class DocumentDeduplicationService {
  private config: DeduplicationConfig
  private hashIndex: Map<string, DuplicateDocument[]> = new Map()
  private minHashIndex: Map<string, DuplicateDocument[]> = new Map()
  private semanticCache: Map<string, number[]> = new Map()
  private stats: DeduplicationStats

  constructor(config: Partial<DeduplicationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.stats = {
      totalProcessed: 0,
      exactDuplicates: 0,
      fuzzyDuplicates: 0,
      semanticDuplicates: 0,
      lastRun: new Date().toISOString(),
    }
  }

  updateConfig(config: Partial<DeduplicationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  private generateId(): string {
    return `dedup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private async computeHash(content: string, algorithm: HashAlgorithm): Promise<string> {
    const normalized = this.normalizeContent(content)
    const encoder = new TextEncoder()
    const data = encoder.encode(normalized)

    if (algorithm === 'md5' || algorithm === 'sha1' || algorithm === 'sha256') {
      const hashBuffer = await crypto.subtle.digest(
        algorithm.toUpperCase().replace('SHA', 'SHA-'),
        data
      )
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(16, '0')
  }

  private normalizeContent(content: string): string {
    let normalized = content

    if (this.config.normalizeText) {
      normalized = normalized.normalize('NFC')
    }

    if (this.config.removeWhitespace) {
      normalized = normalized.replace(/\s+/g, ' ').trim()
    }

    if (!this.config.caseSensitive) {
      normalized = normalized.toLowerCase()
    }

    return normalized
  }

  private computeMinHash(content: string): number[] {
    const normalized = this.normalizeContent(content)
    const words = normalized.split(/\s+/)
    const minHash: number[] = new Array(this.config.minHashSize).fill(Infinity)

    for (let i = 0; i < this.config.numPermutations; i++) {
      let minValue = Infinity

      for (let j = 0; j < words.length; j++) {
        const word = words[j]
        const hashValue = this.hashString(`${i}_${j}_${word}`)
        minValue = Math.min(minValue, hashValue)
      }

      if (i < this.config.minHashSize) {
        minHash[i] = minValue
      }
    }

    return minHash
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private computeJaccardSimilarity(minHash1: number[], minHash2: number[]): number {
    if (minHash1.length !== minHash2.length) return 0

    let matches = 0
    for (let i = 0; i < minHash1.length; i++) {
      if (minHash1[i] === minHash2[i]) {
        matches++
      }
    }

    return matches / minHash1.length
  }

  private estimateSimilarityFromMinHash(minHash1: number[], minHash2: number[]): number {
    return this.computeJaccardSimilarity(minHash1, minHash2)
  }

  async registerDocument(
    documentId: string,
    documentName: string,
    content: string,
    size: number,
    embeddingId?: string
  ): Promise<{
    hash: string
    minHash: number[]
    isDuplicate: boolean
    duplicateOf?: string
  }> {
    const hash = await this.computeHash(content, this.config.hashAlgorithm)
    const minHash = this.computeMinHash(content)

    const existingByHash = this.hashIndex.get(hash)
    if (existingByHash && this.config.strategy === 'exact') {
      return {
        hash,
        minHash,
        isDuplicate: true,
        duplicateOf: existingByHash[0].documentId,
      }
    }

    const duplicateDoc: DuplicateDocument = {
      documentId,
      documentName,
      hash,
      minHash,
      embeddingId,
      size,
      createdAt: new Date().toISOString(),
    }

    if (!this.hashIndex.has(hash)) {
      this.hashIndex.set(hash, [])
    }
    this.hashIndex.get(hash)!.push(duplicateDoc)

    this.minHashCacheUpdate(documentId, minHash)

    return { hash, minHash, isDuplicate: false }
  }

  private minHashCacheUpdate(documentId: string, minHash: number[]): void {
    const similarDocs = this.findSimilarByMinHash(minHash)

    if (similarDocs.length > 0) {
      if (!this.minHashIndex.has(documentId)) {
        this.minHashIndex.set(documentId, [])
      }
      this.minHashIndex.get(documentId)!.push(...similarDocs)
    }
  }

  private findSimilarByMinHash(minHash: number[]): DuplicateDocument[] {
    const similar: DuplicateDocument[] = []

    for (const [, docs] of this.hashIndex) {
      for (const doc of docs) {
        if (doc.minHash) {
          const similarity = this.estimateSimilarityFromMinHash(minHash, doc.minHash)
          if (similarity >= this.config.fuzzyThreshold) {
            similar.push(doc)
          }
        }
      }
    }

    return similar
  }

  async checkDuplicate(
    content: string,
    existingDocumentIds?: string[]
  ): Promise<{
    isDuplicate: boolean
    duplicateType: DeduplicationStrategy | null
    duplicateDocumentId?: string
    similarityScore?: number
  }> {
    const hash = await this.computeHash(content, this.config.hashAlgorithm)
    const minHash = this.computeMinHash(content)

    if (this.config.strategy === 'exact' || this.config.strategy === 'hybrid') {
      const existingByHash = this.hashIndex.get(hash)
      if (existingByHash) {
        const filtered = existingDocumentIds
          ? existingByHash.filter(d => existingDocumentIds.includes(d.documentId))
          : existingByHash

        if (filtered.length > 0) {
          return {
            isDuplicate: true,
            duplicateType: 'exact',
            duplicateDocumentId: filtered[0].documentId,
            similarityScore: 1.0,
          }
        }
      }
    }

    if (this.config.strategy === 'fuzzy' || this.config.strategy === 'hybrid') {
      const similarMinHash = this.findSimilarByMinHash(minHash)

      if (similarMinHash.length > 0) {
        const filtered = existingDocumentIds
          ? similarMinHash.filter(d => existingDocumentIds.includes(d.documentId))
          : similarMinHash

        if (filtered.length > 0) {
          const similarities = filtered.map(doc => ({
            doc,
            similarity: doc.minHash
              ? this.estimateSimilarityFromMinHash(minHash, doc.minHash)
              : 0,
          }))

          const best = similarities.reduce((a, b) =>
            a.similarity > b.similarity ? a : b
          )

          return {
            isDuplicate: true,
            duplicateType: 'fuzzy',
            duplicateDocumentId: best.doc.documentId,
            similarityScore: best.similarity,
          }
        }
      }
    }

    return {
      isDuplicate: false,
      duplicateType: null,
    }
  }

  async deduplicateBatch(
    documents: Array<{
      documentId: string
      documentName: string
      content: string
      size: number
    }>
  ): Promise<DeduplicationResult> {
    const startTime = performance.now()
    const duplicateGroups: DuplicateGroup[] = []
    const processedHashes: Set<string> = new Set()
    const processedMinHash: Map<string, string> = new Map()

    const result: DeduplicationResult = {
      totalDocuments: documents.length,
      uniqueDocuments: 0,
      duplicatesFound: 0,
      duplicateGroups: [],
      hashes: new Map(),
      processingTimeMs: 0,
    }

    for (const doc of documents) {
      const hash = await this.computeHash(doc.content, this.config.hashAlgorithm)
      const minHash = this.computeMinHash(doc.content)

      if (processedHashes.has(hash)) {
        const existing = result.hashes.get(hash)
        if (existing) {
          existing.push({
            documentId: doc.documentId,
            documentName: doc.documentName,
            hash,
            minHash,
            size: doc.size,
            createdAt: new Date().toISOString(),
          })
          result.duplicatesFound++
          this.stats.exactDuplicates++

          const group = duplicateGroups.find(g => 
            g.documents.some(d => d.hash === hash)
          )
          if (!group) {
            duplicateGroups.push({
              groupId: this.generateId(),
              documents: existing,
              detectionMethod: 'exact',
              similarityScore: 1.0,
            })
          }
        }
      } else {
        const similarMinHash = this.findSimilarByMinHash(minHash)
        const newSimilar: DuplicateDocument[] = []

        for (const similar of similarMinHash) {
          if (!processedHashes.has(similar.hash)) {
            const similarity = similar.minHash
              ? this.estimateSimilarityFromMinHash(minHash, similar.minHash)
              : 0

            if (similarity >= this.config.fuzzyThreshold) {
              newSimilar.push({
                documentId: doc.documentId,
                documentName: doc.documentName,
                hash,
                minHash,
                size: doc.size,
                createdAt: new Date().toISOString(),
              })

              duplicateGroups.push({
                groupId: this.generateId(),
                documents: [similar, ...newSimilar],
                detectionMethod: 'fuzzy',
                similarityScore: similarity,
              })

              result.duplicatesFound++
              this.stats.fuzzyDuplicates++
            }
          }
        }

        if (newSimilar.length === 0) {
          result.uniqueDocuments++
          result.hashes.set(hash, [{
            documentId: doc.documentId,
            documentName: doc.documentName,
            hash,
            minHash,
            size: doc.size,
            createdAt: new Date().toISOString(),
          }])
        }

        processedHashes.add(hash)
        processedMinHash.set(doc.documentId, hash)
      }

      if (result.totalDocuments % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    result.duplicateGroups = duplicateGroups
    result.processingTimeMs = performance.now() - startTime
    this.stats.totalProcessed += documents.length
    this.stats.lastRun = new Date().toISOString()

    return result
  }

  async findSemanticDuplicates(
    embeddings: EmbeddingResult[],
    threshold?: number
  ): Promise<DuplicateGroup[]> {
    const duplicateGroups: DuplicateGroup[] = []
    const checked: Set<string> = new Set()
    const effectiveThreshold = threshold || this.config.semanticThreshold

    for (let i = 0; i < embeddings.length; i++) {
      for (let j = i + 1; j < embeddings.length; j++) {
        const pairKey = `${embeddings[i].id}_${embeddings[j].id}`
        if (checked.has(pairKey)) continue

        checked.add(pairKey)

        const similarity = this.cosineSimilarity(
          embeddings[i].vector,
          embeddings[j].vector
        )

        if (similarity >= effectiveThreshold) {
          duplicateGroups.push({
            groupId: this.generateId(),
            documents: [
              {
                documentId: embeddings[i].metadata.documentId,
                documentName: embeddings[i].metadata.documentName,
                hash: '',
                embeddingId: embeddings[i].id,
                size: embeddings[i].chunk.content.length,
                createdAt: embeddings[i].metadata.createdAt,
              },
              {
                documentId: embeddings[j].metadata.documentId,
                documentName: embeddings[j].metadata.documentName,
                hash: '',
                embeddingId: embeddings[j].id,
                size: embeddings[j].chunk.content.length,
                createdAt: embeddings[j].metadata.createdAt,
              },
            ],
            detectionMethod: 'semantic',
            similarityScore: similarity,
          })

          this.stats.semanticDuplicates++
        }
      }

      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    return duplicateGroups
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) return 0

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  getStats(): DeduplicationStats {
    return { ...this.stats }
  }

  getHashIndex(): Map<string, DuplicateDocument[]> {
    return new Map(this.hashIndex)
  }

  removeDocument(documentId: string): boolean {
    for (const [hash, docs] of this.hashIndex) {
      const index = docs.findIndex(d => d.documentId === documentId)
      if (index !== -1) {
        docs.splice(index, 1)
        if (docs.length === 0) {
          this.hashIndex.delete(hash)
        }
        this.minHashIndex.delete(documentId)
        this.semanticCache.delete(documentId)
        return true
      }
    }
    return false
  }

  clearIndex(): void {
    this.hashIndex.clear()
    this.minHashIndex.clear()
    this.semanticCache.clear()
    this.stats = {
      totalProcessed: 0,
      exactDuplicates: 0,
      fuzzyDuplicates: 0,
      semanticDuplicates: 0,
      lastRun: new Date().toISOString(),
    }
  }
}

export const documentDeduplication = new DocumentDeduplicationService()

export { DocumentDeduplicationService }

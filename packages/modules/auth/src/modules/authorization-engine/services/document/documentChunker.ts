/**
 * Document Chunker Service
 *
 * Handles streaming and chunking of large documents to prevent OOM errors.
 * Supports multiple chunking strategies optimized for NLP processing.
 *
 * Features:
 * - Configurable chunk sizes and overlaps
 * - Multiple chunking strategies (fixed, sentence, paragraph, semantic)
 * - Streaming support for very large files
 * - Memory-efficient processing with Web Workers
 * - Progress tracking for long operations
 */

export type ChunkingStrategy = 'fixed' | 'sentence' | 'paragraph' | 'semantic'

export interface ChunkingConfig {
  strategy: ChunkingStrategy
  chunkSize: number
  chunkOverlap: number
  minChunkSize: number
  maxChunkSize: number
  preserveFormatting: boolean
  language?: string
}

export interface DocumentChunk {
  id: string
  content: string
  startIndex: number
  endIndex: number
  metadata: ChunkMetadata
}

export interface ChunkMetadata {
  chunkIndex: number
  totalChunks: number
  charCount: number
  wordCount: number
  isFirstChunk: boolean
  isLastChunk: boolean
  sectionId?: string
  headingLevel?: number
}

export interface ChunkingProgress {
  phase: 'parsing' | 'chunking' | 'embedding' | 'indexing' | 'complete'
  currentChunk: number
  totalChunks: number
  percentage: number
  bytesProcessed: number
  totalBytes: number
}

export type ProgressCallback = (progress: ChunkingProgress) => void

const DEFAULT_CONFIG: ChunkingConfig = {
  strategy: 'paragraph',
  chunkSize: 1000,
  chunkOverlap: 200,
  minChunkSize: 100,
  maxChunkSize: 2000,
  preserveFormatting: true,
  language: 'en',
}

const SENTENCE_ENDINGS: Record<string, RegExp> = {
  en: /[.!?]+[\s\n]+/g,
  fr: /[.!?]+[\s\n]+/g,
  de: /[.!?]+[\s\n]+/g,
  es: /[.!?]+[\s\n]+/g,
  default: /[.!?]+[\s\n]+/g,
}

const PARAGRAPH_SEPARATOR = /\n\s*\n/g

class DocumentChunkerService {
  private config: ChunkingConfig
  private abortController: AbortController | null = null

  constructor(config: Partial<ChunkingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  updateConfig(config: Partial<ChunkingConfig>): void {
    this.config = { ...this.config, ...config }
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  private generateChunkId(): string {
    return `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  private getSentenceEndingRegex(): RegExp {
    const lang = this.config.language || 'en'
    return SENTENCE_ENDINGS[lang] || SENTENCE_ENDINGS.default
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    const regex = this.getSentenceEndingRegex()
    const sentences: string[] = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      const sentence = text.substring(lastIndex, match.index + match[0].length).trim()
      if (sentence.length > 0) {
        sentences.push(sentence)
      }
      lastIndex = match.index + match[0].length
    }

    const remaining = text.substring(lastIndex).trim()
    if (remaining.length > 0) {
      sentences.push(remaining)
    }

    return sentences
  }

  /**
   * Split text into paragraphs
   */
  private splitIntoParagraphs(text: string): string[] {
    return text
      .split(PARAGRAPH_SEPARATOR)
      .map(p => p.trim())
      .filter(p => p.length > 0)
  }

  /**
   * Fixed-size chunking
   */
  private chunkFixed(text: string): string[] {
    const chunks: string[] = []
    let startIndex = 0

    while (startIndex < text.length) {
      let endIndex = Math.min(startIndex + this.config.chunkSize, text.length)
      if (endIndex < text.length) {
        const spaceIndex = text.lastIndexOf(' ', endIndex)
        if (spaceIndex > startIndex) {
          endIndex = spaceIndex
        }
      }

      chunks.push(text.substring(startIndex, endIndex))
      startIndex = endIndex - this.config.chunkOverlap

      if (startIndex >= text.length || startIndex < 0) {
        break
      }
    }

    return chunks
  }

  /**
   * Sentence-based chunking
   */
  private chunkBySentences(text: string): string[] {
    const sentences = this.splitIntoSentences(text)
    const chunks: string[] = []
    let currentChunk = ''
    let currentLength = 0

    for (const sentence of sentences) {
      const sentenceLength = sentence.length

      if (currentLength + sentenceLength > this.config.chunkSize && currentChunk.length > 0) {
        if (currentChunk.length >= this.config.minChunkSize) {
          chunks.push(currentChunk.trim())
        }

        const overlapText = currentChunk.substring(
          Math.max(0, currentChunk.length - this.config.chunkOverlap)
        )
        currentChunk = overlapText ? overlapText + ' ' + sentence : sentence
        currentLength = currentChunk.length
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence
        currentLength += sentenceLength + 1
      }
    }

    if (currentChunk.trim().length >= this.config.minChunkSize) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  /**
   * Paragraph-based chunking
   */
  private chunkByParagraphs(text: string): string[] {
    const paragraphs = this.splitIntoParagraphs(text)
    const chunks: string[] = []
    let currentChunk = ''

    for (const paragraph of paragraphs) {
      const paragraphLength = paragraph.length

      if (paragraphLength > this.config.maxChunkSize) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.trim())
          currentChunk = ''
        }

        const subChunks = this.chunkFixed(paragraph)
        chunks.push(...subChunks.filter(c => c.length >= this.config.minChunkSize))
      } else if (currentChunk.length + paragraphLength + 1 > this.config.chunkSize) {
        if (currentChunk.length >= this.config.minChunkSize) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = paragraph
      } else {
        currentChunk = currentChunk ? currentChunk + '\n\n' + paragraph : paragraph
      }
    }

    if (currentChunk.trim().length >= this.config.minChunkSize) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  /**
   * Semantic chunking (basic implementation using topic boundaries)
   */
  private chunkSemantic(text: string): string[] {
    const paragraphs = this.splitIntoParagraphs(text)
    const chunks: string[] = []
    let currentChunk = ''
    const topicMarkers = [
      /\n#{1,6}\s+/,
      /^(?:chapter|section|part)\s+\d+/im,
      /^(?:introduction|summary|conclusion|background|methods|results|discussion)\s*[:.]/im,
      /\n\s*[-*]\s+(?:\w+\s+){0,5}(?:process|step|phase|stage)/i,
    ]

    let currentTopic = ''
    let topicStart = 0

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i]
      const isTopicBoundary = topicMarkers.some(marker => marker.test(paragraph))

      if (isTopicBoundary && currentChunk.length > 0) {
        if (currentChunk.length >= this.config.minChunkSize) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = paragraph
        currentTopic = paragraph.substring(0, 50)
        topicStart = i
      } else if (currentChunk.length + paragraph.length + 2 > this.config.chunkSize) {
        if (currentChunk.length >= this.config.minChunkSize) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = paragraph
      } else {
        currentChunk = currentChunk ? currentChunk + '\n\n' + paragraph : paragraph
      }
    }

    if (currentChunk.trim().length >= this.config.minChunkSize) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  /**
   * Main chunking method
   */
  private performChunking(text: string): string[] {
    switch (this.config.strategy) {
      case 'fixed':
        return this.chunkFixed(text)
      case 'sentence':
        return this.chunkBySentences(text)
      case 'paragraph':
        return this.chunkByParagraphs(text)
      case 'semantic':
        return this.chunkSemantic(text)
      default:
        return this.chunkByParagraphs(text)
    }
  }

  /**
   * Chunk a document from text content
   */
  async chunkText(
    text: string,
    onProgress?: ProgressCallback
  ): Promise<DocumentChunk[]> {
    this.abortController = new AbortController()

    const reportProgress = (phase: ChunkingProgress['phase'], current: number, total: number) => {
      if (this.abortController?.signal.aborted) {
        throw new Error('Chunking aborted')
      }

      const progress: ChunkingProgress = {
        phase,
        currentChunk: current,
        totalChunks: total,
        percentage: total > 0 ? Math.round((current / total) * 100) : 0,
        bytesProcessed: 0,
        totalBytes: text.length,
      }
      onProgress?.(progress)
    }

    reportProgress('parsing', 0, 1)
    await this.yieldToMain()

    reportProgress('chunking', 0, 1)
    const rawChunks = this.performChunking(text)

    reportProgress('chunking', rawChunks.length, rawChunks.length)
    await this.yieldToMain()

    const totalChunks = rawChunks.length
    const chunks: DocumentChunk[] = []
    let startIndex = 0

    for (let i = 0; i < rawChunks.length; i++) {
      const content = rawChunks[i]
      const start = text.indexOf(content.substring(0, 50), startIndex)
      const end = start + content.length

      const chunk: DocumentChunk = {
        id: this.generateChunkId(),
        content,
        startIndex: start >= 0 ? start : startIndex,
        endIndex: end,
        metadata: {
          chunkIndex: i,
          totalChunks,
          charCount: content.length,
          wordCount: this.countWords(content),
          isFirstChunk: i === 0,
          isLastChunk: i === rawChunks.length - 1,
        },
      }

      chunks.push(chunk)
      startIndex = end - this.config.chunkOverlap

      if (i % 50 === 0) {
        reportProgress('chunking', i + 1, totalChunks)
        await this.yieldToMain()
      }
    }

    reportProgress('complete', totalChunks, totalChunks)
    return chunks
  }

  /**
   * Chunk a file with streaming support for large files
   */
  async chunkFile(
    file: File,
    onProgress?: ProgressCallback
  ): Promise<DocumentChunk[]> {
    this.abortController = new AbortController()
    const CHUNK_SIZE = 64 * 1024
    let offset = 0
    let fullText = ''
    const textParts: string[] = []

    while (offset < file.size) {
      if (this.abortController.signal.aborted) {
        throw new Error('Chunking aborted')
      }

      const blob = file.slice(offset, offset + CHUNK_SIZE)
      const text = await blob.text()
      textParts.push(text)
      offset += CHUNK_SIZE

      const progress: ChunkingProgress = {
        phase: 'parsing',
        currentChunk: 0,
        totalChunks: 0,
        percentage: Math.round((offset / file.size) * 100),
        bytesProcessed: offset,
        totalBytes: file.size,
      }
      onProgress?.(progress)

      if (offset % (1024 * 1024) === 0) {
        await this.yieldToMain()
      }
    }

    fullText = textParts.join('')
    return this.chunkText(fullText, onProgress)
  }

  /**
   * Chunk with streaming output (for very large documents)
   */
  async *chunkTextStream(
    text: string,
    onProgress?: ProgressCallback
  ): AsyncGenerator<DocumentChunk, void, unknown> {
    const rawChunks = this.performChunking(text)
    const totalChunks = rawChunks.length
    let startIndex = 0

    for (let i = 0; i < rawChunks.length; i++) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Chunking aborted')
      }

      const content = rawChunks[i]
      const start = text.indexOf(content.substring(0, 50), startIndex)
      const end = start + content.length

      const chunk: DocumentChunk = {
        id: this.generateChunkId(),
        content,
        startIndex: start >= 0 ? start : startIndex,
        endIndex: end,
        metadata: {
          chunkIndex: i,
          totalChunks,
          charCount: content.length,
          wordCount: this.countWords(content),
          isFirstChunk: i === 0,
          isLastChunk: i === rawChunks.length - 1,
        },
      }

      yield chunk
      startIndex = end - this.config.chunkOverlap

      const progress: ChunkingProgress = {
        phase: 'chunking',
        currentChunk: i + 1,
        totalChunks,
        percentage: Math.round(((i + 1) / totalChunks) * 100),
        bytesProcessed: end,
        totalBytes: text.length,
      }
      onProgress?.(progress)

      if (i % 100 === 0) {
        await this.yieldToMain()
      }
    }
  }

  /**
   * Yield to main thread to prevent UI blocking
   */
  private yieldToMain(): Promise<void> {
    return new Promise(resolve => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => resolve(), { timeout: 100 })
      } else {
        setTimeout(() => resolve(), 0)
      }
    })
  }

  /**
   * Get statistics about chunking
   */
  getStats(chunks: DocumentChunk[]): {
    totalChunks: number
    totalChars: number
    totalWords: number
    avgChunkSize: number
    minChunkSize: number
    maxChunkSize: number
  } {
    if (chunks.length === 0) {
      return {
        totalChunks: 0,
        totalChars: 0,
        totalWords: 0,
        avgChunkSize: 0,
        minChunkSize: 0,
        maxChunkSize: 0,
      }
    }

    const sizes = chunks.map(c => c.metadata.charCount)
    return {
      totalChunks: chunks.length,
      totalChars: chunks.reduce((sum, c) => sum + c.metadata.charCount, 0),
      totalWords: chunks.reduce((sum, c) => sum + c.metadata.wordCount, 0),
      avgChunkSize: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
      minChunkSize: Math.min(...sizes),
      maxChunkSize: Math.max(...sizes),
    }
  }
}

export const documentChunker = new DocumentChunkerService()

export { DocumentChunkerService }

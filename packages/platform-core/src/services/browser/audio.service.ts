/**
 * Web Audio Service
 * Wrapper for the Web Audio API for complex audio processing.
 */
export class AudioService {
    private static instance: AudioService
    private context: AudioContext | null = null

    private constructor() { }

    static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService()
        }
        return AudioService.instance
    }

    isSupported(): boolean {
        return 'AudioContext' in window || 'webkitAudioContext' in window
    }

    /**
     * Initialize or get the AudioContext
     */
    getContext(): AudioContext {
        if (!this.isSupported()) {
            throw new Error('Web Audio API is not supported.')
        }

        if (!this.context) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
            this.context = new AudioContextClass()
        }

        // Resume context if suspended (browser policy)
        if (this.context.state === 'suspended') {
            this.context.resume()
        }

        return this.context
    }

    /**
     * Play a simple tone (oscillator)
     */
    playTone(frequency: number = 440, duration: number = 0.5, type: OscillatorType = 'sine'): void {
        const ctx = this.getContext()
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

        gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.start()
        oscillator.stop(ctx.currentTime + duration)
    }

    /**
     * Load an audio file from a URL
     */
    async loadAudio(url: string): Promise<AudioBuffer> {
        const ctx = this.getContext()
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        return await ctx.decodeAudioData(arrayBuffer)
    }

    /**
     * Play an AudioBuffer
     */
    playBuffer(buffer: AudioBuffer): void {
        const ctx = this.getContext()
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(ctx.destination)
        source.start()
    }
}

export const audioService = AudioService.getInstance()

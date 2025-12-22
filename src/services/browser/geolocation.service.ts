/**
 * Geolocation Service
 * Wrapper for the Geolocation API to access device location.
 */
export interface GeolocationPosition {
    coords: {
        latitude: number
        longitude: number
        altitude: number | null
        accuracy: number
        altitudeAccuracy: number | null
        heading: number | null
        speed: number | null
    }
    timestamp: number
}

export interface GeolocationError {
    code: number
    message: string
}

export class GeolocationService {
    private static instance: GeolocationService

    private constructor() { }

    static getInstance(): GeolocationService {
        if (!GeolocationService.instance) {
            GeolocationService.instance = new GeolocationService()
        }
        return GeolocationService.instance
    }

    isSupported(): boolean {
        return 'geolocation' in navigator
    }

    /**
     * Get the current position of the device
     */
    getCurrentPosition(
        options?: PositionOptions
    ): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('Geolocation is not supported by this browser.'))
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position as unknown as GeolocationPosition),
                (error) => reject(error),
                options
            )
        })
    }

    /**
     * Watch the device's position
     */
    watchPosition(
        onSuccess: (position: GeolocationPosition) => void,
        onError?: (error: GeolocationError) => void,
        options?: PositionOptions
    ): number {
        if (!this.isSupported()) {
            throw new Error('Geolocation is not supported by this browser.')
        }

        return navigator.geolocation.watchPosition(
            (position) => onSuccess(position as unknown as GeolocationPosition),
            (error) => onError?.(error),
            options
        )
    }

    /**
     * Clear a position watch
     */
    clearWatch(watchId: number): void {
        if (!this.isSupported()) {
            return
        }
        navigator.geolocation.clearWatch(watchId)
    }
}

export const geolocationService = GeolocationService.getInstance()

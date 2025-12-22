import StorageManager from "./storage.service";


export const localStorageManager = {
    set: (key: string, value: any, encrypt = false) => StorageManager.saveToLocalStorage(key, value, encrypt),
    get: <T = any>(key: string, decrypt = false) => StorageManager.getFromLocalStorage<T>(key, decrypt),
    has: (key: string) => {
        try {
            return localStorage.getItem(key) !== null
        } catch {
            return false
        }
    },
    remove: (key: string) => StorageManager.deleteFromLocalStorage(key),
    clear: () => {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('LocalStorage clear error:', error)
        }
    }
}

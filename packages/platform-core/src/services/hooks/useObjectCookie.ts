import React from 'react'
import { useCookie } from 'react-use'

const useObjectCookie = <T>(
    key: string,
    fallback?: T | null,
): [T, (newVal: T) => void] => {
    const [valStr, updateCookie] = useCookie(key)

    const value = React.useMemo<T>(
        () => (valStr ? JSON.parse(valStr) : (fallback as T)),
        [valStr, fallback],
    )

    const updateValue = (newVal: T) => {
        updateCookie(JSON.stringify(newVal))
    }

    return [value, updateValue]
}

export default useObjectCookie
export { useObjectCookie }

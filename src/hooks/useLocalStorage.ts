import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Modified from: https://designcode.io/react-hooks-handbook-uselocalstorage-hook
export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        let currentValue: T;

        try {
            currentValue = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue));
        } catch (error) {
            currentValue = defaultValue;
        }

        return currentValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

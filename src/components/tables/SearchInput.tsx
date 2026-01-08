"use client";
import React from "react";

interface SearchInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    const [internalValue, setInternalValue] = React.useState(value);

    // debounce biar ga spam request
    React.useEffect(() => {

        const handler = setTimeout(() => {
            onChange(internalValue);
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [internalValue, onChange]);

    return (
        <input
            type="text"
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            placeholder={placeholder ?? "Search..."}
            className="border px-3 py-2 rounded w-64"
        />
    );
}

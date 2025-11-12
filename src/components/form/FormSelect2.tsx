import React, { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Controller, Control } from "react-hook-form";

interface Option {
    label: string;
    value: number | string;
}

interface FormSelect2Props {
    label?: string;
    name: string;
    options?: Option[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    placeholder?: string;
    isMulti?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    className?: string;
    error?: string;
    loadOptions?: (
        inputValue: string,
        callback: (options: Option[]) => void
    ) => void;
    defaultOptions?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (value: any) => void;
    required?: boolean;
}

const FormSelect2: React.FC<FormSelect2Props> = ({
    label,
    name,
    options,
    control,
    placeholder = "Select...",
    isMulti = false,
    isClearable = true,
    isSearchable = true,
    className = "",
    error,
    loadOptions,
    defaultOptions = true,
    onChange,
    required = true
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const customStyles = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "42px",
            height: "42px",
            borderRadius: "0.375rem",
            borderColor: error
                ? "#ef4444"
                : state.isFocused
                    ? "#3b82f6"
                    : "#e5e7eb",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
            "&:hover": {
                borderColor: error ? "#ef4444" : "#3b82f6",
            },
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueContainer: (base: any) => ({
            ...base,
            height: "42px",
            padding: "0 8px",
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: (base: any) => ({
            ...base,
            margin: "0px",
            padding: "0px",
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        indicatorsContainer: (base: any) => ({
            ...base,
            height: "42px",
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        menu: (base: any) => ({
            ...base,
            borderRadius: "0.375rem",
            marginTop: "4px",
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#3b82f6"
                : state.isFocused
                    ? "#eff6ff"
                    : "white",
            color: state.isSelected ? "white" : "#1f2937",
            "&:hover": {
                backgroundColor: state.isSelected ? "#3b82f6" : "#eff6ff",
            },
        }),
    };

    return (
        <div className={`flex flex-col ${className} mb-3`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required ? (
                        <span className="text-error-500">*</span>
                    ) : (
                        <span className="text-gray-500">&nbsp;(Optional)</span>
                    )}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) =>
                    loadOptions ? (
                        <AsyncSelect
                            {...field}
                            cacheOptions
                            defaultOptions={defaultOptions}
                            loadOptions={loadOptions}
                            placeholder={placeholder}
                            isMulti={isMulti}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={customStyles}
                            isLoading={isLoading}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onInputChange={(newValue: any) => {
                                setIsLoading(true);
                                return newValue;
                            }}
                            onChange={(val) => {
                                field.onChange(val); // penting buat react-hook-form
                                if (onChange) onChange(val); // custom handler
                            }}
                        />
                    ) : (
                        <Select
                            {...field}
                            options={options}
                            placeholder={placeholder}
                            isMulti={isMulti}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={customStyles}
                            onChange={(val) => {
                                field.onChange(val);
                                if (onChange) onChange(val);
                            }}
                        />
                    )
                }
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default FormSelect2;

import DatePicker from '@/components/form/datePicker'
import InputLabel from '@/components/form/FormInput'
import Button from '@/components/ui/button/Button'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { dateFormat } from '@/utils/dateFormat'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'

interface FilterForm {
    start_date: string;
    end_date: string;
    keyword: string;
}

const FilterPurchaseOrder = ({ filter, setFilter }: {
    filter: FilterForm,
    setFilter: (filter: FilterForm) => void
}) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm<FilterForm>({
        defaultValues: {
            start_date: filter.start_date || '',
            end_date: filter.end_date || '',
            keyword: filter.keyword || ''
        }
    });

    const [activeFilters, setActiveFilters] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const formValues = watch();
    useEffect(() => {
        let count = 0;
        if (formValues.start_date) count++;
        if (formValues.end_date) count++;
        if (formValues.keyword) count++;
        setActiveFilters(count);
    }, [formValues]);

    const onSubmit = (data: FilterForm) => {
        setFilter(data);
        setIsOpen(false);
    };

    const handleReset = () => {
        reset();
        setFilter({
            start_date: '',
            end_date: '',
            keyword: ''
        });
    };

    const removeFilter = (type: keyof FilterForm) => {
        setValue(type, '');
        setFilter({
            ...filter,
            [type]: '',
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateChange = (selectedDates: Date[], dateStr: string, instance: any) => {
        const inputId = instance.element.id;
        if (inputId === 'start_date') {
            setValue('start_date', dateStr);
        } else if (inputId === 'end_date') {
            setValue('end_date', dateStr);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 mb-4">
                {/* Active Filter Chips */}
                {filter.start_date && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>Start: {dateFormat(filter.start_date, 'DD MMM YYYY')}</span>
                        <button
                            onClick={() => removeFilter('start_date')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.end_date && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>End: {dateFormat(filter.end_date, 'DD MMM YYYY')}</span>
                        <button
                            onClick={() => removeFilter('end_date')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.keyword && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>Keyword: {filter.keyword}</span>
                        <button
                            onClick={() => removeFilter('keyword')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Filter Button with Dropdown */}
                <div className="relative">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 relative dropdown-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        Filter
                        {activeFilters > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                                {activeFilters}
                            </span>
                        )}
                    </Button>
                    <Dropdown
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <div className="w-96 p-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-4">
                                    <InputLabel
                                        placeholder="Search keyword"
                                        label="Keyword"
                                        name="keyword"
                                        onChange={(e) => setValue('keyword', e.target.value)}
                                        register={register("keyword")}
                                    />
                                    <DatePicker
                                        placeholder='Start Date'
                                        label='Start Date'
                                        id='start_date'
                                        onChange={handleDateChange}
                                        mode='single'
                                        defaultDate={watch('start_date')}
                                    />
                                    <DatePicker
                                        placeholder='End Date'
                                        label='End Date'
                                        id='end_date'
                                        onChange={handleDateChange}
                                        mode='single'
                                        defaultDate={watch('end_date')}
                                    />
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            type="button"
                                            onClick={handleReset}
                                            size="xs"
                                            variant="outline"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="xs"
                                            variant="primary"
                                        >
                                            Apply Filter
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default FilterPurchaseOrder

"use client"
import Breadcrumb from '@/components/common/Breadcrumb'
import ComponentCard from '@/components/common/ComponentCard'
import DatePicker from '@/components/form/datePicker';
import InputLabel from '@/components/form/FormInput';
import FormSelect2 from '@/components/form/FormSelect2';
import TextAreaLabel from '@/components/form/FormTextArea';
import Button from '@/components/ui/button/Button';
import { useCreateData } from '@/hooks/useCreateData';
import { useFetchData } from '@/hooks/useFetchData';
import KanbanService from '@/services/KanbanService';
import ManualPurchaseOrderService from '@/services/ManualPurchaseOrderService';
import { Kanban } from '@/types/kanban';
import { confirm } from '@/utils/confirm';
import { createManualPurchaseOrderSchema } from '@/validators/manualPurchaseOrderValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
type formData = z.infer<typeof createManualPurchaseOrderSchema>;
const CreateManualPurchaseOrderPage = () => {

    const { mutate: createMutation, isPending } = useCreateData(
        ManualPurchaseOrderService.create,
        ["manualPurchaseOrders"],
        "/manual-purchase-orders"
    );
    const { data: kanbans } = useFetchData(KanbanService.getWithoutPagination, "kanbans", false);
    const { register, handleSubmit, setValue, watch, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(createManualPurchaseOrderSchema),
    });
    const onSubmit = async (data: formData) => {
        const ok = await confirm(
            "Are you sure?",
            "This action cannot be undone.",
            "Yes, Create Now!"
        );

        if (!ok) return;

        const payload = {
            ...data,
            kanban_code: data.kanban_code?.value || null
        }
        createMutation(payload);
    };
    const handleDateChange = (selectedDates: Date[], dateStr: string) => {
        const dateValue = selectedDates[0] || new Date(dateStr);
        setValue("date", dateValue);
    };


    return (
        <div>
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Manual Purchase Orders', href: '/manual-purchase-orders' }, { label: 'Create' }]} />
            <div className="space-y-6">
                <ComponentCard title="Create Manual PO">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <DatePicker
                                placeholder='Date'
                                label='Date'
                                id='date'
                                onChange={handleDateChange}
                                mode='single'
                                defaultDate={watch('date')}
                                error={errors.date}
                            />
                        </div>

                        <InputLabel
                            label="PO Number"
                            name="po_number"
                            type="text"
                            required
                            placeholder="Enter PO Number"
                            register={register("po_number")}
                            error={errors.po_number}
                        />
                        <InputLabel
                            label="PR Number"
                            name="pr_number"
                            type="text"
                            required
                            placeholder="Enter PR Number"
                            register={register("pr_number")}
                            error={errors.pr_number}
                        />
                        {kanbans && (
                            <FormSelect2
                                label="Kanban"
                                name="kanban_code"
                                control={control}
                                options={kanbans.map((d: Kanban) => ({
                                    label: d.code + " - " + d.description || "",
                                    value: d.code,
                                }))}
                                placeholder="Select Kanban"
                                error={errors.kanban_code?.message}
                            />

                        )}
                        <InputLabel
                            label="Quantity"
                            name="quantity"
                            type="number"
                            required
                            placeholder="Enter quantity"
                            register={register("quantity", { valueAsNumber: true })}
                            error={errors.quantity}
                        />

                        <TextAreaLabel
                            label="Remark"
                            name="remark"
                            placeholder="Enter remark"
                            register={register("remark")}
                            error={errors.remark}
                        />

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="px-4"
                                onClick={() => reset()}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                variant="primary"
                                className="px-4"
                                disabled={isPending}
                                loading={isPending}
                            >
                                Create Manual PO
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    )
}

export default CreateManualPurchaseOrderPage

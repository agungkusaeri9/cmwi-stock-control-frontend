"use client"
import Breadcrumb from '@/components/common/Breadcrumb'
import ComponentCard from '@/components/common/ComponentCard';
import InputLabel from '@/components/form/FormInput';
import TextAreaLabel from '@/components/form/FormTextArea';
import Button from '@/components/ui/button/Button';
import { useFetchById } from '@/hooks/useFetchDetailData';
import { useUpdateData } from '@/hooks/useUpdateData';
import StockOutService from '@/services/StockOutService';
import { StockOut } from '@/types/stockOut';
import { dateFormat } from '@/utils/dateFormat';
import { updateStockOutValidator } from '@/validators/stockOutValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UpdateStockOutFormData = z.infer<typeof updateStockOutValidator>;

export default function EditRack() {
    const params = useParams();
    const id = Number(params.id);

    const { data: stockOut, isLoading } = useFetchById<StockOut>(StockOutService.getById, id, "stockOut");
    const { mutate: updateMutation, isPending } = useUpdateData(
        StockOutService.update,
        id,
        "stockOuts",
        "/stock-outs"
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UpdateStockOutFormData>({
        resolver: zodResolver(updateStockOutValidator),
        mode: "onChange",
    });

    useEffect(() => {
        if (stockOut) {
            reset({
                quantity: stockOut.quantity
            });
        }
    }, [stockOut, reset]);

    const onSubmit = (data: UpdateStockOutFormData) => {
        updateMutation(data as StockOut);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Stock Out', href: '/stock-outs' },
                    { label: 'Edit' }
                ]}
            />
            <div className="space-y-6">
                <ComponentCard title="Edit Stock Out">
                    <form onSubmit={handleSubmit(onSubmit)} className="">
                        <div className="grid grid-cols-2 gap-3">
                            <InputLabel
                                label="Date"
                                name="date"
                                type="text"
                                disabled
                                required
                                defaultValue={dateFormat(stockOut?.created_at || '')}
                            />
                            <InputLabel
                                name="operator"
                                label="Operator"
                                type="text"
                                required
                                disabled
                                defaultValue={stockOut?.operator?.name || ""}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputLabel
                                label="Kanban Code"
                                name="code"
                                type="text"
                                disabled
                                defaultValue={stockOut?.kanban.code || ""}
                            />
                            <InputLabel
                                name="uom"
                                label="Uom"
                                type="text"
                                required
                                disabled
                                placeholder="Enter uom"
                                defaultValue={stockOut?.kanban.uom || ""}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextAreaLabel
                                label="Description"
                                name="description"
                                required
                                disabled
                                placeholder="Enter Description"
                                defaultValue={stockOut?.kanban?.description || ""}
                                rows={3}
                                register
                            />
                            <TextAreaLabel
                                label="Specification"
                                name="specification"
                                required
                                disabled
                                placeholder="Enter specification"
                                register
                                defaultValue={stockOut?.kanban?.specification || ""}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputLabel
                                label="Machine"
                                name="machine"
                                type="text"
                                disabled
                                defaultValue={stockOut?.machine?.code || ""}
                            />
                            <InputLabel
                                name="area"
                                label="Area"
                                type="text"
                                required
                                disabled
                                defaultValue={stockOut?.machine_area.name || ""}
                            />
                        </div>

                        <InputLabel
                            label="Quantity"
                            name="quantity"
                            type="text"

                            placeholder="Enter quantity"
                            register={register("quantity", { valueAsNumber: true })}
                            error={errors.quantity}
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
                                disabled={isPending || isLoading}
                                loading={isPending}
                            >
                                Update Stock Out
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

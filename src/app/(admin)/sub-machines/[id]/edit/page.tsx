"use client"
import Breadcrumb from '@/components/common/Breadcrumb'
import ComponentCard from '@/components/common/ComponentCard'
import InputLabel from '@/components/form/FormInput';
import Button from '@/components/ui/button/Button';
import { useFetchById } from '@/hooks/useFetchDetailData';
import { useUpdateData } from '@/hooks/useUpdateData';
import SubMachineService from '@/services/SubMachineService';
import { SubMachine } from '@/types/subMachine';
import { updateMachineValidator } from '@/validators/machineValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UpdateMachineFormData = z.infer<typeof updateMachineValidator>;

export default function Page() {
    const params = useParams();
    const id = Number(params.id);

    const { data: subMachine, isLoading } = useFetchById<SubMachine>(SubMachineService.getById, id, "subMachine");
    const { mutate: updateMutation, isPending } = useUpdateData(
        SubMachineService.update,
        id,
        "machines",
        `/sub-machines?machineId=${subMachine?.machine.id}`
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UpdateMachineFormData>({
        resolver: zodResolver(updateMachineValidator),
        mode: "onChange",
    });

    useEffect(() => {
        if (subMachine) {
            reset({
                code: subMachine.code
            });
        }
    }, [subMachine, reset]);

    const onSubmit = (data: UpdateMachineFormData) => {
        const formData = {
            ...data,
            machine_id: subMachine?.machine.id
        }
        updateMutation(formData);
    };

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Machines', href: '/machines' },
                    { label: 'Sub Machines', href: `/sub-machines?machineId=${subMachine?.machine.id}` },
                    { label: 'Edit' }
                ]}
            />
            <div className="space-y-6">
                <ComponentCard title="Edit Sub machine">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputLabel
                            label="Code"
                            name="code"
                            type="text"
                            required
                            placeholder="Enter sub machine code"
                            register={register("code")}
                            error={errors.code}
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
                                Update Sub Machine
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

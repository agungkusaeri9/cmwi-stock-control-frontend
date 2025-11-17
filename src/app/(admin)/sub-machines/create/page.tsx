"use client"
import Breadcrumb from '@/components/common/Breadcrumb'
import ComponentCard from '@/components/common/ComponentCard'
import InputLabel from '@/components/form/FormInput';
import Button from '@/components/ui/button/Button';
import { useCreateData } from '@/hooks/useCreateData';
import { useFetchById } from '@/hooks/useFetchDetailData';
import MachineService from '@/services/MachineService';
import SubMachineService from '@/services/SubMachineService';
import { createSubMachineValidator } from '@/validators/subMachineValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateSubMachineFormData = z.infer<typeof createSubMachineValidator>;

export default function CreateArea() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const machineId = Number(searchParams.get("machineId"));
    const { data: machine, isLoading: isMachineLoading } = useFetchById(
        MachineService.getById,
        machineId,
        "machine"
    );

    useEffect(() => {

        if (!machineId || Number.isNaN(machineId)) {
            router.push("/machines");
        }
        if (!isMachineLoading && !machine) {
            router.push("/machines");
        }
    }, [machineId, machine, isMachineLoading, router]);

    const { mutate: createMutation, isPending } = useCreateData(
        SubMachineService.create,
        ["subMachines"],
        `/sub-machines?machineId=${machineId}`
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateSubMachineFormData>({
        resolver: zodResolver(createSubMachineValidator),
        mode: "onChange",
    });

    const onSubmit = (data: CreateSubMachineFormData) => {
        const formData = {
            ...data,
            machine_id: machineId
        }
        createMutation(formData, {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Machines', href: '/machines' },
                    { label: 'Sub Machines', href: `/sub-machines?machineId=${machineId}` },
                    { label: 'Create' }
                ]}
            />
            <div className="space-y-6">
                <ComponentCard title="Create Sub Machine">
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
                                disabled={isPending}
                                loading={isPending}
                            >
                                Create Sub Machine
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import Breadcrumb from "@/components/common/Breadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Loading from "@/components/common/Loading";
import InputLabel from "@/components/form/FormInput";
import FormSelect2 from "@/components/form/FormSelect2";

import { useFetchById } from "@/hooks/useFetchDetailData";
import { useFetchData } from "@/hooks/useFetchData";
import { useCreateData } from "@/hooks/useCreateData";

import KanbanService from "@/services/KanbanService";
import KanbanStagingService from "@/services/KanbanStagingService";

import { createKanbanStagingValidator } from "@/validators/kanbanStagingValidator";
import { z } from "zod";

import { Kanban } from "@/types/kanban";
import { KanbanStaging } from "@/types/kanbanStaging";
import Button from "@/components/ui/button/Button";
import { confirm } from "@/utils/confirm";

type formData = z.infer<typeof createKanbanStagingValidator>;

export default function Page() {
    const [kanbanId, setKanbanId] = useState<number>(0);
    const params = useParams();
    const id = Number(params.id);

    // Semua hooks dijalankan dulu (urutan stabil)
    const { data: kanbanParent, isLoading: isParentLoading } =
        useFetchById<KanbanStaging>(
            KanbanStagingService.getById,
            id,
            "kanbanParent"
        );

    const { data: kanbans, isLoading: isKanbanLoading } = useFetchData(
        KanbanService.getWithoutPagination,
        "kanbans",
        false
    );

    const { mutate: createMutation, isPending } = useCreateData(
        KanbanStagingService.assign,
        ["kanbanStagings", "uncompleted-kanbans-count", "kanban-staging-count"],
        "/kanban-stagings"
    );

    const { data: kanbanDetail, isFetching: isDetailLoading } = useQuery({
        queryKey: ["kanbanDetail", kanbanId],
        queryFn: async () => {
            const response = await KanbanService.getById(kanbanId);
            return response.data;
        },
        enabled: kanbanId !== 0,
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>({
        resolver: zodResolver(createKanbanStagingValidator),
    });

    const onSubmit = async () => {
        const ok = await confirm(
            "Are you sure?",
            "This action cannot be undone.",
            "Yes, Assign!"
        );

        if (!ok) return;

        const payload = {
            kanban_stagging_id: id,
            parent_kanban_code: kanbanDetail?.code,
        };

        createMutation(payload);
    };


    const handleChangeKanban = (value: number) => {
        setKanbanId(value);
    };

    if (isParentLoading || isKanbanLoading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Kanban Staging", href: "/kanban-stagings" },
                    { label: "Assign Parent" },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-[28%_71%] gap-4">
                {/* LEFT SIDE */}
                <ComponentCard title="Form Assign Parent" className="w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputLabel
                            label="Kanban Code"
                            name="kanban_code"
                            type="text"
                            disabled
                            required
                            defaultValue={kanbanParent?.kanban_code || ""}
                        />
                        <InputLabel
                            label="Kanban Description"
                            name="kanban_description"
                            type="text"
                            disabled
                            required
                            defaultValue={kanbanParent?.description || ""}
                        />

                        {kanbans && (
                            <FormSelect2
                                label="Assign to Kanban"
                                name="kanban_id"
                                control={control}
                                error={errors.kanban_id?.message}
                                options={kanbans.map((d: Kanban) => ({
                                    label: `${d.code} - ${d.description || ""}`,
                                    value: d.id,
                                }))}
                                onChange={(val: { label: string; value: number }) => handleChangeKanban(val?.value)}
                                placeholder="Select Kanban"
                            />
                        )}

                        <input type="hidden" name="parent_kanban_code" defaultValue={kanbanDetail?.code || ""} />
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="px-4"
                            // onClick={() => reset()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                variant="primary"
                                className="px-4"
                                disabled={isPending}
                                loading={isPending}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </ComponentCard>

                <ComponentCard title="Kanban Detail" className="w-full">
                    {isDetailLoading ? (
                        <Loading />
                    ) : kanbanDetail ? (
                        <>
                            {/* Basic Info */}
                            <div className="space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.code || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uom</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.uom || '-'}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.description || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Specification</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.specification || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Info */}
                            <div className="space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Min Quantity</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.min_quantity || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Quantity</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.max_quantity || '-'}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.balance || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Safety Stock</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.safety_stock || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Point</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.order_point || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Time</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.lead_time || '-'}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.price || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Currency</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.currency || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.rank || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maker</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.maker?.name || '-'}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Machine</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.machine?.code || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rack</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.rack?.code || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Machine Area</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.machine_area?.name || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-b py-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">JS Ending Quantity</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{kanbanDetail?.js_ending_quantity || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </>

                    ) : (
                        <p className="text-gray-500">Select a Kanban to view details.</p>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}

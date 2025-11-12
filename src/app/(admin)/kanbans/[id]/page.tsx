"use client"
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useParams } from "next/navigation";
import { useFetchById } from "@/hooks/useFetchDetailData";
import Breadcrumb from "@/components/common/Breadcrumb";
import DataTable from "@/components/common/DataTable";
import { Kanban } from "@/types/kanban";
import KanbanService from "@/services/KanbanService";
import { Supplier } from "@/types/supplier";
import Loading from "@/components/common/Loading";
import { SameKanbanParents } from "@/types/sameKanbanParents";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const { data: kanban } = useFetchById<Kanban>(KanbanService.getById, Number(id), "kanban");
    if (!kanban) return (
        <Loading />
    );
    const columns = [
        // {
        //     header: "No.",
        //     accessorKey: "id",
        //     cell: (item: Supplier) => {
        //         const suppliers = Array.isArray(kanban?.supplier) ? kanban.supplier : [kanban?.supplier];
        //         const index = suppliers.findIndex((supplier: Supplier) => supplier.id === item.id) ?? 0;
        //         return index + 1;
        //     },
        // },
        {
            header: "Supplier Name",
            accessorKey: "same_kanban_parents",
            cell: (item: Supplier) => {
                return <div>{item?.name || '-'}</div>
            },
        }
    ];


    const columnsSameParent = [
        {
            header: "Kanban Code",
            accessorKey: "same_kanban_parents.code",
            cell: (item: SameKanbanParents) => {
                return <div>{item.code || '-'}</div>
            },
        },
        {
            header: "Kanban Description",
            accessorKey: "same_kanban_parents.description",
            cell: (item: SameKanbanParents) => {
                return <div>{item.description || '-'}</div>
            },
        },
        {
            header: "Kanban Specification",
            accessorKey: "same_kanban_parents.specification",
            cell: (item: SameKanbanParents) => {
                return <div>{item.specification || '-'}</div>
            },
        }
    ];


    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Kanban', href: '/kanbans' },
                    { label: 'Detail' }
                ]}
            />

            <div className="grid gap-6">
                <ComponentCard title="Kanban Detail" className="w-full">
                    {/* Basic Information */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Code
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.code || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Uom
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.uom || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Description
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.description || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Specification
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.specification || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Information */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Min Quantity
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.min_quantity || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Max Quantity
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.max_quantity || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Balance
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.balance}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Safety Stock
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.safety_stock || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Order Point
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.order_point || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Lead Time
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.lead_time || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Price
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.price || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Currency
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.currency || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Rank
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.rank || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Maker
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.maker?.name || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Machine
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.machine?.code || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Rack
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.rack?.code || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Machine Area
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.machine_area?.name || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    JS Ending Quantity
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {kanban?.js_ending_quantity}
                                </div>
                            </div>
                        </div>
                    </div>
                </ComponentCard>


                <div className="grid grid-cols-2 gap-4 items-start">

                    <DataTable
                        title="Same Parent Information "
                        columns={columnsSameParent}
                        data={kanban.same_kanban_parents ? (Array.isArray(kanban.same_kanban_parents) ? kanban.same_kanban_parents : [kanban.same_kanban_parents]) : []}
                    />
                    <DataTable
                        title="Supplier Information "
                        columns={columns}
                        data={kanban.supplier ? (Array.isArray(kanban.supplier) ? kanban.supplier : [kanban.supplier]) : []}
                    />
                </div>
            </div>
        </div>
    );
}

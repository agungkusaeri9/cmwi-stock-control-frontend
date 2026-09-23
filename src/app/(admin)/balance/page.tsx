"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import KanbanService from "@/services/KanbanService";
import { Kanban } from "@/types/kanban";
import DataTable from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import FilterBalance from "@/components/pages/balance/FilterBalance";
import { useFetchDataBalance } from "@/hooks/useFetchDataBalance";
import ExportBalance from "@/components/pages/balance/exportBalance";

function BalanceList() {
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState({
        machine_id: searchParams.get("machine_id") ? Number(searchParams.get("machine_id")) : null,
        machine_area_id: searchParams.get("machine_area_id") ? Number(searchParams.get("machine_area_id")) : null,
        rack_id: searchParams.get("rack_id") ? Number(searchParams.get("rack_id")) : null,
        keyword: searchParams.get("keyword") || "",
        status: searchParams.get("status") || null,
        js_balance_status: searchParams.get("js_balance_status") || "",
        processed_status: searchParams.get("processed_status") || null
    });

    useEffect(() => {
        const paramMachineId = searchParams.get("machine_id") ? Number(searchParams.get("machine_id")) : null;
        const paramMachineAreaId = searchParams.get("machine_area_id") ? Number(searchParams.get("machine_area_id")) : null;
        const paramRackId = searchParams.get("rack_id") ? Number(searchParams.get("rack_id")) : null;
        const paramKeyword = searchParams.get("keyword") || "";
        const paramStatus = searchParams.get("status") || null;
        const paramJsBalanceStatus = searchParams.get("js_balance_status") || "";
        const paramProcessedStatus = searchParams.get("processed_status") || null;

        setFilter((prev) => {
            if (
                prev.machine_id === paramMachineId &&
                prev.machine_area_id === paramMachineAreaId &&
                prev.rack_id === paramRackId &&
                prev.keyword === paramKeyword &&
                prev.status === paramStatus &&
                prev.js_balance_status === paramJsBalanceStatus &&
                prev.processed_status === paramProcessedStatus
            ) {
                return prev;
            }
            return {
                machine_id: paramMachineId,
                machine_area_id: paramMachineAreaId,
                rack_id: paramRackId,
                keyword: paramKeyword,
                status: paramStatus,
                js_balance_status: paramJsBalanceStatus,
                processed_status: paramProcessedStatus,
            };
        });
    }, [searchParams]);
    const {
        data: kanbans,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataBalance(KanbanService.get, "kanbans", true, filter);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Overstock":
                return {
                    text: "text-red-700",
                    bg: "bg-red-100",
                    darkText: "dark:text-red-400",
                    darkBg: "dark:bg-red-800/20",
                };
            case "Understock":
                return {
                    text: "text-yellow-700",
                    bg: "bg-yellow-100",
                    darkText: "dark:text-yellow-400",
                    darkBg: "dark:bg-yellow-800/20",
                };
            case "Normal":
                return {
                    text: "text-green-700",
                    bg: "bg-green-100",
                    darkText: "dark:text-green-400",
                    darkBg: "dark:bg-green-800/20",
                };
            default:
                return {
                    text: "text-slate-600",
                    bg: "bg-slate-100",
                    darkText: "dark:text-slate-300",
                    darkBg: "dark:bg-slate-800/20",
                };
        }
    };

    const renderStatus = (status: string) => {
        const { text, bg, darkText, darkBg } = getStatusStyle(status);

        return (
            <div className={`${text} text-xs text-center w-full ${bg} rounded-md px-2 py-1 ${darkBg} ${darkText} capitalize`}>
                {status || "Uncompleted"}
            </div>
        );
    };


    const columns = [
        // {
        //     header: "#",
        //     accessorKey: "id",
        //     cell: (item: Kanban) => {
        //         const index = kanbans?.findIndex((kanban: Kanban) => kanban.id === item.id) ?? 0;
        //         return index + 1;
        //     },
        // },
        {
            header: "Code",
            accessorKey: "code",
            isNoWrap: true
        },
        {
            header: "Rack",
            accessorKey: "rack_code",
            isNoWrap: true,
            cell: (item: Kanban) => item.rack?.code || '-'
        },
        {
            header: "Description",
            accessorKey: "description",
        },
        {
            header: "Specification",
            accessorKey: "specification",
        },
        {
            header: "Area",
            accessorKey: "machine_area",
            cell: (item: Kanban) => item.machine_area?.name || '-'
        },
        {
            header: "Machine",
            accessorKey: "machine",
            cell: (item: Kanban) => item.machine?.code || '-'
        },

        {
            header: "Min.",
            accessorKey: "min_quantity",
        },
        {
            header: "Max.",
            accessorKey: "max_quantity",
        },
        {
            header: "Ordered Stock",
            accessorKey: "incoming_order_stock",
        },
        {
            header: "Stock In Qty.",
            accessorKey: "stock_in_quantity",
        },
        {
            header: "Total Stock Out Qty.",
            accessorKey: "total_stock_out_quantity",
        },
        {
            header: "Balance",
            accessorKey: "balance",
        },
        {
            header: "JS Ending Qty",
            accessorKey: "balance",
            cell: (item: Kanban) => {
                const balance = Number(item.balance);
                const js_ending_quantity = Number(item.js_ending_quantity);
                if (balance !== js_ending_quantity) {
                    return <div className="text-red-700 text-xs text-center w-full bg-red-100 rounded-md px-2 py-1 dark:bg-red-800/20 dark:text-red-400">{js_ending_quantity}</div>;
                } else {
                    return <div className="text-xs text-center w-full rounded-md px-2 py-1 dark:bg-green-800/20 dark:text-green-400">{js_ending_quantity}</div>;
                }
            }
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (item: Kanban) => {
                const status = item.stock_status || "Uncompleted";
                return renderStatus(status);
            }
        }
    ];

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Balance', href: '/balance' }
            ]} />
            <div className="space-y-6">
                <DataTable

                    title="Balance"
                    columns={columns}
                    data={kanbans || []}
                    headerRight={
                        <>
                            <FilterBalance filter={filter} setFilter={setFilter} />
                            <ExportBalance filter={filter} />
                        </>
                    }
                    isLoading={isLoading}
                    pagination={{
                        currentPage: pagination?.curr_page || 1,
                        totalPages: pagination?.total_page || 1,
                        totalItems: pagination?.total || 0,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit,
                    }}
                    search={{
                        value: filter.keyword,
                        onChange: (value) => setFilter({ ...filter, keyword: value }),
                        placeholder: 'Search keyword...'
                    }}

                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <BalanceList />
        </Suspense>
    );
}

"use client"
import React, { Suspense, useState } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import StockOutService from "@/services/StockOutService";
import Breadcrumb from "@/components/common/Breadcrumb";
import { StockOut } from "@/types/stockOut";
import FilterStockOut from "@/components/pages/stock-out/FilterStockOut";
import { useFetchDataStockOut } from "@/hooks/useFetchDataStockOut";
import Loading from "@/components/common/Loading";
import ExportStockOut from "@/components/pages/stock-out/ExportStockOut";

function StockOutList() {
    const [filter, setFilter] = useState({
        start_date: '',
        end_date: '',
        code: '',
        machine_id: null as number | null,
        machine_area_id: null as number | null,
        keyword: '',
        sub_machine_id: null as number | null
    });
    const {
        data: stockOut,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataStockOut(StockOutService.get, "stockOut", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'po_date',
            cell: (item: StockOut) => dateFormat(item.created_at),
            isNoWrap: true
        },
        {
            isNoWrap: true,
            header: "Code",
            accessorKey: "kanban_code"
        },
        {
            isNoWrap: true,
            header: "Rack",
            accessorKey: "rack",
            cell: (item: StockOut) => item.kanban?.rack?.code
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (item: StockOut) => item.kanban?.description
        },
        {
            header: "Specification",
            accessorKey: "specification",
            cell: (item: StockOut) => item.kanban?.specification
        },
        {
            header: "Area",
            accessorKey: "machine_area",
            cell: (item: StockOut) => item.machine_area?.name
        },
        {
            header: "Machine",
            accessorKey: "machine.code",
            cell: (item: StockOut) => item.sub_machine ? item.sub_machine.code : item.machine?.code
        },

        {
            header: "Quantity",
            accessorKey: "quantity"
        },
        {
            header: "Requester",
            accessorKey: "requester",
            cell: (item: StockOut) => item.requester?.name || '-'
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: StockOut) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/stock-outs/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <ButtonLink
                        href={`/stock-outs/${item.id}`}
                        variant='secondary'
                        size='xs'
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Show
                    </ButtonLink>
                </div>

            )
        }
    ];

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Stock Out' }
                ]}
            />
            <div className="space-y-6">
                {/* <FilterStockOutOld filter={filter} setFilter={setFilter} /> */}
                <DataTable
                    title="Stock Out History"
                    headerRight={

                        <>
                            <FilterStockOut filter={filter} setFilter={setFilter} />
                            <ExportStockOut filter={filter} />
                        </>
                    }
                    columns={columns}
                    data={stockOut || []}
                    isLoading={isLoading}
                    pagination={pagination ? {
                        currentPage: pagination.curr_page,
                        totalPages: pagination.total_page,
                        totalItems: pagination.total,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit
                    } : undefined}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <StockOutList />
        </Suspense>
    );
}

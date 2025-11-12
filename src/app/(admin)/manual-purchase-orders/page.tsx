"use client"
import React, { Suspense, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import { PurchaseOrder } from "@/types/purchaseOrder";
import Loading from "@/components/common/Loading";
import FilterPurchaseOrderManual from "@/components/pages/purchase-orders-manual/FilterPoNumberManual";
import ManualPurchaseOrderService from "@/services/ManualPurchaseOrderService";
import { ManualPurchaseOrder } from "@/types/manualPurchaseOrder";
import { useFetchDataManualPurchaseOrder } from "@/hooks/useFetchDataManualPO";

function PoList() {
    const [filter, setFilter] = useState({
        pr_number: '',
        po_number: '',
        start_date: '',
        end_date: '',
        kanban: ''
    });

    const {
        data: manualPurchaseOrders,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataManualPurchaseOrder(ManualPurchaseOrderService.get, "manualPurchaseOrders", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'po_date',
            cell: (item: ManualPurchaseOrder) => dateFormat(item.date, "DD-MM-YYYY")
        },
        {
            header: 'PO. Number',
            accessorKey: 'po_number'
        },
        {
            header: 'PR. Number',
            accessorKey: 'pr_number'
        },
        {
            header: 'Kanban Code',
            accessorKey: 'kanban_code'
        },
        {
            header: 'Kanban Desc',
            accessorKey: 'kanban_description'
        },
        {
            header: 'Kanban Spec',
            accessorKey: 'kanban_specification'
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity'
        },
        {
            header: 'Remark',
            accessorKey: 'remark'
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: PurchaseOrder) => (
                <ButtonLink
                    href={`/manual-purchase-orders/${item.id}`}
                    variant='secondary'
                    size='xs'
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Show
                </ButtonLink>
            )
        }
    ];

    return (
        <div>
            <PageBreadcrumb pageTitle="Manual Purchase Order" />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/manual-purchase-orders/create">Create Manual PO</ButtonLink>
                </div>
                <DataTable
                    title="Manual Purchase Order History"
                    columns={columns}
                    headerRight={<FilterPurchaseOrderManual filter={filter} setFilter={setFilter} />}
                    data={manualPurchaseOrders || []}
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
            <PoList />
        </Suspense>
    );
}

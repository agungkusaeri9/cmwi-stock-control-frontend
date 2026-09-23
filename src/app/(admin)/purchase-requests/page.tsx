"use client"
import React, { Suspense, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseRequestService from "@/services/PurchaseRequestService";
import ButtonLink from "@/components/ui/button/ButtonLink";
import FilterPurchaseRequest from "@/components/pages/purchase-request/Filter";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import { PurchaseRequest } from "@/types/purchaseRequest";
import { useFetchDataPR } from "@/hooks/useFetchDataPR";
import Loading from "@/components/common/Loading";

function ListPr() {
    const [filter, setFilter] = useState({
        start_date: '',
        end_date: '',
        keyword: ''
    });


    const {
        data: purchaseRequests,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataPR(PurchaseRequestService.get, "purchaseRequests", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'date',
            cell: (item: PurchaseRequest) => dateFormat(item.date)
        },
        {
            header: 'PR. Number',
            accessorKey: 'pr_number'
        },
        {
            header: 'Budget Number',
            accessorKey: 'budget_number'
        },
        {
            header: 'Department',
            accessorKey: 'department'
        },
        {
            header: 'Requested',
            accessorKey: 'requested'
        },
        {
            header: 'Gen. Manager',
            accessorKey: 'gen_manager'
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: PurchaseRequest) => (
                <ButtonLink
                    href={`/purchase-requests/${item.id}`}
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
            <PageBreadcrumb pageTitle="Purchase Requests" />
            <div className="space-y-6">
                <DataTable
                    title="Purchase Request History"
                    columns={columns}
                    headerRight={<FilterPurchaseRequest filter={filter} setFilter={setFilter} />}
                    data={purchaseRequests || []}
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
            <ListPr />
        </Suspense>
    );
}

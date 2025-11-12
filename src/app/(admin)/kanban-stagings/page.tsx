"use client";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { Kanban } from "@/types/kanban";
import DataTable from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import KanbanStagingService from "@/services/KanbanStagingService";
import { useFetchData } from "@/hooks/useFetchData";

function KanbanStagingList() {
    const {
        data: kanbanStagings,
        isLoading,
        setCurrentPage,
        setLimit,
        setKeyword,
        limit,
        keyword,
        pagination
    } = useFetchData(KanbanStagingService.get, "kanbanStagings", true);

    const columns = [
        {
            header: "Code",
            accessorKey: "kanban_code",
            isNoWrap: true
        },
        {
            header: "Description",
            accessorKey: "description",
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Kanban) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/kanban-stagings/${item.id}/assign-parent`}
                        variant='secondary'
                        size='xs'
                    >
                        Assign Parent
                    </ButtonLink>
                    <ButtonLink
                        href={`/kanban-stagings/${item.id}/promote`}
                        variant='info'
                        size='xs'
                    >
                        Promote to Master
                    </ButtonLink>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Kanbans Staging', href: '/kanban-stagings' }
            ]} />
            <div className="space-y-6">
                <DataTable
                    title="Kanban Staging List"
                    columns={columns}
                    data={kanbanStagings || []}
                    // headerRight={<FilterKanban filter={filter} setFilter={setFilter} />}
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
                        value: keyword,
                        onChange: setKeyword,
                        placeholder: "Search machines...",
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <KanbanStagingList />
        </Suspense>
    );
}

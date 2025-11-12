"use client";
import React, { Suspense, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import KanbanService from "@/services/KanbanService";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { Kanban } from "@/types/kanban";
import DataTable from "@/components/common/DataTable";
import FilterKanban from "@/components/pages/kanban/Filter";
import { useFetchDataKanban } from "@/hooks/useFetchDataKanban";
import Loading from "@/components/common/Loading";
import KanbanExportExcel from "@/components/pages/kanban/KanbanExportExcel";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";

function KanbanList() {
    const [filter, setFilter] = useState({
        machine_id: null as number | null,
        machine_area_id: null as number | null,
        rack_id: null as number | null,
        keyword: "",
        status: null as string | null,
        completed_status: null as string | null
    });
    const { mutate: remove } = useDeleteData(KanbanService.remove, ["kanbans"]);
    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            remove(id);
        }
    };

    const {
        data: kanbans,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataKanban(KanbanService.get, "kanbans", true, filter);

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
            accessorKey: "rack",
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
            header: "Max Qty",
            accessorKey: "max_quantity",
        },
        {
            header: "Min Qty",
            accessorKey: "min_quantity",
        },
        {
            header: "Is Completed",
            accessorKey: "is_completed",
            cell: (item: Kanban) => {
                if (item.is_completed == false)
                    return <div className="text-red-700 text-xs text-center w-full bg-red-100 rounded-md px-2 py-1 dark:bg-red-800/20 dark:text-red-400">Uncompleted</div>
                else
                    return <div className="text-green-700 text-xs text-center w-full bg-green-100 rounded-md px-2 py-1 dark:bg-green-800/20 dark:text-green-400">Completed</div>
            }
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Kanban) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/kanbans/${item.id}`}
                        variant='secondary'
                        size='xs'
                    >
                        Show
                    </ButtonLink>
                    <ButtonLink
                        href={`/kanbans/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(item.id)}
                        variant='danger'
                        size='xs'
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Kanbans', href: '/kanbans' }
            ]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4 gap-2">
                    <KanbanExportExcel />
                    <ButtonLink size='sm' href="/kanbans/create">Create Kanban</ButtonLink>
                </div>
                {/* <FilterKanban
                    filter={filter}
                    setFilter={setFilter}
                /> */}
                <DataTable
                    title="Kanban List"
                    columns={columns}
                    data={kanbans || []}
                    headerRight={<FilterKanban filter={filter} setFilter={setFilter} />}
                    isLoading={isLoading}
                    pagination={{
                        currentPage: pagination?.curr_page || 1,
                        totalPages: pagination?.total_page || 1,
                        totalItems: pagination?.total || 0,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit,
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <KanbanList />
        </Suspense>
    );
}

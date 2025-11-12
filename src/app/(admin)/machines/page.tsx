"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import DataTable from "@/components/common/DataTable";
import MachineService from "@/services/MachineService";
import { Machine } from "@/types/machine";
import Loading from "@/components/common/Loading";

function MachineList() {
    const {
        data: machines,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchData(MachineService.get, "machines");
    const { mutate: remove } = useDeleteData(MachineService.remove, ["machines"]);

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            remove(id);
        }
    };

    const columns = [
        // {
        //     header: "#",
        //     accessorKey: "id",
        //     cell: (item: Machine) => {
        //         const index = machines?.findIndex((machine: Machine) => machine.id === item.id) ?? 0;
        //         return index + 1;
        //     },
        // },
        {
            header: "Code",
            accessorKey: "code",
            isNoWrap: true
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Machine) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/sub-machines?machineId=${item.id}`}
                        variant='secondary'
                        size='xs'
                    >
                        Sub Machine
                    </ButtonLink>
                    <ButtonLink
                        href={`/machines/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(item.id!)}
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
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Machines', href: '/machines' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/machines/create">Create Machine</ButtonLink>
                </div>
                <DataTable
                    title="Machine List"
                    columns={columns}
                    data={machines || []}
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
            <MachineList />
        </Suspense>
    );
}

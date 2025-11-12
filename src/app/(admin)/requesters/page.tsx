"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import DataTable from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import { Group } from "@/types/group";
import toast from "react-hot-toast";
import RequesterService from "@/services/RequesterService";
import { Requester } from "@/types/requester";

function GroupList() {
    const {
        data: requesters,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        isError,
        limit,
        keyword,
        pagination
    } = useFetchData(RequesterService.get, "requesters");
    const { mutate: remove } = useDeleteData(RequesterService.remove, ["requesters"]);

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
        //     cell: (item: Maker) => {
        //        return <div>{item.id}</div>
        //     },
        // },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Group",
            accessorKey: "group",
            cell: (item: Requester) => item.group?.name,
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Group) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/requesters/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(Number(item.id))}
                        variant='danger'
                        size='xs'
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (isError && !isLoading) {
        toast.error("Failed to fetch requesters");
    }

    return (
        <div>
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Requesters', href: '/requesters' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/requesters/create">Create Requester</ButtonLink>
                </div>
                <DataTable
                    title="Requester List"
                    columns={columns}
                    data={requesters || []}
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
                        placeholder: "Search requesters...",
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GroupList />
        </Suspense>
    );
}

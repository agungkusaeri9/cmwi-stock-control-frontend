import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PaginatedResponse } from "@/types/fetch";

type Filter = {
    keyword: string;
}

export type FetchFunctionWithPagination<T> = (
    page?: number,
    limit?: number,
    keyword?: string,
) => Promise<PaginatedResponse<T>>;

export const useFetchDataKanbanStaging = <T>(
    fetchFunction: FetchFunctionWithPagination<T>,
    queryKey: string,
    usePagination: boolean = true,
    filter: Filter
) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(
        usePagination ? Number(searchParams.get("page")) || 1 : 1
    );
    const [limit, setLimit] = useState(
        usePagination ? Number(searchParams.get("limit")) || 10 : 50
    );
    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [completed_status] = useState(searchParams.get("completed_status") || "");
    const [pagination, setPagination] = useState<PaginatedResponse<T>["pagination"] | null>(null);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of the table
        const tableElement = document.querySelector('.overflow-x-auto');
        if (tableElement) {
            tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        if (!usePagination) return;

        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("limit", limit.toString());
        newParams.set("page", currentPage.toString());

        if (filter.keyword) {
            newParams.set("keyword", filter.keyword);
        } else {
            newParams.delete("keyword");
        }

        router.push(`?${newParams.toString()}`, { scroll: false });
    }, [keyword, currentPage, limit, filter, usePagination, router, searchParams]);

    const fetchData = async (): Promise<T[]> => {
        const res = await fetchFunction(
            currentPage,
            limit,
            filter.keyword,
        );
        setPagination(res.pagination);
        return res.data;
    };

    const { data, isLoading, refetch } = useQuery<T[]>({
        queryKey: usePagination
            ? [queryKey, currentPage, limit, filter.keyword]
            : [queryKey],
        queryFn: fetchData,
    });

    return {
        data,
        isLoading,
        pagination,
        currentPage,
        limit,
        keyword,
        completed_status,
        setKeyword,
        setCurrentPage: handlePageChange,
        setLimit,
        refetch,
        fetchData,
    };
};

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { PaginatedResponse } from "@/types/fetch";

type Filter = {
    start_date: string;
    end_date: string;
    keyword: string;
}

export type FetchFunctionWithPagination<T> = (
    page?: number,
    limit?: number,
    keyword?: string,
    start_date?: string,
    end_date?: string,
) => Promise<PaginatedResponse<T>>;

export const useFetchDataPurchaseOrder = <T>(
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
    const debouncedSearch = useDebounce(keyword, 500);
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

        const activeKeyword = filter.keyword || keyword;
        if (activeKeyword) {
            newParams.set("keyword", activeKeyword);
        } else {
            newParams.delete("keyword");
        }

        if (filter.start_date) {
            newParams.set("start_date", filter.start_date);
        } else {
            newParams.delete("start_date");
        }

        if (filter.end_date) {
            newParams.set("end_date", filter.end_date);
        } else {
            newParams.delete("end_date");
        }

        router.push(`?${newParams.toString()}`, { scroll: false });
    }, [keyword, currentPage, limit, filter, usePagination, router, searchParams]);

    const fetchData = async (): Promise<T[]> => {
        const res = await fetchFunction(
            currentPage,
            limit,
            filter.keyword || debouncedSearch,
            filter.start_date,
            filter.end_date
        );
        setPagination(res.pagination);
        return res.data;
    };

    const { data, isLoading, refetch } = useQuery<T[]>({
        queryKey: usePagination
            ? [queryKey, currentPage, limit, debouncedSearch, filter.start_date, filter.end_date, filter.keyword]
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
        setKeyword,
        setCurrentPage: handlePageChange,
        setLimit,
        refetch,
        fetchData,
    };
};

import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {CategoryType} from "@/utils/type";


export const useCategory = (page: number, query: string) => {
    const {data, error}: {
        data: {msg: string, totalPages: number, totalAmount: number, data: CategoryType[]},
        error: boolean|undefined
    } = useSWR(`/api/category?page=${page}&query=${query}`, fetcher);

    return {data, error};
}

export const mutateCategory = (page: number, query: string) => {
    mutate(`/api/category?page=${page}&query=${query}`);
}
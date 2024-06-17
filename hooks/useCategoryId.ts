import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {CategoryType} from "@/utils/type";


export const useCategoryId = () => {
    const {data, error}: {
        data: {msg: string, data: CategoryType[]},
        error: boolean|undefined
    } = useSWR(`/api/category/id`, fetcher);

    return {data, error};
}

export const mutateCategoryId = () => {
    mutate(`/api/category/id`);
}
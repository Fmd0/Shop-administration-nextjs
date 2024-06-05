import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {HomeBannerType} from "@/utils/type";


export const useHomeBanner = (page: number, row: string) => {
    const {data, error}:
        {data: {msg: string, totalPages: number, data: HomeBannerType[]}, error: boolean|undefined}
        = useSWR(`/api/home/banner?page=${page}&row=${row}`, fetcher);

    return {data, error};
}

export const mutateHomeBanner = (page: number, row: string) => {
    mutate(`/api/home/banner?page=${page}&row=${row}`);
}
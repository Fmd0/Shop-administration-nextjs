import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {CommentType} from "@/utils/type";


export const useComment = (page: number, commodityId: string) => {
    const {data, error}: {
        data: {msg: string, totalPages: number, totalAmount: number, data: CommentType[]},
        error: boolean|undefined
    } = useSWR(`/api/comment?page=${page}&commodityId=${commodityId}`, fetcher);

    return {data, error};
}

export const mutateComment = (page: number, commodityId: string) => {
    mutate(`/api/comment?page=${page}&commodityId=${commodityId}`);
}
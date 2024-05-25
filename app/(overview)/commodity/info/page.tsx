'use client'
import { Button } from "@mui/material";
import { useState } from "react";
import CommodityCreateForm from "@/components/(overview)/CommodityCreateForm";
import {ImageInfoItem} from "@/utils/type";


const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>("init");

    // const [imagesLength, setImagesLength] = useState(0);
    const [images, setImages] = useState<ImageInfoItem[]>([]);

    const handleSubmitCreate = async (formData: FormData) => {
        await fetch("/api/commodity", {
            method: "POST",
            body: formData,
        })
    }

    const handleCloseCreate = () => {
        setCreateOpen(false);
        setTimeout(() => {
            setImages([])
        }, 150);
    }

    console.log(images);
    return (
        <>
            <div className="relative p-4 flex justify-between">
                <p>商品列表</p>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>新增</Button>
            </div>

            <CommodityCreateForm
                open={createOpen}
                onClose={handleCloseCreate}
                images={images}
                setImages={setImages}
                handleSubmit={handleSubmitCreate}
                createStatus={createStatus}
            />

        </>
    )
}

export default Page;
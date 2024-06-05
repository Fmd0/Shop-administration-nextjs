'use client'
import {Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import {useRef, useState } from "react";
import CommodityCreateDialog from "@/components/(overview)/commodity/CommodityCreateDialog";
import {CommodityType} from "@/utils/type";
import CommodityTable from "@/components/(overview)/commodity/CommodityTable";
import {mutateCommodity} from "@/hooks/useCommodity";
import CommodityUpdateDialog from "@/components/(overview)/commodity/CommodityUpdateDialog";
import { v4 as uuidV4 } from 'uuid';



const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>("init");

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteInfo, setDeleteInfo] = useState<CommodityType|null>(null);
    const [deleteStatus, setDeleteStatus] = useState("init");

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<CommodityType|null>(null);
    const [updateStatus, setUpdateStatus] = useState("init");
    const [updateImages, setUpdateImages] = useState<{key: string, value: string}[]>([]);
    const updateTimeRef = useRef(0);

    const [failMsg, setFailMsg] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");

    const handleSubmitCreate = async (formData: FormData) => {
        // console.log(formData.getAll("tag"));
        setCreateStatus("pending");
        fetch("/api/commodity", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            handleCloseCreate();
            mutateCommodity(page, query);
            setCreateStatus("success");
            setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        }).catch((err) => {
            console.log(err);
            setFailMsg(JSON.stringify(err));
            setCreateStatus("error");
            setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }

    const handleSubmitDelete = (id: string) => {
        setDeleteStatus("pending")
        fetch(`/api/commodity/${id}`, {
            method: "DELETE",
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            setDeleteOpen(false);
            mutateCommodity(page, query);
            setDeleteStatus("success");
            window.setTimeout(() => {
                setDeleteStatus("init");
            }, 3000);
        }).catch((err) => {
            console.log(err);
            setFailMsg(JSON.stringify(err));
            setDeleteOpen(false);
            setDeleteStatus("error");
            window.setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        console.log(Object.fromEntries(formData));
        setUpdateStatus("pending");
        fetch(`/api/commodity/${updateInfo?.id}`, {
            method: "PUT",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateCommodity(page, query);
            setUpdateStatus("success");
            clearTimeout(updateTimeRef.current);
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        }).catch((err) => {
            console.log(err);
            setFailMsg(JSON.stringify(err));
            setUpdateStatus("error");
            clearTimeout(updateTimeRef.current);
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }

    const handleCloseCreate = () => {
        setCreateOpen(false);
    }

    const handleCloseUpdate = () => {
        setUpdateOpen(false);
        setTimeout(() => {
            setUpdateInfo(null);
        }, 250);
    }

    const handleClickUpdate = (data: CommodityType) => {
        setUpdateInfo(data);
        setUpdateImages(data.images.map(i => ({key: uuidV4(), value: i})));
        setUpdateOpen(true);
    }

    const handleClickDelete = (data: CommodityType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }


    return (
        <>
            <div className="relative flex justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h3>Commodity list</h3>
                    <TextField variant="outlined"
                               label="Commodity name"
                               size="small"
                               value={query}
                               onChange={(e) => {
                                   setQuery(e.target.value);
                                   setPage(1);
                               }}
                    />
                </div>
                <Button variant="contained" onClick={() => {
                    setCreateOpen(true);

                }}>Add</Button>

                <Collapse in={createStatus === "success" || deleteStatus === "success"}
                          className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">操作成功</Alert>
                </Collapse>
                <Collapse in={deleteStatus === "error"}
                          className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="error">操作失败 失败原因：{failMsg}</Alert>
                </Collapse>
            </div>


            {/*商品信息表格*/}
            <CommodityTable
                handleDelete={handleClickDelete}
                handleUpdate={handleClickUpdate}
                page={page}
                setPage={setPage}
                query={query}
            />


            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>
                    删除商品{deleteInfo?.name}
                </DialogTitle>
                <DialogContent>
                    此举会删除商家{deleteInfo?.name}，确定继续
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} disabled={deleteStatus === "pending"}>
                        取消
                    </Button>
                    <Button onClick={() => handleSubmitDelete(deleteInfo?.id || "")}
                            disabled={deleteStatus === "pending"}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>


            <CommodityCreateDialog
                open={createOpen}
                onClose={handleCloseCreate}
                handleSubmit={handleSubmitCreate}
                createStatus={createStatus}
                failMsg={failMsg}
            />

            <CommodityUpdateDialog
                open={updateOpen}
                onClose={handleCloseUpdate}
                handleSubmit={handleSubmitUpdate}
                updateStatus={updateStatus}
                failMsg={failMsg}
                updateInfo={updateInfo}
                images={updateImages}
                setImages={setUpdateImages}
            />


        </>
    )
}

export default Page;
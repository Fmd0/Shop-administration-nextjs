'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import {useRef, useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import {useCommodityId} from "@/hooks/useCommodityId";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {CommentType, SkuConfigType} from "@/utils/type";
import {mutateSkuConfig, useSkuConfig} from "@/hooks/useSkuConfig";
import {mutateComment, useComment} from "@/hooks/useComment";


const Page = () => {

    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [createStatus, setCreateStatus] = useState<string>("init");
    const [createValue, setCreateValue] = useState<string[]>([]);
    const [commodityId, setCommodityId] = useState<string>("");


    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteInfo, setDeleteInfo] = useState<CommentType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>("init");

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<CommentType | null>(null);
    const [updateStatus, setUpdateStatus] = useState("init");
    const [updateValue, setUpdateValue] = useState<{key: string, value: string}[]>([]);
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [tableCommodityId, setTableCommodityId] = useState<string>("");

    const {data:commodityIdData={msg:"", data: []}, error: commodityIdError} = useCommodityId();
    const {data:commentData={msg:"", totalAmount: 1, totalPages: 1, data: []}, error} = useComment(page, tableCommodityId);




    const handleSubmitCreate = async (formData: FormData) => {
        // console.log(Object.fromEntries(formData));
        setCreateStatus("pending");
        fetch("/api/comment", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateComment(page, tableCommodityId);
            setCreateOpen(false)
            setCreateStatus("success");
            setTimeout(() => {
                setCreateStatus("init");
            }, 3000);
        }).catch(error => {
            console.log(error)
            setFailMsg(JSON.stringify(error));
            setCreateStatus("error");
            setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }

    const handleSubmitDelete = async (id: string) => {
        setDeleteStatus("pending");
        fetch(`/api/comment/${id}`, {
            method: "DELETE",
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateComment(page, tableCommodityId);
            setDeleteOpen(false)
            setDeleteStatus("success");
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        }).catch(error => {
            console.log(error)
            setFailMsg(JSON.stringify(error))
            setDeleteStatus("error");
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending");
        fetch(`/api/comment/${formData.get("id")}`, {
            method: "PUT",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateComment(page, tableCommodityId);
            setUpdateStatus("success");
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000);
        }).catch(error => {
            console.log(error)
            setUpdateStatus("error");
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }

    const handleClickUpdate = (data: CommentType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
    }

    const handleClickDelete = (data: CommentType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }

    if(error||commodityIdError) {
        return null;
    }



    return (
        <>
            <div className="relative flex justify-between mb-4">

                {/*filter part*/}
                <div className="flex items-center gap-4">
                    <h3 className="text-lg">Comment Info</h3>
                    <Autocomplete
                        className="w-[200px]"
                        options={commodityIdData.data.map(d => ({
                            label: d?.market?.name + " " + d?.name,
                            value: d?.id
                        }))}
                        getOptionLabel={o => o.label}
                        isOptionEqualToValue={(a, b) => a.label === b.label}
                        size="small"
                        onChange={(_, value) => {
                            setTableCommodityId(value?.value || "");
                            setPage(1);
                        }}
                        renderInput={(params) => <TextField {...params} label="Commodity name"/>}
                    />
                    <p>{commentData.totalAmount} comments</p>
                </div>


                <Button variant="contained" onClick={() => {
                    setCreateOpen(true);
                    setCreateValue([]);
                }}>Add</Button>
                <Collapse in={createStatus === "success" || deleteStatus === "success"}
                          className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">Action success</Alert>
                </Collapse>
                <Collapse in={deleteStatus === "error"}
                          className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="error">Action fail fail reason：{failMsg}</Alert>
                </Collapse>
            </div>


            {/*data table*/}
            <TableContainer component={Paper} className="text-nowrap">
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Commodity
                            </TableCell>

                            <TableCell align="center" className="text-white">
                                rating
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                comment
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                userName
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commentData.data&&commentData.data.map((data) => (
                            <TableRow key={data.id} sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}>

                                <TableCell align="center">
                                    <Button onClick={() => handleClickUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleClickDelete(data)}>Delete</Button>
                                </TableCell>
                                <TableCell align="center">
                                    {data?.market?.name + " " + data.commodity?.name}
                                </TableCell>

                                <TableCell align="center">
                                    {data.rating}
                                </TableCell>
                                <TableCell align="center">
                                    {data.comment.length>20
                                        ?`${data.comment.slice(0,20)}...`
                                        :data.comment
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {data.userName}
                                </TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-end">
                <Pagination count={commentData.totalPages}
                            color="primary"
                            size="medium"
                            className="mt-2"
                            page={page}
                            onChange={(_, value) => {
                                setPage(value)
                            }}
                />
            </div>

            {/*delete dialog*/}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>
                    Delete sku config key {deleteInfo?.comment.slice(0,20)}...
                </DialogTitle>
                <DialogContent>
                    this action will delete sku config key {deleteInfo?.comment.slice(0,20)}..., confirm?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} disabled={deleteStatus === "pending"}>
                        cancel
                    </Button>
                    <Button onClick={() => handleSubmitDelete(deleteInfo?.id || "")}
                            disabled={deleteStatus === "pending"}>
                        confirm
                    </Button>
                </DialogActions>
            </Dialog>


            {/*Add dialog*/}
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="lg">
                <form action={handleSubmitCreate} className="relative">
                    <DialogTitle>Add Sku Config</DialogTitle>
                    <Collapse in={createStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/*commodity id字段*/}
                            <input type="hidden" name="commodityId" defaultValue={commodityId}/>
                            <Autocomplete
                                disablePortal
                                options={commodityIdData.data.map(d => ({
                                    label: d?.market?.name + " " + d?.name,
                                    value: d?.id
                                }))}
                                getOptionLabel={o => o.label}
                                isOptionEqualToValue={(a, b) => a.label === b.label}
                                size="small"
                                onChange={(_, value) => setCommodityId(value?.value || "")}
                                renderInput={(params) => <TextField required {...params} label="Commodity name"/>}
                            />


                            {/*剩余字段*/}
                            <TextField variant="outlined" size="small" name="rating" required label="rating"/>
                            <TextField variant="outlined" size="small" name="comment" required label="comment"/>
                            <TextField variant="outlined" size="small" name="userName" required label="userName"/>

                        </div>
                    </DialogContent>


                    <DialogActions sx={{pr: 4, pb: 4}}>
                        <Button type="submit" variant="contained"
                                disabled={createStatus === "pending"}
                        >Add</Button>
                    </DialogActions>
                </form>
            </Dialog>


            {/*update dialog*/}
            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)} fullWidth maxWidth="lg">
                <form action={handleSubmitUpdate} className="relative">
                    <DialogTitle>Update Sku Config</DialogTitle>
                    <Collapse in={updateStatus === "success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="success">Update success</Alert>
                    </Collapse>
                    <Collapse in={updateStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Update fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/* id字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       defaultValue={updateInfo?.market?.name + " " + updateInfo?.commodity?.name}
                                       label="commodity"
                                       id="commodity"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <input type="hidden" name="id" defaultValue={updateInfo?.id}/>

                            {/*剩余字段*/}
                            <TextField variant="outlined" size="small" defaultValue={
                                updateInfo?.rating!==undefined&&updateInfo?.rating!==null?updateInfo?.rating: ""
                            } name="rating"
                                       required label="rating"/>
                            <TextField variant="outlined" size="small" defaultValue={updateInfo?.comment || ""}
                                       name="comment" required label="comment"/>
                            <TextField variant="outlined" size="small" defaultValue={updateInfo?.userName || ""}
                                       name="userName" required label="userName"/>

                        </div>
                    </DialogContent>


                    <DialogActions sx={{pr: 4, pb: 4}}>
                        <Button type="submit" variant="contained"
                                disabled={updateStatus === "pending"}
                        >Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default Page
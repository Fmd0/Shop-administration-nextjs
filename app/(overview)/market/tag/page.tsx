'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useRef, useState } from "react";
import { MarketTagType} from "@/utils/type";
import {mutateMarketTag, useMarketTag} from "@/hooks/useMarketTag";
import {useMarketId} from "@/hooks/useMarketId";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { v4 as uuidV4 } from 'uuid';



const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>('');
    const [marketId, setMarketId] = useState<string>("");
    const [createTagList, setCreateTagList] = useState<string[]>([]);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<MarketTagType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('');

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<MarketTagType | null>(null);
    const [updateStatus, setUpdateStatus] = useState<string>("init");
    const [updateTagList, setUpdateTagList] = useState<{id: string, value: string}[]>([]);
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>('');


    const {data: marketTagData={msg: "", data: []},
        error: homeShopStartedError} = useMarketTag();
    const {data: marketIdData={msg: "", data: []},
        error: marketIdError} = useMarketId();

    const handleSubmitCreate = async (formData: FormData) => {
        setCreateStatus("pending");
        fetch("/api/market/tag", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            setCreateOpen(false);
            setCreateStatus("success")
        }).catch(error => {
            console.log(error);
            setFailMsg(JSON.stringify(error))
            setCreateStatus("error");
        }).finally(() => {
            mutateMarketTag();
            window.setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }



    const handleSubmitDelete = async (id: string) => {
        setDeleteStatus("pending");
        fetch(`/api/market/tag/${id}`, {
            method: "DELETE",
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            setDeleteStatus("success");
        }).catch(error => {
            console.log(error);
            setFailMsg(JSON.stringify(error))
            setDeleteStatus("error");
        }).finally(() => {
            mutateMarketTag();
            setDeleteOpen(false)
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending");
        fetch(`/api/market/tag/${updateInfo?.id}`, {
            method: "PUT",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            setUpdateStatus("success");
        }).catch(error => {
            console.log(error);
            setFailMsg(JSON.stringify(error))
            setUpdateStatus("error");
        }).finally(() => {
            mutateMarketTag();
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }


    const handleClickUpdate = (data: MarketTagType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
        setUpdateTagList(data.tags.map(t => ({id: uuidV4(), value: t})))
    }

    const handleClickDelete = (data: MarketTagType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }

    if(homeShopStartedError|| marketIdError) {
        return null;
    }


    return (
        <>
            <div className="relative flex justify-between mb-4">
                <h3 className="text-lg">Market tag</h3>
                <Button variant="contained" onClick={() => {setCreateOpen(true)}}>
                    Add
                </Button>
                <Collapse in={createStatus==="success" || deleteStatus==="success" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">Action success</Alert>
                </Collapse>
                <Collapse in={deleteStatus==="error" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="error">Action fail fail reason：{failMsg}</Alert>
                </Collapse>
            </div>


            {/*data table*/}
            <TableContainer component={Paper} sx={{
                maxHeight: 650
            }}>
                <Table className="text-nowrap">
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Name
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Tag
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {marketTagData.data.map((data) => (
                            <TableRow key={data.id}
                                      sx={{'&:nth-of-type(odd)': {backgroundColor: "rgba(0, 0, 0, 0.04)"}}}>

                                <TableCell align="center">
                                    <Button onClick={() => handleClickUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleClickDelete(data)}>Delete</Button>
                                </TableCell>
                                <TableCell align="center" >
                                    {data.market.name}
                                </TableCell>
                                <TableCell align="center" >
                                    {JSON.stringify(data.tags).length>20
                                        ?`${JSON.stringify(data.tags).slice(0,20)}...`
                                        :JSON.stringify(data.tags)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*delete dialog*/}
            <Dialog open={deleteOpen} onClose={()=>setDeleteOpen(false)}>
                <DialogTitle>
                    Delete market tag of {JSON.stringify(deleteInfo?.market.name)}
                </DialogTitle>
                <DialogContent>
                    this action will delete market tag of {JSON.stringify(deleteInfo?.market.name)}, confirm?
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setDeleteOpen(false)} disabled={deleteStatus === "pending"}>
                        cancel
                    </Button>
                    <Button onClick={()=>handleSubmitDelete(deleteInfo?.id||"")} disabled={deleteStatus === "pending"}>
                        confirm
                    </Button>
                </DialogActions>
            </Dialog>


            {/*Add dialog*/}
            <Dialog open={createOpen} onClose={() => {setCreateOpen(false);}} fullWidth maxWidth="lg" >
                <form action={handleSubmitCreate} className="relative">

                    <DialogTitle>Add Market Tag</DialogTitle>
                    <Collapse in={createStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4 items-center">
                            {/*文字字段*/}
                            <input type="hidden" name="marketId" defaultValue={marketId}/>
                            <Autocomplete
                                disablePortal
                                options={marketIdData.data.map(d => ({label: d.name, id: d.id}))}
                                getOptionLabel={o => o.label}
                                isOptionEqualToValue={(a, b) => a.label === b.label}
                                size="small"
                                onChange={(_, value) => {
                                    setMarketId(value?.id || "");
                                }}
                                renderInput={(params) => <TextField required {...params} label="Market name"/>}
                            />

                        </div>
                    </DialogContent>

                    <DialogTitle>Market Tag</DialogTitle>
                    <DialogContent>
                    <div className="grid grid-cols-3 items-center gap-8 p-4">
                        {
                            createTagList.map((value) => (
                                <div key={value} className="relative">
                                    <TextField variant="outlined" className="w-[calc(100%-12px)]" size="small"
                                               name="tag" label="value"/>
                                    <CancelOutlinedIcon
                                        className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2"
                                        color="action"
                                        onClick={() => setCreateTagList(createTagList.filter(i => i !== value))}
                                    />
                                </div>
                            ))
                        }
                        <Button size="large" variant="contained"
                                onClick={() => setCreateTagList([...createTagList, uuidV4()])}
                        >
                            Add value
                        </Button>
                    </div>
                    </DialogContent>

                    <DialogActions sx={{pr: 4, pb: 4}}>
                        <Button type="submit" variant="contained" disabled={createStatus === "pending"}>
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>


            {/*/!*update dialog*!/*/}
            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)} fullWidth maxWidth="lg">
                <form action={handleSubmitUpdate} className="relative">
                    <DialogTitle>Update Home Banner</DialogTitle>
                    <Collapse in={updateStatus==="success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="success">Update success</Alert>
                    </Collapse>
                    <Collapse in={updateStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Update fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4 items-center">
                            {/*文字字段*/}
                            <TextField variant="outlined"
                                       defaultValue={updateInfo?.market.name}
                                       label="Market name"
                                       inputProps={{
                                           readOnly: true,
                                       }}
                            />
                        </div>
                    </DialogContent>

                    <DialogTitle>Market Tag</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                updateTagList.map((u) => (
                                    <div key={u.id} className="relative">
                                        <TextField variant="outlined"
                                                   className="w-[calc(100%-12px)]"
                                                   size="small"
                                                   name="tag"
                                                   label="value"
                                                   defaultValue={u.value}
                                        />
                                        <CancelOutlinedIcon
                                            className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2"
                                            color="action"
                                            onClick={() => setUpdateTagList(updateTagList.filter(item => item.id !== u.id))}
                                        />
                                    </div>
                                ))
                            }
                            <Button size="large" variant="contained"
                                    onClick={() => setUpdateTagList([...updateTagList, {id: uuidV4(), value: ""}])}
                            >
                                Add value
                            </Button>
                        </div>
                    </DialogContent>


                    <DialogActions sx={{pr: 4, pb: 4}}>
                        <Button type="submit" variant="contained" disabled={updateStatus === "pending"}>
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default Page
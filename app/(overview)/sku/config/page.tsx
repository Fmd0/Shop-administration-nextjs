'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import {useRef, useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import {useCommodityId} from "@/hooks/useCommodityId";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {SkuConfigType} from "@/utils/type";
import {mutateSkuConfig, useSkuConfig} from "@/hooks/useSkuConfig";


const skuConfigField: string[] = [
    "key",
    "value",
    "defaultValue"
]

const Page = () => {

    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [createStatus, setCreateStatus] = useState<string>("init");
    const [createValue, setCreateValue] = useState<string[]>([]);
    const [commodityId, setCommodityId] = useState<string>("");


    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteInfo, setDeleteInfo] = useState<SkuConfigType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>("init");

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<SkuConfigType | null>(null);
    const [updateStatus, setUpdateStatus] = useState("init");
    const [updateValue, setUpdateValue] = useState<{key: string, value: string}[]>([]);
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>("");

    const {data:commodityIdData={msg:"", data: []}, error: commodityIdError} = useCommodityId();
    const {data:skuConfigData={msg:"", data: []}, error} = useSkuConfig();


    

    const handleSubmitCreate = async (formData: FormData) => {
        // console.log(Object.fromEntries(formData));
        setCreateStatus("pending");
        fetch("/api/sku/config", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateSkuConfig();
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
        console.log(id);
        setDeleteStatus("pending");
        fetch(`/api/sku/config/${id}`, {
            method: "DELETE",
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateSkuConfig();
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
        console.log(Object.fromEntries(formData));
        setUpdateStatus("pending");
        fetch(`/api/sku/config/${formData.get("id")}`, {
            method: "PUT",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateSkuConfig();
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

    const handleClickUpdate = (data: SkuConfigType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
        setUpdateValue(data.value.map(v => ({key: uuidV4(), value: v})));
    }

    const handleClickDelete = (data: SkuConfigType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }

    if(error||commodityIdError) {
        return null;
    }


    return (
        <>
            <div className="relative flex justify-between mb-4">
                <h3 className="text-lg">Sku config</h3>
                <Button variant="contained" onClick={() => {
                    setCreateOpen(true);
                    setCreateValue([]);
                }}>Add</Button>
                <Collapse in={createStatus==="success" || deleteStatus==="success" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">Action success</Alert>
                </Collapse>
                <Collapse in={deleteStatus==="error" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="error">Action fail fail reason：{failMsg}</Alert>
                </Collapse>
            </div>


            {/*data table*/}
            <TableContainer component={Paper}>
                <Table className="text-nowrap">
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Commodity
                            </TableCell>

                            {
                                skuConfigField.map(k =>
                                    <TableCell key={k} align="center" className="text-white">
                                        {k}
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skuConfigData.data.map((data) => (
                            <TableRow key={data.id} sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }}}>

                                <TableCell align="center">
                                    <Button onClick={() => handleClickUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleClickDelete(data)}>Delete</Button>
                                </TableCell>
                                <TableCell align="center">
                                    {data.commodity?.market?.name+" "+data.commodity?.name}
                                </TableCell>

                                {
                                    Object.entries(data).map(([k,v]) => {
                                        if (k === "id" || k === "commodityId" || k === "commodity") {
                                            return null;
                                        } else if (k === "value") {
                                            return (
                                                <TableCell key={k} align="center">
                                                        {
                                                            v.map((vm: string) => (
                                                                <span key={vm} className="ml-2">
                                                                    {vm}
                                                                </span>
                                                            ))
                                                        }
                                                </TableCell>)
                                        }
                                        return (
                                            <TableCell key={k} align="center" >
                                                {
                                                    v&&(v.length>20 ? `${v.slice(0, 20)}...` : v)
                                                }
                                            </TableCell>)
                                    })
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*delete dialog*/}
            <Dialog open={deleteOpen} onClose={()=>setDeleteOpen(false)}>
                <DialogTitle>
                    Delete sku config key {deleteInfo?.key}
                </DialogTitle>
                <DialogContent>
                    this action will delete sku config key {deleteInfo?.key}, confirm?
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
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="lg">
                <form action={handleSubmitCreate} className="relative">
                    <DialogTitle>Add Sku Config</DialogTitle>
                    <Collapse in={createStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/*commodity id字段*/}
                            <input type="hidden" name="commodityId" defaultValue={commodityId}/>
                            <Autocomplete
                                disablePortal
                                options={commodityIdData.data.map(d => ({label:d.market.name+" "+d.name,value:d.id}))}
                                getOptionLabel={o => o.label}
                                isOptionEqualToValue={(a,b) => a.label === b.label}
                                size="small"
                                onChange={(_, value) => setCommodityId(value?.value||"")}
                                renderInput={(params) => <TextField required {...params} label="Commodity name" />}
                            />


                            {/*剩余字段*/}
                            {
                                skuConfigField.map(c => (
                                    c==="value"?null:<TextField key={c} variant="outlined" size="small" name={c} required label={c} id={c}/>
                                ))
                            }
                        </div>
                    </DialogContent>


                    {/*value字段 可变长度*/}
                    <DialogTitle>Config value</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                createValue.map((value) => (
                                    <div key={value} className="relative">
                                        <TextField variant="outlined" className="w-[calc(100%-12px)]" size="small" name="value" label="value" />
                                        <CancelOutlinedIcon className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2" color="action"
                                                            onClick={() => setCreateValue(createValue.filter(i => i !== value))}
                                        />
                                    </div>
                                ))
                            }
                            <Button size="large" variant="contained"
                                    onClick={() => setCreateValue([...createValue, uuidV4()])}
                            >
                                Add value
                            </Button>
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
                    <Collapse in={updateStatus==="success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="success">Update success</Alert>
                    </Collapse>
                    <Collapse in={updateStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Update fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/* id字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       defaultValue={updateInfo?.commodity?.market?.name+" "+updateInfo?.commodity?.name}
                                       label="commodity"
                                       id="commodity"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <input type="hidden" name="id" defaultValue={updateInfo?.id}/>


                            {/*剩余字段*/}
                            {
                                updateInfo && Object.entries(updateInfo).map(([k, v]) => (
                                    k==="value"||k==="id"||k==="commodity"||k==="commodityId"?null:<TextField key={k} variant="outlined" size="small" defaultValue={v} name={k} required label={k} id={k}/>
                                ))
                            }
                        </div>
                    </DialogContent>


                    {/*value字段 可变长度*/}
                    <DialogTitle>Config value</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                updateValue.map((value) => (
                                    <div key={value.key} className="relative">
                                        <TextField variant="outlined" className="w-[calc(100%-12px)]" defaultValue={value.value} size="small" name="value" label="value" />
                                        <CancelOutlinedIcon className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2" color="action"
                                                            onClick={() => setUpdateValue(updateValue.filter(i => i.key !== value.key))}
                                        />
                                    </div>
                                ))
                            }
                            <Button size="large" variant="contained"
                                    onClick={() => setUpdateValue([...updateValue, { key: uuidV4(), value: ""}])}
                            >
                                Add value
                            </Button>
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
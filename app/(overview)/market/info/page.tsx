'use client'
import {
    Alert,
    Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
} from "@mui/material";
import {mutateMarket, useMarket} from "@/hooks/useMarket";
import {useRef, useState} from "react";
import { CloudUpload} from "@mui/icons-material";
import { MarketType } from "@/utils/type";


const marketField: MarketField[] = [
        "id",
        "name",
        "icon",
        "rating",
        "ratingAmount",
        "description",
        "website",
        "email",
        "telephone",
        "facebook",
        "ins",
        "youtube",
        "address",
        "privacyPolicy",
        "refundPolicy",
        "shippingPolicy"
]

type MarketField = "id"|
"name"|
    "icon"|
    "rating"|
    "ratingAmount"|
    "description"|
    "website"|
    "email"|
    "telephone"|
    "facebook"|
    "ins"|
    "youtube"|
    "address"|
    "privacyPolicy"|
    "refundPolicy"|
    "shippingPolicy"


const Page = () => {

    const {data={msg: "", data:[]}, error}: {data: {msg: string, data: MarketType[]}, error: boolean} = useMarket();


    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] =
        useState<{id: string, name: string}>({id: "", name: ""});
    const [deleteStatus, setDeleteStatus] = useState<string>("init");


    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [createInfoIcon, setCreateInfoIcon] = useState<null|undefined|File>(null);
    const [createStatus, setCreateStatus] = useState("init");
    const createTimeRef = useRef<number>(0);


    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<MarketType|null>(null);
    const [updateInfoIcon, setUpdateInfoIcon] = useState<undefined|null|File>();
    const [updateStatus, setUpdateStatus] = useState("init");
    const updateTimeRef = useRef<number>(0);

    const [failMsg, setFailMsg] = useState<string>('');


    const handleDelete = async (id: string) => {
        setDeleteStatus("pending")
        fetch(`/api/market/${id}`, {
            method: "DELETE"
        }).then(async () => {
            await mutateMarket();
            setDeleteOpen(false);
            setDeleteStatus("success");
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000);
        }).catch(error => {
            console.log(error)
            setDeleteStatus("error")
        });
    }

    const handleSubmitCreate = async (formData: FormData) => {
        setCreateStatus("pending")
        fetch(`/api/market/`, {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            await mutateMarket();
            setCreateInfoIcon(null);
            setCreateOpen(false);
            setCreateStatus("success")
            clearTimeout(createTimeRef.current);
            createTimeRef.current = window.setTimeout(() => {
                setCreateStatus("init")
            }, 3000)
        }).catch(error => {
            console.log(error)
            setCreateStatus("error")
            setFailMsg(JSON.stringify(error));
            clearTimeout(createTimeRef.current);
            createTimeRef.current = window.setTimeout(() => {
                setCreateStatus("init")
            }, 3000);
        })
    }

    const handleCloseCreate = async () => {
        setCreateInfoIcon(null);
        setCreateOpen(false);
        await mutateMarket();
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending")
        fetch(`/api/market/${updateInfo?.id}`, {
            method: "PUT",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            setUpdateStatus("success")
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init")
            }, 3000)
        }).catch(error => {
            console.log(error)
            setFailMsg(JSON.stringify(error));
            setUpdateStatus("error")
            clearTimeout(updateTimeRef.current);
            updateTimeRef.current =
                window.setTimeout(() => {setUpdateStatus("init")}, 3000);
        })
    }

    const handleCloseUpdate = async () => {
        setUpdateOpen(false);
        await mutateMarket();
        setTimeout(() => {
            setUpdateInfo(null);
            setUpdateInfoIcon(null);
        }, 250)
    }

    if(error) {
        console.log(error);
        return null;
    }



    return (
        <>
            <div className="relative p-4 flex justify-between">
                <p>商家列表</p>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>新增</Button>
                <Collapse in={createStatus==="success" || deleteStatus==="success"} className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">操作成功</Alert>
                </Collapse>
                <Collapse in={deleteStatus==="error"} className="absolute top-0 left-1/2 -translate-y-[calc(100%+32px)] -translate-x-[calc(50%+16px)]">
                    <Alert severity="success">操作失败</Alert>
                </Collapse>
            </div>


            <div>



                {/*数据表格*/}
                    <TableContainer component={Paper}>
                        <Table sx={{ }}
                               className="text-nowrap"
                        >
                            <TableHead>
                                <TableRow className="bg-gray-600">
                                    <TableCell align="center"
                                               className="text-white"
                                    >{"操作"}</TableCell>
                                    {
                                        marketField.map(k => k==="id"?null:
                                            <TableCell key={k} align="center"
                                                       className="text-white"
                                            >{k}</TableCell>)
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody
                            >
                                {data.data.length!==0 && data.data.map((d) => (
                                    <TableRow key={d.name} sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            }}}>
                                            <TableCell >
                                            <Button onClick={() => {
                                                setUpdateInfo(d);
                                                setUpdateOpen(true);
                                            }}>编辑</Button>
                                            <Button
                                                onClick={() => {
                                                    setDeleteOpen(true);
                                                    setDeleteInfo({id: d.id, name: d.name})
                                                }}
                                            >删除</Button>
                                        </TableCell>
                                        {
                                            Object.entries(d).map(([k,v]) => {
                                                if (k === "id") {
                                                    return null;
                                                } else if (k === "icon") {
                                                    return <TableCell key={k} align="center"
                                                    >
                                                        <img src={d?.[k]} alt="icon" className="w-12 object-cover"/>
                                                    </TableCell>
                                                }
                                                return (<TableCell key={k} align="center">
                                                    {
                                                        v.length > 20 ? `${v.slice(0, 20)}...` : v
                                                    }
                                                </TableCell>)
                                            })
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                {/*删除Dialog*/}
                <Dialog open={deleteOpen} onClose={()=>setDeleteOpen(false)}>
                    <DialogTitle>
                        删除商家{deleteInfo?.name}
                    </DialogTitle>
                    <DialogContent>
                        此举会删除商家{deleteInfo?.name}，确定继续
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setDeleteOpen(false)}
                                disabled={deleteStatus === "pending"}
                        >取消</Button>
                        <Button onClick={()=>handleDelete(deleteInfo?.id)}
                                disabled={deleteStatus === "pending"}
                        >确定</Button>
                    </DialogActions>
                </Dialog>



                {/*新增Dialog*/}
                <Dialog open={createOpen} onClose={handleCloseCreate} fullWidth maxWidth="lg">
                    <form action={handleSubmitCreate} className="relative">
                        <DialogTitle>新增商家</DialogTitle>
                        <Collapse in={createStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="error">新增失败 失败原因：{failMsg}</Alert>
                        </Collapse>
                        <DialogContent>
                            <div className="grid grid-cols-3 gap-8 p-4">
                                <TextField variant="outlined" size="small" name="name" label="name" required id="name"/>
                                <div className="flex gap-2">
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUpload/>}
                                    >
                                        Upload icon*
                                        <input type="file" name="icon"  className="opacity-0 w-1" id="icon"
                                               accept="image/*"
                                               required
                                               onChange={(e) => {
                                                   setCreateInfoIcon(e.currentTarget.files?.[0]);
                                               }}
                                        />
                                    </Button>
                                    {createInfoIcon &&
                                        <img src={URL.createObjectURL(createInfoIcon)}
                                             alt="icon"
                                             className="w-16 object-contain"
                                        />
                                    }
                                </div>
                                <div>
                                </div>
                                {
                                    marketField.map(m => {
                                        if(m === "id" || m === "name" || m === "icon") {
                                            return null;
                                        }
                                        else {
                                            return <TextField key={m} multiline variant="outlined" size="small" name={m} label={m} id={m}/>

                                        }
                                    })
                                }
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ p: 4 }}>
                            <Button type="submit" variant="contained"
                                    disabled={createStatus === "pending"}
                            >新增</Button>
                        </DialogActions>
                    </form>
                </Dialog>



                {/*更新Dialog*/}
                <Dialog open={updateOpen} onClose={handleCloseUpdate} fullWidth maxWidth="lg">
                    <form action={handleSubmitUpdate} className="relative">
                        <DialogTitle>更新商家信息</DialogTitle>
                        <Collapse in={updateStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="error">更新失败 失败原因：{failMsg}</Alert>
                        </Collapse>
                        <Collapse in={updateStatus==="success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="success">更新成功</Alert>
                        </Collapse>
                        <DialogContent>
                            <div className="grid grid-cols-3 items-center gap-8 p-4">
                                <TextField variant="outlined" size="small" defaultValue={updateInfo?.name} name="name" label="name" required id="name"/>
                                <div className="flex items-center gap-2">
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUpload/>}
                                    >
                                        Upload icon*
                                        <input type="file" name="icon"  className="opacity-0 w-1" id="icon"
                                               accept="image/*"
                                               onChange={(e) => {
                                                   setUpdateInfoIcon(e.currentTarget.files?.[0]);
                                               }}
                                        />
                                    </Button>
                                    {updateInfoIcon ?
                                        <>
                                            <span>新图片</span>
                                            <img src={URL.createObjectURL(updateInfoIcon)}
                                                 className="w-16 object-contain"
                                                 alt="icon"/>
                                        </>
                                        :
                                        <>
                                        <span>已有图片</span>
                                        <img src={updateInfo?.icon}
                                             className="w-16 object-contain"
                                             alt="icon"
                                        />
                                        </>
                                    }
                                </div>
                                <div>
                                </div>
                                {
                                    updateInfo && Object.entries(updateInfo).map(([k,v]) => {
                                        if(k === "id" || k === "name" || k === "icon") {
                                            return null;
                                        }
                                        else {
                                            // @ts-ignore
                                            return <TextField key={k} multiline variant="outlined" defaultValue={v} size="small" name={k} label={k} id={k}/>

                                        }
                                    })
                                }
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ p: 4 }}>
                            <Button type="submit" variant="contained"
                                    disabled={updateStatus === "pending"}
                            >更新</Button>
                        </DialogActions>
                    </form>
                </Dialog>


            </div>
        </>

    )
}

export default Page;
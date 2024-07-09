'use client'
import {
    Alert,
    Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    Pagination,
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
import { MarketType } from "@/utils/type";
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";


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
        "twitter",
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
    "twitter"|
    "ins"|
    "youtube"|
    "address"|
    "privacyPolicy"|
    "refundPolicy"|
    "shippingPolicy"


const Page = () => {

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<MarketType|null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>("init");


    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [createStatus, setCreateStatus] = useState("init");
    const createTimeRef = useRef<number>(0);


    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<MarketType|null>(null);
    const [updateStatus, setUpdateStatus] = useState("init");
    const updateTimeRef = useRef<number>(0);

    const [failMsg, setFailMsg] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");



    const {data={msg: "", totalPages: 1, data:[]}, error} = useMarket(page, query);



    const handleDelete = async (id: string) => {
        setDeleteStatus("pending")
        fetch(`/api/market/${id}`, {
            method: "DELETE"
        }).then(async () => {
            mutateMarket(page, query);
            setDeleteStatus("success");
        }).catch(error => {
            console.log(error)
            setDeleteStatus("error")
        }).finally(() => {
            setDeleteOpen(false);
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000);
        })
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
            mutateMarket(page, query);
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
        setCreateOpen(false);
        mutateMarket(page, query);
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
        mutateMarket(page, query);
        setTimeout(() => {
            setUpdateInfo(null);
        }, 250)
    }

    if(error) {
        return null;
    }


    // console.log(deleteStatus);

    return (
        <>
            <div className="relative py-2 items-center flex justify-between">
                <div className="flex items-center gap-4">
                    <p>商家列表</p>
                    <TextField variant="outlined"
                               label="Market name"
                               size="small"
                               value={query}
                               onChange={(e) => {
                                   setQuery(e.target.value);
                                   setPage(1);
                               }}
                    />
                </div>
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
                    <Table sx={{}}
                           className="text-nowrap"
                    >
                        <TableHead>
                            <TableRow className="bg-gray-600">
                                <TableCell align="center" className="text-white">{"操作"}</TableCell>
                                <TableCell align="center" className="text-white">id</TableCell>
                                <TableCell align="center" className="text-white">name</TableCell>
                                <TableCell align="center" className="text-white">icon</TableCell>
                                <TableCell align="center" className="text-white">bigLogo</TableCell>
                                <TableCell align="center" className="text-white">bigLogoBgColor</TableCell>
                                <TableCell align="center" className="text-white">bigLogoFontColor</TableCell>
                                <TableCell align="center" className="text-white">bigPic</TableCell>
                                <TableCell align="center" className="text-white">bigVideo</TableCell>
                                <TableCell align="center" className="text-white">rating</TableCell>
                                <TableCell align="center" className="text-white">ratingAmount</TableCell>
                                <TableCell align="center" className="text-white">description</TableCell>
                                <TableCell align="center" className="text-white">website</TableCell>
                                <TableCell align="center" className="text-white">email</TableCell>
                                <TableCell align="center" className="text-white">telephone</TableCell>
                                <TableCell align="center" className="text-white">facebook</TableCell>
                                <TableCell align="center" className="text-white">twitter</TableCell>
                                <TableCell align="center" className="text-white">ins</TableCell>
                                <TableCell align="center" className="text-white">youtube</TableCell>
                                <TableCell align="center" className="text-white">address</TableCell>
                                <TableCell align="center" className="text-white">privacyPolicy</TableCell>
                                <TableCell align="center" className="text-white">refundPolicy</TableCell>
                                <TableCell align="center" className="text-white">shippingPolicy</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.data.length !== 0 && data.data.map((d) => (
                                <TableRow key={d.name} sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: "rgba(0, 0, 0, 0.08)",
                                    },
                                    '&:nth-of-type(even)': {
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                    }
                                }}>
                                    <TableCell>
                                        <Button onClick={() => {setUpdateInfo(d);setUpdateOpen(true);}}>
                                            编辑
                                        </Button>
                                        <Button onClick={() => {setDeleteOpen(true);setDeleteInfo(d)}}>
                                            删除
                                        </Button>
                                    </TableCell>
                                    {
                                        Object.entries(d).map(([k, v]) => {
                                            if (k === "createdAt" || k === "updatedAt") {
                                                return null;
                                            }
                                            if (k === "id") {
                                                return <TableCell key={k} align="center">{v}</TableCell>
                                            }

                                            if (k === "icon"|| k === "bigPic" || k === "bigLogo") {
                                                return (d?.[k]&&d?.[k]!==""?
                                                    <TableCell key={k} align="center">
                                                        <img src={d?.[k]} alt={k} className="max-w-12 max-h-12 object-cover"/>
                                                    </TableCell>:<TableCell key={k}></TableCell>
                                                )
                                            }

                                            return (
                                                <TableCell key={k} align="center">
                                                    {v && (v.length > 20 ? `${v.slice(0, 20)}...` : v)}
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex justify-end">
                    <Pagination count={data.totalPages}
                                color="primary"
                                size="medium"
                                className="mt-2"
                                page={page}
                                onChange={(_, value) => {
                                    setPage(value)
                                    console.log("value", value);
                                }}
                    />
                </div>


                {/*删除Dialog*/}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                    <DialogTitle>
                        删除商家{deleteInfo?.name}
                    </DialogTitle>
                    <DialogContent>
                        此举会删除商家{deleteInfo?.name}，确定继续
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteOpen(false)}
                                disabled={deleteStatus === "pending"}
                        >取消</Button>
                        <Button onClick={() => handleDelete(deleteInfo?.id || "")}
                                disabled={deleteStatus === "pending"}
                        >确定</Button>
                    </DialogActions>
                </Dialog>


                {/*新增Dialog*/}
                <Dialog open={createOpen} onClose={handleCloseCreate} fullWidth maxWidth="lg">
                    <form action={handleSubmitCreate} className="relative">
                        <DialogTitle>新增商家</DialogTitle>
                        <Collapse in={createStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="error">新增失败 失败原因：{failMsg}</Alert>
                        </Collapse>
                        <DialogContent>
                            <div className="grid grid-cols-3 gap-8 p-4">
                                <TextField variant="outlined" size="small" name="name" label="name" required id="name"/>
                                <OptionalImageItem initialUrl="" inputName="icon"/>
                                <OptionalImageItem initialUrl="" inputName="bigLogo"/>
                                <OptionalImageItem initialUrl="" inputName="bigPic"/>
                                <span></span>
                                <span></span>
                                <TextField variant="outlined" size="small" name="bigLogoBgColor" label="Big Logo Background Color"/>
                                <TextField variant="outlined" size="small" name="bigLogoFontColor" label="Big Logo Font Color"/>
                                <TextField variant="outlined" size="small" name="rating" label="Rating"/>
                                <TextField variant="outlined" size="small" name="ratingAmount" label="Rating Amount"/>
                                <TextField variant="outlined" size="small" name="description" label="Description"/>
                                <TextField variant="outlined" size="small" name="website" label="Website"/>
                                <TextField variant="outlined" size="small" name="email" label="Email"/>
                                <TextField variant="outlined" size="small" name="telephone" label="Telephone"/>
                                <TextField variant="outlined" size="small" name="facebook" label="Facebook"/>
                                <TextField variant="outlined" size="small" name="twitter" label="Twitter"/>
                                <TextField variant="outlined" size="small" name="ins" label="Instagram"/>
                                <TextField variant="outlined" size="small" name="youtube" label="YouTube"/>
                                <TextField variant="outlined" size="small" name="address" label="Address"/>
                                <TextField variant="outlined" size="small" name="privacyPolicy" label="Privacy Policy"/>
                                <TextField variant="outlined" size="small" name="refundPolicy" label="Refund Policy"/>
                                <TextField variant="outlined" size="small" name="shippingPolicy"
                                           label="Shipping Policy"/>
                            </div>
                        </DialogContent>
                        <DialogActions sx={{p: 4}}>
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
                        <Collapse in={updateStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="error">更新失败 失败原因：{failMsg}</Alert>
                        </Collapse>
                        <Collapse in={updateStatus === "success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Alert severity="success">更新成功</Alert>
                        </Collapse>
                        <DialogContent>
                            <div className="grid grid-cols-3 items-center gap-8 p-4">
                                <TextField defaultValue={updateInfo?.name} variant="outlined" size="small" name="name" label="Name" id="name"/>
                                <OptionalImageItem initialUrl={updateInfo?.icon || ""} inputName="icon"/>
                                <OptionalImageItem initialUrl={updateInfo?.bigLogo || ""} inputName="bigLogo"/>
                                <OptionalImageItem initialUrl={updateInfo?.bigPic || ""} inputName="bigPic"/>
                                <p></p>
                                <p></p>
                                <TextField variant="outlined" size="small" name="bigLogoBgColor" label="Big Logo Background Color" defaultValue={updateInfo?.bigLogoBgColor || ""} />
                                <TextField variant="outlined" size="small" name="bigLogoFontColor" label="Big Logo Font Color" defaultValue={updateInfo?.bigLogoFontColor || ""} />
                                <TextField variant="outlined" size="small" name="rating" label="Rating" defaultValue={updateInfo?.rating || ""} />
                                <TextField variant="outlined" size="small" name="ratingAmount" label="Rating Amount" defaultValue={updateInfo?.ratingAmount || ""} />
                                <TextField variant="outlined" size="small" name="description" label="Description" defaultValue={updateInfo?.description || ""} />
                                <TextField variant="outlined" size="small" name="website" label="Website" defaultValue={updateInfo?.website || ""} />
                                <TextField variant="outlined" size="small" name="email" label="Email" defaultValue={updateInfo?.email || ""} />
                                <TextField variant="outlined" size="small" name="telephone" label="Telephone" defaultValue={updateInfo?.telephone || ""} />
                                <TextField variant="outlined" size="small" name="facebook" label="Facebook" defaultValue={updateInfo?.facebook || ""} />
                                <TextField variant="outlined" size="small" name="twitter" label="Twitter" defaultValue={updateInfo?.twitter || ""} />
                                <TextField variant="outlined" size="small" name="ins" label="Instagram" defaultValue={updateInfo?.ins || ""} />
                                <TextField variant="outlined" size="small" name="youtube" label="YouTube" defaultValue={updateInfo?.youtube || ""} />
                                <TextField variant="outlined" size="small" name="address" label="Address" defaultValue={updateInfo?.address || ""} />
                                <TextField variant="outlined" size="small" name="privacyPolicy" label="Privacy Policy" defaultValue={updateInfo?.privacyPolicy || ""} />
                                <TextField variant="outlined" size="small" name="refundPolicy" label="Refund Policy" defaultValue={updateInfo?.refundPolicy || ""} />
                                <TextField variant="outlined" size="small" name="shippingPolicy" label="Shipping Policy" defaultValue={updateInfo?.shippingPolicy || ""} />
                            </div>
                        </DialogContent>
                        <DialogActions sx={{p: 4}}>
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
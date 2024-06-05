'use client'
import {Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useRef, useState } from "react";
import { HomeShopStartedType} from "@/utils/type";
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";
import {mutateHomeShopStarted, useHomeShopStarted} from "@/hooks/useHomeShopStarted";



const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>('');

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<HomeShopStartedType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('');

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<HomeShopStartedType | null>(null);
    const [updateStatus, setUpdateStatus] = useState<string>("init");
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>('');


    const {data: homeShopStartedData={msg: "", data: []},
        error: homeShopStartedError} = useHomeShopStarted();

    const handleSubmitCreate = async (formData: FormData) => {
        // console.log(Object.fromEntries(formData));
        setCreateStatus("pending");
        fetch("/api/home/started", {
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
            mutateHomeShopStarted();
            window.setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }



    const handleSubmitDelete = async (id: string) => {
        setDeleteStatus("pending");
        fetch(`/api/home/started/${id}`, {
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
            mutateHomeShopStarted();
            setDeleteOpen(false)
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending");
        fetch(`/api/home/started/${updateInfo?.id}`, {
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
            mutateHomeShopStarted();
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }


    const handleClickUpdate = (data: HomeShopStartedType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
    }

    const handleClickDelete = (data: HomeShopStartedType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }

    if(homeShopStartedError) {
        return null;
    }


    return (
        <>
            <div className="relative flex justify-between mb-4">
                <h3 className="text-lg">Sku config</h3>
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
                                Logo
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                ImageLeft
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                ImageRight
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Rating
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                RatingAmount
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                RelativeId
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homeShopStartedData.data.map((data) => (
                            <TableRow key={data.id}
                                      sx={{'&:nth-of-type(odd)': {backgroundColor: "rgba(0, 0, 0, 0.04)"}}}>

                                <TableCell align="center">
                                    <Button onClick={() => handleClickUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleClickDelete(data)}>Delete</Button>
                                </TableCell>
                                {
                                    Object.entries(data).map(([k,v]) => {
                                        if (k === "id" || k === "createdAt" || k === "updatedAt") {
                                            return null;
                                        } else if(k==="logo"||k==="imageLeft"||k==="imageRight") {
                                            return (
                                                <TableCell key={k} align="center">
                                                    {v&&<img src={v} alt="logo" className="max-w-12 max-h-12"/>}
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TableCell key={k} align="center" >
                                                {v&&(v.length>20 ? `${v.slice(0, 20)}...` : v)}
                                            </TableCell>
                                        )
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
                    Delete home banner {JSON.stringify(deleteInfo?.relativeId)}
                </DialogTitle>
                <DialogContent>
                    this action will delete home banner whose relativeId is {JSON.stringify(deleteInfo?.relativeId)}, confirm?
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

                    <DialogTitle>Add Sku Item</DialogTitle>
                    <Collapse in={createStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">
                            {/*文字字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       name="name"
                                       label="name"
                                       required
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="rating"
                                       label="rating"
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="ratingAmount"
                                       label="ratingAmount"
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="relativeId"
                                       label="relativeId"
                                       required
                            />
                        </div>
                    </DialogContent>

                    <DialogTitle>Logo</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl="" inputName="logo"/>
                        </div>
                    </DialogContent>

                    <DialogTitle>Image Left and Right</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl="" inputName="imageLeft"/>
                            <OptionalImageItem initialUrl="" inputName="imageRight"/>
                        </div>
                    </DialogContent>

                    <DialogActions sx={{pr: 4, pb: 4}}>
                        <Button type="submit" variant="contained" disabled={createStatus === "pending"}>
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>



            {/*update dialog*/}
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
                        <div className="grid grid-cols-3 gap-8 p-4">
                            {/*文字字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       name="name"
                                       label="name"
                                       defaultValue={updateInfo?.name}
                                       required
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="rating"
                                       label="rating"
                                       defaultValue={updateInfo?.rating}
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="ratingAmount"
                                       label="ratingAmount"
                                       defaultValue={updateInfo?.ratingAmount}
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="relativeId"
                                       label="relativeId"
                                       defaultValue={updateInfo?.relativeId}
                                       inputProps={{
                                           readOnly: true,
                                       }}
                                       required
                            />
                        </div>
                    </DialogContent>

                    <DialogTitle>Logo</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl={updateInfo?.logo||""} inputName="logo"/>
                        </div>
                    </DialogContent>

                    <DialogTitle>Image Left and Right</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl={updateInfo?.imageLeft||""} inputName="imageLeft"/>
                            <OptionalImageItem initialUrl={updateInfo?.imageRight||""} inputName="imageRight"/>
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
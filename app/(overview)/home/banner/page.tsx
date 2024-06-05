'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useRef, useState } from "react";
import {HomeBannerType} from "@/utils/type";
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";
import {mutateHomeBanner, useHomeBanner} from "@/hooks/useHomeBanner";
import ControlledSwitch from "@/components/(overview)/home/ControlledSwitch";



const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>('');

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<HomeBannerType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('');

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<HomeBannerType | null>(null);
    const [updateStatus, setUpdateStatus] = useState<string>("init");
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>('');
    const [page, setPage] = useState(1);
    const [filterRow, setFilterRow] =
        useState<string>("ALL");


    const {data: homeBannerData={msg: "", totalPages: 1, data: []},
        error: homeBannerError} = useHomeBanner(page, filterRow);

    const handleSubmitCreate = async (formData: FormData) => {
        // console.log(Object.fromEntries(formData));
        setCreateStatus("pending");
        fetch("/api/home/banner", {
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
            mutateHomeBanner(page, filterRow);
            window.setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }



    const handleSubmitDelete = async (id: string) => {
        setDeleteStatus("pending");
        fetch(`/api/home/banner/${id}`, {
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
            mutateHomeBanner(page, filterRow);
            setDeleteOpen(false)
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending");
        fetch(`/api/home/banner/${updateInfo?.id}`, {
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
            mutateHomeBanner(page, filterRow);
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }


    const handleClickUpdate = (data: HomeBannerType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
    }

    const handleClickDelete = (data: HomeBannerType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }

    if(homeBannerError) {
        return null;
    }

    console.log(filterRow);
    return (
        <>
            <div className="relative flex justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg">Home Banner</h3>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">Row</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterRow}
                            label="Age"
                            onChange={(e) => setFilterRow(e.target.value)}
                        >
                            <MenuItem value="ALL">ALL</MenuItem>
                            <MenuItem value="ROW0">ROW0</MenuItem>
                            <MenuItem value="ROW1">ROW1</MenuItem>
                            <MenuItem value="ROW2">ROW2</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Button variant="contained" onClick={() => {
                    setCreateOpen(true);
                }}>Add</Button>
                <Collapse in={createStatus==="success" || deleteStatus==="success" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="success">Action success</Alert>
                </Collapse>
                <Collapse in={deleteStatus==="error" } className="absolute top-0 left-1/2 -translate-y-[calc(100%+16px)] -translate-x-[calc(50%+32px)]">
                    <Alert severity="error">Action fail fail reason：{failMsg}</Alert>
                </Collapse>
            </div>


            {/*data table*/}
            <TableContainer component={Paper} >
                <Table className="text-nowrap">
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Image
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Logo
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                IsCommodity
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Row
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                RelativeId
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homeBannerData.data.map((data) => (
                            <TableRow key={data.id} sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                                '&:nth-of-type(even)': {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}>

                                <TableCell align="center">
                                    <Button onClick={() => handleClickUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleClickDelete(data)}>Delete</Button>
                                </TableCell>

                                {
                                    Object.entries(data).map(([k,v]) => {
                                        if (k === "id" || k === "createdAt" || k === "updatedAt") {
                                            return null;
                                        } else if(k === "image" || k==="logo") {
                                            return (
                                                <TableCell key={k} align="center">
                                                    {v&&<img src={v} alt="logo" className="max-w-12 max-h-12"/>}
                                                </TableCell>
                                            )
                                        } else if(k === "isCommodity") {
                                            return (
                                                <TableCell key={k} align="center" >
                                                    {
                                                        String(v)
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
            <div className="flex justify-end">
                <Pagination count={homeBannerData.totalPages}
                            color="primary"
                            size="medium"
                            className="mt-2"
                            onChange={(_, value) => setPage(value)}
                />
            </div>

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
                    <DialogTitle>Add Home Banner</DialogTitle>
                    <Collapse in={createStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/*row 字段*/}
                            <Autocomplete
                                disablePortal
                                options={["ROW0", "ROW1", "ROW2"]}
                                size="small"
                                renderInput={(params) =>
                                    <TextField required {...params} name="row" label="Row" />}
                            />

                            <ControlledSwitch inputName="isCommodity" defaultValue={true} disabled={false}/>
                            <div></div>

                            {/*剩余字段*/}
                            <TextField variant="outlined" size="small" required name="relativeId" label="relativeId" />
                        </div>

                    </DialogContent>

                    <DialogTitle>Image</DialogTitle>
                        <DialogContent>
                            <div className="grid grid-cols-2 gap-8 p-4">
                                <OptionalImageItem initialUrl="" inputName="image"/>
                            </div>
                        </DialogContent>

                        <DialogTitle>Logo</DialogTitle>
                        <DialogContent>
                            <div className="grid grid-cols-2 gap-8 p-4">
                                <OptionalImageItem initialUrl="" inputName="logo"/>
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

                            {/*row 字段*/}
                            <Autocomplete
                                disablePortal
                                options={["ROW0", "ROW1", "ROW2"]}
                                size="small"
                                defaultValue={updateInfo?.row}
                                renderInput={(params) =>
                                    <TextField required {...params} name="row" label="Row"/>}
                            />

                            <ControlledSwitch inputName="isCommodity" defaultValue={Boolean(updateInfo?.isCommodity)} disabled={true}/>
                            <div></div>

                            {/*剩余字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       required
                                       name="relativeId"
                                       defaultValue={updateInfo?.relativeId}
                                       label="relativeId"
                                       inputProps={{
                                           readOnly: true,
                                       }}
                            />
                        </div>
                    </DialogContent>
                    <DialogTitle>Image</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl={updateInfo?.image||""} inputName="image"/>
                        </div>
                    </DialogContent>

                    <DialogTitle>Logo</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-8 p-4">
                            <OptionalImageItem initialUrl={updateInfo?.logo||""} inputName="logo"/>
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
'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import {useRef, useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import {useCommodityId} from "@/hooks/useCommodityId";
import {CategoryType, SkuItemType} from "@/utils/type";
import {mutateCategory, useCategory} from "@/hooks/useCategory";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {useCategoryId} from "@/hooks/useCategoryId";




const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>('');


    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<CategoryType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('');

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<CategoryType | null>(null);
    const [updateStatus, setUpdateStatus] = useState<string>("init");
    const [updateChildren, setUpdateChildren] =
        useState<{uuid: string, childId: string, childName: string}[]>([]);

    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");


    const {data: categoryData=
        {msg: "", totalAmount: 0, totalPages: 0, data: []}, error: categoryError}
        = useCategory(page, query);
    const {data: categoryIdData
        ={msg: "", data:[]}, error: categoryIdError} =
        useCategoryId();

    const handleSubmitCreate = async (formData: FormData) => {
        setCreateStatus("pending");
        fetch("/api/category", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateCategory(page, query);
            setCreateOpen(false);
            setCreateStatus("success")
            setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        }).catch(error => {
            console.log(error);
            setFailMsg(JSON.stringify(error))
            setCreateStatus("error");
            window.setTimeout(() => {
                setCreateStatus("init");
            }, 3000)
        })
    }



    const handleSubmitDelete = async (id: string) => {
        setDeleteStatus("pending");
        fetch(`/api/category/${id}`, {
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
            mutateCategory(page, query);
            setDeleteOpen(false)
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        // console.log(formData.getAll("childrenId"));
        setUpdateStatus("pending");
        fetch(`/api/category/${updateInfo?.id}`, {
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
            mutateCategory(page, query);
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }


    const handleClickUpdate = (data: CategoryType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
        setUpdateChildren(data.children.map(c => ({uuid: uuidV4(), childId: c.id, childName: c.name})));
    }

    const handleClickDelete = (data: CategoryType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }


    if(categoryError || categoryIdError) {
        return null;
    }

    return (
        <>
            <div className="relative flex justify-between mb-4">
                {/*filter part*/}
                <div className="flex items-center gap-4">
                    <h3 className="text-lg">Sku Item</h3>
                    <TextField variant="outlined"
                               label="Category Name"
                               name="query"
                               size="small"
                               value={query}
                               onChange={(e) => {setQuery(e.target.value)}}
                    />

                    <p>{categoryData.totalAmount} items</p>
                </div>


                <Button variant="contained" onClick={() => {
                    setCreateOpen(true);
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
            <TableContainer component={Paper}>
                <Table className="text-nowrap">
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>

                            <TableCell align="center" className="text-white">
                                categoryId
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                name
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                children
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                parent
                            </TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryData.data.map((data) => (
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
                                    {data.categoryId}
                                </TableCell>
                                <TableCell align="center">
                                    {data.name}
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        JSON.stringify(data.children.map(c => c.name)).length>30
                                            ?JSON.stringify(data.children.map(c => c.name)).slice(0,30)+"..."
                                            :JSON.stringify(data.children.map(c => c.name))
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        data.parent?.name||""
                                    }
                                </TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-end">
                <Pagination count={categoryData.totalPages}
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
                    Delete category {deleteInfo?.name||""}
                </DialogTitle>
                <DialogContent>
                    this action will delete category which name is {deleteInfo?.name||""}, confirm?
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
            <Dialog open={createOpen} onClose={() => {
                setCreateOpen(false);
            }} fullWidth maxWidth="lg">
                <form action={handleSubmitCreate} className="relative">
                    <DialogTitle>Add category</DialogTitle>
                    <Collapse in={createStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">
                            <TextField variant="outlined"
                                       size="small"
                                       name="name"
                                       required
                                       label="Name"
                            />
                            <TextField variant="outlined"
                                       size="small"
                                       name="categoryId"
                                       required
                                       label="CategoryId"
                            />

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

                            <TextField variant="outlined"
                                       size="small"
                                       label="Category Name"
                                       name="name"
                                       defaultValue={updateInfo?.name||""}
                            />

                            <TextField variant="outlined"
                                       size="small"
                                       label="Category Id"
                                       name="categoryId"
                                       defaultValue={String(updateInfo?.categoryId)||""}
                            />
                        </div>
                    </DialogContent>


                    <DialogTitle>Config children</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                updateChildren.map((u, i) => (
                                    <div className="relative" key={u.uuid}>
                                        <input type="hidden" name="childrenId" defaultValue={u.childId}/>
                                        <Autocomplete
                                            options={categoryIdData.data.map(d => ({ label: d.name, childId: d.id }))}
                                            getOptionLabel={o => o.label}
                                            isOptionEqualToValue={(a, b) => a.label === b.label}
                                            value={u.childName!==""
                                                ?{label: u.childName, childId: u.childId}
                                                :null}
                                            onChange={(_, value) => {
                                                setUpdateChildren(updateChildren.map(updateChild => {
                                                    if(updateChild.uuid !== u.uuid) return updateChild;
                                                    return {
                                                        uuid: updateChild.uuid,
                                                        childName: value?.label||"",
                                                        childId: value?.childId||"",
                                                    }
                                                }))
                                            }}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                           label="ChildrenId"
                                                           size="small"
                                                />}
                                        />
                                        <CancelOutlinedIcon
                                            className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2"
                                            color="action"
                                            onClick={() => setUpdateChildren(updateChildren.filter(i => i.uuid !== u.uuid))}
                                        />
                                    </div>
                                ))
                            }
                            <Button size="large" variant="contained"
                                    onClick={() => setUpdateChildren([...updateChildren, {uuid: uuidV4(), childId: "", childName: ""}])}
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
'use client'
import {Alert, Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, TextField } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import {useRef, useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import {useCommodityId} from "@/hooks/useCommodityId";
import {SkuItemType} from "@/utils/type";
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";
import {mutateSkuItem, useSkuItem} from "@/hooks/useSkuItem";


const skuItemField: string[] = [
    "sku",
    "price",
    "promotingPrice",
    "image",
    "stock"
]

const Page = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<string>('');
    const [createCommodityId, setCreateCommodityId] = useState<string>("");
    const [createSkuConfig, setCreateSkuConfig] = useState<{
        key: string,
        value: string[],
        defaultValue: string,
    }[]>([]);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<SkuItemType | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('');

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<SkuItemType | null>(null);
    const [updateStatus, setUpdateStatus] = useState<string>("init");
    const [updateImage, setUpdateImage] = useState<string>("");
    const [updateConfig, setUpdateConfig] = useState<{
        key: string,
        value: string[],
        defaultValue: string,
    }[]>([]);
    const updateTimeRef = useRef<number>(0);


    const [failMsg, setFailMsg] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [tableCommodityId, setTableCommodityId] = useState<string>("");


    const {data: commodityIdData={msg: "", data: []},
        error: commodityIdError} = useCommodityId();
    const {data: skuItemData={msg: "", totalAmount: 1, totalPages: 1, data: []}, error: skuItemError} = useSkuItem(page, tableCommodityId);

    const handleSubmitCreate = async (formData: FormData) => {
        setCreateStatus("pending");
        fetch("/api/sku/item", {
            method: "POST",
            body: formData,
        }).then(async (res) => {
            if(res.status !== 200) {
                throw await res.json();
            }
            mutateSkuItem(page, tableCommodityId);
            setCreateOpen(false);
            setCreateSkuConfig([]);
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
        fetch(`/api/sku/item/${id}`, {
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
            mutateSkuItem(page, tableCommodityId);
            setDeleteOpen(false)
            setTimeout(() => {
                setDeleteStatus("init");
            }, 3000)
        })
    }

    const handleSubmitUpdate = async (formData: FormData) => {
        setUpdateStatus("pending");
        fetch(`/api/sku/item/${updateInfo?.id}`, {
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
            mutateSkuItem(page, tableCommodityId);
            clearTimeout(updateTimeRef.current)
            updateTimeRef.current = window.setTimeout(() => {
                setUpdateStatus("init");
            }, 3000)
        })
    }


    const handleClickUpdate = (data: SkuItemType) => {
        setUpdateOpen(true);
        setUpdateInfo(data);
        setUpdateConfig(commodityIdData.data.find(d => d.id === data.commodityId)?.skuConfigs||[])
        setUpdateImage(uuidV4());
    }

    const handleClickDelete = (data: SkuItemType) => {
        setDeleteOpen(true);
        setDeleteInfo(data);
    }


    if(commodityIdError || skuItemError) {
        return null;
    }


    return (
        <>
            <div className="relative flex justify-between mb-4">
                {/*filter part*/}
                <div className="flex items-center gap-4">
                    <h3 className="text-lg">Sku Item</h3>
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
                    <p>{skuItemData.totalAmount} items</p>
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
                                Commodity
                            </TableCell>

                            {
                                skuItemField.map(k =>
                                    <TableCell key={k} align="center" className="text-white">
                                        {k}
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skuItemData.data.map((data) => (
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
                                    {data.commodity?.market?.name + " " + data.commodity?.name}
                                </TableCell>

                                {
                                    Object.entries(data).map(([k, v]) => {
                                        if (k === "id" || k === "commodityId" || k === "commodity") {
                                            return null;
                                        } else if (k === "sku") {
                                            return (
                                                <TableCell key={k} align="center">
                                                    {
                                                        JSON.stringify(v)
                                                    }
                                                </TableCell>)
                                        } else if (k === "image") {
                                            return (
                                                <TableCell key={k} align="center">
                                                    {!!v && v !=="" &&
                                                        <img src={v} alt="logo" className="w-12 h-12 object-cover"/>
                                                    }
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TableCell key={k} align="center">
                                                {
                                                    v && (v.length > 20 ? `${v.slice(0, 20)}...` : v)
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
                <Pagination count={skuItemData.totalPages}
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
                    Delete sku item {JSON.stringify(deleteInfo?.sku)}
                </DialogTitle>
                <DialogContent>
                    this action will delete sku config key {JSON.stringify(deleteInfo?.sku)}, confirm?
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
                setCreateSkuConfig([]);
            }} fullWidth maxWidth="lg">
                <form action={handleSubmitCreate} className="relative">
                    <DialogTitle>Add Sku Item</DialogTitle>
                    <Collapse in={createStatus === "error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                        <Alert severity="error">Add fail fail reason：{failMsg}</Alert>
                    </Collapse>

                    <DialogContent>
                        <div className="grid grid-cols-3 gap-8 p-4">

                            {/*commodity id字段*/}
                            <input type="hidden" name="commodityId" defaultValue={createCommodityId}/>
                            <Autocomplete
                                disablePortal
                                options={commodityIdData.data.map(d => ({
                                    label: d?.market?.name + " " + d?.name,
                                    value: d?.id,
                                    config: d?.skuConfigs
                                }))}
                                getOptionLabel={o => o.label}
                                isOptionEqualToValue={(a, b) => a.label === b.label}
                                size="small"
                                onChange={(_, value) => {
                                    setCreateCommodityId(value?.value || "");
                                    setCreateSkuConfig(value?.config || []);
                                }}
                                renderInput={(params) => <TextField required {...params} label="Commodity name"/>}
                            />


                            {/*剩余字段*/}
                            {
                                skuItemField.map(c => (
                                    c === "sku" || c === "image" ? null :
                                        <TextField key={c} variant="outlined" size="small" name={c} required label={c}
                                                   id={c}/>
                                ))
                            }

                            <OptionalImageItem initialUrl="" inputName="image"/>
                        </div>
                    </DialogContent>


                    {/*sku type filed, be displayed after commodity was chosen*/}
                    <DialogTitle>Config sku</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                createSkuConfig.map((c, i) => (
                                    <div className="grid grid-cols-2 gap-4" key={c.key}>
                                        <TextField variant="outlined"
                                                   name="key"
                                                   size="small"
                                                   label={`key${i}`}
                                                   defaultValue={c.key}
                                                   inputProps={{readOnly: true}}
                                        />
                                        <Autocomplete
                                            disablePortal
                                            options={c.value}
                                            size="small"
                                            defaultValue={c.defaultValue}
                                            renderInput={(params) =>
                                                <TextField required {...params}
                                                           name="value"
                                                           label={`value${i}`}
                                                           size="small"
                                                />}
                                        />
                                    </div>
                                ))
                            }
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

                            {/*commodity id字段*/}
                            <TextField variant="outlined"
                                       size="small"
                                       label="Commodity"
                                       defaultValue={updateInfo?.commodity?.market?.name + " " + updateInfo?.commodity?.name}
                                       inputProps={{readOnly: true}}
                            />


                            {/*剩余字段*/}
                            <TextField variant="outlined" size="small" required key="price" name="price" label="price"
                                       defaultValue={updateInfo?.price}/>
                            <TextField variant="outlined" size="small" required key="price" name="promotingPrice" label="promotingPrice"
                                       defaultValue={updateInfo?.promotingPrice}/>
                            <TextField variant="outlined" size="small" required key="stock" name="stock" label="stock"
                                       defaultValue={updateInfo?.stock}/>


                            <OptionalImageItem key={updateImage} initialUrl={updateInfo?.image || ""}
                                               inputName="image"/>
                        </div>
                    </DialogContent>


                    {/*sku config*/}
                    <DialogTitle>Config sku</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-3 items-center gap-8 p-4">
                            {
                                updateConfig.map((u, i) => (
                                    <div className="grid grid-cols-2 gap-4" key={u.key}>
                                        <TextField variant="outlined"
                                                   name="key"
                                                   size="small"
                                                   label={`key${i}`}
                                                   defaultValue={u.key}
                                                   inputProps={{readOnly: true}}
                                        />
                                        <Autocomplete
                                            disablePortal
                                            options={u.value}
                                            size="small"
                                            defaultValue={updateInfo?.sku[u.key] || ""}
                                            renderInput={(params) =>
                                                <TextField required {...params}
                                                           name="value"
                                                           label={`value${i}`}
                                                           size="small"
                                                />}
                                        />
                                    </div>
                                ))
                            }
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
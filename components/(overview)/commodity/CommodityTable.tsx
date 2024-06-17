import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper, Pagination } from "@mui/material";
import {commodityType, CommodityType} from "@/utils/type";
import {Dispatch, SetStateAction } from "react";


const CommodityTable = ({handleUpdate, handleDelete, page, setPage, data}: {
    handleUpdate: (data: CommodityType) => void,
    handleDelete: (data: CommodityType) => void,
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    data: {data: CommodityType[], totalPages: number},
}) => {




    return (
        <>
            <TableContainer component={Paper}>
                <Table className="text-nowrap">
                    <TableHead>
                        <TableRow className="bg-gray-600">
                            <TableCell align="center" className="text-white">
                                Action
                            </TableCell>
                            <TableCell align="center" className="text-white">
                                Market
                            </TableCell>
                            {
                                commodityType.map(k =>
                                    <TableCell key={k} align="center" className="text-white">
                                        {k}
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.data?.length !== 0 && data.data?.map((data) => (
                            <TableRow key={data.name} sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}>

                                <TableCell align="center">
                                    <Button onClick={() => handleUpdate(data)}>Edit</Button>
                                    <Button onClick={() => handleDelete(data)}>Delete</Button>
                                </TableCell>
                                <TableCell align="center">
                                    {data?.market?.name || ""}
                                </TableCell>

                                {
                                    Object.entries(data).map(([k, v]) => {

                                        if (k === "marketId" || k === "market") {
                                            return null;
                                        }

                                        if (k === "id") {
                                            return <TableCell key={k} align="center">{v}</TableCell>
                                        }

                                        if(k === "tags") {
                                            return <TableCell key={k} align="center">
                                                {JSON.stringify(v).length>20
                                                    ?`${JSON.stringify(v).slice(0,20)}...`
                                                    :JSON.stringify(v)}
                                            </TableCell>
                                        }

                                        if (k === "images") {
                                            return (
                                                <TableCell key={k} align="center" className="">
                                                    <div className="flex gap-2">
                                                        {
                                                            v.map((vm: string) => (
                                                                <img src={vm} key={vm} alt="icon"
                                                                     className="min-w-12 min-h-12 w-12 h-12 object-cover"/>
                                                            ))
                                                        }
                                                    </div>
                                                </TableCell>)
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
        </>

    )
}

export default CommodityTable;
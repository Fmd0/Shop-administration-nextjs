import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper } from "@mui/material";
import {useCommodity} from "@/hooks/useCommodity";
import {commodityType, CommodityType} from "@/utils/type";


const CommodityTable = ({handleUpdate, handleDelete}: {
    handleUpdate: (data: CommodityType) => void,
    handleDelete: (data: CommodityType) => void,
}) => {

    const {data={msg:"", data:[]}, error} = useCommodity();

    if(error) {
        return null;
    }

    // console.log(data);

    return (
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
                    {data.data.length!==0 && data.data.map((data) => (
                        <TableRow key={data.name} sx={{
                            '&:nth-of-type(odd)': {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            }}}>

                            <TableCell align="center">
                                <Button onClick={() => handleUpdate(data)}>Edit</Button>
                                <Button onClick={() => handleDelete(data)}>Delete</Button>
                            </TableCell>
                            <TableCell align="center">
                                {data?.market?.name||""}
                            </TableCell>

                            {
                                Object.entries(data).map(([k,v]) => {
                                    // console.log(k, v);
                                    if (k === "id" || k === "marketId" || k === "market") {
                                        return null;
                                    } else if (k === "images") {
                                        return (
                                            <TableCell key={k} align="left">
                                                <div className="flex gap-2">
                                                    {
                                                        v.map((vm: string) => (
                                                            <img src={vm} key={vm} alt="icon" className="w-12 object-cover"/>
                                                        ))
                                                    }
                                                </div>
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
    )
}

export default CommodityTable;
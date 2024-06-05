
import {Alert, Autocomplete, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, TextField } from "@mui/material";
import {useState } from "react";
import {commodityType} from "@/utils/type";
import InfoIcon from '@mui/icons-material/Info';
import {useMarketId} from "@/hooks/useMarketId";
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { v4 as uuidV4 } from 'uuid';
import {useMarketTag} from "@/hooks/useMarketTag";


const CommodityCreateDialog = ({open, onClose, handleSubmit, createStatus, failMsg}: {
    open: boolean,
    onClose: () => void,
    handleSubmit: (formData: FormData) => Promise<void>,
    createStatus: string,
    failMsg: string
}) => {

    const {data={msg:"",data:[]}, error} = useMarketId();
    const {data: marketTagData={msg: "", data: []}, error: marketTagError} = useMarketTag();
    const [market, setMarket] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [tagList, setTagList] = useState<string[]>([]);

    if(error|| marketTagError) {
        return null;
    }

    return (
        <Dialog open={open} onClose={() => {
            onClose();
            setTimeout(() => {
                setImages([]);
                setTagList([]);
            }, 250)
        }} fullWidth maxWidth="lg">
            <form action={handleSubmit} className="relative">
                <DialogTitle>新增商品</DialogTitle>
                <Collapse in={createStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                    <Alert severity="error">新增失败 失败原因：{failMsg}</Alert>
                </Collapse>

                <DialogContent>
                    <div className="grid grid-cols-3 gap-8 p-4">

                        {/*market name字段*/}
                        <input type="hidden" name="marketId" defaultValue={market}/>
                        <Autocomplete
                            disablePortal
                            options={data.data.map(d => ({label:d.name,value:d.id}))}
                            getOptionLabel={o => o.label}
                            isOptionEqualToValue={(a,b) => a.label === b.label}
                            size="small"
                            onChange={(_,value) => {
                                setMarket(value?.value||"");
                                setTagList(marketTagData.data.find(d => d.market.id === value?.value)?.tags||[]);
                            }}
                            renderInput={(params) => <TextField required {...params} label="Market name" />}
                        />


                        {/*剩余字段*/}
                        {
                            commodityType.map(c => (
                                 c==="id"||c==="images"||c==="tags"?null:<TextField key={c} variant="outlined" size="small" name={c} required={c==="name"||c==="price"} label={c} id={c}/>
                            ))
                        }


                    </div>
                </DialogContent>

                <DialogContent>
                    <div className="grid grid-cols-10 gap-2 p-4">
                        {
                            tagList.map(t => (
                                <FormControlLabel key={t} control={<Checkbox/>} label={t} name="tag" value={t}/>
                            ))
                        }
                    </div>
                </DialogContent>


                {/*商品图片列表 可变长度*/}
                <DialogTitle>设置商品图片</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-3 items-center gap-8 p-4">
                        {
                            images.map((image) => (
                                <div key={image} className="relative">
                                    <OptionalImageItem
                                        initialUrl={""}
                                        inputName="images"
                                    />
                                    <CancelOutlinedIcon className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2" color="action"
                                                        onClick={() => setImages(images.filter(i => i !== image))}
                                    />
                                </div>
                            ))
                        }
                        <Button size="large" variant="contained" onClick={() => setImages([...images, uuidV4()])}>
                            增加图片
                        </Button>
                    </div>
                    <p className="mt-10 pl-2 flex items-center">
                        <InfoIcon color="action"/>
                        点击确认使用后图片将会被上传至云端，新增商品前确保所有图片都被上传至云端
                    </p>
                </DialogContent>
                <DialogActions sx={{pr: 4, pb: 4}}>
                <Button type="submit" variant="contained"
                            disabled={createStatus === "pending"}
                    >新增</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CommodityCreateDialog;
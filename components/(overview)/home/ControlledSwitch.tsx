import { FormControlLabel, Switch } from "@mui/material";
import {useEffect, useState } from "react";


const ControlledSwitch = ({inputName, defaultValue, disabled}:
                              {inputName: string; defaultValue: boolean, disabled: boolean}
) => {
    const [inputValue, setInputValue] = useState("1");

    useEffect(() => {
        setInputValue(defaultValue?"1":"");
    }, [defaultValue]);

    return (
        <div>
            <input type="hidden" defaultValue={inputValue} name={inputName}/>
            <FormControlLabel control={<Switch defaultChecked={defaultValue} disabled={disabled} />} label={inputName}
                              onChange={() => {setInputValue(i => i===""?"1":"")}}
            />
        </div>
    )
}


export default ControlledSwitch;
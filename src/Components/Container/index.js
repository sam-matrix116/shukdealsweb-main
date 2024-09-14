import React from "react";
import { useTranslation } from "react-i18next";
import CustomHeader from "../CustomHeader";
import CustomFooter from "../CustomFooter";
import { Outlet } from "react-router-dom";

function Container(){
    const { t } = useTranslation();
    return(
        <div>
            {/* <CustomHeader/> */}
            <Outlet/>
            {/* <CustomFooter/> */}
        </div>
    )
}

export default Container;
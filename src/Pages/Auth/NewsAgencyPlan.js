import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomFooter from "../../Components/CustomFooter";
import CustomHeader from "../../Components/CustomHeader";
import { useEffect } from "react";
import { FetchApi } from "../../API/FetchApi";
import { Endpoints } from "../../API/Endpoints";
import { deleteAllCookies, getTempToken } from "../../helpers/authUtils";
import ToastMessage from "../../Utils/ToastMessage";

function NewsAgencyPlan(){
    const { t } = useTranslation();
    const [planData, setPlanData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const tempToken = getTempToken();

    // console.log('blanlocation_', location?.state)

    const getPlans = async()=>{
        try{
            let resp = await FetchApi(Endpoints.getPlans, null, {}, {
                user_type : 'news_agency'
            });
            if(resp && resp.status){
                setPlanData(resp.data);
            }
        }
        catch(e){
        }
    }

    const activatePlan = async(plan)=>{
        let obj = {
            tempToken: tempToken,
            plan:plan
        }
        try{
            let resp = await FetchApi(Endpoints.activatePlan, obj);
            if(resp && resp.status){
                // ToastMessage.Success(resp.message);
                navigate('/payment', {replace : true, state : {clientSecret : resp?.stripe_client_secret}})
            }
        }
        catch(e){
        }
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        getPlans();
    },[])
    return(
        <div className="wrapper position-relative">
            <CustomHeader external/>
            <div className="main pt-5 main-login">

            <div className="container pt-5">
                <h1 className="text-gray1 fs-34 medium pb-3 pt-md-2 fs-30">{t("Select Your Plan to Continue")}</h1>
                <div className="row">
                    {
                        planData.map((item, index)=>{
                            return(
                                <div className="col-md-4 pb-md-0 pb-3 d-flex">
                                    <div className="box-border p-4 rounded-10 w-100 ">
                                        <h4 className="fs-20 text-blue pb-3 regular">{item.name}</h4>
                                        <h3 className="text-gray1 bold pb-3">{item.amount==0?"Free":"$" +item.amount.toFixed(2)+"/-"}</h3>
                                        <h5 className="text-decoration-underline fs-16 text-gray1 pb-2 medium">{t("Features")}</h5>
                                        <ul>
                                            {
                                                item?.features?.map((ite, ind)=>{
                                                    return(
                                                        <li>{t("Add")} {ite?.numbers_allowed +" " + ite?.feature}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        <button
                                        onClick={()=>{
                                            if(item.amount==0){
                                                navigate('/', {replace : true})
                                            }
                                            else{
                                                activatePlan(item.id)
                                            }
                                        }}
                                        className="button w-100 rounded-10">{item.amount==0?t("Continue Free"): t("Activate Plan Now")}</button>
                                    </div>
                                </div> 
                            )
                        })
                    }
                    </div>
                    
                <div className="text-center py-md-5 py-3">
                <Link 
                onClick={()=>{
                    navigate(-1)
                }} className="medium d-block">{t("Go Back")}</Link>
                </div>
            </div>

        </div>
            <CustomFooter/>
        </div>
    )
}

export default NewsAgencyPlan;
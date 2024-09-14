import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';
import { RenderHTMLstring } from '../../helpers/htmlHelper';

function CommonSupport() {
    const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState();
	const [data, setData] = useState();

	const getTermsConditionsDetails = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getSupport);
			if (resp && resp.status) {
				setData(resp);
				setIsLoading(false);
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	useEffect(() => {
		getTermsConditionsDetails();
	}, []);
	return (
		<div className='referral-box'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className='main py-5'>
					<div className='container'>
						<div className='about-section'>
							<h1 className='text-gray1 fs-30 medium pb-3 fs-30'>{t("Support")}</h1>
							<span className='text-gray2 light text-justify'>
								<RenderHTMLstring htmlString={data?.terms_and_conditions} />
							</span>
						</div>
					</div>
				</div>
			)}
			<CustomFooter />
		</div>
	);
}

export default CommonSupport;

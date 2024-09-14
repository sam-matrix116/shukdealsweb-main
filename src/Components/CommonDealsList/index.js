import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Endpoints } from '../../API/Endpoints';
import { useEffect } from 'react';

import { CommonDealsRow } from '../sliders';
import { getUserToken } from '../../helpers/authUtils';
import CommonAddBtn from '../CommonAddBtn';

function CommonDealsList({
	id,
	profileData,
	paginationSize,
	addDealBtn,
	headTitle,
	removeTitle,
	addWeekly
}) {
    const { t } = useTranslation();
	const [data, setData] = useState();
	const token = getUserToken();
	return (
		<div className={data?.length ? 'py-3 mt-4 border-bottom' : ''}>
			<div className='d-lg-flex gap-3'>
			{addDealBtn && token ? (
				<CommonAddBtn profileData={profileData} categoryType={'deal'} />
			) : null}
			{addWeekly && token ? (
				<CommonAddBtn removeTitle={true} profileData={profileData} categoryType={'weekly_deal'} />
			) : null}
			</div>

			<CommonDealsRow
				givenUrl={Endpoints.getUserDeal + id}
				detailViewLink={'/deal-details'}
				headTitle={headTitle}
				paginationSize={paginationSize}
				activatePagination={true}
				removeTitle={removeTitle}
			/>
		</div>
	);
}

export default CommonDealsList;

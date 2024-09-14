import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import RatingReviewBox from './RatingReviewBox';
import WriteReview from './WriteReview';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';

function CommonReviewBox({
	categoryType,
	passId,
	removeWriteReviewBox = false,
	isHeadTitle,
}) {
	const [reviewListData, setReviewListData] = useState();
	const [extraReviewData, setExtraReviewData] = useState();
	const [nextUrl, setNextUrl] = useState();
    const { t } = useTranslation();

	const getReviewListData = async (url) => {
		try {
			let resp = await FetchApi(url + passId, null, null, {
				pagination_on: 1,
				items_per_page: 4,
			});
			if (resp) {
				setReviewListData(resp?.results);
				setExtraReviewData(resp?.extra_data);
				setNextUrl(resp?.next);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	// side effects
	useEffect(() => {
		if (categoryType === 'user')
			getReviewListData(Endpoints.getUserReviewListData);
		else if (categoryType === 'deal')
			getReviewListData(Endpoints.getDealReviewListData);
	}, [passId]);

	return (
		<div className=' border-top'>
			{isHeadTitle && reviewListData?.length ? (
				<h3 className='fs-30 fs-sm-24 text-gray1 py-3'>{t("Review & Ratings")}</h3>
			) : null}

			{!removeWriteReviewBox && !extraReviewData?.reviewed_by_logged_user ? (
				<WriteReview
					categoryType={categoryType}
					passId={passId}
					callingApi={getReviewListData}
				/>
			) : null}

			{reviewListData?.length ? (
				<RatingReviewBox
					reviewListData={reviewListData}
					extraReviewData={extraReviewData}
					categoryType={categoryType}
					nextUrl={nextUrl}
				/>
			) : null}
		</div>
	);
}

export default CommonReviewBox;

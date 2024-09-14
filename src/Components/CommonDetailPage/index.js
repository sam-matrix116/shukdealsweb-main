import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Endpoints } from '../../API/Endpoints';
import { CommonDealsRow, CommonRecommendationRow } from '../sliders';
import RealEstateDetailPage from './DetailPages/RealEstateDetailPage';
import BusinesDealsDetailPage from './DetailPages/BusinesDealsDetailPage';
import { FetchApi } from '../../API/FetchApi';
import { getChoosenCurrency, getLoggedInUser } from '../../helpers';
import ToastMessage from '../../Utils/ToastMessage';
import CustomHeader from '../CustomHeader';
import OthersProfile from '../OthersProfile';
import CustomFooter from '../CustomFooter';
import ClassifiedDetailPage from './DetailPages/ClassifiedDetailPage';
import WeeklyDealsDetailPage from './DetailPages/WeeklyDealsDetailPage';
import CommonProfile from '../CommonProfile';
import CommonReviewBox from '../CommonReviewBox';
import LoadingSpinner from '../Loader';

function CommonDetailPage({ apiUrl, params, detailType }) {
    const { t } = useTranslation();
	const user = getLoggedInUser();
	const user_currency = getChoosenCurrency();
	const [isLoading, setIsLoading] = useState(false);
	const [detailData, setDetailData] = useState({});
	const [passId, setPassId] = useState('');
	const business_sub_category = detailData?.business_sub_category;

	const getDealDetails = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(apiUrl, null, null, {
				to_currency: user_currency?.iso_code,
			});
			if (resp && resp.data) {
				setDetailData(resp.data);
				setPassId(resp?.data?.creator_details?.id);
			}
			setIsLoading(false);
		} catch (e) {
			ToastMessage.Error(e.message);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getDealDetails();
		window.scrollTo(0, 0);
	}, [params?.id]);
	// console.log('test', detailData?.creator_details?.id == user?.id);
	return (
		<div>
			<CustomHeader />

			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='main'>
						{user?.id === passId ? (
							<CommonProfile />
						) : (
							<OthersProfile
								id={passId}
								user={detailData?.creator_details?.user_type}
								about={detailData?.creator_details?.about}
							/>
						)}

						<div className='container'>
							{/* detail pages */}
							{detailData &&
								!detailData?.weekly &&
								detailType === 'business_deals' &&
								business_sub_category != 10 &&
								business_sub_category != 12 && (
									<BusinesDealsDetailPage detailData={detailData} params={params} />
								)}

							{detailData &&
								!detailData?.weekly &&
								detailType === 'classified_deals' && (
									<ClassifiedDetailPage detailData={detailData} params={params} />
								)}

							{detailData &&
								!detailData?.weekly &&
								(business_sub_category == 10 || business_sub_category == 12) && (
									<RealEstateDetailPage detailData={detailData} params={params} />
								)}

							{detailData?.weekly && (
								<WeeklyDealsDetailPage detailData={detailData} params={params} />
							)}

							{/* other details */}
							{passId && detailType !== 'classified_deals' && (
								<div className='pt-5'>
									<CommonDealsRow
										givenUrl={Endpoints.getUserDeal + passId}
										dealId={params?.id}
										detailViewLink={'/deal-details'}
										removeTitle={true}
										paginationSize={8}
										activatePagination={true}
									/>
								</div>
							)}

							{params.id && detailType !== 'classified_deals' && (
								<CommonReviewBox
									categoryType={'deal'}
									passId={params?.id}
									isHeadTitle={detailData?.creator_details?.id == user?.id}
									removeWriteReviewBox={detailData?.creator_details?.id == user?.id}
								/>
							)}

							{passId && detailType !== 'classified_deals' && (
								<div className='py-lg-4 py-3 border-top'>
									<CommonRecommendationRow
										headTitle={'Recommendation'}
										headSize={true}
										userId={passId}
										recommendedType={'others'}
										paginationSize={4}
									/>
								</div>
							)}
						</div>
					</div>
					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default CommonDetailPage;

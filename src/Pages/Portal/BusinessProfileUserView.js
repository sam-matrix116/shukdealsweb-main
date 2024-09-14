import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import OthersProfile from '../../Components/OthersProfile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CommonDealsList from '../../Components/CommonDealsList';
import CommonReviewBox from '../../Components/CommonReviewBox';
import { CommonTopBusinessRow } from '../../Components/sliders';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';
import CommonProfile from '../../Components/CommonProfile';
import { getLoggedInUser } from '../../helpers';

function BusinessProfileUserView() {
	const user = getLoggedInUser();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState({});

	const getOtherProfile = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getOtherUserProfile + params.id);
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);

			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	useEffect(() => {
		if (params?.id == user?.id) {
			navigate({
				pathname: '/business-profile-business-view',
			});
		}
		getOtherProfile();
	}, []);
	return (
		<div className='wrapper'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<OthersProfile about={true} id={params?.id} user={'business'} />
					<div className='main container'>
						<div className='py-4  border-bottom'>
							{/* <h3 className="fs-30 fs-sm-24 text-gray1 pb-3">All Deals</h3> */}
							<CommonDealsList
								id={params?.id}
								paginationSize={4}
								headTitle={'All Deals'}
							/>
						</div>

						<div className='rating-section'>
							<CommonReviewBox categoryType={'user'} passId={params.id} />
						</div>

						{/* //START STORE SECTION */}
						<div className='py-lg-4 py-3 border-top'>
							<h3 className='fs-30 fs-sm-24 text-gray1 pb-3'>{t("Similar Businesses")}</h3>
						</div>
						{profileData?.business_category && (
							<CommonTopBusinessRow
								givenUrl={Endpoints.topStoreBusinessProfile}
								paginationSize={4}
								removeTitle={true}
								params={{
									business_category: profileData?.business_category,
									remove_user: profileData?.id,
								}}
							/>
						)}

						{/* <!-- Modal --> */}
					</div>
					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default BusinessProfileUserView;

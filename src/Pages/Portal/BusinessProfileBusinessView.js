import React from 'react';
import { useTranslation } from "react-i18next";
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useState } from 'react';
import { useEffect } from 'react';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { Link } from 'react-router-dom';
import CommonDealsList from '../../Components/CommonDealsList';
import RatingReviewBox from '../../Components/CommonReviewBox/RatingReviewBox';
import CommonReviewBox from '../../Components/CommonReviewBox';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';
import { CommonOfferRow } from '../../Components/sliders';

function BusinessProfileBusinessView() {
    const { t } = useTranslation();
	const user = getLoggedInUser();
	const token = getUserToken();
	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState([]);
	const getProfileDetails = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getProfileDetails);
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
		if (token) getProfileDetails();
	}, []);

	//   console.log("profileData",profileData)
	return (
		<div className='wrapper'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='main'>
						<CommonProfile />
						<div className='container'>
							<div className='py-4 border-bottom border-top'>
								<h1 className='fs-30 text-gray1 pb-1 fs-sm-22'>{t("About Store")}</h1>
								<p className='light mb-4'>{profileData?.about}</p>
								<div className='row pe-lg-5'>
									<div className='col-lg-3 col-md-4 col-6 pb-md-0 pb-4'>
										<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t("Contact Us")}</h6>
										<div className='d-flex align-items-center gap-2'>
											<img src='assets/img/icon/contact-us.svg' alt='' />
											<h6 className='light fs-16 fs-sm-14 text-gray2'>
												{profileData?.phone}
											</h6>
										</div>
									</div>
									{profileData?.facebook_url ||
									profileData?.twitter_url ||
									profileData?.instagram_url ||
									profileData?.youtube_url ? (
										<div className='col-md-3 col-6 pb-md-0 pb-4'>
											<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t("Follow Us")}</h6>
											<div className='d-flex gap-2'>
												{profileData?.facebook_url && (
													<Link to={profileData?.facebook_url} target='_blank' className=''>
														<img src='assets/img/icon/Facebook.svg' />
													</Link>
												)}
												{profileData?.twitter_url && (
													<Link to={profileData.twitter_url} target='_blank' className=''>
														<img src='assets/img/icon/Twitter.svg' />
													</Link>
												)}
												{profileData?.instagram_url && (
													<Link to={profileData?.instagram_url} target='_blank' className=''>
														<img src='assets/img/icon/Instagram.svg' />
													</Link>
												)}
												{profileData?.youtube_url && (
													<Link to={profileData?.youtube_url} target='_blank' className=''>
														<img src='assets/img/icon/YouTube.svg' />
													</Link>
												)}
											</div>
										</div>
									) : null}
									{profileData.delivery_partners?.length > 0 && (
										<div className='col-md-3 col-6'>
											<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t("Delivery Partners")}
											</h6>
											{/* <img src="assets/img/icon/delivery.svg" alt=""/> */}
											<div style={{ display: 'flex', alignItems: 'center' }}>
												{profileData.delivery_partners?.map((item, index) => {
													return (
														<div style={{ marginLeft: '5px' }} key={index}>
															{/* {item?.name +
															(index != profileData.delivery_partners.length - 1 ? ', ' : '')} */}
															<img
																className='rounded-3'
																height={28}
																width={28}
																src={Endpoints.baseUrl + item?.image}
																alt=''
															/>
														</div>
													);
												})}
											</div>
										</div>
									)}
									{profileData?.menu?.menu && (
										<div className='col-md-2 col-6'>
											<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t("View Menu")}</h6>
											<img
												onClick={(e) =>
													window.open(Endpoints.baseUrl + profileData?.menu?.menu, '_blank')
												}
												className=' selectContainer'
												src='assets/img/icon/view-menu.svg'
												alt=''
											/>
										</div>
									)}
								</div>
							</div>

							<div>
								<CommonDealsList
									id={user?.id}
									profileData={profileData}
									paginationSize={8}
									addDealBtn={true}
									removeTitle={true}
									addWeekly={true}
								/>
							</div>

							<CommonOfferRow 
							headTitle={'Weekly Listing'}
							givenUrl={Endpoints.myWeeklyDealsList}
							paginationSize={8} 
							addDealBtn={true} 
							profileData={profileData}
							// viewAllBtn={}
							/>

							{user.id && (
								<CommonReviewBox
									categoryType={'user'}
									passId={user?.id}
									removeWriteReviewBox={true}
								/>
							)}
						</div>
					</div>

					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default BusinessProfileBusinessView;

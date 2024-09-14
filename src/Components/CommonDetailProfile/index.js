import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ToastMessage from '../../Utils/ToastMessage';
import LocationPaymentModal from '../modals/LocationPaymentModal';
const $ = window.jQuery;

function CommonDetailProfile({ about }) {
	const { t } = useTranslation();
	const [profileData, setProfileData] = useState({});
	const [unitCostData, setUnitCostData] = useState({});
	const [modalVisible, setModalVisible] = useState('');
	const user = getLoggedInUser();
	const token = getUserToken();

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
			if (resp && resp?.data?.user_type == 'Business') {
				getUnitCost();
			}
		} catch (e) {}
	};

	const removeFamilyMember = async () => {
		try {
			let resp = await FetchApi(Endpoints.removeFamilyMember);
			if (resp && resp.status && token) {
				getProfileDetails();
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};

	const getUnitCost = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUnitCost);
			if (resp && resp.status) {
				setUnitCostData(resp);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (token) getProfileDetails();
	}, []);

	return (
		<div>
			{user?.user_type == 'member' && (
				<div>
					<div className='profile-banner'>
						<img
							src={Endpoints.baseUrl + profileData?.cover_pic}
							className='w-100 object-cover'
							alt=''
						/>
					</div>

					<div className='profile-top-content pb-lg-4'>
						<div className='container'>
							<div className='row align-items-md-end'>
								<div className='col-lg-2 col-md-3 col-auto'>
									<div className='profile-dp'>
										<img src={Endpoints.baseUrl + profileData?.image} alt='' />
									</div>
								</div>
								<div className='col-lg-10 col-md-9 col-auto pt-2 ps-0'>
									<div className='d-flex align-items-start position-relative w-100'>
										{user?.plan?.name && user?.plan?.name != 'Basic' &&
										user?.plan?.name != 'Free'
										&& (
											<img
												src={'assets/img/favicon.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex align-items-start w-100'>
											<div className=''>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname + (" "+user?.lastname || "")}
												</h2>
												<div className='py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>{t("Club Member")}</span>
												</div>
												<div className='d-flex align-items-center gap-2'>
													<a href='#' className='button'>
														<img src='assets/img/icon/edit.svg' />
														{t('Edit Profile')}
													</a>
													<a
														href='#'
														className='bg-blue py-2 px-3 rounded-10 d-flex align-items-center justify-content-center'
													>
														<img src='assets/img/icon/share2.svg' />
													</a>
													<div className='d-flex gap-2 ps-2'>
														{profileData?.facebook_url && (
															<Link
																to={profileData?.facebook_url}
																target='_blank'
																className=''
															>
																<img width='30' src='assets/img/icon/Facebook.svg' />
															</Link>
														)}
														{profileData?.twitter_url && (
															<Link to={profileData?.twitter_url} target='_blank' className=''>
																<img width='30' src='assets/img/icon/Twitter.svg' />
															</Link>
														)}
														{profileData?.instagram_url && (
															<Link
																to={profileData?.instagram_url}
																target='_blank'
																className=''
															>
																<img width='30' src='assets/img/icon/Instagram.svg' />
															</Link>
														)}
														{profileData?.youtube_url && (
															<Link to={profileData?.youtube_url} target='_blank' className=''>
																<img width='30' src='assets/img/icon/YouTube.svg' />
															</Link>
														)}
													</div>
												</div>
											</div>

											<div className='ms-md-auto pt-md-0 pt-2 profile-ngo-box'>
												<div className='shadow-sm px-2 py-2 d-flex align-items-center gap-2 rounded-15 pe-lg-5'>
													<img
														src={
															user?.associated_ngo?.image
																? Endpoints?.baseUrl + user?.associated_ngo?.image
																: 'assets/img/ngo-logo2.png'
														}
														alt=''
														className='ms-xl-1'
													/>
													<h5 className='fs-16 bold pe-xl-1 fs-sm-9'>
														{user?.associated_ngo?.name}
													</h5>
												</div>

												{!user?.parent && user?.plan?.name != 'Basic' ? (
													<div className='border rounded-10 d-flex align-items-center gap-2 bg-white mt-2 p-2'>
														{profileData?.family_member?.image ? (
															<img
																src={Endpoints.baseUrl + profileData?.family_member?.image}
																className='rounded-circle'
																alt=''
															/>
														) : (
															<i className='rounded-circle'></i>
														)}
														<div>
															<h5
																onClick={() => {
																	// setIsAddFamilyMember(true);
																	// setIsCreateClassified(false);
																}}
																className='fs-16 bold pe-xl-1 fs-sm-9'
															>
																{profileData?.family_member?.firstname || t('Family member name')}
															</h5>
															<Link
																to={!profileData?.family_member ? '/add-family-member' : null}
																onClick={() => {
																	if (profileData?.family_member) {
																		removeFamilyMember();
																	}
																	// else{
																	//     navigate('/add-family-member')
																	// }
																}}
																className='text-blue fs-14 fs-sm-9'
															>
																{profileData?.family_member
																	? t('Remove Family Member')
																	: t('Add Family Member')}
															</Link>
														</div>
													</div>
												) : null}
											</div>
										</div>
									</div>
								</div>
							</div>
							{about && (
								<div className='border-top border-bottom py-4 mb-4 mt-5'>
									<h1 className='fs-30 text-gray1 pb-1 fs-sm-22'>{t('About')}</h1>
									<p className='light m-0'>{profileData?.about}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{user?.user_type == 'business' && (
				<div>
					<div className='profile-banner'>
						<img
							src={Endpoints.baseUrl + profileData?.cover_pic}
							className='w-100 object-cover'
							alt=''
						/>
					</div>

					<div className='profile-top-content pb-lg-4'>
						<div className='container'>
							<div className='row align-items-md-end'>
								<div className='col-lg-2 col-md-3 col-auto'>
									<div className='profile-dp'>
										<img src={Endpoints.baseUrl + profileData?.image} alt='' />
									</div>
								</div>
								<div className='col-lg-10 col-md-9 col-auto pb-3 pt-2 ps-0'>
									<div className='d-flex align-items-start position-relative w-100'>
										{user?.plan?.name && user?.plan?.name != 'Basic' && 
										user?.plan?.name != 'Free' &&
										(
											<img
												src={'assets/img/favicon.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex align-items-start w-100'>
											<div className=''>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname || user?.name}
												</h2>
												<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>
														{profileData?.business_category_details?.name}
													</span>
													{profileData?.location?.city?
													<i className='fa fa-circle text-gray2 px-xl-1'></i>
													:null
													}
													{profileData?.location?.city?
													<span className='fs-14 fs-sm-10'>
														<img src='assets/img/icon/location1.svg' alt='' />
														{
														(profileData?.location?.address!='undefined'? profileData?.location?.address: '') +
														(profileData?.location?.address!='undefined'? ', ': '') +
															profileData?.location?.city +
															', ' +
															profileData?.location?.state +
															', ' +
															profileData?.location?.country}
													</span>
													:null	
												}
												</div>
												<div className='d-flex align-items-center gap-2'>
													<div className='profile-rating d-flex '>
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star-blank.svg' alt='' />
													</div>
													<p className='fs-14 text-blue m-0 fs-sm-9'>4.9 | 200 Reviews</p>
												</div>
											</div>

											<div className='ms-auto pt-md-0 pt-2 profile-ngo-box'>
												<div className='shadow px-2 py-2 d-flex align-items-center gap-2 rounded-15 '>
													<img src='assets/img/ngo-logo2.png' alt='' className='ms-xl-1' />
													<h5 className='fs-16 bold pe-xl-1 fs-sm-9'>
														{user?.associated_ngo?.name}
													</h5>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='col-lg-2 col-md-3 '></div>

								<div className='col-lg-10 col-md-9 ps-lg-4'>
									<div className='d-lg-flex align-items-center justify-content-between ps-xl-2'>
										<div className='d-flex gap-2 align-items-center'>
											<span className='redeem-btn'>
												<img src='assets/img/icon/deal-redeemed.svg' /> 0 {t("Redeemed")}
											</span>
											<a href='#' className='button'>
												<img src='assets/img/icon/edit.svg' width='18' />
												{t('Edit Profile')}
											</a>
											{!profileData?.is_store && 
											<Link
												to={profileData?.extra_location != 0 ? '/add-locations' : ''}
												onClick={() => {
													if (
														profileData?.extra_location === 0 &&
														window.location.pathname == '/business-profile-business-view'
													) {
														setModalVisible('show');
													}
												}}
												className='text-decoration-underline fs-16 text-blue d-inline-block'
											>
												{t("Add More Location")}
											</Link>}
										</div>

										<div className='d-flex gap-2 align-items-center'>
											<Link
												to={profileData?.website_url}
												target='_blank'
												className='button secondary-btn mt-lg-0 mt-2'
											>
												<img src='assets/img/icon/export.svg' />
												{profileData?.website_url}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{(user?.user_type == 'ngo' || user?.user_type == 'Non Profitable Organization') && (
				<div>
					<div className='profile-banner'>
						<img
							src={Endpoints.baseUrl + profileData?.cover_pic}
							className='w-100 object-cover'
							alt=''
						/>
					</div>

					<div className='profile-top-content pb-lg-4'>
						<div className='container'>
							<div className='row align-items-md-end'>
								<div className='col-lg-2 col-md-3 col-auto'>
									<div className='profile-dp'>
										<img src={Endpoints.baseUrl + profileData?.image} alt='' />
									</div>
								</div>
								<div className='col-lg-10 col-md-9 col-auto pb-3 pt-2 ps-0'>
									<div className='d-flex align-items-start position-relative w-100'>
										{user?.plan?.name && user?.plan?.name != 'Basic' && 
										user?.plan?.name != 'Free' &&
										
										(
											<img
												src={'assets/img/favicon.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex align-items-start w-100'>
											<div className=''>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname || user?.name}
												</h2>
												<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>
														{profileData?.business_category_details?.name}
													</span>
													<i className='fa fa-circle text-gray2 px-xl-1'></i>
													{profileData?.location?.city?
													<span className='fs-14 fs-sm-10'>
														<img src='assets/img/icon/location1.svg' alt='' />
														{profileData?.location?.address +
															(profileData?.location?.address && ', ') +
															profileData?.location?.city +
															', ' +
															profileData?.location?.state +
															', ' +
															profileData?.location?.country}
													</span>:null}
												</div>
												<div className='d-flex align-items-center gap-2'>
													<div className='profile-rating d-flex '>
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star.svg' alt='' />
														<img src='assets/img/icon/star-blank.svg' alt='' />
													</div>
													<p className='fs-14 text-blue m-0 fs-sm-9'>
														{profileData?.average_review?.toFixed(1)} | {profileData?.total_reviews}{' '}
														{t('Reviews')}
													</p>
												</div>
											</div>
										</div>
										<div class='ms-auto pt-md-0 pt-2'>
											<Link
												to={profileData?.website_url}
												target='_blank'
												className='button secondary-btn mt-lg-0 mt-2'
											>
												<img src='assets/img/icon/export.svg' />
												{profileData?.website_url}
											</Link>
										</div>
									</div>
								</div>

								<div className='col-lg-2 col-md-3 '></div>

								<div className='col-lg-10 col-md-9 ps-lg-4'>
									<div className='d-flex align-items-center justify-content-between ps-xl-2'>
										<div className='d-lg-flex gap-2 align-items-center'>
											<span className='redeem-btn'>
												<img src='assets/img/icon/bagtick2-sm.svg' />{' '}
												{profileData?.business_associated} {t("Business Associated")}
											</span>
											<span className='redeem-btn'>
												<img src='assets/img/icon/profile2user.svg' />{' '}
												{profileData?.user_associated} {t("User Associated")}
											</span>
											<a href='#' className='button'>
												<img src='assets/img/icon/edit.svg' width='18' />
												{t("Edit profile")}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* modal */}
			<LocationPaymentModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				unitCostData={unitCostData}
			/>
		</div>
	);
}

export default CommonDetailProfile;

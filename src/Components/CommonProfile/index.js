import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import {
	getLoggedInUser,
	getUserToken,
	setCookie,
} from '../../helpers/authUtils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import ProfileNgobox from './ProfileNgoBox';
import CommonImageView from '../CommonImageView';
import WishlistShareVisit from '../OthersProfile/WishlistShareVisit';
import WebsiteVisitBox from './WebsiteVisitBox';
import LocationPaymentModal from '../modals/LocationPaymentModal';
import UpdateNgo from './UpdateNgo';
const $ = window.jQuery;

function CommonProfile({ about, update }) {
	const { t } = useTranslation();
	const [profileData, setProfileData] = useState({});
	const [unitCostData, setUnitCostData] = useState({});
	const [modalVisible, setModalVisible] = useState('');
	const [callProfileApi, setCallProfileApi] = useState(false);
	const user = getLoggedInUser();
	const token = getUserToken();

	useEffect(() => {
		if (update && token) {
			getProfileDetails();
		}
	}, [update]);

	const getUnitCost = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUnitCost);
			if (resp && resp.status) {
				setUnitCostData(resp);
			}
		} catch (e) {}
	};

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
				setCallProfileApi(false);
				sessionStorage.setItem('user', JSON.stringify(resp.data));
				// setCookie('user', resp.data);
			}
			if (resp && resp?.data?.user_type == 'Business') {
				getUnitCost();
			}
		} catch (e) {}
	};


	useEffect(() => {
		if (token) getProfileDetails();
	}, [callProfileApi]);

	return (
		<div>
			{profileData?.user_type == 'Member' && (
				<div>
					<div style={{
						// height: '200px'
					}} className='profile-banner'>
						<CommonImageView
							uri={
								Endpoints.baseUrl + profileData?.cover_pic || Endpoints.defaultCoverPic
							}
							classname='w-100 object-cover'
						/>
					</div>

					<div className='profile-top-content pb-lg-4'>
						<div className='container'>
							<div className='row align-items-md-end'>
								<div className='col-lg-2 col-md-3 col-auto'>
									<div className='profile-dp'>
										<CommonImageView
											uri={
												Endpoints.baseUrl +
												(profileData?.image || Endpoints.defaultProfilePic)
											}
											classname='w-100 object-cover'
										/>
									</div>
								</div>
								<div className='col-lg-10 col-md-9 col-auto pt-2 ps-0'>
									<div className='d-flex align-items-start position-relative w-100'>
										{profileData?.plan?.name && profileData?.plan?.name != 'Basic' && 
										profileData?.plan?.name != 'Free' &&
										(
											<img
												src={'assets/img/hamsa-tik 1.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex justify-content-between w-100'>
											<div className=''>
												<Link
												to={
													user?.user_type && user?.user_type === 'Member'
													? '/user-profile-user-view'
													: user?.user_type === 'Non Profitable Organization'
													? '/ngo-profile-ngo-view'
													: user?.user_type === 'Business'
													? `/business-profile-business-view`
													: user?.user_type === 'news_agency'
													? '/news-agency-profile-view'
													: null
												}
												>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname + ' ' + user?.lastname}
												</h2>
												</Link>
												<div className='py-md-2 py-1'>
													{(profileData?.plan?.name === 'Basic' || profileData?.plan?.name === 'Free') ? t('Member') : t('Club Member')}
												</div>
												<div className='d-flex align-items-center gap-2'>
													<Link to={'/user-profile-setup'} className='button'>
														<img src='assets/img/icon/edit.svg' />
														{t('Edit Profile')}
													</Link>
													<WishlistShareVisit
														removeAddToWislist={true}
														share_url={`/user-profile-other-view?id=${user?.id}`}
													/>
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
											<ProfileNgobox
											isUpdateNgo={true}
											setCallApi={setCallProfileApi}
												// user={user}
												familyMember={true}
												deleteConfirmMessgae={
													'You want to permanently delete this family member'
												}
												profileData={profileData}
												getProfileDetails={getProfileDetails}
											/>
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

			{profileData?.user_type == 'Business' && (
				<div>
					<div className='profile-banner'>
						<CommonImageView
							uri={
								Endpoints.baseUrl + profileData?.cover_pic || Endpoints.defaultCoverPic
							}
							classname={'w-100 object-cover'}
						/>
					</div>

					<div className='profile-top-content pb-lg-4'>
						<div className='container'>
							<div className='row align-items-md-end'>
								<div className='col-lg-2 col-md-3 col-auto'>
									<div className='profile-dp'>
										<CommonImageView uri={Endpoints.baseUrl + profileData?.image} />
									</div>
								</div>
								<div className='col-lg-10 col-md-9 col-auto pb-3 pt-2 ps-0'>
									<div className='d-flex align-items-start position-relative w-100'>
										{profileData?.plan?.name && profileData?.plan?.name != 'Basic' && 
										profileData?.plan?.name != 'Free' &&
										
										(
											<img
												src={'assets/img/hamsa-tik 1.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex justify-content-between w-100'>
											<div className=''>
											<Link
												to={
													user?.user_type && user?.user_type === 'Member'
													? '/user-profile-user-view'
													: (user?.user_type === 'NGO' || user?.user_type === "Non Profitable Organization")
													? '/ngo-profile-ngo-view'
													: user?.user_type === 'Business'
													? `/business-profile-business-view`
													: user?.user_type === 'news_agency'
													? '/news-agency-profile-view'
													: null
												}
												>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname || user?.name}
												</h2>
												</Link>
												<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>
														{profileData?.business_category_details?.name}
													</span>
													<i className='fa fa-circle text-gray2 px-xl-1'></i>
													<span className='fs-14 fs-sm-10'>
													{profileData?.location?.city?
														<img src='assets/img/icon/location1.svg' alt='' />:null}
														{' ' +
															(profileData?.location?.address!='undefined'? (profileData?.location?.address || ''): '') +
															(profileData?.location?.address!='undefined'? (profileData?.location?.address?', ':''): '') +
															(profileData?.location?.city || '') +
															', ' +
															(profileData?.location?.state ||'') +
															', ' +
															(profileData?.location?.country || '')}
													</span>
												</div>
												<div className='d-flex align-items-center gap-2'>
													<Rating
														className='d-flex'
														size={22}
														readonly={true}
														// initialValue={1.5}
														allowFraction={true}
														initialValue={profileData?.average_review}
													/>
													<p className='fs-14 text-blue m-0 fs-sm-9'>
														{profileData?.average_review?.toFixed(1)} |{' '}
														{profileData?.total_reviews} {t('Reviews')}
													</p>
												</div>
											</div>

											<div>
											<Link
												to={
													Endpoints.frontendUrl +
													`/ngo-profile-other-view?id=${profileData?.associated_ngo?.id}`
												}
												className=' profile-ngo-box'
											>
												<div className='shadow px-2 py-2 d-flex align-items-center gap-2 rounded-15 '>
													{profileData?.associated_ngo?.image ? (
														<img
															src={Endpoints.baseUrl + profileData?.associated_ngo?.image}
															alt=''
															className='ms-xl-1'
														/>
													) : (
														<img src='assets/img/icon' alt='' className='ms-xl-1' />
													)}
													<h5 className='fs-16 bold pe-xl-1 fs-sm-9 text-black'>
														{profileData?.associated_ngo?.name}
													</h5>
												</div>
											</Link>

											<UpdateNgo ngo={profileData?.associated_ngo} setCallApi={setCallProfileApi}/>

											</div>
										</div>
									</div>
								</div>

								<div className='col-lg-2 col-md-3 '></div>

								<div className='col-lg-10 col-md-9 '>
									<div className='d-lg-flex align-items-center justify-content-between'>
										<div className='d-flex gap-2 align-items-center'>
											<span className='redeem-btn'>
												<img src='assets/img/icon/deal-redeemed.svg' />{' '}
												{profileData?.redeem_points} {t('Redeemed')}
											</span>
											<a href='/business-profile-setup' className='button'>
												<img src='assets/img/icon/edit.svg' width='18' />
												{t('Edit Profile')}
											</a>

											{!profileData?.is_store && <Link
												to={profileData?.extra_location != 0 ? '/add-locations' : ''}
												onClick={() => {
													if (profileData?.extra_location === 0) {
														setModalVisible('show');

														// $('#add').modal('show');
													}
												}}
												// data-bs-toggle="modal"
												// data-bs-target="#add"
												className='text-decoration-underline fs-16 text-blue d-inline-block'
											>
												{t('Add More Locations')}
											</Link>}
										</div>

										<WebsiteVisitBox website_url={profileData?.website_url} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{profileData?.user_type == 'Non Profitable Organization' && (
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
										{profileData?.plan?.name && profileData?.plan?.name != 'Basic' && 
										profileData?.plan?.name != 'Free' &&
										(
											<img
												src={'assets/img/hamsa-tik 1.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex align-items-start justify-content-between w-100'>
											<div className=''>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{user?.firstname || user?.name}
												</h2>
												<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>
														{profileData?.business_category_details?.name || t('Non-Profit Organization')}
													</span>
													<i className='fa fa-circle text-gray2 px-xl-1'></i>
													<span className='fs-14 fs-sm-10'>
													{profileData?.location?.city?
														<img src='assets/img/icon/location1.svg' alt='' />:null}
														{' ' +
															(profileData?.location?.address!='undefined'? (profileData?.location?.address || ''): '') +
															(profileData?.location?.address!='undefined'? (profileData?.location?.address?', ':''): '') +
															(profileData?.location?.city || '') +
															(profileData?.location?.city?', ':'') +
															(profileData?.location?.state || '') +
															(profileData?.location?.state? ', ':'') +
															(profileData?.location?.country || '')}
													</span>
												</div>
												<div className='d-flex align-items-center gap-2'>
													<Rating
														className='d-flex'
														size={22}
														readonly={true}
														// initialValue={1.5}
														allowFraction={true}
														initialValue={profileData?.average_review}
													/>
													<p className='fs-14 text-blue m-0 fs-sm-9'>
														{profileData?.average_review?.toFixed(1)} |{' '}
														{profileData?.total_reviews} {t('Reviews')}
													</p>
												</div>
											</div>
											{/* </div> */}

											<WebsiteVisitBox website_url={profileData?.website_url} />
										</div>
									</div>
								</div>

								<div className='col-lg-2 col-md-3 '></div>

								<div className='col-lg-10 col-md-9 ps-lg-4'>
									<div className='d-flex align-items-center justify-content-between ps-xl-2'>
										<div className='d-lg-flex gap-2 align-items-center'>
											<span className='redeem-btn'>
												<img src='assets/img/icon/bagtick2-sm.svg' />{' '}
												{profileData?.business_associated} {t('Business Associated')}
											</span>
											<span className='redeem-btn'>
												<img src='assets/img/icon/profile2user.svg' />{' '}
												{profileData?.user_associated} {t('User Associated')}
											</span>
											<a href='/ngo-profile-setup' className='button'>
												<img src='assets/img/icon/edit.svg' width='18' />
												{t('Edit Profile')}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{profileData?.user_type == 'News Agency' && (
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
										{profileData?.plan?.name && profileData?.plan?.name != 'Basic' && 
										profileData?.plan?.name != 'Free' &&
										
										(
											<img
												src={'assets/img/hamsa-tik 1.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<div className='d-md-flex align-items-start w-100'>
											<div className=''>
												<h2 className='text-blue medium fs-26 fs-sm-16'>
													{profileData?.name}
												</h2>
												<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
													<span className='text-gray2 fs-sm-12'>
														{profileData?.business_category_details?.name || 'News Agency'}
													</span>
													<i className='fa fa-circle text-gray2 px-xl-1'></i>
													<span className='fs-14 fs-sm-10'>
														{profileData?.location?.city?
														<img src='assets/img/icon/location1.svg' alt='' />:null}
														{' ' +
															(profileData?.location?.address!='undefined'? profileData?.location?.address: '') +
															(profileData?.location?.address!='undefined'? (profileData?.location?.address?', ':''): '') +
															(profileData?.location?.city || '') +
															(profileData?.location?.city?', ':'') +
															(profileData?.location?.state || '') +
															(profileData?.location?.state?', ':'') +
															(profileData?.location?.country || '')}
													</span>
												</div>
												<div className='d-flex align-items-center gap-2'>
													<Rating
														className='d-flex'
														size={22}
														readonly={true}
														// initialValue={1.5}
														allowFraction={true}
														initialValue={profileData?.average_review}
													/>
													<p className='fs-14 text-blue m-0 fs-sm-9'>
														{profileData?.average_review?.toFixed(1)} |{' '}
														{profileData?.total_reviews} {t('Reviews')}
													</p>
												</div>
											</div>

											<WebsiteVisitBox website_url={profileData?.website_url} />
										</div>
									</div>
								</div>

								<div className='col-lg-2 col-md-3 '></div>

								<div className='col-lg-10 col-md-9 ps-lg-4'>
									<a href='/news-profile-setup' className='button ms-2'>
										<img src='assets/img/icon/edit.svg' width='18' />
										{t('Edit Profile')}
									</a>
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

			{/* <!-- END MODAL --> */}
		</div>
	);
}

export default CommonProfile;

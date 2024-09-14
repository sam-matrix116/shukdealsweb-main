import React from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import ActionButtons from '../ActionButtons';
import CommonImageView from '../../CommonImageView';

function BusinessProfile({ profileData, about, id }) {
	const { t } = useTranslation();
	return (
		<div>
			<div className='profile-banner'>
				<CommonImageView
					uri={
						Endpoints.baseUrl + (profileData?.cover_pic || Endpoints.defaultCoverPic)
					}
					classname={'w-100 object-cover'}
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
								<div className='d-md-flex justify-content-between w-100  '>
									<div className=''>
										<Link to={`/business-profile-user-view?id=${profileData?.id}`}>
										<h2 className='text-blue medium fs-26 fs-sm-16'>
											{profileData?.name}
										</h2>
										</Link>
										<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
											<span className='text-gray2 fs-sm-12'>
												{profileData?.business_category_details?.name}
											</span>
											{profileData?.location?.city?
											<i className='fa fa-circle text-gray2 px-xl-1'></i>
											: null
												}
											<span className='fs-14 fs-sm-10'>
												{profileData?.location?.city?
												<img src='assets/img/icon/location1.svg' alt='' />
												: null}
												{' ' +
													(profileData?.location?.address!='undefined'? (profileData?.location?.address || ''): '') +
													(profileData?.location?.address!='undefined'? (profileData?.location?.city?', ':''): '') +
													(profileData?.location?.city|| '') +
													(profileData?.location?.city?', ':'') +
													(profileData?.location?.state || '') +
													(profileData?.location?.city?', ':'') +
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
												initialValue={profileData?.average_review.toFixed(1)}
											/>
											<p className='fs-14 text-blue m-0 fs-sm-9'>
												{profileData?.average_review.toFixed(1)} |{' '}
												{profileData?.total_reviews + ' ' + t('Reviews')}
											</p>
										</div>
									</div>

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
								</div>
							</div>
						</div>

						<div className='col-lg-2 '></div>

						<ActionButtons
							id={id}
							website_url={profileData?.website_url}
							write_review={true}
							wishlistUrl={Endpoints.addUserWishlist + id}
							added_to_wishlist={profileData?.added_to_wishlist}
							report={true}
							added_to_flag={profileData?.is_flagged}
							redeemed={profileData?.redeem_points}
						/>
					</div>
					{about && (
						<div className='border-top border-bottom py-4 mb-4 mt-5'>
							<h1 className='fs-30 text-gray1 pb-1 fs-sm-22'>
								{t('About')} {t('Store')}
							</h1>
							<p className='light mb-4'>{profileData?.about}</p>
							<div className='row pe-lg-5'>
								<div className='col-lg-3 col-md-4 col-6 pb-md-0 pb-4'>
									<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t('Contact Us')}</h6>
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
										<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t('Follow Us')}</h6>
										<div className='d-flex gap-2'>
											{profileData?.facebook_url && (
												<Link to={profileData?.facebook_url} target='_blank' className=''>
													<img src='assets/img/icon/Facebook.svg' />
												</Link>
											)}
											{profileData?.twitter_url && (
												<Link to={profileData?.twitter_url} target='_blank' className=''>
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

								{profileData?.delivery_partners?.length ? (
									<div className='col-md-3 col-6'>
										<h6 className='text-gray1 pb-2 medium fs-sm-14'>
											{t('Delivery Partners')}
										</h6>
										<div style={{ display: 'flex', alignItems: 'center' }}>
											{profileData.delivery_partners?.map((item, index) => {
												return (
													<div style={{ marginLeft: '5px' }} key={index}>
														{/* {item?.name +
															(index != profileData.delivery_partners.length - 1 ? ', ' : '')} */}
														<img
															style={{
																borderRadius: '5px',
															}}
															height={25}
															width={25}
															src={Endpoints.baseUrl + item?.image}
															alt=''
														/>
													</div>
												);
											})}
										</div>
									</div>
								) : null}
								{profileData?.menu?.menu && (
									<div className='col-md-2 col-6'>
										<h6 className='text-gray1 pb-2 medium fs-sm-14'>{t('View Menu')}</h6>
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
					)}
				</div>
			</div>
		</div>
	);
}

export default BusinessProfile;

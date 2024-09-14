import React from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import { Link } from 'react-router-dom';
import WishlistShareVisit from '../WishlistShareVisit';
import { Rating } from 'react-simple-star-rating';
import ActionButtons from '../ActionButtons';
import CommonImageView from '../../CommonImageView';

function NgoProfile({ profileData, about, id }) {
	const { t } = useTranslation();
	return (
		<div>
			<div className='profile-banner'>
				<CommonImageView
					uri={
						Endpoints.baseUrl + (profileData?.cover_pic || Endpoints.defaultCoverPic)
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
						<div className='col-lg-10 col-md-9 col-auto pb-3 pt-2 ps-0'>
							<div className='d-flex align-items-start position-relative w-100'>
								<img
									src={'assets/img/favicon.svg'}
									className='me-md-2 me-1 profile-site-logo'
									width='27'
									alt=''
								/>
								<div className='d-md-flex justify-content-between w-100'>
									<div className=''>
										<Link to={`/ngo-profile-other-view?id=${profileData?.id}`}>
										<h2 className='text-blue medium fs-26 fs-sm-16'>
											{profileData?.name}
										</h2>
										</Link>
										<div className='d-flex align-items-center gap-2 banner-location py-md-2 py-1'>
											<span className='text-gray2 fs-sm-12'>{t('NGO')}</span>
											{
												profileData?.location?.city?
												<i className='fa fa-circle text-gray2 px-xl-1'></i>
												:null
											}
											{
												profileData?.location?.city?
											<span className='fs-14 fs-sm-10'>
												<img src='assets/img/icon/location1.svg' alt='' />
												{' ' +
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
											<Rating
												className='d-flex'
												size={22}
												readonly={true}
												allowFraction={true}
												initialValue={profileData?.average_review.toFixed(1)}
											/>
											<p className='fs-14 text-blue m-0 fs-sm-9'>
												{profileData?.average_review.toFixed(1)} |{' '}
												{profileData?.total_reviews + ' ' + t('Reviews')}
											</p>
										</div>
									</div>
									{/* </div> */}
									<div className='  pt-md-0 pt-2'>
										<div className='d-flex align-items-start gap-2'>
											<WishlistShareVisit
												apiUrl={Endpoints.addUserWishlist + id}
												added_to_wishlist={profileData?.added_to_wishlist}
												website_url={profileData?.website_url}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-2 '></div>

						<ActionButtons
							business_associated={profileData?.business_associated}
							user_associated={profileData?.user_associated}
							write_review={true}
							report={true}
							id={id}
							added_to_flag={profileData?.is_flagged}
						/>
					</div>
					{about && (
						<div className='border-top border-bottom py-4 mb-4 mt-5'>
							<h1 className='fs-30 text-gray1 pb-1 fs-sm-22'>
								{t('About')} {profileData?.name}
							</h1>
							<p className='light m-0'>{profileData?.about}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default NgoProfile;

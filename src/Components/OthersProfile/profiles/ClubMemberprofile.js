import React from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import { Link } from 'react-router-dom';
import WishlistShareVisit from '../WishlistShareVisit';
import CommonImageView from '../../CommonImageView';

function ClubMemberprofile({ profileData, about, id }) {
	const { t } = useTranslation();
	console.log('profileData', profileData);
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
								<div className='d-md-flex justify-content-between w-100  '>
									<div className=''>
										<Link to={`/user-profile-other-view?id=${profileData?.id}`}>
										<h2 className='text-blue medium fs-26 fs-sm-16'>
											{profileData?.firstname + (" "+profileData?.lastname || "")}
										</h2>
										</Link>
										<div className='py-md-2 py-1'>
											<span className='text-gray2 fs-sm-12'>
												{profileData?.plan && profileData?.plan?.name !== 'Basic'
												&& profileData?.plan?.name !== 'Free'
													? t('Club Member')
													: t('Member')}
											</span>
										</div>
										<div className='d-flex align-items-center gap-2'>
											<WishlistShareVisit
												apiUrl={Endpoints.addUserWishlist + id}
												added_to_wishlist={profileData?.added_to_wishlist}
												share_url={`/user-profile-other-view?id=${id}`}
											/>

											<div className='d-flex gap-2 ps-2'>
												{profileData?.facebook_url && (
													<Link to={profileData?.facebook_url} target='_blank' className=''>
														<img width='30' src='assets/img/icon/Facebook.svg' />
													</Link>
												)}
												{profileData?.twitter_url && (
													<Link to={profileData?.twitter_url} target='_blank' className=''>
														<img width='30' src='assets/img/icon/Twitter.svg' />
													</Link>
												)}
												{profileData?.instagram_url && (
													<Link to={profileData?.instagram_url} target='_blank' className=''>
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

									<Link
										to={
											Endpoints.frontendUrl +
											`/ngo-profile-other-view?id=${profileData?.associated_ngo?.id}`
										}
										className=' profile-ngo-box'
									>
										<div className='shadow-sm px-2 py-2 d-flex align-items-center gap-2 rounded-15 pe-lg-5'>
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
	);
}

export default ClubMemberprofile;

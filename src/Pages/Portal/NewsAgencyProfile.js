import React from 'react';
import { useTranslation } from "react-i18next";
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { useState } from 'react';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import { useEffect } from 'react';
import CommonReviewBox from '../../Components/CommonReviewBox';

function NewsAgencyProfile() {
    const { t } = useTranslation();
	const [profileData, setProfileData] = useState([]);
	const token = getUserToken();
	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			// console.log('profile__', JSON.stringify(resp,null,4))
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (token) getProfileDetails();
	}, []);

	return (
		<div
		// className="wrapper"
		>
			<CustomHeader />

			<div className='main'>
				<CommonProfile />

				<div className='container'>
					<div className='py-4 border-bottom border-top'>
						<h1 className='fs-30 text-gray1 pb-2 fs-sm-22'>{t("About")} {profileData?.name}
						</h1>
						<p className='light mb-0 text-justify text-gray2'>{profileData?.about}</p>
					</div>

					<div className='py-4'>
						<div className='d-flex align-items-start gap-2 pb-3'>
							<h2 className='fs-30 text-gray1 fs-sm-22'>{t("News & Articles")}</h2>
							<a href='#' className='button py-2'>
								<i className='fa-light fa-circle-plus'></i> {t("Post News & Articles")}
							</a>
						</div>
						<div className='row'>
							<div className='col-lg-8'>
								<div className='row pb-4'>
									<div className='col-md-6'>
										<img
											src='assets/img/blog2.png'
											className='w-100 h-100 rounded-10 object-cover'
											alt=''
										/>
									</div>
									<div className='col-md-6'>
										<span className='fs-16 fs-sm-9 blog-cat mb-2 mt-md-0 mt-2 text-blue d-inline-block'>
											Entertainment
										</span>
										<h2 className='text-blue fs-22 fs-sm-18 medium pb-2'>
											BTS earn their first #1 hit on Billboard's Vinyl Albums chart ...
										</h2>
										<span className='blog-date fs-14 d-block text-gray1 pb-2 fs-sm-11'>
											Jan 12, 2023 6:30am
										</span>
										<p className='fs-16 text-gray2 light'>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
											eiusmod tempor incididunt ut labore et dolore magna aliqua.
										</p>
										<a href='#' className='bg-blue px-3 py-2 rounded-10 d-inline-block'>
											<img src='assets/img/icon/share.svg' className='py-1 icon-blue' />
										</a>
									</div>
								</div>
								<div className='row pb-lg-0 pb-4 px-md-0 px-5'>
									<div className='col-md-4 pb-md-0 pb-3'>
										<div className='blog-list p-2 rounded-10 shadow'>
											<img src='assets/img/blog-img.png' className='w-100' alt='' />
											<span className='fs-12 my-2 fs-sm-9 blog-cat text-blue d-inline-block'>{t("Services")}
											</span>
											<h6 className='medium fs-16 py-1 text-blue'>
												IT major Infosys ranked among top 3 IT services
											</h6>
											<div>
												<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
													Jan 12, 2023 6:30am
												</span>
												<a href='#' className='bg-blue px-3 py-2 rounded-10 d-inline-block'>
													<img src='assets/img/icon/share.svg' className='py-1 icon-blue' />
												</a>
											</div>
										</div>
									</div>
									<div className='col-md-4 pb-md-0 pb-3'>
										<div className='blog-list p-2 rounded-10 shadow'>
											<img src='assets/img/blog-img.png' className='w-100' alt='' />
											<span className='fs-12 my-2 fs-sm-9 blog-cat text-blue d-inline-block'>
												Entertainment
											</span>
											<h6 className='medium fs-16 py-1 text-blue'>
												Netflix brings new features to iPhone app
											</h6>
											<div>
												<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
													Jan 12, 2023 6:30am
												</span>
												<a href='#' className='bg-blue px-3 py-2 rounded-10 d-inline-block'>
													<img src='assets/img/icon/share.svg' className='py-1 icon-blue' />
												</a>
											</div>
										</div>
									</div>
									<div className='col-md-4 pb-md-0 pb-3'>
										<div className='blog-list p-2 rounded-10 shadow'>
											<img src='assets/img/blog-img.png' className='w-100' alt='' />
											<span className='fs-12 my-2 fs-sm-9 blog-cat text-blue d-inline-block'>
												Real Estate
											</span>
											<h6 className='medium fs-16 py-1 text-blue'>{t("In")}dian real estate market continues to thrive despite...
											</h6>
											<div>
												<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
													Jan 12, 2023 6:30am
												</span>
												<a href='#' className='bg-blue px-3 py-2 rounded-10 d-inline-block'>
													<img src='assets/img/icon/share.svg' className='py-1 icon-blue' />
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='col-lg-4'>
								<div className='related-blog'>
									<div className='d-flex gap-2 align-items-start mb-3'>
										<img
											src='assets/img/blog3.png'
											width='130'
											height='100'
											className='rounded-10'
											alt=''
										/>
										<div>
											<span className='fs-12  fs-sm-9 blog-cat  text-blue d-inline-block'>
												Entertainment
											</span>
											<h6 className='medium text-blue fs-sm-14 py-1'>
												Entertainment is the big reason for Waltair Veerayya
											</h6>
											<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
												Jan 12, 2023 6:30am
											</span>
										</div>
									</div>

									<div className='d-flex gap-2 align-items-start mb-3'>
										<img
											src='assets/img/blog3.png'
											width='130'
											height='100'
											className='rounded-10'
											alt=''
										/>
										<div>
											<span className='fs-12  fs-sm-9 blog-cat  text-blue d-inline-block'>
												Entertainment
											</span>
											<h6 className='medium text-blue fs-sm-14 py-1'>
												Entertainment is the big reason for Waltair Veerayya
											</h6>
											<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
												Jan 12, 2023 6:30am
											</span>
										</div>
									</div>

									<div className='d-flex gap-2 align-items-start mb-3'>
										<img
											src='assets/img/blog3.png'
											width='130'
											height='100'
											className='rounded-10'
											alt=''
										/>
										<div>
											<span className='fs-12  fs-sm-9 blog-cat  text-blue d-inline-block'>
												Entertainment
											</span>
											<h6 className='medium text-blue fs-sm-14 py-1'>
												Entertainment is the big reason for Waltair Veerayya
											</h6>
											<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
												Jan 12, 2023 6:30am
											</span>
										</div>
									</div>

									<div className='d-flex gap-2 align-items-start mb-3'>
										<img
											src='assets/img/blog3.png'
											width='130'
											height='100'
											className='rounded-10'
											alt=''
										/>
										<div>
											<span className='fs-12  fs-sm-9 blog-cat  text-blue d-inline-block'>
												Entertainment
											</span>
											<h6 className='medium text-blue fs-sm-14 py-1'>
												Entertainment is the big reason for Waltair Veerayya
											</h6>
											<span className='blog-date fs-12 text-gray1 pt-1 fs-sm-11'>
												Jan 12, 2023 6:30am
											</span>
										</div>
									</div>
								</div>
								<a href='#' className='button w-100 fs-20 fs-14'>{t("View All")} Blogs &amp; Articles
								</a>
							</div>
						</div>
					</div>

					<div className='py-4'>
						<div className='d-flex justify-content-between border-bottom align-items-center mb-3'>
							<ul className='ngo-list d-flex  fs-26 fs-sm-12 text-gray2 gap-5'>
								<li>
									<a href='#' className='active'>
										{' '}
										{t("Listing")}
									</a>
								</li>
								<li>
									<a href='#'>{t("Jobs")}</a>
								</li>
							</ul>
							<a href='#' className='button py-2 mb-1 fs-sm-12'>
								<i className='fa-light fa-circle-plus'></i> Add Listing
							</a>
						</div>
						<div className='row'>
							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Get Annual Charity Gala Event (For Fundraising)..{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												NOG Logo Collar ALive Mattee T-Shirt{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Curated Box with Flag Bunting{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Get 2 Tickets of Museum of Illusions{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-gray2'>
														200 Redeemed
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-blue'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Get Film Festival -2023 Tickets{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Buy 2 Coffee With Your Partner{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Participate in Annual Marathon - 2023{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>200 Redeemed</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 text-blue fs-sm-9'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/ngo-list-banner.png'
										alt=''
										height='135'
										className='w-100 home-box-banner object-cover'
									/>
									<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
										<img src='assets/img/hamsa-tik 1.svg' className='mt-1' alt='' />
										<div>
											<h5 className='fs-18 medium fs-sm-14 pb-2'>
												Exciting Offers and Many More in the Event{' '}
											</h5>
											<div className='row m-0 align-items-center'>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-gray2'>
														200 Redeemed
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-gray2'>
														<img src='assets/img/icon/star.svg' width='15' className='me-1' />
														4.4
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='light fs-14 fs-sm-9 text-gray2 text-blue'>
														<img src='assets/img/icon/building3.svg' className='me-1' />
														Use Offline
													</p>
												</div>
												<div className='col-6 ps-0 pe-1'>
													<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
														<img
															src='assets/img/icon/timer2.svg'
															className='me-1'
															width='14'
														/>
														2 {t("Days Left")}
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='d-flex align-items-center mb-3 w-100'>
										<div className='home-club-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 medium fs-sm-9'>{("Club Member")}</h5>
											<h6 className='text-blue medium fs-sm-14'>$50 Off</h6>
										</div>
										<div className='home-nonclub-member py-2 px-lg-3 px-2'>
											<h5 className='fs-12 light fs-sm-9'>{t("Non-Club Member")}</h5>
											<h6 className='text-gray2 medium fs-sm-14'>$20 Off</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='paginations pt-3'>
							<a href='#' className='prev-btn'>
								<i className='fa fa-arrow-left pe-2'></i>{t("Previous")}
							</a>
							<a href='#' className='page-active'>
								01
							</a>
							<a href='#' className=''>
								02
							</a>
							<a href='#' className=''>
								03
							</a>
							<a href='#' className=''>
								04
							</a>
							<a href='#' className=''>
								05
							</a>
							<a href='#' className='next-btn btn-active'>{t("Next")} <i className='fa fa-arrow-right ps-2'></i>
							</a>
						</div>
					</div>

					<div className=''>
						<h2 className='fs-30 fs-sm-18 pb-3'>Favorite</h2>

						<div className='row'>
							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='ngo-column position-relative rounded-20 overflow-hidden border'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/store-banner.png'
										alt=''
										height='100'
										className='w-100 home-ngo-img object-cover'
									/>
									<div className='text-center px-2 pb-3'>
										<div className='home-ngo-logo bg-white rounded-circle'>
											<img
												src='assets/img/store-logo.png'
												width='75'
												height='75'
												className='rounded-circle'
												alt=''
											/>
										</div>
										<span className='box-20 rounded-circle bg-white'>
											<img
												src='assets/img/hamsa-tik 1.svg'
												width='16'
												height='16'
												alt=''
											/>
										</span>
										<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>Pizza Hut</h4>
										<div className='d-flex align-items-center gap-2 justify-content-center'>
											<div className='rating d-flex '>
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star-blank.svg' alt='' />
											</div>
											<p className='fs-14 text-turquois m-0 fs-sm-9'>4.9 | 3289 Reviews</p>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='ngo-column position-relative rounded-20 overflow-hidden border'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/store-banner.png'
										alt=''
										height='100'
										className='w-100 home-ngo-img object-cover'
									/>
									<div className='text-center px-2 pb-3'>
										<div className='home-ngo-logo bg-white rounded-circle'>
											<img
												src='assets/img/store-logo.png'
												width='75'
												height='75'
												className='rounded-circle'
												alt=''
											/>
										</div>
										<span className='box-20 rounded-circle bg-white'>
											<img
												src='assets/img/hamsa-tik 1.svg'
												width='16'
												height='16'
												alt=''
											/>
										</span>
										<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>Acme Co.</h4>
										<div className='d-flex align-items-center gap-2 justify-content-center'>
											<div className='rating d-flex '>
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star-blank.svg' alt='' />
											</div>
											<p className='fs-14 text-turquois m-0 fs-sm-9'>4.9 | 3289 Reviews</p>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='ngo-column position-relative rounded-20 overflow-hidden border'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/store-banner.png'
										alt=''
										height='100'
										className='w-100 home-ngo-img object-cover'
									/>
									<div className='text-center px-2 pb-3'>
										<div className='home-ngo-logo bg-white rounded-circle'>
											<img
												src='assets/img/store-logo.png'
												width='75'
												height='75'
												className='rounded-circle'
												alt=''
											/>
										</div>
										<span className='box-20 rounded-circle bg-white'>
											<img
												src='assets/img/hamsa-tik 1.svg'
												width='16'
												height='16'
												alt=''
											/>
										</span>
										<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>Barone LLC.</h4>
										<div className='d-flex align-items-center gap-2 justify-content-center'>
											<div className='rating d-flex '>
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star-blank.svg' alt='' />
											</div>
											<p className='fs-14 text-turquois m-0 fs-sm-9'>4.9 | 3289 Reviews</p>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-3 col-md-6 col-6 mb-3'>
								<div className='ngo-column position-relative rounded-20 overflow-hidden border'>
									<div className='position-absolute top-0 end-0 p-2'>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/wish.svg' width='15' />
										</a>
										<a href='#' className='icon-30 text-gray1'>
											<img src='assets/img/icon/share.svg' width='15' />
										</a>
									</div>
									<img
										src='assets/img/store-banner.png'
										alt=''
										height='100'
										className='w-100 home-ngo-img object-cover'
									/>
									<div className='text-center px-2 pb-3'>
										<div className='home-ngo-logo bg-white rounded-circle'>
											<img
												src='assets/img/store-logo.png'
												width='75'
												height='75'
												className='rounded-circle'
												alt=''
											/>
										</div>
										<span className='box-20 rounded-circle bg-white'>
											<img
												src='assets/img/hamsa-tik 1.svg'
												width='16'
												height='16'
												alt=''
											/>
										</span>
										<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>
											Big Kahuna Burger Ltd.
										</h4>
										<div className='d-flex align-items-center gap-2 justify-content-center'>
											<div className='rating d-flex '>
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star.svg' alt='' />
												<img src='assets/img/icon/star-blank.svg' alt='' />
											</div>
											<p className='fs-14 text-turquois m-0 fs-sm-9'>4.9 | 3289 Reviews</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<CommonReviewBox categoryType={'user'} passId={profileData?.id} />
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default NewsAgencyProfile;

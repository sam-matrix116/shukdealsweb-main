import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { getLoggedInUser } from '../../helpers';

function CustomFooter({ internal}) {
	const user = getLoggedInUser();


    const { t } = useTranslation();
	return (
		<div className='footer'>
			{/* {internal ? (
				<div className='footer-top position-relative pt-lg-5 pt-4'>
					<div className='container subscribe rounded-10 px-3 py-4 mb-4  '>
						<div className='row  align-items-center'>
							<div className='col-lg-5 col-md-6 text-white text-md-start text-center ps-lg-4'>
								<h5 className='fs-20 light pb-1 fs-sm-16'>
									Get latest information of your donation
								</h5>
								<h4 className='light pb-md-0 pb-3 fs-sm-20'>Subscribe Newsletter</h4>
							</div>
							<div className='col-lg-7 col-md-6 px-lg-5 text-md-end text-center'>
								<button className='button rounded-pill px-lg-5 bg-white'>{t("Subscribe Now")}
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null} */}
			<div className='footer footer-login'>
				<div className='container footer-bottom'>
					<div className='row pt-4 pb-3 border-bottom align-items-center'>
						<div className='site-logo col-lg-4 col-md-2 order-md-2 pb-md-0 pb-3'>
							<div className='text-center d-block'>
								<img src='assets/img/site-logo.svg' alt='shukDeals' />
							</div>
						</div>
						<div className='col-lg-4 col-md-5 ps-lg-0 order-md-1 pb-md-0 pb-3 pe-md-0'>
							<div className='d-flex gap-lg-4 gap-3 justify-content-md-start justify-content-center'>
								<Link to={'/about-us'} className='text-gray1 '>{t("About Us")}
								</Link>
								<Link to={'/contact-us'} className='text-gray1 '>{t("Contact Us")}
								</Link>
								{/* <Link to={'/support'} className='text-gray1 '>
									Support
								</Link> */}
								<Link to={'/help-center'} className='text-gray1 '>
									{t("Help Center")}
								</Link>
							</div>
						</div>
						<div className='col-lg-4 col-md-5 pe-lg-0 order-md-3 pb-md-0 '>
							<div className='d-flex justify-content-md-end justify-content-center gap-4'>
								{/* <a href='#' className='text-gray2 '>
									<i className='fa-brands fa-facebook fs-18'></i>
								</a>
								<a href='#' className='text-gray2 '>
									<i className='fa-brands fa-twitter fs-18'></i>
								</a>
								<a href='#' className='text-gray2 '>
									<i className='fa-brands fa-instagram fs-18'></i>
								</a>
								<a href='#' className='text-gray2 '>
									<i className='fa-brands fa-linkedin fs-18'></i>
								</a> */}
							</div>
						</div>
					</div>
					<div className='row pt-3 pb-md-4 pb-3 '>
						<div className='col-md-6 ps-lg-0'>
							<p className='fs-14 text-blue mb-md-0 mb-2 text-md-start text-center'>
								{t("© 2022 ShukDeals All rights reserved.")}
							</p>
						</div>
						<div className='col-md-6 pe-lg-0'>
							<div className='d-flex gap-4 justify-content-md-end justify-content-center'>
								<Link to={'/terms-conditions'} className='fs-16 text-gray1'>
									{t("Terms & Conditions")}
								</Link>
								<Link to={'/privacy-policy'} className='fs-16 text-gray1'>{t("Privacy Policy")}
								</Link>
							</div>
						</div>
					</div>
				</div>

				{internal && (
					<div className='d-lg-none d-block mob-footer'>
						<div className='container'>
							<div className='row'>
								<Link to={'/'} className='col-4'>
									<div
										to={'/'}
										className={
											window.location.pathname === '/' ||
											window.location.pathname === '/landing'
												? 'list text-center active'
												: 'list text-center'
										}
									>
										<img src='assets/img/icon/home.svg' alt='' />
										<h4 className='fs-14'>{t("Home")}</h4>
									</div>
								</Link>
								<Link to={'/wishlist'} className='col-4'>
									<div
										className={
											window.location.pathname === '/wishlist'
												? 'list text-center active'
												: 'list text-center'
										}
									>
										<img src='assets/img/icon/fav.svg' alt='' />
										<h4 className='fs-14'>{t("Favourites")}</h4>
									</div>
								</Link>
								<Link
									to={
										user?.user_type == 'Member'
											? '/user-profile-user-view'
											: (user?.user_type == 'NGO' || user?.user_type === "Non Profitable Organization")
											? '/ngo-profile-ngo-view'
											: user?.user_type == 'Business'
											? '/business-profile-business-view'
											: '/news-agency-profile-view'
									}
									className='col-4'
								>
									<div
										className={
											window.location.pathname.includes('profile')
												? 'list text-center active'
												: 'list text-center'
										}
									>
										<img src='assets/img/icon/account.svg' alt='' />
										<h4 className='fs-14'>{t("Account")}</h4>
									</div>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default CustomFooter;

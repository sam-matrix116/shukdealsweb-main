import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import ToastMessage from '../../../Utils/ToastMessage';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import { getChoosenCurrency, getUserToken } from '../../../helpers/authUtils';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';

function CommonRecommendationRow({
	givenData,
	headTitle,
	headSize,
	userId,
	removeTitle,
	recommendedType,
	paginationSize,
	activatePagination,
	viewallLink,
	viewallTab,
	viewAllBtn = true,
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const user_currency = getChoosenCurrency();
	const [data, setData] = useState();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl:
			recommendedType === 'users'
				? Endpoints.getRecommendedDeals
				: recommendedType === 'others' &&
				  Endpoints.getUsersRecommendedDeals + userId,
		paginationCountSize: paginationSize,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: '/deal-details',
			search: `?id=${item.id}`,
		});
	};
	const handleViewAll = (e) => {
		e.preventDefault();
		if (userId) {
			navigate('/category-listing-recommendation', {
				state: {
					id: userId,
				},
			});
		} else {
			navigate(
				{
					pathname: '/wishlist',
				},
				{
					state: {
						favoriteTab: viewallTab,
					},
				}
			);
		}
	};
	const getExpiryDays = (expiry_date) => {
		if (new Date(expiry_date) < new Date()) return 'Expired';
		return moment(expiry_date).diff(new Date(), 'days') + " " + t('Days Left');
	};

	const addDealWishlist = async (id) => {
		try {
			let resp = await FetchApi(Endpoints.addDealWishlist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (!givenData) {
			// this is the API calling funtion
			paginationApiHelper(
				paginationData.currentUrl,
				true,
				paginationData,
				setPaginationData,
				setData
			);
		} else if (givenData) {
			setData(givenData);
		}
	}, [givenData]);
	return (
		<>
			{!removeTitle && (
				<div className='d-flex  align-items-center justify-content-between pb-md-3 pb-2'>
					{data?.length ? (
						<>
							{headSize ? (
								<h3 className='fs-30 fs-sm-24 text-gray1 pb-3'>{headTitle}</h3>
							) : (
								<h2 className='fs-30 fs-sm-18'> {headTitle}</h2>
							)}
						</>
					) : null}
					{data?.length >= 4 && viewAllBtn && (
						<Link
							onClick={handleViewAll}
							className='text-decoration-underline text-blue fs-sm-13'
						>
							{t('View All')}
						</Link>
					)}
				</div>
			)}
			<div className='row'>
				{data?.map((item, index) => (
					<>
						{item?.business_sub_category == 12 ||
						item?.business_sub_category == 10 ? (
							<div className='selectContainer col-lg-3 col-6 d-flex  pb-3'>
								<div className='deals-column shadow shadow position-relative rounded-20 overflow-hidden w-100'>
									<AddWishlistShare
										api={addDealWishlist}
										id={item?.id}
										added_to_wishlist={item?.added_to_wishlist}
										url={`/deal-details?id=${item.id}`}
									/>
									<div onClick={() => onClickNavigation(item)}>
										<img
											src={Endpoints.baseUrl + item?.images?.[0].image}
											alt=''
											height='140'
											adow
											className='w-100 object-cover'
										/>
										<div className='px-2 py-3'>
											<h4 className='fs-14 text-gray2 pb-2 d-flex'>
												<img
													src='assets/img/icon/o-location.svg'
													width='15'
													className='me-2'
													alt='shukDeals'
												/>
												{item?.location?.city +
													', ' +
													item?.location.state +
													', ' +
													item?.location?.country}
											</h4>
											<h3 className='fs-18 fs-sm-14 text-gray1 medium pb-md-3 pb-2'>
												{item?.title}
											</h3>

											<div className='d-lg-flex justify-content-between align-items-center'>
												<h4 className='fs-20 text-blue medium'>
													{item?.business_sub_category == 12
														? user_currency?.sign + item?.property_details?.price.toFixed(2)
														: item?.property_details?.offer_text}
													<span className='fs-14 text-gray2 light d-block'>
														{item?.property_details?.property_type}
													</span>
												</h4>
												<h5 className='fs-14 medium text-blue'>
													<img src='assets/img/icon/phone.svg' width='15' alt='shukDeals' />{' '}
													{t('Contact Now')}
												</h5>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='col-lg-3 col-md-4 col-6 mb-3'>
								<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
									<AddWishlistShare
										api={addDealWishlist}
										id={item?.id}
										added_to_wishlist={item?.added_to_wishlist}
										url={`/deal-details?id=${item.id}`}
									/>
									<div
										onClick={() => onClickNavigation(item)}
										className='selectContainer'
									>
										<img
											src={Endpoints.baseUrl + item?.images[0]?.image}
											alt=''
											height='135'
											className='w-100 home-box-banner object-cover'
										/>
										<div className='p-1 p-sm-2  d-flex align-items-start gap-2'>
											{item?.creator_details?.plan !== 'Basic' && (
												<img
													src='assets/img/hamsa-tik 1.svg'
													width='16'
													height='16'
													alt=''
												/>
											)}
											<div>
												<h5 className='fs-18 medium fs-sm-14 pb-2'>{item?.title}</h5>
												<div className='row m-0 align-items-center'>
													<div className='col-6 ps-0 pe-1'>
														<p className='light fs-14 fs-sm-9 text-gray2'>
															{item?.total_redeemed} {t('Redeemed')}
														</p>
													</div>
													<div className='col-6 ps-0 pe-1'>
														<p className='light fs-14 fs-sm-9 text-gray2'>
															<img
																src='assets/img/icon/star.svg'
																width='15'
																className='me-1'
															/>
															{item?.avg_rating?.toFixed(1)}
														</p>
													</div>
													<div className='col-6 ps-0 pe-1'>
														<OnlineOfflineIcon deal_type={item?.deal_type} />
													</div>
													<div className='col-6 ps-0 pe-1'>
														<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
															<img
																src='assets/img/icon/timer2.svg'
																className='me-1'
																width='14'
															/>
															{getExpiryDays(item?.expiry_date)}
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className='d-flex align-items-center mb-3 w-100'>
											<div className='home-club-member py-2 px-lg-3 px-2'>
												<h5 className='fs-12 medium fs-sm-9'>{t('Club Member')}</h5>
												{item?.club_member_discount_type == 'fixed' ? (
													// <div className="row m-0">
													// <img className="col m-0" src={Endpoints.baseUrl + user?.currency_icon}/>
													<h6 className='text-blue medium fs-sm-14 col'>
														{user_currency?.sign + item?.club_member_discount_value + ' ' + t("OFF")}
													</h6>
												) : (
													// </div>:
													<h6 className='text-blue medium fs-sm-14'>
														{item?.club_member_discount_value + ' % ' + t("OFF")}
													</h6>
												)}
											</div>
											<div className='home-nonclub-member py-2 px-lg-3 px-2'>
												<h5 className='fs-12 light fs-sm-9'>{t('Non-Club Member')}</h5>
												{item?.free_member_discount_type == 'fixed' ? (
													<h6 className='text-gray2 medium fs-sm-14'>
														{user_currency?.sign + item?.free_member_discount_value + ' ' + t("OFF")}
													</h6>
												) : (
													<h6 className='text-gray2 medium fs-sm-14'>
														{item?.free_member_discount_value + '% ' + t("OFF")}
													</h6>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				))}
			</div>
			{activatePagination && (
				<Pagination
					paginationData={paginationData}
					setPaginationData={setPaginationData}
					setData={setData}
				/>
			)}
		</>
	);
}

export default CommonRecommendationRow;

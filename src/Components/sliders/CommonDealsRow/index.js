import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { useEffect } from 'react';
import { Pagination, paginationApiHelper } from '../../CommonPagination';
import {
	getChoosenCurrency,
	getLoggedInUser,
	getUserToken,
} from '../../../helpers/authUtils';
import useSearchContext from '../../../context/searchContext';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';

function CommonDealsRow({
	dealId,
	givenData,
	givenUrl,
	dataValue,
	headTitle,
	viewAllLink,
	viewAllLinkState,
	detailViewLink,
	removeTitle,
	paginationSize,
	activatePagination,
	params,
	dataRetriveValue,
	setDataRetriveCount,
}) {
	const { t } = useTranslation();
	const user_currency = getChoosenCurrency();
	const [data, setData] = useState();
	const navigate = useNavigate();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl,
		paginationCountSize: paginationSize,
	});
	// console.log('dtrestrict__', dataRetriveValue);

	const onClickNavigation = (item) => {
		navigate({
			pathname: '/deal-details',
			search: `?id=${item.id}`,
		});
	};
	const handleViewAll = (e) => {
		e.preventDefault();
		navigate(
			{
				pathname: viewAllLink,
			},
			{ state: viewAllLinkState }
		);
	};

	const addDealsWishlist = async (id) => {
		try {
			let resp = await FetchApi(Endpoints.addDealWishlist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (!givenData && givenUrl) {
			// this is the API calling funtion
			paginationApiHelper(
				paginationData.currentUrl,
				true,
				paginationData,
				setPaginationData,
				setData,
				params,
				null,
				dataRetriveValue,
				dealId
			);
		} else if (givenData) {
			setData(givenData);
		}
	}, [givenData, params]);

	useEffect(() => {
		if (setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);
	return (
		<>
			{data?.length > 0 && (
				<div className='pb-4'>
					{!removeTitle && (
						<div className='d-flex align-items-center justify-content-between pb-md-3 pb-2'>
							{data?.length > 0 && <h2 className='fs-30 fs-sm-18'>{t(headTitle)}</h2>}
							{data?.length >= 4 && dataValue != 'all' && viewAllLink && (
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
										<div className='deals-column shadow position-relative rounded-20 overflow-hidden w-100'>
											<AddWishlistShare
												api={addDealsWishlist}
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
																{' '}
																{item?.property_details?.property_type}
															</span>
														</h4>
														<h5 className='fs-14 medium text-blue'>
															<img
																src='assets/img/icon/phone.svg'
																width='15'
																alt='shukDeals'
															/>{' '}
															{t('Contact Now')}
														</h5>
													</div>
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className='selectContainer col-lg-3 col-md-6 col-6 mb-3'>
										<div className='deal-column position-relative rounded-20 overflow-hidden shadow'>
											<AddWishlistShare
												api={addDealsWishlist}
												id={item?.id}
												added_to_wishlist={item?.added_to_wishlist}
												url={`${detailViewLink}?id=${item.id}`}
											/>
											<div onClick={() => onClickNavigation(item)}>
												<img
													src={Endpoints.baseUrl + item?.images?.[0]?.image}
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
														<h5 className='fs-18 medium fs-sm-14 pb-2'>{item?.title} </h5>
														<div className='row m-0 align-items-center'>
															<div className='col-lg-6 col-md-8 ps-0 pe-1'>
																<p className='light fs-14 fs-sm-9 text-gray2'>
																	{item?.total_redeemed} {t('Redeemed')}
																</p>
															</div>
															<div className='col-6 ps-0 pe-1'>
																<p className='light fs-14 fs-sm-9 text-gray2'>
																	{!item?.avg_rating ? (
																		<img
																			src='assets/img/icon/star-blank.svg'
																			width='15'
																			className='me-1'
																		/>
																	) : (
																		<img
																			src='assets/img/icon/star.svg'
																			width='15'
																			className='me-1'
																		/>
																	)}
																	{item?.avg_rating?.toFixed(1)}
																</p>
															</div>
															<div className='col-lg-6 ps-0 pe-1 col-md-8'>
																<OnlineOfflineIcon deal_type={item?.deal_type} />
															</div>
															<div className='col-lg-6 col-md-8 ps-0 pe-1'>
																<p className='m-0 text-green fs-12 d-flex align-items-center fs-sm-9'>
																	<img
																		src='assets/img/icon/timer2.svg'
																		className='me-1'
																		width='14'
																	/>
																	{moment(item.expiry_date).isBefore(new Date())
																		? t('Expired')
																		: moment(item.expiry_date).diff(new Date(), 'days') === 0
																		? t('Last Day')
																		: moment(item.expiry_date).diff(new Date(), 'days') +
																		+ " " + t('Days Left')}
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
																{user_currency?.sign +
																	item?.club_member_discount_value +
																	' ' + t("OFF")}
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
																{user_currency?.sign +
																	item?.free_member_discount_value +
																	' ' + t("OFF")}
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
				</div>
			)}
		</>
	);
}

export default CommonDealsRow;

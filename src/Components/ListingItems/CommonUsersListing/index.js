/* eslint-disable eqeqeq */
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import {
	getChoosenCurrency,
	getLoggedInUser,
} from '../../../helpers/authUtils';
import MyActionHelper from './myActionHelper';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useMemo } from 'react';
import LoadingSpinner from '../../Loader';
import DownloadPdf from '../../CommonUiComponents/DownloadPdf';
import { useLocation } from 'react-router-dom';
import { YoutubeUrlVedioIdHelper } from '../../../helpers';

function CommonUsersListing({
	url,
	params,
	givenData,
	paginationSize,
	categoryType,
	dataType,
	activatePagination,
	searchText,
	filter,
}) {
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const location = useLocation();
	const user_currency = getChoosenCurrency();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState();
	// const [remainingCount, setRemainingCount] = useState(0);
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: url,
		paginationCountSize: paginationSize,
	});

	const reportData = [
		{
			title: 'Stores',
			type: 'business',
			total: 'total_businesses',
			free_subscription: 'free_business_under_ngo',
			free_donation_payment: 'free_business_subscription_payments',
			free_extra_listing_payment: 'free_business_deal_payments',
			free_extra_deals_payment: 'free_business_weekly_deal_payments',
			free_classified_payment: 'free_business_classified_payments',
			free_job_listing_payment: 'free_business_jobs_payments',
			// paid
			paid_subscription: 'paid_business_under_ngo',
			paid_donation_payment: 'paid_business_subscription_payments',
			paid_extra_listing_payment: 'paid_business_deal_payments',
			paid_extra_deals_payment: 'paid_business_weekly_deal_payments',
			paid_classified_payment: 'paid_business_classified_payments',
			paid_job_listing_payment: 'paid_business_jobs_payments',
		},
		{
			title: 'Members',
			type: 'members',
			total: 'total_members',
			free_subscription: 'free_members_under_ngo',
			free_donation_payment: 'free_members_subscription_payments',
			free_extra_listing_payment: 'free_members_deal_payments',
			free_extra_deals_payment: 'free_members_weekly_deal_payments',
			free_classified_payment: 'free_members_classified_payments',
			free_job_listing_payment: 'free_members_jobs_payments',
			// paid
			paid_subscription: 'paid_members_under_ngo',
			paid_donation_payment: 'paid_members_subscription_payments',
			paid_extra_listing_payment: 'paid_members_deal_payments',
			paid_extra_deals_payment: 'paid_members_weekly_deal_payments',
			paid_classified_payment: 'paid_members_classified_payments',
			paid_job_listing_payment: 'paid_members_jobs_payments',
		},
	];
	const remainingCalculation = (name) => {
		let allowedNum = user?.plan?.features?.find(
			(item) => item?.feature_type === name
		)?.numbers_allowed;
		if (allowedNum >= 1000) return 'Unlimited';
		let res = allowedNum - data?.length;
		return res >= 0 ? res : 0;
	};

	useEffect(() => {
		setIsLoading(true);
		if (!givenData && dataType !== 'my-family') {
			// this is the API calling funtion
			paginationApiHelper(
				paginationData.currentUrl,
				true,
				paginationData,
				setPaginationData,
				setData,
				{ ...filter, ...params }
			);
		} else {
			setData(givenData);
		}
		setIsLoading(false);
	}, [searchText, filter, givenData, location]);
	// console.log({ data });
	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					{['my-realestate', 'my-weekly', 'my-deals'].includes(dataType) && (
						<>
							{user?.user_type !== 'Non Profitable Organization' && (
								<h5 class='fs-14 text-gray2'>
									{['my-deals', 'my-realestate'].includes(dataType)
										? remainingCalculation('deal') + ' ' + t('Free Deals Remaining')
										: null}
								</h5>
							)}
							<table className='wishlist-table  w-100 list-table'>
								<tbody>
									<tr className='table-head'>
										<th width='15%'>{t('Deals')}</th>
										<th width='30%'></th>
										<th>{t('Date & Expiry')}</th>
										<th>{t('Status')}</th>
										<th>{t('Redeemed')}</th>
										<th width='20%'>{t('Action')}</th>
									</tr>

									{data?.length
										? data?.map((item, index) => {
												return (
													<tr className='shadow'>
														<td>
															<img
																src={
																	item?.images[0]?.image
																		? Endpoints.baseUrl + item?.images[0]?.image
																		: ''
																}
																className='rounded-10 wish-table-img'
																alt=''
															/>
														</td>
														<td>
															{user?.business_category === 5 ? (
																<h4 className='fs-14 text-gray2 pb-2 d-flex'>
																	<img
																		src='assets/img/icon/o-location.svg'
																		width='15'
																		className='me-2'
																		alt='shukDeals'
																	/>
																	{item?.location?.location}
																</h4>
															) : null}
															<h6 className='medium text-gray1 pb-1 fs-sm-16 fs-18'>
																{item?.title}
															</h6>
															{dataType === 'my-weekly' ? (
																<div>
																	<h4 className='fs-20 text-blue medium pt-1'>
																		{item?.free_member_discount_type == 'fixed'
																			? user_currency?.sign +
																			  item?.free_member_discount_value +
																			  ' ' + t("OFF")
																			: item?.free_member_discount_value + ' % ' + t("OFF")}
																	</h4>

																	<h5 className='fs-14 text-gray2 pb-2 pt-2'>
																		Code for All member:{' '}
																		<span className='text-gray1 medium d-block'>
																			{item?.free_member_code}
																		</span>
																	</h5>
																</div>
															) : null}
															{user?.business_category != 5 && dataType != 'my-weekly' ? (
																<div>
																	<h5 className='fs-14 text-gray2 pb-2'>
																		Code for free member:{' '}
																		<span className='text-gray1 medium d-block'>
																			{item?.free_member_code}
																		</span>
																	</h5>
																	<h5 className='fs-14 text-gray2'>
																		Code for club member:{' '}
																		<span className='text-gray1 medium d-block'>
																			{item?.club_member_code}
																		</span>
																	</h5>
																</div>
															) : (
																<div>
																	<h4 className='fs-20 text-blue medium'>
																		{item?.property_details?.price
																			? user_currency?.sign +
																			  item?.property_details?.price?.toFixed(2)
																			: null}
																	</h4>
																</div>
															)}
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray2 pb-2'>
																{t('Publish on')}:{' '}
																<span className='text-gray1 medium'>
																	{moment(item?.created_at).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
															<h5 className='fs-14 text-gray2'>
																{t("Expire in:")}{' '}
																<span className='text-gray1 medium'>
																	{moment(item?.expiry_date).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5
																style={{
																	color: item?.active ? 'green' : 'orange',
																}}
																className='fs-16 text-green3 medium'
															>
																{item?.active ? t('Active') : item?.status?.replace('_', ' ')}
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray2'>
																{item?.total_redeemed} {t("Redeemed")}
															</h5>
														</td>

														<td className='action-btn ps-lg-3'>
															<MyActionHelper
																id={item?.id}
																dataType={dataType}
																setData={setData}
																categoryType={categoryType}
																deleteConfirmMessage={
																	'You want to permanently delete this deal'
																}
																detailsPathName={'/deal-details'}
																redeemedUser={true}
																editPathName={
																	dataType === 'my-realestate'
																		? '/update-listing-realestate'
																		: dataType === 'my-weekly'
																		? '/update-listing-weekly'
																		: '/update-deal'
																}
																item={item}
															/>
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</>
					)}
					{['my-jobs'].includes(dataType) && (
						<>
							{user?.user_type !== 'Non Profitable Organization' && (
								<h5 class='fs-14 text-gray2'>
									{remainingCalculation('job') + ' ' + 'Free Jobs Remaining'}
								</h5>
							)}
							<table className='wishlist-table  w-100 '>
								<tbody>
									<tr className='table-head'>
										<th>{t('Jobs')}</th>
										<th width='25%'>{t('Date')}</th>
										<th>{t('Applicants')}</th>
										<th>{t('Status')}</th>
										<th>{t('Action')}</th>
									</tr>

									{data?.length
										? data?.map((item, index) => {
												return (
													<tr className='shadow'>
														<td className='px-lg-3'>
															<h6 className='medium text-gray1 pb-2 fs-sm-16'>
																{item?.title}
															</h6>
															<h5 className='fs-14 text-gray2'>
																{t('Salary')}:{' '}
																<span className='text-gray1 medium'>
																	{getSymbolFromCurrency(item?.salary_currency)}
																	{item?.salary} {item?.salary_type}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray2 pb-2'>
																{t('Posted on')}
																{':' + ' '}
																<span className='text-gray1 medium'>
																	{' '}
																	{moment(item?.created_at).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
															<h5 className='fs-14 text-gray2'>
																{t('Expire in')}
																{':' + ' '}
																<span className='text-gray1 medium'>
																	{' '}
																	{moment(item?.expiry_date).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray1 medium'>
																{item?.total_applications} Applicant
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5
																style={{
																	color: item?.active ? 'green' : 'orange',
																}}
																className='fs-16 text-green3 medium'
															>
																{item?.active ? t('Active') : item?.status?.replace('_', ' ')}
															</h5>
														</td>

														<td className='action-btn ps-lg-3'>
															<MyActionHelper
																id={item?.id}
																dataType={dataType}
																setData={setData}
																categoryType={categoryType}
																deleteConfirmMessage={'You want to permanently delete this job'}
																detailsPathName={''}
																editPathName={'/update-listing-jobs'}
																item={item}
															/>
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</>
					)}
					{['my-payment-options'].includes(dataType) && (
						<>
							<table className='wishlist-table  w-100 '>
								<tbody>
									<tr className='table-head'>
										<th>{t('Card Number')}</th>
										<th>{t('Expiry Month')}</th>
										<th>{t('Expiry Year')}</th>
										<th>{t('Action')}</th>
									</tr>

									{data?.length
										// ? data?.filter((ite)=>ite?.card_mask)?.map((item, index) => {
										? data?.map((item, index) => {
												return (
													<tr className='shadow'>
														<td className='px-lg-3'>
															<h6 className='medium text-gray1 pb-2 fs-sm-16'>
																{item?.title}
															</h6>
															<h5 className='fs-14 text-gray2'>
																<span className='text-gray1 medium'>
																	{/* {item?.card_mask + "************"} */}
																	{item?.last4 ? ("************" + item?.last4):
																	(item?.payment_method? ("************" + item?.card_mask) : 
																	(item?.card_mask))
																	}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray2 pb-2'>
																<span className='text-gray1 medium'>
																	{' '}
																	{item?.exp_month || item?.expire_month}
																</span>
															</h5>
														</td>
														
														<td className='px-lg-3'>
															<h5
																className='fs-16 text-gray2 medium'
															>
																{item?.exp_year || item?.expire_year}
															</h5>
														</td>

														<td className=' ps-lg-3'>
															{item?.is_default ?
															<div style={{
																color: '#4ff77c',
																borderColor: '#4ff77c',
																borderWidth: '1px',
																borderStyle: 'solid',
																padding: '2px',
																width: '60px',
																textAlign: 'center',
																fontWeight: 'bold'
															}} className='fs-12'>
																{t("Primary")}
															</div>
															:
															<MyActionHelper
																id={item?.id}
																dataType={dataType}
																setData={setData}
																data={data}
																categoryType={categoryType}
																deleteConfirmMessage={'You want to permanently delete this Payment Option'}
																detailsPathName={''}
																item={item}
																isPrimary={true}
															/>
															}
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</>
					)}
					{['my-classifieds'].includes(dataType) && (
						<div>
							{user?.user_type !== 'Non Profitable Organization' && (
								<h5 class='fs-14 text-gray2'>
									{remainingCalculation('classified') +
										' ' +
										t('Free Classifieds Remaining')}
								</h5>
							)}
							<table className='wishlist-table  w-100 list-table'>
								<tbody>
									<tr className='table-head'>
										<th width='15%'>{t('Classifieds')}</th>
										<th width='25%'></th>
										<th>{t('Publish Date')}</th>
										<th width='12%'>{t('Status')}</th>
										<th>{t('Action')}</th>
									</tr>
									{data?.length
										? data?.map((item, index) => {
												return (
													<tr className='shadow'>
														<td>
															<img
																src={Endpoints.baseUrl + item?.images[0]?.image}
																className='rounded-10 wish-table-img'
																alt=''
															/>
														</td>
														<td>
															<h6 className='medium text-gray1 pb-1 fs-sm-16 fs-18'>
																{item?.title}
															</h6>
															<h5 className='fs-14 text-gray2 pb-2'>
																{t('Price')}:{' '}
																<span className='text-gray1 medium'>
																	{user_currency?.sign}
																	{item?.price?.toFixed(2)}{' '}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-14 text-gray2 pb-2'>
																{t('Posted on')}
																{':' + ' '}
																<span className='text-gray1 medium'>
																	{moment(item?.created_at).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
															<h5 className='fs-14 text-gray2'>
																{t('Expire in')}
																{':' + ' '}
																<span className='text-gray1 medium'>
																	{moment(item?.expiry_date).format('DD MMM YYYY')}{' '}
																</span>
															</h5>
														</td>
														<td className='px-lg-3'>
															<h5 className='fs-16 text-green3 medium'>
																{item?.active ? t('Active') : ''}
															</h5>
														</td>

														<td className='action-btn ps-lg-3'>
															<MyActionHelper
																id={item?.id}
																dataType={dataType}
																setData={setData}
																categoryType={categoryType}
																deleteConfirmMessage={
																	'You want to permanently delete this classified'
																}
																detailsPathName={'/classified-details'}
																editPathName={'/update-classified'}
																item={item}
															/>
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</div>
					)}
					{['my-locations'].includes(dataType) && (
						<>
							{user?.user_type !== 'Non Profitable Organization' && (
								<h5 class='fs-14 text-gray2'>
									{user?.extra_location + ' ' + t('Free Locations Remaining')}
								</h5>
							)}
							<table className='wishlist-table  w-100 list-table'>
								<tbody>
									<tr className='table-head'>
										<th width='80%'>{t('Locations')}</th>
										<th>{t('Action')}</th>
									</tr>
									{data?.length
										? data?.map((item, index) => {
												return (
													<tr className='shadow'>
														<td className='px-lg-4'>
															<h6 className='medium text-gray1 fs-sm-14 fs-16'>
																{item?.location}
															</h6>
														</td>

														<td className='action-btn ps-lg-3'>
															<MyActionHelper
																id={item?.id}
																dataType={dataType}
																setData={setData}
																categoryType={categoryType}
																item={item}
																removeDelete={item?.is_primary ? true : false}
																deleteConfirmMessage={
																	'You want to permanently delete this location'
																}
																editPathName={'/update-location'}
															/>
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</>
					)}
					{['my-videos'].includes(dataType) && (
						<>
							{/* {user?.user_type !== 'NGO' && (
								<h5 class='fs-14 text-gray2'>
									{remainingCalculation('video') + ' ' + 'Free Locations Remaining'}
								</h5>
							)} */}
							<table className='wishlist-table  w-100 list-table'>
								<tbody>
									<tr className='table-head'>
										<th width='12%'>{t('Videos')}</th>
										<th width='15%'></th>
										<th>{t('Upload Date')}</th>
										<th>{t('Likes')}</th>
										<th>{t('Video URL')}</th>
										<th width='18%'>{t('Action')}</th>
									</tr>
									{data?.length
										? data?.map((item, index) => {
												return (
													<tr key={index} className='shadow'>
														<td width='100px'>
															<img
																src={`https://img.youtube.com/vi/${YoutubeUrlVedioIdHelper(
																	item?.link
																)}/mqdefault.jpg`}
																className='rounded-10 wish-table-img-round'
																alt=''
															/>
														</td>
														<td className=''>
															<div className=''>
																<h6 className='medium pb-2 text-gray1'>{item?.title}</h6>
															</div>
														</td>

														<td className='px-lg-4'>
															<h5 className='fs-14 text-gray2 pb-2 text-nowrap'>
																{t('Uploaded on:')}{' '}
																<span className='text-gray1 medium'>
																	{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
																</span>
															</h5>
														</td>
														<td className='px-lg-4'>
															<h5 className='fs-14 text-gray2 text-nowrap'>
																{item.total_likes} {t("Likes")}
															</h5>
														</td>
														<td className='px-lg-4'>
															<h5 className='fs-14 text-gray2'>{item.link}</h5>
														</td>

														<td className='action-btn ps-lg-4'>
															<MyActionHelper
																id={item?.id}
																detailId={item?.ngo}
																dataType={dataType}
																setData={setData}
																detailsPathName={'/ngo-profile-ngo-view'}
																deleteConfirmMessage={
																	'You want to permanently delete this video'
																}
																editPathName={'/update-video'}
															/>
														</td>
													</tr>
												);
										  })
										: null}
								</tbody>
							</table>
						</>
					)}
					{['my-payment-history'].includes(dataType) && (
						<table className='wishlist-table  w-100 list-table'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Date')}</th>
									<th width='18%'>{t('Amount')}</th>
									<th width='25%'>{t('Description')}</th>
									<th width='20%'>{t('Status')}</th>
									<th width='20%'>PDF</th>
								</tr>
								{data?.length
									? data?.map((item, index) => {
											return (
												<tr className='shadow '>
													<td className='px-lg-4 '>
														<h5 className='fs-16 text-gray1 fs-sm-14 fs-16'>
															{moment(item?.created_at).format('DD MMM YYYY')}{' '}
														</h5>
													</td>
													<td className='px-lg-4'>
														<h6 className='medium text-gray1 fs-sm-14 fs-16 '>
															{item?.currency_icon} {item?.amount}
														</h6>
													</td>
													<td className='px-lg-4'>
														<h6 className='medium text-gray1 fs-sm-14 fs-16 '>
															{item?.description}
														</h6>
													</td>
													<td className='px-lg-4'>
														<h6
															className={`medium text-capitalize fs-sm-14 fs-16  ${
																item?.status === 'complete'
																	? 'text-green3'
																	: item?.status === 'cancelled'
																	? 'text-red'
																	: 'text-gray1'
															}`}
														>
															{item?.status}
														</h6>
													</td>
													<td className='px-lg-4'>
														<DownloadPdf pdfUrl={Endpoints.getPaymentInvoice + item?.id} />
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}
					{['my-payment-report'].includes(dataType) && (
						<>
							<table className='wishlist-table  w-100 '>
								<tbody>
									<tr className='table-head'>
										<th width='12%'></th>
										<th width='15%'>{t('Subscription')}</th>
										<th width='15%'>{t('Donation Total')}</th>
										<th width='15%'>{t('Deals')}</th>
										<th width='15%'>{t('Weekly Deals')}</th>
										<th width='15%'>{t('Classifieds')}</th>
										{/* <th width='20%'>Job Listing</th> */}
									</tr>
								</tbody>
							</table>

							{reportData?.map((item) => (
								<>
									<table className='wishlist-table  w-100 '>
										<tbody>
											<tr className='table-head'>
												<th width='14%'>
													<h5 className='medium text-gray1'>{item?.title}</h5>
												</th>
												<th>
													<h6 className=' text-gray1  '>{data?.[item?.total] || 0}</h6>
												</th>
											</tr>
										</tbody>
									</table>
									<>
										{/* Free */}
										<table className='wishlist-table  w-100 '>
											<tbody>
												<tr className='table-head shadow' style={{ background: '#ffffff' }}>
													<th width='12%'>
														<h5 className='fs-6 text-gray1 '>{t('Free')}</h5>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_subscription]
																? data?.[item?.free_subscription]
																: '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_donation_payment]
																? user_currency?.sign + data?.[item?.free_donation_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_extra_listing_payment]
																? user_currency?.sign + data?.[item?.free_extra_listing_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_extra_deals_payment]
																? user_currency?.sign + data?.[item?.free_extra_deals_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_classified_payment]
																? user_currency?.sign + data?.[item?.free_classified_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													{/* <th>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.free_job_listing_payment] || 0}
														</h6>
													</th> */}
												</tr>
											</tbody>
										</table>
										{/* paid */}
										<table className='wishlist-table  w-100 '>
											<tbody>
												<tr className='table-head shadow' style={{ background: '#ffffff' }}>
													<th width='12%'>
														<h5 className='fs-6  text-gray1'>Paid</h5>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_subscription]
																? data?.[item?.paid_subscription]
																: '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_donation_payment]
																? user_currency?.sign + data?.[item?.paid_donation_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_extra_listing_payment]
																? user_currency?.sign + data?.[item?.paid_extra_listing_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_extra_deals_payment]
																? user_currency?.sign + data?.[item?.paid_extra_deals_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													<th width='15%'>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_classified_payment]
																? user_currency?.sign + data?.[item?.paid_classified_payment]
																: user_currency?.sign + '0'}
														</h6>
													</th>
													{/* <th>
														<h6 className=' text-gray1 fs-6 '>
															{data?.[item?.paid_job_listing_payment] || 0}
														</h6>
													</th> */}
												</tr>
											</tbody>
										</table>
									</>
								</>
							))}
							<>
								{/* sub total */}
								<table className='wishlist-table  w-100 '>
									<tbody>
										<tr className='table-head shadow' style={{ background: '#ffffff' }}>
											<th width='27%'>
												<h5 className='fs-5 text-gray1 '>{t('Subtotal')}</h5>
											</th>

											<th width='15%'>
												<h6 className=' text-gray1 fs-6 '>
													{user_currency?.sign}
													{data?.donation_sub_total || '0'}
												</h6>
											</th>
											<th width='15%'>
												<h6 className=' text-gray1 fs-6 '>
													{user_currency?.sign}
													{data?.deal_sub_total || '0'}
												</h6>
											</th>
											<th width='15%'>
												<h6 className=' text-gray1 fs-6 '>
													{user_currency?.sign}
													{data?.weekly_deal_sub_total || '0'}
												</h6>
											</th>
											<th width='15%'>
												<h6 className=' text-gray1 fs-6 '>
													{user_currency?.sign}
													{data?.classified_sub_total || '0'}
												</h6>
											</th>
											{/* <td className='px-lg-4'>
										<h6 className=' text-gray1 fs-sm-14 fs-16 '>
											{data?.}
										</h6>
									</td> */}
										</tr>
									</tbody>
								</table>

								{/* grand total */}
								<table className='wishlist-table  w-100 list-table'>
									<tbody>
										<tr className='table-head'>
											<th className=' text-gray1 medium fs-4 ' width='80%'>
												{t('Grand Total Monthly Donation')}
											</th>
											<th className=' text-gray1 fs-4 ' width='20%'>
												{user_currency?.sign}
												{data?.grand_total ?? 0}
											</th>
										</tr>
									</tbody>
								</table>
							</>
						</>
					)}
					{/* {['my-family'].includes(dataType) && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th colspan='2'>{t("Family Member")}</th>
									<th>{t("Relation")}</th>
									<th>{t("Email")}</th>
									<th>{t("Phone Number")}</th>
									<th>{t("Action")}</th>
								</tr>

								{data ? (
									<tr className='shadow'>
										<td width='100px'>
											{data?.image ? (
												<img
													src={Endpoints.baseUrl + data?.image}
													className='rounded-10 wish-table-img-round object-cover'
													width='80'
													height='80'
													alt=''
												/>
											) : (
												<img
													alt=''
													className='rounded-10 wish-table-img-round object-cover'
													width='80'
													height='80'
													src='assets/img/dummy.png'
												/>
											)}
										</td>
										<td>
											<div className=''>
												<h6 className='medium  text-gray1'>
													{data?.firstname} {data?.lastname}
												</h6>
											</div>
										</td>
										<td className='px-lg-4'>
											<h5 className='fs-14 medium text-gray1'>{data?.relation}</h5>
										</td>
										<td className='px-lg-4'>
											<h5 className='fs-14 text-gray2'>{data?.email}</h5>
										</td>
										<td className='px-lg-4'>
											<h5 className='fs-14 text-gray2 text-nowrap'>{data?.phone}</h5>
										</td>

										<td className='action-btn ps-lg-4'>
											<div className='d-flex gap-3'>
												<MyActionHelper
													dataType={dataType}
													editPathName={'/update-family-member'}
													setData={setData}
													pathState={{ familyData: data }}
													deleteConfirmMessage={
														'You want to permanently delete this family member'
													}
												/>
											</div>
										</td>
									</tr>
								) : null}
							</tbody>
						</table>
					)} */}

					{['my-ngo-business-associated', 'my-ngo-member-associated'].includes(
						dataType
					) && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='10%'>
										{dataType === 'my-ngo-business-associated' ? 'Business' : 'Member'}
									</th>
									<th width='25%'></th>
									<th width='20%'>{t('Join Date')}</th>
									<th width='25%'>{t('Email')}</th>
									<th width='25%'>{t('Contact Number')}</th>
									<th width='10%'>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => (
											<tr className='shadow'>
												<td width='100px'>
													{item?.image ? (
														<img
															src={Endpoints.baseUrl + item?.image}
															className='rounded-circle wish-table-img-round object-cover'
															width='80'
															height='80'
															alt=''
														/>
													) : (
														<img
															alt=''
															className='rounded-circle wish-table-img-round object-cover'
															width='80'
															height='80'
															src='assets/img/dummy.png'
														/>
													)}
												</td>
												<td className=''>
													<div className=''>
														<h6 className='medium pb-2 text-gray1'>
															{item?.name || item?.firstname + ' ' + item?.lastname}
														</h6>
													</div>
												</td>
												<td>
													<h5 className='fs-14 text-gray2 pb-2'>
														{t('Join')}
														{': '}
														<span className='text-gray1 medium'>
															{moment(item?.created_at).format('DD MMM YYYY')}{' '}
														</span>
													</h5>
												</td>

												<td className='px-lg-4'>
													<h5 className='fs-14 text-gray2'>{item?.email}</h5>
												</td>
												<td className='px-lg-4'>
													<h5 className='fs-14 text-gray2 text-nowrap'>{item?.phone}</h5>
												</td>

												<td className='action-btn ps-lg-4'>
													<MyActionHelper
														detailsPathName={
															dataType === 'my-ngo-business-associated'
																? '/business-profile-user-view'
																: '/user-profile-other-view'
														}
														id={item?.id}
														removeDelete={true}
														dataType={dataType}
													/>
												</td>
											</tr>
									  ))
									: null}
							</tbody>
						</table>
					)}
					{['my-redeemed-deal-users'].includes(dataType) && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='10%'>
										{dataType === 'my-ngo-business-associated' ? t('Business') : t('Member')}
									</th>
									<th width='20%'></th>
									<th width='20%'>{t('Redeemed Date')}</th>
									<th width='20%'>{t('Email')}</th>
									<th width='16%'>{t('Contact Number')}</th>
									<th width='10%'>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => (
											<tr className='shadow'>
												<td width='100px'>
													{item?.user?.image ? (
														<>
															<div className='wishlist-img'>
																<img
																	src={Endpoints.baseUrl + item?.user?.image}
																	className='m-0 wishlist-img wish-table-img'
																	alt=''
																/>
															</div>
															{item?.user?.is_hamza && (
																<span className='box-20 rounded-circle bg-white'>
																	<img
																		src='assets/img/hamsa-tik 1.svg'
																		width='16'
																		height='16'
																		alt=''
																	/>
																</span>
															)}
														</>
													) : (
														<img
															alt=''
															className='rounded-circle wish-table-img-round object-cover'
															width='80'
															height='80'
															src='assets/img/dummy.png'
														/>
													)}
												</td>
												<td className=''>
													<div className=' d-flex flex-column gap-1'>
														<h6 className='medium pb-2 text-gray1'>
															{item?.user?.name ||
																item?.user?.firstname + ' ' + item?.user?.lastname}
														</h6>
														<h6 className='fs-12 pb-2 text-gray1'>
															{item?.user?.is_hamza ? 'Club Member' : 'Member'}
														</h6>
													</div>
												</td>
												<td>
													<h5 className='fs-14 text-gray2 pb-2'>
														{t('Redeemed')}
														{': '}
														<span className='text-gray1 medium'>
															{moment(item?.created_at).format('DD MMM YYYY')}{' '}
														</span>
													</h5>
												</td>

												<td className='px-lg-4'>
													<h5 className='fs-14 text-gray2'>{item?.user?.email}</h5>
												</td>
												<td className='px-lg-4'>
													<h5 className='fs-14 text-gray2 text-nowrap'>
														{item?.user?.phone}
													</h5>
												</td>

												<td className='action-btn ps-lg-4'>
													<MyActionHelper
														detailsPathName={'/user-profile-other-view'}
														id={item?.user?.id}
														removeDelete={true}
														dataType={dataType}
													/>
												</td>
											</tr>
									  ))
									: null}
							</tbody>
						</table>
					)}

					{!data?.length ? (
						<div className=' text-center fs-4 mt-4'>
							{(dataType === 'my-deals' ||
								dataType === 'my-weekly' ||
								dataType === 'my-realestate') &&
								t('No Deals Added')}
							{dataType === 'my-jobs' && t('No Jobs Added')}
							{dataType === 'my-classifieds' && t('No Classifieds Added')}
							{dataType === 'my-locations' && t('No Locations Added')}
							{dataType === 'my-videos' && t('No Videos Added')}
							{dataType === 'my-payment-history' && t('No Payment History')}
							{/* {dataType === 'my-payment-report' && 'No Payment Report'} */}
							{dataType === 'my-family' && t('No family Member Added')}
							{dataType === 'my-ngo-business-associated' && t('No Business Associated')}
							{dataType === 'my-ngo-member-associated' && t('No Member Associated')}
							{dataType === 'my-redeemed-deal-users' && t('No redeemers found')}
						</div>
					) : null}

					{ dataType === 'my-payment-options' && !data?.length ? (
						<div className=' text-center fs-4 mt-4'>
							{dataType === 'my-payment-options' && 'No Payment Option found'}
						</div>
					) : null}

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

export default CommonUsersListing;

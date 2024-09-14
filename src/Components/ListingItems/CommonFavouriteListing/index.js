/* eslint-disable eqeqeq */
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import ActionHelper from './favouriteActionHelper';
import LoadingSpinner from '../../Loader';
import { YoutubeUrlVedioIdHelper, getChoosenCurrency } from '../../../helpers';

function CommonFavouriteListing({
	url,
	paginationSize,
	categoryType,
	dataType,
	activatePagination,
	searchText,
	filters,
}) {
	const { t } = useTranslation();

	const user_currency = getChoosenCurrency();
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: url,
		paginationCountSize: paginationSize,
	});

	useEffect(() => {
		setIsLoading(true);
		paginationApiHelper(
			paginationData.currentUrl,
			true,
			paginationData,
			setPaginationData,
			setData,
			filters
		);
		setIsLoading(false);
	}, [searchText, filters]);

	return (
		<div>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					{dataType == 'favourite-classified' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Classifieds')}</th>
									<th width='45%'></th>
									<th>{t('Date & Expiry')}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td>
														<img
															src={Endpoints.baseUrl + item?.images[0]?.image}
															className='rounded-10 wish-table-img'
															alt=''
														/>
													</td>
													<td className='align-top'>
														<div className=''>
															<h6 className='medium pb-3'>{item?.title}</h6>
															<h5 className='fs-14 text-gray2 pb-2'>
																{t('Price')}:{' '}
																<span className='text-gray1 medium'>
																	{user_currency?.sign}
																	{item?.price?.toFixed(2)}{' '}
																</span>
															</h5>
														</div>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2'>
															{t('Publish on')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at).format('DD MMM YYYY')}{' '}
															</span>
														</h5>
														<h5 className='fs-14 text-gray2'>
															{t('Expire')}
															{':' + ' '}
															<span className='text-gray1 medium'>
																{moment(item?.expiry_date).format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>

													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															shareLink={`/classified-details?id=${item?.id}`}
															detailsPathName={'/classified-details'}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{['favourite-listing', 'my-redeemed'].includes(dataType) && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Deals')}</th>
									<th width='30%'></th>
									<th>{t('Date & Expiry')}</th>
									<th>{t('Redeemed')}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td>
														<img
															src={Endpoints.baseUrl + item?.images?.[0]?.image}
															className='rounded-10 wish-table-img'
															alt=''
														/>
													</td>
													<td>
														<div className=''>
															<h6 className='medium pb-lg-4 pb-3'>{item?.title}</h6>
															<div className='d-flex align-items-center'>
																{item?.business_sub_category == 10 ? (
																	<>{item?.property_details?.offer_text}</>
																) : item?.business_sub_category == 12 ? (
																	<>{user_currency?.sign + item?.property_details?.price}</>
																) : (
																	<>
																		<div className='home-club-member py-2 px-lg-3 px-2'>
																			<h5 className='fs-12 medium fs-sm-9'>{t("Club Member")}</h5>
																			{item?.club_member_discount_type == 'fixed' ? (
																				<h6 className='text-blue medium fs-sm-14'>
																					{user_currency?.sign +
																						item?.club_member_discount_value +
																						' ' + t("OFF")}
																				</h6>
																			) : (
																				<h6 className='text-blue medium fs-sm-14'>
																					{item?.club_member_discount_value + ' % ' + t("OFF")}
																				</h6>
																			)}
																		</div>
																		<div className='home-nonclub-member py-2 px-lg-3 px-2'>
																			<h5 className='fs-12 light fs-sm-9'>
																				{t('Non-Club Member')}
																			</h5>
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
																	</>
																)}
															</div>
														</div>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2'>
															{t('Publish on')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
														<h5 className='fs-14 text-gray2'>
															{t('Expire')}
															{':' + ' '}
															<span className='text-gray1 medium'>
																{moment(item?.expiry_date)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2'>
															{item?.total_redeemed} {t('Redeemed')}
														</h5>
													</td>
													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={`/deal-details?id=${item?.id}`}
															detailsPathName={'/deal-details'}
															removeDeleteBtn={
																['my-redeemed'].includes(dataType) ? true : false
															}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-weekly' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Deals')}</th>
									<th width='25%'></th>
									<th>{t('Date & Expiry')}</th>
									<th>{t('Redeemed')}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td>
														<img
															src={Endpoints.baseUrl + item?.images?.[0]?.image}
															className='rounded-10 wish-table-img'
															alt=''
														/>
													</td>
													<td className='align-top'>
														<div className=''>
															<h6 className='medium pb-3'>{item?.title}</h6>
															<h5 className='fs-14 text-gray2 pb-2'>
																<span className='text-gray1 medium'>
																	{item?.free_member_discount_value + '% ' + t('OFF')}
																</span>
															</h5>
														</div>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2'>
															{t('Publish on')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
														<h5 className='fs-14 text-gray2'>
															{t('Expire')}
															{':' + ' '}
															<span className='text-gray1 medium'>
																{moment(item?.expiry_date)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2'>
															{item?.total_redeemed} {t('Redeemed')}
														</h5>
													</td>
													<td className='action-btn ps-lg-4'>
														<ActionHelper
															shareType={'normal'}
															id={item?.id}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={`/deal-details?id=${item?.id}`}
															detailsPathName={'/deal-details'}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-user' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='13%'>{t("User")}</th>
									<th width='25%'></th>
									<th>{t('Date')}</th>
									<th>{t("Social Accounts")}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td className=' d-flex flex-column align-items-center'>
														<div className='wishlist-img'>
															<img
																src={Endpoints.baseUrl + item?.image}
																className='m-0 wishlist-img wish-table-img'
																alt=''
															/>
														</div>
														{item?.is_hamza && (
															<span className='box-20 rounded-circle bg-white'>
																<img
																	src='assets/img/hamsa-tik 1.svg'
																	width='16'
																	height='16'
																	alt=''
																/>
															</span>
														)}
													</td>

													<td className=''>
														<div className=''>
															<h6 className='medium pb-2 text-gray1'>
																{item?.firstname} {item?.lastname}
															</h6>
														</div>
													</td>

													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2 text-nowrap'>
															{t('Join')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<div className='d-flex gap-2'>
															<>
																{item?.facebook_url ? (
																	<Link to={item.facebook_url} target='_blank' className=''>
																		<img src='assets/img/icon/Facebook.svg' />
																	</Link>
																) : null}
																{item?.twitter_url ? (
																	<Link to={item?.twitter_url} target='_blank' className=''>
																		<img src='assets/img/icon/Twitter.svg' />
																	</Link>
																) : null}
																{item?.instagram_url ? (
																	<Link to={item?.instagram_url} target='_blank' className=''>
																		<img src='assets/img/icon/Instagram.svg' />
																	</Link>
																) : null}
																{item?.youtube_url ? (
																	<Link to={item?.youtube_url} target='_blank' className=''>
																		<img src='assets/img/icon/YouTube.svg' />
																	</Link>
																) : null}
															</>
														</div>
													</td>
													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={`/user-profile-other-view?id=${item?.id}`}
															detailsPathName={'/user-profile-other-view'}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-business' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='13%'>{t('Business Store')}</th>
									<th width='25%'></th>
									<th>{t('Date')}</th>
									<th>{t('Contact Number')}</th>
									<th>{t('Email Address')}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td className=' d-flex flex-column align-items-center'>
														<div className='wishlist-img'>
															<img
																src={Endpoints.baseUrl + item?.image}
																className='m-0 wishlist-img wish-table-img'
																alt=''
															/>
														</div>
														{item?.is_hamza && (
															<span className='box-20 rounded-circle bg-white'>
																<img
																	src='assets/img/hamsa-tik 1.svg'
																	width='16'
																	height='16'
																	alt=''
																/>
															</span>
														)}
													</td>
													<td>
														<h6 className='medium text-gray1'>{item?.name}</h6>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2 text-nowrap'>
															{t('Join')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 text-nowrap'>
															{item.business_contact ? item.business_contact : item.phone}
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2'>
															{item.business_email ? item.business_email : item.email}
														</h5>
													</td>

													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={`/business-profile-user-view?id=${item?.id}`}
															detailsPathName={'/business-profile-user-view'}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-ngo' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='13%'>{t(`NGO's`)}</th>
									<th width='25%'></th>
									<th>{t('Date')}</th>
									<th>{t('Contact Number')}</th>
									<th>{t('Email Address')}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td className=' d-flex flex-column align-items-center'>
														<div className='wishlist-img'>
															<img
																src={Endpoints.baseUrl + item?.image}
																className='m-0 rounded-10 wish-table-img'
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
													</td>
													<td>
														<h6 className='medium text-gray1'>{item?.name}</h6>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2 text-nowrap'>
															{t('Join')}:{' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 text-nowrap'>
															{item.business_contact ? item.business_contact : item.phone}
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2'>
															{item.business_email ? item.business_email : item.email}
														</h5>
													</td>

													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={`/ngo-profile-other-view?id=${item?.id}`}
															detailsPathName={'/ngo-profile-other-view'}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-ngo-video' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Videos')}</th>
									<th width='15%'></th>
									<th>{t('Date')}</th>
									<th>{t("Likes")}</th>
									<th>{t('Video URL')}</th>
									<th width='18%'>{t('Action')}</th>
								</tr>

								{data?.map((item, index) => {
									return (
										<tr key={index} className='shadow'>
											<td width='100px'>
												<img
													src={`https://img.youtube.com/vi/${YoutubeUrlVedioIdHelper(
														item?.link
													)}/mqdefault.jpg`}
													className='rounded-10 wish-table-img'
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
													{item.total_likes} {t('Likes')}
												</h5>
											</td>
											<td className='px-lg-4'>
												<h5 className='fs-14 text-gray2'>{item.link}</h5>
											</td>

											<td className='action-btn ps-lg-4'>
												<ActionHelper
													id={item?.ngo}
													delId={item?.id}
													dataType={dataType}
													shareType={'external'}
													setData={setData}
													shareLink={item?.link}
													detailsPathName={'/ngo-profile-other-view'}
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}

					{dataType == 'favourite-jobs' && (
						<table className='wishlist-table w-100'>
							<tbody>
								<tr className='table-head'>
									<th width='15%'>{t('Jobs')}</th>
									<th></th>
									<th>{t('Date')}</th>
									<th>{t("Expire")}</th>
									<th>{t('Action')}</th>
								</tr>

								{data?.length
									? data?.map((item, index) => {
											return (
												<tr key={index} className='shadow'>
													<td className=' d-flex flex-column align-items-center'>
														<div className='wishlist-img'>
															<img
																src={Endpoints.baseUrl + item?.user_details?.image}
																className='rounded-10 wish-table-img-round object-cover'
																width='80'
																height='80'
																alt=''
															/>
														</div>
														{item?.is_hamza && (
															<span className='box-20 rounded-circle bg-white'>
																<img
																	src='assets/img/hamsa-tik 1.svg'
																	width='16'
																	height='16'
																	alt=''
																/>
															</span>
														)}
													</td>
													<td>
														<h6 className='medium text-gray1'>{item.title}</h6>
														<h5 className='fs-14 text-gray2 pt-2'>
															{t('Salary')}:{' '}
															<span className='text-gray1 medium'>
																${item.salary} {t('Per Month')}
															</span>
														</h5>
													</td>
													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2 pb-2'>
															{t('Posted on')}
															{':' + ' '}
															<span className='text-gray1 medium'>
																{moment(item?.created_at)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
														<h5 className='fs-14 text-gray2 pb-2'>
															{t('Expire in')}
															{':' + ' '}
															<span className='text-gray1 medium'>
																{moment(item?.expiry_date)?.format('DD MMM YYYY')}{' '}
															</span>
														</h5>
													</td>

													<td className='px-lg-4'>
														<h5 className='fs-14 text-gray2'>{item.user_details.email}</h5>
													</td>

													<td className='action-btn ps-lg-4'>
														<ActionHelper
															id={item?.id}
															shareType={'normal'}
															dataType={dataType}
															setData={setData}
															categoryType={categoryType}
															shareLink={``}
															detailsPathName={''}
														/>
													</td>
												</tr>
											);
									  })
									: null}
							</tbody>
						</table>
					)}
					{!data?.length ? (
						<div className=' text-center fs-4 mt-4'>
							{dataType === 'favourite-business' && t('No Business Added')}
							{dataType === 'favourite-jobs' && t('No Jobs Added')}
							{dataType === 'favourite-classified' && t('No Classifieds Added')}
							{dataType === 'favourite-ngo' && t('No Non-Profit Organizations Added')}
							{dataType === 'favourite-ngo-video' && t('No Videos Added')}
							{dataType === 'favourite-user' && t('No User Added')}
							{dataType === 'favourite-weekly' && t('No Weekly Added')}
							{dataType === 'favourite-listing' && t('No Lisitng Added')}
							{dataType === 'my-redeemed' && t('No Redeemed Deals')}
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
		</div>
	);
}

export default CommonFavouriteListing;

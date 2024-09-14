import React from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { getChoosenCurrency } from '../../../helpers';
import DetailPageActionButtons from '../DetailPageActionButtons';
import VerticalThumbnailCrousel from '../../CommonCrousel/VerticalThumbnailCrousel';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';

function BusinesDealsDetailPage({ detailData, params }) {
	const { t } = useTranslation();
	const user_currency = getChoosenCurrency();
	// console.log('detailData', detailData);	console.log('kdfhbjhn',detailData.images);
	return (
		<div className='container'>
			<div className='py-lg-4 border-bottom'>
				<div class='row m-0 py-2'>
					<div class='col-lg-5'>
						<div class=' position-relative'>
							{/* <div class='deal-slider owl-theme owl-carousel'>
								{detailData?.images?.map((item, index) => {
									return (
										<div key={index} class='deal-item'>
											<img
												style={{ height: '350px' }}
												src={Endpoints.baseUrl + item?.image}
												alt=''
											/>
										</div>
									);
								})}
							</div> */}
							<VerticalThumbnailCrousel images={detailData?.images} isUrl={false} />
						</div>
					</div>

					<div class='col-lg-7 pt-lg-0 pt-4'>
						<div className='d-flex align-items-center gap-lg-3  gap-2 pb-2 deal-content-row pb-md-4 pb-3'>
							<span className='redeem-btn'>
								<img src='assets/img/icon/deal-redeemed.svg' />{' '}
								{detailData?.total_redeemed + " " + t('Redeemed')}
							</span>
							<p className='m-0 fs-12 fs-sm-9'>
								{t('Posted') + ':'}{' '}
								{moment(detailData?.created_at).format('DD MMM YYYY')}
							</p>
							<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
								<p className='text-gray1 fs-sm-9 m-0'>{t('Expire in:')} </p>
								<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
								{moment(detailData.expiry_date).isBefore(new Date())
									? t('Expired')
									: moment(detailData.expiry_date).diff(new Date(), 'days') === 0
									? t('Last Day')
									: moment(detailData.expiry_date).diff(new Date(), 'days') + " "+
									  t('Days Left')}
							</div>
						</div>

						<h3 className='fs-26 text-black fs-sm-22 pb-2'>{detailData?.title}</h3>
						<div className='text-justify light text-gray2 py-2'>
							<p>{detailData?.description}</p>
						</div>
						<OnlineOfflineIcon deal_type={detailData?.deal_type} />

						<div class='d-flex align-items-center  w-100'>
							<div class='deal-club-member py-2 px-lg-3 px-2'>
								<span class='medium text-gray1 fs-22 fs-sm-12 d-block pb-1'>
									{t('Club Member')}
								</span>
								
								{detailData?.club_member_discount_type == 'fixed' ? (
									<h6 className='medium text-blue fs-26 fs-sm-18 pb-1 d-block'>
										{user_currency?.sign}{' '}
										{`${detailData?.club_member_discount_value} ` + t("OFF")}
									</h6>
								) : (
									<h6 className='medium text-blue fs-26 fs-sm-18 pb-1 d-block'>
										{detailData?.club_member_discount_value + ' % ' + t("OFF")}
									</h6>
								)}
								<div class='d-flex gap-3'>
									<del class='medium text-gray1 fs-18 fs-sm-12'>
										{user_currency?.sign}
										{parseInt(
											detailData?.actual_price || detailData?.property_details?.price
										)?.toFixed(2)}
									</del>
									<ins class='medium text-blue fs-18 text-decoration-none fs-sm-12'>
										{user_currency?.sign}
										{detailData?.club_member_discount_type == 'fixed'
											? (
													parseInt(
														detailData?.actual_price || detailData?.property_details?.price
													) - parseInt(detailData?.club_member_discount_value)
											  ).toFixed(2)
											: (
													parseInt(
														detailData?.actual_price || detailData?.property_details?.price
													) -
													(detailData?.actual_price || detailData?.property_details?.price) *
														(detailData?.club_member_discount_value / 100)
											  ).toFixed(2)}
									</ins>
								</div>
							</div>
							<div class='deal-nonclub-member py-2 px-lg-3 px-2'>
								<span class='light text-gray1 fs-22 fs-sm-12 d-block pb-1'>
									{t('Non-Club Member')}
								</span>
								
								{detailData?.free_member_discount_type == 'fixed' ? (
									<h6 className='medium text-gray2 fs-26 fs-sm-18 pb-1 d-block'>
										{user_currency?.sign +
											detailData?.free_member_discount_value +
											' ' + t("OFF")}
									</h6>
								) : (
									<h6 className='medium text-gray2 fs-26 fs-sm-18 pb-1 d-block'>
										{detailData?.free_member_discount_value + '% ' + t("OFF")}
									</h6>
								)}
								<div class='d-flex gap-3'>
									<del class='medium text-gray1 fs-18 fs-sm-12'>
										{user_currency?.sign}
										{parseInt(
											detailData?.actual_price || detailData?.property_details?.price
										)?.toFixed(2)}
									</del>
									<ins class='medium text-blue fs-18 text-decoration-none fs-sm-12'>
										{user_currency?.sign}
										{detailData?.free_member_discount_type == 'fixed'
											? (
													parseInt(
														detailData?.actual_price || detailData?.property_details?.price
													) - detailData?.free_member_discount_value
											  ).toFixed(2)
											: (
													parseInt(
														detailData?.actual_price || detailData?.property_details?.price
													) -
													(detailData?.actual_price || detailData?.property_details?.price) *
														(detailData?.free_member_discount_value / 100)
											  ).toFixed(2)}
									</ins>
								</div>
							</div>
						</div>

						<div class='d-flex align-items-center justify-content-betweeon gap-lg-3 gap-md-2 gap-1 pt-4'>
							{detailData?.id && (
								<DetailPageActionButtons
									apiUrl={Endpoints.addDealWishlist + params?.id}
									shareUrl={`/deal-details?id=${params?.id}`}
									redeemUrl={Endpoints.redeemDeal + params?.id}
									added_to_wishlist={detailData?.added_to_wishlist}
									categoryType={'deal'}
									is_redeemed={detailData?.is_redeemed}
									flagUrl={Endpoints.flagDeal}
									detail_id={params?.id}
									is_flagged={detailData?.is_flagged}
									// added_to_flag={detailData?.creator_details?.id}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BusinesDealsDetailPage;

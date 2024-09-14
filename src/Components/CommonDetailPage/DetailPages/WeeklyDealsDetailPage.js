import React from 'react';
import { useTranslation } from 'react-i18next';
import DetailPageActionButtons from '../DetailPageActionButtons';
import { Endpoints } from '../../../API/Endpoints';
import { getChoosenCurrency } from '../../../helpers';
import moment from 'moment';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';
import DealDetails from '../../../Pages/Portal/DealDetails';

function WeeklyDealsDetailPage({ detailData, params }) {
	const { t } = useTranslation();
	const user_currency = getChoosenCurrency();

	return (
		<div className='container'>
			<div className='py-4 border-bottom'>
				<div class='row m-0 py-2'>
					<div class='col-lg-4'>
						<div
							class='weekly-deal-left position-relative'
							style={{
								height: '100%',
							}}
						>
							<img
								style={{
									height: '100%',
								}}
								src={Endpoints.baseUrl + detailData?.images?.[0]?.image}
								alt=''
							/>
							<div class='position-absolute start-0 top-0 h-100 d-flex flex-column align-items-center justify-content-center text-center py-3 px-2'>
								{detailData?.free_member_discount_type === 'fixed' ? (
									<h4 class='bold text-white fs-sm-24'>
										{user_currency?.sign +
											detailData?.free_member_discount_value +
											' ' + t("OFF")}
									</h4>
								) : (
									<h4 class='bold text-white fs-sm-24'>
										{detailData?.free_member_discount_value + '% ' + t("OFF")}
									</h4>
								)}
								<p class='m-0 text-white fs-30 light py-2 fs-sm-18'>
									{detailData?.title}
								</p>
							</div>
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
								<p className='text-gray1 fs-sm-9 m-0'>{t("Expire in:")} </p>
								<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
								{moment(detailData.expiry_date).isBefore(new Date())
									? t('Expired')
									: moment(detailData.expiry_date).diff(new Date(), 'days') === 0
									? t('Last Day')
									: moment(detailData.expiry_date).diff(new Date(), 'days') +
									  + " " + t('Days Left')}
							</div>
						</div>

						<h3 className='fs-26 text-black fs-sm-22 pb-2'>{detailData?.title}</h3>
						<div className='text-justify light text-gray2 py-2'>
							<p>{detailData?.description}</p>
						</div>
						<OnlineOfflineIcon deal_type={DealDetails?.deal_type} />

						<div class='rounded-10 bg-blue py-lg-4 py-lg-4 p-3 d-flex align-items-center justify-content-center gap-2'>
							<span class='medium text-gray1 fs-22 fs-sm-12'>{t('All Members')}</span>
							{detailData?.free_member_discount_type === 'fixed' ? (
								<span class='medium text-blue fs-36 fs-sm-18'>
									{user_currency?.sign + detailData?.free_member_discount_value + ' ' + t("OFF")}
								</span>
							) : (
								<span class='medium text-blue fs-36 fs-sm-18'>
									{detailData?.free_member_discount_value + '% ' + t("OFF")}
								</span>
							)}
							<del class='medium text-gray1 fs-22 fs-sm-12'>
								{user_currency?.sign}
								{parseFloat(detailData?.actual_price)?.toFixed(2)}
								{/* $1800.00 */}
							</del>
							<ins class='medium text-blue fs-22 text-decoration-none fs-sm-12'>
								{user_currency?.sign}
								{detailData?.free_member_discount_type === 'fixed'
									? (
											parseFloat(detailData?.actual_price) -
											detailData?.free_member_discount_value
									  ).toFixed(2)
									: (
											parseFloat(detailData?.actual_price) -
											detailData?.actual_price *
												(detailData?.free_member_discount_value / 100)
									  ).toFixed(2)}
							</ins>
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
									detail_id={params?.id}
									flagUrl={Endpoints.flagDeal}
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

export default WeeklyDealsDetailPage;

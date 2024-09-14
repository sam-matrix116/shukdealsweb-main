import React from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { getChoosenCurrency } from '../../../helpers';
import DetailPageActionButtons from '../DetailPageActionButtons';
import VerticalThumbnailCrousel from '../../CommonCrousel/VerticalThumbnailCrousel';

function RealEstateDetailPage({ detailData, params }) {
	const { t } = useTranslation();
	const user_currency = getChoosenCurrency();

	return (
		<div className='container'>
			<div className='py-4 border-bottom'>
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
						<div className='d-flex align-items-center gap-lg-5  gap-2 pb-3 deal-content-row pb-md-4 pb-3'>
							<span className='m-0 fs-12 fs-sm-9'>
								{t('Property Type')}: {detailData?.property_details?.property_type}
							</span>
							<span className='m-0 fs-12 fs-sm-9'>
							{t('Posted') + ':'}{' '} {moment(detailData?.created_at).format('DD MMM YYYY')}
							</span>
							<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
								<p className='text-gray1 fs-sm-9 m-0'>{t('Expire in:')} </p>
								<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
								{moment(detailData.expiry_date).isBefore(new Date())
									? 'Expired'
									: moment(detailData.expiry_date).diff(new Date(), 'days') === 0
									? t('Last Day')
									: moment(detailData.expiry_date).diff(new Date(), 'days') +
									  ' ' +
									  t('Days Left')}
							</div>
						</div>

						<h3 className='fs-26 text-black fs-sm-22 pb-2'>{detailData?.title}</h3>
						<div className='text-justify light text-gray2 py-2'>
							<p>{detailData?.description}</p>
						</div>
						{detailData?.business_sub_category == 12 ? (
							<h3 className='medium text-blue py-3'>
								{user_currency?.sign} {detailData?.property_details?.price?.toFixed(2)}
							</h3>
						) : (
							<h4 className='medium text-blue py-3'>
								{detailData?.property_details?.offer_text}
							</h4>
						)}

						<div class='d-flex align-items-center  w-100'></div>

						<div class='d-flex align-items-center  gap-lg-3 gap-md-2 gap-1'>
							{detailData?.id && (
								<DetailPageActionButtons
									apiUrl={Endpoints.addDealWishlist + params?.id}
									shareUrl={`/deal-details?id=${params?.id}`}
									added_to_wishlist={detailData?.added_to_wishlist}
									contactDetail={'66'}
									categoryType={'deal'}
									detail_id={params?.id}
									flagUrl={Endpoints.flagDeal}
									is_flagged={detailData?.is_flagged}
								/>
							)}
						</div>
						<div class='d-flex flex-column  align-items-start gap-lg-3 gap-md-2 gap-1 pt-4'>
							<span>{t('Property Location')}</span>
							<span className='d-flex gap-1'>
								<img src='assets/img/icon/location1.svg' alt='' />
								{detailData?.location?.city +
									' ' +
									detailData?.location?.state +
									' ' +
									detailData?.location?.country}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RealEstateDetailPage;

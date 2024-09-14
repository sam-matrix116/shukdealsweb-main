import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { getChoosenCurrency } from '../../../helpers';
import DetailPageActionButtons from '../DetailPageActionButtons';
import { CommonClassifiedRow, CommonRecommendationRow } from '../../sliders';
import VerticalThumbnailCrousel from '../../CommonCrousel/VerticalThumbnailCrousel';
const $ = window.jQuery;

function ClassifiedDetailPage({ detailData, params, removeCards }) {
	const { t } = useTranslation();
	const user_currency = getChoosenCurrency();

	return (
		<div className='container '>
			<div className='py-4 border-bottom'>
				<div className='row m-0 py-2'>
					<div className='col-lg-5'>
						<div className=' position-relative'>
							<VerticalThumbnailCrousel images={detailData?.images} isUrl={false} />
						</div>
					</div>

					<div className='col-lg-7 pt-lg-0 pt-4'>
						<div className='pb-2'>
							{detailData?.location_details?.city?
							<span className='fs-14 fs-sm-10'>
								<img src='assets/img/icon/location1.svg' alt='' />
								{' ' +
									detailData?.location_details?.city +
									' ' +
									detailData?.location_details?.state +
									' ' +
									detailData?.location_details?.country}
							</span>:null
							}
						</div>
						<h3 className='fs-26 text-black fs-sm-22 pb-2'>{detailData?.title}</h3>
						<div className='d-flex align-items-center gap-lg-3  gap-2 pb-3 deal-content-row '>
							<p className='m-0 fs-12 fs-sm-9'>
								{t('Posted') + ':'}{' '}
								{moment(detailData?.created_at)?.format('DD MMM YYYY')}
							</p>
							<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
								<p className='text-gray1 fs-sm-9 m-0'>{t("Expire in:")} </p>
								<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
								{moment(detailData?.expiry_date)?.format('DD MMM YYYY')}
							</div>
						</div>

						<div className='text-justify light text-gray2 py-2'>
							<p>{detailData?.description}</p>
						</div>

						<h3 className='medium text-blue py-3'>
							{user_currency?.sign} {detailData?.price?.toFixed(2)}
						</h3>
						<p className='text-black m-0'>
							{t("Contact")} {detailData?.creator_details?.firstname} {t("For more details:")}
						</p>
						<p className='text-gray2 my-2'>
							<img src='assets/img/icon/call.svg' width='15' className='me-2' />
							{detailData?.contact_phone}
						</p>
						<p className='text-gray2 m-0'>
							<img src='assets/img/icon/mail.svg' width='15' className='me-2' />
							{detailData?.contact_email}
						</p>

						<div className='d-flex align-items-center justify-content-betweeon gap-lg-3 gap-md-2 gap-1 pt-4'>
							{detailData?.id && (
								<DetailPageActionButtons
									apiUrl={Endpoints.addClassifiedWishlist + detailData?.id}
									shareUrl={`${'/classified-details'}?id=${detailData?.id}`}
									added_to_wishlist={detailData?.added_to_wishlist}
									categoryType={'classified'}
									flagUrl={Endpoints.flagClassified}
									detail_id={params?.id}
									is_flagged={detailData?.is_flagged}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{detailData?.creator_details?.id && !removeCards ? (
				<div className='pt-4'>
					<CommonClassifiedRow
						id={detailData?.creator_details?.id}
						classifiedId={params?.id}
						headTitle={`${
							detailData?.creator_details?.firstname
						}’s ${t('Other Classifieds')}`}
						headSize={true}
						viewAllBtn={true}
						classifiedType={'users'}
						paginationSize={4}
					/>
				</div>
			) : null}

			{detailData?.creator_details?.id && !removeCards ? (
				<div className='py-lg-4 py-3 '>
					<CommonRecommendationRow
						headTitle={`${
							detailData?.creator_details?.firstname ||
							detailData?.creator_details?.name
						}’s ${'Recommendation'}`}
						headSize={true}
						recommendedType={'others'}
						userId={detailData?.creator_details?.id}
						paginationSize={4}
					/>
				</div>
			) : null}
		</div>
	);
}

export default ClassifiedDetailPage;

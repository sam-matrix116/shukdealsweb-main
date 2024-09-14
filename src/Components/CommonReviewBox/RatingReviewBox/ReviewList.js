import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import StarRatingDisplay from './StarRatingDisplay';
import ActionReviewButtons from './ActionReviewButtons';
import { Endpoints } from '../../../API/Endpoints';
import { Link } from 'react-router-dom';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';

function ReviewList({ reviewList, categoryType, nextUrl, extraReviewData }) {
	const { t } = useTranslation();
	const [data, setData] = useState();

	const formatDate = (inputDate) => {
		return moment(inputDate).utc().format('D MMMM YYYY');
	};
	const handleLoadMore = async (e) => {
		e.preventDefault();
		if (!nextUrl) {
			ToastMessage.Error(t('No more reviews yet.'));
			return;
		}
		try {
			let resp = await FetchApi(nextUrl);
			if (resp) {
				setData((value) => [...value, ...resp.results]);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};
	const flagUrl =
		categoryType === 'user'
			? Endpoints.flagUserReview
			: categoryType === 'deal'
			? Endpoints.flagDealReview
			: null;
	const markUrl =
		categoryType === 'user'
			? Endpoints.markUserReviewUseful
			: categoryType === 'deal'
			? Endpoints.markDealReviewUseful
			: null;

	useEffect(() => {
		setData(reviewList);
	}, [reviewList]);

	return (
		<div className='customer-feedback'>
			{data?.map((item, index) => (
				<div className='row mb-4 mx-0 pb-2'>
					<div className='col-lg-10 p-0'>
						<div className='d-flex align-items-start gap-3'>
							<div>
								<img
									src={Endpoints.baseUrl + item?.reviewed_by_profile_pic}
									className='rounded-circle object-cover customer-pic'
									width='65'
									height='65'
									alt=''
								/>
							</div>
							<div>
								<h4 className='fs-16 text-black pb-1'>{item?.reviewed_by}</h4>
								<h6 className='text-gray2 fs-14'>{formatDate(item?.created_at)}</h6>
								<div className='d-flex align-items-center gap-2 py-2'>
									<StarRatingDisplay rating={item?.rating} size={'15px'} />
									<p className='fs-14 text-blue m-0 fs-sm-9'>
										{item?.rating?.toFixed(1)}
									</p>
									{item?.review_useful_count ? (
										<p className='fs-14 text-blue m-0 fs-sm-9'>
											{`| ${t("Number of people found it useful")}: ${item?.review_useful_count}`}
										</p>
									) : null}
								</div>
								<p className='light text-gray2 mb-2'>{item?.comment}</p>

								<ActionReviewButtons data={item} flagUrl={flagUrl} markUrl={markUrl} />
							</div>
						</div>
					</div>
				</div>
			))}

			{extraReviewData?.total_reviews > 4 ? (
				<Link onClick={handleLoadMore} className='text-blue'>
					{t('Load More')}
				</Link>
			) : null}
		</div>
	);
}

export default ReviewList;

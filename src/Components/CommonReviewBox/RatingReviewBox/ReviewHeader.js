import React from 'react';
import { useTranslation } from "react-i18next";
import StarRatingDisplay from './StarRatingDisplay';

function ReviewHeader({ data }) {
    const { t } = useTranslation();
	return (
		<div>
			{' '}
			<h3 className='fs-30 fs-sm-24 text-gray1 pb-3'>{t("Customer Reviews & Ratings")}</h3>
			<div className='d-flex align-items-center gap-2 pb-5'>
				<StarRatingDisplay rating={data?.average_reviews} size={'20px'} />
				<p className='fs-26 text-blue m-0 fs-sm-18'>
					{data?.average_reviews?.toFixed(1)} | {data?.total_reviews} {t("Reviews")}
				</p>
			</div>
		</div>
	);
}

export default ReviewHeader;

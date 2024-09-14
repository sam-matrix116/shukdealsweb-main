import React from 'react';
import { useTranslation } from "react-i18next";
import ReviewHeader from './ReviewHeader';
import ReviewList from './ReviewList';

function RatingReviewBox({
	reviewListData,
	extraReviewData,
	categoryType,
	nextUrl,
}) {
    const { t } = useTranslation();

	return (
		<div className='customer-rating pt-3 pb-4'>
			<ReviewHeader data={extraReviewData} />
			<ReviewList
				reviewList={reviewListData}
				categoryType={categoryType}
				nextUrl={nextUrl}
				extraReviewData={extraReviewData}
			/>
		</div>
	);
}

export default RatingReviewBox;

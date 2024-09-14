import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonOfferRow } from '../sliders';

function CategoryListingWeekly({ params, title = 'Weekly Offers' }) {
	const { t } = useTranslation();
	return (
		<div>
			<CommonOfferRow
				viewAllBtn={false}
				params={params}
				paginationSize={16}
				headTitle={title}
				activatePagination={true}
			/>
		</div>
	);
}

export default CategoryListingWeekly;

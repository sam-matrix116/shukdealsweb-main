import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonRecommendationRow } from '../sliders';

function CategoryListingRecommendation({ id }) {
	const { t } = useTranslation();

	return (
		<div>
			{id ? (
				<CommonRecommendationRow
					viewAllBtn={false}
					recommendedType={'others'}
					userId={id}
					paginationSize={16}
					headTitle={'All Recommended'}
					activatePagination={true}
				/>
			) : (
				<CommonRecommendationRow
					viewAllBtn={false}
					recommendedType={'users'}
					paginationSize={16}
					headTitle={'All Recommended'}
					activatePagination={true}
				/>
			)}
		</div>
	);
}

export default CategoryListingRecommendation;

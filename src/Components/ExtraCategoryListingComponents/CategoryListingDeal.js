import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonDealsRow } from '../sliders';

function CategoryListingDeal({ url, title }) {
	const { t } = useTranslation();
	return (
		<div>
			<CommonDealsRow
				givenUrl={url}
				detailViewLink={'/deal-details'}
				headTitle={title}
				paginationSize={16}
                dataValue={'all'}
                activatePagination={true}
			/>
		</div>
	);
}

export default CategoryListingDeal;

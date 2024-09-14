import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonClassifiedRow, CommonDealsRow } from '../sliders';

function CategoryListingClassified({
	params,
	title = 'NGO’s Members classifieds',
}) {
	const { t } = useTranslation();
	return (
		<div>
			<CommonClassifiedRow
				headSize={false}
				headTitle={title}
				paginationSize={16}
                activatePagination={true}
				classifiedType={'others'}
				params={params}
			/>
		</div>
	);
}

export default CategoryListingClassified;

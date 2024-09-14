import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonTopBusinessRow } from '../sliders';
import { Endpoints } from '../../API/Endpoints';

function CategoryListingTopBusiness({ params, title = 'Top Store / Business Profile'}) {
	const { t } = useTranslation();
	return (
		<div>
			<CommonTopBusinessRow
				givenUrl={Endpoints.topStoreBusinessProfile}
				viewAllBtn={false}
				params={params}
				paginationSize={16}
				headTitle={title}
				categoryType={'business'}
				activatePagination={true}
			/>
		</div>
	);
}

export default CategoryListingTopBusiness;

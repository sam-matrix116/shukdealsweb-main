import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import LoadingSpinner from '../../Components/Loader';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
	CategoryListingClassified,
	CategoryListingDeal,
	CategoryListingRecommendation,
	CategoryListingTopBusiness,
	CategoryListingWeekly,
} from '../../Components/ExtraCategoryListingComponents';

function ExtraCategoryListing() {
	const { t } = useTranslation();
	const location = useLocation();
	const recommendedId = location?.state?.id;
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div>
			<CustomHeader />

			<div className='main py-lg-5 py-3'>
				<div className='container'>
					<div className=' d-flex justify-content-end pb-md-4 pb-3'>
						{/* <CategoryLisitngFlterHeader /> */}
					</div>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<div>
							{/* //top buinesses*/}
							{location.pathname === '/category-listing-recommendation' && (
								<CategoryListingRecommendation id={recommendedId} />
							)}
							{location.pathname === '/category-listing-top-business' && (
								<CategoryListingTopBusiness
									title={location?.state?.headTitle}
									params={location?.state?.params}
								/>
							)}
							{location.pathname === '/Extra-category-listing-deal' && (
								<CategoryListingDeal
									url={location?.state?.givenUrl}
									title={location?.state?.headTitle}
								/>
							)}
							{location.pathname === '/Extra-category-listing-classified' && (
								<CategoryListingClassified
									title={location?.state?.headTitle}
									params={location?.state?.params}
								/>
							)}
							{location.pathname === '/Extra-category-listing-weekly' && (
								<CategoryListingWeekly
									title={location?.state?.headTitle}
									params={location?.state?.params}
								/>
							)}
						</div>
					)}
				</div>
			</div>

			<CustomFooter />
		</div>
	);
}

export default ExtraCategoryListing;

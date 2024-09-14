import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Endpoints } from '../../API/Endpoints';
import {
	CommonTopBusinessRow,
	CommonRealEstateRow,
	CommonNgoPartnersRow,
	CommonDealsRow,
	CommonRecommendationRow,
	PageLinkRow,
	CommonOfferRow,
	CommonClassifiedRow,
	CommonJobsRow,
} from '../../Components/sliders';
import CommonAddBtn from '../../Components/CommonAddBtn';
import { getLoggedInUser } from '../../helpers';
import { getLocationPermission } from '../../helpers/locationHelper';
import useSearchContext from '../../context/searchContext';

function Landing() {
	const { t } = useTranslation();
	const { isSearchLocation } = useSearchContext();
	const user = getLoggedInUser();
	const choosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));

	// useEffect(() => {
	// 	if (!choosenLocation?.location) getLocationPermission('chosenLocation');
	// }, [isSearchLocation]);

	return (
		<div>
			<CustomHeader />

			<div className='main py-lg-5 py-3'>
				<div className='container'>
					<PageLinkRow sendLocationState={true} />

					{user?.user_type && (user?.user_type === 'Business' || 
					user?.user_type === 'Non Profitable Organization') && (
						<div className=' d-flex justify-content-end gap-2'>
							<CommonAddBtn
								profileData={user}
								categoryType={'btn'}
								removeTitle={true}
							/>
							<CommonAddBtn 
							removeTitle={true} 
							profileData={user} 
							categoryType={'weekly_deal'} 
							weekly_home_btn={true}
							/>
						</div>
					)}

					{/* <!-- OFFER'S Crousel --> */}
					<CommonOfferRow 
					paginationSize={8} 
					isSlider={true} 
					/>

					{/* NGO partners Crousel */}
					<CommonNgoPartnersRow
						givenUrl={Endpoints.getNgoPartnersList}
						paginationSize={8}
						isSlider={true}
					/>

					{/* Recommendation Crousel */}
					<CommonRecommendationRow
						headTitle={'Recommendation'}
						titleSize={true}
						paginationSize={4}
						recommendedType={'users'}
					/>

					{/* Classifieds Crousel*/}
					<CommonClassifiedRow
						headTitle={t('Deals In Classifieds')}
						headSize={false}
						viewAllBtn={true}
						paginationSize={4}
						classifiedType={'others'}
						createClassified={user?.user_type === 'Member' ? true : false}
					/>

					{/* Top stores Business Crousel */}
					<CommonTopBusinessRow
						givenUrl={Endpoints.topStoreBusinessProfile}
						paginationSize={4}
					/>

					{/* NGO Crousel */}
					{/* <CommonDealsRow
						givenUrl={Endpoints.getAllNgoDeals}
						dataValue={'product'}
						headTitle={t(`Deals In NGO's`)}
						// viewAllLink={'/category-listing-products'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/> */}

					{/* Product Crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getBusinessCategoryDeals + 'product'}
						dataValue={'product'}
						headTitle={t('Deals In Products')}
						viewAllLink={'/category-listing-products'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Services crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getBusinessCategoryDeals + 'service'}
						dataValue={'service'}
						headTitle={t('Deals In Services')}
						viewAllLink={'/category-listing-services'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Restaurant crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getBusinessCategoryDeals + 'restaurant'}
						dataValue={'restaurant'}
						headTitle={t('Deals In Restaurants')}
						viewAllLink={'/category-listing-restaurants'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Travel crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getBusinessCategoryDeals + 'travel'}
						dataValue={'travel'}
						headTitle={t('Deals In Travel')}
						viewAllLink={'/category-listing-travel'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>
					{/* Realstate Rent crousel */}
					<CommonRealEstateRow
						givenUrl={Endpoints.getRealEstateDeals + '10'}
						dataValue={'rent'}
						headTitle={t('Deals In Property For Rent')}
						viewAllLink={'/category-listing-realestate'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Realstate Sale crousel */}
					<CommonRealEstateRow
						givenUrl={Endpoints.getRealEstateDeals + '12'}
						dataValue={'sale'}
						headTitle={t('Deals In Property For Sale')}
						viewAllLink={'/category-listing-realestate'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Realstate Vacation crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getRealEstateDeals + '11'}
						dataValue={'vacation_rental'}
						headTitle={t('Deals In Vacation Rental')}
						viewAllLink={'/category-listing-realestate'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Entertainment crousel */}
					<CommonDealsRow
						givenUrl={Endpoints.getBusinessCategoryDeals + 'entertainment_sport'}
						dataValue={'sports'}
						headTitle={t('Deals In Sports & Entertainment')}
						viewAllLink={'/category-listing-sports'}
						detailViewLink={'/deal-details'}
						paginationSize={4}
					/>

					{/* Jobs Crousel */}
					{/* <CommonJobsRow
						dataValue={'jobs'}
						removeTitle={true}
						detailViewLink={''}
						viewAllLink={'/category-listing-jobs'}
						paginationSize={4}
					/> */}
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default Landing;

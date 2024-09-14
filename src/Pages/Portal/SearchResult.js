import React, { useEffect, useState } from 'react';
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
import useSearchContext from '../../context/searchContext';
import ToastMessage from '../../Utils/ToastMessage';
import { FetchApi } from '../../API/FetchApi';
import CategoryLisitngFlterHeader from '../../Components/CommonCategoryLIstingComponents/CategoryLisitngFlterHeader';
import CommonHeadViewAllWrapper from '../../Components/CommonHeadViewAllWrapper';
import { paginationApiHelper } from '../../Components/CommonPagination';
import SearchFiltersTab from '../../Components/CommonCategoryLIstingComponents/SearchFiltersTab';
import { useSearchParams } from 'react-router-dom';

function SearchResult() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	let searchText = params?.q;
	const choosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const {
		searchData,
		setSearchFilters,
		searchSelectedTab,
		setSearchSelectedTab,
		setSearchData,
		// searchText,
		searchCategory,
		setIsSearchActivated,
		searchItemsCount,
		setSearchItemsCount,
		searchFilters,
	} = useSearchContext();
	const [isLoading, setIsLoading] = useState(false);
	const [subSelect, setSubSelect] = useState();
	const [filtersData, setFiltersData] = useState();
	const [selectedParamObj, setSelectedParamObj] = useState({
		search_key: searchText,
	});

	const masterSearchApi = async (filters) => {
		try {
			let resp = await FetchApi(Endpoints.masterSearch, null, null, {
				search_key: searchText,
				...filters,
			});
			if (resp && resp.data) {
				let data = resp.data;
				setSearchData(data);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const getSubCategoryData = async (type, url, subId) => {
		try {
			let resp = subId ? await FetchApi(url + subId) : await FetchApi(url);
			if (resp) {
				if (type === 'sub') {
					setFiltersData((values) => ({ ...values, typeSelectionData: resp.data }));
					setSubSelect(resp.data[0]);
				}
				if (type === 'category') {
					setFiltersData((values) => ({ ...values, categoryData: resp.data }));
				}
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const setFiltersApiCallingFuntion = () => {
		let sortName;
		let categoryName;
		let filterName = [];
		let filterBy = {};
		let filterByResult = {};
		let location;
		if (choosenLocation)
			location = {
				search_lat: choosenLocation?.latitude,
				search_lon: choosenLocation?.longitude,
			};
		if (searchFilters?.category) {
			let temp =
				searchSelectedTab?.name === 'ngo'
					? 'ngo_category'
					: searchSelectedTab?.name === 'realestate' ||
					  searchSelectedTab?.name === 'sport'
					? 'business_sub_sub_category'
					: searchSelectedTab?.name === 'classified'
					? 'classified_category'
					: 'business_sub_category';
			categoryName = { [temp]: searchFilters?.category?.id };
			// categoryName = {
			// 	[searchFilters?.category?.name]: searchFilters?.category?.value,
			// };
		}
		if (searchFilters?.sortBy) {
			sortName = { [searchFilters?.sortBy?.param]: searchFilters?.sortBy?.value };
		}
		if (searchFilters?.filterBy) {
			filterName = searchFilters?.filterBy?.map((item) => ({
				...filterBy,
				[item?.param]: item?.value,
			}));
			for (let i = 0; i < filterName?.length; i++) {
				filterByResult = {
					...filterByResult,
					[Object.keys(filterName[i])]: Object.values(filterName[i])[0],
				};
			}
		}
		let res = {
			...categoryName,
			...sortName,
			...location,
			...filterByResult,
		};

		if (!searchSelectedTab) {
			masterSearchApi(res);
		} else {
			setSelectedParamObj({
				search_key: searchText,
				...res,
			});
		}
	};
	useEffect(() => {
		// if (!searchFilters) return;
		setFiltersApiCallingFuntion();
	}, [searchFilters, searchText]);

	useEffect(() => {
		if (!searchSelectedTab) return;
		setSearchFilters({});
		setFiltersData({});
		setSubSelect({});
		setSearchItemsCount('');
		setSearchData({});
		if (searchSelectedTab?.id === '5' || searchSelectedTab?.id === '6') {
			getSubCategoryData(
				'sub',
				Endpoints.getBusinessSubCategoryList,
				searchSelectedTab?.id
			);
		} else if (
			['ngo', 'businesses', 'member'].includes(searchSelectedTab?.name)
		) {
			getSubCategoryData(
				'category',
				Endpoints.getUserCategoryList,
				searchSelectedTab?.name
			);
		} else if (['classified'].includes(searchSelectedTab?.name)) {
			getSubCategoryData('category', Endpoints.getClassifiedCategory);
		} else {
			getSubCategoryData(
				'category',
				Endpoints.getBusinessSubCategoryList,
				searchSelectedTab?.id
			);
		}
		setFiltersApiCallingFuntion();
	}, [searchSelectedTab]);

	// useEffect(() => {
	//  setSearchSelectedTab({...params})
	// }, [])

	return (
		<div>
			<CustomHeader />

			<div className='main py-lg-5 py-3'>
				<div className='container'>
					<h1 class='fs-sm-16 fs-22 pb-md-0 pb-2 mb-5 text-gray1 regular'>
						{searchData?.total_count || searchItemsCount} {t("Item Found")}{' '}
						<span class='medium'>{searchText && `${t("For")} “${searchText}”`}</span>
					</h1>

					{/* tabs */}
					<PageLinkRow setSubSelect={setSubSelect} />

					{/* filters */}
					{searchSelectedTab ? (
						<SearchFiltersTab
							setIsLoading={setIsLoading}
							setSubSelect={setSubSelect}
							subSelect={subSelect}
							selectedTab={searchSelectedTab}
							getSubCategoryDataApi={getSubCategoryData}
							// filters
							filters={searchFilters}
							setFilters={setSearchFilters}
							filtersData={filtersData}
							setFiltersData={setFiltersData}
						/>
					) : null}
					<br />

					{/* <!-- OFFER'S Crousel --> */}
					{searchData?.weekly_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.weekly_deals_count}
							title={`${searchText || ''} In Weekly Offers`}
							changeData={{ name: 'weekly' }}
						>
							<CommonOfferRow
								givenData={searchData?.weekly_deals}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'weekly' ? (
						<CommonOfferRow
							givenUrl={Endpoints.masterSearch + '?module_type=weekly'}
							headTitle={`${searchText || ''} In Weekly Offers`}
							params={selectedParamObj}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* NGO partners Crousel */}
					{searchData?.ngo_partners_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.ngo_partners_count}
							title={`${searchText || ''} ${" "} ${t("In Non-Profit Organizations Partners")}`}
							changeData={{ name: 'ngo' }}
							setData={setSearchData}
						>
							<CommonNgoPartnersRow
								givenData={searchData?.ngo_partners}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'ngo' ? (
						<CommonNgoPartnersRow
							givenUrl={Endpoints.masterSearch + '?module_type=ngo'}
							headTitle={`${searchText || ''} In Non-Profit Organization Partners`}
							params={selectedParamObj}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Members Crousel */}
					{searchData?.member_profiles_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.member_profiles_count}
							title={`${searchText || ''} ${" "} ${t("In Members")}`}
							changeData={{ name: 'member' }}
							setData={setSearchData}
						>
							<CommonNgoPartnersRow
								givenData={searchData?.member_profiles}
								redirectUrl={'/user-profile-other-view'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'member' ? (
						<CommonNgoPartnersRow
							givenUrl={Endpoints.masterSearch + '?module_type=members'}
							redirectUrl={'/user-profile-other-view'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} In Members`}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* <!-- Recommendation Crousel --> */}
					{/* {searchData?.weekly_deals_count && (
						<>
							{searchSelectedTab ? (
								<CommonTopBusinessRow
									givenData={searchData?.weekly_deals?.results}
									removeTitle={true}
									activatePagination={true}
									paginationSize={16}
								/>
							) : (
								<CommonHeadViewAllWrapper
									dataLength={searchData?.weekly_deals_count}
									title={`${searchText} In Weekly Deals`}
									changeData={{ name: 'weekly' }}
									setData={setSearchData}
								>
									<CommonRecommendationRow
										givenData={searchData?.weekly_deals}
										headTitle={'Recommendation'}
										removeTitle={true}
										recommendedType={'users'}
									/>
								</CommonHeadViewAllWrapper>
							)}
						</>
					)} */}

					{/* Top stores Business Crousel */}
					{searchData?.business_profiles_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.business_profiles_count}
							title={`${searchText || ''} ${t("In Store/Business Profile")}`}
							changeData={{ name: 'businesses' }}
							setData={setSearchData}
						>
							<CommonTopBusinessRow
								givenData={searchData?.business_profiles}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'businesses' ? (
						<CommonTopBusinessRow
							givenUrl={Endpoints.masterSearch + '?module_type=businesses'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${" "}${t("In Store/Business Profile")}`}
							viewAllBtn={false}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Classifieds Crousel*/}
					{searchData?.classifieds_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.classifieds_count}
							title={`${searchText || ''} ${" "} ${t("In Classifieds")}`}
							changeData={{ name: 'classified' }}
							setData={setSearchData}
						>
							<CommonClassifiedRow
								givenData={searchData?.classifieds}
								headSize={false}
								removeTitle={true}
								classifiedType={'others'}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'classified' ? (
						<CommonClassifiedRow
							givenUrl={Endpoints.masterSearch + '?module_type=classified'}
							params={selectedParamObj}
							classifiedType={'others'}
							headTitle={`${searchText || ''} ${" "} ${t("In Classifieds")}`}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Product Crousel */}
					{searchData?.product_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.product_deals_count}
							title={`${searchText || ''} ${" "} ${t("In Products")}`}
							changeData={{ name: 'product', id: '1' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.product_deals}
								removeTitle={true}
								dataValue={'product'}
								detailViewLink={'/deal-details'}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'product' ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=product'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${" "} ${t("In Products")}`}
							dataValue={'product'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* NGO deal Crousel */}
					{searchData?.ngo_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.product_deals_count}
							title={`${searchText || ''} ${t("In Non-Profit Organizations")}`}
							changeData={{ name: 'product', id: '1' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.ngo_deals}
								removeTitle={true}
								dataValue={'product'}
								detailViewLink={'/deal-details'}
							/>
						</CommonHeadViewAllWrapper>
					) : null}

					{/* Services crousel */}
					{searchData?.service_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.service_deals_count}
							title={`${searchText || ''} In Services`}
							changeData={{ name: 'service', id: '2' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.service_deals}
								dataValue={'service'}
								detailViewLink={'/deal-details'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'service' ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=service'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} In Services`}
							dataValue={'service'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Restaurant crousel */}
					{searchData?.restaurant_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.restaurant_deals_count}
							title={`${searchText || ''} ${t("In Restaurants")}`}
							changeData={{ name: 'restaurant', id: '3' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.restaurant_deals}
								dataValue={'restaurant'}
								detailViewLink={'/deal-details'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'restaurant' ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=restaurant'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${t("In Restaurants")}`}
							dataValue={'restaurant'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Travel crousel */}
					{searchData?.travel_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.travel_deals_count}
							title={`${searchText || ''} ${" "} ${t("In Travel")}`}
							changeData={{ name: 'travel', id: '4' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.travel_deals}
								dataValue={'travel'}
								detailViewLink={'/deal-details'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'travel' ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=travel'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${" "} ${t("In Travel")}`}
							dataValue={'travel'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Realstate Rent crousel */}
					{searchData?.rent_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.rent_deals_count}
							title={`${searchText} ${" "} ${t("In Property for Rent")}`}
							changeData={{ name: 'realestate', id: '5' }}
							setData={setSearchData}
						>
							<CommonRealEstateRow
								givenData={searchData?.rent_deals}
								dataValue={'rent'}
								detailViewLink={'/deal-details'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'realestate' &&
					  subSelect?.keyword === 'rent' ? (
						<CommonRealEstateRow
							givenUrl={Endpoints.masterSearch + '?module_type=real_estate'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${t("In Property For Rent")}`}
							dataRetriveValue={'rent_deals'}
							dataValue={'rent'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Realstate Sale crousel */}
					{searchData?.sale_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.sale_deals_count}
							title={`${searchText || ''} In Property For Sale`}
							changeData={{ name: 'realestate', id: '5' }}
							setData={setSearchData}
						>
							<CommonRealEstateRow
								givenData={searchData?.sale_deals}
								dataValue={'sale'}
								detailViewLink={'/deal-details'}
								removeTitle={true}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'realestate' &&
					  subSelect?.keyword === 'sale' ? (
						<CommonRealEstateRow
							givenUrl={Endpoints.masterSearch + '?module_type=real_estate'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} In Property For Sale`}
							dataRetriveValue={'sale_deals'}
							dataValue={'sale'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Realstate Vacation crousel */}
					{searchData?.vacation_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.vacation_deals_count}
							title={`${searchText || ''} ${t("In Property For Vacation Rental")}`}
							changeData={{ name: 'realestate', id: '5' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.vacation_deals}
								dataValue={'vacation_rental'}
								detailViewLink={'/deal-details'}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'realestate' &&
					  subSelect?.keyword === 'vacation_rental' ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=real_estate'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${" "} ${t("In Property For Vacation Rental")}`}
							dataRetriveValue={'vacation_deals'}
							dataValue={'vacation_rental'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Entertainment crousel */}
					{searchData?.sports_deals_count && !searchSelectedTab ? (
						<CommonHeadViewAllWrapper
							dataLength={searchData?.sports_deals_count}
							title={`${searchText || ''} ${t("In Sports & Entertainment")}`}
							changeData={{ name: 'sport', id: '6' }}
							setData={setSearchData}
						>
							<CommonDealsRow
								givenData={searchData?.sports_deals}
								dataValue={'sport'}
								detailViewLink={'/deal-details'}
							/>
						</CommonHeadViewAllWrapper>
					) : searchSelectedTab?.name === 'sport' && subSelect?.keyword ? (
						<CommonDealsRow
							givenUrl={Endpoints.masterSearch + '?module_type=entertainment_sport'}
							// givenUrl={Endpoints.masterSearch + '?module_type=sport'}
							params={selectedParamObj}
							headTitle={`${searchText || ''} ${t("In Sports & Entertainment")}`}
							dataRetriveValue={
								subSelect.keyword === 'venue'
									? 'venue_deals'
									// : subSelect.keyword === 'sports'
									: subSelect.keyword === 'sport'
									? 'sports_deals'
									: subSelect.keyword === 'movie_theater'
									? 'movie_deals'
									: null
							}
							dataValue={'sport'}
							detailViewLink={'/deal-details'}
							activatePagination={true}
							paginationSize={16}
							setDataRetriveCount={setSearchItemsCount}
						/>
					) : null}

					{/* Jobs Crousel */}
					{/* <CommonJobsRow
						dataValue={'jobs'}s
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

export default SearchResult;

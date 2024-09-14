import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Link, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../Components/Loader';
import {
	CommonClassifiedRow,
	CommonDealsRow,
	CommonJobsRow,
	CommonNgoPartnersRow,
	CommonRealEstateRow,
} from '../../Components/sliders';
import { Endpoints } from '../../API/Endpoints';
import SubCategoryTabs from '../../Components/CategoryLisitngComponents/SubCategoryTabs';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';
import TopCategoryTabs from '../../Components/CategoryLisitngComponents/TopCategoryTabs';

function CategoryListing() {
    const { t } = useTranslation();
	const location = useLocation();
	const choosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const [isLoading, setIsLoading] = useState(false);
	const [noDataResponse, setNoDataResponse] = useState(false);
	const [filters, setFilters] = useState({});
	const [finalFilters, setFinalFilters] = useState({});
	const [subCategoryData, setSubCategoryData] = useState([]);
	const [filtersData, setFiltersData] = useState();
	const [filterByData, setFilterByData] = useState([]);
	const [subSelect, setSubSelect] = useState();
	const [selectedTab, setSelectedTab] = useState(
		location.pathname === '/category-listing-products'
			? { name: 'product', id: '1' }
			: location.pathname === '/category-listing-services'
			? { name: 'service', id: '2' }
			: location.pathname === '/category-listing-restaurants'
			? { name: 'restaurant', id: '3' }
			: location.pathname === '/category-listing-ngo'
			? { name: 'ngo' }
			: location.pathname === '/category-listing-travel'
			? { name: 'travel', id: '4' }
			: location.pathname === '/category-listing-sports'
			? { name: 'sport', id: '6' }
			: location.pathname === '/category-listing-realestate'
			? { name: 'realestate', id: '5' }
			: location.pathname === '/category-listing-classifieds'
			? { name: 'classified' }
			: location.pathname === '/category-listing-jobs'
			? { name: 'job' }
			: null
	);

	const getSubCategoryData = async (type, url, subId) => {
		try {
			let resp = subId ? await FetchApi(url + subId) : await FetchApi(url);
			if (resp) {
				if (type === 'sub') {
					setFiltersData((values) => ({ ...values, typeSelectionData: resp.data }));
					// setSubCategoryData(resp.data);
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
	useEffect(() => {
		if (!selectedTab) return;

		// setSubCategoryData([]);
		setFiltersData({});
		setSubSelect({});
		setFilters({});

		if (selectedTab?.id === '5' || selectedTab?.id === '6') {
			getSubCategoryData(
				'sub',
				Endpoints.getBusinessSubCategoryList,
				selectedTab?.id
			);
		} else if (selectedTab?.name === 'ngo') {
			getSubCategoryData(
				'category',
				Endpoints.getUserCategoryList,
				selectedTab?.name
			);
		} else if (selectedTab?.name === 'classified') {
			getSubCategoryData('category', Endpoints.getClassifiedCategory);
		} else {
			getSubCategoryData(
				'category',
				Endpoints.getBusinessSubCategoryList,
				selectedTab?.id
			);
		}
	}, [selectedTab]);

	useEffect(() => {
		if (!filters) return;
		let sortName;
		let categoryName;
		let filterName = [];
		let filterBy = {};
		let filterByResult = {};
		let location = {
			search_lat: choosenLocation?.latitude,
			search_lon: choosenLocation?.longitude,
		};
		if (filters?.category) {
			let temp =
				selectedTab?.name === 'ngo'
					? 'ngo_category'
					: selectedTab?.name === 'realestate' || selectedTab?.name === 'sport'
					? 'business_sub_sub_category'
					: selectedTab?.name === 'classified'
					? 'classified_category'
					: 'business_sub_category';
			categoryName = { [temp]: filters?.category?.id };
		}
		if (filters?.sortBy) {
			sortName = { [filters?.sortBy?.param]: filters?.sortBy?.value };
		}
		if (filters?.filterBy) {
			filterName = filters?.filterBy?.map((item) => ({
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
		setFinalFilters(res);
	}, [filters]);

	// console.log({ finalFilters });

	return (
		<div>
			<CustomHeader />

			<div className='main py-lg-5 py-3'>
				<div className='container'>
					<TopCategoryTabs
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>

					<div className='pb-md-4 pb-3'>
						<SubCategoryTabs
							// typeSelectionData={subCategoryData}
							setIsLoading={setIsLoading}
							setSubSelect={setSubSelect}
							subSelect={subSelect}
							selectedTab={selectedTab}
							getSubCategoryDataApi={getSubCategoryData}
							// filters
							filters={filters}
							setFilters={setFilters}
							filtersData={filtersData}
							setFiltersData={setFiltersData}
							// categorySelectionData={categorySelectionData}
							// sortingData={sortingData}
							// setSortingData={setSortingData}
						/>
					</div>

					{isLoading ? (
						<LoadingSpinner />
					) : (
						<div>
							{/* NGO's */}
							{selectedTab?.name === 'ngo' && (
								<CommonNgoPartnersRow
									givenUrl={Endpoints.getNgoPartnersList}
									removeTitle={true}
									paginationSize={16}
									isSlider={false}
									activatePagination={true}
									params={finalFilters}
								/>
							)}

							{/* //START Classifieds */}
							{selectedTab?.name === 'classified' && (
								<CommonClassifiedRow
									viewAllBtn={false}
									classifiedType={'others'}
									paginationSize={16}
									removeTitle={true}
									activatePagination={true}
									params={finalFilters}
								/>
							)}

							{/* Top stores Businesses */}
							{/* <CommonTopBusinessRow removeTitle={true} paginationSize={16} /> */}

							{/* Products */}
							{selectedTab?.name === 'product' && (
								<>
									<CommonDealsRow
										givenUrl={Endpoints.getBusinessCategoryDeals + 'product'}
										dataValue={'product'}
										removeTitle={true}
										detailViewLink={'/deal-details'}
										paginationSize={16}
										activatePagination={true}
										noDataResponse={noDataResponse}
										setNoDataResponse={setNoDataResponse}
										params={finalFilters}
									/>
									{/* {noDataResponse && NoDataMessage} */}
								</>
							)}

							{/* services */}
							{selectedTab?.name === 'service' && (
								<>
									<CommonDealsRow
										givenUrl={Endpoints.getBusinessCategoryDeals + 'service'}
										dataValue={'service'}
										removeTitle={true}
										detailViewLink={'/deal-details'}
										paginationSize={16}
										noDataResponse={noDataResponse}
										activatePagination={true}
										params={finalFilters}
									/>
									{/* {noDataResponse && NoDataMessage} */}
								</>
							)}
							{/* restaurants */}
							{selectedTab?.name === 'restaurant' && (
								<>
									<CommonDealsRow
										givenUrl={Endpoints.getBusinessCategoryDeals + 'restaurant'}
										dataValue={'restaurant'}
										removeTitle={true}
										detailViewLink={'/deal-details'}
										paginationSize={16}
										activatePagination={true}
										params={finalFilters}
									/>
									{/* {noDataResponse && NoDataMessage} */}
								</>
							)}

							{/* Travel */}
							{selectedTab?.name === 'travel' && (
								<>
									<CommonDealsRow
										givenUrl={Endpoints.getBusinessCategoryDeals + 'travel'}
										dataValue={'travel'}
										removeTitle={true}
										detailViewLink={'/deal-details'}
										paginationSize={16}
										activatePagination={true}
										params={finalFilters}
									/>
									{/* {noDataResponse && NoDataMessage} */}
								</>
							)}

							{/* RealState */}
							{selectedTab?.name === 'realestate' && subSelect?.id && (
								<>
									{subSelect?.id == 10 && (
										<CommonRealEstateRow
											givenUrl={Endpoints.getRealEstateDeals + '10'}
											dataValue={'rent'}
											removeTitle={true}
											detailViewLink={'/deal-details'}
											paginationSize={16}
											activatePagination={true}
											params={finalFilters}
										/>
									)}
									{subSelect?.id == 12 && (
										<CommonRealEstateRow
											givenUrl={Endpoints.getRealEstateDeals + '12'}
											dataValue={'sale'}
											removeTitle={true}
											detailViewLink={'/deal-details'}
											paginationSize={16}
											activatePagination={true}
											params={finalFilters}
										/>
									)}
									{subSelect?.id == 11 && (
										<>
											<CommonDealsRow
												givenUrl={Endpoints.getRealEstateDeals + '11'}
												dataValue={'vacation_rental'}
												removeTitle={true}
												detailViewLink={'/deal-details'}
												paginationSize={16}
												activatePagination={true}
												params={finalFilters}
											/>
											{/* {noDataResponse && NoDataMessage} */}
										</>
									)}
								</>
							)}

							{/* sport & Entertainment */}
							{selectedTab?.name === 'sport' && subSelect?.id && (
								<>
									<CommonDealsRow
										// givenUrl={Endpoints.getBusinessCategoryDeals + 'sport'}
										givenUrl={Endpoints.getBusinessCategoryDeals + 'entertainment_sport'}
										dataValue={'sports'}
										removeTitle={true}
										detailViewLink={'/deal-details'}
										paginationSize={16}
										activatePagination={true}
										params={{
											...finalFilters,
											// business_category: 'entertainment_sport',
											business_sub_category: subSelect?.id,
										}}
									/>
									{/* {noDataResponse && NoDataMessage} */}
								</>
							)}

							{/* Job Listing */}
							{selectedTab?.name === 'job' && (
								<CommonJobsRow
									dataValue={'jobs'}
									removeTitle={false}
									detailViewLink={''}
									paginationSize={16}
									activatePagination={true}
									params={finalFilters}
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

export default CategoryListing;

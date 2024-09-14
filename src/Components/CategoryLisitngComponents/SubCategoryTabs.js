import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import CategoryLisitngFlterHeader from '../CommonCategoryLIstingComponents/CategoryLisitngFlterHeader';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';

function SubCategoryTabs({
	typeSelectionData,
	setIsLoading,
	setSubSelect,
	subSelect,
	selectedTab,
	getSubCategoryDataApi,

	// filters
	filters,
	setFilters,
	filtersData,
	setFiltersData,

	// setSortingData,
}) {
    const { t } = useTranslation();

	const getSortingData = async (name) => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.masterSearchParams, null, null, {
				param_type: name,
			});
			if (resp) {
				const data = resp.params;
				let sortingData = data?.filter((item) => item?.param_tag === 'sort');
				let filteringData = data?.filter((item) => item?.param_tag === 'filter');
				setFiltersData((values) => ({ ...values, sortingData, filteringData }));
				setIsLoading(false);
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		if (subSelect?.keyword) {
			getSortingData(subSelect?.keyword);
		} else if (selectedTab?.name) {
			getSortingData(selectedTab?.name);
		}
	}, [selectedTab, subSelect]);

	useEffect(() => {
		if (!subSelect?.id) return;

		getSubCategoryDataApi(
			'category',
			Endpoints.getBusinessSubCategoryList,
			subSelect?.id
		);
	}, [subSelect]);

	return (
		<div>
			{selectedTab?.id === '5' || selectedTab?.id === '6' ? (
				<CategoryLisitngFlterHeader
					spread={true}
					subSelect={subSelect}
					setSubSelect={setSubSelect}
					filters={filters}
					setFilters={setFilters}
					filtersData={filtersData}
					setFiltersData={setFiltersData}
				/>
			) : (
				<div className=' d-flex justify-content-between'>
					{selectedTab?.name !== 'jobs' && (
						<h1 className='fs-sm-16 fs-30 pb-md-0 pb-2 text-gray1 regular'>
							{selectedTab?.name === 'product'
								? t('Products')
								: selectedTab?.name === 'ngo'
								? t("NGO's")
								: selectedTab?.name === 'classified'
								? t('Classifieds')
								: selectedTab?.name === 'service'
								? t('Services')
								: selectedTab?.name === 'travel'
								? t('Travel')
								: selectedTab?.name === 'restaurant'
								? t('Restaurants')
								: selectedTab?.name === 'realestate'
								? t('Real Estate')
								: null}
						</h1>
					)}
					<CategoryLisitngFlterHeader
						// categorySelectionData={categorySelectionData}
						// sortingData={sortingData}
						filters={filters}
						setFilters={setFilters}
						filtersData={filtersData}
						setFiltersData={setFiltersData}
					/>
				</div>
			)}
		</div>
	);
}

export default SubCategoryTabs;

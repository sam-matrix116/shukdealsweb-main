import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import CategoryLisitngFlterHeader from '../CommonCategoryLIstingComponents/CategoryLisitngFlterHeader';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import useSearchContext from '../../context/searchContext';

function SearchFiltersTab({
	setIsLoading,
	setSubSelect,
	subSelect,
	getSubCategoryDataApi,

	// searchFilters
	filtersData,
	setFiltersData,

	// setSortingData,
}) {
    const { t } = useTranslation();

	const { setSearchFilters, searchSelectedTab, searchFilters } =
		useSearchContext();
	const getFiltersData = async (name) => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.masterSearchParams, null, null, {
				param_type: name,
			});
			if (resp) {
				let sortData = resp.params?.filter((item) => item?.param_tag === 'sort');
				let filterData = resp.params?.filter(
					(item) => item?.param_tag === 'filter'
				);
				setFiltersData((values) => ({
					...values,
					sortingData: sortData,
					filteringData: filterData,
				}));
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
		if (subSelect?.id) {
			getSubCategoryDataApi(
				'category',
				Endpoints.getBusinessSubCategoryList,
				subSelect?.id
			);
		}
		if (subSelect?.keyword) {
			getFiltersData(subSelect?.keyword);
		}
	}, [subSelect]);

	useEffect(() => {
		if (searchSelectedTab?.name) getFiltersData(searchSelectedTab?.name);
	}, [searchSelectedTab]);

	return (
		<CategoryLisitngFlterHeader
			filtersData={filtersData}
			setFiltersData={setFiltersData}
			filters={searchFilters}
			setFilters={setSearchFilters}
			subSelect={subSelect}
			setSubSelect={setSubSelect}
		/>
	);
}

export default SearchFiltersTab;

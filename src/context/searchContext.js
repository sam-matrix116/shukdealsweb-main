import React, { createContext, useState, useContext } from 'react';
import { useTranslation } from "react-i18next";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const { t } = useTranslation();
	// Search
	const [searchData, setSearchData] = useState({});
	const [searchText, setSearchText] = useState('');
	const [searchCategory, setSearchCategory] = useState();
	const [isSearchLocation, setIsSearchLocation] = useState(false);
	const [searchFilters, setSearchFilters] = useState();
	const [searchSelectedTab, setSearchSelectedTab] = useState();
	const [searchItemsCount, setSearchItemsCount] = useState(0);

	return (
		<SearchContext.Provider
			value={{
				// search
				searchData,
				setSearchData,
				searchText,
				setSearchText,
				searchCategory,
				setSearchCategory,
				searchSelectedTab,
				setSearchSelectedTab,
				isSearchLocation,
				setIsSearchLocation,
				searchFilters,
				setSearchFilters,
				searchItemsCount, setSearchItemsCount
			}}
		>
			{children}
		</SearchContext.Provider>
	);
}

export default function useSearchContext() {
	return useContext(SearchContext);
}

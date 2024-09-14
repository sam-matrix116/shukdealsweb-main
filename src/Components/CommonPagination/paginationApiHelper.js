import { FetchApi } from '../../API/FetchApi';
import useModalContext from '../../context/modalContext';
import { getChoosenCurrency } from '../../helpers/authUtils';
const user_currency = getChoosenCurrency();
const chosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));

const paginationApiHelper = async (
	url,
	page = true,
	paginationDataState,
	setPaginationDataState,
	setData,
	params,
	activePage,
	dataRetriveValue,
	excludeID
) => {
	if (!url) return;
	try {
		// console.log('pagination api', url)
		let resp = await FetchApi(
			url,
			null,
			null,
			page
				? {
						pagination_on: 1,
						page: activePage || paginationDataState.activePage,
						items_per_page: paginationDataState.paginationCountSize,
						to_currency: user_currency?.iso_code,
						search_lat: chosenLocation?.latitude,
						search_lon: chosenLocation?.longitude,
						...params,
				  }
				: null
		);

		if (dataRetriveValue) {
			resp = resp?.data?.[dataRetriveValue];
		}

		let arr = [];
		for (
			let i = 0;
			i <
			parseInt(Math.round(resp?.count / paginationDataState.paginationCountSize));
			i++
		) {
			arr.push(i + 1);
		}
		setPaginationDataState((prev) => ({
			...prev,
			previousUrl: resp?.previous,
			nextUrl: resp?.next,
			totalCount: resp?.count,
			pageCount: arr,
			activePage,
		}));

		if (resp) {
			if (resp?.results) setData(resp?.results);
			else if (resp?.data) setData(resp?.data);
		}
		if (excludeID) {
			setData((prev) => prev?.filter((item) => item?.id != excludeID));
		}
	} catch (e) {
		console.log('error', e);
	}
};

export { paginationApiHelper };

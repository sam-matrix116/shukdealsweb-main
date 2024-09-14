import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Autocomplete from 'react-google-autocomplete';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import useSearchContext from '../../context/searchContext';
import {
	createSearchParams,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import './style.css';

function SearchTab({
	categoryData,
	user,
	bigScreenTpe,
	locationValues,
	setLocationValues,
	handleLocation,
}) {
	const navigate = useNavigate();
    const { t, i18n } = useTranslation();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const chosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const {
		setSearchData,
		searchText,
		setSearchText,
		searchCategory,
		setSearchCategory,
		isSearchActivated,
		isSearchLocation,
		setIsSearchLocation,
		setSearchSelectedTab,
		setSearchFilters,
	} = useSearchContext();

	const [localSearchText, setLocalSearchText] = useState(params?.q);
	const normalData = {
		ngo: {
			changeData: { name: 'ngo' },
		},
		business: {
			changeData: { name: 'businesses' },
		},
		classified: {
			changeData: { name: 'classified' },
		},
		member: {
			changeData: { name: 'member' },
		},
		product: {
			changeData: { name: 'product', id: '1' },
		},
		service: {
			changeData: { name: 'service', id: '2' },
		},
		restaurant: {
			changeData: { name: 'restaurant', id: '3' },
		},
		travel: {
			changeData: { name: 'travel', id: '4' },
		},
		real_estate: {
			changeData: { name: 'realestate', id: '5' },
		},
		sport: {
			changeData: { name: 'sport', id: '6' },
		},
		// ngo: {
		// 	changeData: { name: 'job' },
		// },
	};
	const handleSubmit = (e) => {
		// setSearchText(localSearchText);
		if (locationValues)
			setSearchFilters((values) => ({
				...values,
				search_lat: locationValues?.latitude,
				search_lon: locationValues?.longitude,
			}));
		setSearchFilters((values) => ({
			...values,
			category: searchCategory,
		}));
		setSearchSelectedTab(normalData[searchCategory]?.changeData);
		navigate({
			pathname: '/search-result',
			search: createSearchParams({
				q: localSearchText,
			}).toString(),
		});

		e.preventDefault();
	};

	const handleCategory = (e) => {
		setSearchCategory(e.target.value);
		e.preventDefault();
	};
	useEffect(() => {
		if (location.pathname !== '/search-result') {
			setLocalSearchText('');
			setSearchText('');
		}
	}, [location.pathname]);
	// console.log({locationValues})
	return (
		<div className='search'>
			<form
				onSubmit={handleSubmit}
				className={`${
					bigScreenTpe && 'head-search'
				} site-form w-100 d-md-flex align-items-center`}
			>
				<div
					className={`d-flex w-100 rounded-10 bg-white  justify-content-between`}
				>
					<input
						value={localSearchText}
						onChange={(e) => {
							// setIsSearchActivated(false);
							setLocalSearchText(e.target.value);
							e.preventDefault();
						}}
						type='text'
						className='border-0 px-md-2 px-1 fs-12 light w-50'
						placeholder={t('Search offers, services & products')}
						autoFocus={window.location.pathname === '/search-result' ? true : false}
					/>

					{/* location selection */}
					{bigScreenTpe && (
						<div className='d-flex align-items-center location  position-relative w-30'>
							<img src='assets/img/icon/location.svg' 
							className={(i18n.language=='he' || i18n.language=='ar')? 'ps-1 pe-1' : 'ps-1' }
							alt='shukDeals' />
							<Autocomplete
								placeholder={t("Enter a location")}
								// style={{
								// 	width: '90px',
								// }}
								// defaultValue={locationValues?.location}
								// placeholder={chosenLocation?.location || locationValues?.location}
								defaultValue={chosenLocation?.location || locationValues?.location}
								className='border-0 px-2 text-truncate text-nowrap'
								apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
								options={{ types: ['(cities)'] }}
								onPlaceSelected={handleLocation}
							/>
						</div>
					)}
					{/* category selection */}
					<div
						className={`d-flex align-items-center location position-relative p-1 ${
							bigScreenTpe ? 'w-25' : 'w-50'
						}`}
					>
						<img
							src='assets/img/icon/category.svg'
							className={(i18n.language=='he' || i18n.language=='ar')? 'ps-1 pe-1' : 'ps-1' }
							alt='shukDeals'
							style={{
								width: '25px',
							}}
						/>
						<select
							style={{
								WebkitAppearance: 'none',
								MozAppearance: 'none',
								appearance: 'none',
							}}
							className='border-0 w-100 px-2 text-truncate text-nowrap without-icon'
							placeholder='Category'
							onChange={handleCategory}
							value={searchCategory}
						>
							<option value=''>{t("Category")}</option>
							<option value='ngo'>{t("NGO")}</option>
							<option value='business'>{t("Business")}</option>
							<option value='classified'>{t('Classified')}</option>
							<option value='member'>{t("Member")}</option>
							{categoryData?.map((item, index) => {
								return (
									<option key={index} value={item?.keyword}>
										{item?.name}
									</option>
								);
							})}
						</select>
					</div>

					<button
						onClick={handleSubmit}
						className={`button rounded-10 search-btn m-1 ms-0'`}
					>
						{/* {isSearchActivated ? (
							<i class='fa fa-times' aria-hidden='true'></i>
						) : (
							)} */}
						<i className='fa-regular fa-magnifying-glass'></i>
					</button>
				</div>
			</form>
		</div>
	);
}

export default SearchTab;

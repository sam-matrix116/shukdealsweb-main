import React, { useEffect, useState } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { getLoggedInUser } from '../../helpers/authUtils';
import Autocomplete from 'react-google-autocomplete';
import Select from 'react-select';
import AuthorizedHeader from './authorizedHeader';

function CustomHeader({ external, removeLogoRedirection }) {
	const [langData, setLangData] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState('');
	const [selectedCurrency, setSelectedCurrency] = useState('');
	const [placeholderText, setPlaceholderText] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [categoryData, setCategoryData] = useState([]);
	const [currencyData, setCurrencyData] = useState([]);
	const [businessCategory, setBusinessCategory] = useState('');
	const { t, i18n } = useTranslation();

	let selectedLangLocal = JSON.parse(localStorage.getItem('selectedLanguage'));

	// console.log('selectedLang__', selectedLangLocal);
	// console.log('selectedLangi18__', i18n.language);
	const selectedLanguage2 = langData.find(language => language.key === i18n.language);

	// console.log('selectedLan2__', selectedLanguage2);


	const params = {
		search_key: searchText,
		lat: latitude,
		long: longitude,
		category: businessCategory,
	};
	const user = getLoggedInUser();
	const getCurrency = async () => {
		try {
			let resp = await FetchApi(Endpoints.getCurrency);
			if (resp && resp.data) {
				setCurrencyData(resp.data);
			}
		} catch (e) {}
	};
	const getCategories = async () => {
		try {
			let resp = await FetchApi(Endpoints.getCategoriesList);
			if (resp && resp.status) {
				setCategoryData(resp.data);
			}
		} catch (e) {}
	};
	const getLanguages = async () => {
		try {
			let resp = await FetchApi(Endpoints.getLanguages);
			if (resp && resp.data) {
				setLangData(resp.data);
				setPlaceholderText(resp.data);
			}
		} catch (e) {}
	};

	// console.log('localselect',localStorage.getItem('selectedLanguage'))

	useEffect(() => {
		getLanguages();

		getCurrency();
		if (
			window.location.pathname != '/signup-choose-ngo' &&
			window.location.pathname != '/login' &&
			window.location.pathname != '/choose-language-currency' &&
			!window.location.pathname.includes('signup') &&
			window.location.pathname != '/verify-email' &&
			window.location.pathname != '/verify-phone' &&
			!window.location.pathname.includes('plan') &&
			!window.location.pathname.includes('payment')
		) {
			getCategories();
		}
	}, []);

	const handleChange = (e) => {
		setSelectedLanguage(e);
		localStorage.setItem('selectedLanguage', JSON.stringify(e))
		i18n.changeLanguage(e?.key);
	};
	return (
		<div>
			{external ? (
				<div className='header2 py-md-4 py-3 position-absolute top-0 start-0 w-100'>
					<div className='container'>
						<div className='row'>
							<div className='col-6'>
								<div className='site-logo'>
									{removeLogoRedirection ? (
										<div>
											<img src='assets/img/site-logo.svg' alt='shukDeals' />
										</div>
									) : (
										<Link to='/landing'>
											<img src='assets/img/site-logo.svg' alt='shukDeals' />
										</Link>
									)}
								</div>
							</div>
							<div
								className='col-6 text-end'
								style={{
									// width:'150px',
									// // alignSelf : 'flex-end',
									display: 'flex',
									alignItems: 'flex-end',
									justifyContent: 'flex-end',
									// backgroundColor :'red',
									// textAlign : 'right'
								}}
							>
								{langData?.length ? (
									<Select
										components={{
											DropdownIndicator: () => null,
											IndicatorSeparator: () => null,
										}}
										// unstyled
										styles={{
											control: (baseStyles, state) => ({
												...baseStyles,
												borderColor: 'transparent',
												width: '110px',
												backgroundColor: 'transparent',
											}),
										}}
										placeholder={
											langData.length ? (
												<div>
													<img src={Endpoints.baseUrl + langData?.[0]?.flag} alt='img' />
													<span style={{ marginLeft: 7, fontSize: '14px' }}>
														{langData[0]?.name}
													</span>
												</div>
											) : (
												''
											)
										}
										// defaultValue={selectedLangLocal}
										value={selectedLangLocal || selectedLanguage2}
										options={langData}
										onChange={handleChange}
										getOptionValue={(option) => option.key}
										getOptionLabel={(e) => (
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={Endpoints.baseUrl + e?.flag}
													alt='img'
													style={{ width: '25px', height: '20px' }}
												/>
												<span style={{ marginLeft: 7, fontSize: '14px' }}>{e?.name}</span>
											</div>
										)}
									/>
								) : null}
							</div>
						</div>
					</div>
				</div>
			) : (
				<AuthorizedHeader
					currencyData={currencyData}
					langData={langData}
					placeholderText={placeholderText}
					setPlaceholderText={setPlaceholderText}
					selectedLanguage={selectedLanguage || selectedLanguage2}
					handleChange={handleChange}
					setSelectedLanguage={setSelectedLanguage}
					searchText={searchText}
					createSearchParams={createSearchParams}
					params={params}
					setSearchText={setSearchText}
					setBusinessCategory={setBusinessCategory}
					categoryData={categoryData}
					selectedCurrency={selectedCurrency}
					setSelectedCurrency={setSelectedCurrency}
				/>
			)}
		</div>
	);
}

export default CustomHeader;

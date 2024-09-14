import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropDownMenu from './dropDownMenu';
import { Link, useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import { Endpoints } from '../../API/Endpoints';
import Select from 'react-select';
import {
	getChoosenCurrency,
	getChoosenLanguage,
	getHeaderPicture,
	getLoggedInUser,
	getUserToken,
	setCookie,
	setSessionStorageFunction,
} from '../../helpers/authUtils';
import SearchTab from './searchTab';
import useSearchContext from '../../context/searchContext';

function AuthorizedHeader({
	currencyData,
	langData,
	placeholderText,
	setPlaceholderText,
	selectedLanguage,
	handleChange,
	categoryData,
	selectedCurrency,
	setSelectedCurrency,
	setSelectedLanguage,
}) {
	const { t, i18n } = useTranslation();
	const user = getLoggedInUser();
	const user_currency = getChoosenCurrency();
	const user_language = getChoosenLanguage();
	const chosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const token = getUserToken();
	const header_dp = getHeaderPicture();
	const { setSearchFilters } = useSearchContext();
	// console.log('selectedLanggg__', selectedLanguage);
	// console.log('selectedLangi1888__', i18n.language);
	// const selectedLanguage2 = langData.find(language => language.key === i18n.language);

	// console.log('selectedLan222__', selectedLanguage2);
	const CurrencyChangeNotAllowedUrls = [
		'/create-listing-realestate',
		'/create-classified',
		'/create-weekly-deal',
		'/update-deal',
		'/create-listing-restaurant',
		'/create-listing-rent',
		'/create-product-deal',
		'/create-travel-deal',
		'/create-sport-deal',
		'/create-service-deal',
		'/create-ngo-deal',
		'/payment-summary',
		'/payment_success',
		'/payment-history',
		'/payment-report',
		'/payment',
	];
	const [locationValues, setLocationValues] = useState({
		location: chosenLocation?.location || user?.location?.location || 'Location',
		latitude: chosenLocation?.latitude || user?.location?.latitude,
		longitude: chosenLocation?.longitude || user?.location?.longitude,
	});
	const handleLocation = (place) => {
		console.log(place);
		let res = {};
		let city_ = place?.address_components?.filter(
			(item) => item.types.filter((it) => it == 'locality').length
		);
		let state_ = place?.address_components?.filter(
			(item) =>
				item.types.filter((it) => it == 'administrative_area_level_1').length
		);
		let country_ = place?.address_components?.filter(
			(item) => item.types.filter((it) => it == 'country').length
		);
		let finalAddress = place?.address_components?.filter(
			(item) =>
				item.types.filter((it) => it == 'administrative_area_level_1').length
		);
		res = {
			...res,
			location: place.formatted_address,
			latitude: parseFloat(place?.geometry?.location?.lat()).toFixed(5),
			longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(5),
		};

		if (state_?.length) {
			res = {
				...res,
				state: state_[0]?.short_name,
			};
		}
		if (city_?.length) {
			res = {
				...res,
				city: city_[0]?.long_name,
			};
		}
		if (country_?.length) {
			res = {
				...res,
				state: state_[0]?.short_name,
			};
		}
		localStorage.setItem('chosenLocation', JSON.stringify(res));
		setSearchFilters((values) => ({
			...values,
			search_lat: res?.latitude,
			search_lon: res?.longitude,
		}));
		setLocationValues(res);
		window.location.reload();
		console.log({ res });
	};

	const capitalizeText = (str) => {
		return str.toUpperCase();
	};

	useEffect(() => {
		setPlaceholderText((prev) => {
			return prev.filter((item) => item.key == user?.language);
		});
	}, []);
	return (
		<>
			{!token ? (
				<div class='header'>
					<div class='container py-lg-0 py-2'>
						<div class='row align-items-center py-3'>
							<div class='col-md-2'>
								<div class='site-logo text-md-start text-center pb-md-0 pb-3'>
									<Link to='/landing'>
										<img src='assets/img/site-logo.svg' alt='' />
									</Link>
								</div>
							</div>
							<div class='col-md-10 d-flex justify-content-md-end justify-content-center align-items-center gap-3'>
								<Link href='#' class='d-flex align-items-center text-gray2 fs-14 ps-3'>
									<img
										src='assets/img/icon/lang.svg'
										width='20'
										height='20'
										class='me-1'
										alt=''
									/>
									Eng
								</Link>
								<Link to='/login' class='button secondary-btn login-btn fs-16'>
									{t('Login')}
								</Link>
								<Link to='/signup-choose-ngo' class='button login-btn fs-16'>
									{t("Register")}
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='header'>
					<div className='container d-lg-block d-none py-lg-0 p-1'>
						<div className='row align-items-center justify-content-center'>
							<div className='col-lg-2'>
								<div className='site-logo'>
									<Link to='/landing'>
										<img src='assets/img/site-logo.svg' alt='' />
									</Link>
								</div>
							</div>
							<div className='col-lg-8 d-flex  justify-content-center gap-3'>
								<div className='d-flex'>
									{currencyData?.length &&
									!CurrencyChangeNotAllowedUrls.includes(window.location.pathname) ? (
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
													width: '80px',
													backgroundColor: 'transparent',
												}),

												menu: (styles) => ({ ...styles, width: '90px' }),
											}}
											className='d-flex align-items-center justify-content-end text-gray2 fs-12 light text-nowrap'
											placeholder={
												currencyData?.length && (
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<img
															src={Endpoints.baseUrl + user_currency?.sign_svg}
															style={{ height: '20px', width: '20px' }}
															alt=''
														></img>
														<span
															className=' text-truncate'
															style={{ marginLeft: 7, fontSize: '13px' }}
														>
															{
																currencyData?.filter(
																	(item) => item.iso_code == user_currency?.iso_code
																)?.[0]?.iso_code
															}
														</span>
													</div>
												)
											}
											value={selectedCurrency}
											options={currencyData}
											onChange={(e) => {
												setSelectedCurrency(e);
												setSessionStorageFunction('user_currency', e);
												window.location.reload();
											}}
											getOptionValue={(option) => option.key}
											getOptionLabel={(e) => (
												<div style={{ display: 'flex', alignItems: 'start', gap: '6px' }}>
													<img
														src={Endpoints.baseUrl + e?.sign_svg}
														style={{ height: '20px', width: '20px' }}
														alt=''
													></img>
													<span
														className=' text-truncate'
														style={{ fontSize: '13px', alignContent: 'start' }}
													>
														{e?.iso_code}
													</span>
												</div>
											)}
										/>
									) : null}
									{langData?.length && placeholderText ? (
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
													width: '70px',
													backgroundColor: 'transparent',
													marginRight: '5px',
												}),
												option: (styles) => ({ ...styles }),
												menu: (styles) => ({ ...styles, width: '100px' }),
											}}
											maxMenuHeight={190}
											className='d-flex align-items-center text-gray2 fs-14 text-nowrap'
											placeholder={
												langData?.length && (
													<div>
														<img
															style={{ width: '20px', height: '20px' }}
															src={Endpoints.baseUrl + user_language?.flag}
															alt=''
														/>
														<span
															className=' text-truncate'
															style={{ marginLeft: 7, fontSize: '14px' }}
														>
															{capitalizeText(user_language?.key)}
														</span>
													</div>
												)
											}
											defaultValue={selectedLanguage}
											options={langData}
											onChange={(e) => {
												setSelectedLanguage(e);
												setSessionStorageFunction('user_language', e);
												i18n.changeLanguage(e?.key);
											}}
											getOptionValue={(option) => option.key}
											getOptionLabel={(e) => (
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<img
														src={Endpoints.baseUrl + e?.flag}
														alt='img'
														style={{ width: '20px', height: '20px' }}
													/>
													<span
														className=' text-truncate'
														style={{ marginLeft: 7, fontSize: '14px' }}
													>
														{capitalizeText(e?.key)}
													</span>
												</div>
											)}
										/>
									) : null}
								</div>
								{/* Search bar */}
								<SearchTab
									categoryData={categoryData}
									user={user}
									bigScreenTpe={true}
									locationValues={locationValues}
									setLocationValues={setLocationValues}
									handleLocation={handleLocation}
								/>
							</div>
							<div className='col-lg-2  text-end'>
								<Link className='d-block' id='head_profile' data-bs-toggle='dropdown'>
									<span
										style={{
											maxWidth: '100px',
										}}
										className='fs-16 medium pe-2 text-gray2 d-none d-xl-inline-block text-nowrap text-truncate'
									>
										{t("HI")} {", "} {user?.firstname || user?.name}
									</span>
									<img
										src={Endpoints.baseUrl + user?.image}
										alt=''
										width='45'
										height='45'
										className='rounded-circle'
									/>
									<svg
										viewBox='0 0 24 24'
										width='18'
										height='18'
										stroke='#878787'
										className='transition'
										strokeWidth='2'
										fill='none'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<polyline points='6 9 12 15 18 9'></polyline>
									</svg>
								</Link>

								<DropDownMenu user={user} />
							</div>
						</div>
					</div>

					{/* Small screen view */}

					<div className='mob-header d-lg-none d-block'>
						<div className='container'>
							<div className=' top-header d-flex flex-column flex-md-row justify-content-md-between gap-2'>
								<div className='col-md-4 '>
									<div className='d-flex  gap-2 w-100'>
										<Link to={'/'} id='toggle_profile' data-bs-toggle='dropdown'>
											<img
												src='assets/img/icon/toggle.svg'
												alt=''
												// style={{ height: '30px', width: '30px' }}
											/>
										</Link>
										<DropDownMenu user={user} />
										<div className='site-logo w-100 d-flex justify-content-center justify-content-md-start'>
											<Link to='/landing'>
												<img
													src='assets/img/site-logo.svg'
													alt=''
													// className='h-100 w-100'
												/>
											</Link>
										</div>
									</div>
								</div>
								<div className='d-flex justify-content-between justify-content-md-center gap-1'>
									<div className='d-flex align-items-center location position-relative  '>
										<img
											src='assets/img/icon/location.svg'
											className='ps-2'
											alt='shukDeals'
										/>
										<Autocomplete
											placeholder={t("Enter a location")}
											style={{
												width: '150px',
												backgroundColor: '#f4f4f4',
											}}
											// placeholder={locationValues?.location}
											defaultValue={locationValues?.location}
											className='border-0 px-2 text-truncate text-nowrap'
											apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
											options={{ types: [] }}
											onPlaceSelected={handleLocation}
										/>
									</div>
									{currencyData?.length && (
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
													width: '80px',
													backgroundColor: 'transparent',
												}),
											}}
											className='d-flex align-items-center justify-content-end text-gray2 fs-12 light text-nowrap'
											placeholder={
												currencyData?.length && (
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<img
															src={Endpoints.baseUrl + user_currency?.sign_svg}
															style={{ height: '20px', width: '20px' }}
															alt=''
														></img>
														<span
															className=' text-truncate'
															style={{ marginLeft: 7, fontSize: '13px' }}
														>
															{
																currencyData?.filter(
																	(item) => item.iso_code == user_currency?.iso_code
																)?.[0]?.iso_code
															}
														</span>
													</div>
												)
											}
											value={selectedCurrency}
											options={currencyData}
											onChange={(e) => {
												setSelectedCurrency(e);
												setSessionStorageFunction('user_currency', e);
												window.location.reload();
											}}
											getOptionValue={(option) => option.key}
											getOptionLabel={(e) => (
												<div style={{ display: 'flex', alignItems: 'start', gap: '6px' }}>
													<img
														src={Endpoints.baseUrl + e?.sign_svg}
														style={{ height: '20px', width: '20px' }}
														alt=''
													></img>
													<span
														className=' text-truncate'
														style={{ fontSize: '13px', alignContent: 'start' }}
													>
														{e?.iso_code}
													</span>
												</div>
											)}
										/>
									)}

									{langData.length && (
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
													width: '80px',
													// height: '5px',
													backgroundColor: 'transparent',
													// marginLeft : '5px'
													// padding : '0px'
												}),
											}}
											className='d-flex align-items-center justify-content-end text-gray2 fs-12 light'
											placeholder={
												langData.length && (
													<div>
														<img
															style={{ height: '20px', width: '20px' }}
															src={Endpoints.baseUrl + placeholderText[0]?.flag}
															alt=''
														/>
														<span style={{ marginLeft: 7, fontSize: '13px' }}>
															{capitalizeText(placeholderText[0]?.key)}
														</span>
													</div>
												)
											}
											value={selectedLanguage}
											options={langData}
											onChange={handleChange}
											getOptionValue={(option) => option.key}
											getOptionLabel={(e) => (
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<img
														src={Endpoints.baseUrl + e?.flag}
														alt='img'
														style={{ width: '20px', height: '20px' }}
													/>

													<span style={{ marginLeft: 7, fontSize: '13px' }}>
														{capitalizeText(e?.key)}
													</span>
												</div>
											)}
										/>
									)}
								</div>
							</div>
						</div>
						{/* Search bar */}
						<SearchTab
							categoryData={categoryData}
							user={user}
							bigScreenTpe={false}
							handleLocation={handleLocation}
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default AuthorizedHeader;

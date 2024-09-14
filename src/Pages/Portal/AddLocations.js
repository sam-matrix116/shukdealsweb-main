import React from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import {
	getLocationData,
	getLoggedInUser,
	getUserToken,
} from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import Autocomplete from 'react-google-autocomplete';
import ToastMessage from '../../Utils/ToastMessage';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
// import startsWith from 'lodash.startswith';

function AddLocations() {
	const [otherLocations, setOtherLocations] = useState([]);
	const [user, setUser] = useState({});
	const [values, setValues] = useState({});
	const { t, i18n } = useTranslation();
	const token = getUserToken();
	const location = getLocationData();

	// console.log('loccheck__', JSON.stringify(location,null,4))

	const navigate = useNavigate();

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setUser(resp.data);
			}
		} catch (e) {}
	};
	let other_location_obj = {
		// location2 : '',
		location: '',
		latitude: 0,
		longitude: 0,
		city: '',
		state: '',
		country: '',
		zipcode: '',
		store_manager_email: '',
		store_manager_phone: ''
	};

	const handle_ = (event, data, index) => {
		let obj = {
			// key: typeof data !== 'undefined'? event: event.target?.name,
			// value: typeof data !== 'undefined'? data: event.target?.value,
			// index: index!=='undefined'? index : event.target?.id,
			key: event.target?.name || event,
			value: event.target?.value || data,
			index: event.target?.id || index,
		};
		let data_ = otherLocations.slice();
		data_[obj.index] = {
			...data_[obj.index],
			[obj.key]: obj.value,
		};
		setOtherLocations(data_);
	};

	useEffect(() => {
		if (window.location.pathname.includes('update')) {
			setValues({
				location: location?.location,
				store_manager_email: location?.store_manager_email,
				store_manager_phone: location?.store_manager_phone,
				latitude: location?.latitude,
				longitude: location?.longitude,
				// address: location?.address,
				city: location?.city,
				state: location?.state,
				country: location?.country,
				zipcode: location?.zipcode,
			});
		}
	}, []);

	const handleChange = (event, data) => {
		// if (event.persist) event.persist();
		// setValues((values) => ({
		// 	...values,
		// 	[event?.target?.name]: event?.target?.value,
		// }));
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setValues((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	// console.log('val__chec__', JSON.stringify(values,null,4))
	// console.log('val__chec_33_', values)

	const maxLocationAllowed = useMemo(() => {
		return user?.extra_location || 0;
	}, [user]);

	const allowedAddressCount = useMemo(() => {
		if (!maxLocationAllowed || maxLocationAllowed - otherLocations.length == 0) {
			return 0;
		}
		return maxLocationAllowed - otherLocations.length;
	}, [maxLocationAllowed, otherLocations]);

	const updateLocation = async () => {
		let ValidationArr = [
			[values.location, ValidationTypes.Empty, t('Please Enter Location')],
			// [values.store_manager_email, ValidationTypes.Empty, t('Please Enter Email')],
			// [values.store_manager_phone, ValidationTypes.Empty, t('Please enter phone')],
			[values.city, ValidationTypes.Empty, t('Please Enter City')],
			[values.state, ValidationTypes.Empty, t('Please Enter State')],
			[values.country, ValidationTypes.Empty, t('Please enter country')],
			[values.zipcode, ValidationTypes.Empty, t('Please Enter Zip Code')],
		];

		let validate_ = await ValidateList(ValidationArr);
		if (!validate_) {
			return;
		}
		try {
			let resp = await FetchApi(Endpoints.updateLocation + location?.id, values);
			if (resp && resp.status) {
				ToastMessage.Success(t('Location updated successfully'));
				navigate(-1);
			}
		} catch (e) {}
	};

	const addLocation = async () => {
		if (otherLocations.filter((item) => item.location == '').length) {
			ToastMessage.Error(t('Please Enter Location'));
			return;
		}
		if (otherLocations.filter((item) => item.store_manager_email == '').length) {
			ToastMessage.Error(t('Please Enter Email'));
			return;
		}
		if (otherLocations.filter((item) => item.store_manager_phone == '').length) {
			ToastMessage.Error(t('Please enter phone'));
			return;
		}
		if (otherLocations.filter((item) => item.state == '').length) {
			ToastMessage.Error(t('Please Enter State'));
			return;
		}
		if (otherLocations.filter((item) => item.country == '').length) {
			ToastMessage.Error(t('Please enter country'));
			return;
		}
		if (otherLocations.filter((item) => item.zipcode == '').length) {
			ToastMessage.Error(t('Please Enter Zip Code'));
			return;
		}

		let obj = {
			locations: otherLocations,
		};
		try {
			let resp = await FetchApi(Endpoints.addLocation, obj);
			if (resp && resp.status) {
				ToastMessage.Success('Locations added successfully');
				navigate('/location-listing');
			}
			if (resp && !resp.status) {
				ToastMessage.Error(resp?.message);
			}
		} catch (e) {
			console.log('err_', e.response.data)
			if(e && e.response && e.response.data && e.response.data.message){
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {}, [otherLocations]);

	useEffect(() => {
		if (token) getProfileDetails();
		setOtherLocations((v) => [...v, other_location_obj]);
	}, []);
	return (
		<div className='main'>
			<CustomHeader />
			<CommonProfile />
			<div className='container border-top py-4'>
				<div className='row justify-content-center pb-md-4'>
					<div className='col-lg-6 col-md-8'>
						{window.location.pathname.includes('update') && (
							<div className='site-form py-md-2 profile-setup-form'>
								<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>{t("Update Location")}</h2>

								<div className='add-location rounded-10 mb-3'>
									<div className='form-field mb-3'>
										<label for='' className='pb-2'>{t("Location")}
										</label>
										<Autocomplete
											style={{ backgroundColor: 'white' }}
											placeholder={t("Enter a location")}
											className='location'
											defaultValue={values.location}
											apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
											options={{ types: [] }}
											onPlaceSelected={(place) => {
												setValues((prev) => ({
													...prev,
													location: place?.formatted_address,
												}));
												setValues((prev) => ({
													...prev,
													latitude: parseFloat(place?.geometry?.location?.lat()).toFixed(5),
												}));
												setValues((prev) => ({
													...prev,
													longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(5),
												}));

												let city_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'locality').length
												);
												let state_ = place?.address_components.filter(
													(item) =>
														item.types.filter((it) => it == 'administrative_area_level_1')
															.length
												);
												let country_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'country').length
												);
												let zipcode_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'postal_code').length
												);

												if (state_.length) {
													setValues((prev) => ({
														...prev,
														state: state_[0]?.long_name,
													}));
												}
												if (city_.length) {
													setValues((prev) => ({
														...prev,
														city: city_[0]?.long_name,
													}));
												}
												if (country_.length) {
													setValues((prev) => ({
														...prev,
														country: country_[0]?.long_name,
													}));
												}
												if (zipcode_.length) {
													setValues((prev) => ({
														...prev,
														zipcode: zipcode_[0].long_name,
													}));
												}
											}}
										/>
									</div>

									{!location?.is_primary && 
									<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Store Manager Email")}
									</label>
									<input
										name='store_manager_email'
										value={values?.store_manager_email}
										onChange={handleChange}
										type='text'
										placeholder={t('Enter Email Address')}
									/>
									</div>}

									{!location?.is_primary && 
									<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("Store Manager Phone Number")}
									</label>
									<PhoneInput
										// autoFormat={true}
										// isValid={(inputNumber, country, countries) => {
										// 	return countries.some((country) => {
										// 		return (
										// 			startsWith(inputNumber, country.dialCode) ||
										// 			startsWith(country.dialCode, inputNumber)
										// 		);
										// 	});
										// }}
										defaultCountry='il'
										style={{
											width: '100%'
										}}
										inputStyle={{
											// backgroundColor : 'white',
											// height: '44px',
											border: '0.5px  gray',
											borderTopRightRadius: 10,
											borderBottomRightRadius: 10,
											// paddingTop: '10px',
											// borderRadius: 10,
											marginInlineStart: (i18n.language=='he' || i18n.language=='ar')?'25px':'0px'
										}}
										placeholder='Enter phone number'
										value={values?.store_manager_phone}
										onChange={(value) => {
											handleChange('store_manager_phone', value);
										}}
										// onChange={handle_}
									/>
									</div>}

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>{t("Apartment/Street Address")} {t("(Optional)")}
										</label>
										<input
											value={values.address}
											onChange={handleChange}
											name='address'
											type='text'
											placeholder={t('Enter Apartment/Street Address')}
										/>
									</div>

									<div className='row'>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("City")}
												</label>
												<input
													value={values.city}
													onChange={handleChange}
													name='city'
													type='text'
													placeholder={t('Enter City')}
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("State")}
												</label>

												<input
													value={values.state}
													onChange={handleChange}
													name='state'
													type='text'
													placeholder={t('Enter State')}
												/>
											</div>
										</div>
									</div>

									<div className='row'>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("Country")}
												</label>

												<input
													value={values.country}
													onChange={handleChange}
													name='country'
													type='text'
													placeholder={t('Enter Country')}
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("Zip Code")}
												</label>
												<input
													value={values.zipcode}
													onChange={handleChange}
													name='zipcode'
													type='text'
													placeholder={t('Enter zip code')}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{!window.location.pathname.includes('update') &&
							otherLocations.map((item, index) => {
								return (
									<div
										key={index}
										className='site-form py-md-2 profile-setup-form'
										// id='collapseExample'
									>
										<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>{t("Other Business Location")}
										</h2>
										<p>{t("Use different phone number / email address for new location")}</p>
										<div className='add-location rounded-10 mb-3'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("Location")}
												</label>
												<Autocomplete
													aria-required={true}
													id={index}
													style={{ backgroundColor: 'white' }}
													placeholder={t("Enter a location")}
													className='location'
													defaultValue={otherLocations[index]?.location}
													apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
													options={{ types: [] }}
													onPlaceSelected={(place) => {
														let city_ = place?.address_components.filter(
															(item) => item.types.filter((it) => it == 'locality').length
														);
														let state_ = place?.address_components.filter(
															(item) =>
																item.types.filter((it) => it == 'administrative_area_level_1')
																	.length
														);
														let country_ = place?.address_components.filter(
															(item) => item.types.filter((it) => it == 'country').length
														);
														let zipcode_ = place?.address_components.filter(
															(item) => item.types.filter((it) => it == 'postal_code').length
														);

														let locations = otherLocations.slice();
														locations[index] = {
															...locations[index],
															location: place.formatted_address,
															latitude: parseFloat(place?.geometry?.location?.lat()).toFixed(
																5
															),
															longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(
																5
															),
															city: city_.length ? city_[0]?.long_name : '',
															state: state_.length ? state_[0]?.long_name : '',
															country: country_.length ? country_[0]?.long_name : '',
															zipcode: zipcode_.length ? zipcode_[0].long_name : '',
														};
														setOtherLocations(locations);
													}}
												/>
											</div>

											<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Store Manager Email")}
											</label>
											<input
												id={index}
												name='store_manager_email'
												value={otherLocations[index]?.store_manager_email}
												onChange={handle_}
												type='text'
												placeholder={t('Enter Email Address')}
											/>
											</div>

											<div class='form-field mb-3'>
											<label for='' class='pb-2'>{t("Store Manager Phone Number")}
											</label>
											<PhoneInput
												// autoFormat={true}
												// isValid={(inputNumber, country, countries) => {
												// 	return countries.some((country) => {
												// 		return (
												// 			startsWith(inputNumber, country.dialCode) ||
												// 			startsWith(country.dialCode, inputNumber)
												// 		);
												// 	});
												// }}
												defaultCountry={'il'}
												inputStyle={{
													// backgroundColor : 'white',
													// height: '44px',
													border: '0.5px initial gray',
													borderTopRightRadius: 10,
													borderBottomRightRadius: 10,
													// paddingTop: '10px',
													// borderRadius: 10,
												}}
												placeholder='Enter phone number'
												value={otherLocations[index]?.store_manager_phone}
												onChange={(value) => {
													handle_('store_manager_phone', value, index);
												}}
												// onChange={handle_}
											/>
											</div>

											<div className='form-field mb-3'>
												<label for='' className='pb-2'>{t("Apartment/Street Address")} {t("(Optional)")}
												</label>
												<input
													id={index}
													name='address'
													// value={values2.address2}
													onChange={handle_}
													type='text'
													placeholder={t('Enter Apartment/Street Address')}
												/>
											</div>
											<div className='row'>
												<div className='col-md-6'>
													<div className='form-field mb-3'>
														<label for='' className='pb-2'>{t("City")}
														</label>
														<input
															id={index}
															name='city'
															value={otherLocations[index]?.city}
															onChange={handle_}
															type='text'
															placeholder={t('Enter City')}
														/>
													</div>
												</div>
												<div className='col-md-6'>
													<div className='form-field mb-3'>
														<label for='' className='pb-2'>{t("State")}
														</label>
														<input
															id={index}
															name='state'
															value={otherLocations[index]?.state}
															onChange={handle_}
															type='text'
															placeholder={t('Enter State')}
														/>
													</div>
												</div>
											</div>

											<div className='row'>
												<div className='col-md-6'>
													<div className='form-field mb-3'>
														<label for='' className='pb-2'>{t("Country")}
														</label>
														<input
															id={index}
															name='country'
															value={otherLocations[index].country}
															// value={values2.country}
															onChange={handle_}
															type='text'
															placeholder={t('Enter Country')}
														/>
													</div>
												</div>
												<div className='col-md-6'>
													<div className='form-field mb-3'>
														<label for='' className='pb-2'>{t("Zip Code")}
														</label>
														<input
															id={index}
															name='zipcode'
															value={otherLocations[index]?.zipcode}
															onChange={handle_}
															type='text'
															placeholder={t('Enter zip code')}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}

						{!window.location.pathname.includes('update') && allowedAddressCount ? (
							<div
								onClick={() => {
									setOtherLocations((v) => [...v, other_location_obj]);
									// setIsAnotherLocation(!isAnotherLocation);
								}}
								className='d-flex align-items-center gap-2 pb-2'
							>
								<img
									src='assets/img/icon/addcircle.svg'
									width='25'
									height='25'
									alt=''
								/>
								<div>
									<a
										className='text-blue fs-16 d-inline-block'
										data-bs-toggle='collapse'
										href='#collapseExample'
										role='button'
										aria-expanded='true'
										aria-controls='collapseExample'
									>
										{' '}
										{t("Add Another Location")}{' '}
									</a>
									<span className='d-block fs-14 text-gray2'>
										{allowedAddressCount} {t("Location Remaining")}
									</span>
								</div>
							</div>
						) : null}

						<button
							onClick={(e) => {
								if (window.location.pathname.includes('update')) {
									updateLocation();
								} else {
									addLocation();
								}
								e.preventDefault();
							}}
							className='button w-100 rounded-10'
						>
							{t("Save")}
						</button>
					</div>
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default AddLocations;

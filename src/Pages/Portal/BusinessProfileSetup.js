/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import {
	getLoggedInUser,
	getUserToken,
	setCookie,
} from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import i18next from 'i18next';
import ToastMessage from '../../Utils/ToastMessage';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import { imageCompressor } from '../../helpers/imageHelper';
import LoadingSpinner from '../../Components/Loader';
import { BlobToFileConverter } from '../../helpers/fileHelper';
import {
	UrlArrayChecker,
	UrlHttpsChecker,
	removeHttpAndHttps,
} from '../../helpers';
import ChangeCredentialScreen from '../../Components/ChangeCredentialScreen';
import MultipleSelectDropdown from '../../Components/CommonUiComponents/MultipleSelectDropdown';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
// import startsWith from 'lodash.startswith';
const $ = window.jQuery;

function BusinessProfileSetup() {
	const user = getLoggedInUser();
	const defined_currency = {
		sign: user?.currency_sign,
		iso_code: user?.currency_iso,
	};
	const [isLoading, setIsLoading] = useState(false);
	const [changeType, setChangeType] = useState('');
	const [profileData, setProfileData] = useState();
	const [menuFile, setMenuFile] = useState();
	const [contact, setContact] = useState('');
	const [email, setEmail] = useState('');
	const [categoriesData, setCategoryData] = useState([]);
	const [deliveryPartner, setDeliveryPartner] = useState();
	const [deliveryPartnerData, setDeliverPartnerData] = useState([]);
	const [ischangeCredVisible, setIschangeCredVisible] = useState(false);
	const [values, setValues] = useState({});
	const [imgPreview, setImgPreview] = useState({});
	const token = getUserToken();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [otherLocations, setOtherLocations] = useState(
		JSON.parse(localStorage.getItem('locationData')) || []
	);
	const [storeDetail, setStoreDetail] = useState([]);
	const [isOrderSummaryVisible, setIsOrderSUmmaryVisible] = useState(false);
	const [locationCount, setLocationCount] = useState(1);
	const [unitCostData, setUnitCostData] = useState({});

	localStorage.clear();
	const getSavedLocations = JSON.parse(localStorage.getItem('locationData'));
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
		console.log('dt_out', data)
		console.log('event__', event?.target?.name);
		console.log('eventval__', event.target?.value);
		console.log('eventindex__', index);
		console.log('eventonly__', event);
		// if (typeof data !== 'undefined') {
		// 	console.log('dt_', data)
		// 	// setValues((values) => ({
		// 	// 	...values,
		// 	// 	[event]: data,
		// 	// }));
		// }
		// if(typeof data !== 'undefined'){
		// 	let obj = {

		// 	}
		// }
		let obj = {
			// key: typeof data !== 'undefined'? event: event.target?.name,
			// value: typeof data !== 'undefined'? data: event.target?.value,
			// index: index!=='undefined'? index : event.target?.id,
			key: event.target?.name || event,
			value: event.target?.value || data,
			index: event.target?.id || index,
		};

		console.log('obj__', obj)
		let data_ = otherLocations.slice();
		data_[obj.index] = {
			...data_[obj.index],
			[obj.key]: obj.value,
		};
		setOtherLocations(data_);
		setStoreDetail(data_);
	};

	// console.log('otherLo__', otherLocations)

	// console.log('checkvalues2__', JSON.stringify(values2,null,4))

	const maxLocationAllowed = useMemo(() => {
		return profileData?.extra_location || 0;
	}, [user]);

	const allowedAddressCount = useMemo(() => {
		if (!maxLocationAllowed || maxLocationAllowed - otherLocations.length == 0) {
			return 0;
		}
		return maxLocationAllowed - otherLocations.length;
	}, [maxLocationAllowed, otherLocations]);

	const getUnitCost = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUnitCost);
			if (resp && resp.status) {
				setUnitCostData(resp);
			}
		} catch (e) {}
	};

	const addLocationPayment = async () => {
		if (!locationCount) {
			ToastMessage.Error('Please Enter Location count');
			return;
		}
		let obj = {
			locations_count: locationCount,
		};
		try {
			let resp = await FetchApi(Endpoints.addLocationPayment, obj);
			if (resp && resp.status) {
				localStorage.setItem('paytype', 'location2');
				setCookie('payment_detail', resp?.payment_detail);
				localStorage.setItem(
					'businessLocationData',
					JSON.stringify(otherLocations)
				);
				navigate('/payment');
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		if (
			window.location.pathname == '/business-profile-setup' &&
			isOrderSummaryVisible
		) {
			$('#add').modal('show');
		}
	}, [isOrderSummaryVisible]);

	useEffect(() => {
		if (token) getProfileDetails();
		getCategories();
		getDeliveryPartners();
		getUnitCost();
	}, []);

	useEffect(() => {
		setValues({
			name: profileData?.name,
			about: profileData?.about ?? '',
			website_url: profileData?.website_url ?? '',
			facebook_url: profileData?.facebook_url ?? '',
			twitter_url: profileData?.twitter_url ?? '',
			instagram_url: profileData?.instagram_url ?? '',
			youtube_url: profileData?.youtube_url ?? '',
			location: profileData?.location?.location,
			latitude: profileData?.location?.latitude,
			longitude: profileData?.location?.longitude,
			address: profileData?.location?.address!="undefined"? profileData?.location?.address:'',
			city: profileData?.location?.city,
			state: profileData?.location?.state,
			country: profileData?.location?.country,
			zipcode: profileData?.location?.zipcode,
			business_category: profileData?.business_category,
			service_provider_type: profileData?.service_provider_type ?? '',
			reservation_walkin: profileData?.reservation_walkin ?? '',
		});
		setMenuFile(profileData?.menu?.menu ?? '');
		setDeliveryPartner(profileData?.delivery_partner ?? '');
		setImgPreview({
			image: Endpoints.baseUrl + profileData?.image,
			cover_pic: Endpoints.baseUrl + profileData?.cover_pic,
		});
	}, [profileData]);
	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
				setContact(resp.data?.phone);
				setEmail(resp.data?.email);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const updateProfile = async () => {
		let ValidationArr = [
			[values.about, ValidationTypes.Empty, t('Please enter about yourself')],
			[
				values.business_category,
				ValidationTypes.Empty,
				t('Please select your business category'),
			],
			[values.location, ValidationTypes.Empty, t('Please Enter Location')],
			[values.city, ValidationTypes.Empty, t('Please Enter City')],
			[values.state, ValidationTypes.Empty, t('Please Enter State')],
			[values.country, ValidationTypes.Empty, t('Please enter country')],
			[values.zipcode, ValidationTypes.Empty, t('Please Enter Zip Code')],
			[
				values.website_url,
				ValidationTypes.Url,
				t('Please enter valid website url'),
			],
		];
		let ValidationUrlArr = [
			{ url: values?.website_url, name: 'website_url' },
			{ url: values?.facebook_url, name: 'facebook_url' },
			{ url: values?.twitter_url, name: 'twitter_url' },
			{ url: values?.instagram_url, name: 'instagram_url' },
			{ url: values?.youtube_url, name: 'youtube_url' },
		];

		let validate_ = await ValidateList(ValidationArr);

		if (!validate_) {
			return;
		}

		if (otherLocations.filter((item) => item.store_manager_email == '').length) {
			ToastMessage.Error(t('Please enter store manager email'));
			return;
		}
		if (otherLocations.filter((item) => item.store_manager_phone == '').length) {
			ToastMessage.Error(t('Please enter store manager phone'));
			return;
		}
		if (otherLocations.filter((item) => item.location == '').length) {
			ToastMessage.Error(t('Please Enter Location'));
			return;
		}
		if (otherLocations.filter((item) => item.city == '').length) {
			ToastMessage.Error(t('Please Enter City'));
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

		const urlArr = UrlArrayChecker(ValidationUrlArr);
		const copyValues = { ...values };
		Object.keys(copyValues).forEach((item) => {
			urlArr.forEach((val) => {
				if (val.name === item) {
					copyValues[item] = val.url;
				}
			});
		});

		let obj = new FormData();
		for (let key in copyValues) {
			obj.append(key, copyValues[key]);
		}
		if (deliveryPartner?.length) {
			deliveryPartner.map((item) => {
				obj.append('delivery_partner', item.id);
			});
		}
		if(!profileData?.menu?.menu){
			obj.append('menu', menuFile);
		}

		try {
			let resp = await FetchApi(Endpoints.updateProfile, obj);
			if (resp && resp.status) {
				if (otherLocations.length) {
					addLocation();
				}
				else{
					ToastMessage.Success(t('Profile Added Successfully.')); //resp.message);
					setCookie('p_setup', resp.data);
					if (window.location.pathname.includes('business-profile')) {
						navigate('/business-profile-business-view', { replace: true });
					}
				}
				// ToastMessage.Success(t('Profile added successfully.')); //resp.message);
				// setCookie('p_setup', resp.data);
				// if (window.location.pathname.includes('business-profile')) {
				// 	navigate('/business-profile-business-view', { replace: true });
				// }
			} else {
				ToastMessage.Error(resp.message);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const getCategories = async () => {
		try {
			let resp = await FetchApi(Endpoints.getCategoriesList);
			if (resp && resp.status) {
				setCategoryData(resp.data);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const getDeliveryPartners = async () => {
		try {
			let resp = await FetchApi(Endpoints.getDeliveryPartners);
			if (resp && resp.status) {
				setDeliverPartnerData(resp.data);
			}
		} catch (e) {}
	};

	const addLocation = async () => {
		let obj = {
			locations: otherLocations,
		};
		try {
			let resp = await FetchApi(Endpoints.addLocation, obj);
			if(resp && resp.status){
				ToastMessage.Success(t('Profile Added Successfully.')); //resp.message);
				setCookie('p_setup', resp.data);
				if (window.location.pathname.includes('business-profile')) {
					navigate('/business-profile-business-view', { replace: true });
				}
			}
			if(resp && !resp.status){
				ToastMessage.Error(resp?.message)
			}
		} catch (e) {
			if(e && e.response && e.response?.data){
				ToastMessage.Error(e.response.data.message)
			}
		}
	};

	const handleChange3 = (e) => {
		if (e.target.files) {
			setMenuFile(e?.target?.files?.[0]);
		}
	};
	const handleChange = (event, data) => {
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setValues((values) => ({
				...values,
				[event?.target?.name || event?.name]:
					event?.target?.value || event?.value || '',
			}));
		}
	};

	const handleImage = async (e) => {
		if (e.target.files.length) {
			if (e?.target?.name === 'image') {
				setValues({
					...values,
					[e?.target?.name]: null,
				});
			}
			const image = URL?.createObjectURL(e?.target?.files?.[0]);
			setImgPreview({
				...imgPreview,
				[e?.target?.name]: image,
			});

			setIsLoading(true);
			const compressedImage = await imageCompressor(e?.target?.files?.[0]);
			let file = BlobToFileConverter(compressedImage);
			setIsLoading(false);

			setValues({
				...values,
				[e?.target?.name]: file,
			});
			if (e?.target?.name === 'image') {
				setCookie('header_dp', {
					fileUrl: URL?.createObjectURL(compressedImage),
				});
			}
		}
	};
	// console.log({ values });

	return (
		<>
			<div className='wrapper'>
				<CustomHeader />
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<div className='main'>
						<div className='cover-picture'>
							<input
								onChange={handleImage}
								name='cover_pic'
								type='file'
								className='d-none'
								id='file'
								accept='image/*'
							/>
							<label
								for='file'
								className={
									'upload-file edit-banner position-relative fs-22 fs-sm-14 text-white regular medium'
								}
							>
								<img
									src={imgPreview?.cover_pic || 'assets/img/icon/cover-picture.svg'}
									className={'object-cover banner-img'}
									alt=''
								/>
								<span class='position-absolute '>
									<img src='assets/img/icon/cover-picture.svg' class='me-2' alt='' />
									{imgPreview?.cover_pic
										? t('Replace Cover Picture')
										: t('Upload Cover Picture')}
								</span>
							</label>
						</div>

						<div className='profile-top-content pb-lg-4'>
							<div className='container'>
								<div className='row align-items-start'>
									<div className='col-lg-2 col-md-3 col-4'>
										<div className='position-relative profile-thumb overflow-hidden rounded-circle'>
											<input
												accept='image/*'
												onChange={handleImage}
												name='image'
												type='file'
												id='profile-field'
											/>
											<img
												src={imgPreview?.image || 'assets/img/edit-profile.png'}
												className='profile-pic rounded-circle'
											/>
											<label
												for='profile-field'
												className='profile-upload d-flex align-items-center justify-content-center start-0 bottom-0 position-absolute'
											>
												<img src='assets/img/icon/cover-picture.svg' alt='' />
											</label>
										</div>
									</div>
									<div className='col-lg-7 col-md-5 col-8 pt-md-4 pt-2'>
										<div className=''>
											<div className='d-md-flex align-items-start w-100'>
												<div className='d-lg-flex gap-2'>
													<h3 className='fs-26 medium text-blue pb-lg-0 pb-2 fs-sm-18'>
														{user?.fullname ||
															user?.name ||
															user?.firstname + ' ' + user?.lastname}
													</h3>
													{(user?.plan?.name === 'Basic' ||
													user?.plan?.name === 'Free') && !user?.is_store && (
														<Link
															to={
																user?.user_type && user?.user_type === 'Business'
																	? '/business-plan'
																	: user?.user_type === 'Member'
																	? '/user-plan'
																	: ''
															}
															className='button'
														>
															{t("Switch to paid account")}
														</Link>
													)}
												</div>
											</div>
										</div>
									</div>
									<div className='col-lg-3 col-md-4 col-12'>
										<div className='pt-md-4 pt-2 profile-ngo-box'>
											<div className='shadow px-2 py-2 d-flex align-items-center gap-2 rounded-15 pe-lg-5'>
												{profileData?.associated_ngo?.image ? (
													<img
														src={Endpoints.baseUrl + profileData?.associated_ngo?.image}
														alt=''
														className='ms-xl-1'
													/>
												) : (
													<img src='assets/img/icon' alt='' className='ms-xl-1' />
												)}
												<h5 className='fs-16 bold pe-xl-1 fs-sm-9'>
													{profileData?.associated_ngo?.name}
												</h5>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='container border-top py-4'>
							<div className='row justify-content-center'>
								<div className='col-lg-6 col-md-8'>
									<h1 className='fs-30 text-gray1 pb-2 fs-sm-24'>{t("Basic Information")}</h1>
									<form
										onSubmit={(e) => {
											updateProfile();
											e.preventDefault();
										}}
										action=''
										className='site-form profile-setup-form'
									>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Business Name")}
											</label>
											<input
												value={values?.name}
												onChange={handleChange}
												name='name'
												type='text'
												placeholder='name'
											/>
										</div>
										<div className='form-field mb-3 position-relative'>
											<label for='' className='pb-2'>{t("About")}
											</label>
											<div id='about-profile-'>
												<textarea
													style={{
														border: 'none',
													}}
													value={values?.about}
													onChange={handleChange}
													name='about'
													cols='10'
													rows='4'
													id='the-textarea-'
													maxLength='300'
													placeholder={t('Enter About Your Business')}
													autoFocus
												></textarea>
												<div
													style={{ textAlign: 'right', textAlign: 'right' }}
													// id='the-count'
													className='fs-14 text-gray2 light'
												>
													<span id='current'>{values.about?.length}</span>
													<span id='maximum'>/ 300</span>
												</div>
											</div>
										</div>

										{!profileData?.business_category ? (
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{t("Business Category")}
												</label>
												<select
													value={values?.business_category}
													onChange={handleChange}
													name='business_category'
												>
													<option value=''>{t("Select")}</option>
													{categoriesData?.map((item, index) => {
														return (
															<option key={index} value={item?.id}>
																{item?.name}
															</option>
														);
													})}
												</select>
											</div>
										) : null}
										{values?.business_category == 2 ? (
											<div className='mb-3'>
												<label for='' className='pb-2'>
													{t("Service Provider Type")}
												</label>
												<select
													value={values?.service_provider_type}
													onChange={handleChange}
													name='service_provider_type'
													id=''
													className=' w-100 ps-md-3 ps-1'
												>
													<option value=''>{t("Select")}</option>
													<option value='independent'>{t("Independent Contractor")}</option>
													<option value='company'>{t("Company")}</option>
												</select>
											</div>
										) : null}

										{values?.business_category == 3 ? (
											<div className='mb-3'>
												<label for='' className='pb-2'>
													{t("Reservation Type")}
												</label>
												<select
													value={values?.reservation_walkin}
													onChange={handleChange}
													name='reservation_walkin'
													id=''
													className=' w-100 ps-md-3 ps-1'
												>
													<option value=''>{t("Select")}</option>
													<option value='reservation'>{t("Need Reservation")}</option>
													<option value='walkin'>{t("Walk In Allowed")}</option>
												</select>
											</div>
										) : null}

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Business Contact Number")}
											</label>
											<input
												value={contact}
												type='tel'
												className='bg-gray'
												placeholder='Enter Contact Number'
											/>
											<span
												onClick={() => {
													setIschangeCredVisible(true);
													setChangeType('phone');
												}}
												className='light fs-14 text-blue pt-1 selectContainer'
											>{t("Change phone number")}
											</span>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Business Email Address")}
											</label>
											<input
												value={email}
												type='email'
												className='bg-gray'
												placeholder='Enter Email Address'
											/>
											<span
												onClick={() => {
													setIschangeCredVisible(true);
													setChangeType('new_email');
												}}
												className='light fs-14 text-blue pt-1 selectContainer'
											>{t("Change email address")}
											</span>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Website URL")}
											</label>

											<div class='input-group flex-nowrap mb-3'>
												<input
													value={values.website_url}
													onChange={handleChange}
													name='website_url'
													type='text'
												/>
											</div>
											<h6 className='fs-14 light pt-1'>
												{t("If you don’t have a website wix.com will provide you with one for free")}{' '}
												<span
													onClick={(e) => {
														window.open('https://www.wix.com');
													}}
													className='fs-16 medium'
												>
													Wix.com
												</span>
											</h6>
										</div>

										<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>{t("Add Primary Business Location")}
										</h2>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Location")}
											</label>

											{/* Location search */}
											<Autocomplete
												className={profileData?.is_store?'location text-truncate text-nowrap bg-gray': 'location text-truncate text-nowrap'}
												placeholder={t("Enter a location")}
												defaultValue={values.location}
												apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
												disabled={profileData?.is_store? true: false}
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
														longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(
															5
														),
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

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Apartment/Street Address")} {t("(Optional)")}
											</label>
											<input
												value={values.address}
												disabled={profileData?.is_store? true: false}
												className={profileData?.is_store?'bg-gray':''}
												onChange={handleChange}
												name='address'
												placeholder={t('Enter Apartment/Street Address')}
											/>
										</div>

										<div className='row'>
											<div className='col-md-6'>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>{t("City")}
													</label>
													<input
														name='city'
														value={values.city}
														disabled={profileData?.is_store? true: false}
														className={profileData?.is_store?'bg-gray':''}
														onChange={handleChange}
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
														name='state'
														value={values.state}
														disabled={profileData?.is_store? true: false}
														className={profileData?.is_store?'bg-gray':''}
														onChange={handleChange}
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
														name='country'
														value={values.country}
														disabled={profileData?.is_store? true: false}
														className={profileData?.is_store?'bg-gray':''}
														onChange={handleChange}
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
														name='zipcode'
														value={values.zipcode}
														disabled={profileData?.is_store? true: false}
														className={profileData?.is_store?'bg-gray':''}
														onChange={handleChange}
														type='text'
														placeholder={t('Enter zip code')}
													/>
												</div>
											</div>
										</div>
										{otherLocations.map((item, index) => {
											return (
												<div
													key={index}
													// className='collapse'
													// id='collapseExample'
												>
													<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>{t("Other Business Location")}
													</h2>
													<p>{t("Use different phone number / email address for new location")}</p>
													<div className='add-location rounded-10 mb-3'>
														<div className='text-end'>
															<a
																data-bs-toggle='collapse'
																// href='#collapseExample'
																role='button'
																aria-expanded='true'
																aria-controls='collapseExample'
																onClick={() => {
																	let finalList = otherLocations.filter(
																		(item, ind) => ind != index
																	);
																	setOtherLocations(finalList);
																}}
															>
																<img
																	src='assets/img/icon/closecircle.svg'
																	width='24'
																	height='24'
																	alt=''
																/>
															</a>
														</div>
														<div className='form-field mb-3'>
															

															<label for='' className='pb-2'>{t("Location")}
															</label>
															<Autocomplete
																id={index}
																placeholder={t("Enter a location")}
																style={{ backgroundColor: 'white' }}
																className='location'
																defaultValue={otherLocations[index]?.location}
																apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
																options={{ types: [] }}
																onPlaceSelected={(place) => {
																	// setValues2((prev) => ({
																	// 	...prev,
																	// 	location: place?.formatted_address,
																	// }));
																	// setValues2((prev) => ({
																	// 	...prev,
																	// 	latitude: parseFloat(place?.geometry?.location?.lat()).toFixed(5),
																	// }));
																	// setValues2((prev) => ({
																	// 	...prev,
																	// 	longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(
																	// 		5
																	// 	),
																	// }));

																	let city_ = place?.address_components.filter(
																		(item) => item.types.filter((it) => it == 'locality').length
																	);
																	let state_ = place?.address_components.filter(
																		(item) =>
																			item.types.filter(
																				(it) => it == 'administrative_area_level_1'
																			).length
																	);
																	let country_ = place?.address_components.filter(
																		(item) => item.types.filter((it) => it == 'country').length
																	);
																	let zipcode_ = place?.address_components.filter(
																		(item) =>
																			item.types.filter((it) => it == 'postal_code').length
																	);
																	// console.log('otherrrrr_______', otherLocations);
																	// console.log('otherrrrremail_______', otherLocations[index]?.store_manager_email);
																	// console.log('otherrrrrcity_______', otherLocations[index]?.city);
																	let locations = otherLocations.slice();
																	// console.log('location_', locations)
																	locations[index] = {
																		...locations[index],
																		location: place.formatted_address,
																		latitude: parseFloat(
																			place?.geometry?.location?.lat()
																		).toFixed(5),
																		longitude: parseFloat(
																			place?.geometry?.location?.lng()
																		).toFixed(5),
																		city: city_.length ? city_[0]?.long_name : '',
																		state: state_.length ? state_[0]?.long_name : '',
																		country: country_.length ? country_[0]?.long_name : '',
																		zipcode: zipcode_.length ? zipcode_[0].long_name : '',
																		// store_manager_email: otherLocations[index]?.store_manager_email,
																		// store_manager_phone: otherLocations[index]?.store_manager_phone,

																	};
																	// console.log('location2_', locations)
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

														{/* <div className='form-field mb-3'>
														<label for='' className='pb-2'>{t("Store Manager Phone")}
														</label>
														<input
															id={index}
															name='store_manager_phone'
															value={otherLocations[index]?.store_manager_phone}
															onChange={handle_}
															type='text'
															placeholder={t('Enter Contact Number')}
														/>
														</div> */}

														<div class='form-field mb-3'>
														<label for='' class='pb-2'>{t("Store Manager Phone Number")}
														</label>
														<PhoneInput
															// isValid={(inputNumber, country, countries) => {
															// 	return countries.some((country) => {
															// 		return (
															// 			startsWith(inputNumber, country.dialCode) ||
															// 			startsWith(country.dialCode, inputNumber)
															// 		);
															// 	});
															// }}
															countrySelectorStyleProps={{
																style: {
																	backgroundColor: 'white',
																	alignItems:  'center',
																	justifyContent: 'center',
																	display: 'flex',
																},
															}}
															
															defaultCountry='il'
															style={{
																width: '100%',
																// height: '100%'
															}}
															inputStyle={{
																// border: 'transparent',
																// height: '44px',
																border: '0.5px initial gray',
																// paddingTop: '10px',
																borderTopRightRadius: 10,
																borderBottomRightRadius: 10,
																marginInlineStart: (i18n.language=='he' || i18n.language=='ar')?'25px':'0px'
															}}
															
															placeholder='Enter phone number'
															value={otherLocations[index]?.store_manager_phone}
															onChange={(value) => {
																// handle_('store_manager_phone', '+' + value, index);
																handle_('store_manager_phone', value, index);
															}}
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
																placeholder={t('Address')}
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

										{/* {allowedAddressCount ? ( */}
										{!profileData?.is_store && <div
											onClick={() => {
												if (allowedAddressCount) {
													setOtherLocations((v) => [...v, other_location_obj]);
												} else {
													setIsOrderSUmmaryVisible(true);
												}
												// setOtherLocations((v) => [...v, other_location_obj]);
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
										</div>}
										{/* ) : null} */}

										<h2
											onClick={(e) => {
												// addLocation();
												e.preventDefault();
											}}
											className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'
										>{t("Add Social Accounts ")} <span className='fs-16'>{t("(Optional)")}</span>
										</h2>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Facebook")}
											</label>
											<div class='input-group flex-nowrap mb-3'>
												<input
													name='facebook_url'
													value={values.facebook_url}
													onChange={handleChange}
													type='text'
												/>
											</div>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Twitter")}
											</label>
											<div class='input-group flex-nowrap mb-3'>
												<input
													name='twitter_url'
													value={values.twitter_url}
													onChange={handleChange}
													type='text'
												/>
											</div>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Instagram")}
											</label>
											<div class='input-group flex-nowrap mb-3'>
												<input
													name='instagram_url'
													value={values.instagram_url}
													onChange={handleChange}
													type='text'
												/>
											</div>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Youtube")}
											</label>
											<div class='input-group flex-nowrap mb-3'>
												<input
													name='youtube_url'
													value={removeHttpAndHttps(values.youtube_url)}
													onChange={handleChange}
													type='text'
												/>
											</div>
										</div>

										{user?.business_category == 3 ||
											(values?.business_category == 3 && (
												<div>
													<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>{t("Add Menu")}</h2>
													<div className='form-field mb-3'>
														<div className=' d-flex flex-column mb-3'>
															<label for='' className='pb-2'>
																{t("Menu PDF")}
															</label>
															{menuFile ? (
																<div className='p-3 d-flex gap-3 align-items-center '>
																	<img
																		onClick={(e) =>
																			window.open(Endpoints.baseUrl + menuFile, '_blank')
																		}
																		height={30}
																		width={30}
																		className=' selectContainer'
																		src='assets/img/icon/view-menu.svg'
																		alt=''
																	/>
																	<span className=' fs-10'>{menuFile?.name}</span>
																	<div
																		className=' selectContainer'
																		onClick={(e) => setMenuFile('')}
																	>
																		<i class='fa fa-times' aria-hidden='true' />
																	</div>
																</div>
															) : null}
														</div>

														<input
															// value={menuFile}
															placeholder={t('Upload PDF')}
															accept='.pdf, .txt'
															onChange={handleChange3}
															type='file'
															// className="d-none"
															className='upload-file text-gray2 rounded-10 fs-14 light medium w-100 text-center'
															id='file'
														/>
													</div>
													<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>
														{t("Add Delivery Partners")}
													</h2>
													<div className='form-field mb-3'>
														<Select
															value={deliveryPartner}
															onChange={(e) => {
																setDeliveryPartner(e);
															}}
															placeholder={t('Select')}
															isMulti
															options={deliveryPartnerData}
															getOptionValue={(option) => option.id}
															getOptionLabel={(e) => (
																<div
																	style={{ display: 'flex', alignItems: 'start', gap: '6px' }}
																>
																	<img
																		src={Endpoints.baseUrl + e?.image}
																		style={{ height: '20px', width: '20px' }}
																		alt=''
																		className=' rounded-circle'
																	></img>
																	<span
																		className=' text-truncate'
																		style={{ fontSize: '13px', alignContent: 'start' }}
																	>
																		{e?.name}
																	</span>
																</div>
															)}
														/>
													</div>
												</div>
											))}

										<button className='button w-100 rounded-10'>{t("Continue")}</button>
									</form>
								</div>
							</div>
						</div>
						{ischangeCredVisible ? (
							<ChangeCredentialScreen
								changeType={changeType}
								isChangeCredVisible={ischangeCredVisible}
								setIschangeCredVisible={setIschangeCredVisible}
							/>
						) : null}
					</div>
				)}

				<div
					className='modal fade'
					data-show='true'
					id='add'
					tabindex='1'
					role='dialog'
				>
					<div className='modal-dialog modal-dialog-top location-modal'>
						<div className='modal-content rounded-20 border-0'>
							<div className='modal-header border-0 p-0'>
								<button
									type='button'
									className='outside-close bg-transparent border-0'
									data-bs-dismiss='modal'
									aria-label='Close'
								>
									<img src='assets/img/icon/close.svg' alt='' />
								</button>
							</div>
							<div className='modal-body p-4 '>
								<h3 className='fs-22 fs-sm-16 pt-3 pb-2 text-gray1'>
									{t("How many business locations you want to add?")}
								</h3>
								<h5 className='fs-16 light pb-3'>
									{t("You will be charged")}{' '}
									<span className='text-blue medium'>
										{defined_currency?.sign}
										{parseFloat(unitCostData?.location)?.toFixed(2)}
									</span>{' '}
									{t("for each location.")}
								</h5>
								<form action='' className='site-form'>
									<div className='form-field'>
										<input
											min={1}
											value={locationCount}
											onChange={(e) => {
												if(e.target.value>=0){
													setLocationCount(e.target.value);
												}   
											}}
											type='number'
											placeholder={t('Enter Number')}
										/>
									</div>
								</form>

								<div className='payment-summary'>
									<h6 className='text-gray1 py-2 '>{t("Order Summary")}</h6>
									<div className='p-4 order rounded-20 mb-2'>
										{/* <div className='d-flex justify-content-between pb-2'>
											<h6 className='fs-16 text-gray1'>Subtotal</h6>
											<h5 className='fs-20 medium'>
												${(parseFloat(unitCostData?.location) * locationCount)?.toFixed(2)}
											</h5>
										</div>
										<div className='d-flex justify-content-between pb-2 border-bottom'>
											<h6 className='fs-16 text-gray1'>Tax</h6>
											<h5 className='fs-20 medium'>
												${parseFloat(unitCostData?.tax)?.toFixed(2)}
											</h5>
										</div> */}
										<div className='d-flex justify-content-between pt-2'>
											<h6 className='fs-16 text-gray1'>{t("Total")}</h6>
											<h5 className='fs-20 medium'>
												{defined_currency?.sign}
												{(parseFloat(unitCostData?.location) * locationCount)?.toFixed(2)}
											</h5>
										</div>
									</div>

									<div className='d-flex justify-content-center gap-3 pt-3 btn-group'>
										<button
											onClick={() => {
												setIsOrderSUmmaryVisible(false);
											}}
											className='button gray-btn rounded-10 fs-20 medium w-100'
											data-bs-dismiss='modal'
											aria-label='Close'
										>{t("Cancel")}
										</button>
										<button
											onClick={(e) => {
												addLocationPayment();
												// navigate('/add-locations')
												e.preventDefault();
											}}
											data-bs-dismiss='modal'
											aria-label={locationCount ? 'Close' : ''}
											className='button rounded-10 fs-20 medium w-100'
										>{t("Payment")}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- END MODAL --> */}
				<CustomFooter internal />
			</div>
		</>
	);
}

export default BusinessProfileSetup;

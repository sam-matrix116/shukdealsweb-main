import React, { useEffect, useState } from 'react';
import {
	getChoosenCurrency,
	getLoggedInUser,
	setCookie,
} from '../../../helpers/authUtils';
import { useTranslation } from 'react-i18next';
import { ValidateList, ValidationTypes } from '../../../Utils/ValidationHelper';
import { Endpoints } from '../../../API/Endpoints';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import VerticalThumbnailCrousel from '../../CommonCrousel/VerticalThumbnailCrousel';
import CommonMultiImageUploader from '../../CommonMultiImageUploader';
import { saveFilesLocalStorage } from '../../../helpers/fileHelper';
import VerticalPreviewImage from '../../CommonCrousel/VerticalPreviewImage';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';
import { UrlArrayChecker } from '../../../helpers';
import InfoButton from '../../CommonUiComponents/InfoButton';

function CreateDealsListing({
	id,
	handleChange,
	handleRadio,
	extistingData,
	values,
	setValues,
	setIsLoading,
	locaitonList,
	// cateogry slection
	radioData,
	subCategoryData,
	subCategoryData2,
	getSubCategoryData,
}) {
	const user = getLoggedInUser();
	const defined_currency = { sign: user?.currency_sign };
	const [images, setImages] = useState([]);
	const [showOnlineOption, setShowOnlineOption] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const [modal, setModal] = useState(false);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location2 = useLocation();
	const minLimit = 1;

	// console.log('uuussseee__));
	console.log('allstoresss_', values?.all_stores)

	const counponTypeData = values?.online_supported
		? [
				{ title: 'Online', data: 'online' },
				{ title: 'Offline', data: 'offline' },
				{ title: 'Online-Offline', data: 'online_offline' },
		  ]
		: [{ title: 'Offline', data: 'offline' }];
	const validationArr = () => {
		return [
			[values?.title, ValidationTypes.Empty, t('Please Enter Title')],
			[values?.description, ValidationTypes.Empty, t('Please Enter Description')],
			// [location, ValidationTypes.Empty, t('Please Enter Location')],
			[images, ValidationTypes.Empty, t('Please add images')],
			[
				values?.deal_type,
				ValidationTypes.Empty,
				t('Please Select Coupon/Deal Type'),
			],
			[
				values?.actual_price,
				ValidationTypes.Empty,
				t('Please Enter Actual Price'),
			],
			[
				values?.actual_price,
				ValidationTypes.NumberNotNegative,
				t('Please enter valid price'),
			],
			[
				values?.free_member_discount_type,
				ValidationTypes.Empty,
				t('Please Select Discount Type'),
			],
			[
				values?.free_member_discount_value,
				ValidationTypes.Empty,
				t('Please Enter Discount Value'),
			],
			[
				values?.free_member_discount_value,
				ValidationTypes.NumberNotNegative,
				t('Please enter a valid free member discount value'),
			],
			[
				values?.club_member_discount_value,
				ValidationTypes.NumberNotNegative,
				t('Please enter a valid club member discount value'),
			],
			[
				values?.free_member_discount_type === 'percentage'
					? values?.free_member_discount_value
					: null,
				ValidationTypes.NumberNotMoreThan,
				t('Please enter a percentage less than or equal to 100 '),
				100,
			],
			[
				values?.club_member_discount_type === 'percentage'
					? values?.club_member_discount_value
					: null,
				ValidationTypes.NumberNotNegative,
				t('Please enter a percentage less than or equal to 100 '),
				100,
			],
			[
				values?.free_member_code,
				ValidationTypes.Empty,
				t('Please Enter Deal Code'),
			],
			[values?.expiry_date, ValidationTypes.Empty, t('Please Enter Expiry Date')],
		];
	};

	useEffect(() => {
		// for existing data and edit details
		if (location2?.pathname === '/update-deal') {
			setValues((values) => ({
				...values,
				title: extistingData?.title,
				description: extistingData?.description,
				deal_type: extistingData?.deal_type,
				actual_price: extistingData?.actual_price,
				club_member_discount_type: extistingData?.club_member_discount_type,
				club_member_code: extistingData?.club_member_code,
				club_member_discount_value: extistingData?.club_member_discount_value,
				free_member_code: extistingData?.free_member_code,
				free_member_discount_type: extistingData?.free_member_discount_type,
				free_member_discount_value: extistingData?.free_member_discount_value,
				expiry_date: extistingData?.expiry_date,
				business_location: extistingData?.business_location,
				business_sub_category: extistingData?.business_sub_category ?? '',
				business_sub_sub_category: extistingData?.business_sub_sub_category ?? '',
				property_class: extistingData?.property_class ?? '',
				online_supported: extistingData?.online_supported ?? '',
				all_stores: extistingData?.all_stores,
				redemption_link: extistingData?.redemption_link || ''
			}));
			if (user?.business_category == 3) {
				setValues((values) => ({
					...values,
					location: extistingData?.location?.location ?? '',
					address: extistingData?.location?.address ?? '',
					latitude: extistingData?.location?.latitude ?? '',
					longitude: extistingData?.location?.longitude ?? '',
					city: extistingData?.location?.city ?? '',
					state: extistingData?.location?.state ?? '',
					country: extistingData?.location?.country ?? '',
					zipcode: extistingData?.location?.zipcode ?? '',
				}));
			}
			setImages(extistingData?.images);
			setImagePreview(
				extistingData?.images?.map((item) => Endpoints.baseUrl + item?.image)
			);
		}
	}, [extistingData]);

	const addDeal = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
		let ValidationUrlArr = [
			{ url: values?.redemption_link, name: 'redemption_link' },
		];
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
		for (var key in values) {
			obj.append(key, values[key]);
		}
		if (images.length) {
			images.map((i) => {
				obj.append('images', i);
			});
		}
		if (locaitonList?.length == 1 && user?.business_category != 3) {
			obj.append('business_location', locaitonList[0]?.id);
		}
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.addDeal, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				navigate('/deal-listing');

				setIsLoading(false);
			} else if (resp && resp.status && resp.go_to === 'payment') {
				setIsLoading(false);
				localStorage.setItem('dealObj', JSON.stringify(values));
				await saveFilesLocalStorage('dealsImage', images);
				localStorage.setItem('paytype', 'deal');
				setCookie('payment_detail', resp?.payment_detail);
				navigate('/payment-summary', {
					state: {
						// clientSecret: resp?.stripe_client_secret,
						preview: imagePreview?.[0],
					},
				});
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	const updateDeal = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}

		let ValidationUrlArr = [
			{ url: values?.redemption_link, name: 'redemption_link' },
		];
		const urlArr = UrlArrayChecker(ValidationUrlArr);
		const copyValues = { ...values };
		Object.keys(copyValues).forEach((item) => {
			urlArr.forEach((val) => {
				if (val.name === item) {
					copyValues[item] = val.url;
				}
			});
		});
		if (id)
			try {
		// console.log('valll__', values);
		delete values.location
		// console.log('valll2__', values);

		// values.location = extistingData?.location?.id;
				let obj = new FormData();
				for (var key in values) {
					obj.append(key, values[key]);
				}
				// obj.append('location', extistingData?.location?.id)
				if (images.length) {
					images.map((i) => {
						obj.append('images', i);
					});
				}
				console.log('obj__', obj);
				let resp = await FetchApi(Endpoints.updateDeal + id, obj);
				if (resp && resp.status) {
					ToastMessage.Success(resp.message);
					setModal(false);
					navigate('/deal-listing');

					setIsLoading(false);
				}
			} catch (e) {
				setIsLoading(false);

				if (e && e.message) {
					ToastMessage.Error(e.message);
				}
			}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (images?.length < minLimit || imagePreview?.length < minLimit) {
			ToastMessage.Error(`${t("Please upload more than")} ${minLimit} ${t("Images")}`);
			return;
		}

		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
	};
	const handleCategoryChange = async (type, event, data) => {
		if (type === 'radio') {
			handleRadio(event, data);
			setValues((prev) => ({ ...prev, business_sub_sub_category: '' }));
			getSubCategoryData(data, 'subSelect2');
		}
		if (type === 'sub') {
			handleChange(event, data);
			getSubCategoryData(data, 'subSelect2');
		}
	};
	const handleOnlineSupport = (event, data) => {
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
			if (data === false) {
				setValues((values) => ({
					...values,
					deal_type: 'offline',
				}));
			} else {
				setValues((values) => ({
					...values,
					deal_type: '',
				}));
			}
			setShowOnlineOption(true);
		}
	};
	// console.log({ values });
	return (
		<div>
			<div>
				<div className='container py-4 border-top mb-3'>
					<div className='row justify-content-center'>
						<div className='col-lg-6 col-md-8 col-sm-10'>
							<h1 className='fs-30 text-gray1 pb-3 fs-sm-22'>
								{location2.pathname === '/create-listing-restaurant'
									? t('Create Listing')
									: location2.pathname === '/create-product-deal'
									? t('Create Product Deal')
									: location2.pathname === '/create-travel-deal'
									? t('Create Travel Deal')
									: location2.pathname === '/create-sport-deal'
									? t('Create Sports Deal')
									: location2.pathname === '/update-deal'
									? t('Update Deal')
									: location2.pathname === '/create-service-deal'
									? t('Create Service Deal')
									: ''}
							</h1>

							<form action='' className='site-form pt-md-2 profile-setup-form'>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t('Title')}
									</label>
									<input
										value={values.title}
										name='title'
										onChange={handleChange}
										type='text'
										placeholder={t('Coupon/Deal Title')}
									/>
								</div>

								<div className='form-field mb-3 position-relative'>
									<label for='' className='pb-2'>
										{t('Description')}
									</label>
									<textarea
										value={values.description}
										name='description'
										onChange={handleChange}
										cols='10'
										rows='4'
										id='the-textarea'
										maxlength='300'
										placeholder={
											location2.pathname === '/create-sport-deal'?
											t(
												'Write a description of your sports listing'
											)
											:
											t(
											'Write about your full description of your listing'
											)
										}
										autofocus
									></textarea>
									<div id='the-count' className='fs-14 text-gray2 light'>
										<span id='current'>{values?.description?.length}</span>
										<span id='maximum'>/ 300</span>
									</div>
								</div>

								{/* image upload  */}
								<CommonMultiImageUploader
									imageState={images}
									imagesPreviewState={imagePreview}
									setImages={setImages}
									setImagePreview={setImagePreview}
									minLimit={1}
									maxLimit={5}
								/>

								<div className='mb-3'>
									<div className=' d-flex gap-2 align-items-center  pb-2'>
										<label for='' className=''>
											{t("Does website supports online purchases?")}
										</label>
										<InfoButton
											description={
												'In case of choosing "Yes" type you can create online, offline, and hybrid (online + offline) deals. In case of choosing "No" limits you to create offline deals only'
											}
										/>
									</div>

									<Select
									placeholder={t("Select")}
										value={[
											{ name: t('Yes'), id: true },
											{ name: t('No'), id: false },
										]?.filter((item) => item.id === values?.online_supported)}
										name='business_sub_category'
										options={[
											{ name: t('Yes'), id: true },
											{ name: t('No'), id: false },
										]}
										onChange={(e) => {
											handleOnlineSupport('online_supported', e?.id);
										}}
										isSearchable={true}
										getOptionValue={(option) => option.id}
										getOptionLabel={(option) => option.name}
									/>
								</div>

								{showOnlineOption && (
									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Coupon/Deal Type')}
										</label>
										<div className='d-flex gap-4'>
											{counponTypeData?.map((item) => {
												return (
													<div className='custom-radio  d-flex gap-1 align-content-center '>
														<input
															type='radio'
															name='deal_type'
															onClick={(event) => {
																handleRadio(event, item?.data);
															}}
															checked={values?.deal_type === item?.data ? true : false}
														/>
														<label for={item?.data} className='medium'>
															{t(item?.title)}
														</label>
													</div>
												);
											})}
										</div>
									</div>
								)}
								{['online', 'online_offline'].includes(values?.deal_type) && (
									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Redemption Link')}
										</label>

										<div class='input-group flex-nowrap mb-3'>
											<input
												value={values.redemption_link}
												onChange={handleChange}
												name='redemption_link'
												type='text'
											/>
										</div>
									</div>
								)}
								<>
									{radioData?.length ? (
										<div className='form-field mb-3 '>
											<label for='' className='pb-2'>
												{t("Choose from")}
											</label>
											<div className='d-flex gap-4'>
												{radioData?.map((item) => {
													return (
														<div
															key={item.id}
															className='custom-radio  d-flex gap-1 align-content-center'
														>
															<input
																onClick={(e) => handleCategoryChange('radio', e, item?.id)}
																id={item.id}
																type='radio'
																name='business_sub_category'
																checked={
																	values?.business_sub_category === item?.id ? true : false
																}
															/>
															<label htmlFor={item?.name} className='medium'>
																{item?.name}
															</label>
														</div>
													);
												})}
											</div>
										</div>
									) : null}
									{subCategoryData?.length ? (
										<div className='form-field mb-3 '>
											<label for='' className='pb-2'>
												{t('Choose Category')}
											</label>
											<Select
												placeholder={t("Select")}
												value={subCategoryData?.filter(
													(item) => item.id === values?.business_sub_category
												)}
												name='business_sub_category'
												options={subCategoryData}
												onChange={(e) => {
													handleCategoryChange('sub', 'business_sub_category', e?.id);
												}}
												isSearchable={true}
												getOptionValue={(option) => option.id}
												getOptionLabel={(option) => option.name}
											/>
										</div>
									) : null}
									{subCategoryData2?.length ? (
										<div className='form-field mb-3 '>
											<label for='' className='pb-2'>
												{t('Choose Sub Sub Category')}
											</label>

											<Select
												placeholder={t("Select")}
												value={subCategoryData2?.filter(
													(item) => item.id === values?.business_sub_sub_category
												)}
												name='business_sub_sub_category'
												options={subCategoryData2}
												onChange={(e) => {
													handleChange('business_sub_sub_category', e?.id);
												}}
												isSearchable={true}
												getOptionValue={(option) => option.id}
												getOptionLabel={(option) => option.name}
											/>
										</div>
									) : null}
								</>

								<div className='mb-3'>
									<label for='' className='pb-2'>
										{t('Actual Price')}
									</label>
									<div className='border rounded-10 d-flex align-items-center overflow-hidden'>
										<span className='border-0  col-2 d-flex justify-content-center'>
											{defined_currency?.sign}
										</span>
										<div className='input-box'>
											<input
												value={values?.actual_price}
												name='actual_price'
												onChange={handleChange}
												type='text'
												className='border-0 w-75 border-start rounded-0'
												placeholder='00'
											/>
										</div>
									</div>
								</div>

								{locaitonList?.length > 1 && !user?.is_store &&
								user?.business_category != 3 &&
								user?.user_type !== 'Non Profitable Organization' &&
								<div className='mb-3 '>
									<input
										onClick={(e) => {
										// console.log('eeeeajjaa___', e.target.checked)
											handleChange('all_stores', e.target.checked)
										}}
										// onClick={handleChange}
										checked={values?.all_stores}
										name='all_stores'
										type='checkbox'
										id='all_stores'
										className='align-middle me-2'
									/>
									<label for=''>{t('Add this deal for all the existing locations')}</label>
								</div>}

								{locaitonList?.length > 1 && !values?.all_stores &&
								user?.business_category != 3 &&
								user?.user_type !== 'Non Profitable Organization' ? (
									<div className='mb-3'>
										<label for='' className='pb-2'>
											{t('Existing Location')}
										</label>
										<Select
											placeholder={t("Select")}
											value={locaitonList?.filter(
												(item) => item.id === values?.business_location
											)}
											options={locaitonList}
											onChange={(e) => handleChange('business_location', e?.id)}
											name='business_location'
											isSearchable={true}
											getOptionValue={(option) => option.id}
											getOptionLabel={(option) => option.location}
										/>
									</div>
								) : null}
								{user?.business_category == 4 ? (
									<div className='mb-3'>
										<label for='' className='pb-2'>
											Property Class
										</label>
										<select
											value={values?.property_class}
											onChange={handleChange}
											name='property_class'
											id=''
											className=' w-100 ps-md-3 ps-1'
										>
											<option value=''>Select</option>
											<option value='1'>1 Star</option>
											<option value='2'>2 Star</option>
											<option value='3'>3 Star</option>
											<option value='4'>4 Star</option>
											<option value='5'>5 Star</option>
										</select>
									</div>
								) : null}

								{user?.business_category == 3 ? (
									<>
										<h3 className='py-2 fs-22 fs-sm-18 mb-2'>{t("Add Location")}</h3>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>
												{t('Location')}
											</label>
											<Autocomplete
											disabled={location2.pathname === '/update-deal'?true:false}
												className='location text-truncate'
												placeholder={t("Enter a location")}
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

										<div className='form-field mb-3 pb-2'>
											<label for='' className='pb-2'>
											{t("Apartment/Street Address")} {t("(Optional)")}
											</label>
											<input
											disabled={location2.pathname === '/update-deal'?true:false}
												value={values?.address}
												name='address'
												onChange={handleChange}
												type='text'
												placeholder={t('Enter Address')}
											/>
										</div>

										<div className='row'>
											<div className='col-md-6'>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('City')}
													</label>
													<input
														disabled={location2.pathname === '/update-deal'?true:false}
														value={values?.city}
														name='city'
														onChange={handleChange}
														type='text'
														placeholder={t('Enter City')}
													/>
												</div>
											</div>
											<div className='col-md-6'>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('State')}
													</label>
													<input
														disabled={location2.pathname === '/update-deal'?true:false}
														value={values?.state}
														name='state'
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
													<label for='' className='pb-2'>
														{t('Country')}
													</label>

													<input
														disabled={location2.pathname === '/update-deal'?true:false}
														value={values?.country}
														name='country'
														onChange={handleChange}
														type='text'
														placeholder='Enter Country'
													/>
												</div>
											</div>
											<div className='col-md-6'>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('Zip Code')}
													</label>
													<input
														disabled={location2.pathname === '/update-deal'?true:false}
														value={values?.zipcode}
														name='zipcode'
														onChange={handleChange}
														type='text'
														placeholder='Enter zip code'
													/>
												</div>
											</div>
										</div>
									</>
								) : null}

								<div>
									{/* <div> */}
									<h3 className='py-2 fs-22 fs-sm-18 mb-2'>
										{t('Coupon/Deal Code for Club Member')}
									</h3>

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Discount Type')}
										</label>
										<div className='d-flex gap-4'>
											<div className='discount-radio'>
												<input
													name='club_member_discount_type'
													onClick={(event) => {
														handleRadio(event, 'fixed');
													}}
													type='radio'
													className='d-none'
													id='fixed'
													checked={
														values?.club_member_discount_type === 'fixed' ? true : false
													}
												/>
												<label for='fixed' className='border rounded-10 p-3 text-center'>
													<img src='assets/img/icon/dollarcircle.svg' alt='' />
													<span className='d-block text-gray2 fs-14 light pt-2'>
														{t('Fixed Amount')}
													</span>
												</label>
											</div>

											<div className='discount-radio'>
												<input
													name='club_member_discount_type'
													onClick={(event) => {
														handleRadio(event, 'percentage');
													}}
													type='radio'
													className='d-none'
													id='percentage'
													checked={
														values?.club_member_discount_type === 'percentage' ? true : false
													}
												/>
												<label
													for='percentage'
													className='border rounded-10 p-3 text-center'
												>
													<img
														src='assets/img/icon/percentagecircle.svg'
														width='35'
														alt=''
													/>
													<span className='d-block text-gray2 fs-14 light pt-2'>
														{t('Percentage Off')}
													</span>
												</label>
											</div>
										</div>
									</div>

									<div className='form-field mb-3 pb-2'>
										<label for='' className='pb-2'>
											{values?.club_member_discount_type === 'fixed'
												? t('Fixed Discount Value')
												: t('Percent Off Value')}
										</label>
										<input
											value={values?.club_member_discount_value}
											onChange={handleChange}
											name='club_member_discount_value'
											type='text'
											placeholder='00'
										/>
									</div>

									<div className='mb-3'>
										<label for='' className='pb-2'>
											{t('Coupon/Deal Code')}
										</label>
										<div className='border rounded-10 d-flex align-items-center overflow-hidden'>
											<label
												onClick={(e) => {
													handleChange(
														'club_member_code',
														Math.random()?.toString(36)?.toUpperCase()?.substring(2, 8)
													);
												}}
												for=''
												className='text-blue px-3'
											>
												{t('Generate code')}
											</label>
											<input
												value={values?.club_member_code}
												name='club_member_code'
												onChange={handleChange}
												type='text'
												className='border-0 w-75 border-start rounded-0'
												placeholder='ABC123'
											/>
										</div>
									</div>

									<h3 className='py-2 fs-22 fs-sm-18 mb-2'>
										{t("Coupon/Deal Code for Free Member")}
									</h3>

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Discount Type')}
										</label>

										<div className='d-flex gap-4'>
											<div className='discount-radio'>
												<input
													name='free_member_discount_type'
													onClick={(event) => {
														handleRadio(event, 'fixed');
													}}
													checked={
														values?.free_member_discount_type === 'fixed' ? true : false
													}
													type='radio'
													className='d-none'
													id='fixed1'
												/>
												<label for='fixed1' className='border rounded-10 p-3 text-center'>
													<img src='assets/img/icon/dollarcircle.svg' alt='' />
													<span className='d-block text-gray2 fs-14 light pt-2'>
														{t('Fixed Amount')}
													</span>
												</label>
											</div>

											<div className='discount-radio'>
												<input
													name='free_member_discount_type'
													onClick={(event) => {
														handleRadio(event, 'percentage');
													}}
													checked={
														values?.free_member_discount_type === 'percentage' ? true : false
													}
													type='radio'
													className='d-none'
													id='percentage1'
												/>
												<label
													for='percentage1'
													className='border rounded-10 p-3 text-center'
												>
													<img
														src='assets/img/icon/percentagecircle.svg'
														width='35'
														alt=''
													/>
													<span className='d-block text-gray2 fs-14 light pt-2'>
														{t('Percentage Off')}
													</span>
												</label>
											</div>
										</div>
									</div>

									<div className='form-field mb-3 pb-2'>
										<label for='' className='pb-2'>
											{values?.free_member_discount_type === 'fixed'
												? t('Fixed Discount Value')
												: t('Percent Off Value')}
										</label>
										<input
											value={values?.free_member_discount_value}
											onChange={handleChange}
											name='free_member_discount_value'
											type='text'
											placeholder='00'
										/>
									</div>

									<div className='mb-3'>
										<label for='' className='pb-2'>
											{t('Coupon/Deal Code')}
										</label>
										<div className='border rounded-10 d-flex align-items-center overflow-hidden'>
											<label
												onClick={(e) => {
													handleChange(
														'free_member_code',
														Math.random()?.toString(36)?.toUpperCase()?.substring(2, 8)
													);
												}}
												for=''
												className='text-blue px-3'
											>
												{t('Generate code')}
											</label>
											<input
												value={values?.free_member_code}
												onChange={handleChange}
												name='free_member_code'
												type='text'
												className='border-0 w-75 border-start rounded-0'
												placeholder='ABC123'
											/>
										</div>
									</div>
									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Expiry Date')}
										</label>
										<input
											value={values?.expiry_date}
											min={moment(new Date()).format('YYYY-MM-DD')}
											onChange={handleChange}
											name='expiry_date'
											type='date'
											placeholder={t('Choose date')}
											className='custom-date'
										/>
									</div>
								</div>

								<Link
									onClick={handleSubmit}
									className='button w-100 mt-4'
									data-bs-toggle={
										values?.title &&
										values?.description &&
										values?.deal_type &&
										values?.actual_price &&
										values?.free_member_discount_type &&
										values?.free_member_discount_value &&
										values?.free_member_code &&
										values?.expiry_date &&
										images?.length >= 1
											? 'modal'
											: ''
									}
									data-bs-target='#preview'
								>
									{t('Preview')}
								</Link>
							</form>
						</div>
					</div>
				</div>

				{/* modal */}

				<div
					className='modal fade'
					id='preview'
					tabindex='-1'
					aria-labelledby='addmodalLabel'
					aria-modal='true'
					role='dialog'
				>
					<div className='modal-dialog modal-dialog-top popup-md'>
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
							<div className='modal-body px-4 pb-4'>
								<h4 className='fs-22 text-gray1 border-bottom py-2'>{t('Preview')}</h4>
								<div className='d-flex flex-column flex-lg-row gap-3 px-3 border-bottom'>
									<div className='col-lg-5 '>
										<div className=' position-relative'>
											{imagePreview && <VerticalPreviewImage images={imagePreview} />}
										</div>
									</div>

									<div className='d-flex flex-column justify-content-between col-lg-7 pt-4'>
										<div className='d-flex align-items-center gap-lg-3  gap-2 pb-2 deal-content-row  pb-2'>
											<span className='redeem-btn fs-12'>
												<img src='assets/img/icon/deal-redeemed.svg' /> 0 {t("Redeemed")}
											</span>
											<p className='m-0 fs-10 fs-sm-9'>
												{t('Posted') + ':'} {moment(new Date()).format('DD MMM YYYY')}
											</p>
											<div className='text-green fs-10 d-flex align-items-center fs-sm-9'>
												<p className='text-gray1 fs-sm-9 m-0'>{t('Expire in:')} </p>
												<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
												{values?.expiry_date
													? moment(values?.expiry_date).format('DD MMM YYYY')
													: '7 Days'}
											</div>
										</div>

										<h3 className='fs-22 text-black fs-sm-18 pb-2'>{values?.title}</h3>
										<div className='text-justify light text-gray2 pb-2'>
											<p className='fs-12'>{values?.description}</p>
										</div>
										<OnlineOfflineIcon deal_type={values?.deal_type} />

										<div className='d-flex align-items-center  w-100'>
											<div className='deal-club-member py-2 px-lg-3 px-2'>
												<span className='medium text-gray1 fs-16 fs-sm-12 d-block pb-1'>
													{t("Club Member")}
												</span>
												<span className='medium text-blue fs-22 fs-sm-18 pb-1 d-block'>
													{values?.club_member_discount_type === 'fixed'
														? 'Flat ' + values?.club_member_discount_value + ' ' + t("OFF")
														: values?.club_member_discount_value + '% ' + t("OFF")}
												</span>
												<div className='d-flex gap-3'>
													<del className='medium text-gray1 fs-14 fs-sm-12'>
														{defined_currency?.sign}
														{parseInt(values?.actual_price)?.toFixed(2)}
													</del>
													<ins className='medium text-blue fs-14 text-decoration-none fs-sm-12'>
														{defined_currency?.sign}
														{values?.club_member_discount_type === 'fixed'
															? (
																	parseInt(values?.actual_price) -
																	values?.club_member_discount_value
															  ).toFixed(2)
															: (
																	parseInt(values?.actual_price) -
																	values?.actual_price *
																		(values?.club_member_discount_value / 100)
															  ).toFixed(2)}
													</ins>
												</div>
											</div>
											<div className='deal-nonclub-member py-2 px-lg-3 px-2'>
												<span className='light text-gray1 fs-16 fs-sm-12 d-block pb-1'>
													{t('Non-Club Member')}
												</span>
												<span className='medium text-gray2 fs-22 fs-sm-18 pb-1 d-block'>
													{values?.free_member_discount_type === 'fixed'
														? 'Flat ' + values?.free_member_discount_value + ' Off'
														: values?.free_member_discount_value + '% ' + t("OFF")}
												</span>

												
												<div className='d-flex gap-3'>
													<del className='medium text-gray1 fs-18 fs-sm-12'>
														{defined_currency?.sign}
														{parseInt(values?.actual_price)?.toFixed(2)}
													</del>
													<ins className='medium text-blue fs-18 text-decoration-none fs-sm-12'>
														{defined_currency?.sign}
														{values?.free_member_discount_type === 'fixed'
															? (
																	parseInt(values?.actual_price) -
																	values?.free_member_discount_value
															  ).toFixed(2)
															: (
																	parseInt(values?.actual_price) -
																	values?.actual_price *
																		(values?.free_member_discount_value / 100)
															  ).toFixed(2)}
													</ins>
												</div>
											</div>
										</div>

										<div className='d-flex align-items-center justify-content-betweeon gap-lg-3 gap-md-2 gap-1 pt-2'>
											<div className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img
													src='assets/img/icon/wish.svg'
													width='20'
													className='icon-blue'
												/>
											</div>
											<div
												className='button w-100 fs-16 fs-sm-14 rounded-10 py-3 text-center text-white'
												// data-bs-toggle='modal'
												// data-bs-target='#redeem'
											>
												{t('Redeem')}
											</div>

											<div className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img src='assets/img/icon/share2.svg' width='25' className='' />
											</div>
											<div className='bg-red job-share rounded-10  d-flex align-items-center justify-content-center'>
												<img src='assets/img/icon/flag1.svg' width='14' className='' />
											</div>
										</div>
									</div>
								</div>
								<div className='d-flex justify-content-center gap-3 pt-3 btn-group'>
									<button
										className='button gray-btn rounded-10 fs-12 medium'
										data-bs-dismiss='modal'
										aria-label='Close'
									>
										{t('Back To Edit')}
									</button>
									<button
										onClick={(e) => {
											location2?.pathname === '/update-deal' ? updateDeal() : addDeal();
											e.preventDefault();
										}}
										data-bs-dismiss='modal'
										className='button rounded-10 fs-12 medium'
									>
										{t('Publish')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateDealsListing;

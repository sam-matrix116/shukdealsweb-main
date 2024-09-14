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
import Autocomplete from 'react-google-autocomplete';
import Select from 'react-select';
import CommonMultiImageUploader from '../../CommonMultiImageUploader';
import moment from 'moment';
import VerticalThumbnailCrousel from '../../CommonCrousel/VerticalThumbnailCrousel';
import { saveFilesLocalStorage } from '../../../helpers/fileHelper';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
// import startsWith from 'lodash.startswith';
import VerticalPreviewImage from '../../CommonCrousel/VerticalPreviewImage';

function CreateClassifiedsLisitng({
	id,
	handleChange,
	extistingData,
	values,
	setValues,
	isLoading,
	classifiedCategory,
	setIsLoading,
}) {
	const user = getLoggedInUser();
	const defined_currency = { sign: user?.currency_sign };
	const [images, setImages] = useState([]);
	const [imagePreview, setImagePreview] = useState([]);
	const [modal, setModal] = useState(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location2 = useLocation();
	const minLimit = 1;
	const validationArr = () => {
		return (
			(location2?.pathname === '/create-classified' ||
				location2?.pathname === '/update-classified') && [
				[values.title, ValidationTypes.Empty, t('Please Enter Title')],
				[values.description, ValidationTypes.Empty, t('Please Enter Description')],
				[values.price_type, ValidationTypes.Empty, t('Please select price type')],
				[values.price, ValidationTypes.Empty, t('Please Enter Price')],
				[
					values?.price,
					ValidationTypes.NumberNotNegative,
					t('Please enter a valid price'),
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
					values.contact_phone,
					ValidationTypes.Empty,
					t('Please enter Phone Number'),
				],
				[values.contact_email, ValidationTypes.Empty, t('Please Enter Email')],
				[values.location, ValidationTypes.Empty, t('Please Enter Location')],
				[values.city, ValidationTypes.Empty, t('Please Enter City')],
				[values.state, ValidationTypes.Empty, t('Please Enter State')],
				[values.country, ValidationTypes.Empty, t('Please Enter Country')],
				[values.zipcode, ValidationTypes.Empty, t('Please Enter Zip Code')],
				[images, ValidationTypes.Empty, t('Please add images')],
				[values.expiry_date, ValidationTypes.Empty, t('Please Enter Expiry Date')],
			]
		);
	};

	// console.log('check',t('Please Enter Title'));

	useEffect(() => {
		// for new creation
		if (location2?.pathname === '/create-classified') {
			setValues((values) => ({
				...values,
				price_type: 'monthly',
			}));
		}

		// for existing data and edit details
		if (location2?.pathname === '/update-classified') {
			setValues((values) => ({
				...values,
				title: extistingData?.title,
				description: extistingData?.description,
				category: extistingData?.category,
				price: extistingData?.price,
				contact_phone: extistingData?.contact_phone,
				contact_email: extistingData?.contact_email,
				location: extistingData?.location_details?.location,
				latitude: extistingData?.location_details?.latitude,
				longitude: extistingData?.location_details?.longitude,
				city: extistingData?.location_details?.city,
				state: extistingData?.location_details?.state,
				country: extistingData?.location_details?.country,
				zipcode: extistingData?.location_details?.zipcode,
				price_type: extistingData?.price_type,
				expiry_date: extistingData?.expiry_date,
				pinned: extistingData?.pinned,
			}));
			setImages(extistingData?.images);
			setImagePreview(
				extistingData?.images?.map((item) => Endpoints.baseUrl + item?.image)
			);
		}
	}, [extistingData]);

	const addClassified = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
		let obj = new FormData();
		for (var key in values) {
			obj.append(key, values[key]);
		}
		if (images.length) {
			images.forEach((i) => {
				obj.append('images', i);
			});
		}

		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.addClassifieds, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				navigate(-1);
				setIsLoading(false);
			} else if (resp && resp.status && resp.go_to === 'payment') {
				setIsLoading(false);
				localStorage.setItem('classifiedform', JSON.stringify(values));
				await saveFilesLocalStorage('classifiedsImage', images);
				localStorage.setItem('paytype', 'classified');
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

	const updateClassified = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
		if (id)
			try {
				let obj = new FormData();
				for (var key in values) {
					obj.append(key, values[key]);
				}
				if (images.length) {
					images.map((i) => {
						obj.append('images', i);
					});
				}
				let resp = await FetchApi(Endpoints.updateClassified + id, obj);
				if (resp && resp.status) {
					ToastMessage.Success(resp.message);
					navigate(-1);
					setIsLoading(false);
				}
			} catch (e) {
				setIsLoading(false);
				if (e && e.response) {
					ToastMessage.Error(e.response.message);
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

		// if (validate) {
		// 	setPreviewModalData({
		// 		callingApi:
		// 			location2?.pathname === '/create-classified'
		// 				? addClassified
		// 				: location2?.pathname === '/update-classified'
		// 				? updateClassified
		// 				: null,
		// 		categoryType: 'preview-classifieds',
		// 		title: values?.title,
		// 		imagePreview: imagePreview,
		// 		expiryDate: values?.expiry_date,
		// 		description: values?.description,
		// 		city: values?.city,
		// 		state: values?.state,
		// 		country: values?.country,
		// 		monthlyPrice: values?.price,
		// 		contactEmail: values?.contact_email,
		// 		contactPhone: values?.contact_phone,
		// 	});
		// 	setIsCreatePreviewModalVisible(true);
		// }
		if (validate) {
			setModal(true);
			return;
		}
	};

	return (
		<div>
			<div>
				<div className='container py-4 border-top mb-3'>
					<div className='row justify-content-center'>
						<div className='col-lg-6 col-md-8 col-sm-10'>
							<h1 className='fs-30 text-gray1 pb-3 fs-sm-22'>
								{location2?.state?.editClassified
									? t('Update Classified')
									: t('Create Classified')}
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
										placeholder={t('Write full description of your classified')}
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
									setIsLoading={setIsLoading}
									minLimit={1}
									maxLimit={5}
								/>

								{classifiedCategory?.length ? (
									<div className='form-field mb-3 '>
										<label for='' className='pb-2'>
											{t('Choose Category')}
										</label>
										<Select
											value={classifiedCategory?.filter(
												(item) => item.id === values?.category
											)}
											name='category'
											options={classifiedCategory}
											placeholder={t("Select")}
											onChange={(e) => {
												handleChange('category', e?.id);
											}}
											isSearchable={true}
											getOptionValue={(option) => option.id}
											getOptionLabel={(option) => option.name}
										/>
									</div>
								) : null}

								<div className='mb-3'>
									<label for='' className='pb-2'>
										{t('Price')}
									</label>

									<div className='border rounded-10 d-flex align-items-center overflow-hidden'>
										<span className='border-0  col-2 d-flex justify-content-center'>
											{defined_currency?.sign}
										</span>
										<div className='input-box'>
											<input
												value={values.price}
												name='price'
												onChange={handleChange}
												type='text'
												className='border-0 w-75 border-start rounded-0'
												placeholder='00'
											/>
										</div>
									</div>
								</div>

								<div>
									<h3 className='fs-30 text-gray1 py-2 fs-sm-24'>{t('Add Location')}</h3>

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Location')}
										</label>
										<Autocomplete
											className='location'
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

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
										{t("Apartment/Street Address")} {t("(Optional)")}
										</label>
										<input 
										type='text' 
										placeholder={t('Address')}
										/>
									</div>

									<div className='row'>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{t('City')}
												</label>
												<input
													value={values.city}
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
													value={values.state}
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
													value={values.country}
													name='country'
													onChange={handleChange}
													type='text'
													placeholder={t('Enter Country')}
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{t('Zip Code')}
												</label>
												<input
													value={values.zipcode}
													name='zipcode'
													onChange={handleChange}
													type='text'
													placeholder={t('Enter zip code')}
												/>
											</div>
										</div>
									</div>

									<h3 className='fs-30 text-gray1 py-2 fs-sm-24'>
										{t('Contact Information')}
									</h3>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t('Email')}
									</label>
									<input
										value={values.contact_email}
										name='contact_email'
										onChange={handleChange}
										type='text'
										placeholder={t('Enter Email Address')}
									/>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t('Phone Number')}
									</label>
									{/* <input
										value={values.contact_phone}
										name='contact_phone'
										onChange={handleChange}
										type='tel'
										placeholder='Enter Phone Number'
									/> */}
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
										value={values.contact_phone}
										onChange={(value) => {
											handleChange('contact_phone', value);
										}}
									/>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t('Expiry Date')}
									</label>
									<input
										value={values.expiry_date}
										name='expiry_date'
										onChange={handleChange}
										min={moment(new Date()).format('YYYY-MM-DD')}
										type='date'
										placeholder='Enter Expiry Date'
										className='custom-date'
									/>
								</div>

								<div className='mb-3 '>
									<input
										onClick={(e) => handleChange('pinned', e.target.checked)}
										checked={values?.pinned}
										name='pinned'
										type='checkbox'
										id='pinned'
										className='align-middle me-2'
									/>
									<label for=''>{t('Pin this classified to my profile')}</label>
								</div>

								<Link
									onClick={handleSubmit}
									className='button w-100 mt-4'
									data-bs-toggle={
										values?.title &&
										values?.description &&
										values?.price_type &&
										values?.price &&
										values?.contact_phone &&
										values?.contact_email &&
										values?.location &&
										values?.city &&
										values?.state &&
										values?.country &&
										values?.zipcode &&
										images?.length >= 1 &&
										values?.expiry_date
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
									<div className='col-lg-6'>
										<div className=' position-relative'>
											{imagePreview && <VerticalPreviewImage images={imagePreview} />}
										</div>
									</div>

									<div className='d-flex flex-column justify-content-between col-lg-6 py-3'>
										<div className='pb-2'>
											<span className='fs-14 fs-sm-10'>
												<img src='assets/img/icon/location1.svg' alt='' />
												{' ' + values?.city + ', ' + values?.state + ', ' + values?.country}
											</span>
										</div>
										<h3 className='fs-22 text-black fs-sm-18 pb-2'>{values?.title}</h3>
										<div className='d-flex align-items-center gap-lg-3  gap-2 deal-content-row '>
											<p className='m-0 fs-12 fs-sm-9'>
											{t('Posted') + ':'}{' '}{moment(new Date()).format('DD MMM YYYY')}
											</p>
											<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
												<p className='text-gray1 fs-sm-9 m-0'>{t('Expire in:')} </p>
												<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
												{moment(values?.expiry_date).format('DD MMM YYYY')}
											</div>
										</div>

										<div className='text-justify fs-12 light text-gray2 pb-2'>
											<p>{values?.description}</p>
										</div>

										<h3 className='medium fs-28 text-blue py-3'>
											{defined_currency?.sign}
											{parseInt(values?.price)?.toFixed?.(2)}
										</h3>
										<p className='text-black m-0 fs-12'>
											{t('Contact')} {user?.firstname} {t('For more details:')}
										</p>
										<p className='text-gray2 my-2 fs-12'>
											<img src='assets/img/icon/call.svg' width='15' className='me-2' />
											{values?.contact_phone}
										</p>
										<p className='text-gray2 m-0 fs-12'>
											<img src='assets/img/icon/mail.svg' width='15' className='me-2' />
											{values?.contact_email}
										</p>

										<div className='d-flex align-items-center justify-content-betweeon gap-lg-3 gap-md-2 gap-1 pt-4'>
											<span className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img
													src='assets/img/icon/wish.svg'
													width='20'
													className='icon-blue'
												/>
											</span>

											<span className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img src='assets/img/icon/share2.svg' width='25' className='' />
											</span>
											<span className='bg-red job-share rounded-10  d-flex align-items-center justify-content-center'>
												<img src='assets/img/icon/flag1.svg' width='14' className='' />
											</span>
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
										data-bs-dismiss='modal'
										onClick={(e) => {
											location2?.pathname === '/create-classified' && addClassified();
											location2?.pathname === '/update-classified' && updateClassified();
										}}
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

export default CreateClassifiedsLisitng;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import { getLoggedInUser, setCookie } from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import Autocomplete from 'react-google-autocomplete';
import ProfileNgobox from '../CommonProfile/ProfileNgoBox';
import LoadingSpinner from '../Loader';
import { imageCompressor } from '../../helpers/imageHelper';
import Select from 'react-select';
import { BlobToFileConverter } from '../../helpers/fileHelper';
import {
	UrlArrayChecker,
	UrlHttpsChecker,
	removeHttpAndHttps,
} from '../../helpers';
import ChangeCredentialScreen from '../ChangeCredentialScreen';

function CommonProfileSetup({
	imgPreview,
	setImgPreview,
	profileData,
	values,
	setValues,
	userType,
	email,
	contact,
	isProfileNgobox,
	getProfileDetails,
	businessCategory,
	deliveryPartnerData,
	categoryList,
}) {
	const [ischangeCredVisible, setIschangeCredVisible] = useState(false);
	const [changeType, setChangeType] = useState('');
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const { t, i18n } = useTranslation();

	const updateProfile = async () => {
		let ValidationArr = [
			// [values.cover_pic, ValidationTypes.Empty, t("Please add Cover Picture")],
			// [values.image, ValidationTypes.Empty, t("Please add Profile Picture")],
			[
				values.about,
				ValidationTypes.Empty,
				t('Please enter something in About field'),
			],
			[values.location, ValidationTypes.Empty, t('Please Enter Location')],
			[values.city, ValidationTypes.Empty, t('Please Enter City')],
			[values.state, ValidationTypes.Empty, t('Please Enter State')],
			[values.country, ValidationTypes.Empty, t('Please Enter Country')],
			[values.zipcode, ValidationTypes.Empty, t('Please Enter Zip Code')],
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
		for (var key in copyValues) {
			obj.append(key, copyValues[key]);
		}
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.updateProfile, obj);
			if (resp && resp.status) {
				ToastMessage.Success('Profile added successfully.'); //resp.message);
				setCookie('p_setup', resp.data);
				if (window.location.pathname.includes('user-profile')) {
					navigate('/user-profile-user-view', { replace: true });
				} else if (window.location.pathname.includes('business-profile')) {
					navigate('/business-profile-business-view', { replace: true });
				} else if (window.location.pathname.includes('news')) {
					navigate('/news-agency-profile-view', { replace: true });
				} else if (window.location.pathname.includes('ngo')) {
					navigate('/ngo-profile-ngo-view', { replace: true });
				}
				// navigate('/landing', { replace: true });
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);

			console.log('error', e);
		}
	};

	const handleChange = (event) => {
		if (event.persist) event.persist();
		setValues((values) => ({
			...values,
			[event?.target?.name]: event?.target?.value,
		}));
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

	const handleMenu = (e) => {
		if (e.target.files.length) {
			setValues({
				...values,
				[e?.target?.name]: e?.target?.files?.[0],
			});
		}
	};
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
												name='image'
												onChange={handleImage}
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
									<div className='col-lg-10 col-md-9 col-8 pt-md-4 pt-2'>
										<div className='d-md-flex align-items-start w-100 justify-content-between'>
											<div className='d-flex gap-2 align-items-start'>
												{profileData?.plan?.name && profileData?.plan?.name !== 'Basic' &&
												profileData?.plan?.name !== 'Free' && (
													<img
														src={'assets/img/favicon.svg'}
														className='me-md-2 me-1 profile-site-logo'
														width='27'
														alt=''
													/>
												)}

												<div className=''>
													<h3 className='fs-26 medium text-blue pb-md-0 pb-2 fs-sm-18'>
														{profileData?.fullname ||
															profileData?.name ||
															profileData?.firstname}
													</h3>
													<span className='text-gray2 fs-sm-12 py-1 d-block'>
														{userType === 'member'
															? (profileData?.plan?.name === 'Basic' || profileData?.plan?.name === 'Free')
																? t('Member')
																: t('Club Member')
															: (userType=="NGO"? t("NGO"): userType)}
													</span>
													{(profileData?.plan?.name === 'Basic' || 
													profileData?.plan?.name === 'Free') && (
														<Link
															to={
																profileData?.user_type && profileData?.user_type === 'Business'
																	? '/business-plan'
																	: profileData?.user_type === 'Member'
																	? '/user-plan'
																	: ''
															}
															className='button'
														>
															{t('Switch to paid account')}
														</Link>
													)}
												</div>
											</div>
											{isProfileNgobox && (
												<ProfileNgobox
													user={profileData}
													profileData={profileData}
													getProfileDetails={getProfileDetails}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='container border-top py-4'>
							<div className='row justify-content-center'>
								<div className='col-lg-6 col-md-8'>
									<h1 className='fs-30 text-gray1 pb-2 fs-sm-24'>
										{t('Basic Information')}
									</h1>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											updateProfile();
										}}
										action=''
										className='site-form py-md-2 profile-setup-form'
									>
										{userType === 'member' ? (
											<>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('First Name')}
													</label>
													<input
														value={values?.firstname}
														onChange={handleChange}
														name='firstname'
														type='text'
														placeholder='first name'
													/>
												</div>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('Last Name')}
													</label>
													<input
														value={values?.lastname}
														onChange={handleChange}
														name='lastname'
														type='text'
														placeholder='last name'
													/>
												</div>
											</>
										) : (
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{userType=="NGO"? t("NGO"): userType} {t('Name')}
												</label>
												<input
													value={values?.name}
													onChange={handleChange}
													name='name'
													type='text'
													placeholder='name'
												/>
											</div>
										)}
										<div className='form-field mb-3 position-relative'>
											<label for='' className='pb-2'>
												{t('About')}
											</label>
											<div id='about-profile-'>
												<textarea
													style={{
														border: 'none',
													}}
													value={values.about}
													onChange={handleChange}
													name='about'
													cols='10'
													rows='4'
													id='the-textarea-'
													maxlength='300'
													placeholder='Write few lines about yourself'
													autofocus
												></textarea>
												<div
													style={{
														textAlign: 'right',
													}}
													// id='the-count'
													className='fs-14 text-gray2 light'
												>
													<span id='current'>{values?.about?.length}</span>
													<span id='maximum'>/ 300</span>
												</div>
											</div>
										</div>
										{userType === 'NGO' ? (
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{userType === 'NGO' ? t('NGO Category') : null}
												</label>
												<select
													value={values?.user_type_category}
													onChange={handleChange}
													name='user_type_category'
												>
													<option value=''>
														{t('Select')} {t('category')}
													</option>
													{categoryList?.map((item, index) => {
														return (
															<option key={index} value={item?.id}>
																{item?.name}
															</option>
														);
													})}
												</select>
											</div>
										) : null}
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>
												{t('Contact Number')}
											</label>
											<input value={contact} type='tel' className='bg-gray' />
											<span
												onClick={() => {
													setIschangeCredVisible(true);
													setChangeType('phone');
												}}
												className='light fs-14 text-blue pt-1 selectContainer'
											>
												{t('Change phone number')}
											</span>
										</div>

										<div className='form-field mb-3'>
											<label for='' className='pb-2'>
												{t('Email Address')}
											</label>
											<input value={email} type='email' className='bg-gray' />
											<span
												onClick={() => {
													setIschangeCredVisible(true);
													setChangeType('new_email');
												}}
												className='light fs-14 text-blue pt-1 selectContainer'
											>
												{t('Change email address')}
											</span>
										</div>

										{userType === 'member' ? null : (
											<div className='form-field mb-3'>
												<label for='' className='pb-2'>
													{t('Website URL')}
												</label>
												<input
													value={values.website_url}
													onChange={handleChange}
													name='website_url'
													type='text'
													placeholder='https://www.domainname.com'
												/>
												<h6 className='fs-14 light pt-1'>
													{t('If you don’t have a website wix.com will provide you with one for free')}{' '}
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
										)}

										<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>
											{t('Add Location')}
										</h2>
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
											<label for='' className='pb-2'>
											{t("Apartment/Street Address")} {t("(Optional)")}
											</label>
											<input
												value={values.address}
												onChange={handleChange}
												name='address'
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
														onChange={handleChange}
														name='city'
														type='text'
														placeholder='Enter City'
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
														onChange={handleChange}
														name='state'
														handleChange
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
														onChange={handleChange}
														name='country'
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
														value={values.zipcode}
														onChange={handleChange}
														name='zipcode'
														type='text'
														placeholder='Enter zip code'
													/>
												</div>
											</div>
										</div>

										<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>
											{t('Add Social Accounts ')}{' '}
											<span className='fs-16'>{t('(Optional)')}</span>
										</h2>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>
												{t('Facebook')}
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
											<label for='' className='pb-2'>
												{t('Twitter')}
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
											<label for='' className='pb-2'>
												{t('Instagram')}
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
											<label for='' className='pb-2'>
												{t('Youtube')}
											</label>
											<div class='input-group flex-nowrap mb-3'>
												<input
													name='youtube_url'
													value={values.youtube_url}
													onChange={handleChange}
													type='text'
												/>
											</div>
										</div>

										{businessCategory == 3 && (
											<div>
												<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>
													{t('Add Menu')}
												</h2>
												<div className='form-field mb-3'>
													<label for='' className='pb-2'>
														{t('Menu PDF')}
													</label>
													<input
														placeholder='Upload PDF'
														accept='.pdf, .txt'
														value={values.menu}
														onChange={handleMenu}
														name='menu'
														type='file'
														// className="d-none"
														className='upload-file text-gray2 rounded-10 fs-14 light medium w-100 text-center'
														id='file'
													/>

													{/* <label for="file" className="upload-file text-gray2 rounded-10 fs-14 light medium w-100 text-center">
                                    Upload PDF
                                </label> */}
												</div>
												<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>
													{t('Add Delivery Partners')}
												</h2>
												<div className='form-field mb-3'>
													<Select
														value={values.delivery_partner}
														onChange={handleChange}
														name='delivery_partner'
														placeholder={'Select'}
														isMulti
														options={deliveryPartnerData}
														getOptionValue={(option) => option.id}
														getOptionLabel={(e) => e?.name}
													/>
												</div>
											</div>
										)}
										<button className='button w-100 rounded-10 mt-4'>
											{t('Continue')}
										</button>
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
				<CustomFooter internal />
			</div>
		</>
	);
}

export default CommonProfileSetup;

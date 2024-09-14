import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ValidateList, ValidationTypes } from '../../../Utils/ValidationHelper';
import { Endpoints } from '../../../API/Endpoints';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import CommonMultiImageUploader from '../../CommonMultiImageUploader';
import useModalContext from '../../../context/modalContext';
import Select from 'react-select';
import { saveFilesLocalStorage } from '../../../helpers/fileHelper';
import { UrlArrayChecker, getLoggedInUser, setCookie } from '../../../helpers';
import OnlineOfflineIcon from '../../CommonUiComponents/online_offline';

function CreateWeeklyDealListing({
	id,
	handleChange,
	handleRadio,
	extistingData,
	values,
	setValues,
	setIsLoading,
}) {
	const user = getLoggedInUser();
	const defined_currency = { sign: user?.currency_sign };
	const [showOnlineOption, setShowOnlineOption] = useState(false);
	const [images, setImages] = useState([]);
	const [imagePreview, setImagePreview] = useState('');
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location2 = useLocation();

	const minLimit = 1;

	const radioData = values?.online_supported
		? [
				{ title: 'Online', data: 'online' },
				{ title: 'Offline', data: 'offline' },
				{ title: 'Online-Offline', data: 'online_offline' },
		  ]
		: [{ title: 'Offline', data: 'offline' }];

	const validationArr = () => {
		return (
			(location2?.pathname === '/update-listing-weekly' ||
				location2?.pathname === '/create-weekly-deal') && [
				[values.title, ValidationTypes.Empty, t('Please Enter Title')],
				[values.description, ValidationTypes.Empty, t('Please Enter Description')],
				[values.actual_price, ValidationTypes.Empty, t('Please enter price')],
				[
					values.actual_price,
					ValidationTypes.NumberNotNegative,
					t('Please enter a valid price'),
				],
				[values.deal_type, ValidationTypes.Empty, t('Please select deal type')],
				[
					values.free_member_discount_type,
					ValidationTypes.Empty,
					t('Please select free member discount type'),
				],
				[
					values.free_member_discount_value,
					ValidationTypes.Empty,
					t('Please enter free member discount value'),
				],
				[
					values.free_member_discount_value,
					ValidationTypes.NumberNotNegative,
					t('Please enter a valid free member discount value'),
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
					values.free_member_code,
					ValidationTypes.Empty,
					t('Please enter free member discount code'),
				],
				[images, ValidationTypes.Empty, t('Please upload images')],
			]
		);
	};

	useEffect(() => {
		// for new creation
		if (location2?.pathname === '/create-weekly-deal') {
			setValues((values) => ({
				...values,
				expiry_date: moment(new Date()).add(7, 'days').format('YYYY-MM-DD'),
			}));
		}

		// for existing data and edit details
		if (location2?.pathname === '/update-listing-weekly') {
			setValues((values) => ({
				...values,
				title: extistingData?.title,
				description: extistingData?.description,
				actual_price: extistingData?.actual_price,
				deal_type: extistingData?.deal_type,
				free_member_discount_type: extistingData?.free_member_discount_type,
				free_member_discount_value: extistingData?.free_member_discount_value,
				free_member_code: extistingData?.free_member_code,
				expiry_date: extistingData?.expiry_date,
				online_supported: extistingData?.online_supported ?? '',
				weekly: true,
				redemption_link: extistingData?.redemption_link || ''
			}));
			setImages(extistingData?.images);
			setImagePreview(
				extistingData?.images?.map((item) => Endpoints.baseUrl + item?.image)
			);
		}
	}, [extistingData]);

	const addWeeklyDeal = async () => {
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
		obj.append('weekly', true);
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.addDeal, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				navigate('/weekly-listing');
				setIsLoading(false);
			} else if (resp && resp.status && resp.go_to === 'payment') {
				setIsLoading(false);
				localStorage.setItem(
					'dealObj',
					JSON.stringify({ ...values, weekly: true })
				);
				await saveFilesLocalStorage('dealsImage', images);
				localStorage.setItem('paytype', 'weekly-deal');
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

	const updateWeeklyDeal = async () => {
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
				let obj = new FormData();
				for (var key in values) {
					obj.append(key, values[key]);
				}
				if (images.length) {
					images.map((i) => {
						obj.append('images', i);
					});
				}
				let resp = await FetchApi(Endpoints.updateDeal + id, obj);
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
		// e.preventDefault();
		if (images?.length < minLimit || imagePreview?.length < minLimit) {
			ToastMessage.Error(`${t("Please upload more than")} ${minLimit} ${t("Images")}`);
			return;
		}

		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
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
								{location2?.pathname === '/create-weekly-deal'
									? t('Create Weekly Deal')
									: t('Update Weekly Deal')}
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
										placeholder={t('Write about your full description of your listing')}
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
									maxLimit={1}
								/>

								<div className='mb-3'>
									<label for='' className='pb-2'>
										{t("Online Deal Support")}
									</label>
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
											{radioData?.map((item) => {
												return (
													<div className='custom-radio  d-flex gap-1 align-content-center'>
														<input
															type='radio'
															name='deal_type'
															onClick={(event) => {
																handleRadio(event, item?.data);
															}}
															checked={values?.deal_type === item?.data ? true : false}
														/>
														<label for={item?.data} className='medium text-center '>
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
								<div>
									<h3 className='py-2 fs-22 fs-sm-18 mb-2'>
										{t('Coupon/Deal Code for All Member')}
									</h3>

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Discount Type')}
										</label>

										<div className='d-flex gap-4'>
											<div className='discount-radio'>
												<input
													onClick={(event) => {
														handleRadio(event, 'fixed');
													}}
													checked={
														values?.free_member_discount_type === 'fixed' ? true : false
													}
													type='radio'
													name='free_member_discount_type'
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
													onClick={(event) => {
														handleRadio(event, 'percentage');
													}}
													type='radio'
													checked={
														values?.free_member_discount_type === 'percentage' ? true : false
													}
													name='free_member_discount_type'
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
											type='number'
											max={'100'}
											placeholder='00'
										/>
									</div>

									<div className='mb-3'>
										<label for='' className='pb-2'>
											{t('Coupon/Deal Code')}
										</label>
										<div className='border rounded-10 d-flex align-items-center overflow-hidden'>
											<div
												onClick={(e) => {
													e.preventDefault();
													handleChange(
														'free_member_code',
														Math.random()?.toString(36)?.toUpperCase()?.substring(2, 8)
													);
												}}
											>
												<label for='' className='text-blue px-3 selectContainer'>
													{t('Generate code')}
												</label>
											</div>
											<input
												value={values?.free_member_code}
												name='free_member_code'
												onChange={handleChange}
												type='text'
												className='border-0 w-75 border-start rounded-0'
												placeholder='ABC123'
											/>
										</div>
									</div>
								</div>

								<Link
									onClick={handleSubmit}
									className='button w-100 mt-4'
									data-bs-toggle={
										values?.title &&
										values?.description &&
										values?.actual_price &&
										values?.deal_type &&
										values?.free_member_discount_type &&
										values?.free_member_discount_value &&
										values?.free_member_code &&
										images?.length == 1
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
								<div className='row m-0 py-3 border-bottom'>
									<div class='col-lg-5'>
										<div
											class='weekly-deal-left position-relative'
											style={{
												height: '100%',
											}}
										>
											<img
												style={{
													height: '100%',
												}}
												src={imagePreview?.[0]}
												alt=''
											/>

											<div class='position-absolute start-0 top-0 h-100 d-flex flex-column align-items-center justify-content-center text-center py-3 px-2'>
												<h4 class='bold text-white fs-sm-24'>
													{values?.free_member_discount_type === 'fixed'
														? 'Flat ' + values?.free_member_discount_value + ' ' + t("OFF")
														: values?.free_member_discount_value + '% ' + t("OFF")}
												</h4>
												<p class='m-0 text-white fs-30 light py-2 fs-sm-18'>
													{values?.title}
												</p>
											</div>
										</div>
									</div>

									<div className='col-lg-7 pt-lg-0 pt-4'>
										<div className='d-flex align-items-center gap-lg-3  gap-2 pb-2 deal-content-row pb-3'>
											<span className='redeem-btn fs-14'>
												<img src='assets/img/icon/deal-redeemed.svg' /> 0 {t("Redeemed")}
											</span>
											<p className='m-0 fs-12 fs-sm-9'>
												{t('Posted') + ':'} {moment(new Date()).format('DD MMM YYYY')}
											</p>
											<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
												<p className='text-gray1 fs-sm-9 m-0'>{t('Expire in:')} </p>
												<img src='assets/img/icon/timer2.svg' className='mx-1' width='14' />
												{values?.expiry_date
													? moment(values?.expiry_date).format('DD MMM YYYY')
													: '7 days'}
											</div>
										</div>

										<h3 className='fs-22 text-black fs-sm-16 pb-2'>{values?.title}</h3>
										<div className='text-justify fs-12 light text-gray2 pb-2'>
											<p>{values?.description}</p>
										</div>
										<OnlineOfflineIcon deal_type={values?.deal_type} />

										<div className='rounded-10 bg-blue py-lg-4 py-lg-4 p-3 d-flex align-items-center justify-content-center gap-2'>
											<span className='medium text-gray1 fs-18 fs-sm-14'>
												{t('All Members')}
											</span>
											<span className='medium text-blue fs-30 fs-sm-18'>
												{values?.free_member_discount_type === 'fixed'
													? 'Flat ' + values?.free_member_discount_value + ' ' + t("OFF")
													: values?.free_member_discount_value + '% ' + t("OFF")}
											</span>
											<del className='medium text-gray1 fs-18 fs-sm-12'>
												{defined_currency?.sign}
												{parseInt(values?.actual_price)?.toFixed(2)}
											</del>
											<ins className='medium text-blue fs-18 text-decoration-none fs-sm-12'>
												{defined_currency?.sign}
												{values?.free_member_discount_type == 'fixed'
													? (
															parseInt(values?.actual_price) -
															values?.free_member_discount_value
													  ).toFixed(2)
													: (
															parseInt(values?.actual_price) -
															values?.actual_price * (values?.free_member_discount_value / 100)
													  ).toFixed(2)}
											</ins>
										</div>

										<div className='d-flex align-items-center justify-content-betweeon gap-lg-3 gap-md-2 gap-1 pt-2'>
											<span className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img
													alt=''
													src='assets/img/icon/wish.svg'
													width='20'
													className='icon-blue'
												/>
											</span>
											<span
												className='button w-100 fs-18 fs-sm-14 rounded-10 py-3 text-center text-white'
												data-bs-toggle='modal'
												data-bs-target='#redeem'
											>
												{t('Redeem')}
											</span>

											<span className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'>
												<img
													alt=''
													src='assets/img/icon/share2.svg'
													width='25'
													className=''
												/>
											</span>
											<span className='bg-red job-share rounded-10  d-flex align-items-center justify-content-center'>
												<img
													alt=''
													src='assets/img/icon/flag1.svg'
													width='14'
													className=''
												/>
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
										onClick={(e) => {
											location2?.pathname === '/create-weekly-deal' && addWeeklyDeal();
											location2?.pathname === '/update-listing-weekly' &&
												updateWeeklyDeal();
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

export default CreateWeeklyDealListing;

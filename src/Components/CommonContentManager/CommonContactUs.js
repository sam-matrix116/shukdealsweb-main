import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';
import { RenderHTMLstring } from '../../helpers/htmlHelper';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
// import PhoneInput from 'react-phone-input-international';
// import startsWith from 'lodash.startswith';
import { PhoneInput } from 'react-international-phone';

function CommonContactUs() {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [isLoading, setIsLoading] = useState();
	const [data, setData] = useState();
	const [values, setValues] = useState({});
	const sidePanelData = [
		{
			title: 'Get In Touch',
			image: 'assets/img/icon/location.svg',
			description:
				'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
		},
		{
			title: 'Working Hours',
			image: 'assets/img/icon/clock.svg',
			description: '09:00 AM to 06:00 PM',
		},
		{
			title: 'Connect',
			image: 'assets/img/icon/closedEmail.svg',
			description: 'info@shukdeal.com',
		},
	];
	let validationArr = [
		[values?.name, ValidationTypes.Empty, t('Name is required')],
		[values?.phone, ValidationTypes.Empty, t('Phone Number is required')],
		[values?.email, ValidationTypes.Empty, t('Email is required')],
		[values?.message, ValidationTypes.Empty, t('Message is required')],
	];

	const getTermsConditionsDetails = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getPrivacyPolicy);
			if (resp && resp.status) {
				setData(resp);
				setIsLoading(false);
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const handleChange = (event, data) => {
		// if (event.persist) event.persist();
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
	const handleSubmit = async (e) => {
		e.preventDefault();
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}

		try {
			let resp = await FetchApi(Endpoints.getContactUs, values);
			// console.log({ resp });
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				// setValues({});
				window.location.reload();
			} else if (resp && !resp.status) {
				ToastMessage.Error(resp.message);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	useEffect(() => {
		getTermsConditionsDetails();
	}, []);
	return (
		<div className='referral-box'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className='main py-5'>
					<h1 className='col-5 col-md-4 col-lg-3 m-auto text-center text-gray1  border-bottom fs-30 medium pb-2'>
						{t("Contact Us")}
					</h1>
					<div className='container w-100 border-bottom d-flex flex-column flex-md-row justify-content-center align-content-start gap-5 py-5'>
						<div className='flex-1 d-flex flex-column w-100 '>
							<h5 className='text-gray1 text-start  medium py-2'>{t("Send Us a Message")}</h5>
							<form
								onSubmit={handleSubmit}
								action=''
								className='site-form gray-container w-100 p-4 rounded-15'
							>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t("Name")}
									</label>
									<div class='input-group flex-nowrap mb-3'>
										<input
											value={values?.name}
											name='name'
											onChange={handleChange}
											type='text'
											placeholder={t('Enter Name')}
										/>
									</div>
								</div>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t("Email")}
									</label>
									<div class='input-group flex-nowrap mb-3'>
										<input
											name='email'
											value={values?.email}
											onChange={handleChange}
											type='text'
											placeholder={t('Enter Email Address')}
										/>
									</div>
								</div>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t("Phone Number")}
									</label>
									<div class='input-group flex-nowrap mb-3'>
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
											// containerStyle={{
											// 	backgroundColor: 'white',
											// }}
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
											placeholder={t('Enter phone number')}
											value={values?.phone}
											onChange={(value) => {
												handleChange('phone', value);
											}}
										/>
									</div>
								</div>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										{t("Message")}
									</label>
									<div class='input-group flex-nowrap mb-3'>
										<textarea
											name='message'
											value={values?.message}
											onChange={handleChange}
											type='text'
											cols='10'
											rows='4'
											id='the-textarea'
											maxlength='300'
											placeholder={t('Write message')}
										/>
									</div>
								</div>

								<button type='submit' className='button w-25 rounded-10'>
									{t("Submit")}
								</button>
							</form>
						</div>
						<div className='flex-1 w-100  py-2'>
							{sidePanelData?.map((item) => (
								<div className=' d-flex flex-column gap-2 mb-5'>
									<h5 className='text-gray1 medium'>{t(item?.title)}</h5>
									{item?.title === 'Connect' ? (
										<div className='d-flex gap-3 align-items-center px-2 text-black'>
											<img
												src={item?.image}
												style={{ height: '35px', width: '35px' }}
												alt='shukDeals'
											/>
											<a
												href={`mailto:${item?.description}`}
												style={{
													color: '#3B618B !important',
												}}
											>
												{item?.description}
											</a>
										</div>
									) : (
										<span className={`d-flex gap-3 align-items-center px-2 text-gray2`}>
											<img
												src={item?.image}
												style={{ height: '35px', width: '35px' }}
												alt='shukDeals'
											/>
											{item?.description}
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<CustomFooter />
		</div>
	);
}

export default CommonContactUs;

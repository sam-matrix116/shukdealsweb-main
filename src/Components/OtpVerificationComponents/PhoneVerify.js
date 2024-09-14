import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import { useTranslation } from 'react-i18next';
import OTPInput from 'react-otp-input';
import ResendTimer from '../../Components/OtpVerificationComponents/ResendTimer';
// import startsWith from 'lodash.startswith';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
import { setCookie } from '../../helpers/authUtils';

function PhoneVerify({ sendPhoneOtp }) {
	const [newPhone, setNewPhone] = useState('');
	const stateData = JSON.parse(localStorage.getItem('verifydetails'));
	const [updatePhoneIntent, setUpdatePhoneIntent] = useState(false);
	const [otp, setOtp] = useState('');

	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			sessionStorage.setItem('user', JSON.stringify(resp.data));
			setCookie('header_dp', URL?.createObjectURL(resp?.data?.image));
			// setCookie('user', resp.data);
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const verify = async () => {
		let obj = newPhone
			? {
					phone: stateData?.phone,
					change_phone: newPhone,
					otp: otp,
			  }
			: {
					phone: stateData?.phone,
					otp: otp,
			  };
		try {
			let resp = await FetchApi(Endpoints.registerVerifyPhoneOtp, obj);
			if (resp && resp.status) {
				console.log({ resp });
				ToastMessage.Success(resp.message);
				if (resp.token) setCookie('token', resp.token);
				setCookie('refreshToken', resp.refresh);
				setCookie('tempToken', resp.tempToken);
				if (resp.token) getProfileDetails();

				if (stateData?.memberShip === 'ngo') {
					navigate('/ngo-profile-setup', { replace: true });
				} else if (stateData?.memberShip === 'news_agency') {
					navigate('/news-profile-setup', { replace: true });
				} else if (stateData?.memberShip === 'business') {
					navigate({
						pathname: '/business-plan',
						search: `?user_type=${stateData?.memberShip}`,
					});
				} else if (stateData?.memberShip === 'member') {
					navigate({
						pathname: '/user-plan',
						search: `?user_type=${stateData?.memberShip}`,
					});
				}
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const resendPhoneOtp = async () => {
		if (newPhone) sendPhoneOtp(newPhone);
		else sendPhoneOtp();
	};

	const handlePhoneUpdate = (e) => {
		e.preventDefault();
		if (!newPhone) {
			ToastMessage.Error(t('Please enter a new number'));
			return;
		}
		sendPhoneOtp(newPhone);
		setUpdatePhoneIntent(false);
	};
	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		if (otp.length != 6) {
			ToastMessage.Error(t('Please enter valid OTP'));
			return;
		}
		verify();
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (otp?.length == 6) {
			handleSubmit();
		}
	}, [otp]);

	return (
		<div>
			<div className='wrapper position-relative'>
				<div className='header2 py-md-4 py-3 position-absolute top-0 start-0 w-100'>
					<div className='container py-md-3 py-lg-4'>
						<div className='row'>
							<div className='col-12 text-center'>
								<div className='site-logo'>
									<div>
										<img src='assets/img/site-logo.svg' alt='shukDeals' />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='main main-login'>
					<div className='container '>
						<div className='row justify-content-center'>
							<div className='col-lg-6 col-md-8 col-sm-10 col-12 signup-mid-column pt-5'>
								<div className='px-lg-5 px-sm-3 text-center py-5 my-md-5'>
									<h1 className='text-gray1 fs-34 medium pb-2 pt-md-3'>
										{t('Verify Your Phone Number')}
									</h1>
									{updatePhoneIntent && (
										<form
											onSubmit={handlePhoneUpdate}
											className=' d-flex flex-column my-5 px-5 gap-2'
										>
											<label for='' className='pb-2'>
												{t('Enter New Mobile Number')}
											</label>
											<div className='d-flex'>
												<div className='form-field d-flex align-items-center field-phone w-100'>
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
															border: 'transparent',
															borderTopRightRadius: 10,
															borderBottomRightRadius: 10,
															// paddingTop: '10px',
															// borderRadius: 10,
															marginInlineStart: (i18n.language=='he' || i18n.language=='ar')?'25px':'0px'
														}}
														placeholder='Enter phone number'
														value={newPhone}
														onChange={(value) => {
															setNewPhone(value);
														}}
														disabled={!updatePhoneIntent}
													/>
												</div>
											</div>
											<div>
												<button type='submit' className='button w-25 p-2 rounded-10 '>
													{t('Submit')}
												</button>
											</div>
										</form>
									)}
									{!updatePhoneIntent && (
										<p>
											{t('We have sent a 6 digit OTP to')}
											<a className='medium d-block text-gray1'>
												{newPhone ? newPhone : stateData?.phone}
											</a>
										</p>
									)}
									<form
										onSubmit={handleSubmit}
										action=''
										// className="site-form pt-2"
									>
										<OTPInput
											onChange={setOtp}
											value={otp}
											numInputs={6}
											inputType='tel'
											inputStyle={{
												backgroundColor: '#FFFFFF',
												borderWidth: '2px',
												borderColor: '#EAEAEA',
												borderStyle: 'solid',
												borderRadius: '8px',
												width: '100%',
												height: '100%',
												padding: '10px',
												marginLeft: '10px',
											}}
											containerStyle={{
												padding: '10px',
												// backgroundColor : 'red',
												justifyContent: 'space-between',
											}}
											renderSeparator={<span> </span>}
											renderInput={(props) => <input {...props} />}
										/>
										<div className='d-flex justify-content-between align-items-center text-center'>
											<Link
												className='resendButton'
												onClick={(e) => setUpdatePhoneIntent((value) => !value)}
												style={{
													fontSize: '16px',
													fontWeight: updatePhoneIntent ? 'normal' : 'bold',
												}}
											>
												{updatePhoneIntent && ` Don't`} {t("Update Number")}
											</Link>
											<ResendTimer callingApi={resendPhoneOtp} timerDuration={30} />
										</div>
										<button
											type='submit'
											className='button w-100 rounded-10'
											disabled={otp?.length === 6}
										>
											{t('Verify Phone')}
										</button>
									</form>

									{/* <div className='text-center pt-3'>
										<Link to={'/login'} replace className='medium d-block'>{t("Back")} to Login
										</Link>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				<CustomFooter />
			</div>
		</div>
	);
}

export default PhoneVerify;

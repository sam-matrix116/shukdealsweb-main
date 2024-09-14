import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import { useEffect } from 'react';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useState } from 'react';
import ToastMessage from '../../Utils/ToastMessage';
import { useTranslation } from 'react-i18next';
import OTPInput from 'react-otp-input';
import { setCookie } from '../../helpers/authUtils';
import ResendTimer from '../../Components/OtpVerificationComponents/ResendTimer';

function EmailVerify({ sendPhoneOtp }) {
	const [otp, setOtp] = useState('');
	const stateData = JSON.parse(localStorage.getItem('verifydetails'));
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const location = useLocation();

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			sessionStorage.setItem('user', JSON.stringify(resp.data));
			setCookie('header_dp', URL?.createObjectURL(resp?.data?.image));
			// setCookie('user', resp.data);
		}  catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const verify = async () => {
		let obj = {
			email: stateData?.email,
			otp: otp,
		};
		try {
			let resp = await FetchApi(Endpoints.verifyOtp, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				// setCookie('token', resp.token);
				// setCookie('refreshToken', resp.refresh);
				setCookie('tempToken', resp.tempToken);
				// getProfileDetails();
				sendPhoneOtp();
				if (!stateData?.forgot) navigate('/verify-phone', { replace: true });
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const verifyForgot = async () => {
		if (otp.length != 6) {
			ToastMessage.Error(t('Please enter valid OTP'));
			return;
		}
		let obj = {
			email: stateData?.email,
			code: otp,
		};
		try {
			let resp = await FetchApi(Endpoints.forgotVerifyCode, obj);
			if (resp && resp.status) {
				// ToastMessage.Success(resp.message);
				navigate('/new-password', {
					replace: true,
					state: { email: stateData?.email, code: otp },
				});
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const ResendOTP = async () => {
		let obj = {
			email: stateData?.email,
			usage: location?.state?.isForgot? "Forgot" : "Register"
		}
		try {
			let resp = await FetchApi(Endpoints.resendOtp, obj);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (err) {
			console.log('error', err);
			return;
		}
	};

	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		if (stateData?.forgot) {
			verifyForgot();
		} else {
			if (otp.length != 6) {
				ToastMessage.Error(t('Please enter valid OTP'));
				return;
			}
			verify();
		}
	};
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
									<h1 className='text-gray1 fs-34 medium pb-2 pt-md-3'>{t("Verify Your Email")}
									</h1>
									<p>
										{t("We have sent a 6 digit OTP to")}
										<a className='medium d-block text-gray1'>{stateData?.email}</a>
									</p>

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

										{/* <ResendTimer timerDuration={10} /> */}
										<button
											className='button w-100 rounded-10'
											disabled={otp?.length === 6}
										>{t("Verify Email")}
										</button>
									</form>

									<div className='text-center pt-3'>
										<Link 
										onClick={()=>{
											ResendOTP();
										}}
										className='medium d-block'>{t("Resend OTP")}
										</Link>
									</div>
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

export default EmailVerify;

import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import ToastMessage from '../../Utils/ToastMessage';
import { FetchApi } from '../../API/FetchApi';
import ResendTimer from '../OtpVerificationComponents/ResendTimer';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
import { Endpoints } from '../../API/Endpoints';
import { Link } from 'react-router-dom';
// import startsWith from 'lodash.startswith';

function CredentialChangeModal({ setIsmodalVisible, isModalVisible, data }) {
    const { t, i18n } = useTranslation();
	const [paramBoxView, setparamBoxView] = useState(true);
	const [paramData, setParamData] = useState('');
	const [otp, setOTP] = useState('');
	const [tempToken, setTempToken] = useState('');

	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	if (password) {
	// 		authenticateApi();
	// 		setIsmodalVisible(false);
	// 	} else {
	// 		ToastMessage.Error('Please enter the reason');
	// 	}
	// };

	const sendOtpApi = async () => {
		let obj = {
			tempToken: tempToken,
			[data?.name]: paramData,
		};
		try {
			let resp = await FetchApi(data?.sendOtpUrl, obj);
			if (resp && resp.status && resp.message) {
				ToastMessage.Success(resp.message);
				setTempToken(resp?.tempToken);
				setparamBoxView(false);
			} else {
				ToastMessage.Error(resp.message);
			}
		} catch (e) {
			ToastMessage.Error(e.message);
		}
	};


	const VerifyOtpApi = async () => {
		let obj = {
			tempToken: tempToken,
			otp: otp,
			[data?.name]: paramData,
		};
		try {
			let resp = await FetchApi(data?.verifyUrl, obj);
			if(resp && !resp.status){
				ToastMessage.Error(resp.message)
			}
			if (resp && resp.status) {
				resp.status
					? ToastMessage.Success(resp.message)
					: ToastMessage.Error(resp.message);
				setIsmodalVisible(false);
				setParamData('');
				window.location.reload();
			}
		} catch (e) {
			// console.log('e__', JSON.stringify(e.response.data,null, 4));
			if(e && e.response && e.response.data && e.response.data.message){
				ToastMessage.Error(e.response.data.message)
			}
		}
	};

	const ResendOTP = async () => {
		let obj = {
			new_email: paramData,
			usage: "Change Email"
		}
		try {
			let resp = await FetchApi(Endpoints.resendOtpChangeEmail, obj);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
				setTempToken(resp?.tempToken);
			}
		} catch (err) {
			console.log('error', err);
			return;
		}
	};
	return (
		<>
			{isModalVisible && (
				<div
					className='modal d-block submitted-modal'
					id='business_submitted'
					tabindex='-1'
					aria-labelledby='business_submitted'
					aria-hidden='true'
				>
					<div className='modal-dialog modal-dialog-centered mw-400'>
						<div className='modal-content rounded-20 border-0 '>
							{paramBoxView && (
								<div className='modal-body text-center py-4 px-md-5'>
									<span className='d-block text-blue fs-26'>
										<p>{t("Enter new")} {data?.title}</p>
									</span>
									<div className='form-field mb-4 mt-4'>
										{data?.name === 'new_email' ? (
											<input
												style={{
													borderRadius: '10px',
													borderWidth: '1px',
													// border: '1px',
													padding: '5px',
													borderStyle: 'solid',
													borderColor: 'gray',
												}}
												onChange={(e) => {
													setParamData(e.target.value);
												}}
												type={'email'}
												placeholder={`${t("Enter new")} ${" "} ${data?.title}`}
												// className="pwd-field px-2 py-1"
											/>
										) : data?.name === 'phone' ? (
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
												value={paramData}
												// onChange={setPhone}
												onChange={(value) => {
													setParamData(value);
												}}
											/>
										) : null}
									</div>
									<div className='row'>
										<button
											onClick={() => {
												sendOtpApi();
											}}
											className='button  rounded-10 px-4 py-2 col me-2'
										>{t("Submit")}
										</button>
										<button
											onClick={() => {
												setIsmodalVisible(false);
												data?.setStateBack(false);
											}}
											className='button rounded-10 px-4 py-2 col'
										>{t("Cancel")}
										</button>
									</div>
								</div>
							)}
							{!paramBoxView && (
								<div className='modal-body text-center py-4 px-md-5'>
									<span className='d-block text-blue fs-26'>
										<p>{t("Verify your")} {data?.title}</p>
									</span>
									<div className='form-field mb-4 mt-4'>
										<input
											style={{
												borderRadius: '10px',
												borderWidth: '1px',
												// border: '1px',
												padding: '5px',
												borderStyle: 'solid',
												borderColor: 'gray',
											}}
											onChange={(e) => {
												setOTP(e.target.value);
											}}
											placeholder='Enter OTP'
											type='number'
											inputmode='numeric'
											autocomplete='one-time-code'
										/>
										{data?.name === 'phone' ? (
											<ResendTimer callingApi={sendOtpApi} timerDuration={30} />
										) : null}
										{data?.name === 'new_email' ? (
											<div style={{
												textAlign: 'right'
											}} className='pt-3'>
											<Link
											onClick={()=>{
												ResendOTP();
											}}
											className='medium d-block'>{t("Resend OTP")}
											</Link>
										</div>
										) : null}
									</div>
									<div className='row'>
										<button
											onClick={() => {
												VerifyOtpApi();
											}}
											className='button rounded-10 px-4 py-2 col me-2'
										>{t("Submit")}
										</button>
										<button
											onClick={() => {
												setparamBoxView(true);
											}}
											className='button rounded-10 px-4 py-2 col'
										>{t("Cancel")}
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default CredentialChangeModal;

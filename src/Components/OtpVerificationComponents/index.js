import React from 'react';
import { useTranslation } from 'react-i18next';
import EmailVerify from './EmailVerify';
import PhoneVerify from './PhoneVerify';
import { useLocation } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';

function OtpVerificationComponents() {
	const { t } = useTranslation();
	const location = useLocation();
	const stateData = JSON.parse(localStorage.getItem('verifydetails'));

	const sendPhoneOtp = async (newPhone) => {
		let obj = newPhone
			? {
					phone: stateData?.phone,
					change_phone: newPhone,
			  }
			: {
					phone: stateData?.phone,
			  };

		try {
			let resp = await FetchApi(Endpoints.registerSendPhoneOtp, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
			} else {
				ToastMessage.Error(resp.message);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};
	return (
		<>
			{location.pathname === '/verify-email' ? (
				<EmailVerify sendPhoneOtp={sendPhoneOtp} />
			) : location.pathname === '/verify-phone' ? (
				<PhoneVerify sendPhoneOtp={sendPhoneOtp} />
			) : null}
		</>
	);
}

export default OtpVerificationComponents;

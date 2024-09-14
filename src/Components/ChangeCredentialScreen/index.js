import React from 'react';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import { useState } from 'react';
import { Endpoints } from '../../API/Endpoints';
import useModalContext from '../../context/modalContext';

function ChangeCredentialScreen({ setIschangeCredVisible, changeType }) {
    const { t } = useTranslation();
	const {
		setIsAuthenticateModalVisible,
		setAuthenticateModalData,
		setIsCredentialChangeModalVisible,
		setCredentialChangeModalData,
	} = useModalContext();
	const [isAutehnticationComplete, setIsAutehnticationComplete] =
		useState(false);

	useEffect(() => {
		setIsAuthenticateModalVisible(true);
		setAuthenticateModalData((values) => ({
			...values,
			authenticateUrl: Endpoints.authenticatePassword,
			setStateBack: setIsAutehnticationComplete,
			setStateBack2: setIschangeCredVisible,
		}));
	}, []);

	useEffect(() => {
		if (isAutehnticationComplete) {
			setIsCredentialChangeModalVisible(true);
			setCredentialChangeModalData((values) => ({
				...values,
				title:
					changeType === 'new_email'
						? 'email'
						: changeType === 'phone'
						? 'phone'
						: null,
				name: changeType,
				sendOtpUrl:
					changeType === 'new_email'
						? Endpoints.changeEmail
						: changeType === 'phone'
						? Endpoints.sendPhoneOtp
						: null,
				verifyUrl:
					changeType === 'new_email'
						? Endpoints.verifyNewEmail
						: changeType === 'phone'
						? Endpoints.verifyPhoneOtp
						: null,
				setStateBack: setIschangeCredVisible,
			}));
		}
	}, [isAutehnticationComplete]);

	return <></>;
}

export default ChangeCredentialScreen;

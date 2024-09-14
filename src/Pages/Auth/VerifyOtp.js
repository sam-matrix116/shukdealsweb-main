import React from 'react';
import { useTranslation } from "react-i18next";
import OtpVerificationComponents from '../../Components/OtpVerificationComponents';

function VerifyOtp() {
    const { t } = useTranslation();
	return (
		<>
			<OtpVerificationComponents />
		</>
	);
}

export default VerifyOtp;

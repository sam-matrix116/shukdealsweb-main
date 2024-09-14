import React from 'react';
import { useTranslation } from "react-i18next";
import CommonAboutUs from './CommonAboutUs';
import CommonTermsConditions from './CommonTermsConditions';
import CommonSupport from './CommonSupport';
import CommonContactUs from './CommonContactUs';
import CommonPrivacyPolicy from './CommonPrivacyPolicy';
import CommonHelpCenter from './CommonHelpCenter';

function CommonContentManager({ contentType }) {
    const { t } = useTranslation();
	return (
		<div>
			{contentType === 'about-us' ? (
				<CommonAboutUs />
			) : contentType === 'help-center' ? (
				<CommonHelpCenter />
			) : contentType === 'terms-conditions' ? (
				<CommonTermsConditions />
			) : contentType === 'support' ? (
				<CommonSupport />
			) : contentType === 'contact-us' ? (
				<CommonContactUs />
			) : contentType === 'privacy-policy' ? (
				<CommonPrivacyPolicy />
			) : null}
		</div>
	);
}

export default CommonContentManager;

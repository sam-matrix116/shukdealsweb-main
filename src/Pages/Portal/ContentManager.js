import React from 'react';
import { useTranslation } from "react-i18next";
import CommonContentManager from '../../Components/CommonContentManager';
import { useLocation } from 'react-router-dom';

function ContentManager() {
    const { t } = useTranslation();
	const location = useLocation();
	const contentType =
		location.pathname === '/about-us'
			? 'about-us'
			: location.pathname === '/help-center'
			? 'help-center'
			: location.pathname === '/terms-conditions'
			? 'terms-conditions'
			: location.pathname === '/support'
			? 'support'
			: location.pathname === '/contact-us'
			? 'contact-us'
			: location.pathname === '/privacy-policy'
			? 'privacy-policy'
			: null;
	return <CommonContentManager contentType={contentType} />;
}

export default ContentManager;

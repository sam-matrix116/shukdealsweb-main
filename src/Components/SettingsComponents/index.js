import React from 'react';
import { useTranslation } from "react-i18next";
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';

function SettingsComponents({ activeTab }) {
    const { t } = useTranslation();
	return (
		<div>
			{activeTab === 'security' ? <SecuritySettings /> : null}
			{activeTab === 'account' ? <AccountSettings /> : null}
		</div>
	);
}

export default SettingsComponents;

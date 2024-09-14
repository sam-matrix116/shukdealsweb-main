import React, { useState, useEffect } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Link } from 'react-router-dom';
import SettingsComponents from '../../Components/SettingsComponents';
import { useTranslation } from 'react-i18next';
import { getLoggedInUser } from '../../helpers';

const Settings = () => {
	const {t} = useTranslation();
	const [activeTab, setActiveTab] = useState('security');
	const user = getLoggedInUser();

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<CustomHeader />

			<div className='container mt-5 '>
				<ul className='nav nav-tabs mb-4 text-black'>
					<li className='nav-item  selectContainer'>
						<h4
							className={`nav-link text-gray1 ${activeTab === 'security' ? 'active' : ''}`}
							onClick={() => handleTabChange('security')}
						>
							{t("Security")}
						</h4>
					</li>
					{!user?.is_store && <li className='nav-item selectContainer'>
						<h4
							className={`nav-link text-gray1 ${activeTab === 'account' ? 'active' : ''}`}
							onClick={() => handleTabChange('account')}
						>
							{t("Account")}
						</h4>
					</li>}
				</ul>
				<SettingsComponents activeTab={activeTab} />
			</div>

			{/* <CustomFooter /> */}
		</div>
	);
};

export default Settings;

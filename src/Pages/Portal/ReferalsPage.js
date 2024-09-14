import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import CustomHeader from '../../Components/CustomHeader';
import CommonProfile from '../../Components/CommonProfile';
import CustomFooter from '../../Components/CustomFooter';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { getUserToken } from '../../helpers/authUtils';
import ListHeader from '../../Components/ListingItems/UserListingHeader';
import CommonUsersListing from '../../Components/ListingItems/CommonUsersListing';
import CommonReferals from '../../Components/CommonReferals';

function ReferalsPage() {
    const { t } = useTranslation();
	const token = getUserToken();
	const path =
		window.location.pathname === '/deal-listing'
			? 'my-deals'
			: window.location.pathname === '/job-listing'
			? 'my-jobs'
			: window.location.pathname === '/classified-listing'
			? 'my-classifieds'
			: window.location.pathname === '/location-listing'
			? 'my-locations'
			: window.location.pathname === '/weekly-listing'
			? 'my-weekly'
			: null;
	const [searchText, setSearchText] = useState('');
	const [filter, setfilter] = useState('');
	const [profileData, setProfileData] = useState([]);

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (token) getProfileDetails();
	}, []);

	return (
		<div>
			<CustomHeader />
			<CommonProfile />
			<div className='container border-top py-4'>
				<CommonReferals referalType={'referal-ngo'}/>
			</div>
			<CustomFooter />
		</div>
	);
}

export default ReferalsPage;

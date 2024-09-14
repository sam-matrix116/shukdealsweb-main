import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useState } from 'react';
import { useEffect } from 'react';
import ClubMemberprofile from './profiles/ClubMemberprofile';
import BusinessProfile from './profiles/BusinessProfile';
import NgoProfile from './profiles/NgoProfile';
import NewAgencyProfile from './profiles/NewAgencyProfile';
import { connect } from 'react-redux';

function OthersProfile({ givenData, about, id, user, isRefresh }) {
	const { t } = useTranslation();
	const [profileData, setProfileData] = useState({});

	const getOtherProfile = async () => {
		try {
			let resp = await FetchApi(Endpoints.getOtherUserProfile + id);
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (id && !givenData) {
			getOtherProfile();
		} else if (givenData) {
			setProfileData(givenData);
		}
	}, [id, givenData, isRefresh]);

	return (
		<div>
			{user == 'member' && profileData?.user_type && (
				<ClubMemberprofile id={id} profileData={profileData} about={about} />
			)}

			{user === 'business' && profileData?.user_type && (
				<BusinessProfile id={id} profileData={profileData} about={about} />
			)}

			{(user == 'ngo' || user == 'Non Profitable Organization') && profileData?.user_type && (
				<NgoProfile id={id} profileData={profileData} about={about} />
			)}

			{user == 'news_agency' && profileData?.user_type && (
				<NewAgencyProfile id={id} profileData={profileData} about={about} />
			)}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		isRefresh: state.RefreshData.isRefresh,
	};
};
export default connect(mapStateToProps, {})(OthersProfile);

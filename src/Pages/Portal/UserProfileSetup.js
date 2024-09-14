/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "react-i18next";
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CommonProfileSetup from '../../Components/CommonProfileSetup';

function UserProfileSetup() {
    const { t } = useTranslation();
	const locationn = useLocation();
	const user = getLoggedInUser();
	const token = getUserToken();
	const [imgPreview, setImgPreview] = useState({});
	const [email, setEmail] = useState('');
	const [contact, setContact] = useState('');
	const [values, setValues] = useState({});
	const [profileData, setProfileData] = useState({});

	useEffect(() => {
		if (token) getProfileDetails();
	}, []);

	useEffect(() => {
		setValues({
			firstname: profileData?.firstname,
			lastname: profileData?.lastname,
			about: profileData?.about,
			facebook_url: profileData?.facebook_url || '',
			twitter_url: profileData?.twitter_url || '',
			instagram_url: profileData?.instagram_url || '',
			youtube_url: profileData?.youtube_url || '',
			location: profileData?.location?.location,
			latitude: profileData?.location?.latitude,
			longitude: profileData?.location?.longitude,
			address: profileData?.location?.address!="undefined"? profileData?.location?.address: '',
			city: profileData?.location?.city,
			state: profileData?.location?.state,
			country: profileData?.location?.country,
			zipcode: profileData?.location?.zipcode,
		});
		setImgPreview({
			image: Endpoints.baseUrl + profileData?.image,
			cover_pic: Endpoints.baseUrl + profileData?.cover_pic,
		});
	}, [profileData]);

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			// console.log('profile__', JSON.stringify(resp,null,4))
			if (resp && resp.status) {
				setProfileData(resp.data);
				setContact(resp.data?.phone);
				setEmail(resp.data?.email);
			}
		} catch (e) {}
	};
	return (
		<>
			<CommonProfileSetup
				imgPreview={imgPreview}
				setImgPreview={setImgPreview}
				profileData={profileData}
				values={values}
				setValues={setValues}
				userType={'member'}
				email={email}
				contact={contact}
				isProfileNgobox={true}
				getProfileDetails={getProfileDetails}
			/>
		</>
	);
}

export default UserProfileSetup;

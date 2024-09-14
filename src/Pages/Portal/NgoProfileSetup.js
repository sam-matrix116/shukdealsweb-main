/* eslint-disable no-unused-vars */
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import CommonProfileSetup from '../../Components/CommonProfileSetup';
import ToastMessage from '../../Utils/ToastMessage';

function NgoProfileSetup() {
    const { t } = useTranslation();
	const token = getUserToken();
	const [profileData, setProfileData] = useState();
	const [categoryList, setCategoryList] = useState();
	const [values, setValues] = useState({});
	const [contact, setContact] = useState('');
	const [email, setEmail] = useState('');
	const [imgPreview, setImgPreview] = useState({});

	useEffect(() => {
		if (token) {
			getProfileDetails();
			getCategoryList();
		}
	}, []);

	useEffect(() => {
		setValues({
			name: profileData?.name,
			about: profileData?.about,
			user_type_category: profileData?.user_type_category_details?.id,
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
			website_url: profileData?.website_url,
		});
		setImgPreview({
			image: Endpoints.baseUrl + profileData?.image,
			cover_pic: Endpoints.baseUrl + profileData?.cover_pic,
		});
	}, [profileData]);

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
				setContact(resp.data?.phone);
				setEmail(resp.data?.email);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const getCategoryList = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUserCategoryList + 'ngo');
			if (resp && resp.status) {
				setCategoryList(resp.data);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	return (
		<>
			<CommonProfileSetup
				imgPreview={imgPreview}
				setImgPreview={setImgPreview}
				profileData={profileData}
				values={values}
				setValues={setValues}
				userType={'NGO'}
				email={email}
				contact={contact}
				isProfileNgobox={false}
				getProfileDetails={getProfileDetails}
				categoryList={categoryList}
			/>
		</>
	);
}

export default NgoProfileSetup;

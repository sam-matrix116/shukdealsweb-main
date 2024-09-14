/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getLoggedInUser, getUserToken } from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CommonProfileSetup from '../../Components/CommonProfileSetup';

function NewsProfileSetup() {
	const user = getLoggedInUser();
	const token = getUserToken();
	const [deliveryPartnerData, setDeliverPartnerData] = useState([]);
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [imgPreview, setImgPreview] = useState({});
	const [values, setValues] = useState({});
	const [profileData, setProfileData] = useState({});
	const [contact, setContact] = useState('');
	const [email, setEmail] = useState('');
	const [businessCategory, setBusinessCategory] = useState('');
	const [newsletterSubscribed, setNewsLetterSubscribed] = useState(0);
	const [categoriesData, setCategoryData] = useState([]);

	useEffect(() => {
		if (token) getProfileDetails();
		getCategories();
		getDeliveryPartners();
	}, []);

	useEffect(() => {
		setValues({
			// image: profileData?.image,
			// cover_pic: profileData?.cover_pic,
			name: profileData?.name,
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
			// console.log('profile__', JSON.stringify(resp,null,4))
			if (resp && resp.status) {
				setProfileData(resp.data);
				setContact(resp.data?.phone);
				setEmail(resp.data?.email);
			}
		} catch (e) {}
	};

	const getCategories = async () => {
		try {
			let resp = await FetchApi(Endpoints.getCategoriesList);
			if (resp && resp.status) {
				setCategoryData(resp.data);
			}
		} catch (e) {}
	};

	const getDeliveryPartners = async () => {
		try {
			let resp = await FetchApi(Endpoints.getDeliveryPartners);
			if (resp && resp.status) {
				setDeliverPartnerData(resp.data);
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
				userType={'News Agency'}
				email={email}
				contact={contact}
				isProfileNgobox={true}
				getProfileDetails={getProfileDetails}
				businessCategory={businessCategory}
				deliveryPartnerData={deliveryPartnerData}
			/>
		</>
	);
}

export default NewsProfileSetup;

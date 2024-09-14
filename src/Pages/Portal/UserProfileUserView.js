import React from 'react';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	getChoosenCurrency,
	getLoggedInUser,
	getUserToken,
} from '../../helpers/authUtils';
import CommonProfile from '../../Components/CommonProfile';
import {
	CommonClassifiedRow,
	CommonRecommendationRow,
} from '../../Components/sliders';
import ToastMessage from '../../Utils/ToastMessage';
import ClassifiedDetailPage from '../../Components/CommonDetailPage/DetailPages/ClassifiedDetailPage';
import LoadingSpinner from '../../Components/Loader';

function UserProfileUserView() {
	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState({});
	const [isCreateClassified, setIsCreateClassified] = useState(false);
	const [isAddFamilyMember, setIsAddFamilyMember] = useState(false);
	const [pinnedData, setPinnedData] = useState();
	const token = getUserToken();
	const user = getLoggedInUser();
	const user_currency = getChoosenCurrency();
	const { t } = useTranslation();

	const getProfileDetails = async () => {
		try {
			setIsLoading(true);

			let resp = await FetchApi(Endpoints.getProfileDetails);
			// console.log('profile__', JSON.stringify(resp,null,4))
			if (resp && resp.status) {
				setProfileData(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);

			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const getPinnedClassified = async () => {
		try {
			setIsLoading(true);

			let resp = await FetchApi(
				Endpoints.getPinnedClassified + user?.id,
				null,
				null,
				{ to_currency: user_currency?.iso_code }
			);

			if (resp && resp.status) {
				setPinnedData(resp.data);
				ToastMessage.Success(resp.message);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		if (token) {
			getProfileDetails();
			getPinnedClassified();
		}
		// getClassifieds(Endpoints.getClassifieds);
	}, []);

	return (
		<div className='wrapper'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='main'>
						<CommonProfile />

						{!isCreateClassified && !isAddFamilyMember && (
							<div className='container '>
								<div className='border-top border-bottom py-4 mb-4'>
									<h1 className='fs-30 text-gray1 pb-1 fs-sm-22'>{t('About')}</h1>
									<p className='light m-0'>{profileData?.about}</p>
								</div>

								{pinnedData?.user && (
									<ClassifiedDetailPage detailData={pinnedData} removeCards={true} />
								)}
								<CommonClassifiedRow
									id={user?.id}
									headTitle={'Classifieds'}
									headSize={true}
									addBtn={true}
									classifiedType={'users'}
									paginationSize={8}
									activatePagination={true}
								/>

								<div className='py-lg-4 py-3 '>
									<CommonRecommendationRow
										headTitle={`My Favorites`}
										headSize={true}
										paginationSize={4}
										recommendedType={'users'}
										viewallTab={'listing'}
									/>
								</div>
							</div>
						)}
					</div>
					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default UserProfileUserView;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import OthersProfile from '../../Components/OthersProfile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	CommonClassifiedRow,
	CommonRecommendationRow,
} from '../../Components/sliders';
import ClassifiedDetailPage from '../../Components/CommonDetailPage/DetailPages/ClassifiedDetailPage';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import { getChoosenCurrency, getLoggedInUser } from '../../helpers';
import LoadingSpinner from '../../Components/Loader';
import CommonProfile from '../../Components/CommonProfile';

function UserProfileOtherView() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const user_currency = getChoosenCurrency();
	const user = getLoggedInUser();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const [pinnedData, setPinnedData] = useState([]);
	const [profileData, setProfileData] = useState({});

	const getOtherProfile = async () => {
		try {
			setIsLoading(true);

			let resp = await FetchApi(Endpoints.getOtherUserProfile + params?.id);
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
				Endpoints.getPinnedClassified + params?.id,
				null,
				null,
				{ to_currency: user_currency?.iso_code }
			);

			if (resp && resp.status && resp.data.length > 0) {
				setPinnedData(resp.data);
				// ToastMessage.Success(resp.message);
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
		if (params?.id == user?.id) {
			navigate({
				pathname: '/user-profile-user-view',
			});
		}
		getPinnedClassified();
		getOtherProfile();
	}, []);
	return (
		<div class='wrapper'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div class='main'>
						{params?.id == user?.id ? (
							<CommonProfile />
						) : (
							<OthersProfile
								about
								user={'member'}
								id={params?.id}
								givenData={profileData}
							/>
						)}

						{pinnedData.length ? (
							<ClassifiedDetailPage detailData={pinnedData} removeCards={true} />
						) : null}

						<div class='container '>
							<CommonClassifiedRow
								id={params?.id}
								headTitle={`${profileData?.firstname}’s ${t("Classifieds")}`}
								headSize={true}
								classifiedType={'users'}
								paginationSize={8}
								activatePagination={true}
							/>

							<CommonRecommendationRow
								headTitle={`${profileData?.firstname}’s ${t("Recommendations")}`}
								headSize={true}
								userId={params?.id}
								recommendedType={'others'}
								paginationSize={4}
							/>
						</div>
					</div>

					<CustomFooter />
				</>
			)}
		</div>
	);
}

export default UserProfileOtherView;

import React, { useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CommonProfile from '../../Components/CommonProfile';
import CustomFooter from '../../Components/CustomFooter';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { getLoggedInUser, getTempToken, getUserToken } from '../../helpers/authUtils';
import CommonUsersListing from '../../Components/ListingItems/CommonUsersListing';
import ToastMessage from '../../Utils/ToastMessage';
import UserListingHeader from '../../Components/ListingItems/UserListingHeader';
import { useLocation, useSearchParams } from 'react-router-dom';

function DealListing() {
	const user = getLoggedInUser();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const [path, setPath] = useState('');
	const [filter, setfilter] = useState('');
	const [basicInfo, setBasicInfo] = useState();
	const tempToken = getTempToken();

	console.log('session_id2677777')

	// const [user, setProfileData] = useState([]);

	// const getProfileDetails = async () => {
	// 	try {
	// 		let resp = await FetchApi(Endpoints.getProfileDetails);
	// 		if (resp && resp.status) {
	// 			setProfileData(resp.data);
	// 		}
	// 	} catch (e) {
	// 		if (e && e.response && e.response.data && e.response.data.message) {
	// 			ToastMessage.Error(e.response.data.message);
	// 		}
	// 	}
	// };

	const getBasicInfo = async () => {
		const obj = {
			tempToken: tempToken,
		};
		try {
			let resp = await FetchApi(Endpoints.getBasicInfofromTempTOken, obj);
			if (resp && resp.status) {
				setBasicInfo(resp);
				// setIsLoading(false);
			}
		} catch (e) {
			if (e && e.response) {
				// setIsLoading(false);
				ToastMessage.Error(e.response.message);
			}
		}
	};

	useEffect(()=>{
		getBasicInfo();
	},[])

	useEffect(() => {
		setPath(
			window.location.pathname === '/deal-listing' && user?.business_category != 5
				? 'my-deals'
				: window.location.pathname === '/deal-listing' &&
				  user?.business_category == 5
				? 'my-realestate'
				: window.location.pathname === '/job-listing'
				? 'my-jobs'
				: window.location.pathname === '/classified-listing'
				? 'my-classifieds'
				: window.location.pathname === '/location-listing'
				? 'my-locations'
				: window.location.pathname === '/weekly-listing'
				? 'my-weekly'
				: window.location.pathname === '/payment-report'
				? 'my-payment-report'
				: window.location.pathname === '/payment-history'
				? 'my-payment-history'
				: window.location.pathname === '/ngo-business-associated'
				? 'my-ngo-business-associated'
				: window.location.pathname === '/ngo-member-associated'
				? 'my-ngo-member-associated'
				: window.location.pathname === '/redeemed-deals-user'
				? 'my-redeemed-deal-users'
				: window.location.pathname === '/video-listing'
				? 'my-videos'
				: window.location.pathname === '/payment-option'
				? 'my-payment-options'
				: // : window.location.pathname === '/family-members-listing'
				  // ? 'my-family'
				  null
		);
	}, [location]);

	// console.log({filter})
	return (
		<div>
			<CustomHeader />
			<CommonProfile />
			<div className='container border-top py-4'>
				{basicInfo && 
				<UserListingHeader
					listingType={path}
					setFilters={setfilter}
					setpath={setPath}
					currency={basicInfo?.currency}
				/>}

				{window.location.pathname === '/deal-listing' &&
					user?.business_category_details?.name !== 'Real Estate' && (
						<CommonUsersListing
							url={Endpoints.getDealList}
							paginationSize={6}
							activatePagination={true}
							dataType={path}
							filter={filter}
						/>
					)}
				{window.location.pathname === '/deal-listing' &&
					user?.business_category_details?.name === 'Real Estate' && (
						<CommonUsersListing
							url={Endpoints.getDealList}
							paginationSize={6}
							activatePagination={true}
							dataType={path}
							filter={filter}
						/>
					)}
				{/* {window.location.pathname === '/job-listing' && (
					<CommonUsersListing
						url={
							filter === 'Recent Jobs'
								? Endpoints.getRecentJob
								: filter === 'Past Jobs'
								? Endpoints.getPastJob
								: Endpoints.getRecentJob
						}
						paginationSize={6}
						activatePagination={true}
						dataType={'my-jobs'}
						searchText={searchText}
						filter={filter}
					/>
				)} */}
				{window.location.pathname === '/classified-listing' && (
					<CommonUsersListing
						url={Endpoints.getClassifieds}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/location-listing' && (
					<CommonUsersListing
						url={Endpoints.getLocationList}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/payment-option' && basicInfo && (
					<CommonUsersListing
						url={
							// basicInfo?.currency === 4 ?
							// 'https://shukbackend.dignitech.com/en/'+Endpoints.getTranzilaToken :
							'https://shukbackend.dignitech.com/en/'+Endpoints.getStripePaymentMethodList
						}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/video-listing' && (
					<CommonUsersListing
						url={Endpoints.getNgoVideos}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/payment-history' && (
					<CommonUsersListing
						url={
							// user?.user_type === 'NGO'
							// 	? Endpoints.getNgoPaymentHistory
							// 	:
							Endpoints.getPaymentHistory
						}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/payment-report' && (
					<CommonUsersListing
						url={
							user?.user_type === 'Non Profitable Organization'
								? Endpoints.getNgoPaymentReport
								: Endpoints.getPaymentReport
						}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{window.location.pathname === '/weekly-listing' && (
					<CommonUsersListing
						url={Endpoints.myWeeklyDealsList}
						paginationSize={6}
						activatePagination={true}
						dataType={path}
						filter={filter}
					/>
				)}
				{/* {window.location.pathname === '/family-members-listing' && (
					<CommonUsersListing
						givenData={user?.family_member}
						dataType={'my-family'}
					/>
				)} */}
				{/* ngo associated */}
				{window.location.pathname === '/ngo-business-associated' && user?.id && (
					<CommonUsersListing
						url={Endpoints.topStoreBusinessProfile}
						params={{ ngo: location?.state?.accountId || user?.id }}
						paginationSize={6}
						activatePagination={true}
						filter={filter}
						dataType={path}
					/>
				)}
				{window.location.pathname === '/ngo-member-associated' && user?.id && (
					<CommonUsersListing
						url={Endpoints.getMemberList}
						params={{ ngo: location?.state?.accountId || user?.id }}
						paginationSize={6}
						activatePagination={true}
						filter={filter}
						dataType={path}
					/>
				)}
				{window.location.pathname === '/business-member-redeemed' && user?.id && (
					<CommonUsersListing
						url={Endpoints.getMemberList}
						params={{ ngo: location?.state?.accountId || user?.id }}
						paginationSize={6}
						activatePagination={true}
						filter={filter}
						dataType={path}
					/>
				)}
				{window.location.pathname === '/redeemed-deals-user' && (
					<CommonUsersListing
						url={Endpoints.myRedeemedDealsUsers + params?.id}
						paginationSize={6}
						activatePagination={true}
						filter={filter}
						dataType={path}
					/>
				)}
			</div>
			<CustomFooter />
		</div>
	);
}

export default DealListing;
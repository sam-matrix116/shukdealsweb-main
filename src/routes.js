import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Navigate, useNavigate, Route, Outlet, useSearchParams } from 'react-router-dom';
import {
	getLoggedInUser,
	getUserToken,
	isUserAuthenticated,
} from './helpers/authUtils';
import Container from './Components/Container';

import NgoSignup from './Pages/Auth/NgoSignup';
import UserPlan from './Pages/Auth/UserPlan';
import NewsAgencySignup from './Pages/Auth/NewsAgencySignup';
import Landing from './Pages/Portal/Landing';
import { FetchApi } from './API/FetchApi/index.js';
import { Endpoints } from './API/Endpoints/index.js';
import ToastMessage from './Utils/ToastMessage/index.js';

// Landing
const Login = React.lazy(() => import('./Pages/Auth/Login'));
const BusinessSignup = React.lazy(() => import('./Pages/Auth/BusinessSignup'));
const UserSignup = React.lazy(() => import('./Pages/Auth/UserSignup'));
const BusinessVerification = React.lazy(() =>
	import('./Pages/Auth/BusinessVerification')
);
const BusinessProfileSetup = React.lazy(() =>
	import('./Pages/Portal/BusinessProfileSetup')
);
const Signup = React.lazy(() => import('./Pages/Auth/Signup'));
const ChooseLanguage = React.lazy(() => import('./Pages/Auth/ChooseLanguage'));
const BusinessPlan = React.lazy(() => import('./Pages/Auth/BusinessPlan'));
const ForgotPassword = React.lazy(() => import('./Pages/Auth/ForgotPassword'));
const VerifyOtp = React.lazy(() => import('./Pages/Auth/VerifyOtp'));
const NewPassword = React.lazy(() => import('./Pages/Auth/NewPassword'));
const UserProfileSetup = React.lazy(() =>
	import('./Pages/Portal/UserProfileSetup')
);
const NewsProfileSetup = React.lazy(() =>
	import('./Pages/Portal/NewsProfileSetup')
);
const NgoProfileSetup = React.lazy(() =>
	import('./Pages/Portal/NgoProfileSetup')
);
const UserProfileUserView = React.lazy(() =>
	import('./Pages/Portal/UserProfileUserView')
);
const BusinessProfileBusinessView = React.lazy(() =>
	import('./Pages/Portal/BusinessProfileBusinessView')
);
const AddFamilyMember = React.lazy(() =>
	import('./Pages/Portal/AddFamilyMember')
);
const NgoProfileNgoView = React.lazy(() =>
	import('./Pages/Portal/NgoProfileNgoView')
);
const NewsAgencyProfile = React.lazy(() =>
	import('./Pages/Portal/NewsAgencyProfile')
);
const DealListing = React.lazy(() => import('./Pages/Portal/DealListing'));
const WishList = React.lazy(() => import('./Pages/Portal/Wishlist'));
const CategoryListing = React.lazy(() =>
	import('./Pages/Portal/CategoryListing')
);
const DealDetails = React.lazy(() => import('./Pages/Portal/DealDetails'));
const SearchResult = React.lazy(() => import('./Pages/Portal/SearchResult'));
const BusinessProfileUserView = React.lazy(() =>
	import('./Pages/Portal/BusinessProfileUserView')
);
const UserProfileOtherView = React.lazy(() =>
	import('./Pages/Portal/UserProfileOtherView')
);
const NgoProfileOtherView = React.lazy(() =>
	import('./Pages/Portal/NgoProfileOtherView')
);
const AddVideo = React.lazy(() => import('./Pages/Portal/AddVideo'));
const Payment = React.lazy(() => import('./Pages/Portal/Payment'));
const PaymentSuccess = React.lazy(() =>
	import('./Pages/Portal/PaymentSuccess')
);
const PaymentSummary = React.lazy(() =>
	import('./Pages/Portal/PaymentSummary')
);
const AddLocations = React.lazy(() => import('./Pages/Portal/AddLocations'));
const CreateUpdateListing = React.lazy(() =>
	import('./Pages/Portal/CreateUpdateListing')
);
const ReferalsPage = React.lazy(() => import('./Pages/Portal/ReferalsPage.js'));
const Settings = React.lazy(() => import('./Pages/Portal/Settings.js'));
const ContentManager = React.lazy(() =>
	import('./Pages/Portal/ContentManager.js')
);
const ExtraCategoryListing = React.lazy(() =>
	import('./Pages/Portal/ExtraCategoryListing')
);

// authgurd defination
const ProtectedRoute = ({
	isAllowed,
	redirectPath = '/login',
	children,
	// type = 'token', //token, tempToke
}) => {
	let token = getUserToken();
	const isAuthTokenValid = token ? true : false;
	// const isAuthTokenValid = isUserAuthenticated();
	// console.log({ isAuthTokenValid });

	return isAuthTokenValid ? (
		children ? (
			children
		) : (
			<Outlet />
		)
	) : (
		<Navigate to={redirectPath} replace />
	);
};

// un-authgurd
const UnAuthorizedRoute = ({ redirectUrl, redirectPath = '/', children }) => {
	const isAuthTokenValid = isUserAuthenticated();
	//const location = useLocation();
	if (isAuthTokenValid) {
		return <Navigate to={redirectPath} replace />;
	}

	return children ? children : <Outlet />;
};

// deals listing and deals creation check
const AccessRouteProtection = ({
	redirectPath = '/',
	restrictCategories,
	children,
}) => {
	const user = getLoggedInUser();
	let access = restrictCategories.includes(user?.user_type);
	if (access) {
		return <Navigate to={redirectPath} replace />;
	}
	// redirectPath ? <Navigate to={redirectPath} replace /> :
	return children ? children : <Outlet />;
};

const CheckCondition = ({ type, type1, redirectPath = '/', children }) => {
	let isConfirmed = false;
	const user = getLoggedInUser();

	if (type === 'parent') {
		isConfirmed = !user?.parent ? true : false;
	}
	if (type1 === 'basic') {
		isConfirmed = !user?.plan?.name != 'Basic' ? true : false;
	}
	if (isConfirmed) return children ? children : <Outlet />;
	else return <Navigate to={redirectPath} replace />;
};

export default function AppRoutes() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get('session_id');
	console.log('routes', sessionId)

	const addStripePaymentMethod = async (id) => {
		let obj = {
			CHECKOUT_SESSION_ID: id
		}
		try {
			// setIsLoadingModalVisible(true);
			let resp = await FetchApi(
				Endpoints.addStripePaymentMethod,
				obj,
				null,
				null,
				false,
			);
			if (resp && resp.status) {
				// setIsLoadingModalVisible(false);
				console.log('jso2', resp?.data);
				navigate('/payment-option');
			}
			// setIsLoadingModalVisible(false);
		} catch (e) {
			// setIsLoadingModalVisible(false);
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search);
        // const sessionId2 = urlParams.get('session_id');

		console.log('session_iddd', sessionId)

        if (sessionId) {
            addStripePaymentMethod(sessionId);
            // navigate('/payment-option');
        }
    }, [sessionId, navigate]);
	return (
		<Routes>
			<React.Fragment>
				<Route path='/' element={<Container />}>
					{/* <Route path="business-signup" element={<BusinessSignup />}/> */}

					<Route
						index
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<Landing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>

					<Route
						path='login'
						element={
							<React.Suspense fallback={<>...</>}>
								<Login />
							</React.Suspense>
						}
					/>
					<Route
						path='signup-choose-ngo'
						element={
							<React.Suspense fallback={<>...</>}>
								<Signup />
							</React.Suspense>
						}
					/>
					<Route
						path='choose-language-currency'
						element={
							<React.Suspense fallback={<>...</>}>
								<ChooseLanguage />
							</React.Suspense>
						}
					/>
					<Route
						path='business-signup'
						element={
							<React.Suspense fallback={<>...</>}>
								<BusinessSignup />
							</React.Suspense>
						}
					/>
					<Route
						path='user-signup'
						element={
							<React.Suspense fallback={<>...</>}>
								<UserSignup />
							</React.Suspense>
						}
					/>
					<Route
						path='ngo-signup'
						element={
							<React.Suspense fallback={<>...</>}>
								<NgoSignup />
							</React.Suspense>
						}
					/>
					<Route
						path='news-agency-signup'
						element={
							<React.Suspense fallback={<>...</>}>
								<NewsAgencySignup />
							</React.Suspense>
						}
					/>
					<Route
						path='business-verification'
						element={
							<React.Suspense fallback={<>...</>}>
								<BusinessVerification />
							</React.Suspense>
						}
					/>
					<Route
						path='business-plan'
						element={
							<AccessRouteProtection
								restrictCategories={['Member', 'NGO', 'News Agency']}
							>
								<React.Suspense fallback={<>...</>}>
									<BusinessPlan />
								</React.Suspense>
							</AccessRouteProtection>
						}
					/>
					<Route
						path='user-plan'
						element={
							<AccessRouteProtection
								restrictCategories={['Business', 'NGO', 'News Agency']}
							>
								<React.Suspense fallback={<>...</>}>
									<UserPlan />
								</React.Suspense>
							</AccessRouteProtection>
						}
					/>
					<Route
						path='payment'
						element={
							<React.Suspense fallback={<>...</>}>
								<Payment />
							</React.Suspense>
						}
					/>
					<Route
						path='create-payment-method'
						element={
							<React.Suspense fallback={<>...</>}>
								<Payment />
							</React.Suspense>
						}
					/>
					<Route
						path='payment_success'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<PaymentSuccess />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='forgot-password'
						element={
							<React.Suspense fallback={<>...</>}>
								<ForgotPassword />
							</React.Suspense>
						}
					/>
					<Route
						path='verify-email'
						element={
							<React.Suspense fallback={<>...</>}>
								<VerifyOtp />
							</React.Suspense>
						}
					/>
					<Route
						path='verify-phone'
						element={
							<React.Suspense fallback={<>...</>}>
								<VerifyOtp />
							</React.Suspense>
						}
					/>
					<Route
						path='new-password'
						element={
							<React.Suspense fallback={<>...</>}>
								<NewPassword />
							</React.Suspense>
						}
					/>
					<Route
						path='user-profile-setup'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<UserProfileSetup />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='ngo-profile-setup'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<NgoProfileSetup />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='news-profile-setup'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<NewsProfileSetup />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='business-profile-setup'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<BusinessProfileSetup />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='business-verification'
						element={
							<React.Suspense fallback={<>...</>}>
								<BusinessVerification />
							</React.Suspense>
						}
					/>
					<Route
						path='user-profile-user-view'
						element={
							<>
								<ProtectedRoute>
									<React.Suspense fallback={<>...</>}>
										<UserProfileUserView />
									</React.Suspense>
								</ProtectedRoute>
							</>
						}
					/>
					<Route
						path='ngo-profile-ngo-view'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<NgoProfileNgoView />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='ngo-profile-other-view'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<NgoProfileOtherView />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='news-agency-profile-view'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<NewsAgencyProfile />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='business-profile-business-view'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<BusinessProfileBusinessView />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='landing'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<Landing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='family-members-listing'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<DealListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='add-family-member'
						element={
							<ProtectedRoute>
								<CheckCondition type={'parent'} type1={'basic'}>
									<React.Suspense fallback={<>...</>}>
										<AddFamilyMember />
									</React.Suspense>
								</CheckCondition>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-family-member'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<AddFamilyMember />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-listing-realestate'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='classified-details'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<DealDetails />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='deal-details'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<DealDetails />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='weekly-details'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<DealDetails />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='create-classified'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Business', 'NGO']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-weekly-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-listing-restaurant'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-listing-rent'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-listing-realestate'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-listing-jobs'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-product-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-travel-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-sport-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-service-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'NGO', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='create-ngo-deal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'Business', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='classified-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Business', 'NGO']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-classified'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Business', 'NGO']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='location-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='video-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Member', 'Business', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='redeemed-deals-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Business']}>
									<React.Suspense fallback={<>...</>}>
										<WishList />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-location'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member']}>
									<React.Suspense fallback={<>...</>}>
										<AddLocations />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='deal-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>

					<Route
						path='job-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={'Member'}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='ngo-business-associated'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={('Member', 'News Agency', 'Business')}
								>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='ngo-member-associated'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={('Member', 'News Agency', 'Business')}
								>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='redeemed-deals-user'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={('Member', 'News Agency', 'NGO')}
								>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-listing-jobs'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='weekly-listing'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-listing-weekly'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['Member', 'News Agency']}>
									<React.Suspense fallback={<>...</>}>
										<CreateUpdateListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>

					<Route
						path='wishlist'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<WishList />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-products'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-ngo'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-classifieds'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-travel'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-sports'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-restaurants'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-services'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-realestate'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-top-business'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<ExtraCategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-recommendation'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<ExtraCategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='Extra-category-listing-deal'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<ExtraCategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='Extra-category-listing-classified'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<ExtraCategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='Extra-category-listing-weekly'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<ExtraCategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='category-listing-jobs'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<CategoryListing />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='search-result'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<SearchResult />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='business-profile-user-view'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<BusinessProfileUserView />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='user-profile-other-view'
						element={
							<>
								<React.Suspense fallback={<>...</>}>
									<UserProfileOtherView />
								</React.Suspense>
							</>
						}
					/>
					<Route
						path='add-video'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<AddVideo />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='update-video'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<AddVideo />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='payment-summary'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<PaymentSummary />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='payment-history'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['NGO']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='payment-report'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Business', 'Member', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='ngo-referal'
						element={
							<ProtectedRoute>
								<AccessRouteProtection
									restrictCategories={['Business', 'Member', 'News Agency']}
								>
									<React.Suspense fallback={<>...</>}>
										<ReferalsPage />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='payment-option'
						element={
							<ProtectedRoute>
								<AccessRouteProtection restrictCategories={['NGO']}>
									<React.Suspense fallback={<>...</>}>
										<DealListing />
									</React.Suspense>
								</AccessRouteProtection>
							</ProtectedRoute>
						}
					/>
					<Route
						path='add-locations'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<AddLocations />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='settings'
						element={
							<ProtectedRoute>
								<React.Suspense fallback={<>...</>}>
									<Settings />
								</React.Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='about-us'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
					<Route
						path='help-center'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
					<Route
						path='terms-conditions'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
					<Route
						path='support'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
					<Route
						path='contact-us'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
					<Route
						path='privacy-policy'
						element={
							<React.Suspense fallback={<>...</>}>
								<ContentManager />
							</React.Suspense>
						}
					/>
				</Route>
				<Route path='*' element={<p>There's nothing here: 404!</p>} />
			</React.Fragment>
		</Routes>
	);
}

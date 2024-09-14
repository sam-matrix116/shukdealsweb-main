import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import {
	getClassifiedFormData,
	getDealFormData,
	getLoggedInUser,
	getTempToken,
} from '../../helpers/authUtils';
import { useEffect } from 'react';
import { useState } from 'react';
import ToastMessage from '../../Utils/ToastMessage';
import { getFilesFromLocalStorage } from '../../helpers/fileHelper';
import CountDownRedirect from '../../Components/CommonTimers/CountDownRedirect';

function PaymentSuccess() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const [isCalled, setIsCalled] = useState(false);
	const [redirectUrl, setRedirectUrl] = useState('/');
	const navigate = useNavigate();
	const businessLocationObj = getDealFormData('businessLocationData');
	const dealObj = getDealFormData('dealObj');
	const classifiedObj = getClassifiedFormData('classifiedform');
	const classifiedsImage = getFilesFromLocalStorage('classifiedsImage');
	const dealsImage = getFilesFromLocalStorage('dealsImage');
	const payType = localStorage.getItem('paytype');
	const user = getLoggedInUser();
	const waitTime = 10000;

	const PlanFinalize = async () => {
		setIsCalled(true);
		if (user?.user_type == 'Business') {
			setRedirectUrl('/business-profile-setup');
			// setTimeout(() => {
			// 	navigate('/business-profile-setup', { replace: true });
			// }, waitTime);
		} else {
			setRedirectUrl('/user-profile-setup');
			// setTimeout(() => {
			// 	navigate('/user-profile-setup', { replace: true });
			// }, waitTime);
		}
	};
	const addBusinessLocation = async (url) => {
		let obj = new FormData();
		for (var key in businessLocationObj) {
			obj.append(key, businessLocationObj[key]);
		}

		try {
			let resp = await FetchApi(url, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				setIsCalled(true);
				localStorage.removeItem('businessLocationData');
				setRedirectUrl('/add-locations');
				// setTimeout(() => {
				// 	navigate('/add-locations', { replace: true });
				// }, waitTime);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const addDeal = async (url) => {
		let obj = new FormData();
		for (var key in dealObj) {
			obj.append(key, dealObj[key]);
		}
		if (dealsImage?.length) {
			dealsImage.forEach((i) => {
				obj.append('images', i);
			});
		}

		try {
			let resp = await FetchApi(url, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				setIsCalled(true);
				localStorage.removeItem('dealObj');
				localStorage.removeItem('dealsImage');
				if (payType === 'weekly-deal') {
					setRedirectUrl('/weekly-listing');
				} else if (payType === 'deal') {
					setRedirectUrl('/deal-listing');
				}
				// navigate('/deal-listing', { replace: true });
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const addClassified = async () => {
		let obj = new FormData();
		for (var key in classifiedObj) {
			obj.append(key, classifiedObj[key]);
		}
		if (classifiedsImage.length) {
			classifiedsImage.forEach((i) => {
				obj.append('images', i);
			});
		}
		try {
			let resp = await FetchApi(Endpoints.addClassifieds, obj);
			if (resp && resp.status && resp.go_to !== 'payment') {
				ToastMessage.Success(resp.message);
				setIsCalled(true);
				localStorage.removeItem('classifiedform');
				localStorage.removeItem('classifiedsImage');
				setRedirectUrl('/classified-listing');
				// navigate('/classified-listing', { replace: true });
			}
		} catch (e) {
			// console.log('err__', JSON.stringify(e.response,null,4));
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		if (!isCalled && (payType === 'business-plan' || payType === 'user-plan')) {
			PlanFinalize();
		} else if (!isCalled && payType === 'classified') {
			addClassified();
		} else if (!isCalled && ['weekly-deal', 'deal'].includes(payType)) {
			addDeal(Endpoints.addDeal);
		} else if (!isCalled && payType === 'property_deal') {
			addDeal(Endpoints.addPropertyDeal);
		} else if (!isCalled && payType === 'location') {
			// addBusinessLocation(Endpoints.addLocationPayment);
			setRedirectUrl('/add-locations');
		} else if (!isCalled && payType === 'location2') {
			// addBusinessLocation(Endpoints.addLocationPayment);
			setRedirectUrl('/business-profile-setup');
		}
	}, []);

	return (
		<div className='wrapper position-relative'>
			<CustomHeader external />
			<div className='main signup-column pt-5 main-login'>
				<div className='container pt-5'>
					<div className='row'>
						<div className='col-md-6 '>
							<div className='text-center'>
								<img height={'400px'} src='assets/img/Bag image.png' alt='shukDeals' />
							</div>
						</div>

						<div className=' d-flex flex-column align-items-center col-md-6 signup-column-right'>
							<h2 className='mx-5 my-5 text-center'>
								{payType === 'business-plan' || payType === 'user-plan'
									? 'Thanks for activating your plan successfully!'
									: 'Your Payment is Successful!'}
							</h2>
							<CountDownRedirect
								timeInSeconds={waitTime / 1000}
								redirectUrl={redirectUrl}
							/>
						</div>
					</div>
				</div>
			</div>
			<CustomFooter />
		</div>
	);
}

export default PaymentSuccess;

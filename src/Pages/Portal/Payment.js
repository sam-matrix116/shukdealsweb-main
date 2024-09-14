import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
	getCookie,
	getLoggedInUser,
	getTempToken,
	getUserToken,
} from '../../helpers/authUtils';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import TranzillaForm from '../../Components/PayementComponents/TranzillaForm';
import useModalContext from '../../context/modalContext';
import StripeForm from '../../Components/PayementComponents/StripeForm';
import { FetchApi } from '../../API/FetchApi';
import { Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
function Payment() {
	const { t } = useTranslation();
	const { setIsLoadingModalVisible } = useModalContext();
	const navigate = useNavigate();
	const tempToken = getTempToken();
	const [isLoading, setIsLoading] = useState();
	const [basicInfo, setBasicInfo] = useState();
	const [options, setOptions] = useState();
	const [existingCards, setExistingCards] = useState();
	const [paymentMethod, setPaymentMethod] = useState('');
	const [isNewCard, setIsNewCard] = useState(false);
	const [checkoutSessionId, setCheckoutSessionId] = useState('');
	const user = getLoggedInUser();
	const paymentDetails = getCookie('payment_detail');
	const token = getUserToken();

	// console.log('istoken__', token)
	// console.log('stripepublic__', process.env.REACT_APP_STRIPE_PUBLIC_KEY);
	// console.log('isNewCard__', isNewCard)

	// side effects
	const generateStripeIntent = async () => {
		const obj = {
			tempToken: tempToken,
			payment_detail: paymentDetails,
		};
		try {
			setIsLoading(true);
			let resp = await FetchApi(
				Endpoints.generateStripeIntent,
				obj,
				null,
				null,
				false
			);
			if (resp && resp.status) {
				setOptions((values) => ({
					...values,
					clientSecret: resp?.stripe_client_secret,
				}));
				// setCookie('tempToken', resp?.tempToken);
				setIsLoading(false);
			}
		} catch (e) {
			if (e && e.response) {
				setIsLoading(false);
				ToastMessage.Error(e.response.message);
			}
		}
	};
	const getBasicInfo = async () => {
		const obj = {
			tempToken: tempToken,
		};
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getBasicInfofromTempTOken, obj);
			if (resp && resp.status) {
				setBasicInfo(resp);
				setIsLoading(false);
			}
		} catch (e) {
			if (e && e.response) {
				setIsLoading(false);
				ToastMessage.Error(e.response.message);
			}
		}
	};

	// const generateCheckoutSessionId = async () => {
	// 	try {
	// 		let resp = await FetchApi(
	// 			Endpoints.createCheckOutSession,
	// 			{},
	// 			null,
	// 			null,
	// 			false,
	// 			'GET'
	// 		);
	// 		if (resp && resp.status) {
	// 			setCheckoutSessionId(resp?.data?.id);
	// 		}
	// 	} catch (e) {
	// 		if (e && e.response) {
	// 			ToastMessage.Error(e.response.message);
	// 		}
	// 	}
	// };

	const getStripeExistingCard = async () => {
		try {
			// API call to get existing stripe cards
			const response = await FetchApi('https://shukbackend.dignitech.com/en/'+Endpoints.getStripePaymentMethodList);
			if (response && response.status) {
				setExistingCards(response.data);
				// if(!response.data.filter((item)=>item?.card_mask!=null)?.length){
				// 	setIsNewCard(true);
				// }
				// console?.log('check33__', !response.data.filter((item)=>item?.last4!=null)?.length);
				// console?.log('check2223__', JSON.stringify(response.data.filter((item)=>item?.last4!=null), null, 4));
				if(!response.data.filter((item)=>item?.last4!=null)?.length){
					setIsNewCard(true);
				}
			}
		} catch (error) {
			if (error.response) {
				ToastMessage.Error(error.response.message);
			}
		}
	};

	const handleCardSelect = (card) => {
		setPaymentMethod(card?.payment_method || card?.id);
		// setPaymentMethod(card?.id);
		setIsNewCard(false)
	};

	const handleSubmit = async (e) => {
		// console.log('abc__');
		e.preventDefault();
		setIsLoadingModalVisible(true);
		if (!paymentMethod) {
			return;
		}
		// console.log('abc__222');
		const paymentData = {
			payment_method: paymentMethod,
			payment_detail: paymentDetails,
		}
		try {
			const response = await FetchApi(
				Endpoints.savedStripeProcess,
				paymentData,
				null,
				null,
				false
			);
			if (response && response.status) {
				navigate('/payment_success', { replace: true });
				ToastMessage.Success(response.message);
				setIsLoadingModalVisible(false);
			} else if (!response.status) {
				ToastMessage.Error(response.message);
				setIsLoadingModalVisible(false);
			}
		} catch (error) {
			setIsLoadingModalVisible(false);
			if (error && error.response) {
				ToastMessage.Error(error.message);
			}
		}
	};

	useEffect(() => {
		getBasicInfo();
		if (isNewCard) generateStripeIntent();
		// if (basicInfo?.currency !== 4 && isNewCard) generateStripeIntent();
	}, [isNewCard]);

	// useEffect(() => {
	// 	if (basicInfo?.currency !== 4 && 
	// 		window.location.pathname === '/create-payment-method') {
	// 		generateCheckoutSessionId();
	// 	}
	// }, []);

	useEffect(() => {
		if(token){
			getStripeExistingCard();
		}
		else{
			setIsNewCard(true);
		}	
	}, []);

	return (
		<div className='wrapper position-relative'>
			<CustomHeader external removeLogoRedirection={true} />
			<div className='main signup-column pt-5 main-login'>
				<div className='container pt-5'>
					<div className='row'>
						<div className='col-md-6 '>
							<div className='text-center'>
								<img src='assets/img/Bag image.png' alt='shukDeals' />
							</div>
						</div>

						<div className='col-md-6 signup-column-right'>
						{existingCards?.length && 
						// basicInfo?.currency !== 4  && 
						window.location.pathname != '/create-payment-method'
						? (
						<>
							<h1 class='text-gray1 fs-34 medium pb-2'>{t('Payment Process')}</h1>
							{existingCards?.map((item) => (
								<div className='container p-0 py-2'>
									<div className=' d-flex flex-column justify-content-center '>
											<div className=''>
												<Card className=' rounded-10 align-items-start text-center p-1'>
													<Form.Check
														type='radio'
														label={"************" + (item?.last4 || item?.card_mask)}
														name='paymentCard'
														id='cardOption1'
														// checked={cardInfo?.token == item?.token}
														onChange={() => handleCardSelect(item)}
													/>
												</Card>
											</div>
											</div>
										</div>
									))}
									<div className='pb-3 pt-1'>
									<Card className=' rounded-10 align-items-start text-center p-1'>
										<Form.Check
											type='radio'
											label={"Add New Card"}
											name='paymentCard'
											id='cardOption1'
											checked={isNewCard}
											onClick={() => setIsNewCard(!isNewCard)}
										/>
									</Card>
									</div>
									{!isNewCard && <button onClick={handleSubmit} className='button w-100 rounded-10'>
										{t('Submit')}
									</button>}
								</>
							) : null}
							{isNewCard && options 
							// && basicInfo?.currency !== 4 
							? (
								<Elements
									stripe={stripePromise}
									options={options}
									// stripe={null}
								>
									<StripeForm options={options} isLoading={isLoading} />
								</Elements>
							) 
							// : basicInfo?.currency === 4 ? (
							// 	<TranzillaForm />
							// ) 
							: 
							null}
						</div>
					</div>
				</div>
			</div>
			<CustomFooter />
		</div>
	);
}

export default Payment;

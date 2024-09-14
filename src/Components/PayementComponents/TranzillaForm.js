import React, { useState, useEffect } from 'react';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import { getCookie, getTempToken } from '../../helpers/authUtils';
import ToastMessage from '../../Utils/ToastMessage';
import { useLocation, useNavigate } from 'react-router-dom';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';

import { Form, Card } from 'react-bootstrap';
import './style.css';
import LoadingSpinner from '../Loader';
import useModalContext from '../../context/modalContext';

function TranzillaForm() {
	const { setIsLoadingModalVisible } = useModalContext();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const [cardInfo, setCardInfo] = useState({});
	const [existingCards, setExistingCards] = useState();
	const [selectedCard, setSelectedCard] = useState();
	const tempToken = getTempToken();
	const paymentDetails = getCookie('payment_detail');
	const validationArr = () => {
		return [
			[
				cardInfo?.card_number,
				ValidationTypes.Empty,
				t('Please enter a card number'),
			],
			[
				cardInfo?.expire_month,
				ValidationTypes.Empty,
				t('Please enter a expire month'),
			],
			[
				cardInfo?.expire_year,
				ValidationTypes.Empty,
				t('Please enter a expire year'),
			],
		];
	};

	// ... other form fields
	const handleCardSelect = (card) => {
		setCardInfo((values) => ({
			...values,
			card_number: card?.card_mask,
			expire_month: card?.expire_month,
			expire_year: card?.expire_year,
			tranzila_token: card?.token,
		}));
	};

	const handleChange = (event) => {
		if (event.persist) event.persist();
		if (
			event?.target?.name === 'expire_month' ||
			event?.target?.name === 'expire_year'
		) {
			setCardInfo((values) => ({
				...values,
				[event?.target?.name]: parseInt(event?.target?.value),
			}));
		} else {
			setCardInfo((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	const handlePaymentMethod = async (e) => {
		e.preventDefault();
		let validate;
		validate = await ValidateList(validationArr());
		if(!validate){
			return
		}
		setIsLoadingModalVisible(true);
		// const obj = {
		// 			cardInfo,
		// 	  };
		try {
			// API call to add Tranzila payment method
			const response = await FetchApi(
				Endpoints.addTranzillaPaymentMethod,
				cardInfo,
				null,
				null,
				false
			);
			if (response && response.status) {
				navigate(-1);
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoadingModalVisible(true);
		let validate;
		if (!cardInfo?.tranzila_token) {
			validate = await ValidateList(validationArr());
		}
		if (!cardInfo?.tranzila_token && !validate) {
			return;
		}
		const paymentData = cardInfo?.tranzila_token
			? {
					tranzila_token: cardInfo?.tranzila_token,
					payment_detail: paymentDetails,
			  }
			: {
					tempToken: tempToken,
					payment_detail: paymentDetails,
					...cardInfo,
			  };

		try {
			// API call to Tranzila payment gateway
			const response = await FetchApi(
				Endpoints.tranzillaPaymentProcess,
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

	const getTranzilaToken = async () => {
		const obj = {
			// tempToken: tempToken,
			payment_detail: paymentDetails,
		};

		try {
			// API call to Tranzila payment gateway
			const response = await FetchApi(
				Endpoints.getTranzilaToken,
				obj,
				null,
				null,
				false,
				'GET'
			);
			if (response && response.status) {
				setExistingCards(response.data);
			}
		} catch (error) {
			if (error.response) {
				ToastMessage.Error(error.response.message);
			}
		}
	};

	useEffect(() => {
		if(window.location.pathname != '/create-payment-method'){
			getTranzilaToken();
		}
	}, []);

	return (
		<div class='px-lg-5 pb-5 mb-lg-4'>
			<h1 class='text-gray1 fs-34 medium pb-2'>{
				window.location.pathname === '/create-payment-method'?
				t('Add Payment Option') :
				t('Payment Process')
			}</h1>
			{existingCards?.length && 
			window.location.pathname != '/create-payment-method'
			? (
				<>
					{existingCards?.map((item) => (
						<div className='container p-0 py-3'>
							<div className=' d-flex flex-column justify-content-center '>
								<div className=''>
									<Card className=' rounded-10 align-items-start text-center p-1'>
										<Form.Check
											type='radio'
											label={item?.card_mask}
											name='paymentCard'
											id='cardOption1'
											checked={cardInfo?.token == item?.token}
											onChange={() => handleCardSelect(item)}
										/>
									</Card>
								</div>
							</div>
						</div>
					))}
				</>
			) : null}

			<form onSubmit={window.location.pathname === '/create-payment-method'?
			handlePaymentMethod : handleSubmit} class='site-form pt-2'>
				<div class='form-field mb-3'>
					<label for='' class='pb-2'>
						{t('Card Number')}
					</label>
					<input
						value={cardInfo?.card_number}
						onChange={handleChange}
						type='cardNumber'
						name='card_number'
						maxLength={16}
						placeholder='********'
					/>
				</div>

				<div class='row'>
					<div class='col-sm-6'>
						<div class='form-field mb-3'>
							<label for='' class='pb-2'>
								{t('Expiry Month')}
							</label>
							<input
								value={cardInfo?.expire_month}
								onChange={handleChange}
								name='expire_month'
								type='number'
								maxLength={2}
								placeholder='MM'
								className='tranzila-input'
							/>
						</div>
					</div>
					<div class='col-sm-6'>
						<div class='form-field mb-3'>
							<label for='' class='pb-2'>
								{t('Expiry Year')}
							</label>
							<input
								value={cardInfo?.expire_year}
								onChange={handleChange}
								name='expire_year'
								type='number'
								maxLength={2}
								placeholder='YY'
								className='tranzila-input'
							/>
						</div>
					</div>

					{/* <div class='col-sm-6'>
						<div class='form-field mb-3'>
							<label for='' class='pb-2'>{t("CVV")}
							</label>
							<input type='number' name='cvv' maxLength={3} placeholder='' />
						</div>
					</div> */}
				</div>

				<button type='submit' class='button w-100 rounded-10'>
					{t('Submit')}
				</button>
			</form>
		</div>
	);
}

export default TranzillaForm;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../Utils/ToastMessage';
import { getLoggedInUser, setCookie } from '../../helpers';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
const $ = window.jQuery;

function LocationPaymentModal({ modalVisible, setModalVisible, unitCostData }) {
	const user = getLoggedInUser();
	const defined_currency = {
		sign: user?.currency_sign,
		iso_code: user?.currency_iso,
	};
	const { t } = useTranslation();
	const [locationCount, setLocationCount] = useState(1);
	const navigate = useNavigate();
	const validationArr = () => {
		return [
			[
				locationCount,
				ValidationTypes.NumberNotNegative,
				t('Please enter a valid count'),
			],
			[
				locationCount,
				ValidationTypes.Empty,
				t('Please enter a count'),
			],
		];
	};

	const addLocationPayment = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
		let obj = {
			locations_count: locationCount,
		};
		try {
			let resp = await FetchApi(Endpoints.addLocationPayment, obj);
			if (resp && resp.status) {
				setModalVisible('hide');
				// $('#add').modal('hide');

				localStorage.setItem('paytype', 'location');
				setCookie('payment_detail', resp?.payment_detail);
				navigate('/payment');
			}
		} catch (e) {}
	};
	useEffect(() => {
		if (modalVisible) {
			$('#add').modal(modalVisible);
		}
	}, [modalVisible]);

	return (
		<div
			className='modal fade'
			data-show='true'
			id='add'
			tabindex='1'
			// aria-labelledby="addmodalLabel"
			// aria-modal="true"
			role='dialog'
		>
			<div className='modal-dialog modal-dialog-top location-modal'>
				<div className='modal-content rounded-20 border-0'>
					<div className='modal-header border-0 p-0'>
						<button
							type='button'
							className='outside-close bg-transparent border-0'
							data-bs-dismiss='modal'
							aria-label='Close'
						>
							<img src='assets/img/icon/close.svg' alt='' />
						</button>
					</div>
					<div className='modal-body p-4 '>
						<h3 className='fs-22 fs-sm-16 pt-3 pb-2 text-gray1'>
							{t('How many business locations you want to add?')}
						</h3>
						<h5 className='fs-16 light pb-3'>
							{t('You will be charged')}{' '}
							<span className='text-blue medium'>
								{defined_currency?.sign}
								{parseFloat(unitCostData?.location)?.toFixed(2)}
							</span>{' '}
							{t('for each location.')}
						</h5>
						<form action='' className='site-form'>
							<div className='form-field'>
								<input
									value={locationCount}
									onChange={(e) => {
										setLocationCount(e.target.value);
									}}
									type='number'
									min='0'
									placeholder={t('Enter Number')}
								/>
							</div>
						</form>

						<div className='payment-summary'>
							<h6 className='text-gray1 py-2 '>{t('Order Summary')}</h6>
							<div className='p-4 order rounded-20 mb-2'>
								{/* <div className='d-flex justify-content-between pb-2'>
									<h6 className='fs-16 text-gray1'>Subtotal</h6>
									<h5 className='fs-20 medium'>
										${(parseFloat(unitCostData?.location) * locationCount)?.toFixed(2)}
									</h5>
								</div>
								<div className='d-flex justify-content-between pb-2 border-bottom'>
									<h6 className='fs-16 text-gray1'>Tax</h6>
									<h5 className='fs-20 medium'>
										${parseFloat(unitCostData?.tax)?.toFixed(2)}
									</h5>
								</div> */}
								<div className='d-flex justify-content-between pt-2'>
									<h6 className='fs-16 text-gray1'>{t('Total')}</h6>
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{(parseFloat(unitCostData?.location) * locationCount)?.toFixed(2)}
									</h5>
								</div>
							</div>
							<div className='d-flex justify-content-center gap-3 pt-3 btn-group'>
								<button
									onClick={() => {
										setModalVisible('hide');

										// $('#add').modal('hide');
									}}
									className='button gray-btn rounded-10 fs-20 medium w-100'
									data-bs-dismiss='modal'
									aria-label='Close'
								>
									{t('Cancel')}
								</button>
								<button
									onClick={(e) => {
										if (!locationCount) {
											ToastMessage.Error(t('Please Enter Location count'));
											return;
										}
										addLocationPayment();
										e.preventDefault();
									}}
									data-bs-dismiss='modal'
									aria-label={locationCount ? 'Close' : ''}
									className='button rounded-10 fs-20 medium w-100'
								>
									{t('Payment')}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LocationPaymentModal;

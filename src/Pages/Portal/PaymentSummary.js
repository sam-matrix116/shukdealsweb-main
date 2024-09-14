import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { useLocation, useNavigate } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useEffect } from 'react';
import { useState } from 'react';
import {
	getChoosenCurrency,
	getClassifiedFormData,
	getDealFormData,
	getLoggedInUser,
} from '../../helpers/authUtils';
import moment from 'moment';

function PaymentSummary() {
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const defined_currency = {
		sign: user?.currency_sign,
		iso_code: user?.currency_iso,
	};
	const [unitCostData, setUnitCostData] = useState({});
	const navigate = useNavigate();
	const location = useLocation();
	const dealForm = getDealFormData('dealObj');
	const classifiedForm = getClassifiedFormData('classifiedform');
	let payType = localStorage.getItem('paytype');

	const handleProceed = (e) => {
		e.preventDefault();
		navigate('/payment', {
			state: {
				// clientSecret: location?.state?.clientSecret,
				// formdata: location?.state?.formData,
				// paymentSucessRedirect: '/deal-listing',
			},
		});
	};

	const getUnitCost = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUnitCost, null, null, {
				to_currency: defined_currency?.iso_code,
			});
			if (resp && resp.status) {
				setUnitCostData(resp);
			}
		} catch (e) {}
	};

	useEffect(() => {
		getUnitCost();
		window.scrollTo(0, 0);
	}, []);

	return (
		<div>
			<CustomHeader removeLogoRedirection={true} />

			<div className='container py-5'>
				<div className='row payment-summary'>
					<div className='col-md-8'>
						<h1 className='fs-30 fs-sm-24 text-gray1 pb-3'>{t("Your Order")}</h1>
						<div className='shadow p-3 rounded-20'>
							<div className='d-md-flex gap-3'>
								<img
									src={location.state?.preview}
									className='rounded-10 item-img'
									alt=''
								/>
								<div>
									<div className='d-md-flex gap-3 py-md-0 py-2'>
										<h3 className='text-black fs-22 pb-2 fs-sm-18'>
											{payType == 'classified' ? classifiedForm?.title : dealForm?.title}
										</h3>
										<h4 className='fs-24 text-blue medium'>
											{defined_currency?.sign}
											{payType == 'classified'
												? parseFloat(unitCostData?.classified)?.toFixed(2)
												: payType == 'weekly-deal'
												? parseFloat(unitCostData?.weekly_deal)?.toFixed(2)
												: parseFloat(unitCostData?.deal)?.toFixed(2)}
										</h4>
									</div>
									{payType != 'classified' && payType != 'propertydeal' ? (
										<div className='d-md-flex gap-lg-5 gap-3 pb-md-0 pb-2'>
											<h5 className='fs-14 text-gray2 pb-md-0 pb-2'>
												{t("Code for free member")}:{' '}
												<span className='medium text-gray1 d-block'>
													{dealForm?.free_member_code}
												</span>
											</h5>
											{/* <h5 className='fs-14 text-gray2'>
												Code for club member:{' '}
												<span className='medium text-gray1 d-block'>
													{dealForm?.club_member_code}
												</span>
											</h5> */}
										</div>
									) : null}
								</div>
							</div>
							<div className='d-flex gap-5'>
								<h5 className='fs-14 text-gray2 pb-md-0 pt-2'>
									{t('Publish on')}:{' '}
									<span className='medium text-gray1'>
										{moment(new Date()).format('DD MMM YYYY')}{' '}
									</span>
								</h5>
								{payType == 'classified' ? (
									<h5 className='fs-14 text-gray2 pb-md-0 pt-2'>
										{t("Expire")}:{' '}
										<span className='medium text-gray1'>
											{moment(classifiedForm?.expiry_date).format('DD MMM YYYY')}{' '}
										</span>
									</h5>
								) : (
									<h5 className='fs-14 text-gray2 pb-md-0 pt-2'>
										{t("Expire")}:{' '}
										<span className='medium text-gray1'>
											{dealForm?.expiry_date
												? moment(dealForm?.expiry_date).format('DD MMM YYYY')
												: 'After 7 days'}{' '}
										</span>
									</h5>
								)}
							</div>
						</div>
					</div>
					<div className='col-md-4'>
						<h6 className='text-gray1 py-3'>{t("Order Summary")}</h6>
						<div className='p-4 order rounded-20 mb-3'>
							<div className='d-flex justify-content-between pb-2'>
								<h6 className='fs-16 text-gray1'>{t("Subtotal")}</h6>
								{payType == 'classified' ? (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{parseFloat(unitCostData?.classified)?.toFixed(2)}
									</h5>
								) : payType == 'weekly-deal' ? (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{parseFloat(unitCostData?.weekly_deal)?.toFixed(2)}
									</h5>
								) : (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{parseFloat(unitCostData?.deal)?.toFixed(2)}
									</h5>
								)}
							</div>
							<div className='d-flex justify-content-between pb-2 border-bottom'>
								<h6 className='fs-16 text-gray1'>Tax</h6>
								<h5 className='fs-20 medium'>
									{defined_currency?.sign}
									{parseFloat(unitCostData?.tax)?.toFixed(2)}
								</h5>
							</div>
							<div className='d-flex justify-content-between pt-2'>
								<h6 className='fs-16 text-gray1'>Total</h6>
								{payType == 'classified' ? (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{(
											parseFloat(unitCostData?.tax) + parseFloat(unitCostData?.classified)
										)?.toFixed(2)}
									</h5>
								) : payType == 'weekly-deal' ? (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{(
											parseFloat(unitCostData?.tax) + parseFloat(unitCostData?.weekly_deal)
										)?.toFixed(2)}
									</h5>
								) : (
									<h5 className='fs-20 medium'>
										{defined_currency?.sign}
										{(
											parseFloat(unitCostData?.tax) + parseFloat(unitCostData?.deal)
										)?.toFixed(2)}
									</h5>
								)}
							</div>
						</div>

						<button onClick={handleProceed} className='button w-100 rounded-10'>
							{t("Make Payment")}
						</button>
					</div>
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default PaymentSummary;

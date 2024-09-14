import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';

function ForgotPassword() {
	const [isLoading, setIsloading] = useState(false);
	const [email, setEmail] = useState('');
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const forgot = async () => {
		let validationArr = [
			[email, ValidationTypes.Email, t('Please Enter Valid Email')],
		];
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}
		let obj = {
			email: email,
		};
		try {
			setIsloading(true);
			let resp = await FetchApi(Endpoints.forgotPassword, obj);
			if (resp && resp.status) {
				setIsloading(false);
				ToastMessage.Success(resp.message);
				localStorage.setItem(
					'verifydetails',
					JSON.stringify({
						email: email,
						forgot: true,
					})
				);
				navigate('/verify-email', {state: {isForgot: true}});
			}
		} catch (e) {
			setIsloading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	return (
		<div>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className='wrapper position-relative'>
					<div className='header2 py-md-4 py-3 position-absolute top-0 start-0 w-100'>
						<div className='container py-md-3 py-lg-4'>
							<div className='row'>
								<div className='col-12 text-center'>
									<div className='site-logo'>
										<a href='index.html'>
											<img src='assets/img/site-logo.svg' alt='shukDeals' />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='main main-login'>
						<div className='container '>
							<div className='row justify-content-center'>
								<div className='col-lg-6 col-md-8 col-sm-10 col-12 signup-mid-column pt-5'>
									<div className='px-lg-5 px-sm-3 text-center py-5 my-md-5'>
										<h1 className='text-gray1 fs-34 medium pb-2 pt-md-3'>
											{t("Forgot Password?")}
										</h1>
										<p>{t("No worries, we’ll send you Reset instructions.")}</p>

										<form
											onSubmit={(e) => {
												forgot();
												e.preventDefault();
											}}
											action=''
											className='site-form pt-2'
										>
											<div className='form-field mb-4'>
												<input
													onChange={(e) => {
														setEmail(e.target.value);
													}}
													type='text'
													// placeholder="Enter your email or phone number"
													placeholder={t('Enter your email')}
												/>
											</div>

											<button className='button w-100 rounded-10'>{t("Reset Password")}</button>
										</form>

										<div className='text-center pt-3'>
											<Link to={-1} replace className='medium d-block'>
												{t("Back to Login")}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<CustomFooter />
		</div>
	);
}

export default ForgotPassword;

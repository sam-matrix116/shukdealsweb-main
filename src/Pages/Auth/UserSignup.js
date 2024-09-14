import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import Images from '../../Images';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import i18next from 'i18next';
import ToastMessage from '../../Utils/ToastMessage';
import { useTranslation } from 'react-i18next';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
// import PhoneInput from 'react-phone-input-international';
// import 'react-phone-input-international/lib/style.css';
import { PhoneInput } from 'react-international-phone';
// import startsWith from 'lodash.startswith';
import PasswordForm from '../../Components/CommonUiComponents/PasswordForm';
import { getSelectedLanguages } from '../../helpers';

function UserSignup() {
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [view1, setView1] = useState(false);
	const [view2, setView2] = useState(false);
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [adminName, setAdminName] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const { t, i18n } = useTranslation();
	const [isLoading, setIsLoading] = useState(false)
	const selectedNgo = localStorage.getItem('selectedNonProfit');
	const persistedData = getSelectedLanguages();

	const register = async () => {
		let validationArr = [
			[name, ValidationTypes.Empty, t('Name is required')],
			[lastName, ValidationTypes.Empty, t('Last name is required')],
			// [adminName, ValidationTypes.Empty, t('Administrator Name is required')],
			[phone, ValidationTypes.Empty, t('Mobile number is required')],
			[email, ValidationTypes.Email, t('Please Enter Valid Email')],
			// [password, ValidationTypes.Password, t('Your password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number')],
			[password, ValidationTypes.Empty, t('Please Enter Password')],
			[confirmPassword, ValidationTypes.Empty, t('Please Confirm Your Password')],
		];
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}
		if (password != confirmPassword) {
			ToastMessage.Error(t("Password doesn't match. Please re-enter your Password."));

			return;
		}
		let obj = {
			phone: phone,
			email: email,
			password: password,
			confirm_password: confirmPassword,
			user_type: 'member',
			firstname: name,
			lastname: lastName,
			// administrator_name: adminName,
			country: location.state?.country || persistedData?.country?.id,
			language: location.state?.language || persistedData?.language?.key,
			currency: location.state?.currency || persistedData?.currency?.id,
			ngo: location.state?.ngo || selectedNgo,
		};

		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.register, obj);
			// console.log("register__", JSON.stringify(resp,null,4));
			if (resp && !resp.status) {
				ToastMessage.Error(resp.message);
			}
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				navigate('/verify-email', {
					replace: true,
				});
				localStorage.setItem(
					'verifydetails',
					JSON.stringify({
						email: email,
						phone: phone,
						memberShip: location.state?.memberShip,
					})
				);
				setIsLoading(false);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	return (
		<div className='wrapper position-relative'>
			<CustomHeader external />
			<div className='main signup-column pt-5 main-login'>
				<div className='container pt-5'>
					<div className='row'>
						<div className='col-md-6 pe-lg-4'>
							<div className='text-center'>
								<img src='assets/img/Bag image.svg' alt='shukDeals' />
							</div>
						</div>

						<div className='col-md-6 signup-column-right'>
							<div className='px-lg-5'>
								<h1 className='text-gray1 fs-34 medium pb-2'>
									{t('Create An Account')}
								</h1>
								<p>{t('Thank you for supporting us!')}</p>

								<form
									onSubmit={(e) => {
										register();
										e.preventDefault();
										// navigate("/business-verification")
									}}
									action=''
									className='site-form pt-2'
								>
									<div class='row'>
										<div class='col-sm-6'>
											<div class='form-field mb-3'>
												<label for='' class='pb-2'>
													{t('First Name')}
												</label>
												<input
													onChange={(e) => {
														setName(e.target.value);
													}}
													type='text'
													placeholder={t('Enter First Name')}
												/>
											</div>
										</div>
										<div class='col-sm-6'>
											<div class='form-field mb-3'>
												<label for='' class='pb-2'>
													{t('Last Name')}
												</label>
												<input
													onChange={(e) => {
														setLastName(e.target.value);
													}}
													type='text'
													placeholder={t('Enter Last Name')}
												/>
											</div>
										</div>
									</div>

									<div className=' mb-3'>
										<label for='' className='pb-2'>
											{t('Mobile Number')}
										</label>
										<div className='d-flex'>
											<div 
											className='form-field d-flex align-items-center field-phone w-100'
											>
												<PhoneInput
													// autoFormat={true}
													// isValid={(inputNumber, country, countries) => {
													// 	return countries.some((country) => {
													// 		return (
													// 			startsWith(inputNumber, country.dialCode) ||
													// 			startsWith(country.dialCode, inputNumber)
													// 		);
													// 	});
													// }}
													defaultCountry='il'
													style={{
														width: '100%'
													}}
													inputStyle={{
														// backgroundColor : 'white',
														// height: '44px',
														border: 'transparent',
														borderTopRightRadius: 10,
														borderBottomRightRadius: 10,
														// paddingTop: '10px',
														// borderRadius: 10,
														marginInlineStart: (i18n.language=='he' || i18n.language=='ar')?'25px':'0px'
													}}
													placeholder='Enter phone number'
													value={phone}
													onChange={(value) => {
														setPhone(value);
													}}
												/>
											</div>
										</div>
									</div>

									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Email Address')}
										</label>
										<input
											onChange={(e) => {
												setEmail(e.target.value);
											}}
											type='email'
											placeholder='davidking@gmail.com'
										/>
									</div>

									<PasswordForm
										setPassword={setPassword}
										setConfirmPassword={setConfirmPassword}
										passwordView={view1}
										setPasswordView={setView1}
										confirmView={view2}
										setConfirmView={setView2}
									/>

									<button style={{
										backgroundColor: isLoading? '#8daed4' : ''
									}} type='submit' className='button w-100 rounded-10'>
										{isLoading? t('Please wait...') : t('Continue')}
									</button>
								</form>

								<div className='pt-3 fs-14'>
									<p>
									{t('By creating an account, you agree to ShukDeals')}{' '}
										<Link to={'/terms-conditions'} className='medium'>
											{t('Terms & Conditions')}
										</Link>{' '}
										{t("and")} <Link to={'/privacy-policy'}>{t('Privacy Policy')}</Link>
									</p>
								</div>

								<div className=' pt-3 mb-md-4 mb-2'>
									<Link
										onClick={() => {
											navigate(-1);
										}}
										className='medium d-block text-center'
									>
										{t('Back')}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CustomFooter />
		</div>
	);
}

export default UserSignup;

import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import ToastMessage from '../../Utils/ToastMessage';
import {
	getUserToken,
	setCookie,
	setSessionStorageFunction,
} from '../../helpers/authUtils';
import i18next from 'i18next';
import { getLocationPermission } from '../../helpers/locationHelper';
import PasswordForm from '../../Components/CommonUiComponents/PasswordForm';
import { Cookies } from 'react-cookie';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [view1, setView1] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
    let cookies = new Cookies();
	const expireTimeCalculation = () => {
		let d = new Date();
		return rememberMe
			? d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000)
			: d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
	};

	// const token = getUserToken();

	const id = Math.random().toString(36).substring(2, 15);

	// console.log('tokkkkklog__', token)

	useEffect(()=>{
        cookies.set("token", '');
	},[])

	// useEffect(() => {
	// 	i18n.changeLanguage('en');
	// }, []);

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			// console.log('profile__', JSON.stringify(resp,null,4));
			if (resp.data) {
				sessionStorage.setItem('user', JSON.stringify(resp.data));

				setSessionStorageFunction('user_currency', {
					sign: resp.data?.currency_sign,
					iso_code: resp.data?.currency_iso,
					sign_svg: resp.data?.currency_icon,
				});

				setCookie('header_dp', URL?.createObjectURL(resp?.data?.image));
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const signin = async () => {
		let validationArr = [
			[email, ValidationTypes.Empty, t('Please enter login credentials')],
			[password, ValidationTypes.Empty, t('Please Enter Password')],
			// [password, ValidationTypes.Password, t('Your password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number')],
		];
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}
		let obj = {
			email_or_phone: email,
			password: password,
		};
		let expireTime = expireTimeCalculation();
		try {
			let resp = await FetchApi(Endpoints.login, obj);
			if (
				resp?.goto === 'email_verification' ||
				resp?.goto === 'phone_verification'
			) {
				localStorage.setItem(
					'verifydetails',
					JSON.stringify({
						email: resp?.email,
						phone: resp?.phone,
						memberShip: resp?.user_type,
					})
				);
				navigate({
					pathname:
						resp?.goto === 'email_verification' ? '/verify-email' : '/verify-phone',
				});
				return;
			}
			if (resp?.goto === 'plan') {
				setCookie('tempToken', resp.tempToken);
				if (resp?.user_type?.toLowerCase() === 'member') {
					navigate({
						pathname: '/user-plan',
					});
				} else if (resp?.user_type?.toLowerCase() === 'business') {
					navigate({
						pathname: '/business-plan',
					});
				}
			}
			if (!resp?.user?.plan_details && resp.user.user_type === 'business') {
				setCookie('tempToken', resp.tempToken);
				setCookie('token', resp.token);
				setCookie('refreshToken', resp.refresh, expireTime);
				await getProfileDetails();

				navigate({
					pathname: '/business-plan',
					search: `?user_type=business`,
				});
			} else if (!resp?.user?.plan_details && resp.user.user_type === 'member') {
				setCookie('tempToken', resp.tempToken);
				setCookie('token', resp.token);
				setCookie('refreshToken', resp.refresh, expireTime);
				await getProfileDetails();

				navigate({
					pathname: '/user-plan',
					search: `?user_type=member`,
				});
			} else {
				if (resp && resp.status && resp.user.user_type === 'business') {
					setCookie('token', resp.token);
					setCookie('refreshToken', resp.refresh, expireTime);
					await getProfileDetails();

					// setCookie('user', resp.user);
					if (resp?.user?.location_set) {
						navigate('/landing');
					} else {
						ToastMessage.Info(t('Please complete profile setup'));
						navigate('/business-profile-setup', {
							state: { email: resp.user.email },
						});
					}
				}
				if (resp && resp.status && resp.user.user_type === 'member') {
					setCookie('token', resp.token);
					setCookie('refreshToken', resp.refresh, expireTime);
					await getProfileDetails();

					// setCookie('user', resp.user);
					if (resp?.user?.location_set) {
						navigate('/landing');
					} else {
						ToastMessage.Info(t('Please complete profile setup'));
						navigate('/user-profile-setup', { state: { email: resp.user.email } });
					}
				}
				if (resp && resp.status && resp.user.user_type === 'ngo') {
					setCookie('token', resp.token);
					setCookie('refreshToken', resp.refresh, expireTime);
					await getProfileDetails();

					// setCookie('user', resp.user);
					if (resp?.user?.location_set) {
						navigate('/landing');
					} else {
						ToastMessage.Info(t('Please complete profile setup'));
						navigate('/ngo-profile-setup', { state: { email: resp.user.email } });
					}
				}
				if (resp && resp.status && resp.user.user_type === 'news_agency') {
					setCookie('token', resp.token);
					setCookie('refreshToken', resp.refresh, expireTime);
					await getProfileDetails();

					// setCookie('user', resp.user);
					if (resp?.user?.location_set) {
						navigate('/landing');
					} else {
						ToastMessage.Info(t('Please complete profile setup'));
						navigate('/news-profile-setup', { state: { email: resp.user.email } });
					}
				}
				await getLocationPermission('chosenLocation');
			}
		} catch (e) {
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
						<div className='col-md-6 '>
							<div className='text-center'>
								<img src='assets/img/Bag image.png' alt='shukDeals' />
							</div>
						</div>

						<div className='col-md-6 signup-column-right'>
							<div className='px-lg-5'>
								<h1 className='text-gray1 fs-34 medium pb-2'>{t('Login')}</h1>
								<p>{t('Welcome back!')}</p>

								<form
									onSubmit={(e) => {
										signin();
										e.preventDefault();
									}}
									action=''
									className='site-form pt-2'
								>
									<div className='form-field mb-4'>
										<input
										id={`email-${id}`}
											onChange={(e) => {
												setEmail(e.target.value);
											}}
											type='text'
											placeholder={t('Enter your email/phone')}
										/>
									</div>

									<div className='form-field mb-4 pwd-group position-relative'>
										<div 
										className=' pwd-group position-relative'
										>
											<input
												onChange={(e) => {
													setPassword(e.target.value);
												}}
												type={view1 ? 'text' : 'password'}
												placeholder={t('Enter your password')}
												className='pwd-field'
											/>
											<Link
												onClick={() => {
													setView1((prev) => !prev);
												}}
												className={i18n.language=='he' || i18n.language=='ar'?
												'pwd-visibility text-gray2 position-absolute start-0 top-0 px-3 py-2 mt-1':
												'pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
												}
											>
												<i className={view1 ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
											</Link>
										</div>
									</div>

									<div className='d-flex align-items-center justify-content-between mb-4'>
										<div className='form-field remember-checkbox d-flex align-items-center gap-2'>
											<input
												onClick={(e) => setRememberMe(e.target.checked)}
												type='checkbox'
												name='remember'
												checked={rememberMe}
												id=''
											/>
											<label for='remember'>{t('Remember me')}</label>
										</div>
										<Link to={'/forgot-password'} className=''>
											{t('Forgot Password?')}
										</Link>
									</div>
									<button className='button w-100 rounded-10'>{t('Login')}</button>
								</form>

								<div className='text-center pt-3'>
									<p>
										{t("Don't have an account?")}{' '}
										<Link to='/signup-choose-ngo' className='medium'>
											{t('Sign Up & Donate Now')}
										</Link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <Outlet/> */}
			<CustomFooter />
		</div>
	);
}

export default Login;

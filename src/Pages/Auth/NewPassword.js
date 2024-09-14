import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import ToastMessage from '../../Utils/ToastMessage';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import { useTranslation } from 'react-i18next';

function NewPassword() {
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [view1, setView1] = useState(false);
	const [view2, setView2] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { t, i18n } = useTranslation();

	const createPassword = async () => {
		let validationArr = [
			[newPassword, ValidationTypes.Empty, t('Please Enter Password')],
			[confirmPassword, ValidationTypes.Empty, t('Please confirm your password')],
		];
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}
		if (newPassword != confirmPassword) {
			ToastMessage.Error(t("Passwords didn't match, Please re-enter your password"));
			return;
		}
		let obj = {
			code: location.state?.code,
			email: location?.state?.email,
			new_password: newPassword,
			confirm_password: confirmPassword,
		};
		try {
			let resp = await FetchApi(Endpoints.newPassword, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				navigate('/', { replace: 'true' });
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	return (
		<div>
			<div className='wrapper position-relative'>
				<div className='header2 py-md-4 py-3 position-absolute top-0 start-0 w-100'>
					<div className='container py-md-3 py-lg-4'>
						<div className='row'>
							<div className='col-12 text-center'>
								<div className='site-logo'>
									<div>
										<img src='assets/img/site-logo.svg' alt='shukDeals' />
									</div>
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
										{t('Set New Password')}
									</h1>
									<p className='px-md-5'>
										{t("Your new password must be different to previously used passwords.")}
									</p>

									<form
										onSubmit={(e) => {
											createPassword();
											e.preventDefault();
											// navigate("/", {replace : true})
										}}
										action=''
										className='site-form pt-2'
									>
										<div className='form-field mb-4 pwd-group position-relative'>
											<input
												onChange={(e) => {
													setNewPassword(e.target.value);
												}}
												type={view1 ? 'text' : 'password'}
												placeholder={t('Enter New Password')}
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

										<div className='form-field mb-4 pwd-group position-relative'>
											<input
												onChange={(e) => {
													setConfirmPassword(e.target.value);
												}}
												type={view2 ? 'text' : 'password'}
												placeholder={t('Confirm New Password')}
												className='pwd-field'
											/>
											<Link
												onClick={() => {
													setView2((prev) => !prev);
												}}
												className={i18n.language=='he' || i18n.language=='ar'?
												'pwd-visibility text-gray2 position-absolute start-0 top-0 px-3 py-2 mt-1':
												'pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
												}
											>
												<i className={view2 ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
											</Link>
										</div>

										<button className='button w-100 rounded-10'>
											{t('Reset Password')}
										</button>
									</form>

									<div className='text-center pt-3'>
										<Link to={'/'} replace className='medium d-block'>
											{t('Back to Login')}
										</Link>
									</div>
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

export default NewPassword;

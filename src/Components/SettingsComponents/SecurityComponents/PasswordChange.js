import React, { useState } from 'react';
import { ValidateList, ValidationTypes } from '../../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import ToastMessage from '../../../Utils/ToastMessage';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';

function PasswordChange() {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [values, setValues] = useState({});
	const [view1, setView1] = useState(false);
	const [view2, setView2] = useState(false);
	const [view3, setView3] = useState(false);

	let validationArr = [
		[
			values?.current_password,
			ValidationTypes.Empty,
			t('current password is required'),
		],
		[values?.new_password, ValidationTypes.Empty, t('new password is required')],
		[
			values?.confirm_password,
			ValidationTypes.Empty,
			t('confirm password is required'),
		],
	];

	const handleChange = (event, data) => {
		// if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setValues((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		let validate = await ValidateList(validationArr);
		if (!validate) {
			return;
		}
		if (values?.new_password != values?.confirm_password) {
			ToastMessage.Error(t("Password doesn't match. Please re-enter your Password."));
			return;
		}
		try {
			let resp = await FetchApi(Endpoints.updatePassword, values);
			if (resp && !resp.status) {
				ToastMessage.Error(resp.message);
			}
			if (resp && resp.status) {
				navigate(-1);
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	return (
		<div className='container my-3'>
			<h3 className='text-center'>{t('Change Password')}</h3>
			<div className='row'>
				<div className='col-md-8 offset-md-2'>
					<form onSubmit={handleSubmit} action='' className='site-form mt-5'>
						<div className='form-field mb-4 pwd-group position-relative'>
							<label for='' className='pb-2'>
								{t('Current password')}
							</label>
							<div className=' pwd-group position-relative'>
								<input
									value={values?.current_password}
									onChange={handleChange}
									name='current_password'
									type={view1 ? 'text' : 'password'}
									placeholder={t('Enter Current Password')}
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

						<div className='form-field mb-4 pwd-group position-relative'>
							<label for='' className='pb-2'>
								{t('New password')}
							</label>
							<div className=' pwd-group position-relative'>
								<input
									value={values?.new_password}
									onChange={handleChange}
									name='new_password'
									type={view2 ? 'text' : 'password'}
									placeholder={t('Enter New Password')}
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
						</div>

						<div className='form-field mb-4 pwd-group position-relative'>
							<label for='' className='pb-2'>
								{t('Confirm New Password')}
							</label>
							<div className=' pwd-group position-relative'>
								<input
									value={values?.confirm_password}
									onChange={handleChange}
									name='confirm_password'
									type={view3 ? 'text' : 'password'}
									placeholder={t('Enter Confirm Password')}
									className='pwd-field'
								/>
								<Link
									onClick={() => {
										setView3((prev) => !prev);
									}}
									className={i18n.language=='he' || i18n.language=='ar'?
									'pwd-visibility text-gray2 position-absolute start-0 top-0 px-3 py-2 mt-1':
									'pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
									}
								>
									<i className={view3 ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
								</Link>
							</div>
						</div>

						<button type='submit' className='button submit-button w-100 rounded-10'>
							{t('Submit')}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default PasswordChange;

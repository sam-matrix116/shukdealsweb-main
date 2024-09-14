import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function PasswordForm({
	setPassword,
	setConfirmPassword,
	passwordView,
	setPasswordView,
	confirmView,
	setConfirmView,
}) {
	const { t, i18n } = useTranslation();

	return (
		<>
			<div className='form-field mb-4 pwd-group position-relative'>
				<label for='' className='pb-2'>
					{t('Create Password')}
				</label>
				<div className=' pwd-group position-relative'>
					<input
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						type={passwordView ? 'text' : 'password'}
						placeholder={t('Enter Password')}
						className='pwd-field'
					/>
					<Link
						onClick={() => {
							setPasswordView((prev) => !prev);
						}}
						className={i18n.language=='he' || i18n.language=='ar'?
						'pwd-visibility text-gray2 position-absolute start-0 top-0 px-3 py-2 mt-1':
						'pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
						}
					>
						<i className={passwordView ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
					</Link>
				</div>
			</div>

			<div className='form-field mb-4 pwd-group position-relative'>
				<label for='' className='pb-2'>
					{t('Confirm Password')}
				</label>
				<div className=' pwd-group position-relative'>
					<input
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
						type={confirmView ? 'text' : 'password'}
						placeholder={t('Confirm Password')}
						className='pwd-field'
					/>
					<Link
						onClick={() => {
							setConfirmView((prev) => !prev);
						}}
						className={i18n.language=='he' || i18n.language=='ar'?
						'pwd-visibility text-gray2 position-absolute start-0 top-0 px-3 py-2 mt-1':
						'pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
						}
					>
						<i className={confirmView ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
					</Link>
				</div>
			</div>
		</>
	);
}

export default PasswordForm;

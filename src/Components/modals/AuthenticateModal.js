import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToastMessage from '../../Utils/ToastMessage';
import { FetchApi } from '../../API/FetchApi';
import { Link } from 'react-router-dom';

function AuthenticateModal({ setIsmodalVisible, isModalVisible, data }) {
	const { t } = useTranslation();
	const [password, setPassword] = useState('');
	const [view1, setView1] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password) {
			authenticateApi();
			setIsmodalVisible(false);
		} else {
			ToastMessage.Error(t('Please enter the reason'));
		}
	};

	const authenticateApi = async () => {
		let obj = {
			password: password,
		};
		try {
			let resp = await FetchApi(data?.authenticateUrl, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				setPassword('');
				data?.setStateBack(true);
				setIsmodalVisible(false);
			} else {
				setPassword('');
				setIsmodalVisible(false);
				data?.setStateBack2(false);
				ToastMessage.Error(resp.message);
			}
		} catch (e) {
			ToastMessage.Error(e.message);
		}
	};
	return (
		<>
			{isModalVisible && (
				<div
					className='modal d-block submitted-modal'
					id='business_submitted'
					tabindex='-1'
					aria-labelledby='business_submitted'
					aria-hidden='true'
				>
					<div className='modal-dialog modal-dialog-centered mw-400'>
						<div className='modal-content rounded-20 border-0 '>
							<div className='modal-body text-center py-4 px-md-5'>
								<span className='d-block text-blue fs-26'>
									<p>{t('Enter your password')}</p>
								</span>
								<div className='form-field mb-4 pwd-group position-relative mt-1'>
									<input
										style={
											{
												// borderRadius: '10px',
												// borderWidth: '1px',
												// // border: '1px',
												// padding: '5px',
												// borderStyle: 'solid',
												// borderColor: 'gray',
											}
										}
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										type={view1 ? 'text' : 'password'}
										placeholder={t('Enter Password')}
										className='pwd-field rounded-10 p-2'
									/>
									<Link
										onClick={() => {
											setView1((prev) => !prev);
										}}
										className='pwd-visibility text-gray2 position-absolute end-0 top-0 px-3 py-2 mt-1'
									>
										<i className={view1 ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
									</Link>
								</div>
								<div className='row'>
									<button
										onClick={handleSubmit}
										className='button rounded-10 px-4 py-2 col me-2'
									>
										{t('Authenticate')}
									</button>
									<button
										onClick={() => {
											setIsmodalVisible(false);
											data?.setStateBack2(false);
										}}
										className='button rounded-10 px-4 py-2 col'
									>
										{t('Cancel')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default AuthenticateModal;

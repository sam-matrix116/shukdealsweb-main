import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import ToastMessage from '../../Utils/ToastMessage';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';

function TextBoxModal({ setIsmodalVisible, isModalVisible, data }) {
    const { t } = useTranslation();
	const [discription, setDiscription] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		if (discription) {
			addFlagUser();
			setIsmodalVisible(false);
		} else {
			ToastMessage.Error(t('Please enter the reason'));
		}
	};

	const addFlagUser = async () => {
		try {
			let resp = await FetchApi(data?.flagUrl, {
				[data?.name]: data?.id,
				reason: discription,
			});
			if (resp && resp.message) {
				resp.status
					? ToastMessage.Success(resp.message)
					: ToastMessage.Error(resp.message);
				setDiscription('');
				data?.setStateBack(true);
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
								<form onSubmit={handleSubmit}>
									<div className='form-field mb-3 position-relative'>
										<label for='' className='pb-2'>{t("Reason")}
										</label>
										<textarea
											value={discription}
											onChange={(e) => {
												setDiscription(e.target.value);
											}}
											style={{
												borderRadius: '10px',
												padding: '10px',
											}}
											name='the-textarea'
											cols='10'
											rows='4'
											id='the-textarea'
											maxlength='300'
											placeholder={t('Write your reason')}
											autofocus
										></textarea>
										<div id='the-count' className='fs-14 text-gray2 light'>
											<span id='current'>{discription.length}</span>
											<span id='maximum'>/ 200</span>
										</div>
									</div>
									<div className='row gap-4'>
										<button
											onClick={() => {
												setIsmodalVisible(false);
												setDiscription('');
											}}
											className='button rounded-10 px-4 py-2 col'
										>{t("Cancel")}
										</button>
										<button type='submit' className='button submit-button rounded-10 px-4 py-2 col'>{t("Submit")}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default TextBoxModal;

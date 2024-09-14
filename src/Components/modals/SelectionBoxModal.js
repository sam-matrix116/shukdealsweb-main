import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import ToastMessage from '../../Utils/ToastMessage';
import { useLocation } from 'react-router-dom';

function SelectionBoxModal({ setIsmodalVisible, isModalVisible, data }) {
    const { t } = useTranslation();
	const location = useLocation();
	const [selectedData, setSelectedData] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedData) {
			data?.setCallingData(selectedData);
			setIsmodalVisible(false);
		} else {
			ToastMessage.Error(data?.error);
		}
	};
	const handleRadio = (event, data) => {
		if (event.persist) event.persist();
		setSelectedData(data);
	};
	useEffect(() => {
		if (location.pathname !== '/settings') setIsmodalVisible(false);
	}, [location]);

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
							<div className='modal-body text-center p-4'>
								<h2 className='modal-title'>{data?.title}</h2>
								<hr className='my-3 mb-4' />
								<form onSubmit={handleSubmit} className=' d-flex flex-column gap-4'>
									<div className=' d-flex flex-column justify-content-start gap-3 px-2'>
										{data?.type === 'radio' &&
											data?.options?.map((item) => {
												return (
													<div className='custom-radio  d-flex gap-1 align-content-center'>
														<input
															onClick={(event) => {
																handleRadio(event, item?.data);
															}}
															type='radio'
															name={data?.inputName}
															checked={selectedData === item?.data ? true : false}
														/>
														<label for={item?.data} className='medium'>
															{item?.title}
														</label>
													</div>
												);
											})}
										{data?.type === 'select' && (
											<div className='border rounded-3 d-flex align-items-start justify-content-start overflow-hidden'>
												<select
													value={selectedData}
													onChange={(e) => setSelectedData(e.target.value)}
													id=''
													className='border-0 w-100 ps-md-3 ps-1'
													style={{
														maxHeight: '200px',
														// maxWidth: '300px',
														overflowY: 'auto',
														marginLeft: '-10px',
													}}
												>
													<option value=''>{t("Select")}</option>
													{data?.options?.map((item) => (
														<option value={item[0]}>{item[1]}</option>
													))}
												</select>
											</div>
										)}
									</div>
									<div className='row gap-4'>
										<button
											className='button rounded-10 px-4 py-2 col'
											onClick={(e) => setIsmodalVisible(false)}
										>{t("Cancel")}
										</button>
										<button
											type='submit'
											className='button submit-button rounded-10 px-4 py-2 col '
										>{t("Submit")}
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

export default SelectionBoxModal;

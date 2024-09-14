import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';
import useModalContext from '../../../context/modalContext';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import ToastMessage from '../../../Utils/ToastMessage';
import { useNavigate } from 'react-router-dom';
import ConfirmMessage from '../../../Utils/ConfirmMessage';
import { deleteAllCookies } from '../../../helpers/authUtils';

function DeleteAccount() {
    const { t } = useTranslation();
	const navigate = useNavigate();
	const { setIsSelectionBoxModalVisible, setSelectionBoxData } =
		useModalContext();
	const [reasonList, setReasonList] = useState();
	const [deleteReason, setDeleteReason] = useState('');

	const getDeleteReasonList = async () => {
		try {
			let resp = await FetchApi(Endpoints.getDeleteReasonList);

			if (resp && resp.status) {
				let res = Object.entries(resp.data);
				setReasonList(res);
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const DeleteSelfAccount = async () => {
		try {
			let resp = await FetchApi(Endpoints.DeleteSelfAccount, {
				delete_reason: deleteReason,
			});

			if (resp && resp.status) {
				setDeleteReason('');
				deleteAllCookies();
				navigate('/');
				ToastMessage.Success(resp.message);
			}
			if(resp && !resp.status){
				ToastMessage.Error(resp.message);
				return
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSelectionBoxModalVisible(true);
		setSelectionBoxData((prevValues) => ({
			...prevValues,
			type: 'select',
			title: t('Please select a reason for deletion'),
			inputName: 'delete_reason',
			options: reasonList,
			setCallingData: setDeleteReason,
			error: t('Please select a reason'),
		}));
	};
	const deletConfirmation = async () => {
		const confirm = await ConfirmMessage(
			'You want to permanently delete your account'
		);
		if (confirm?.isConfirmed) {
			DeleteSelfAccount();
		} else {
			setDeleteReason('');
		}
	};

	useEffect(() => {
		getDeleteReasonList();
	}, []);

	useEffect(() => {
		if (deleteReason) {
			deletConfirmation();
		}
	}, [deleteReason]);

	return (
		<div className=' container d-flex flex-column align-items-center my-5'>
			<h3 className='mb-3'>{t("Account Deletion")}</h3>
			<h6 className='mb-3'>
				{t("If you Delete your account, then all you deals or classifieds will be deleted as well.")}
			</h6>
			<div className=' d-flex justify-content-center w-100 mt-3'>
				<Button className='button submit-button' onClick={handleSubmit}>
					{t("Delete Account")}
				</Button>
			</div>
		</div>
	);
}

export default DeleteAccount;

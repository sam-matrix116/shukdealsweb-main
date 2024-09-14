import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ToastMessage from '../../../Utils/ToastMessage';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { checkTokenRedirect } from '../../../helpers';
import useModalContext from '../../../context/modalContext';

function ActionReviewButtons({ data, flagUrl, markUrl }) {
	const { t } = useTranslation();
	const [usefullMarkedValue, setUsefullMarkedValue] = useState('');
	const [flaggedMarked, setflaggedMarked] = useState(false);
	const { setIsTextBoxModalVisible, setTextBoxData } = useModalContext();

	const handleReport = async (e) => {
		e.preventDefault();

		if (!checkTokenRedirect()) {
			return;
		} else if (flaggedMarked) {
			ToastMessage.Error(t('Already FLagged!'));
		} else {
			setIsTextBoxModalVisible(true);
			setTextBoxData((values) => ({
				...values,
				flagUrl: flagUrl,
				id: data?.id,
				name: 'review',
				setStateBack: setflaggedMarked,
			}));
		}
	};
	const handleMarkUseFull = async (e, mark) => {
		e.preventDefault();

		if (!checkTokenRedirect()) {
			return;
		} else if (usefullMarkedValue) {
			ToastMessage.Error(t('Already marked!'));
			return;
		}
		let obj = { review: data?.id, mark_type: mark };
		try {
			let resp = await FetchApi(markUrl, obj);
			if (resp && resp.status) {
				setUsefullMarkedValue(mark ? 'yes' : 'no');
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	// side effects
	useEffect(() => {
		setflaggedMarked(data?.flagged_by_logged_user);
		setUsefullMarkedValue(data?.marked_useful_by_logged_user);
	}, [data]);

	return (
		<div className='d-sm-flex align-items-center gap-2'>
			<span href='#' className='light text-blue fs-12'>
				{usefullMarkedValue === 'yes'
					? t('You found this helpful')
					: usefullMarkedValue === 'no'
					? t(`You didn't found this helpful`)
					: t('Did you find this helpful?')}
			</span>
			<div className='d-flex gap-2 text-center align-items-center'>
				<div className='d-flex gap-2 review-help-btn py-sm-0 py-2 '>
					{usefullMarkedValue === 'yes' ? (
						<button
							className=' text-white'
							style={{ background: 'rgb(18, 180, 180)' }}
						>
							{t('Yes')}
						</button>
					) : (
						<button onClick={(e) => handleMarkUseFull(e, true)}>{t('Yes')}</button>
					)}
					{usefullMarkedValue === 'no' ? (
						<button className=' text-white' style={{ background: 'rgb(161, 0, 27)' }}>
							{t('No')}
						</button>
					) : (
						<button onClick={(e) => handleMarkUseFull(e, false)}>{t('No')}</button>
					)}
				</div>

				<Link onClick={handleReport} className='light text-red fs-12'>
					{flaggedMarked ? t('Flagged') : t('Flag this review')}:{' '}
					{flaggedMarked ? (
						<img src='assets/img/icon/flag-fill.svg' height={22} alt='' />
					) : (
						<img src='assets/img/icon/flag1.svg' alt='' />
					)}
				</Link>
			</div>
		</div>
	);
}

export default ActionReviewButtons;

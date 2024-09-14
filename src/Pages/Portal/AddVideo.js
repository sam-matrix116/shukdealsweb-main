import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';

function AddVideo() {
	const { t } = useTranslation();
	const [title, setTitle] = useState('');
	const [link, setLink] = useState('');
	const Navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);

	const addUpdateNgoVideo = async (url) => {
		let ValidationArr = [
			[title, ValidationTypes.Empty, t('Please enter video title')],
			[link, ValidationTypes.Empty, t('Please enter video URL')],
		];
		let validate_ = await ValidateList(ValidationArr);
		if (!validate_) {
			return;
		}
		let obj = {
			title: title,
			link: link,
		};
		try {
			let resp = await FetchApi(url, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				Navigate(-1);
			}
		} catch (e) {}
	};

	const getVideoData = async () => {
		try {
			let resp = await FetchApi(Endpoints.getNgoVideoDetails + params?.id);
			if (resp && resp.status) {
				setTitle(resp?.data?.title);
				setLink(resp?.data?.link);
			}
		} catch (e) {}
	};

	useEffect(() => {
		if (window.location.pathname.includes('update')) {
			getVideoData();
		}
	}, []);

	return (
		<div>
			<CustomHeader />
			<CommonProfile />
			<div className='container py-4 border-top mb-3'>
				<div className='row justify-content-center'>
					<div className='col-lg-6 col-md-8 col-sm-10'>
						<h1 className='fs-30 text-gray1 pb-3 fs-sm-22'>{t('Add Video')}</h1>

						<form
							onSubmit={(e) => {
								if (window.location.pathname.includes('update')) {
									addUpdateNgoVideo(Endpoints.updateNgoVideo + params?.id);
								} else addUpdateNgoVideo(Endpoints.addNgoVideo);
								e.preventDefault();
							}}
							action=''
							className='site-form pt-md-2 profile-setup-form'
						>
							<div className='form-field mb-3'>
								<label for='' className='pb-2'>
									{t('Video Title')}
								</label>
								<input
									value={title}
									onChange={(e) => {
										setTitle(e.target.value);
									}}
									type='text'
									placeholder={t('Enter video title')}
								/>
							</div>

							<div className='form-field mb-3'>
								<label for='' className='pb-2'>
									{t('Video URL')}
								</label>
								<input
									value={link}
									onChange={(e) => {
										setLink(e.target.value);
									}}
									type='text'
									placeholder={t('Enter video URL')}
								/>
							</div>

							<button type='submit' className='button w-100 mt-2'>
								{t('Continue')}
							</button>
						</form>
					</div>
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default AddVideo;

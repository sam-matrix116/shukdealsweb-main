import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { imageCompressor } from '../../helpers/imageHelper';
import { BlobToFileConverter } from '../../helpers/fileHelper';
import ToastMessage from '../../Utils/ToastMessage';
import './style.css';

function CommonMultiImageUploader({
	// states
	imageState,
	imagesPreviewState,
	// update state
	setImages,
	setImagePreview,
	minLimit = 3,
	maxLimit = 5,
}) {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	const maxValidate = (event) => {
		let validate =
			imageState?.length > maxLimit ||
			imagesPreviewState?.length > maxLimit ||
			event?.target?.files?.length + imageState?.length > maxLimit ||
			event?.target?.files?.length + imagesPreviewState?.length > maxLimit;

		if (validate) {
			ToastMessage.Error(`${t("You can not uplaod more than")} ${maxLimit} ${t("Images")}`);
			return true;
		}
		return false;
	};

	const handleRemove = (event, indexToFilter) => {
		event.preventDefault();
		if (isLoading) {
			ToastMessage.Error(t(`Please wait while image's are being uploaded`));
			return;
		}
		setImages(imageState.filter((value, index) => index !== indexToFilter));
		setImagePreview(
			imagesPreviewState.filter((value, index) => index !== indexToFilter)
		);
	};

	const handleChange = (event) => {
		for (let i = 0; i < event?.target?.files?.length; i++) {
			setImagePreview((prevValues = []) => [
				...prevValues,
				URL.createObjectURL(event.target.files[i]),
			]);
		}
	};

	const handleImage = async (event) => {
		event.persist();
		if (maxValidate(event)) return;
		handleChange(event);

		setIsLoading(true);
		for (let i = 0; i < event?.target?.files?.length; i++) {
			const compressedImage = await imageCompressor(event?.target?.files?.[i]);
			if (compressedImage) {
				let file = BlobToFileConverter(compressedImage);
				setImages((values = []) => [...values, file]);
			}
		}
		setIsLoading(false);
		event.preventDefault();
	};
	return (
		<div className='form-field mb-3'>
			<label for='' className='pb-2 d-block '>
				<div className=' d-flex flex-column '>
					<span>{t('Add Pictures')}</span>
					<span
						className=' text-muted'
						style={{
							fontSize: '12px',
						}}
					>
						{minLimit == 1 && maxLimit == 1
							? t(`Please upload 1 square shape image for better visibility.`)
							: `${t("Min")}. ${minLimit} & ${t("Max")}. ${maxLimit}, ` + t("Please upload square shape image for better visibility.")}
					</span>
				</div>
			</label>
			<div className='d-flex gap-2'>
				{imagesPreviewState?.length ? (
					<div className='d-flex gap-1'>
						{imagesPreviewState?.map((img, i) => {
							return (
								<div
									onClick={(e) => handleRemove(e, i)}
									className='overlay-container image-container align-content-center border-0 text-gray2 rounded-10 fs-14 text-center'
								>
									<img src={img} alt={'image-' + i} key={i} className='preview-image' />
									{!isLoading && (
										<div class='image-overlay'>
											<div class='overlay-text'>{t('Remove')}</div>
										</div>
									)}
									{isLoading && (
										<div class='loading-overlay'>
											<div class='loader'></div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div>
						<input
							multiple
							onChange={async (e) => {
								if (e?.target?.files?.length) {
									await handleImage(e);
								}
							}}
							name='myImage'
							type='file'
							className='d-none'
							id='file'
							accept='image/*'
						/>
						<label
							for='file'
							className='custom-pic text-gray2 p-3 rounded-10 fs-14 light text-center'
						>
							<img
								src='assets/img/icon/camera-line.svg'
								className='d-block mx-auto'
								alt=''
							/>
							{t('Upload Pictures')}
						</label>
					</div>
				)}

				{maxLimit > 1 && imagesPreviewState?.length < maxLimit && (
					<div>
						<input
							multiple
							onChange={async (e) => {
								if (e?.target?.files?.length) {
									await handleImage(e);
								}
							}}
							name='myImage'
							type='file'
							className='d-none'
							id='file'
							accept='image/*'
						/>
						<label
							for='file'
							className='align-content-center custom-pic bg-blue border-0 text-gray2 rounded-10 fs-14 text-center'
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<img src='assets/img/icon/addpic.svg' alt='' />
						</label>
					</div>
				)}
			</div>
		</div>
	);
}

export default CommonMultiImageUploader;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import ToastMessage from '../../../Utils/ToastMessage';
import useModalContext from '../../../context/modalContext';

function ActionHelper({
	id,
	delId,
	dataType,
	setData,
	detailsPathName,
	removeDeleteBtn,
	// optional ->
	shareLink,
	shareType,
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { setIsShareModalVisible, setShareUrl } = useModalContext();
	const deleteId = delId ? delId : id;
	const navigateDetails = (e) => {
		e.preventDefault();
		if (dataType === 'favourite-ngo-video' && delId) {
			navigate({
				pathname: detailsPathName,
				search: createSearchParams({
					id: id,
					videoId: delId,
				}).toString(),
			});
		} else {
			navigate({
				pathname: detailsPathName,
				search: `?id=${id}`,
			});
		}
	};

	const handleRemoveWishlist = async (e) => {
		e.preventDefault();
		try {
			let resp = await FetchApi(
				dataType === 'favourite-classified'
					? Endpoints.addClassifiedWishlist + deleteId
					: dataType === 'favourite-weekly' || dataType === 'favourite-listing'
					? Endpoints.addDealWishlist + deleteId
					: dataType === 'favourite-user' ||
					  dataType === 'favourite-business' ||
					  dataType === 'favourite-ngo'
					? Endpoints.addUserWishlist + deleteId
					: dataType === 'favourite-deals'
					? Endpoints.addDealWishlist + deleteId
					: dataType === 'favourite-jobs'
					? Endpoints.addJobWislist + deleteId
					: dataType === 'favourite-ngo-video'
					? Endpoints.likeNgoVideos + deleteId
					: null
			);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
				setData((prev) => {
					return delId
						? prev.filter((item) => item?.id !== delId)
						: prev.filter((item) => item?.id !== id);
				});
				// getWishlist();
			}
		} catch (err) {
			console.log('error', err);
			return;
		}
	};

	const handleShare = (e) => {
		e.preventDefault();
		setIsShareModalVisible(true);
		setShareUrl({
			type: shareType,
			url: shareLink,
		});
	};
	// console.log('dataType', dataType);
	return (
		<div className='d-flex gap-2'>
			<button
				style={{ border: 'none' }}
				onClick={navigateDetails}
				className='bg-blue rounded-10 '
			>
				<img src='assets/img/icon/eye.svg' className='' />
			</button>

			<Link onClick={handleShare} className='bg-blue  rounded-10  '>
				<img src='assets/img/icon/share2.svg' />
			</Link>
			{!removeDeleteBtn && (
				<Link onClick={handleRemoveWishlist} className='bg-red rounded-10 '>
					<img src='assets/img/icon/trash.svg' className=' icon-red' />
				</Link>
			)}
		</div>
	);
}

export default ActionHelper;

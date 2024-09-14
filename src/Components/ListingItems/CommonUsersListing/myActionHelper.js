import React from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import ToastMessage from '../../../Utils/ToastMessage';
import Swal from 'sweetalert2';
import { setCookie } from '../../../helpers';
import ConfirmMessage from '../../../Utils/ConfirmMessage';

function MyActionHelper({
	id,
	detailId,
	dataType,
	setData,
	detailsPathName,
	editPathName,
	pathState,
	item,
	deleteConfirmMessage,
	removeDelete,
	redeemedUser,
	isPrimary,
	data
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				sessionStorage.setItem('user', JSON.stringify(resp.data));
			}
		} catch (e) {}
	};

	const markStripePrimary = async (id) => {
		try {
			let resp = await FetchApi(
				// Endpoints.makeStripeDefault + id,
				Endpoints.makeStripeDefault,
				{
					payment_method: id
				},
				// false,
				// '',
				// false,
				// 'GET'
				);
			if (resp && resp.status) {
				const updatedData = data.map(item => ({
					...item,
					is_default: item.id === id ? true : false
				}));
				setData(updatedData);
				ToastMessage.Success(resp?.message);
			}
		} catch (e) {}
	};

	const markTranzillaPrimary = async (id) => {
		try {
			let resp = await FetchApi(
				Endpoints.makeTranzillaDefault + id,
				{},
				false,
				'',
				false,
				'GET'
				);
			if (resp && resp.status) {
				if (resp && resp.status) {
					const updatedData = data.map(item => ({
						...item,
						is_default: item.id === id ? true : false
					}));
					setData(updatedData);
					ToastMessage.Success(resp?.message);
				}
			}
		} catch (e) {}
	};

	const navigateDetails = (e, url) => {
		e.preventDefault();
		if (url) {
			navigate({
				pathname: url,
				search: createSearchParams({
					id: id,
				}).toString(),
			});
		} else if (dataType === 'my-videos') {
			navigate({
				pathname: detailsPathName,
				search: createSearchParams({
					videoId: id,
				}).toString(),
			});
		} else {
			navigate({
				pathname: detailsPathName,
				search: `?id=${detailId ? detailId : id}`,
			});
		}
	};

	const handleDeleteDeal = async (e) => {
		e.preventDefault();

		let obj = {
			payment_method: id
		}
		try {
			let resp = await FetchApi(
				['my-realestate', 'my-deals', 'my-weekly'].includes(dataType)
					? Endpoints.deleteDeal + id
					: dataType === 'my-jobs'
					? Endpoints.deleteJobListing + id
					: dataType === 'my-classifieds'
					? Endpoints.deleteClassified + id
					: dataType === 'my-locations'
					? Endpoints.deleteLocation + id
					: dataType === 'my-family'
					? Endpoints.removeFamilyMember
					: dataType === 'my-videos'
					? Endpoints.deleteNgoVideos + id
					: dataType === 'my-payment-options'
					? "https://shukbackend.dignitech.com/en/" + Endpoints.deleteTranzillaPaymentMethod + id
					: null
			);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
				if (dataType !== 'my-family')
					setData((prev) => {
						return prev.filter((item) => item?.id !== id);
					});
				// getWishlist();
			}
		} catch (err) {
			console.log('error', err);
			return;
		}
	};

	const handleDeletePaymentMethod = async (e) => {
		e.preventDefault();

		let obj = {
			payment_method: item?.payment_method || item?.id
		}
		try {
			let resp = await FetchApi(
				// Endpoints.deleteStripePaymentMethod, obj
				"https://shukbackend.dignitech.com/en/" + 
			Endpoints.deleteStripePaymentMethod, obj
		);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
				if (dataType !== 'my-family')
					setData((prev) => {
						return prev.filter((item) => item?.id !== id);
					});
			}
		} catch (err) {
			console.log('error', err);
			return;
		}
	};
	// console.log('pathst', pathState);
	return (
		<div 
		className='d-flex gap-2'>
			{dataType !== 'my-locations' && detailsPathName && (
				<Link onClick={navigateDetails} className='bg-blue rounded-10 '>
					<img src='assets/img/icon/eye.svg' alt='' className='icon-red' />
				</Link>
			)}

			{editPathName && (
				<Link
					onClick={() => {
						setCookie('locationapidata', item);
					}}
					to={{
						pathname: editPathName,
						search: `?id=${id}`,
					}}
					state={pathState ? pathState : { dealData: item }}
					className='bg-green rounded-10 '
				>
					<img src='assets/img/icon/edit.svg' alt='' className='icon-green' />
				</Link>
			)}
			{!removeDelete && (
				<Link
					onClick={async (e) => {
						const confirm = await ConfirmMessage(deleteConfirmMessage);
						if (confirm?.isConfirmed) {
							if(dataType === 'my-payment-options' 
							// && item?.payment_method
							){
								handleDeletePaymentMethod(e);
							}
							else{
								handleDeleteDeal(e);
							}
							getProfileDetails()
						}
					}}
					className='bg-red rounded-10 '
				>
					<img 
					style={{
						width: isPrimary? '35px' : '',
						height: isPrimary? '35px': '',
						padding: isPrimary? '5px' : ''
					}}
					src='assets/img/icon/trash.svg' className=' icon-red' />
				</Link>
			)}
			{redeemedUser && (
				<Link
					onClick={(e) => navigateDetails(e, '/redeemed-deals-user')}
					className=' bg-warning rounded-10 '
				>
					<i className="fa-light fa-user-group fa-lg" ></i>
				</Link>
			)}

			{/* {isPrimary && (
				<Link onClick={()=>{
					markStripePrimary(item?.id)
					// if(item?.payment_method){
					// 	markStripePrimary(item?.id)
					// }
					// else {
					// 	markTranzillaPrimary(item?.id)
					// }
				}} 
				className='ms-4'>
					<button 
					className='button py-2 fs-12' 
					> {t("Set as Primary")} </button>
				</Link>
			)} */}
		</div>
	);
}

export default MyActionHelper;

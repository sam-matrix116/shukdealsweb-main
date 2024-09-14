/* eslint-disable jsx-a11y/alt-text */
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useModalContext from '../../context/modalContext';
import { checkTokenRedirect, getLoggedInUser } from '../../helpers/authUtils';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';
import { Endpoints } from '../../API/Endpoints';

function DetailPageActionButtons({
	detail_id,
	apiUrl,
	shareUrl,
	redeemUrl,
	added_to_wishlist,
	contactDetail,
	is_redeemed,
	categoryType,
	flagUrl,
	is_flagged = false,
}) {
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const {
		setIsShareModalVisible,
		setShareUrl,
		setIsTextBoxModalVisible,
		setTextBoxData,
	} = useModalContext();
	const [wishListAdded, setWishListAdded] = useState(added_to_wishlist);
	const [isFlagged, setIsFlagged] = useState(is_flagged);

	const handleAddToWishlist = async (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			try {
				let resp = await FetchApi(apiUrl);
				if (resp && resp.message) {
					ToastMessage.Success(resp.message);
				}
			} catch (err) {
				console.log('error', err);
				return;
			}
			setWishListAdded((prev) => !prev);
		}
	};

	const handleShare = (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			setIsShareModalVisible(true);
			setShareUrl({
				type: 'normal',
				url: shareUrl,
			});
		}
	};
	const handleRedeem = async (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			try {
				let resp = await FetchApi(redeemUrl);
				if (resp && resp.status && resp.message) {
					ToastMessage.Success(resp.message);
				} else {
					ToastMessage.Info(resp.message);
				}
			} catch (e) {
				if (e && e.response && e.response.data && e.response.data.message) {
					ToastMessage.Error(e.response.data.message);
				}
			}
		}
	};

	const handleFlag = (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else if (isFlagged) {
			ToastMessage.Error(t('Already FLagged!'));
		} else {
			setIsTextBoxModalVisible(true);
			setTextBoxData((values) => ({
				...values,
				flagUrl: flagUrl,
				id: detail_id,
				name: categoryType,
				setStateBack: setIsFlagged,
			}));
		}
	};
	const handleContact = (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
		}
	};

	return (
		<>
			{contactDetail && (
				<Link
					onClick={handleContact}
					class='d-flex gap-2 align-items-center fs-18 fs-sm-14 rounded-10 py-3 text-center text-black'
				>
					<i class='fa-regular fa-phone fa-xl'></i>
					<span className='fw-normal'>{t('Contact Now')}</span>
				</Link>
			)}
			<Link
				onClick={handleAddToWishlist}
				class='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'
			>
				<img
					src={`assets/img/icon/${wishListAdded ? 'wish_added' : 'wish'}.svg`}
					width='15'
					className='icon-blue'
				/>
			</Link>
			{redeemUrl &&
				!['ngo', 'business', 'non profitable organization'].includes(user?.user_type?.toLowerCase()) && (
					<Link
						onClick={handleRedeem}
						class='button w-100 fs-18 fs-sm-14 rounded-10 py-3 text-center text-white'
					>
						{t('Redeem')}
					</Link>
				)}
			<Link
				onClick={handleShare}
				class='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'
			>
				<img src='assets/img/icon/share2.svg' width='25' class='' />
			</Link>
			<Link
				onClick={handleFlag}
				class='bg-red job-share rounded-10  d-flex align-items-center justify-content-center'
			>
				{isFlagged ? (
					<img src='assets/img/icon/flag-fill.svg' width='14' class='' />
				) : (
					<img src='assets/img/icon/flag1.svg' width='14' class='' />
				)}
			</Link>
		</>
	);
}

export default DetailPageActionButtons;

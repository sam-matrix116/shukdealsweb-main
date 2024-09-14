import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { checkTokenRedirect } from '../../helpers/authUtils';
import ToastMessage from '../../Utils/ToastMessage';
import { FetchApi } from '../../API/FetchApi';
import useModalContext from '../../context/modalContext';

function WishlistShareVisit({
	apiUrl,
	added_to_wishlist,
	website_url,
	share_url,
	removeAddToWislist,
}) {
    const { t } = useTranslation();
	const [wishListAdded, setWishListAdded] = useState(added_to_wishlist);
	const { setIsShareModalVisible, setShareUrl } = useModalContext();

	const handleShare = (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			setIsShareModalVisible(true);
			setShareUrl({
				type: 'normal',
				url: share_url,
			});
		}
	};
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
	return (
		<>
			{!removeAddToWislist && (
				<Link onClick={handleAddToWishlist} className='button mb-lg-0 mb-2'>
					{!wishListAdded ? <img src='assets/img/icon/heart2.svg' /> : null}
					{wishListAdded ? t('Remove Favorite') : t('Add To Favorites')}
				</Link>
			)}
			{website_url && (
				<Link
					to={website_url}
					target='_blank'
					className='button secondary-btn  text-truncate'
					style={{
						maxWidth: '150px',
					}}
				>
					<img src='assets/img/icon/export.svg' />
					{website_url}
				</Link>
			)}
			{share_url && (
				<Link
					onClick={handleShare}
					className='bg-blue py-2 px-3 rounded-10 d-flex align-items-center justify-content-center'
				>
					<img src='assets/img/icon/share2.svg' />
				</Link>
			)}
		</>
	);
}

export default WishlistShareVisit;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useModalContext from '../../context/modalContext';
import { checkTokenRedirect } from '../../helpers/authUtils';

function AddWishlistShare({
	api,
	id,
	added_to_wishlist,
	callingApi,
	url,
	categoryType,
}) {
	const { setIsShareModalVisible, setShareUrl } = useModalContext();
	const [wishListAdded, setWishListAdded] = useState();
	const iconStyle = categoryType === 'jobs' ? 'job-icon' : 'icon-30';
	const { t } = useTranslation();

	const handleAddToWishlist = async (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			try {
				api(id);
			} catch (err) {
				console.log('error', err);
				return;
			}
			setWishListAdded((prev) => !prev);
			if (callingApi) callingApi();
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
				url: url,
			});
		}
	};

	useEffect(() => {
		setWishListAdded(added_to_wishlist);
	}, [added_to_wishlist]);

	return (
		<>
			<div className='d-flex gap-1 position-absolute top-0 end-0 p-lg-2 p-2'>
				<Link
					onClick={handleAddToWishlist}
					className={`${iconStyle} text-gray1 rounded-circle `}
				>
					{wishListAdded ? (
						<img src='assets/img/icon/wish_added.svg' width='15' />
					) : (
						<img src='assets/img/icon/wish.svg' width='15' />
					)}
				</Link>
				<Link
					className={`${iconStyle} text-gray1 rounded-circle`}
					onClick={handleShare}
				>
					<img src='assets/img/icon/share.svg' width='15' />
				</Link>
			</div>
		</>
	);
}

export default AddWishlistShare;

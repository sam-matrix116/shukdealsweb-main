import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { checkTokenRedirect } from '../../helpers';
import WishlistShareVisit from './WishlistShareVisit';
import useModalContext from '../../context/modalContext';
import ToastMessage from '../../Utils/ToastMessage';
import { Endpoints } from '../../API/Endpoints';

function ActionButtons({
	id,
	redeemed,
	wishlistUrl,
	added_to_wishlist,
	website_url,
	business_associated,
	user_associated,
	write_review,
	report,
	added_to_flag = false,
}) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { setIsTextBoxModalVisible, setTextBoxData } = useModalContext();
	const [isFlagged, setIsFlagged] = useState(added_to_flag);

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
				flagUrl: Endpoints.flagUser,
				id: id,
				name: 'user',
				setStateBack: setIsFlagged,
			}));
		}
	};
	const handleWriteReview = (e) => {
		e.preventDefault();
		if (!checkTokenRedirect()) {
			return;
		} else {
			window.scrollTo(0, 10000);
		}
	};
	// const handleRedirect = (e, url) => {
	// 	e.preventDefault();
	// 	navigate(
	// 		{ pathname: url },
	// 		{
	// 			state: {
	// 				accountId: id,
	// 			},
	// 		}
	// 	);
	// };

	return (
		<div className='col-lg-10 col-md-12 ps-lg-4'>
			<div className='d-sm-flex align-items-center justify-content-between ps-xl-2 gap-1 '>
				<div className='d-flex flex-column flex-lg-row gap-md-2 gap-1 align-items-start align-content-lg-center pb-sm-0 pb-1'>
					<div className='d-flex gap-1 justify-content-center'>
						{/* Associated  Business btn*/}
						{business_associated ? (
							<div
								// onClick={(e) => handleRedirect(e, '/ngo-business-associated')}
								className='redeem-btn'
							>
								<img src='assets/img/icon/bagtick2-sm.svg' /> {business_associated}{' '}
								{t('Business Associated')}
							</div>
						) : null}
						{/* Associated  User btn*/}
						{user_associated ? (
							<div
								// onClick={(e) => handleRedirect(e, '/ngo-member-associated')}
								className='redeem-btn'
							>
								<img src='assets/img/icon/profile2user.svg' /> {user_associated}{' '}
								{t('User Associated')}
							</div>
						) : null}
					</div>
					<div className='d-flex gap-1 justify-content-center'>
						{/*  Redeemed Btn*/}
						{redeemed ? (
							<span className='redeem-btn'>
								<img src='assets/img/icon/deal-redeemed.svg' /> {redeemed}{' '}
								{t('Redeemed')}
							</span>
						) : null}
						{/* write review */}
						{write_review && (
							<Link onClick={handleWriteReview} className='button'>
								<img alt='' src='assets/img/icon/messageedit.svg' />
								{t('Write Review')}
							</Link>
						)}
						{/* report/flag btn  */}
						{report && (
							<Link onClick={handleFlag} className='flag-btn'>
								{isFlagged ? (
									<img src='assets/img/icon/flag-fill.svg' height={22} alt='' />
								) : (
									<img src='assets/img/icon/flag1.svg' alt='' />
								)}
							</Link>
						)}
					</div>
				</div>

				{wishlistUrl && website_url && (
					<div className='d-flex gap-md-2 gap-1 align-items-center'>
						<WishlistShareVisit
							apiUrl={wishlistUrl}
							added_to_wishlist={added_to_wishlist}
							website_url={website_url}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default ActionButtons;

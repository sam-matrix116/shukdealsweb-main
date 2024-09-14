import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAllCookies, getRefreshToken } from '../../helpers/authUtils';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';

function DropDownMenu({ user }) {
	const { t } = useTranslation();
	const refresh_token = getRefreshToken();
	const navigate = useNavigate();
	let profileRedirect =
		user?.user_type && user?.user_type === 'Member'
			? '/user-profile-user-view'
			// : user?.user_type === 'NGO'
			: user?.user_type === 'Non Profitable Organization'
			? '/ngo-profile-ngo-view'
			: user?.user_type === 'Business'
			? '/business-profile-business-view'
			: user?.user_type === 'news_agency'
			? '/news-agency-profile-view'
			: null;

	const handleLogout = async () => {
		try {
			let resp = await FetchApi(Endpoints.logout, {
				refresh_token: refresh_token,
			});
			deleteAllCookies();
			if (resp && resp.status) {
				navigate('/login');
				ToastMessage.Success(resp.Message);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	return (
		<div
			className='profile-dropdown dropdown-menu dropdown-menu-end p-0'
			aria-labelledby='head_profile'
		>
			<ul>
				<li>
					<Link to='/landing'>
						<img
							src='assets/img/icon/header-home.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t('Home')}
					</Link>
				</li>
				<li>
					<Link to={profileRedirect}>
						<img
							src='assets/img/icon/header-profile.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t('Profile')}
					</Link>
				</li>
				<li>
					<Link to={'/wishlist'}>
						<img
							src='assets/img/icon/header-favourite.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t('Favorites')}
					</Link>
				</li>
				{!['Business', 'NGO', 'Non Profitable Organization'].includes(user?.user_type) && (
					<li>
						<Link to={'/classified-listing'}>
							<img
								src='assets/img/icon/header-job.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Your Classifieds')}
						</Link>
					</li>
				)}
				{user?.user_type !== 'Member' && user?.user_type !== 'News Agency' && (
					<>
						<li>
							<Link to={'/deal-listing'}>
								<img
									src='assets/img/icon/header-job.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								{t('Your deals')}
							</Link>
						</li>
						{/* <li>
							<Link to={'/job-listing'}>
								<img
									src='assets/img/icon/header-job.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								Job Posting
							</Link>
						</li> */}
					</>
				)}
				{/* <li>
					<Link to={''}>
						<img
							src='assets/img/icon/header-setting.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>{t("News & Articles")}
					</Link>
				</li> */}
				{!['business','ngo', 'Non Profitable Organization'].includes(user?.user_type?.toLowerCase()) && (
					<li>
						<Link to={'/redeemed-deals-listing'}>
							<img
								src='assets/img/icon/header-setting.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Redeemed Deals')}
						</Link>
					</li>
				)}

				{user?.user_type !== 'Member' && user?.user_type !== 'News Agency' && (
					<li>
						<Link to={'/weekly-listing'}>
							<img
								src='assets/img/icon/weekly-deal.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Weekly Deals')}
						</Link>
					</li>
				)}
				{!['NGO', 'Non Profitable Organization'].includes(user?.user_type) && user?.user_type !== 'News Agency' &&(
				<li>
					<Link to={'/payment-option'}>
						<img
							src='assets/img/icon/payment.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t("Payment Options")}
					</Link>
				</li>
				)}
				{!['NGO', 'Non Profitable Organization'].includes(user?.user_type) && (
					<li>
						<Link to={'/payment-history'}>
							<img
								src='assets/img/icon/payment.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Payment History')}
						</Link>
					</li>
				)}
				{['NGO', 'Non Profitable Organization'].includes(user?.user_type) && (
					<li>
						<Link to={'/payment-report'}>
							<img
								src='assets/img/icon/header-setting.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Payment Report')}
						</Link>
					</li>
				)}

				{/* {user?.user_type?.toLowerCase() === 'member' && (
					<li>
						<Link to={'/family-members-listing'}>
							<img
								src='assets/img/icon/header-setting.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>{t("Family Member")}
						</Link>
					</li>
				)} */}
				{user?.user_type?.toLowerCase() === 'business' && !user?.is_store && (
					<li>
						<Link to={'/location-listing'}>
							<img
								src='assets/img/icon/location.svg'
								width='15'
								height='15'
								className='me-2'
								alt=''
							/>
							{t('Your Locations')}
						</Link>
					</li>
				)}
				{['ngo', 'non profitable organization'].includes(user?.user_type?.toLowerCase()) && (
					<>
						<li>
							<a href='/video-listing'>
								<img
									src='assets/img/icon/header-setting.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								{t('Your Videos')}
							</a>
						</li>
						<li>
							<a href='/ngo-referal'>
								<img
									src='assets/img/icon/header-setting.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								{t('Referral')}
							</a>
						</li>
						<li>
							<a href='/ngo-business-associated'>
								<img
									src='assets/img/icon/header-setting.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								{t('Associated Business')}
							</a>
						</li>
						<li>
							<a href='/ngo-member-associated'>
								<img
									src='assets/img/icon/header-setting.svg'
									width='15'
									height='15'
									className='me-2'
									alt=''
								/>
								{t('Associated Member')}
							</a>
						</li>
					</>
				)}
				{/* <li>
					<Link to={''}>
						<img
							src='assets/img/icon/header-setting.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>{t("Newsletter")}
					</Link>
				</li> */}
				<li>
					<Link to={'/settings'}>
						<img
							src='assets/img/icon/header-setting.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t('Settings')}
					</Link>
				</li>
				<li>
					<Link onClick={handleLogout} to='/login' replace>
						<img
							src='assets/img/icon/header-logout.svg'
							width='15'
							height='15'
							className='me-2'
							alt=''
						/>
						{t('Log Out')}
					</Link>
				</li>
			</ul>
		</div>
	);
}

export default DropDownMenu;

import React from 'react';
import { useTranslation } from 'react-i18next';

function OnlineOfflineIcon({ deal_type }) {
	const { t } = useTranslation();

	return (
		<p className='fs-14 text-blue fs-sm-9 pt-2'>
			{deal_type === 'online' ? (
				<img alt='onlne' src='assets/img/icon/online.svg' className='me-1' />
			) : deal_type === 'offline' ? (
				<img alt='offline' src='assets/img/icon/building3.svg' className='me-1' />
			) : (
				<img
					alt='online_offline'
					src='assets/img/icon/online_offline.svg'
					className='me-1'
				/>
			)}
			{t('Use')} {deal_type === 'online_offline' ? t('online/offline') : t(deal_type)}
		</p>
	);
}

export default OnlineOfflineIcon;

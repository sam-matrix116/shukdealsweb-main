import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './referralBox.css';
import ToastMessage from '../../../Utils/ToastMessage';
import { Endpoints } from '../../../API/Endpoints';
import { getLoggedInUser } from '../../../helpers';
import { useTranslation } from 'react-i18next';

const NgoReferal = () => {
	const {t} = useTranslation();
	const user = getLoggedInUser();
	const [referralLink, setReferralLink] = useState(
		Endpoints.frontendUrl + '/signup-choose-ngo?referal_token=' + user?.ngo_referal_token
	);
	const [copied, setCopied] = useState(false);

	const handleCopyLink = () => {
		setCopied(true);
		ToastMessage.Success('Referral link copied to clipboard!');
	};

	return (
		<div className='referral-box'>
			<h2 className='referral-h2'>{t("Referral Link")}</h2>
			<p className='referral-p'>
				{t("You can use the below referral link and share it with businesses or users you want to invite to this platform.")}
			</p>
			<div className='referral-content'>
				<div className='input-container'>
					<h3 className='referral-h3 '>{t("Referral Link")}</h3>
					<input
						disabled={true}
						value={referralLink}
						className={`${copied ? 'copy-input-copied' : ''} referral-input`}
					/>
				</div>
				<CopyToClipboard text={referralLink} onCopy={handleCopyLink}>
					<div className='button-container'>
						<h3 className='referral-h3 '>{t("SHARE")}</h3>
						<button className={`${copied ? 'copy-btn-copied' : ''} referral-button`}>
							{copied ? 'Copied!' : t('Copy Link')}
						</button>
					</div>
				</CopyToClipboard>
			</div>
		</div>
	);
};

export default NgoReferal;

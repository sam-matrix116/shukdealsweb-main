import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
	InstapaperIcon,
	InstapaperShareButton,
	LinkedinIcon,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Endpoints } from '../../API/Endpoints';

function ShareModal({ setIsmodalVisible, isModalVisible, shareUrl }) {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);
	const [url, setUrl] = useState('');
	// const handleCopyLinkClick = () => {
	// 	setCopied(true);

	// 	// Reset the "Copied" state after a delay (e.g., 2 seconds)
	// 	setTimeout(() => {
	// 		setCopied(false);
	// 	}, 2000); // Adjust the delay as needed
	// };
	useEffect(() => {
		setUrl(
			shareUrl?.type === 'normal'
				? 'http://shukdeals.dignitech.com/' + shareUrl?.url
				: shareUrl?.url
		);
	}, []);
	// console.log({ url });
	// console.log('shareurl___', shareUrl);
	// console.log('url___', url);

	return (
		<>
			{isModalVisible && (
				<div
					className='modal d-block submitted-modal'
					id='business_submitted'
					tabindex='-1'
					aria-labelledby='business_submitted'
					aria-hidden='true'
				>
					<div className='modal-dialog modal-dialog-centered mw-400'>
						<div className='modal-content rounded-20 border-0 '>
							<div className='modal-body text-center py-4 px-md-5'>
								<div className='form-field mb-4 mt-4'>
									<div>{t("Select Platform")}</div>
									<FacebookShareButton 
										// url={url} 
										url={shareUrl?.type === 'normal'
										? 'http://shukdeals.dignitech.com/' + shareUrl?.url
										: shareUrl?.url}
										quote={'best deal'}>
										<FacebookIcon size={40} round={true} />
									</FacebookShareButton>
									<TwitterShareButton 
										// url={url}
										url={shareUrl?.type === 'normal'
										? 'http://shukdeals.dignitech.com/' + shareUrl?.url
										: shareUrl?.url}
									>
										<TwitterIcon size={40} round={true} style={{ margin: '10px' }} />
									</TwitterShareButton>
									<EmailShareButton url={url}>
										<EmailIcon size={40} round={true} style={{ margin: '10px' }} />
									</EmailShareButton>
									<CopyToClipboard
										text={
											shareUrl?.type === 'normal'
												? Endpoints?.frontendUrl + shareUrl?.url
												: shareUrl?.url
										}
									>
										<button
											style={{ border: 'none', backgroundColor: 'transparent' }}
											onClick={(e) => {
												e.preventDefault();
												setCopied(true);
											}}
										>
											{copied ? 'Copied!' : t('Copy Link')}
										</button>
									</CopyToClipboard>

									{/* <TelegramShareButton
										url={'http://shukdeals.dignitech.com/' + shareUrl}
									>
										<TelegramIcon size={40} round={true} style={{ margin: '10px' }} />
									</TelegramShareButton>
									<WhatsappShareButton
										url={'http://shukdeals.dignitech.com/' + shareUrl}
									>
										<WhatsappIcon size={40} round={true} style={{ margin: '10px' }} />
									</WhatsappShareButton> */}
								</div>
								<div className='row'>
									{/* <button
										onClick={() => {
											// setIsmodalVisible(!isModalVisible);
										}}
										className='button rounded-10 px-4 py-2 col me-2'
									>{t("Authenticate")}
									</button> */}
									<button
										onClick={() => {
											setIsmodalVisible(!isModalVisible);
											setCopied(false);
										}}
										className='button rounded-10 px-4 py-2 col'
									>
										{t('Cancel')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default ShareModal;

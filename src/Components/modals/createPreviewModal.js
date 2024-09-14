import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import VerticalThumbnailCrousel from '../CommonCrousel/VerticalThumbnailCrousel';
import { getLoggedInUser } from '../../helpers/authUtils';
import { Link, useNavigate } from 'react-router-dom';
import OnlineOfflineIcon from '../CommonUiComponents/online_offline';

function CreatePreviewModal({ isModalVisible, data }) {
	const { t } = useTranslation();
	const {
		categoryType,
		// main data
		callingApi,
		title,
		imagePreview,
		expiryDate,
		description,
		// weekly
		freeDiscountValue,
		dealType,
		actualPrice,
		freeDiscountType,
		clubDiscountType,
		clubDiscountValue,
		// classified
		city,
		state,
		country,
		monthlyPrice,
		contactEmail,
		contactPhone,
	} = data;
	const navigate = useNavigate();
	const user = getLoggedInUser();
	return (
		<>
			{isModalVisible && (
				<div
					className=''
					id='preview'
					tabindex='-1'
					aria-labelledby='addmodalLabel'
					aria-modal='true'
					role='dialog'
				>
					<div className='modal-dialog modal-dialog-top popup-md'>
						<div className='modal-content rounded-20 border-0'>
							<div className='modal-header border-0 p-0'>
								<button
									type='button'
									className='outside-close bg-transparent border-0'
									data-bs-dismiss='modal'
									aria-label='Close'
								>
									<img src='assets/img/icon/close.svg' alt='' />
								</button>
							</div>
							<div className='modal-body px-4 pb-4'>
								<h4 className='fs-22 text-gray1 border-bottom py-2'>{t('Preview')}</h4>
								<div className='d-flex gap-3 px-3 border-bottom'>
									<div className='flex-3'>
										{categoryType === 'preview-weekly' ? (
											<div className='weekly-deal-left position-relative'>
												<img src={imagePreview?.[0]} alt='' />
												<div className='position-absolute start-0 top-0 h-100 d-flex flex-column align-items-center justify-content-center text-center py-3 px-2'>
													<h4 className='bold text-white fs-sm-24'>
														{freeDiscountValue}% OFF
													</h4>
													<p className='m-0 text-white fs-30 light py-2 fs-sm-18'>{title}</p>
												</div>
											</div>
										) : categoryType === 'preview-classifieds' ? (
											<div className=' position-relative'>
												<VerticalThumbnailCrousel images={imagePreview} />
											</div>
										) : null}
									</div>

									<div className='flex-3 pt-4'>
										{categoryType === 'preview-weekly' ? (
											<>
												<div className='d-flex align-items-center gap-lg-3  gap-2 pb-2 deal-content-row pb-3'>
													<span className='redeem-btn fs-14'>
														<img src='assets/img/icon/deal-redeemed.svg' /> 2,000 {t("Redeemed")}
													</span>
													<p className='m-0 fs-12 fs-sm-9'>
														{t('Posted') + ':'} {moment(new Date()).format('DD MMM YYYY')}
													</p>
													<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
														<p className='text-gray1 fs-sm-9 m-0'>{t("Expire in:")} </p>
														<img
															src='assets/img/icon/timer2.svg'
															className='mx-1'
															width='14'
														/>
														{expiryDate ? moment(expiryDate).format('DD MMM YYYY') : '7 days'}
													</div>
												</div>
												<h3 className='fs-22 text-black fs-sm-16 pb-2'>{title}</h3>
												<div className='text-justify fs-12 light text-gray2 pb-2'>
													<p>{description}</p>
												</div>
												<OnlineOfflineIcon deal_type={dealType} />{' '}
											</>
										) : categoryType === 'preview-classifieds' ? (
											<>
												<div className='pb-2'>
													<span className='fs-14 fs-sm-10'>
														<img src='assets/img/icon/location1.svg' alt='' />
														{' ' + city + ', ' + state + ', ' + country}
													</span>
												</div>
												<h3 className='fs-22 text-black fs-sm-18 pb-2'>{title}</h3>
												<div className='d-flex align-items-center gap-lg-3  gap-2 deal-content-row '>
													<p className='m-0 fs-12 fs-sm-9'>
														{t('Posted') + ':'} {moment(new Date()).format('DD MMM YYYY')}
													</p>
													<div className='text-green fs-12 d-flex align-items-center fs-sm-9'>
														<p className='text-gray1 fs-sm-9 m-0'>Expire in </p>
														<img
															src='assets/img/icon/timer2.svg'
															className='mx-1'
															width='14'
														/>
														{moment(expiryDate).format('DD MMM YYYY')}
													</div>
												</div>

												<div className='text-justify fs-12 light text-gray2 pb-2'>
													<p>{description}</p>
												</div>

												<h3 className='medium fs-28 text-blue py-3'>
													${parseInt(monthlyPrice)?.toFixed?.(2)}
												</h3>
												<p className='text-black m-0 fs-12'>
													{t("Contact")} {user.firstname} {t("For more details:")}
												</p>
												<p className='text-gray2 my-2 fs-12'>
													<img src='assets/img/icon/call.svg' width='15' className='me-2' />
													{contactPhone}
												</p>
												<p className='text-gray2 m-0 fs-12'>
													<img src='assets/img/icon/mail.svg' width='15' className='me-2' />
													{contactEmail}
												</p>
											</>
										) : null}

										{categoryType === 'preview-weekly' ? (
											<div className='rounded-10 bg-blue py-lg-4 py-lg-4 p-3 d-flex align-items-center justify-content-center gap-2'>
												<span className='medium text-gray1 fs-18 fs-sm-14'>
													{t("All Members")}
												</span>
												<span className='medium text-blue fs-30 fs-sm-18'>
													{freeDiscountType == 'fixed'
														? 'Flat ' + freeDiscountValue + ' ' + t("OFF")
														: freeDiscountValue + '% ' + t("OFF")}
												</span>
												<del className='medium text-gray1 fs-18 fs-sm-12'>
													${parseInt(actualPrice)?.toFixed(2)}
												</del>
												<ins className='medium text-blue fs-18 text-decoration-none fs-sm-12'>
													$
													{freeDiscountType == 'fixed'
														? (parseInt(actualPrice) - freeDiscountValue).toFixed(2)
														: (
																parseInt(actualPrice) -
																actualPrice * (freeDiscountValue / 100)
														  ).toFixed(2)}
												</ins>
											</div>
										) : categoryType === 'preview-weekly' ? (
											<div className='d-flex align-items-center  w-100'>
												<div className='deal-club-member py-2 px-lg-3 px-2'>
													<span className='medium text-gray1 fs-16 fs-sm-12 d-block pb-1'>
														{t("Club Member")}
													</span>
													<span className='medium text-blue fs-22 fs-sm-18 pb-1 d-block'>
														{clubDiscountType == 'fixed'
															? 'Flat ' + clubDiscountValue + ' ' + t("OFF")
															: clubDiscountValue + '% ' + t("OFF")}
													</span>
													<div className='d-flex gap-3'>
														<del className='medium text-gray1 fs-14 fs-sm-12'>
															${parseInt(actualPrice)?.toFixed(2)}
														</del>
														<ins className='medium text-blue fs-14 text-decoration-none fs-sm-12'>
															$
															{clubDiscountType == 'fixed'
																? (parseInt(actualPrice) - clubDiscountValue).toFixed(2)
																: (
																		parseInt(actualPrice) -
																		actualPrice * (clubDiscountValue / 100)
																  ).toFixed(2)}
														</ins>
													</div>
												</div>
												<div className='deal-nonclub-member py-2 px-lg-3 px-2'>
													<span className='light text-gray1 fs-16 fs-sm-12 d-block pb-1'>
														{t('Non-Club Member')}
													</span>
													<span className='medium text-gray2 fs-22 fs-sm-18 pb-1 d-block'>
														{freeDiscountType == 'fixed'
															? 'Flat ' + freeDiscountValue + ' ' + t("OFF")
															: freeDiscountValue + '% ' + t("OFF")}
													</span>

													<div className='d-flex gap-3'>
														<del className='medium text-gray1 fs-18 fs-sm-12'>
															${parseInt(actualPrice)?.toFixed(2)}
														</del>
														<ins className='medium text-blue fs-18 text-decoration-none fs-sm-12'>
															$
															{freeDiscountType == 'fixed'
																? (parseInt(actualPrice) - freeDiscountValue).toFixed(2)
																: (
																		parseInt(actualPrice) -
																		actualPrice * (freeDiscountValue / 100)
																  ).toFixed(2)}
														</ins>
													</div>
												</div>
											</div>
										) : null}

										<div className='d-flex align-items-center justify-content-between gap-md-2 gap-1 pt-4'>
											<Link
												to={''}
												className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'
											>
												<img
													src='assets/img/icon/wish.svg'
													width='20'
													className='icon-blue'
												/>
											</Link>
											{categoryType === 'preview-weekly' && (
												<Link
													to={''}
													className='button w-100 fs-18 fs-sm-14 rounded-10 py-3 text-center text-white'
													data-bs-toggle='modal'
													data-bs-target='#redeem'
												>
													{t('Redeem')}
												</Link>
											)}

											<Link
												to={''}
												className='bg-blue job-share rounded-10 d-flex align-items-center justify-content-center'
											>
												<img src='assets/img/icon/share2.svg' width='25' className='' />
											</Link>
											<Link
												to={''}
												className='bg-red job-share rounded-10  d-flex align-items-center justify-content-center'
											>
												<img src='assets/img/icon/flag1.svg' width='14' className='' />
											</Link>
										</div>
									</div>
								</div>
								<div className='d-flex justify-content-center gap-3 pt-3 btn-group'>
									<button
										className='button gray-btn rounded-10 fs-12 medium'
										data-bs-dismiss='modal'
										aria-label='Close'
									>
										{t('Back To Edit')}
									</button>
									<button
										onClick={(e) => {
											callingApi();
											navigate(-1);
											e.preventDefault();
										}}
										data-bs-dismiss='modal'
										className='button rounded-10 fs-12 medium'
									>
										{t('Publish')}
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

export default CreatePreviewModal;

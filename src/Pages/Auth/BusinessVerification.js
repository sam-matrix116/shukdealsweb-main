import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import Images from '../../Images';

function BusinessVerification() {
    const { t } = useTranslation();
	const [isModalVisible, setIsmodalVisible] = useState(false);
	const navigate = useNavigate();
	return (
		<div>
			<CustomHeader external />
			<div class='main main-login '>
				<div class='container '>
					<div class='row justify-content-center'>
						<div class='col-lg-6 col-md-8 col-sm-10 col-12 signup-mid-column py-md-0 pt-5'>
							<div class='px-lg-5 px-sm-3 py-4'>
								<h1 class='text-gray1 text-center fs-34 medium pb-3 pt-md-5'>
									Fill The Form
								</h1>

								<form
									onSubmit={(e) => {
										// Swal.fire({
										//     icon : 'success',
										//     text : "Good job! Thanks for submitting the form!"
										// })
										setIsmodalVisible(!isModalVisible);
										e.preventDefault();
									}}
									action=''
									class='site-form pt-2'
								>
									<div class='form-field mb-3'>
										<label for='' class='pb-2'>{t("Name Of Business")}
										</label>
										<input type='text' placeholder='Lorem ipsum' />
									</div>
									<div class='mb-3'>
										<label for='' class='pb-2'>
											Business Mobile Number
										</label>
										<div class='d-flex'>
											<div class='form-field  d-flex align-items-center field-phone w-100'>
												<select class='d-none languages '>
													{/* <option value="in" data-thumbnail="assets/img/flag.svg" selected>IND</option> */}
													<option value='in' data-thumbnail={Images.flag} selected>
														IND
													</option>
													<option
														value='us'
														data-thumbnail='assets/img/icon/united-states.png'
													>
														USA
													</option>
													<option
														value='uk'
														data-thumbnail='assets/img/icon/united-kingdom.png'
													>
														UK
													</option>
													<option value='de' data-thumbnail='assets/img/icon/germany.png'>
														GER
													</option>
													<option value='de' data-thumbnail='assets/img/icon/france.png'>
														France
													</option>
												</select>

												<div class='lang-select'>
													<span class='selected-lang'></span>
													<div class='lang-dropdown'>
														<ul id='lang_list'></ul>
													</div>
												</div>

												<input type='tel' placeholder='1234567890' />
											</div>
										</div>
									</div>
									<div class='form-field mb-3'>
										<label for='' class='pb-2'>{t("Business Email Address")}
										</label>
										<input type='email' placeholder='mail@gmail.com' />
									</div>
									<div class='form-field mb-3'>
										<label for='' class='pb-2'>
											Business Website URL
										</label>
										<input type='text' placeholder='Lorem ipsum' />
									</div>
									<div class='form-field mb-3'>
										<label for='' class='pb-2'>
											Field 4
										</label>
										<input type='text' placeholder='Lorem ipsum' />
									</div>
									<div class='form-field mb-3'>
										<label for='' class='pb-2'>
											Field 5
										</label>
										<input type='text' placeholder='Lorem ipsum' />
									</div>
									<div class='form-field mb-4'>
										<label for='' class='pb-2'>
											Field 6
										</label>
										<input type='text' placeholder='Lorem ipsum' />
									</div>

									<button class='button w-100 rounded-10'>{t("Continue")}</button>
								</form>
								<div class='pt-3 fs-14'>
									<p>
									{t('By creating an account, you agree to ShukDeals')}{' '}
										<Link to={'/terms-conditions'} className='medium'>
											{t('Terms & Conditions')}
										</Link>{' '}
										{t("and")} <Link to={'/privacy-policy'}>{t('Privacy Policy')}</Link>
									</p>
								</div>

								<div class='text-center pt-3 mb-md-4 mb-2'>
									<Link
										onClick={() => {
											navigate(-1);
										}}
										class='medium d-block'
									>{t("Back")}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				{isModalVisible ? (
					<div
						class='modal d-block submitted-modal'
						id='business_submitted'
						tabindex='-1'
						aria-labelledby='business_submitted'
						aria-hidden='true'
					>
						<div class='modal-dialog modal-dialog-centered mw-400'>
							<div class='modal-content rounded-20 border-0 '>
								<div class='modal-body text-center py-4 px-md-5'>
									<span class='d-block text-blue fs-38'>
										<i class='fa-light fa-circle-check'></i>
									</span>
									<h3 class='fs-20 py-3'>Good job! Thanks for submitting the form!</h3>
									<button
										onClick={() => {
											setIsmodalVisible(!isModalVisible);
										}}
										class='button rounded-10 px-5 py-3'
									>
										Ok
									</button>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
			<CustomFooter />
		</div>
	);
}

export default BusinessVerification;

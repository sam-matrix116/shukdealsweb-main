import React from 'react';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import img from '../../Images';
import i18next from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ChooseNgo() {
	const { t, i18n } = useTranslation();
	useEffect(() => {
		i18n.changeLanguage('en');
	}, []);
	return (
		<div class='wrapper position-relative'>
			<CustomHeader external />

			<div class='main signup-column pt-5 main-login'>
				<div class='container pt-5 signup-column-left '>
					<div class='row'>
						<div class='col-md-6'>
							<div class='text-center pe-lg-4'>
								<img src='assets/img/Bag image.svg' alt='shukDeals' />
							</div>
						</div>

						<div class='col-md-6 signup-column-right'>
							<div class='px-lg-5 pb-md-5'>
								<h1 class='text-gray1 fs-34 medium pb-3'>{t("Let’s Start")}</h1>
								<p class=' pb-3 m-0'>{t("Choose type of membership type")}</p>

								<form action='' class='site-form pt-2'>
									<div class='row mb-4 membership-row'>
										<div class='col-lg-3 col-6 mb-2 d-flex'>
											<input
												type='radio'
												name='membership_type'
												id='member_1'
												class='d-none'
												checked
											/>
											<label
												for='member_1'
												class='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100'
											>
												<img src='assets/img/icon/usersquare.svg' height='30' alt='' />
												<p class='m-0 pt-3 fs-sm-12'>{t("Become a Club Member")}</p>
											</label>
										</div>

										<div class='col-lg-3 col-6 mb-2 d-flex'>
											<input
												type='radio'
												name='membership_type'
												id='member_2'
												class='d-none'
											/>
											<label
												for='member_2'
												class='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100'
											>
												<img src='assets/img/icon/bagtick2.svg' height='30' alt='' />
												<p class='m-0 pt-3 fs-sm-12'>{t("List your Business")}</p>
											</label>
										</div>

										<div class='col-lg-3 col-6 mb-2 d-flex'>
											<input
												type='radio'
												name='membership_type'
												id='member_3'
												class='d-none'
											/>
											<label
												for='member_3'
												class='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100'
											>
												<img
													src='assets/img/icon/non-profit-organization 1.svg'
													height='30'
													alt=''
												/>
												<p class='m-0 pt-3 fs-sm-12'>{t("Become an Non-Profit Organizations Partner")}</p>
											</label>
										</div>

										<div class='col-lg-3 col-6 mb-2 d-flex '>
											<input
												type='radio'
												name='membership_type'
												id='member_4'
												class='d-none'
											/>
											<label
												for='member_4'
												class='bg-white rounded-15 px-lg-2 py-lg-3 p-md-3 p-2 text-center w-100 fs-14'
											>
												<img src='assets/img/icon/microphone2.svg' height='30' alt='' />
												<p class='m-0 pt-3 fs-sm-12'>Start as a News Agency</p>
											</label>
										</div>
									</div>

									<div class='form-field mb-4 pb-2 '>
										<label for='' class='d-block pb-2'>
											{t("Choose Who To Support")}
										</label>
										<div class='bg-white d-flex align-items-center rounded-15 gap-2'>
											<select name='currency' id='ngo'>
												<option
													value='ad'
													data-image='assets/img/icon/ngo-icon.svg'
													data-imagecss='NGO'
													data-title='Keran Hayasod / Jewish Agency'
												>
													Keran Hayasod / Jewish Agency
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-2.svg'
													data-imagecss='NGO'
													data-title='NGO 2'
												>
													NGO 2
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-3.svg'
													data-imagecss='NGO'
													data-title='NGO 3'
												>
													NGO 3
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-4.svg'
													data-imagecss='NGO'
													data-title='NGO 4'
												>
													NGO 4
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-3.svg'
													data-imagecss='NGO'
													data-title='NGO 5'
												>
													NGO 5
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-18.svg'
													data-imagecss='NGO'
													data-title='NGO 6'
												>
													NGO 6
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-7.svg'
													data-imagecss='NGO'
													data-title='NGO 7'
												>
													NGO 7
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-8.svg'
													data-imagecss='NGO'
													data-title='NGO 8'
												>
													NGO 8
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-9.svg'
													data-imagecss='NGO'
													data-title='NGO 9'
												>
													NGO 9
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-10.svg'
													data-imagecss='NGO'
													data-title='NGO 10'
												>
													NGO 10
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-11.svg'
													data-imagecss='NGO'
													data-title='NGO 11'
												>
													NGO 11
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-12.svg'
													data-imagecss='NGO'
													data-title='NGO 12'
												>
													NGO 12
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-13.svg'
													data-imagecss='NGO'
													data-title='NGO 13'
												>
													NGO 13
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-14.svg'
													data-imagecss='NGO'
													data-title='NGO 14'
												>
													NGO 14
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-12.svg'
													data-imagecss='NGO'
													data-title='NGO 15'
												>
													NGO 15
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-16.svg'
													data-imagecss='NGO'
													data-title='NGO 16'
												>
													NGO 16
												</option>
												<option
													value='af'
													data-image='assets/img/icon/ngo-17.svg'
													data-imagecss='NGO'
													data-title='NGO 17'
												>
													NGO 17
												</option>
												<option
													value='ae'
													data-image='assets/img/icon/ngo-18.svg'
													data-imagecss='NGO'
													data-title='NGO 18'
												>
													NGO 18
												</option>
											</select>
										</div>
									</div>

									<button class='button w-100 rounded-10'>{t("Continue")}</button>
								</form>

								<div class='text-center pt-4'>
									<p>{t("Already have an account? ")}{' '}
										<a href='#' class='medium'>{t("Login")}
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CustomFooter />
		</div>
	);
}

export default ChooseNgo;

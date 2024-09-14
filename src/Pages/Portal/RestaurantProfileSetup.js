import React from 'react';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import CustomFooter from '../../Components/CustomFooter';
import CustomHeader from '../../Components/CustomHeader';
import Select from 'react-select';
import { getLoggedInUser } from '../../helpers';

function RestaurantProfileSetup() {
    const { t } = useTranslation();
	const user = getLoggedInUser();
	const [deliveryPartner, setDeliveryPartner] = useState('Wolt');
	const options = [
		{ value: 'Wolt', label: 'Wolt' },
		{ value: 'Wolt1', label: 'Wolt1' },
		{ value: 'Wolt2', label: 'Wolt2' },
	];

	return (
		<div className='wrapper'>
			<CustomHeader />
			<div className='main'>
				<div className='cover-picture'>
					<input
						name='myImage'
						type='file'
						className='d-none'
						id='file'
						accept='image/*'
					/>
					<label
						for='file'
						className='upload-file d-flex align-items-center justify-content-center fs-22 fs-sm-18 text-white regular medium'
					>
						<img src='assets/img/icon/cover-picture.svg' className='me-2' alt='' />
						{t("Upload Cover Picture")}
					</label>
				</div>

				<div className='profile-top-content pb-lg-4'>
					<div className='container'>
						<div className='row align-items-start'>
							<div className='col-lg-2 col-md-3 col-4'>
								<div className='position-relative profile-thumb overflow-hidden rounded-circle'>
									<input type='file' id='profile-field' />
									<img
										src='assets/img/edit-profile.png'
										className='profile-pic rounded-circle'
									/>
									<label
										for='profile-field'
										className='profile-upload d-flex align-items-center justify-content-center start-0 bottom-0 position-absolute'
									>
										<img src='assets/img/icon/cover-picture.svg' alt='' />
									</label>
								</div>
							</div>
							<div className='col-lg-10 col-md-9 col-8 pt-md-4 pt-2'>
								<div className='d-md-flex align-items-start w-100'>
									<div className='d-flex gap-2 align-items-center pb-md-0 pb-2'>
										{user?.plan?.name && user?.plan?.name != 'Basic' && (
											<img
												src={'assets/img/favicon.svg'}
												className='me-md-2 me-1 profile-site-logo'
												width='27'
												alt=''
											/>
										)}
										<h3 className='fs-26 medium text-blue  fs-sm-18'>Pizza hut</h3>
									</div>

									<div className='ms-md-auto profile-ngo-box'>
										<div className='shadow px-2 py-2 d-flex align-items-center gap-2 rounded-15 pe-lg-5'>
											<img src='assets/img/ngo-logo2.png' alt='' className='ms-xl-1' />
											<h5 className='fs-16 bold pe-xl-1 fs-sm-9'>Keren Hayesod</h5>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='container border-top py-4'>
					<div className='row justify-content-center'>
						<div className='col-lg-6 col-md-8'>
							<h1 className='fs-30 text-gray1 pb-2 fs-sm-24'>{t("Basic Information")}</h1>
							<form action='' className='site-form py-md-2 profile-setup-form'>
								<div className='form-field mb-3 position-relative'>
									<label for='' className='pb-2'>{t("About")}
									</label>
									<textarea
										name='the-textarea'
										cols='10'
										rows='4'
										id='the-textarea'
										maxlength='300'
										placeholder='Lorem Ipsum'
										autofocus
									></textarea>
									<div id='the-count' className='fs-14 text-gray2 light'>
										<span id='current'>0</span>
										<span id='maximum'>/ 300</span>
									</div>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										Business Category
									</label>
									<select name='' id=''>
										<option value='Business Category'>Business Category</option>
										<option value='Business Category'>Business Category 1</option>
										<option value='Business Category'>Business Category 2</option>
										<option value='Business Category'>Business Category 3</option>
									</select>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Business Contact Number")}
									</label>
									<input
										type='tel'
										className='bg-gray'
										placeholder='+972 888 888 8888'
									/>
									<span className='light fs-14 text-blue pt-1'>{t("Change phone number")}</span>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Business Email Address")}
									</label>
									<input
										type='email'
										className='bg-gray'
										placeholder='business@gmail.com'
									/>
									<span className='light fs-14 text-blue pt-1'>Change email number</span>
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Website URL")}
									</label>
									<input type='text' placeholder='https://www.domainname.com' />
									<h6 className='fs-14 light pt-1'>
										{t("If you don’t have a website wix.com will provide you with one for free")}{' '}
										<span className='fs-16 medium'>Wix.com</span>
									</h6>
								</div>

								<h2 className='fs-30 text-gray1 py-2 fs-sm-24'>{t("Add Location")}</h2>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Location")}
									</label>
									<input type='text' className='location' placeholder='Enter location' />
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Apartment/Street Address")} {t("(Optional)")}
									</label>
									<input type='text' placeholder={t('Address')} />
								</div>

								<div className='row'>
									<div className='col-md-6'>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("City")}
											</label>
											<input type='text' placeholder={t('Enter City')} />
										</div>
									</div>
									<div className='col-md-6'>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("State")}
											</label>
											<select name='' id=''>
												<option value='state'>{t("Enter City")}</option>
												<option value='state'>{t("Enter City")} 1</option>
												<option value='state'>{t("Enter City")} 2</option>
											</select>
										</div>
									</div>
								</div>

								<div className='row'>
									<div className='col-md-6'>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Country")}
											</label>
											<select name='' id=''>
												<option value='state'>{t("Select")} Country</option>
												<option value='state'>{t("Select")} Country 1</option>
												<option value='state'>{t("Select")} Country 2</option>
											</select>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='form-field mb-3'>
											<label for='' className='pb-2'>{t("Zip Code")}
											</label>
											<input type='text' placeholder='Enter zip code' />
										</div>
									</div>
								</div>

								<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>{t("Add Social Accounts ")} <span className='fs-16'>{t("(Optional)")}</span>
								</h2>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Facebook")}
									</label>
									<input type='text' placeholder='https://www.facebook.com' />
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Twitter")}
									</label>
									<input type='text' placeholder='https://www.twitter.com' />
								</div>

								<div className='form-field mb-3'>
									<label for='' className='pb-2'>{t("Instagram")}
									</label>
									<input type='text' placeholder='https://www.instagram.com' />
								</div>

								<div className='form-field'>
									<label for='' className='pb-2'>{t("Youtube")}
									</label>
									<input type='text' placeholder='https://www.youtube.com' />
								</div>

								<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>Add Menu</h2>
								<div className='form-field mb-3'>
									<label for='' className='pb-2'>
										Menu PDF
									</label>
									<input
										name='myImage'
										type='file'
										className='d-none'
										id='file'
										accept='image/*'
									/>
									<label
										for='file'
										className='upload-file text-gray2 rounded-10 fs-14 light medium w-100 text-center'
									>
										Upload PDF
									</label>
								</div>
								<h2 className='fs-30 text-gray1 pt-2 pb-1 fs-sm-24'>
									Add Delivery Partners
								</h2>
								<div className='form-field mb-3'>
									{/* <select 
                                id="multiple" 
                                className="js-states form-control"
                                multiple={true}
                                >
                                    <option>Wolt</option>
                                    <option>Wolt1</option>
                                    <option>Wolt2</option>
                                    <option>Wolt3</option>
                                </select> */}
									<Select placeholder={'Select'} isMulti options={options} />
								</div>

								<button className='button w-100 rounded-10'>{t("Continue")}</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<CustomFooter internal />
		</div>
	);
}

export default RestaurantProfileSetup;

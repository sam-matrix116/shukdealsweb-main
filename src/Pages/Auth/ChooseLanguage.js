import React, { useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import Select from 'react-select';
import LoadingSpinner from '../../Components/Loader';
import ToastMessage from '../../Utils/ToastMessage';
import { useTranslation } from 'react-i18next';
import { getSelectedLanguages, setCookie } from '../../helpers/authUtils';
const $ = window.jQuery;

function ChooseLanguage() {
	const persistedData = getSelectedLanguages();
	const [isLoading, setIsLoading] = useState(false);
	const [countryData, setCountryData] = useState([]);
	const [currencyData, setCurrencyData] = useState([]);
	const [languageData, setLanguageData] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(persistedData?.country);
	const [selectedLanguage, setSelectedLanguage] = useState(
		persistedData?.language
	);
	const [selectedCurrency, setSelectedCurrency] = useState(
		persistedData?.currency
	);

	const navigate = useNavigate();
	const location = useLocation();
	const { t, i18n } = useTranslation();

	const onSubmit = (e) => {
		if (!selectedCountry) {
			ToastMessage.Error(t('Please select country'));
		} else if (!selectedLanguage) {
			ToastMessage.Error(t('Please select language'));
		} else if (!selectedCurrency) {
			ToastMessage.Error(t('Please select currency'));
		} else {
			setCookie(
				'chooseLanguageData',
				JSON.stringify({
					country: selectedCountry,
					language: selectedLanguage,
					currency: selectedCurrency,
				})
			);
			if (location.state?.memberShip == 'business') {
				navigate('/business-signup', {
					state: {
						country: selectedCountry.id,
						language: selectedLanguage.key,
						currency: selectedCurrency.id,
						ngo: location.state?.ngo,
						memberShip: location.state?.memberShip,
					},
				});
			} else if (location.state?.memberShip == 'member') {
				navigate('/user-signup', {
					state: {
						country: selectedCountry.id,
						language: selectedLanguage.key,
						currency: selectedCurrency.id,
						ngo: location.state?.ngo,
						memberShip: location.state?.memberShip,
					},
				});
			} else if (location.state?.memberShip == 'ngo') {
				navigate('/ngo-signup', {
					state: {
						country: selectedCountry.id,
						language: selectedLanguage.key,
						currency: selectedCurrency.id,
						memberShip: location.state?.memberShip,
					},
				});
			} else if (location.state?.memberShip == 'news_agency') {
				navigate('/news-agency-signup', {
					state: {
						country: selectedCountry.id,
						language: selectedLanguage.key,
						currency: selectedCurrency.id,
						ngo: location.state?.ngo,
						memberShip: location.state?.memberShip,
					},
				});
			}
		}
		e.preventDefault();
		e.persist();
	};

	const getLanguages = async () => {
		try {
			let resp = await FetchApi(Endpoints.getLanguages);
			if (resp && resp.data) {
				setLanguageData(resp.data);
				setIsLoading(false);
			}
			// console.log("getlang_", JSON.stringify(resp,null,4));
		} catch (e) {
			// setIsLoading(false);
		}
	};

	const getCountries = async () => {
		try {
			let resp = await FetchApi(Endpoints.getCountries);
			// console.log("getcountriy_", JSON.stringify(resp,null,4));
			if (resp && resp.data) {
				setCountryData(resp.data);
				// let new_data = resp.data.map((item)=>{
				//     return({
				//         value : item.id,
				//         label : <div style={{ display: 'flex', alignItems: 'center' }}>
				//                 <img src={Endpoints.baseUrl + item.flag} alt="img"  style={{width : '25px', height : '20px'}}/>
				//                  <span style={{ marginLeft: 7, fontSize : '12px' }}>{item.name}</span>
				//              </div>
				//     })
				// })
				// setCountryData(new_data.slice(0,50));
			}
		} catch (e) {
			setIsLoading(false);
		}
	};

	const getCurrency = async () => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(Endpoints.getCurrency);
			if (resp && resp.data) {
				setCurrencyData(resp.data);
			}
			// console.log("getcurrency_", JSON.stringify(resp,null,4));
		} catch (e) {
			setIsLoading(false);
		}
	};
	const customFilter = (option, searchText) => {

		if (
			option.data.name.toLowerCase().includes(searchText.toLowerCase())
		) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		getCountries();
		getCurrency();
		getLanguages();
	}, []);

	return (
		<div>
			<CustomHeader external />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					<div className='main signup-column pt-5 main-login'>
						<div className='container pt-5'>
							<div className='row'>
								<div className='col-md-6 pe-lg-5'>
									<div className='text-center'>
										<img src='assets/img/Bag image.svg' alt='shukDeals' />
									</div>
								</div>

								<div className='col-md-6 signup-column-right'>
									<div className='px-lg-5'>
										<h1 className='text-gray1 fs-34 medium pb-2'>{t("Choose Language & Currency")}
										</h1>

										<form onSubmit={onSubmit} action='' className='site-form pt-4'>
											<div className='form-field mb-4'>
												<label for='' className='pb-2'>{t("Country/Region")}
												</label>

												<Select
													placeholder={t('Select Your Country')}
													value={selectedCountry}
													options={countryData}
													onChange={setSelectedCountry}
													filterOption={customFilter}
													getOptionValue={(option) => option.id}
													getOptionLabel={(e) => (
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<img
																src={Endpoints.baseUrl + e?.flag}
																alt='img'
																style={{ width: '25px', height: '20px' }}
															/>
															<span style={{ marginLeft: 7, fontSize: '12px' }}>
																{e?.name}
															</span>
														</div>
													)}
												/>
											</div>

											<div className='form-field mb-4'>
												<label for='' className='pb-2'>
													{t("Language")}
												</label>

												<Select
													placeholder={t('Select Your Preferred Language')}
													value={selectedLanguage}
													options={languageData}
													onChange={setSelectedLanguage}
													filterOption={customFilter}
													getOptionValue={(option) => option.key}
													getOptionLabel={(e) => (
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<img
																src={Endpoints.baseUrl + e?.flag}
																alt='img'
																style={{ width: '25px', height: '20px' }}
															/>
															<span style={{ marginLeft: 7, fontSize: '13px' }}>
																{e?.name}
															</span>
														</div>
													)}
												/>
											</div>

											<div className='form-field mb-4'>
												<label for='' className='pb-2'>{t("Currency")}
												</label>

												<Select
													placeholder={t('Select Your Currency')}
													value={selectedCurrency}
													options={currencyData}
													onChange={setSelectedCurrency}
													filterOption={customFilter}
													getOptionValue={(option) => option.id}
													getOptionLabel={(e) => (
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<img
																src={Endpoints.baseUrl + e?.sign_svg}
																style={{ height: '20px', width: '20px' }}
																alt=''
															></img>
															<span style={{ marginLeft: 7, fontSize: '13px' }}>
																{e?.name}
															</span>
														</div>
													)}
												/>
											</div>

											<button className='button w-100 rounded-10'>{t("Continue")}</button>
										</form>

										<div className='pt-4 mb-md-4 mb-2'>
											<Link to={-1} className='medium d-block text-center'>{t("Back")}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<CustomFooter />
		</div>
	);
}

export default ChooseLanguage;

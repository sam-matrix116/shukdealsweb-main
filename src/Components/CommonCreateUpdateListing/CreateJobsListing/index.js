import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Endpoints } from '../../../API/Endpoints';
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import { FetchApi } from '../../../API/FetchApi';
import Select from 'react-select';
import { ValidateList, ValidationTypes } from '../../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import ToastMessage from '../../../Utils/ToastMessage';

function CreateJobsListing({
	handleChange,
	getExtistingData,
	extistingData,
	values,
	setValues,
	setIsLoading
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location2 = useLocation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);

	const [currencyData, setCurrencyData] = useState([]);
	const [currentCurrency, setCurrentCurrency] = useState();

	const validationArr = () => {
		return (
			(location2?.pathname === '/create-listing-jobs' ||
				location2?.pathname === '/update-listing-jobs') && [
				[values.title, ValidationTypes.Empty, t('Please Enter Title')],
				[values.description, ValidationTypes.Empty, t('Please Enter Description')],
				[
					values.roles_and_responsibilities,
					ValidationTypes.Empty,
					t('Please Enter Roles and Responsibilities'),
				],
				[values.job_type, ValidationTypes.Empty, t('Please Select Job Type')],
				[
					values.salary_currency,
					ValidationTypes.Empty,
					t('Please Select Salary Currency'),
				],
				[values.salary_type, ValidationTypes.Empty, t('Please Select Salary Type')],
				[values.salary, ValidationTypes.Empty, t('Please Enter Salary')],
			]
		);
	};

	// API Calling
	const getCurrency = async () => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(Endpoints.getCurrency);
			if (resp && resp.data) {
				setCurrencyData(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};
	const createApi = async (url) => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(url, values);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				navigate(-1);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let validate = await ValidateList(validationArr());
		if (validate) {
			location2?.pathname === '/create-listing-jobs' &&
				createApi(Endpoints.addJobListing);
			location2?.pathname === '/update-listing-jobs' &&
				createApi(Endpoints.updateJobListing + params?.id);
			return;
		} else {
			return;
		}
	};

	// side effects
	useEffect(() => {
		setCurrentCurrency(
			currencyData?.filter((item) => values?.salary_currency === item?.iso_code)[0]
		);
	}, [values?.salary_currency, currencyData]);


	useEffect(() => {
		// for new creation
		location2?.pathname === '/create-listing-jobs' &&
			setValues((values) => ({
				...values,
				salary_type: 'monthly',
				job_type: 'full_time',
				salary_currency: 'usd',
			}));

		// for existing data and edit details
		location2?.pathname === '/update-listing-jobs' &&
			setValues((values) => ({
				...values,
				title: extistingData?.title,
				description: extistingData?.description,
				roles_and_responsibilities: extistingData?.roles_and_responsibilities,
				job_type: extistingData?.job_type,
				salary_currency: extistingData?.salary_currency,
				salary_type: extistingData?.salary_type,
				salary: extistingData?.salary,
				expiry_date: extistingData?.expiry_date,
			}));
	}, [extistingData]);

	return (
		<div>
			<div className='container py-4 border-top mb-3'>
				<div className='row justify-content-center'>
					<div className='col-lg-6 col-md-8 col-sm-10'>
						<h1 className='fs-30 text-gray1 pb-3 fs-sm-22'>{t("Create Job Listing")}</h1>

						<form
							// onSubmit={(e) => {
							// 	handleSubmit();
							// 	e.preventDefault();
							// }}
							action=''
							className='site-form pt-md-2 profile-setup-form'
						>
							<div className='form-field mb-3'>
								<label for='' className='pb-2'>{t("Job Title")}
								</label>
								<input
									defaultValue={values.title}
									onChange={handleChange}
									name='title'
									type='text'
									placeholder={t('Coupon/Deal Title')}
								/>
							</div>

							<div className='form-field mb-3 position-relative'>
								<label for='' className='pb-2'>{t("Job Description")}
								</label>
								<textarea
									defaultValue={values.description}
									onChange={handleChange}
									name='description'
									cols='10'
									rows='4'
									id='the-textarea'
									maxlength='300'
									placeholder='Write job discription'
									autofocus
								></textarea>
								<div id='the-count' className='fs-14 text-gray2 light'>
									<span id='current'>{values.description?.length}</span>
									<span id='maximum'>/ 300</span>
								</div>
							</div>
							<div className='form-field mb-3 position-relative'>
								<label for='' className='pb-2'>
									Roles and Responsibilities
								</label>
								<textarea
									defaultValue={values.roles_and_responsibilities}
									onChange={handleChange}
									name='roles_and_responsibilities'
									cols='10'
									rows='4'
									id='the-textarea'
									maxlength='300'
									placeholder='Write job roles and responsibilities'
									autofocus
								></textarea>
								<div id='the-count' className='fs-14 text-gray2 light'>
									<span id='current'>{values.roles_and_responsibilities?.length}</span>
									<span id='maximum'>/ 300</span>
								</div>
							</div>

							<div class='form-field mb-3'>
								<label for='' class='pb-2'>{t("Job Type")}
								</label>
								<select name='job_type' onChange={handleChange} value={values.job_type}>
									<option value='full_time'>{t("Full Time")}</option>
									<option value='part_time'>{t("Part Time")}</option>
								</select>
							</div>
							<div class='form-field mb-3'>
								<label for='' class='pb-2'>{t("Currency")}
								</label>
								<Select
									placeholder={t("Select")}
									value={currentCurrency}
									name='salary_currency'
									options={currencyData}
									onChange={(e) =>
										setValues((values) => ({
											...values,
											salary_currency: e?.iso_code,
										}))
									}
									isSearchable={true}
									getOptionValue={(option) => option.id}
									getOptionLabel={(e) => (
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<img
												src={Endpoints.baseUrl + e?.flag}
												alt='img'
												style={{ width: '20px', height: '20px' }}
											/>
											<span style={{ marginLeft: 7, fontSize: '13px' }}>{e?.iso_code}</span>
										</div>
									)}
								/>
							</div>

							<div class='mb-3'>
								<label for='' class='pb-2'>{t("Salary")} {t("(optional)")}
								</label>
								<div class='border rounded-10 d-flex align-items-center overflow-hidden'>
									<select
										name='salary_type'
										onChange={handleChange}
										value={values.salary_type}
										defaultValue={'monthly'}
										class='border-0 w-25 ps-md-3 ps-1'
									>
										<option value='month'>{t("Monthly")}</option>
										<option value='year'>{t("Yearly")}</option>
									</select>
									<input
										type='text'
										name='salary'
										value={values.salary}
										onChange={handleChange}
										class='border-0 w-75 border-start rounded-0'
										placeholder='00'
									/>
								</div>
							</div>
							<div className='form-field mb-3'>
								<label for='' className='pb-2'>{t("Expiry Date")}
								</label>
								<input
									defaultValue={values.expiry_date}
									value={values.expiry_date}
									min={moment(new Date()).format('YYYY-MM-DD')}
									onChange={handleChange}
									name='expiry_date'
									type='date'
									placeholder={t('Choose date')}
									className='custom-date'
								/>
							</div>

							<Link onClick={handleSubmit} className='button w-100 mt-4' type='submit'>{t("Preview")}
							</Link>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateJobsListing;

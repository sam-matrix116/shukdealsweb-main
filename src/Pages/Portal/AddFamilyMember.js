import React, { useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { getLoggedInUser } from '../../helpers/authUtils';
import { useTranslation } from 'react-i18next';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import { Endpoints } from '../../API/Endpoints';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../Components/Loader';
import { imageCompressor } from '../../helpers/imageHelper';
import { BlobToFileConverter } from '../../helpers/fileHelper';
// import PhoneInput from 'react-phone-input-international';
import { PhoneInput } from 'react-international-phone';
// import startsWith from 'lodash.startswith';
function AddFamilyMember() {
	const { t, i18n } = useTranslation();
	const location2 = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [familyImage, setFamilyImage] = useState('');
	const [familyImagePreview, setFamilyImagePreview] = useState(
		location2?.state?.familyData?.image
			? Endpoints.baseUrl + location2?.state?.familyData?.image
			: ''
	);
	const [relationData, setRelationData] = useState([]);
	const [values, setValues] = useState([]);
	const navigate = useNavigate();

	// useEffect(()=>{
	//     if(location?.state?.familyData){
	//         setPhone(location?.state?.familyData?.phone_num)
	//     }
	// },[location?.state?.familyData]);

	const getRelations = async () => {
		try {
			let resp = await FetchApi(Endpoints.getRelations);
			if (resp && resp.data) {
				setRelationData(resp.data);
			}
		} catch (e) {}
	};

	useEffect(() => {
		getRelations();
	}, []);

	const FamilyMemberApi = async () => {
		let ValidationArr = [
			[values?.firstname, ValidationTypes.Empty, t('Please enter first name')],
			[values?.lastname, ValidationTypes.Empty, t('Please enter last name')],
			[values?.relation, ValidationTypes.Empty, t('Please enter relation')],
			[values?.email, ValidationTypes.Empty, t('Please Enter Email')],
			[values?.phone, ValidationTypes.Empty, t('Please enter phone')],
			// [familyImage, ValidationTypes.Empty, t('Please add image')],
		];
		let validate = await ValidateList(ValidationArr);

		if (!validate) {
			return;
		}
		let obj = new FormData();
		for (var key in values) {
			obj.append(key, values[key]);
		}
		if (familyImage) {
			obj.append('image', familyImage);
		}

		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.addorUpdateFamilyMember, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				setIsLoading(false);
				navigate(-1);
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const handleChange2 = async (e) => {
		if (e.target.files.length) {
			// setIsLoading(true);
			const image = URL?.createObjectURL(e?.target?.files?.[0]);
			setFamilyImagePreview({
				fileUrl: image,
			});
			const compressedImage = await imageCompressor(e?.target?.files?.[0]);
			// setIsLoading(false);
			let file = BlobToFileConverter(compressedImage);

			setFamilyImage(file);
		}
	};

	const handleChange = (event, data) => {
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setValues((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		FamilyMemberApi();
		e.preventDefault();
	};

	useEffect(() => {
		// for new creation
		// location2?.pathname === '/create-weekly-deal' &&
		// 	setValues((values) => ({
		// 		...values,
		// 		expiry_date: moment(new Date()).add(7, 'days').format('YYYY-MM-DD'),
		// 	}));

		// for existing data and edit details
		if (location2?.pathname === '/update-family-member') {
			let extistingData = location2?.state?.familyData;
			console.log('imgpreview', extistingData);
			setValues((values) => ({
				...values,
				firstname: extistingData?.firstname,
				lastname: extistingData?.lastname,
				relation: extistingData?.relation,
				email: extistingData?.email,
				phone: extistingData?.phone,
			}));
			// setIsLoading(false);
			// const compressedImage = imageCompressor(extistingData?.image);
			// let file = BlobToFileConverter(compressedImage);
			setFamilyImagePreview(Endpoints.baseUrl + extistingData?.image);
		}
	}, []);

	return (
		<div>
			<CustomHeader />
			<CommonProfile />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div class='container '>
					<div class='row justify-content-center border-top py-5'>
						<div class='col-lg-6 col-md-8 col-sm-10'>
							<h1 class='fs-30 text-gray1 pb-3 fs-sm-22'>
								{location2?.pathname === '/update-family-member'
									? t('Update Family Member')
									: t('Add Family Member')}
							</h1>
							<form onSubmit={handleSubmit} action='' class='site-form border-style2'>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("First Name")}
									</label>
									<input
										value={values?.firstname}
										name='firstname'
										onChange={handleChange}
										type='text'
										placeholder={t(`Enter Family Member's First Name`)}
									/>
								</div>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("Last Name")}
									</label>
									<input
										value={values?.lastname}
										name='lastname'
										onChange={handleChange}
										type='text'
										placeholder={t(`Enter Family Member's Last Name`)}
									/>
								</div>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("Relation")}
									</label>
									<select
										value={values?.relation}
										name='relation'
										onChange={handleChange}
										id=''
										class='text-gray2'
									>
										<option value=''>{t("Select relation")}</option>
										{relationData?.map((item, index) => {
											return (
												<option key={index} value={item.key}>
													{item.relation}
												</option>
											);
										})}
									</select>
								</div>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("Email Address")}
									</label>
									<input
										value={values?.email}
										name='email'
										onChange={handleChange}
										type='text'
										placeholder={t('Enter family member email')}
									/>
								</div>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>{t("Phone Number")}
									</label>
									<PhoneInput
										// autoFormat={true}
										// isValid={(inputNumber, country, countries) => {
										// 	return countries.some((country) => {
										// 		return (
										// 			startsWith(inputNumber, country.dialCode) ||
										// 			startsWith(country.dialCode, inputNumber)
										// 		);
										// 	});
										// }}
										defaultCountry='il'
										style={{
											width: '100%'
										}}
										inputStyle={{
											// backgroundColor : 'white',
											// height: '44px',
											border: '0.5px  gray',
											borderTopRightRadius: 10,
											borderBottomRightRadius: 10,
											// paddingTop: '10px',
											// borderRadius: 10,
											marginInlineStart: (i18n.language=='he' || i18n.language=='ar')?'25px':'0px'
										}}
										placeholder='Enter phone number'
										value={values.phone}
										onChange={(value) => {
											handleChange('phone', value);
										}}
									/>
								</div>
								<div class='form-field mb-3'>
									<label for='' class='pb-2'>
										{t("Upload Picture")} {t("(Optional)")}
									</label>
									<div>
										<input
											accept='image/*'
											onChange={handleChange2}
											type='file'
											name='image'
											class='d-none'
											id='upload'
										/>
										<label for='upload' class='family-pic-upload '>
											{familyImagePreview ? (
												<img
													src={
														familyImagePreview
															? location2?.state?.familyData && !familyImagePreview.fileUrl
																? familyImagePreview
																: familyImagePreview.fileUrl
															: 'assets/img/icon/camera-line.svg'
													}
													style={{
														borderRadius: '100px',
														width: '100%',
														height: '100%',
													}}
													alt=''
												/>
											) : (
												<i class='far fa-camera text-white fs-30'></i>
											)}
										</label>
									</div>
								</div>
								<button type='submit' class='button w-100'>
									{location2?.pathname === '/update-family-member'
										? t('Update Member')
										: t('Add Member')}
								</button>
							</form>
						</div>
					</div>
				</div>
			)}

			<CustomFooter internal />
		</div>
	);
}

export default AddFamilyMember;

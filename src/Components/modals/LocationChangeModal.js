import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from 'react-google-autocomplete';
import './style.css';

function LocationChangeModal({ setIsmodalVisible, isModalVisible, data }) {
	const { t } = useTranslation();
	const chosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const [values, setValues] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		localStorage.setItem('chosenLocation', JSON.stringify(values));
		data?.setCallingState({
			latitude: values?.latitude,
			longitude: values?.longitude,
		});

		setIsmodalVisible(false);
		window?.location?.reload();
	};

	const handleChange = (event) => {
		if (event.persist) event.persist();
		setValues((values) => ({
			...values,
			[event?.target?.name || event?.name]: event?.target?.value || event?.value,
		}));
	};

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
					<div className='modal-dialog modal-dialog-centered mw-500'>
						<div className='modal-content rounded-20 border-0 '>
							<div className='modal-body text-center py-4 px-md-5'>
								<h2 className='modal-title'>{data?.title || t('Choose a Location')}</h2>
								<hr className='my-3 mb-4' />
								<form
									onSubmit={handleSubmit}
									className='  site-form profile-setup-form'
								>
									<div className='form-field mb-3'>
										<label for='' className='pb-2'>
											{t('Location')}
										</label>

										{/* Location search */}
										<Autocomplete
											className='location text-truncate text-nowrap'
											placeholder={t("Enter a location")}
											defaultValue={values.location}
											apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
											options={{ types: ['(cities)'] }}
											onPlaceSelected={(place) => {
												setValues((prev) => ({
													...prev,
													location: place?.formatted_address,
												}));
												setValues((prev) => ({
													...prev,
													latitude: parseFloat(place?.geometry?.location?.lat()).toFixed(5),
												}));
												setValues((prev) => ({
													...prev,
													longitude: parseFloat(place?.geometry?.location?.lng()).toFixed(5),
												}));

												let city_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'locality').length
												);
												let state_ = place?.address_components.filter(
													(item) =>
														item.types.filter((it) => it == 'administrative_area_level_1')
															.length
												);
												let country_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'country').length
												);
												let zipcode_ = place?.address_components.filter(
													(item) => item.types.filter((it) => it == 'postal_code').length
												);

												if (state_.length) {
													setValues((prev) => ({
														...prev,
														state: state_[0]?.long_name,
													}));
												}
												if (city_.length) {
													setValues((prev) => ({
														...prev,
														city: city_[0]?.long_name,
													}));
												}
												if (country_.length) {
													setValues((prev) => ({
														...prev,
														country: country_[0]?.long_name,
													}));
												}
												if (zipcode_.length) {
													setValues((prev) => ({
														...prev,
														zipcode: zipcode_[0].long_name,
													}));
												}
											}}
										/>
									</div>

									<div className='pt-3 mt-3 border-top row gap-4'>
										<button
											className='button rounded-10 px-4 py-2 col'
											onClick={(e) => setIsmodalVisible(false)}
										>
											{t('Cancel')}
										</button>
										<button type='submit' className='button rounded-10 px-4 py-2 col '>
											{t('Submit')}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default LocationChangeModal;

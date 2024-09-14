import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import useModalContext from '../../context/modalContext';

function LocationSelectionTab({ setFilters, handleChange }) {
    const { t } = useTranslation();
	const { setIsLocationChangeModalVisible, setLocationChangeModalData } =
		useModalContext();
	const [location, setLocation] = useState();
	const chosenLocation = JSON.parse(localStorage.getItem('chosenLocation'));
	const handleLocationChange = (e) => {
		e.preventDefault();
		setIsLocationChangeModalVisible(true);
		setLocationChangeModalData((values) => ({
			...values,
			setCallingState: setLocation,
		}));
	};
	useEffect(() => {
		if (location) {
			setFilters((values) => ({
				...values,
				search_lat: location?.latitude,
				search_lon: location?.longitude,
			}));
		}
	}, [location]);

	return (
		<div
			className='border p-2 rounded-10 d-flex my-sm-0 my-2 selectContainer'
			onClick={handleLocationChange}
		>
			<p className='fs-16 fs-sm-14 mb-0 regular text-gray2 d-flex w-100 text-truncate text-nowrap' style={{
				maxWidth : '200px'
			}}>
				<img src='assets/img/icon/location.svg' className='me-2' alt='shukDeals' />{' '}
				{t("Location")}: {chosenLocation?.location}
			</p>
		</div>
	);
}

export default LocationSelectionTab;

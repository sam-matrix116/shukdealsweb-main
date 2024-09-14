import { t } from 'i18next';
import ToastMessage from '../Utils/ToastMessage';

async function getLocationPermission(storageName) {
	try {
		if (navigator.geolocation) {
			const position = await getCurrentPosition();
			const { latitude, longitude } = position.coords;
			const response = await getAddressFromLatLng(latitude, longitude);
			console.log({ response });

			const locationData = {
				...response,
				latitude,
				longitude,
			} || {
				latitude,
				longitude,
			};
			localStorage.setItem(storageName, JSON.stringify(locationData));
			window.location.reload();
		} else {
			throw new Error('Geolocation not supported');
		}
	} catch (error) {
		console.error('Unable to get your location', error);
		const baseLocation = {};
		localStorage.setItem(storageName, JSON.stringify(baseLocation));
		ToastMessage.Error(t('Error getting location'));
	}
}

async function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

async function getAddressFromLatLng(latitude, longitude) {
	const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&libra`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.status === 'OK' && data.results.length > 0) {
			const results = data.results;
			let city_ = results[0]?.address_components?.filter(
				(item) => item.types.filter((it) => it == 'locality').length
			);
			let state_ = results[0]?.address_components?.filter(
				(item) =>
					item.types.filter((it) => it == 'administrative_area_level_1').length
			);
			let country_ = results[0]?.address_components?.filter(
				(item) => item.types.filter((it) => it == 'country').length
			);
			let finalAddress = '';
			for (let i = 0; i < results[0].address_components.length; i++) {
				if (
					results[0].address_components[i].types[0] == 'administrative_area_level_3'
				) {
					finalAddress = results[0].address_components[i].long_name;
				}
			}
			console?.log({results})
			return {
				location: finalAddress,
				city: city_?.[0]?.long_name,
				state: state_?.[0]?.long_name,
				country: country_?.[0]?.long_name,
			};

		} else {
			return null;
		}
	} catch (error) {
		console.error('Error fetching address:', error);
		return null;
	}
}

export { getLocationPermission, getAddressFromLatLng };

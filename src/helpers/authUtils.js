//import jwtDecode from 'jwt-decode';
import { Cookies } from 'react-cookie';
import ToastMessage from '../Utils/ToastMessage';
import { FetchApi } from '../API/FetchApi';
import { Endpoints } from '../API/Endpoints';
import { t } from 'i18next';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = async () => {
	const token = await getUserToken();
	if (token) {
		return true;
	} else {
		const res = await refreshAccessToken();
		// console.log('res h bhai',res)
		return res;
	}
};
/**
 * Returns the logged in user
 */
const refreshAccessToken = async () => {
	const token = getUserToken();
	const refreshToken = getRefreshToken();
	let d = new Date();
	const expireTime = d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);

	if (!token && refreshToken) {
		try {
			let res = FetchApi(Endpoints.getAccessTokenFromRefreshToken, {
				refresh: refreshToken,
			});
			if (res && res.status) {
				setCookie('token', res.access);
				setCookie('refreshToken', res.refresh, expireTime);
				return true;
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
				return false;
			}
		}
	} else {
		return false;
	}
};

const getUserToken = () => {
	const cookies = new Cookies();
	const token = cookies.get('token');
	return token ? token : null;
};

const getRefreshToken = () => {
	const cookies = new Cookies();
	const refresh = cookies.get('refreshToken');
	return refresh || null;
};

const getTempToken = () => {
	const cookies = new Cookies();
	const tempToken = cookies.get('tempToken');
	return tempToken || null;
};

const setSessionStorageFunction = (name, data) => {
	if (typeof data === 'object') {
		sessionStorage.setItem(name, JSON.stringify(data));
	} else {
		sessionStorage.setItem(name, data);
	}
};
/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
	// const cookies = new Cookies();
	// const user = cookies.get('user');
	const user = JSON.parse(sessionStorage.getItem('user'));
	return user;
};

//get usera fter profile setup
const getProfileSetup = () => {
	const cookies = new Cookies();
	const p_setup = cookies.get('p_setup');
	return p_setup
		? typeof p_setup == 'object'
			? p_setup
			: JSON.parse(p_setup)
		: null;
};

//header profile picture
const getHeaderPicture = () => {
	const cookies = new Cookies();
	const header_dp = cookies.get('header_dp');
	return header_dp
		? typeof header_dp == 'object'
			? header_dp
			: JSON.parse(header_dp)
		: null;
};
//language selected
const getSelectedLanguages = () => {
	const cookies = new Cookies();
	const selectedLanguages = cookies.get('chooseLanguageData');
	return selectedLanguages
		? typeof selectedLanguages == 'object'
			? selectedLanguages
			: JSON.parse(selectedLanguages)
		: null;
};
/**
 * create the cookie value based what params passed
 */
const setCookie = (key, value, expireTime) => {
	const cookies = new Cookies();
	if (expireTime) {
		cookies.set(key, value, { path: '/', maxAge: expireTime });
	} else cookies.set(key, value, { path: '/' });
};
const getCookie = (key) => {
	const cookies = new Cookies();
	const res = cookies.get(key);
	return res || null;
};
/**
 * Returns the customer country
 */
const getSelectedCountry = () => {
	const cookies = new Cookies();
	const countryId = cookies.get('countryId');
	return countryId;
};

/**
 * Returns the selected currency
 */
const getChoosenCurrency = () => {
	let user_currency = JSON.parse(sessionStorage.getItem('user_currency')) ?? {
		flag: '/static/flags/usd.png',
		id: 1,
		iso_code: 'USD',
		name: 'Dollar',
		sign: '$',
		sign_svg: '/static/dist/img/usd.svg',
	};
	return user_currency;
};
const getChoosenLanguage = () => {
	let user_language = JSON.parse(sessionStorage.getItem('user_language')) ?? {
		flag: '/static/flags/as.png',
		key: 'en',
		name: 'English',
	};
	return user_language;
};

//get deal formdata after payment
const getDealFormData = (name) => {
	const dealform = localStorage.getItem(name);
	return JSON.parse(dealform);
};

const getLocationData = () => {
	const cookies = new Cookies();
	const location = cookies.get('locationapidata');
	return location;
};

// get classifieds form data
const getClassifiedFormData = (name) => {
	const classifiedform = localStorage.getItem(name);
	return JSON.parse(classifiedform);
};

// check if user logged in and redirects
const checkTokenRedirect = () => {
	const cookies = new Cookies();
	const token = cookies.get('token');
	if (!token) {
		ToastMessage.Error(t('Please Login or Sign up First!'));
		// setTimeout(() => {
		// 	window.location.href = '/login';
		// }, 1000);
		return false;
	} else return true;
};

// deletes selected cookies after logout
function deleteAllCookies() {
	return new Promise((resolve, reject) => {
		let cookies = new Cookies();
		cookies.remove('token', { path: '/' });
		cookies.remove('header_dp');
		cookies.remove('user');
		localStorage.clear();
		sessionStorage.clear();
		cookies.remove('p_setup');
		cookies.remove('selectedLanguages');
		cookies.remove('user_currency');
		resolve(true);
	});
}
// parses a json string
const parseJsonString = (value) => {
	return value ? (typeof value == 'object' ? value : JSON.parse(value)) : null;
};

export {
	isUserAuthenticated,
	getLoggedInUser,
	getUserToken,
	getSelectedCountry,
	setCookie,
	getCookie,
	getRefreshToken,
	getTempToken,
	deleteAllCookies,
	getProfileSetup,
	getHeaderPicture,
	getDealFormData,
	getClassifiedFormData,
	checkTokenRedirect,
	getSelectedLanguages,
	getChoosenCurrency,
	getChoosenLanguage,
	getLocationData,
	setSessionStorageFunction,
};

import axios from 'axios';
import { Endpoints } from '../Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import {
	getRefreshToken,
	getUserToken,
	setCookie,
} from '../../helpers/authUtils';
import { Cookies } from 'react-cookie';
import i18next, { t } from 'i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';

async function refreshToken(endpoint, data, loader, params, resolve) {
	try {
		const refreshToken = getRefreshToken();
		let options = {
			'content-type': 'application/json',
		};
		// if(token){
		//     options['AUTHORIZATION']= `Bearer ${token}`
		// }
		// let newData = new FormData();
		// if(data){
		//     Object.keys(data).forEach((item)=>{
		//         newData.append([item],data[item]);
		//     })
		// }
		let configs = {
			headers: options,
			method: data ? 'POST' : 'GET',
			baseURL:
				Endpoints.baseUrl +
				'/' +
				(i18next.language === 'en-US' || i18next.language === 'en-GB'
					? 'en'
					: i18next.language) +
				'/api/v1/',

			// data : data ? data: null
		};
		let response = await axios(configs);

		//let token = response.token
		//let refreshtoken = response.refreshtoken
		// setCookie("token",token);
		//setCookie("refreshToken",refreshtoken)

		//success response
		// let api_response = await FetchApi(endpoint,data,loader,params);
		// resolve(api_response);
	} catch (e) { }
}
export const FetchApi = (
	endpoint,
	data,
	loader = false,
	params,
	addVersion = true,
	method,
	responseType
) => {
	function deleteAllCookies() {
		return new Promise((resolve, reject) => {
			let cookies = new Cookies();
			cookies.remove('token', { path: '/' });
			resolve(true);
		});
	}
	document.body.classList.add('custom-loader');
	return new Promise(async (resolve, reject) => {
		const token = getUserToken();
		let options = {
			'content-type': 'application/json',
		};
		if (data instanceof FormData) {
			options['content-type'] = 'multipart/form-data';
		}
		if (token && endpoint!=Endpoints.getOthersClassified) {
			options['AUTHORIZATION'] = `Bearer ${token}`;
		}
		// let newData = new FormData();
		// // if(data){
		// //     Object.keys(data).forEach((item)=>{
		// //         newData.append([item],data[item]);
		// //     })
		// // }
		let configs = {
			headers: options,
			method: method ? method : data ? 'POST' : 'GET',
			// baseURL : Endpoints.baseUrl +"/"+i18next.language + "/api/v1/",
			baseURL:
				Endpoints.baseUrl +
				'/' +
				// (i18next.language === 'en-US' || i18next.language === 'en-GB'
				// 	? 'en'
				// 	: i18next.language) 
				(i18next.language?.includes('en-')
					? 'en'
					: i18next.language) 
					+
				(addVersion ? '/api/v1/' : ''),
			url: endpoint,
			params: params ? params : null,
			responseType: responseType,
			// data : data ? data: null
		};
		if (data) {
			configs.data = data;
		}
		// if(params){
		//     configs.params = params
		// }

		try {
			let resp = await axios(configs);
			// console.log('checkapidata___',JSON.stringify(resp,null,4));
			if (resp && resp.data && resp.data.status_code == 401) {
				// ToastMessage.Error(t('Session Expired! Please login again.'));
				deleteAllCookies().then((r) => { });
			}
			if (resp && resp.data.status == 401) {
				// ToastMessage.Error(t('Session Expired! Please login again.'));
				return;
			}
			if (resp.data.status == 210) {
				if (resp.data.message) {
					ToastMessage.Error(resp.data.message);
				} else if (resp.data.errors && typeof resp.data.errors == 'string') {
					ToastMessage.Error(resp.data.errors);
				} else if (typeof resp.data.errors == 'object') {
					ToastMessage.Error(resp.data.errors.errorCode);
				}
				// ToastMessage.Error(resp.data.errors);
				document.body.classList.remove('custom-loader');
				reject(resp.data);
				return;
			} else {
				document.body.classList.remove('custom-loader');
				resolve(resp.data);
			}
		} catch (e) {
			// console.log('checkerr__', JSON.stringify(e.response,null,4))
			if (e.response && e.response.status == 401) {
				// refreshToken(endpoint,data,loader, params,resolve)
				deleteAllCookies();
				// Navigate('/login')
				// <Link to={'/login'} />
				// ToastMessage.Error(t('Session Expired! Please login again.'));
			}
			if (e.response && e.response.status == 500) {
				// ToastMessage.Error(t('Server Error. Please Try after Some Time'));
			}
			document.body.classList.remove('custom-loader');
			reject(e);
		}
	});
};

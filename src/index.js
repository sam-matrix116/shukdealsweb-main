import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n-translations/index';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { Cookies } from 'react-cookie';
import { getLoggedInUser, getUserToken, setCookie } from './helpers/authUtils';
import { getCall } from './helpers/axiosUtils';
import { Endpoints } from './API/Endpoints';
import i18next from 'i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
const root = ReactDOM.createRoot(document.getElementById('root'));
// const queryClient = new QueryClient()
function initalRender(data) {
	root.render(
		<Provider store={configureStore()}>
			<App userData={data} />
		</Provider>
	);
}
function deleteAllCookies() {
	return new Promise((resolve, reject) => {
		let cookies = new Cookies();
		cookies.remove('token', { path: '/' });
		resolve(true);
	});
}
// deleteAllCookies()

initalRender(null);
let token = getUserToken();
let user = getLoggedInUser();

if (token) {
	let options = {
		'content-type': 'application/json',
		AUTHORIZATION: `Bearer ${token}`,
	};
	const url =
		Endpoints?.baseUrl +
		'/' +
		(i18next.language === 'en-US' || i18next.language === 'en-GB'
			? 'en'
			: i18next.language) +
		'/api/v1/' +
		Endpoints?.getProfileDetails;
	getCall(url, { headers: options })
		.then((r) => {
			// console.log('resp__',JSON.stringify(r.data,null,4))
			// if(r.data.message === 'Token is Expired'){
			//   deleteAllCookies().then(r => {
			//     initalRender(null)
			//   });
			// }
			// else {
			//   initalRender(r.data.data)
			// }
			if (!user) {
				sessionStorage.setItem('user', JSON.stringify(r.data.data));
			}
		})
		.catch((error) => {
			// console.log('respErr__',JSON.stringify(error.message,null,4))
			if (error && error?.message == 'Request failed with status code 401') {
				deleteAllCookies().then((r) => {
					initalRender(null);
				});
			}
		});
}
// else {
//   initalRender(null);
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

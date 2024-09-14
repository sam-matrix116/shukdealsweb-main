// @flow
import { Cookies } from "react-cookie";
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    FORGET_PASSWORD
} from '../../constants/actionTypes';

// import {
//     BASE_URL
// } from '../../constants/common';


import {
    loginUserSuccess,
    loginUserFailed,
    registerUserSuccess,
    registerUserFailed,
    forgetPasswordSuccess,
    forgetPasswordFailed
} from './actions';


/**
 * Fetch data from given url
 * @param {*} url 
 * @param {*} options 
 */
const fetchJSON = (url, options = {}) => {
    return fetch(url, options)
        .then(response => {
            if (!response.status === 200) {
                throw response.json();
            }
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch(error => { throw error });
}


/**
 * Sets the session
 * @param {*} user 
 */
const setSession = (user) => {
    let cookies = new Cookies();
    if (user) {
        cookies.set("user", JSON.stringify(user.user_details), { path: "/" });
        cookies.set("token", user.token, { path: "/" });
    }
    else {
        cookies.remove("user", { path: "/" });
        cookies.remove("token", { path: "/" });
    }

};
const postCall = (url, data) => {
    return axios.post(
        url, data
    ).then(response => response.data)
        .catch(err => err);
}
/**
 * Login the user
 * @param {*} payload - username and password 
 */
// function* login({ payload: { username, password } }) {
//     try {
//         //const response = yield call(fetchJSON, '/users/authenticate', options);        
//         const response = yield call(postCall, `${BASE_URL}users/auth-token`, {
//             email: username,
//             password: password
//         });
//         if (response.isAxiosError) {
//             yield put(loginUserFailed('Invalid credentials'));
//             setSession(null);
//         }
//         else {
//             setSession(response);
//             yield put(loginUserSuccess(response.user_details));
//         }
//     } catch (error) {
//         let message;
//         console.log(error)
//         /**
//         switch (error.status) {
//             case 500: message = 'Internal Server Error'; break;
//             case 401: message = 'Invalid credentials'; break;
//             default: message = error;
//         }*/
//         message = 'Invalid credentials';
//         yield put(loginUserFailed(message));
//         setSession(null);
//     }
// }


/**
 * Logout the user
 * @param {*} param0 
 */
function* logout({ payload: { history } }) {
    try {
        setSession(null);
        yield call(() => {
            history.push("/login");
        });
    } catch (error) { }
}

/**
 * Register the user
 */
function* register({ payload: { fullname, email, password } }) {
    const options = {
        body: JSON.stringify({ fullname, email, password }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    try {
        const response = yield call(fetchJSON, '/users/register', options);
        setSession(response);
        yield put(registerUserSuccess(response));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500: message = 'Internal Server Error'; break;
            case 401: message = 'Invalid credentials'; break;
            default: message = error;
        }
        yield put(registerUserFailed(message));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { username } }) {
    const options = {
        body: JSON.stringify({ username }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    try {
        const response = yield call(fetchJSON, '/users/password-reset', options);
        yield put(forgetPasswordSuccess(response.message));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500: message = 'Internal Server Error'; break;
            case 401: message = 'Invalid credentials'; break;
            default: message = error;
        }
        yield put(forgetPasswordFailed(message));
    }
}


// export function* watchLoginUser(): any {
//     yield takeEvery(LOGIN_USER, login);
// }

export function* watchLogoutUser(): any {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser(): any {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword(): any {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga(): any {
    yield all([
        // fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
    ]);
}

export default authSaga;
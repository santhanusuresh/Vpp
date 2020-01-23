import { LOGIN, LOGIN_ERROR, SESSION_USER } from './types';
import { Base64 } from 'js-base64';

export const login = (email, password, history, md5) => dispatch => {
    fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name-or-email/" + Base64.encode(email), {
        method: "GET",
        mode: 'cors',
        headers: {
            "Authorization": "Basic " + Base64.encode(`${email}:${password}`),
            "Content-Type": "application/json"
        },
    }).then(res => res.json()).then(res => {
            // console.log("res",res);
            if (typeof res.success === "undefined" || typeof res.data.id === "undefined") {
                throw res;
            }
        const user = res.success === 1 ? 'admin' : '';
        const userid = res.success === 1 ? res.data.id : '';
        const currentModule =res.success === 1 ? (res.data.module || 'powerShop') : '';
        const localStorageData = {
            user,
            userid,
            exp: new Date().getTime() + 1000 * 3600 * 24,  //expireTime is added for 24 hour
            username: email,
            password,
            module: currentModule
        }
        localStorage.setItem("tokens", JSON.stringify(localStorageData));

            dispatch({
                type: LOGIN,
                payload: {
                    isAuthenticated: res.success === 1,
                    user: user,
                    userid: userid,
                    username: email,
                    userpassword: password,
                    module: currentModule
                }
            });
            history.push('/');

            return;  
        }).catch(err => dispatch({
            type: LOGIN_ERROR,
            payload: {
                value: 'Incorrect credentials'
            }
        }));
}

export const getSessionUser = (username, password) => dispatch => {

    return fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name-or-email/" + Base64.encode(username), {
        method: "GET",
        mode: 'cors',
        headers: {
            "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
            "Content-Type": "application/json"
        },
    }).then(res => {return res;});
}

export const logout = (history) => dispatch => {
    localStorage.removeItem('tokens');
    dispatch({
        type: LOGIN,
        payload: {
            isAuthenticated: false,
            user: '',
            userid: '',
            username: '',
            userpassword: '',
            module: ''
        }
    })
    history.push('/login');

    return;
}

export const setLoginDataAfterReload = (loginData) => dispatch => {

    return dispatch({
        type: LOGIN,
        payload: {
            isAuthenticated: (loginData.userid && true) || false,
            user: loginData.user,
            userid: loginData.userid,
            username: loginData.username,
            userpassword: loginData.password,
            module: loginData.module
        }
    })
}
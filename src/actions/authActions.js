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
            if (typeof res.success === "undefined" || typeof res.data.id === "undefined" || res.success !== 1) {
                throw res;
            }
        const user = res.data.name;
        const userid = res.data.id || '';
        const role = res.data.role;
        const localStorageData = {
            user,
            userid,
            exp: new Date().getTime() + 1000 * 3600 * 24,  //expireTime is added for 24 hour
            username: email,
            password,
            role
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
                    role: role
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
            role: ''
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
            role: loginData.role
        }
    })
}
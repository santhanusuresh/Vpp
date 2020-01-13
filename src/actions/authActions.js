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
            const userId = res.success === 1 ? res.data.id : '';
            localStorage.setItem('user', user);
            localStorage.setItem('userID', userId);
            //expireTime is added for 24 hour
            localStorage.setItem('exp', new Date().getTime() + 1000 * 3600 * 24);
            localStorage.setItem('username', email);
            localStorage.setItem('password', password);

            dispatch({
                type: LOGIN,
                payload: {
                    isAuthenticated: res.success === 1,
                    user: user,
                    userid: userId,
                    username: email,
                    userpassword: password
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
    }).then(res => {
            localStorage.setItem('exp', new Date().getTime() + 1000 * 3600 * 24);
            return res;
    });
}

export const logout = (history) => dispatch => {
    localStorage.removeItem('user');
    dispatch({
        type: LOGIN,
        payload: {
            isAuthenticated: false,
            user: '',
            userid: '',
            username: '',
            userpassword: ''
        }
    })
    history.push('/login');

    return;
}
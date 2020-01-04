import {LOGIN,LOGIN_ERROR,SESSION_USER} from './types';
import { Base64 } from 'js-base64';


export const login=(email,password,history,md5)=>dispatch=>{


    fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name/"+email, {
        method: "GET",
        mode:'cors',
        headers:{
            "Authorization":"Basic "+Base64.encode(`${email}:${password}`),
            "Content-Type": "application/json"
        },
    })
        .then(res => res.json())
        .then(res => {
            // console.log("res",res);
            // console.log("typeof res",typeof res.r);
            if(typeof res.success==="undefined"){

                throw res;
            }

            fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name/"+email, {
                method: "GET",
                mode:'cors',
                headers:{
                    "Authorization":"Basic "+Base64.encode(`${email}:${password}`),
                    "Content-Type": "application/json"
                },
            })
                .then(res=>res.json())
                .then(userDetails=>{
                    // console.log('userDetails',userDetails);
                    localStorage.setItem('user',res.data);
                    localStorage.setItem('userID',res.data.id);
                    localStorage.setItem('exp',1000);
                    localStorage.setItem('username',email);
                    localStorage.setItem('password',password);

                    console.log(res.data.id)

                    dispatch({
                        type:LOGIN,
                        payload:{
                            isAuthenticated: res.success===1,
                            user:res.success===1?'admin':'',
                            userid:res.data.id,
                            username:email,
                            userpassword:password,
                            // userID:res.success===1?res.data.id:''
                        }
                    });
                    history.push('/');
                    return;
                })
        })
        .catch(err=>dispatch({
            type:LOGIN_ERROR,
            payload:{
                value:'Incorrect credentials'
            }
        }));


}

export const getSessionUser=(username,password)=>dispatch=>{
    // const username = 'saraswata';
    // const password = '#abcd123';

    fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name/"+username, {
        method: "GET",
        mode:'cors',
        headers:{
            "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
            "Content-Type": "application/json"
        },
    }) .then(res=>res.json())
        .then(userDetails=>{
            // console.log('userDetails',userDetails);
            localStorage.setItem('exp',1000);
        })

    return fetch("https://vppspark.shinehub.com.au:8443/backend-service/user/name/"+username,{
        method: "GET",
        headers:{
            "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
            "Content-Type": "application/json"
        },
    })
}

export const logout=(history)=>dispatch=>{

    localStorage.removeItem('user');

    dispatch({
        type:LOGIN,
        payload:{
            isAuthenticated:false,
            user:'',
            userid:'',
            username:'',
            userpassword:''
        }
    })

    history.push('/login');
    return;
}
import {LOGIN,LOGIN_ERROR,SESSION_USER} from './types';

export const login=(email,password,history,md5)=>dispatch=>{


    fetch("https://monitoring.shinehub.com.au/handler/login/handleLogin.php", {
        method: "POST",
        mode:'cors',
        body: JSON.stringify({
            d:JSON.stringify({
                cvs: {
                    a: email,
                    p: md5(`${email}${md5(password)}f4225962934c5452hun3o`)
                }
            })
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log("res",res.r);
            console.log("typeof res",typeof res.r);
            if(typeof res.r==='number'){

                throw res;
            }

            fetch('https://monitoring.shinehub.com.au/handler/web/User/handleQueryUserDetail.php',{
                method:"POST",
                body:JSON.stringify({
                    d:JSON.stringify({
                        cvs:{

                        }
                    })
                })
            })
                .then(res=>res.json())
                .then(userDetails=>{
                    console.log('userDetails',userDetails);
                    localStorage.setItem('user',res.r);
                    localStorage.setItem('exp',userDetails.d.expiretime);

                    dispatch({
                        type:LOGIN,
                        payload:{
                            isAuthenticated:typeof res.r==='string',
                            user:typeof res.r==='string'?res.r:''
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

export const getSessionUser=()=>dispatch=>{

    fetch('https://monitoring.shinehub.com.au/handler/web/User/handleQueryUserDetail.php',{
        method:"POST",
        body:JSON.stringify({
            d:JSON.stringify({
                cvs:{

                }
            })
        })
    }) .then(res=>res.json())
        .then(userDetails=>{
            console.log('userDetails',userDetails);
            localStorage.setItem('exp',userDetails.d.expiretime);
        })

    return fetch('https://monitoring.shinehub.com.au/handler/web/User/handleQueryUserDetail.php',{
        method:"POST",
        body:JSON.stringify({
            d:JSON.stringify({
                cvs:{

                }
            })
        })
    })
}

export const logout=(history)=>dispatch=>{

    localStorage.removeItem('user');

    dispatch({
        type:LOGIN,
        payload:{
            isAuthenticated:false,
            user:''
        }
    })

    history.push('/login');
    return;
}
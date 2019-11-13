import {LOGIN,LOGIN_ERROR, SESSION_USER} from '../actions/types';

const initialState={

    isAuthenticated:false,
    loading:false,
    user:'',
    sessionUser:{},
    error:{}

};

const reducer=(state=initialState,action)=>{

    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated:action.payload.isAuthenticated,
                user:action.payload.user
            }
        case LOGIN_ERROR:
            return {
                ...state,
                error:action.payload
            }
        case SESSION_USER:
            return {
                ...state,
               sessionUser:action.payload
            }
    
        default:
            return state;
    }


}

export default reducer;
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer  from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import { ENODEV } from 'constants';


const middlewares=[thunk];
const preloadedState={};

const store=createStore(rootReducer,preloadedState,compose(
    applyMiddleware(...middlewares),
    // process.env.NODE_ENV==='production'?null: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));



export default store;
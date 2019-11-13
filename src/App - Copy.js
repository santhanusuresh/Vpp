import React,{Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Events from './components/events/Events';
import EditEvent from './components/edit-event/EditEvent';
import store from './store/store';
import PrivateRoute from './components/common/PrivateRoute';
import {LOGIN} from './actions/types';
import moment from 'moment';

// fetch('https://monitoring.shinehub.com.au/handler/web/User/handleQueryUserDetail.php',{
//     method:"POST",
//     body:JSON.stringify({
//       d:JSON.stringify({
//         cvs:{

//         }
//       })
//     })
//   })
// .then(res=>res.json())
// .then(res=>{



if( localStorage.getItem('user')!==null){
  const user=localStorage.getItem('user');
  const expiretime=JSON.parse(localStorage.getItem('exp'));

  console.log('time',new Date().getTime());
  console.log('expiretime',expiretime);

  const checkExpireTime=()=>{

    if(expiretime){
      
      return;
    }
    
    if(new Date(expiretime).getTime()>new Date().getTime()){
      
      return;
    }
      
      
      
      return store.dispatch({
        type:LOGIN,
        payload:{
          isAuthenticated:user.length>0,
          user
        }
      })
    }
    // }
    // }
    
    // )}
    checkExpireTime();
  }
    
class App extends Component {
  
  state={
    event:''
  }
  
  render(){

    const {event}=this.state;

    return (
      <Provider store={store}>
      <Router>
    
     
        <PrivateRoute exact path="/" component={Dashboard}/>
        <PrivateRoute exact path="/events" component={Events}/>
        <PrivateRoute exact path="/edit-event" component={EditEvent}/>
        <Route exact path="/login" component={Login}/>
    </Router>
    </Provider>
  );
}
}

export default App;

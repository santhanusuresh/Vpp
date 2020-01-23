import { connect } from 'react-redux';
import { setLoginDataAfterReload } from '../../actions/authActions';

const Auth = (props) => {
    console.log("******Auth [Component]*****************8",props);
    const { auth: { isAuthenticated = false }, setLoginDataAfterReload } = props;
    const localStorageData = JSON.parse(localStorage.getItem("tokens"));
    const { userid = null, exp: expiretime = null } = localStorageData;
    
    const authenticate = () => {
        let allow = false;
        const isLoginExpired = (!expiretime || new Date(expiretime).getTime() < new Date().getTime());
        allow = userid && !isLoginExpired;
        
        //set login data only if store is empty, i.e. first time after reloading
        allow && !isAuthenticated && setLoginDataAfterReload(localStorageData);
        return (allow && "pass") || "fail";
    }
    
    return props[authenticate()]() ;
}

Auth.defaultProps = {
    pass: () => null,
    fail: () => null
  };

const mapStateToProps = state => ({ auth: state.auth })

export default connect(mapStateToProps, { setLoginDataAfterReload })(Auth);

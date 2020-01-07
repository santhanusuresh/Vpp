import React, { Component } from 'react';
import {Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Layout from '../layout/Layout';

const PrivateRoute=({component:Component,auth:auth,...rest})=>{
console.log("auth",auth)
    return (
        <Route
            {...rest}

            render={props=>{
                return auth.isAuthenticated?(
                    <Layout>
                    <Component {...props}/>
                    </Layout>
                ):(
                    <Redirect to="/login"/>
                )
            }}
        />
    )


}

const mapStateToProps=state=>({

auth:state.auth

})

export default connect(mapStateToProps,{})(PrivateRoute);
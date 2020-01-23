import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from '../layout/Layout';

const PrivateRoute = ({ component: Component, auth: auth, ...rest }) => {
    const { WrappedComponent: { name: componentName = "" } = {} } = Component;
    console.log("auth-componentName", auth, componentName);

    return (
        <Route
            {...rest}
            render={props => {
                return auth.isAuthenticated ? (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                ) : ( <Redirect to="/login" /> )
            }}
        />
    )
}

const mapStateToProps = state => ({ auth: state.auth })

export default connect(mapStateToProps, {})(PrivateRoute);
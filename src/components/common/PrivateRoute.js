import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from '../layout/Layout';
import Can from "../common/Can";
import Auth from "../auth/Auth"

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { WrappedComponent: { name: componentName = "" } = {} } = Component;
    console.log("PrivateRoute-componentName", componentName);

    return (
        <Route
            {...rest}
            render={props => {
                return <Auth 
                    pass={() => (
                        <Can perform={`${componentName}:V`}
                            yes={() => (
                                <Layout>
                                    <Component {...props} />
                                </Layout>
                            )} />)
                        }
                    fail={() => (<Redirect to="/login" />)} />
            }}
        />
    )
}

export default PrivateRoute;
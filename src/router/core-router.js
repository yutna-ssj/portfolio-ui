import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import CoreComponent from '../component/core-component/core-component';
import Login from '../component/core-component/login-component';
import PrivateRoute from './private-route';
import { connect } from "react-redux";

const CoreRouter = (props) => {

    return (
        <Router>
            <Switch>
                <Route path='/login' component={Login} />
                <PrivateRoute path='/' component={CoreComponent} />
            </Switch>
        </Router>);
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.httpState.isLoading,
        logged: state.authState.logged
    };
};



export default connect(mapStateToProps)(CoreRouter);
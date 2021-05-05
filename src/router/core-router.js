import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import CoreComponent from '../component/core-component/core-component';

const CoreRouter = (props) => {

    return (
        <Router>
            <Switch>
                <Route path='/' component={CoreComponent} />
            </Switch>
        </Router>);
}


export default CoreRouter;
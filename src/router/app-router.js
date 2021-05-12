import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import CalendarComponent from '../component/app-component/calendar-component';
import CovidComponent from '../component/app-component/covid-component';
import ShoppingComponent from '../component/app-component/shopping-component';
import NotFoundComponent from '../component/core-component/not-found-component';

const AppRouter = (props) => {

    return (
        <Switch>
            <Route path='/calendar' component={CalendarComponent} />
            <Route path='/shopping' component={ShoppingComponent} />
            <Route path='/covid19' component={CovidComponent} />
            <Route path='/404' component={NotFoundComponent} />
            <Redirect path='/*' to='/covid19' />
        </Switch>)
}

export default AppRouter;
import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import CalendarComponent from '../component/app-component/calendar/calendar-component';
import NotFoundComponent from '../component/core-component/not-found-component';

const AppRouter = (props) => {

    return (
        <Switch>
            <Route path='/calendar' component={CalendarComponent} />
            <Route path='/404' component={NotFoundComponent} />
            <Redirect path='/*' to='/calendar' />
        </Switch>)
}

export default AppRouter;
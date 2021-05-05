import React from 'react';
import AppRouter from '../../router/app-router';
import CalendarComponent from '../app-component/calendar-component';


class MainComponent extends React.Component {


    render() {
        return (<div className='main_component'>
            <AppRouter/>

        </div>);
    }
}


export default MainComponent;
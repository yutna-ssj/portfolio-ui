import React from 'react'

import { TabButton, TabButtonGroup } from '../../share-component/tab-button-component';
import CalendarDashBoard from './children/calendar-dashboard-component';
import CalendarPlanner from './children/calendar-planner-component';


class CalendarComponent extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { tabSelected: 0 };
    }

    render() {
        const { tabSelected } = this.state;
        return (<div className='app_container container'>
            <div className='top_app_container'>
                <div className='app_name'>Calendar</div>
                <div className='tab_container'>
                    <TabButtonGroup tabSelected={tabSelected} onChange={(tab) => this.setState({ tabSelected: tab })}>
                        <TabButton key={0} id={0}>DASHBOARD</TabButton>
                        <TabButton key={1} id={1}>PLANNER</TabButton>
                        <TabButton key={2} id={2}>MEETINGS</TabButton>
                        <TabButton key={3} id={3}>MANAGEMENT</TabButton>
                    </TabButtonGroup>
                </div>
            </div>
            <CalendarDashBoard show={tabSelected === 0} />
            <CalendarPlanner show={tabSelected === 1} />
        </div >);
    }
}

export default CalendarComponent;
import React from 'react'

import { TabButton, TabButtonGroup } from '../../share-component/tab-button-component';
import CalendarDashBoard from './children/calendar-dashboard-component';
import CalendarPlanner from './children/calendar-planner-component';
import { checkLeftYear } from '../../share-service/share-service';
import './calendar-style.scss';
import CalendarMeeting from './children/calendar-meeting-component';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class CalendarComponent extends React.Component {

    constructor(_props) {
        super(_props);
        const today = new Date();
        this.state = {
            tabSelected: 0,
            today: [today.getDate(), today.getMonth(), today.getFullYear()],
            dashboardCalendar: { year: today.getFullYear(), month: today.getMonth(), week: -1, datesOfCalendar: [] },
            plannerCalendar: { year: today.getFullYear(), month: today.getMonth(), week: -1, datesOfCalendar: [] }
        };
    }

    componentDidMount() {
        const { dashboardCalendar, plannerCalendar } = this.state;
        this.setState({ dashboardCalendar: this.getCalendar(dashboardCalendar.year, dashboardCalendar.month, dashboardCalendar.week) });
        this.setState({ plannerCalendar: this.getCalendar(plannerCalendar.year, plannerCalendar.month, plannerCalendar.week) });
    }

    getCalendar = (year, month, week) => {
        const { today } = this.state;
        const ret = [];
        const startDateOfMonth = new Date(year, month, 1);
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (month === 0 ? 11 : month - 1) : month;
        let dateOfCalendar = monthOfCalendar === month ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);
        let yearOfCalendar = month === 0 ? year - 1 : year;
        for (let i = 0; i < 6; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                let item_date = { date: 0, month: -1, year: 0, disabled: false };
                item_date.date = dateOfCalendar;
                item_date.month = monthOfCalendar + 1;
                item_date.year = yearOfCalendar;
                item_date.disabled = month !== monthOfCalendar;
                datesOfWeek.push(item_date);
                if ((today[0] === dateOfCalendar && today[1] === monthOfCalendar && today[2] === year) && week === -1)
                    week = i;
                dateOfCalendar++;
                if (dateOfCalendar > datesOfMonth[monthOfCalendar]) {
                    monthOfCalendar = monthOfCalendar == 11 ? 0 : monthOfCalendar + 1;
                    yearOfCalendar = monthOfCalendar === 0 ? yearOfCalendar + 1 : yearOfCalendar;
                    dateOfCalendar = 1;
                }
            }
            ret.push(datesOfWeek);
        }
        return { year: year, month: month, week: week, datesOfCalendar: ret };
    }

    onDashboardCalendarChange = (key, value) => {
        this.setState(prevState => ({ dashboardCalendar: { ...prevState.dashboardCalendar, [key]: value } }));
    }

    onPlannerCalendarChange = (key, value) => {
        this.setState(prevState => ({ plannerCalendar: { ...prevState.plannerCalendar, [key]: value } }));
    }

    render() {
        const { tabSelected, dashboardCalendar, plannerCalendar, today } = this.state;
        return (

            <React.Fragment>
                <div className='app'>
                    <div className='app_container container'>
                        <div className='top_app_container'>
                            <div className='app_name'>Calendar</div>
                            <div className='tab_container'>
                                <TabButtonGroup tabSelected={tabSelected} onChange={(tab) => this.setState({ tabSelected: tab })}>
                                    <TabButton key={0} id={0}>DASHBOARD</TabButton>
                                    <TabButton key={1} id={1}>PLANNER</TabButton>
                                    <TabButton key={2} id={2}>MEETINGS</TabButton>
                                    {/* <TabButton key={3} id={3}>MANAGEMENT</TabButton> */}
                                </TabButtonGroup>
                            </div>
                        </div>
                    </div>
                    <CalendarDashBoard show={tabSelected === 0} calendar={dashboardCalendar} today={today}
                        onStateChange={(key, value) => this.onDashboardCalendarChange(key, value)} getCalendar={(year, month, week) => this.setState({ dashboardCalendar: this.getCalendar(year, month, week) })} />
                    <CalendarPlanner show={tabSelected === 1} calendar={plannerCalendar} today={today}
                        onStateChange={(key, value) => this.onPlannerCalendarChange(key, value)} getCalendar={(year, month, week) => this.setState({ plannerCalendar: this.getCalendar(year, month, week) })} />
                    <CalendarMeeting show={tabSelected === 2} calendar={plannerCalendar} today={today} />
                    <div className='safety_bottom'></div>
                </div>
            </React.Fragment>


        );
    }
}

export default CalendarComponent;
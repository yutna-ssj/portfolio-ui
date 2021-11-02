import React from "react";
import ContentBox from "../../../share-component/content-box-component";
import arrow from '../../../../assets/arrow.svg';
import { DurationInput, SelectInput, TextAreaInput, TextInput } from "../../../share-component/input-component";
import MessageComponent, { MESSAGE_TYPE } from "../../../share-component/message-component";
import { http, HTTP_METHOD } from "../../../share-service/http-service";
import { env } from "../../../../env";
import banner from "../../../../assets/planner-banner.svg";
import { parseDateStringToArray } from "../../../share-service/share-service";


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default class CalendarPlanner extends React.Component {

    constructor(_props) {
        super(_props);
        const today = new Date();
        this.state = {
            isNewCreate: false,
            createForm: { name: '', assignTo: '', type: '', fromDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()], toDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()], remark: '' },
            subUserOptions: [],
            plannerTypeOptions: [],
            plannerEvents: []
        }
    }

    componentDidMount() {
        const { calendar, getCalendar } = this.props;
        console.log('calendar', calendar);
        document.addEventListener('mousedown', this.onDocClick);
        this.getSubUsers();
        this.getPlannerTypes();
    }

    getSubUsers = () => {
        http(HTTP_METHOD.GET, env.url + '/api/user/sub-user/get-by-user').then((res) => {
            this.setState({ subUserOptions: res });
        }).catch((err) => {

        });
    }

    getPlannerTypes = () => {
        http(HTTP_METHOD.GET, env.url + '/api/calendar/planner/plan-type/get-all').then((res) => {
            this.setState({ plannerTypeOptions: res });
        }).catch((err) => {

        });
    }

    getPlannerEvents = () => {
        const { calendar } = this.props;
        if (calendar.datesOfCalendar.length > 0) {
            const fromDate = [calendar.datesOfCalendar[0][0].year, calendar.datesOfCalendar[0][0].month, calendar.datesOfCalendar[0][0].date];
            const toDate = [calendar.datesOfCalendar[5][6].year, calendar.datesOfCalendar[5][6].month, calendar.datesOfCalendar[5][6].date];
            http(HTTP_METHOD.POST, env.url + '/api/calendar/planner/get-by-user', { fromDate: fromDate, toDate: toDate }).then((res) => {
                this.setState({ plannerEvents: res });
            }).catch((err) => {

            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocClick);
    }

    //#region c

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const { calendar: prevCalendar } = prevProps;
        const { calendar: nextCalendar } = this.props;
        if (prevCalendar.year !== nextCalendar.year || prevCalendar.month !== nextCalendar.month || prevCalendar.datesOfCalendar.length !== nextCalendar.datesOfCalendar.length)
            return true;
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            console.log('update');
            this.getPlannerEvents()
        }
    }
    onMouseLeave = () => {
        this.isMouseLeaveOnDropdown = true;
    }

    onMouseEnter = () => {
        this.isMouseLeaveOnDropdown = false;
    }

    onDocClick = () => {
        const { isNewCreate } = this.state;
        if (this.isMouseLeaveOnDropdown && isNewCreate) {
            this.setState({ isNewCreate: false });
            this.isMouseLeaveOnDropdown = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }

    onPreviousMonthClick = () => {
        const { calendar, getCalendar } = this.props;
        const month = calendar.month - 1 < 0 ? 11 : calendar.month - 1;
        const year = month === 11 ? calendar.year - 1 : calendar.year;
        getCalendar(year, month, calendar.week);
    }

    onNextMonthClick = () => {
        const { calendar, getCalendar } = this.props;
        const month = calendar.month + 1 > 11 ? 0 : calendar.month + 1;
        const year = month === 0 ? calendar.year + 1 : calendar.year;
        getCalendar(year, month, calendar.week);
    }

    onPreviousWeekClick = () => {
        const { calendar, onStateChange } = this.props;
        const week = calendar.week - 2 < 0 ? 4 : calendar.week - 2;
        if (week === 4)
            this.onPreviousMonthClick()
        onStateChange('week', week);
    }

    onNextWeekClick = () => {
        const { calendar, onStateChange } = this.props;
        const week = calendar.week + 2 > 4 ? 0 : calendar.week + 2;
        if (week === 0)
            this.onNextMonthClick()
        onStateChange('week', week);
    }




    //#endregion

    testDate = () => {
        http(HTTP_METHOD.POST, env.url + '/api/calendar/planner/add', { fromDate: '2021-01-01 12:22:01', toDate: [2021, 10, 1, 23, 0, 15] }).then((res) => {

        }).catch((err) => {

        });
    }

    render() {
        const { show, calendar, today } = this.props;
        const { isNewCreate, createForm, subUserOptions, plannerTypeOptions, plannerEvents } = this.state;
        const weeks = [];
        if (calendar.week % 2 === 0) {
            weeks.push(calendar.week)
            weeks.push(calendar.week + 1);
        } else {
            weeks.push(calendar.week - 1);
            weeks.push(calendar.week)
        }

        return (<React.Fragment>
            {show ? <React.Fragment>
                <ContentBox id='1' title='Assignment Planner'>
                    <div className='calendar_container'>
                        <div className='left'>
                            <div className='card container month_calendar_container'>
                                <div className='top_month_calendar'>
                                    <label>{monthsOfYear[calendar.month]} {calendar.year}</label>
                                    <div className='button_container'>
                                        <button onClick={(e) => this.onPreviousMonthClick()}><img src={arrow} /></button>
                                        <button onClick={(e) => this.onNextMonthClick()}><img src={arrow} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                </div>
                                <div className='body_month_calendar'>
                                    {calendar.datesOfCalendar.map((week, index) => week.map((item) =>
                                        <div key={index + week.indexOf(item)} className={weeks.includes(index) ? 'current_week' : ''}>
                                            <div className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}>{item.date}</div>
                                        </div>))}
                                </div>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='info_app_container'>
                                <img src={banner} />
                                <div className='message'>
                                    <div className='header'>WELCOME TO CALENDAR PLANNER</div>
                                    <div className='content'>This is app for making plan. The users can see their tasks and subordinates tasks,
                                        they can make some assignment to others depend on their role and manage their tasks was assigned.</div>
                                </div>
                            </div>
                            <div className='week_calendar_overview_container'>
                                <div className='top_week_calendar'>
                                    <div className='button_container'>
                                        <button onClick={(e) => this.onPreviousWeekClick()}><img src={arrow} /></button>
                                        <button onClick={(e) => this.onNextWeekClick()}><img src={arrow} /></button>
                                    </div>
                                    <label>{monthsOfYear[calendar.datesOfCalendar[weeks[0]][0].month - 1]} {calendar.datesOfCalendar[weeks[0]][0].date}, {calendar.datesOfCalendar[weeks[0]][0].year} - {monthsOfYear[calendar.datesOfCalendar[weeks[1]][6].month - 1]} {calendar.datesOfCalendar[weeks[1]][6].date}, {calendar.datesOfCalendar[weeks[1]][6].year}</label>
                                </div>
                            </div>
                            <div className='planner_button_container'>
                                <div ref={this.buttonRef} style={{ width: 'auto' }}>
                                    <button className='planner_create_button' onClick={() => this.setState({ isNewCreate: true })}>New</button>
                                    {isNewCreate ? <div className='planner_form'>
                                        <div className='container' style={{ marginTop: '20px' }}>
                                            <label className='planner_form_add_label'>Create new assignment</label>
                                            <div className='row'>
                                                <div className='col-sm-8' >
                                                    <TextInput label='Name' value={createForm.name} maxLength={50} placeholder='Name 50 characters' onChange={(e) => this.setState({ createForm: { ...createForm, name: e } })} />
                                                </div>
                                                <div className='col-sm-4'>
                                                    <SelectInput label='Assign to' value={createForm.assignTo} onChange={(e) => this.setState({ createForm: { ...createForm, assignTo: e } })} >
                                                        <option value='' disabled>Select user</option>
                                                        <option value='0'>Me</option>
                                                        {subUserOptions.map((option, index) => <option key={index} value={option.userID.toString()}>{option.username}</option>)}
                                                    </SelectInput>
                                                </div>
                                                <div className='col-sm-4'>
                                                    <SelectInput label='Type' value={createForm.type} onChange={(e) => this.setState({ createForm: { ...createForm, type: e } })} >
                                                        <option value='' disabled>Select type</option>
                                                        {plannerTypeOptions.map((option, index) => <option key={index} value={option.plannerTypeID.toString()}>{option.typeName}</option>)}
                                                    </SelectInput>
                                                </div>
                                                <div className='col-sm-8' >
                                                    <DurationInput label='Date duration' fromDateValue={createForm.fromDate} toDateValue={createForm.toDate} onChange={(fromDate, toDate) => { this.setState({ createForm: { ...createForm, fromDate: fromDate, toDate: toDate } }) }} />
                                                </div>
                                                <div className='col-sm-12' >
                                                    <TextAreaInput label='Remark' value={createForm.remark} maxLength={128} placeholder='Remark 128 characters' onChange={(e) => this.setState({ createForm: { ...createForm, remark: e } })} />
                                                </div>
                                                <button className='button border_bottom_radius' onClick={(e) => { }}>Save</button>
                                            </div>
                                        </div>
                                    </div> : null}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='planner_container'>
                        <div className='header_planner_calendar'>
                            <div>
                                <label>Owner</label>
                            </div>
                            {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                                <div key={index}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                            )}
                            {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                                <div key={index}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                            )}
                            {/* {calendar.datesOfCalendar.map((week, index) => week.map((item) =>
                                <div key={index}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>)
                            )} */}
                        </div>
                        <div className='body_planner_calendar'>
                            <div className='body_container'>
                                <div>
                                    {/* <label>Ice Ice</label> */}
                                </div>
                                {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                                    <div key={index}>
                                    </div>
                                )}
                                {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                                    <div key={index}>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='list_planner_container' key={calendar.month.toString() + calendar.year.toString() + calendar.week.toString()}>
                            <div className='body_container'>
                                {/* <div className='bg'></div>
                                {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                                    <div className='bg' key={index}>
                                    </div>
                                )}
                                {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                                    <div className='bg' key={index}>
                                    </div>
                                )} */}

                                {<PlannerEvents events={plannerEvents} weeks={calendar.datesOfCalendar[weeks[0]].concat(calendar.datesOfCalendar[weeks[1]])} />}
                            </div>

                            {/* <div>
                                Ice Ice
                            </div>
                            <div className='item_planner'>
                                Ice Ice
                            </div> */}
                        </div>
                        {/* <div className='planner_date'>
                            <div className='header_planner_calendar'>
                                <label>Owner</label>
                            </div>
                            <div className='body_planner_calendar'>
                                <div>Ice Ice</div>
                            </div>
                        </div>
                        {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                            <div className='planner_date sticky'>
                                <div className='header_planner_calendar' key={index}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                                <div className='body_planner_calendar'>
                                    <div className='body_container'>

                                    </div>
                                </div>
                            </div>
                        )} */}
                        {/* {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                            <div className='planner_date'>
                                <div className='header_planner_calendar' key={index}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                                <div className='body_planner_calendar'>

                                </div>
                            </div>
                        )} */}
                        {/* </div> */}
                    </div>
                </ContentBox>
            </React.Fragment> : null}
        </React.Fragment>);
    }

}

const PlannerEvents = (props) => {
    const { events, weeks } = props;
    const plannerEvents = [];
    const tempEvents = events.reduce(function (rv, x) {
        (rv[x['user']['username']] = rv[x['user']['username']] || []).push(x);
        return rv;
    }, {});

    for (let item in tempEvents) {
        const tempEventsByUser = tempEvents[item];
        const eventsByUser = [];
        for (let i = 0; i < tempEventsByUser.length; i++) {
            const tempItemEvent = tempEventsByUser[i];
            let start = -1;
            let end = 0;

            const temp_start_dt = parseDateStringToArray(tempItemEvent.startDate);
            const temp_end_dt = parseDateStringToArray(tempItemEvent.endDate);

            const start_dt = new Date(temp_start_dt[0], temp_start_dt[1] - 1, temp_start_dt[2]);
            const end_dt = new Date(temp_end_dt[0], temp_end_dt[1] - 1, temp_end_dt[2]);

            for (let j = 0; j < weeks.length; j++) {
                const item_date = new Date(weeks[j].year, weeks[j].month - 1, weeks[j].date);

                if (item_date.getTime() >= start_dt.getTime() && item_date.getTime() <= end_dt.getTime()) {
                    if (start === -1) {
                        start = j;
                    }
                    end++;
                }
            }

            if (start !== -1 && end !== 0) {
                eventsByUser.push(
                    <div key={i} className='item_planner' style={{ marginLeft: (start * 100) + 150 + 'px', width: end * 100 + 'px' }}>
                        <div className='line' style={{ backgroundColor: '#' + tempItemEvent.plannerType.typeColor + '8e' }} />
                        <div className='planner_desc_container'>
                            <label className='planner_taskname'>{tempItemEvent.taskName} <label className='planner_period'>({monthsOfYear[temp_start_dt[1] - 1].substr(0, 3)} {temp_start_dt[2]}, {temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3)} {temp_end_dt[2]}, {temp_end_dt[0]})</label></label>
                            {/* <label className='planner_owner'>Assigned by Ice Ice</label> */}
                        </div>
                    </div>)

            }

        }
        plannerEvents.push(<div key={item} className='group_container'>
            <div className='owner'>
                {item}
            </div>
            {eventsByUser}
        </div>)
    }

    // <div className='group_container'>
    //     <div className='owner'>
    //         Robot 3
    //     </div>
    //     <div className='item_planner'>
    //         <div className='line' />
    //         <div className='planner_desc_container'>
    //             <label className='planner_taskname'>Test three <label className='planner_period'>(Oct 1, 2021 - Nov 1, 2021)</label></label>
    //             <label className='planner_owner'>Assigned by Ice Ice</label>
    //         </div>
    //     </div>
    //     <div className='item_planner second'>
    //         <div className='line' />
    //         <div className='planner_desc_container'>
    //             <label className='planner_taskname'>Test three <label className='planner_period'>(Oct 1, 2021 - Nov 1, 2021)</label></label>
    //             <label className='planner_owner'>Assigned by Ice Ice</label>
    //         </div>
    //     </div>
    //     <div className='item_planner second'>
    //         <div className='line' />
    //         <div className='planner_desc_container'>
    //             <label className='planner_taskname'>Test three <label className='planner_period'>(Oct 1, 2021 - Nov 1, 2021)</label></label>
    //             <label className='planner_owner'>Assigned by Ice Ice</label>
    //         </div>
    //     </div>
    // </div>


    return (<React.Fragment>{plannerEvents}</React.Fragment>)
}
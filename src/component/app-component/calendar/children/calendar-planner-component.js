import React from "react";
import ContentBox from "../../../share-component/content-box-component";
import arrow from '../../../../assets/arrow.svg';
import { checkLeftYear } from '../../../share-service/share-service';
import { DurationInput, SelectInput, TextInput } from "../../../share-component/input-component";
import MessageComponent, { MESSAGE_TYPE } from "../../../share-component/message-component";
import { http, HTTP_METHOD } from "../../../share-service/http-service";
import { env } from "../../../../env";


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default class CalendarPlanner extends React.Component {

    constructor(_props) {
        super(_props);
        const today = new Date();
        this.state = {
            isNewCreate: false,
            createForm: { name: '', assignTo: '', type: '', fromDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()], toDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()] },
            subUserOptions: [],
            plannerTypeOptions: [],
            plannerEvents: []
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocClick);
        this.getSubUsers();
        this.getPlannerTypes();

        http(HTTP_METHOD.GET, env.url + '/api/calendar/planner/get-by-user').then((res) => {
            this.setState({ plannerEvents: res });
        }).catch((err) => {

        });
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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocClick);
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
                            <div className='week_calendar_overview_container'>
                                <div className='top_week_calendar'>
                                    <div className='button_container'>
                                        <button onClick={(e) => this.onPreviousWeekClick()}><img src={arrow} /></button>
                                        <button onClick={(e) => this.onNextWeekClick()}><img src={arrow} /></button>
                                    </div>
                                    <label>{monthsOfYear[calendar.datesOfCalendar[weeks[0]][0].month - 1]} {calendar.datesOfCalendar[weeks[0]][0].date}, {calendar.datesOfCalendar[weeks[0]][0].year} - {monthsOfYear[calendar.datesOfCalendar[weeks[1]][6].month - 1]} {calendar.datesOfCalendar[weeks[1]][6].date}, {calendar.datesOfCalendar[weeks[1]][6].year}</label>
                                </div>
                            </div>
                            <div className='card'>
                                Welcome to planner calendar.
                            </div>
                            <div className='planner_button_container'>
                                <div ref={this.buttonRef} style={{ width: 'auto' }}>
                                    <button className='planner_create_button' onClick={() => this.setState({ isNewCreate: true })}>New</button>
                                    {isNewCreate ? <div className='planner_form'>
                                        <div className='container' style={{ marginTop: '20px' }}>
                                            <label className='planner_form_add_label'>Create new assignment</label>
                                            <div className='row'>
                                                <div className='col-sm-12' >
                                                    <TextInput label='Name' value={createForm.name} placeholder='Name' onChange={(e) => this.setState({ createForm: { ...createForm, name: e } })} />
                                                </div>
                                                <div className='col-sm-6'>
                                                    <SelectInput label='Assign to' value={createForm.assignTo} onChange={(e) => this.setState({ createForm: { ...createForm, assignTo: e } })} >
                                                        <option value='' disabled>Select user</option>
                                                        <option value='0'>Me</option>
                                                        {subUserOptions.map((option, index) => <option key={index} value={option.userID.toString()}>{option.username}</option>)}
                                                    </SelectInput>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <SelectInput label='Type' value={createForm.type} onChange={(e) => this.setState({ createForm: { ...createForm, type: e } })} >
                                                        <option value='' disabled>Select type</option>
                                                        {plannerTypeOptions.map((option, index) => <option key={index} value={option.plannerTypeID.toString()}>{option.typeName}</option>)}
                                                    </SelectInput>
                                                </div>
                                                <div className='col-sm-12' >
                                                    <DurationInput label='Date duration' fromDateValue={createForm.fromDate} toDateValue={createForm.toDate} onChange={(fromDate, toDate) => { this.setState({ createForm: { ...createForm, fromDate: fromDate, toDate: toDate } }) }} />
                                                </div>
                                                {/* <div className='col-sm-12'>
                                            <MessageComponent type={MESSAGE_TYPE.SUCCESS} />
                                        </div> */}
                                                <button className='button border_bottom_radius' onClick={(e) => { }}>Save</button>
                                            </div>
                                        </div>
                                    </div> : null}
                                </div>
                                {/* <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                    <label className ="form-check-label" for="flexCheckDefault">
                                    Default checkbox
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked/>
                                    <label className ="form-check-label" for="flexCheckChecked">
                                    Checked checkbox
                                    </label>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <button className='planner_create_button' style={{ marginBottom: '10px' }}>New</button> */}



                    {/* <div className='container card'>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <TextInput label='Name' />
                            </div>
                            <div className='col-sm-12'>
                                <TextInput label='Start date' />
                            </div>
                        </div>
                    </div> */}
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

            const start_dt = new Date(tempItemEvent.startDate[0], tempItemEvent.startDate[1] - 1, tempItemEvent.startDate[2]);
            const end_dt = new Date(tempItemEvent.endDate[0], tempItemEvent.endDate[1] - 1, tempItemEvent.endDate[2]);

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
                            <label className='planner_taskname'>{tempItemEvent.taskName} <label className='planner_period'>({monthsOfYear[tempItemEvent.startDate[1] - 1].substr(0, 3)} {tempItemEvent.startDate[2]}, {tempItemEvent.startDate[0]} - {monthsOfYear[tempItemEvent.endDate[1] - 1].substr(0, 3)} {tempItemEvent.endDate[2]}, {tempItemEvent.endDate[0]})</label></label>
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
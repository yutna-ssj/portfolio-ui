import React, { useState } from "react";
import ContentBox from "../../../share-component/content-box-component";
import arrow from '../../../../assets/arrow.svg';
import { DurationInput, SelectInput, TextAreaInput, TextInput } from "../../../share-component/input-component";
import MessageComponent, { MESSAGE_TYPE } from "../../../share-component/message-component";
import { http, HTTP_METHOD } from "../../../share-service/http-service";
import { env } from "../../../../env";
import banner from "../../../../assets/planner-banner.svg";
import { parseDateStringToArray } from "../../../share-service/share-service";
import x from "../../../../assets/x.png";

import { Accordion, useAccordionButton } from 'react-bootstrap';


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default class CalendarPlanner extends React.Component {

    isMouseLeaveDetail = false;

    constructor(_props) {
        super(_props);
        const today = new Date();
        this.state = {
            isNewCreate: false,
            createForm: { name: '', assignTo: '', type: '', fromDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()], toDate: [today.getFullYear(), today.getMonth() + 1, today.getDate()], remark: '' },
            form: {},
            subUserOptions: [],
            plannerTypeOptions: [],
            plannerEvents: [],
            selectedPlanner: -1,
            isDetailOpen: false,
            tabPlanner: "-1"
        }

        this.plannerContainerRef = React.createRef();
        this.smPlannerDescRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocClick);
        this.getSubUsers();
        this.getPlannerTypes();

        const date1 = new Date();
        const date2 = new Date('11/6/2021');
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
        const { calendar, onStateChange } = this.props;
        if (snapshot) {
            this.getPlannerEvents()
            if (calendar.week % 2 !== 0) {
                onStateChange('week', calendar.week - 1);
            }
        }
    }

    onMouseLeave = () => {
        this.isMouseLeaveOnDropdown = true;
    }

    onMouseEnter = () => {
        this.isMouseLeaveOnDropdown = false;
    }

    onDocClick = () => {
        const { isNewCreate, isDetailOpen } = this.state;

        if (this.isMouseLeaveOnDropdown && isNewCreate) {
            this.setState({ isNewCreate: false });
            this.isMouseLeaveOnDropdown = false;
        }

        if (this.isMouseLeaveDetail && isDetailOpen) {
            this.setState({ isDetailOpen: false, selectedPlanner: -1 });
            this.isMouseLeaveDetail = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }

    detailRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeaveDetail);
            ref.addEventListener('mouseenter', this.onMouseEnterDetail);
        }
    }

    onMouseLeaveDetail = () => {
        this.isMouseLeaveDetail = true;
    }

    onMouseEnterDetail = () => {
        this.isMouseLeaveDetail = false;
    }



    onPreviousMonthClick = () => {
        const { calendar, getCalendar } = this.props;
        const month = calendar.month - 1 < 0 ? 11 : calendar.month - 1;
        const year = month === 11 ? calendar.year - 1 : calendar.year;
        this.plannerContainerRef.current.scrollLeft = 0
        getCalendar(year, month, calendar.week);
    }

    onNextMonthClick = () => {
        const { calendar, getCalendar } = this.props;
        const month = calendar.month + 1 > 11 ? 0 : calendar.month + 1;
        const year = month === 0 ? calendar.year + 1 : calendar.year;
        this.plannerContainerRef.current.scrollLeft = 0
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

    pointEventOnCalendar = (itemDate) => {
        const { disabled } = itemDate;
        const { plannerEvents } = this.state;
        const ret = [];
        if (disabled)
            return null;

        const date = new Date(itemDate.year, itemDate.month - 1, itemDate.date);

        for (let i = 0; i < plannerEvents.length; i++) {
            const plan = plannerEvents[i];

            const tempStartDate = parseDateStringToArray(plan.startDate);
            const tempEndDate = parseDateStringToArray(plan.endDate);

            const startDate = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]);
            const endDate = new Date(tempEndDate[0], tempEndDate[1] - 1, tempEndDate[2]);

            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                if (ret.length < 3) {
                    ret.push(<div key={i} className='planner_point' style={{ backgroundColor: '#' + plan.plannerType.typeColor }} />);
                }
            }
        }

        return (
            <React.Fragment>
                <div className='point_container'>
                    {ret}
                </div>
            </React.Fragment>
        );
    }


    render() {
        const { show, calendar, today, onStateChange } = this.props;
        const { isNewCreate, createForm, subUserOptions, plannerTypeOptions, plannerEvents, isDetailOpen, form, selectedPlanner, tabPlanner } = this.state;
        const weeks = [];
        if (calendar.week % 2 === 0) {
            weeks.push(calendar.week)
            weeks.push(calendar.week + 1);
        }

        return (<React.Fragment>
            {show ? <React.Fragment>
                <div className='container'>
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
                                    {calendar.datesOfCalendar.map((week, iw) => week.map((item) => {
                                        const isToday = (today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year);
                                        let itemDateClassname = '_item_day';
                                        let itemDateBlockClassname = '_item_day_calendar';
                                        if (isToday) {
                                            itemDateClassname = itemDateClassname.concat(' today');
                                        }

                                        if (weeks.includes(iw)) {
                                            itemDateBlockClassname = itemDateBlockClassname.concat(' current_week');
                                        }

                                        if (item.disabled) {
                                            itemDateClassname = itemDateClassname.concat(' disabled');
                                            // itemDateBlockClassname = itemDateBlockClassname.concat(' _disabled');
                                        }
                                        return (<div className={itemDateBlockClassname} key={iw + item.date}>
                                            <div className={itemDateClassname}><div>{item.date}</div>
                                                {this.pointEventOnCalendar(item)}
                                            </div>
                                        </div>);
                                    }))}
                                </div>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='info_app_container'>
                                <img src={banner} />
                                <div className='message'>
                                    <div className='header'>WELCOME TO CALENDAR PLANNER</div>
                                    <div className='content'>This is app for making plan.The users can see their tasks and subordinates tasks,
                                        they can make some assignment to others depend on their role and manage their tasks was assigned.</div>
                                </div>
                            </div>
                            <div className='planner_button_container'>
                                <div ref={this.buttonRef} style={{ width: 'auto' }}>
                                    <button className='planner_create_button' onClick={() => this.setState({ isNewCreate: true })}>Create</button>
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
                                                        <option value='' disabled>Select type </option>
                                                        {plannerTypeOptions.map((option, index) => <option key={index} value={option.plannerTypeID.toString()}>{option.typeName}</option>)}
                                                    </SelectInput>
                                                </div>
                                                <div className='col-sm-8' >
                                                    <DurationInput label='Date duration' fromDateValue={createForm.fromDate} toDateValue={createForm.toDate} onChange={(fromDate, toDate) => { this.setState({ createForm: { ...createForm, fromDate: fromDate, toDate: toDate } }) }} />
                                                </div>
                                                <div className='col-sm-12' >
                                                    <TextAreaInput label='Tell something' value={createForm.remark} maxLength={128} placeholder='128 characters' onChange={(e) => this.setState({ createForm: { ...createForm, remark: e } })} />
                                                </div>
                                                <button className='button border_bottom_radius' onClick={(e) => { }}>Save</button>
                                            </div>
                                        </div>
                                    </div> : null}
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
                        </div>
                    </div>

                    <div ref={this.plannerContainerRef} className='planner_container'>
                        <div className='header_planner_calendar'>
                            <div>
                                <label>Owner</label>
                            </div>
                            {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                                <div key={index} className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                            )}
                            {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                                <div key={index} className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}>
                                    <label>{monthsOfYear[item.month - 1].substr(0, 3)}</label>
                                    <label>{item.date}</label>
                                </div>
                            )}
                        </div>
                        <div className='body_planner_calendar'>
                            <div className='body_container'>
                                <div>
                                </div>
                                {calendar.datesOfCalendar[weeks[0]].map((item, index) =>
                                    <div key={index} className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}>
                                    </div>
                                )}
                                {calendar.datesOfCalendar[weeks[1]].map((item, index) =>
                                    <div key={index} className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='list_planner_container' key={calendar.month.toString() + calendar.year.toString() + calendar.week.toString()}>
                            <div className='body_container'>
                                {<PlannerEvents events={plannerEvents} weeks={calendar.datesOfCalendar[weeks[0]].concat(calendar.datesOfCalendar[weeks[1]])} selectedPlanner={selectedPlanner}
                                    onDetailCilck={(index, item) => { this.setState({ isDetailOpen: true, form: item, selectedPlanner: index }); this.onMouseLeaveDetail(); }} />}
                            </div>
                        </div>
                    </div>

                    <div className='sm_planner_container' key={calendar.month.toString() + calendar.year.toString() + calendar.week.toString()}>
                        {<SmPlannerEvents events={plannerEvents} today={today} weeks={calendar.datesOfCalendar[weeks[0]].concat(calendar.datesOfCalendar[weeks[1]])} />}
                    </div>
                    <div className='bottom_safety' />
                </div>
                {isDetailOpen ? <EventDetail form={form} detailRef={this.detailRef} onClose={() => this.setState({ isDetailOpen: false, selectedPlanner: -1 })} /> : null}
            </React.Fragment > : null
            }
        </React.Fragment>);
    }

}

const EventDetail = (props) => {
    const { form, detailRef, onClose } = props;
    const startDate = parseDateStringToArray(form.startDate);
    const endDate = parseDateStringToArray(form.endDate);

    return (<div ref={detailRef}>
        <div className='planner_detail'>
            <div className='color' ></div>
            <button className='close_button' onClick={() => onClose()}><img src={x} /></button>
            <div className='planner_detail_container container'>
                <div className='planner_detail_header'>
                    <div className='planner_detail_header_left'>
                        <label className='planner_name'>{form.taskName}</label>
                        <label className='planner_period'>({monthsOfYear[startDate[1] - 1].substr(0, 3)} {startDate[2]}, {startDate[0]} - {monthsOfYear[endDate[1] - 1].substr(0, 3)} {endDate[2]}, {endDate[0]})</label>
                    </div>
                    <div className='planner_detail_header_right'>
                        <div className='color_circle' style={{ backgroundColor: '#' + form.plannerType.typeColor + '8d' }} />
                        <div className='planner_type'>{form.plannerType.typeName}</div>
                    </div>
                </div>
                <div className='planner_detail_content'>
                    <label>{form.user.username}</label>
                    {form.user.username !== form.assignedUser.username ? <label>Assigned by {form.assignedUser.username}</label> : null}
                    {form.remark ? <div className='planner_detail_remark'>
                        <div className='color_circle' style={{ backgroundColor: '#' + form.plannerType.typeColor + '8d' }} />
                        <label>{form.remark}</label>
                    </div> : null}
                    <div className='owner_image'>
                        <img src={env.url + '/auth/profile/image/get-by-user/' + form.user.userID} />
                    </div>
                </div>
                <div className='planner_detail_button'>
                    <button className='done_button'>Done</button>
                    <button className='cancel_button'>Delete</button>
                    {/* <button className='backtoprocess_button'>Back to processing</button> */}
                </div>
            </div>
            {/* <button className='button border_bottom_radius' style={{ width: '100%' }} onClick={(e) => { }}>Save</button> */}
        </div>
    </div>);
}


const SmPlannerEvents = (props) => {
    const { events, today, weeks } = props;

    const [tabPlanner, setTabPlanner] = useState("-1");


    const plannerEvents = [];
    const tempEvents = events.reduce(function (rv, x) {
        (rv[x['user']['username']] = rv[x['user']['username']] || []).push(x);
        return rv;
    }, {});

    let keyTab = 0;
    for (let item in tempEvents) {
        const tempEventsByUser = tempEvents[item];
        const itemPlanners = [];
        for (let i = 0; i < tempEventsByUser.length; i++) {
            const tempItemEvent = tempEventsByUser[i];
            let isBetweenWeek = false;
            let isToday = false;
            const temp_start_dt = parseDateStringToArray(tempItemEvent.startDate);
            const temp_end_dt = parseDateStringToArray(tempItemEvent.endDate);

            const start_dt = new Date(temp_start_dt[0], temp_start_dt[1] - 1, temp_start_dt[2]);
            const end_dt = new Date(temp_end_dt[0], temp_end_dt[1] - 1, temp_end_dt[2]);
            const today_dt = new Date(today[2], today[1], today[0]);


            for (let j = 0; j < weeks.length; j++) {
                const item_date = new Date(weeks[j].year, weeks[j].month - 1, weeks[j].date);

                if (item_date.getTime() >= start_dt.getTime() && item_date.getTime() <= end_dt.getTime()) {
                    isBetweenWeek = true;

                    if (today_dt.getTime() === item_date.getTime()) {
                        isToday = true;
                    }

                }
            }

            if (isBetweenWeek) {
                const key = keyTab;
                itemPlanners.push(<div className='item_planner' key={item + '' + i} onClick={() => {
                    if (tabPlanner === key) {
                        setTabPlanner(-1)
                    } else {
                        setTabPlanner(key)
                    }
                }}>
                    {isToday ? <div className='today'>Today, {monthsOfYear[today[1]].substr(0, 3)} {today[0]}</div > : null
                    }
                    <div className='pin_container' >
                        <div className='line' style={{ backgroundColor: '#' + tempItemEvent.plannerType.typeColor }}></div>
                        <div className='point' style={{ backgroundColor: '#' + tempItemEvent.plannerType.typeColor }}></div>
                    </div>
                    <div className='desc'>
                        <label className='taskname'>{tempItemEvent.taskName} <label className='duration'>({monthsOfYear[temp_start_dt[1] - 1].substr(0, 3)} {temp_start_dt[2]}, {temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3)} {temp_end_dt[2]}, {temp_end_dt[0]})</label></label>
                        <div className='type_container'>
                            <label className='type'>{tempItemEvent.plannerType.typeName}</label>
                        </div>
                        <Accordion defaultActiveKey={key}>
                            <Accordion.Collapse eventKey={tabPlanner}>
                                <React.Fragment>
                                    <div className='assignBy'>Assigned by {tempItemEvent.assignedUser.username}</div>
                                    <div className='remark'>{tempItemEvent.remark}</div>
                                    <div className='button_container'>
                                        <button className='done'>Done</button>
                                        <button className='delete'>Delete</button>
                                    </div>
                                </React.Fragment>
                            </Accordion.Collapse>
                        </Accordion>
                    </div>
                </div >);
            }

            keyTab++;
        }

        //{monthsOfYear[temp_start_dt[1] - 1].substr(0, 3)} {temp_start_dt[2]}, {temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3)} {temp_end_dt[2]}, {temp_end_dt[0]}

        if (itemPlanners.length > 0) {
            plannerEvents.push(<div className='group_container' key={item}>
                <div className='owner'>
                    <div className='owner_name'>{item}</div>
                    <div className='owner_image'><img src={env.url + '/auth/profile/image/get-by-user/' + tempEventsByUser[0].user.userID} /></div>
                </div>
                {itemPlanners}
            </div>);
        }
    }

    return (<React.Fragment>{plannerEvents}</React.Fragment>);

}
const PlannerEvents = (props) => {
    const { events, weeks, onDetailCilck, selectedPlanner } = props;
    const plannerEvents = [];
    const tempEvents = events.reduce(function (rv, x) {
        (rv[x['user']['username']] = rv[x['user']['username']] || []).push(x);
        return rv;
    }, {});

    let index = 0;

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
                eventsByUser.push(<PlannerItem key={index} selectedTab={selectedPlanner} index={index} planner={tempItemEvent} start={start} end={end} start_dt={temp_start_dt} end_dt={temp_end_dt} onPlannerClick={(index, planner) => {
                    onDetailCilck(index, planner);
                }} />);
            }

            index++;
        }

        if (eventsByUser.length > 0) {
            plannerEvents.push(<div key={item} className='group_container'>
                <div className='owner'>
                    {item}
                </div>
                {eventsByUser}
            </div>)
        }
    }
    return (<React.Fragment>{plannerEvents}</React.Fragment>)
}

const PlannerItem = (props) => {
    const { index, selectedTab, onPlannerClick, start, end, planner, start_dt, end_dt } = props;
    return (
        <div className='item_planner' style={{ marginLeft: (start * 100) + 150 + 'px', width: end * 100 + 'px', backgroundColor: selectedTab === index ? '#' + planner.plannerType.typeColor + '34' : 'transparent' }} onClick={(e) => {
            let scrollTop = document.documentElement.style.getPropertyValue('--scroll-top').replace(/[px]/g, '');
            if (scrollTop === '') {
                scrollTop = '0';
            }
            if (window.innerWidth - 20 - e.pageX < 400) {
                document.documentElement.style.setProperty('--planner-detail-left', e.pageX - 420 + 'px');
                document.documentElement.style.setProperty('--planner-detail-top', (e.pageY) + parseInt(scrollTop) - 50 + 'px');
            } else {
                document.documentElement.style.setProperty('--planner-detail-left', e.pageX + 'px');
                document.documentElement.style.setProperty('--planner-detail-top', (e.pageY) + parseInt(scrollTop) - 50 + 'px');
            }
            onPlannerClick(index, planner);
        }} onMouseOver={() => document.documentElement.style.setProperty('--hover-planner-color', '#' + planner.plannerType.typeColor + '34')}>
            <div className='line' style={{ backgroundColor: '#' + planner.plannerType.typeColor + '8e' }} />
            <div className='planner_desc_container'>
                <div className='planner_taskname'>{planner.taskName} <div className='planner_period'>({monthsOfYear[start_dt[1] - 1].substr(0, 3)} {start_dt[2]}, {start_dt[0]} - {monthsOfYear[end_dt[1] - 1].substr(0, 3)} {end_dt[2]}, {end_dt[0]})</div></div>
                <div className='second_line'>
                    <div className='planner_owner'><img src={env.url + '/auth/profile/image/get-by-user/' + planner.user.userID} /></div>
                    <label className='planner_remark'>{planner.remark}</label>
                </div>
            </div>
        </div>
    )

}
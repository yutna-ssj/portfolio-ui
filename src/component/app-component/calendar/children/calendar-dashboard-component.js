import React from 'react';
import ContentBox from '../../../share-component/content-box-component';
import arrow from '../../../../assets/arrow.svg';
import { checkLeftYear, parseDateStringToArray } from '../../../share-service/share-service';
import { http, HTTP_METHOD } from '../../../share-service/http-service';
import { env } from '../../../../env';

import assignIcon from '../../../../assets/writing.png';



const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class CalendarDashBoard extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = {
            plannerEvents: []
        };
    }

    onPreviousMonthClick = () => {
        const { calendar, getCalendar } = this.props;
        const month = calendar.month - 1 < 0 ? 11 : calendar.month - 1;
        const year = month === 11 ? calendar.year - 1 : calendar.year;
        console.log(calendar.week);
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
        const week = calendar.week - 1 < 0 ? 5 : calendar.week - 1;
        if (week === 5)
            this.onPreviousMonthClick()
        onStateChange('week', week);
    }

    onNextWeekClick = () => {
        const { calendar, onStateChange, getCalendar } = this.props;
        const week = calendar.week + 1 > 5 ? 0 : calendar.week + 1;
        if (week === 0)
            this.onNextMonthClick()
        onStateChange('week', week);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const { calendar: prevCalendar } = prevProps;
        const { calendar: nextCalendar } = this.props;
        if (prevCalendar.year !== nextCalendar.year || prevCalendar.month !== nextCalendar.month || prevCalendar.datesOfCalendar.length !== nextCalendar.datesOfCalendar.length)
            return true;
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.getPlannerEvents()
        }
    }

    getPlannerEvents = () => {
        const { calendar } = this.props;
        if (calendar.datesOfCalendar.length > 0) {
            const fromDate = [calendar.datesOfCalendar[0][0].year, calendar.datesOfCalendar[0][0].month, calendar.datesOfCalendar[0][0].date];
            const toDate = [calendar.datesOfCalendar[5][6].year, calendar.datesOfCalendar[5][6].month, calendar.datesOfCalendar[5][6].date];
            http(HTTP_METHOD.POST, env.url + '/api/calendar/planner/dashboard/get-by-user', { fromDate: fromDate, toDate: toDate }).then((res) => {
                this.setState({ plannerEvents: res });
            }).catch((err) => {

            });
        }
    }

    pointEventOnCalendar = (itemDate) => {
        const { disabled } = itemDate;
        const { plannerEvents } = this.state;

        if (disabled)
            return null;

        let isPlannerPoint = false;
        const date = new Date(itemDate.year, itemDate.month - 1, itemDate.date);

        for (let i = 0; i < plannerEvents.length; i++) {
            const plan = plannerEvents[i];

            const tempStartDate = parseDateStringToArray(plan.startDate);
            const tempEndDate = parseDateStringToArray(plan.endDate);

            const startDate = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]);
            const endDate = new Date(tempEndDate[0], tempEndDate[1] - 1, tempEndDate[2]);

            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                isPlannerPoint = true;
                break;
            }
        }

        return (
            <div className='point_container'>
                {isPlannerPoint ? <div className='planner_point' /> : null}
            </div>
        );
    }

    render() {

        const { show, calendar, today } = this.props;
        const { plannerEvents } = this.state;
        return (<React.Fragment>
            {show ? <React.Fragment>
                <div className='container'>
                    <ContentBox id='1' title='Dashboard Overview'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className="card">
                                    <div className="card-body">
                                        This is some text within a card body.
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="card">
                                    <div className="card-body">
                                        This is some text within a card body.
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="card">
                                    <div className="card-body">
                                        This is some text within a card body.
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="card">
                                    <div className="card-body">
                                        This is some text within a card body.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContentBox>
                    <ContentBox id='2' title='Your Calendar Overview'>
                        <div className='calendar_container'>
                            <div className='left'>
                                <div className='card container month_calendar_container'>
                                    <div className='top_month_calendar'>
                                        <label key={calendar.month.toString() + calendar.year.toString() + calendar.week.toString()}>{monthsOfYear[calendar.month]} {calendar.year}</label>
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

                                            if (calendar.week === iw) {
                                                itemDateBlockClassname = itemDateBlockClassname.concat(' current_week');
                                            }

                                            if (item.disabled) {
                                                itemDateClassname = itemDateClassname.concat(' disabled');
                                            }
                                            return (<div className={itemDateBlockClassname} key={iw + item.date}>
                                                <div className={itemDateClassname}><div>{item.date}</div>
                                                    {this.pointEventOnCalendar(item)}
                                                </div>
                                            </div>);
                                        }))}
                                    </div>
                                </div>
                                <div className='card today_dashboard_container container'>
                                    <label>Today, {monthsOfYear[today[1]].substr(0, 3)} {today[0]}</label>
                                    {plannerEvents.map((item, index) => {
                                        const { startDate, endDate, plannerType } = item;
                                        const temp_start_dt = parseDateStringToArray(startDate);
                                        const temp_end_dt = parseDateStringToArray(endDate);
                                        const start_dt = new Date(temp_start_dt[0], temp_start_dt[1] - 1, temp_start_dt[2]);
                                        const end_dt = new Date(temp_end_dt[0], temp_end_dt[1] - 1, temp_end_dt[2]);
                                        const date = new Date(today[2], today[1], today[0]);
                                        return date.getTime() >= start_dt.getTime() && date.getTime() <= end_dt.getTime() ?
                                            <div className='today_planner_item' key={index} >
                                                <div className='today_planner_item_left'>
                                                    <div className='tab_color' style={{ backgroundColor: '#' + plannerType.typeColor }} />
                                                </div>
                                                <div className='today_planner_item_right' style={{ backgroundColor: '#' + plannerType.typeColor + '2a' }}>
                                                    <div className='name'>{item.taskName} ({plannerType.typeName})</div>
                                                    <div className='period_time'>{monthsOfYear[temp_start_dt[1] - 1].substr(0, 3)} {temp_start_dt[2]}, {temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3)} {temp_end_dt[2]}, {temp_end_dt[0]}</div>
                                                    {/* <div className='owner'>{item.user.username}</div> */}
                                                </div>
                                            </div> : null;
                                    }
                                    )}
                                </div>
                            </div>
                            <div className='right'>
                                <div className='week_calendar_overview_container'>
                                    <div className='top_week_calendar'>
                                        <div className='button_container'>
                                            <button onClick={(e) => this.onPreviousWeekClick()}><img src={arrow} /></button>
                                            <button onClick={(e) => this.onNextWeekClick()}><img src={arrow} /></button>
                                        </div>
                                        <label className='week_desc card'>
                                            Week {calendar.week + 1}
                                        </label>
                                        <label>{monthsOfYear[calendar.month]}, {calendar.year}</label>
                                        {/* {calendar[currentWeek] ? calendar[currentWeek][0].date + '-' + calendar[currentWeek][6].date : null} */}
                                    </div>
                                    <div className='week_calendar'>
                                        <div className='header_week_calendar'>
                                            {calendar.datesOfCalendar[calendar.week] ? calendar.datesOfCalendar[calendar.week].map((item, index) => {
                                                const isToday = today[0] === item.date && today[1] === calendar.month && today[2] === calendar.year;
                                                return <div key={item.date} className={isToday ? 'today' : (item.disabled ? 'disabled' : '')}><label>{daysOfWeek[index]}</label><label>{item.date}</label></div>
                                            }
                                            ) : null}
                                        </div>
                                        <div className='body_week_calendar' key={calendar.month.toString() + calendar.year.toString() + calendar.week.toString()} >
                                            <div className='body_container'>
                                                {calendar.datesOfCalendar[calendar.week] ? calendar.datesOfCalendar[calendar.week].map((item) => {
                                                    const isToday = today[0] === item.date && today[1] === calendar.month && today[2] === calendar.year;
                                                    return <div key={item.date} className={isToday ? 'today' : (item.disabled ? 'disabled' : '')}></div>
                                                }
                                                ) : null}
                                            </div>
                                            <div className='list_planner_container'>
                                                {plannerEvents.map((item, index) =>
                                                    <EventPlanner key={index} planner={item} week={calendar.datesOfCalendar[calendar.week]} index={index} maxLength={plannerEvents.length} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='week_pin_calendar'>
                                        {calendar.datesOfCalendar[calendar.week] ? calendar.datesOfCalendar[calendar.week].map((item, index) => <WeekPinOfCalendar key={index} planners={plannerEvents} itemDate={item} index={index} today={today} />) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContentBox>
                    <div className='bottom_safety' />
                </div>
            </React.Fragment> : null
            }
        </React.Fragment>)
    }
}


const WeekPinOfCalendar = (props) => {
    const { itemDate, index, today, planners } = props;
    let className = 'date_item_container';

    if (itemDate.disabled)
        className += ' disabled';

    if (today[0] === itemDate.date && today[1] === itemDate.month - 1 && today[2] === itemDate.year)
        className += ' today';

    return (<div className={className} key={index}>
        <div className='left'>
            <div className='header_pin_date_container'>
                <label>{daysOfWeek[index]}</label>
                <label>{itemDate.date}</label>
            </div>
            <div className='line' />
        </div>
        <div className='right'>
            <div className='list_planner_container'>
                {planners.map((item, i) => {
                    const { startDate, endDate, plannerType } = item;
                    const temp_start_dt = parseDateStringToArray(startDate);
                    const temp_end_dt = parseDateStringToArray(endDate);
                    const start_dt = new Date(temp_start_dt[0], temp_start_dt[1] - 1, temp_start_dt[2]);
                    const end_dt = new Date(temp_end_dt[0], temp_end_dt[1] - 1, temp_end_dt[2]);
                    const item_date = new Date(itemDate.year, itemDate.month - 1, itemDate.date);
                    let className = 'item_planner';
                    if (i % 3 === 0) {
                        className += ' first_color';
                    } else if (i % 3 === 1) {
                        className += ' second_color';
                    } else {
                        className += ' third_color';
                    }

                    return (<React.Fragment key={i}>
                        {item_date.getTime() >= start_dt.getTime() && item_date.getTime() <= end_dt.getTime() ?
                            <div className='body_pin_date_container'>
                                <div className={className} style={{ backgroundColor: '#' + plannerType.typeColor + '34' }} >
                                    <img src={assignIcon} />
                                    {/* <div className='line' style={{ backgroundColor: '#' + plannerType.typeColor + '8e' }} /> */}
                                    <div className='planner_desc_container'>
                                        <label className='planner_taskname'>{item.taskName} <label className='planner_period'>({monthsOfYear[temp_start_dt[1] - 1].substr(0, 3)} {temp_start_dt[2]}, {temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3)} {temp_end_dt[2]}, {temp_end_dt[0]})</label></label>
                                        <label className='planner_owner'>{item.user.username}</label>
                                    </div>
                                </div>
                            </div> : null
                        }
                    </React.Fragment>);
                })}
            </div>
        </div>
    </div >);
}

const EventPlanner = (props) => {
    const { week, index } = props;
    const { taskName, user, startDate, endDate, plannerType } = props.planner;
    const width = 14.28;
    let start = -1;
    let end = 0;

    const temp_start_dt = parseDateStringToArray(startDate);
    const temp_end_dt = parseDateStringToArray(endDate);
    const start_dt = new Date(temp_start_dt[0], temp_start_dt[1] - 1, temp_start_dt[2]);
    const end_dt = new Date(temp_end_dt[0], temp_end_dt[1] - 1, temp_end_dt[2]);

    let isStartDate = false;
    let isEndDate = false;

    for (let i = 0; i < week.length; i++) {
        const item_date = new Date(week[i].year, week[i].month - 1, week[i].date);

        if (item_date.getTime() === start_dt.getTime())
            isStartDate = true;

        if (item_date.getTime() === end_dt.getTime())
            isEndDate = true;

        if (item_date.getTime() >= start_dt.getTime() && item_date.getTime() <= end_dt.getTime()) {
            if (start === -1) {
                start = i;
            }
            end++;
        }
    }
    let extraMarginLeft = 0;
    let excessWidth = 0;

    let className = 'item_planner';

    if (isStartDate) {
        extraMarginLeft += 5;
        excessWidth += 5;

        className += ' is_start';
    }

    if (isEndDate) {
        extraMarginLeft += 0;
        excessWidth += 5;
        className += ' is_end';
    }

    // if (index % 3 === 0) {
    //     className += ' first_color';
    // } else if (index % 3 === 1) {
    //     className += ' second_color';
    // } else {
    //     className += ' third_color';
    // }

    return (
        <React.Fragment>
            {end > 0 ? <div key={props} className={className} style={{ marginLeft: 'calc(' + width * start + '% + ' + extraMarginLeft + 'px)', width: 'calc(' + width * end + '% - ' + excessWidth + 'px)' }}>
                <img src={assignIcon} />
                <div className='line' style={{ backgroundColor: '#' + plannerType.typeColor + '8e' }} />
                <div className='planner_desc_container'>
                    <label className='planner_taskname'>{taskName} <label className='planner_period'>({monthsOfYear[temp_start_dt[1] - 1].substr(0, 3) + ' ' + temp_start_dt[2] + ', ' + temp_start_dt[0]} - {monthsOfYear[temp_end_dt[1] - 1].substr(0, 3) + ' ' + temp_end_dt[2] + ', ' + temp_end_dt[0]})</label> </label>
                    <label className='planner_owner'>{user.username}</label>
                </div>
            </div> : null}
        </React.Fragment>
    )
}
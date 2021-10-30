import React from 'react';
import ContentBox from '../../../share-component/content-box-component';
import arrow from '../../../../assets/arrow.svg';
import { checkLeftYear } from '../../../share-service/share-service';
import { http, HTTP_METHOD } from '../../../share-service/http-service';
import { env } from '../../../../env';

import assignIcon from '../../../../assets/writing.png';



const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class CalendarDashBoard extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = {
            planners: []
        };
    }

    componentDidMount() {

        http(HTTP_METHOD.GET, env.url + '/api/calendar/dashboard/planners/getByUser').then((res) => {
            this.setState({ planners: res });
        }).catch((err) => {
            console.log(err);
        })
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

    pointEventOnCalendar = (itemDate) => {
        const { disabled } = itemDate;
        const { planners } = this.state;

        if (disabled)
            return null;

        let isPlannerPoint = false;
        const date = new Date(itemDate.year, itemDate.month - 1, itemDate.date);

        for (let i = 0; i < planners.length; i++) {
            const plan = planners[i];
            const startDate = new Date(plan.startDate[0], plan.startDate[1] - 1, plan.startDate[2]);
            const endDate = new Date(plan.endDate[0], plan.endDate[1] - 1, plan.endDate[2]);

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
        const { planners } = this.state;
        console.log(calendar);
        return (<React.Fragment>
            {show ? <React.Fragment>
                <ContentBox id='1' title='Meetings Overview'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className="card">
                                <div className="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="card">
                                <div className="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="card">
                                <div className="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="card">
                                <div className="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentBox>
                <ContentBox id='2' title='Calendar Overview'>
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
                                    {calendar.datesOfCalendar.map((week, iw) => week.map((item) =>
                                        <div key={iw + item.date} className={iw === calendar.week ? 'current_week' : ''}>
                                            <div className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}><label>{item.date}</label>
                                                {this.pointEventOnCalendar(item)}
                                            </div>
                                        </div>))
                                    }
                                </div>
                            </div>
                            <div className='card today_dashboard_container container'>
                                <label>Today, {monthsOfYear[today[1]].substr(0, 3)} {today[0]}</label>
                                {planners.map((item, index) => {
                                    const { startDate, endDate, plannerType } = item;
                                    const start_dt = new Date(startDate[0], startDate[1] - 1, startDate[2]);
                                    const end_dt = new Date(endDate[0], endDate[1] - 1, endDate[2]);
                                    const date = new Date(today[2], today[1], today[0]);
                                    return date.getTime() >= start_dt.getTime() && date.getTime() <= end_dt.getTime() ?
                                        <div className='today_planner_item' key={index} >
                                            <div className='left'>
                                                <div className='tab_color' style={{ backgroundColor: '#' + plannerType.typeColor }} />
                                            </div>
                                            <div className='right' style={{ backgroundColor: '#' + plannerType.typeColor + '2a' }}>
                                                <div className='name'>{item.taskName} ({plannerType.typeName})</div>
                                                <div className='period_time'>{monthsOfYear[item.startDate[1] - 1].substr(0, 3)} {item.startDate[2]}, {item.startDate[0]} - {monthsOfYear[item.endDate[1] - 1].substr(0, 3)} {item.endDate[2]}, {item.endDate[0]}</div>
                                                <div className='owner'>{item.user.username}</div>
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
                                            {planners.map((item, index) =>
                                                <EventPlanner key={index} planner={item} week={calendar.datesOfCalendar[calendar.week]} index={index} maxLength={planners.length} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='week_pin_calendar'>
                                    {calendar.datesOfCalendar[calendar.week] ? calendar.datesOfCalendar[calendar.week].map((item, index) => <WeekPinOfCalendar key={index} planners={planners} itemDate={item} index={index} today={today} />) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentBox>
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
                    const start_dt = new Date(startDate[0], startDate[1] - 1, startDate[2]);
                    const end_dt = new Date(endDate[0], endDate[1] - 1, endDate[2]);
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
                                <div className={className} >
                                    <img src={assignIcon} />
                                    <div className='line' style={{ backgroundColor: '#' + plannerType.typeColor + '8e' }} />
                                    <div className='planner_desc_container'>
                                        <label className='planner_taskname'>{item.taskName} <label className='planner_period'>({monthsOfYear[startDate[1] - 1].substr(0, 3)} {startDate[2]}, {startDate[0]} - {monthsOfYear[endDate[1] - 1].substr(0, 3)} {endDate[2]}, {endDate[0]})</label></label>
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

    const start_dt = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    const end_dt = new Date(endDate[0], endDate[1] - 1, endDate[2]);

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
                    <label className='planner_taskname'>{taskName} <label className='planner_period'>({monthsOfYear[startDate[1] - 1].substr(0, 3) + ' ' + startDate[2] + ', ' + startDate[0]} - {monthsOfYear[endDate[1] - 1].substr(0, 3) + ' ' + endDate[2] + ', ' + endDate[0]})</label> </label>
                    <label className='planner_owner'>{user.username}</label>
                </div>
            </div> : null}
        </React.Fragment>
    )
}
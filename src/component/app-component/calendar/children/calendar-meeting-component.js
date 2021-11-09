import React, { useState } from "react";

import slim_arrow from '../../../../assets/slim-arrow.png';
import arrow from '../../../../assets/arrow.svg';
import bell from '../../../../assets/bell.png';
import { TypeSelectInput } from "../../../share-component/input-component";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SHOW_PEIOD_TYPE = {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH'
}

export default class CalendarMeeting extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { showPeriodType: SHOW_PEIOD_TYPE.WEEK }
    }

    render() {
        const { show, calendar, today } = this.props;
        const { showPeriodType } = this.state;
        return (<React.Fragment>
            {show ? <React.Fragment>
                <div className='app_container container'>
                    <div className='calendar_container'>
                        <div className='left'>
                            <div className='card container month_calendar_container'>
                                <div className='top_month_calendar'>
                                    <label>{monthsOfYear[calendar.month]} {calendar.year}</label>
                                    <div className='button_container'>
                                        <button onClick={(e) => { }}><img src={arrow} /></button>
                                        <button onClick={(e) => { }}><img src={arrow} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                </div>
                                <div className='body_month_calendar'>
                                    {calendar.datesOfCalendar.map((week, iw) => week.map((item) =>
                                        <div key={iw + item.date} >
                                            <div className={(today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year) ? 'today' : (item.disabled ? 'disabled' : '')}><label>{item.date}</label>
                                                {/* {this.pointEventOnCalendar(item)} */}
                                            </div>
                                        </div>))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='header_bar_container'>
                                <div className='left'><label className='lg_label'>{monthsOfYear[calendar.month]} {calendar.year}</label></div>
                                <div className='right'>
                                    <button className='planner_create_button' style={{ marginRight: '10px' }}>Create</button>
                                    {/* <div className='notification_container'>
                                        <img src={bell} />
                                    </div> */}
                                    <TypeSelectInput value={showPeriodType} onChange={(v) => this.setState({ showPeriodType: v })}>
                                        <option value={SHOW_PEIOD_TYPE.DAY}>Day</option>
                                        <option value={SHOW_PEIOD_TYPE.WEEK}>Week</option>
                                        <option value={SHOW_PEIOD_TYPE.MONTH}>Month</option>
                                    </TypeSelectInput>
                                    <div className='button_container' style={{ marginLeft: '15px' }}>
                                        <button className='tiny_button arrow_previous' onClick={(e) => { }}><img src={slim_arrow} /></button>
                                        <button className='tiny_button arrow_next' onClick={(e) => { }}><img src={slim_arrow} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
                :
                null}
        </React.Fragment>);
    }
}
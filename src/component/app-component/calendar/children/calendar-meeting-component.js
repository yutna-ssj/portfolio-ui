import React, { useState } from "react";

import slim_arrow from '../../../../assets/slim-arrow.png';
import arrow from '../../../../assets/arrow.svg';
import plus from '../../../../assets/plus.png';
import { TypeSelectInput } from "../../../share-component/input-component";
import CalendarTimeline from "./calendar-timeline-component";
import { checkLeftYear } from "../../../share-service/share-service";
import CalendarBlock from "./calendar-block-component";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SHOW_PERIOD_TYPE = {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH'
}

const initialTypeOptions = [SHOW_PERIOD_TYPE.DAY, SHOW_PERIOD_TYPE.WEEK]

export default class CalendarMeeting extends React.Component {

    constructor(_props) {
        super(_props);
        const today = new Date();

        this.state = {
            today: [today.getDate(), today.getMonth(), today.getFullYear()],
            showPeriodType: SHOW_PERIOD_TYPE.WEEK,
            typeOptions: initialTypeOptions,
            days: [],
            selectedDays: [],
            calendar: {},
            previousCalendar: {},
            nextCalendar: {},
            totalDays: 0,
            startDay: {},
            endDay: {},
            clickedDay: {}

        }
    }


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        const { showPeriodType, today } = this.state;
        let days = [];
        const calendar = this.getCalendar(today[2], today[1], -1);

        const previousCalendar = this.getCalendar(today[2], today[1], -1);

        const nextCalendar = this.getCalendar(today[2], today[1], -1);

        if (showPeriodType === SHOW_PERIOD_TYPE.WEEK) {
            days = calendar.datesOfCalendar[calendar.week];
        }

        this.setState({ calendar: calendar, days: days, selectedDays: days, totalDays: days.length });
    }


    onMouseUp = () => {
        const { selectedDays } = this.state;
        if (this.isMousedown) {
            const typeOptions = [...initialTypeOptions];
            let type = '';
            this.isMousedown = false;
            if (selectedDays.length === 1) {
                typeOptions.push(`${selectedDays.length} DAY`);
                type = `${selectedDays.length} DAY`;
            } else if (selectedDays.length <= 7) {
                typeOptions.push(`${selectedDays.length} DAYS`);
                type = `${selectedDays.length} DAYS`;
            } else if (selectedDays.length > 7) {
                typeOptions.push(`${selectedDays.length / 7} WEEKS`);
                type = `${selectedDays.length / 7} WEEKS`;
            }
            this.setState({ days: selectedDays, typeOptions: typeOptions, showPeriodType: type });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
    }



    getSnapshotBeforeUpdate(prevProp, prevState) {
        if (this.state.startDay?.checkDate !== prevState.startDay?.checkDate
            || this.state.endDay?.checkDate !== prevState.endDay?.checkDate) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProp, prevState, snapshot) {
        const { calendar } = this.state;
        if (snapshot) {

            let startDay = this.state.startDay;
            let endDay = this.state.endDay;
            const startDate = new Date(this.state.startDay.year, this.state.startDay.month - 1, this.state.startDay.date);
            const endDate = new Date(this.state.endDay.year, this.state.endDay.month - 1, this.state.endDay.date);
            if (startDate.getTime() > endDate.getTime()) {
                startDay = this.state.endDay;
                endDay = this.state.startDay;
            }

            let length = endDay.indexOfMonth - startDay.indexOfMonth + 1;
            console.log(startDay, endDay);
            if (length > 7) {
                startDay = calendar.datesOfCalendar[startDay.week][0];
                endDay = calendar.datesOfCalendar[endDay.week][6];
                length = endDay.indexOfMonth - startDay.indexOfMonth + 1;

            }

            const tempSelectedDays = [];
            let week = startDay.week;
            let indexOfWeek = startDay.index;
            for (let i = 0; i < length; i++) {
                tempSelectedDays.push(calendar.datesOfCalendar[week][indexOfWeek]);
                indexOfWeek++;
                if (indexOfWeek > 6) {
                    week++;
                    indexOfWeek = 0;
                }
            }
            this.setState({ selectedDays: tempSelectedDays, totalDays: tempSelectedDays.length });

        }
    }

    getCalendar = (year, month, week) => {
        const { today } = this.state;
        const ret = [];
        const startDateOfMonth = new Date(year, month, 1);
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (month === 0 ? 11 : month - 1) : month;
        let dateOfCalendar = monthOfCalendar === month ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);
        let yearOfCalendar = month === 0 ? year - 1 : year;
        for (let i = 0; i < 12; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                let item_date = { date: 0, month: -1, year: 0, disabled: false, week: 0, index: 0, indexOfMonth: 0 };
                item_date.date = dateOfCalendar;
                item_date.month = monthOfCalendar + 1;
                item_date.year = yearOfCalendar;
                item_date.disabled = month !== monthOfCalendar;
                item_date.week = i;
                item_date.index = j;
                item_date.indexOfMonth = (i * 7) + j;
                item_date.checkDate = `${item_date.date}-${item_date.month}-${item_date.year}`;
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


    onShowPeriodTypeChange = (type) => {
        const { calendar, selectedDays } = this.state;
        let tempDays = [];
        let startDay = null;
        let endDay = null;

        if (type === SHOW_PERIOD_TYPE.DAY) {
            const typeOptions = [...initialTypeOptions];
            tempDays.push(selectedDays[0]);
            startDay = selectedDays[0];
            endDay = selectedDays[0];
            this.setState({ showPeriodType: type, startDay: startDay, endDay: endDay, days: tempDays, typeOptions: typeOptions, totalDays: tempDays.length });
        } else if (type === SHOW_PERIOD_TYPE.WEEK) {
            const typeOptions = [...initialTypeOptions];
            startDay = selectedDays[0];
            let week = startDay.week;
            let indexOfWeek = startDay.index;
            for (let i = 0; i < 7; i++) {
                tempDays.push(calendar.datesOfCalendar[week][indexOfWeek]);
                endDay = calendar.datesOfCalendar[week][indexOfWeek];
                indexOfWeek++;
                if (indexOfWeek > 6) {
                    week++;
                    indexOfWeek = 0;
                }
            }
            this.setState({ showPeriodType: type, startDay: startDay, endDay: endDay, days: tempDays, typeOptions: typeOptions, totalDays: tempDays.length });
        }
    }



    render() {
        const { show } = this.props;
        const { showPeriodType, calendar, days, selectedDays, today, totalDays, typeOptions, clickedDay, startDay, endDay } = this.state;
        console.log(totalDays);
        let _calendar = [];
        if (calendar.datesOfCalendar?.length > 0) {
            _calendar = calendar.datesOfCalendar.slice(0, 6);
        }

        return (<React.Fragment>
            {show ? <React.Fragment>
                <div className='container'>
                    <div className='calendar_container sm'>
                        <div className='left'>
                            <div className='card' style={{ height: 'auto', padding: '10px 5px', display: 'flex', alignItems: 'center' }}>
                                Clicking or dragging is allowed.
                            </div>
                            <div className='card container month_calendar_container'>
                                <div className='top_month_calendar'>
                                    <label>{monthsOfYear[calendar.month]} {calendar.year}</label>
                                    <div className='button_container'>
                                        <button onClick={(e) => { }}><img src={arrow} alt={'arrow'} /></button>
                                        <button onClick={(e) => { }}><img src={arrow} alt={'arrow'} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                </div>
                                <div className='body_month_calendar'>
                                    {_calendar.map((week, iw) => week.map((item, id) => {
                                        const isToday = (today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year);
                                        let itemDateClassname = '_item_day';
                                        let parentClassname = '_item_day_calendar';

                                        for (let i = 0; i < selectedDays.length; i++) {
                                            if (selectedDays[i].date === item.date && selectedDays[i].month === item.month && selectedDays[i].year === item.year) {
                                                parentClassname = parentClassname.concat(' _selected');

                                                if (i === 0 || selectedDays[i].index === 0) {
                                                    parentClassname = parentClassname.concat(' _start_day');
                                                }

                                                if (i === selectedDays.length - 1 || selectedDays[i].index === 6) {
                                                    parentClassname = parentClassname.concat(' _end_day');
                                                }
                                                break;
                                            }
                                        }
                                        if (isToday) {
                                            itemDateClassname = itemDateClassname.concat(' today');
                                        }

                                        if (item.disabled) {
                                            itemDateClassname = itemDateClassname.concat(' disabled');
                                            // itemDateBlockClassname = itemDateBlockClassname.concat(' _disabled');
                                        }

                                        return (
                                            <div className={parentClassname} key={iw + item.date}
                                                onMouseDown={(e) => {
                                                    this.isMousedown = true;
                                                    if (selectedDays[0].checkDate === item.checkDate) {
                                                        this.setState({ startDay: item, endDay: item, clickedDay: item });
                                                    }
                                                    else if (totalDays > 7) {
                                                        let week = item.week;
                                                        let indexOfWeek = 0;
                                                        let startDay = calendar.datesOfCalendar[week][indexOfWeek];
                                                        let endDay = item;
                                                        for (let i = 0; i < totalDays; i++) {
                                                            endDay = calendar.datesOfCalendar[week][indexOfWeek];
                                                            indexOfWeek++;
                                                            if (indexOfWeek > 6) {
                                                                week++;
                                                                indexOfWeek = 0;
                                                            }
                                                        }
                                                        this.setState({ startDay: item, endDay: endDay, clickedDay: item });
                                                    } else {
                                                        let endDay = item;
                                                        let week = item.week;
                                                        let indexOfWeek = item.index;
                                                        for (let i = 0; i < totalDays; i++) {
                                                            endDay = calendar.datesOfCalendar[week][indexOfWeek];
                                                            indexOfWeek++;
                                                            if (indexOfWeek > 6) {
                                                                week++;
                                                                indexOfWeek = 0;
                                                            }
                                                        }
                                                        this.setState({ startDay: item, endDay: endDay, clickedDay: item });
                                                    }
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (this.isMousedown) {
                                                        // if (totalDays <= 7) {
                                                        //     this.setState({ startDay: clickedDay, endDay: item, totalDays: totalDays + 1 });
                                                        // } else {
                                                        this.setState({ startDay: clickedDay, endDay: item, totalDays: totalDays + 1 });
                                                        // }
                                                    }
                                                }}>
                                                <div className={itemDateClassname}><div>{item.date}</div>
                                                    {/* {this.pointEventOnCalendar(item)}  */}
                                                </div>
                                            </div>)

                                    }))}
                                </div>
                            </div>

                        </div>
                        <div className='right'>
                            <div className='_calendar_content'>
                                <div className='_header_bar_container'>
                                    <div className='_header_bar_left'><label className='lg_label'>{monthsOfYear[calendar?.month]} {calendar.year}</label></div>
                                    <div className='_header_bar_right'>
                                        <button className='planner_create_button' style={{ marginRight: '10px' }}><img src={plus} /> Create</button>
                                        {/* <div className='notification_container'>
                                        <img src={bell} />
                                    </div> */}
                                        <TypeSelectInput value={showPeriodType} onChange={(v) => this.onShowPeriodTypeChange(v)}>
                                            {typeOptions.map((option => <option key={option} value={option}>{option}</option>))}
                                        </TypeSelectInput>
                                        <div className='button_container' style={{ marginLeft: '15px' }}>
                                            <button className='tiny_button arrow_previous' onClick={(e) => { }}><img src={slim_arrow} /></button>
                                            <button className='tiny_button arrow_next' onClick={(e) => { }}><img src={slim_arrow} /></button>
                                        </div>
                                    </div>
                                </div>
                                {days.length <= 7 ? <CalendarTimeline days={days} today={today} /> : <CalendarBlock days={days} today={today} />}
                            </div>

                        </div>
                    </div>
                    <div className='bottom_safety' />
                </div>
            </React.Fragment>
                :
                null}
        </React.Fragment>);
    }
}
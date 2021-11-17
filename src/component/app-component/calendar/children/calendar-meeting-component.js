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

    isMouseDown = false;
    isMouseDrag = false;

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
            _calendar: {},
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

        const tempCalendar = this.getCalendar(today[2], today[1], -1);

        if (showPeriodType === SHOW_PERIOD_TYPE.WEEK) {
            days = tempCalendar.datesOfCalendar[tempCalendar.week];
        }

        const temp_start_day = tempCalendar.datesOfCalendar[tempCalendar.week][0];
        const temp_end_day = tempCalendar.datesOfCalendar[tempCalendar.week][6];

        this.setState({ startDay: temp_start_day, endDay: temp_end_day, clickedDay: temp_start_day, calendar: tempCalendar, days: days, selectedDays: days, totalDays: days.length });
    }



    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    getCalendar = (year, month, week) => {
        const { today } = this.state;
        const ret = [];
        let tempMonth = month;
        let tempYear = year;

        const startDateOfMonth = new Date(tempYear, tempMonth, 1);
        let startWeekOfCalendar = -1;
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (tempMonth === 0 ? 11 : tempMonth - 1) : tempMonth;
        let dateOfCalendar = monthOfCalendar === tempMonth ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);
        let yearOfCalendar = tempMonth === 0 ? tempYear - 1 : tempYear;


        for (let i = 0; i < 6; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                let item_date = { date: dateOfCalendar, month: monthOfCalendar + 1, year: yearOfCalendar, disabled: month !== monthOfCalendar, week: i, index: j, indexOfMonth: (i * 7) + j };
                item_date.checkDate = `${item_date.date}-${item_date.month}-${item_date.year}`;
                datesOfWeek.push(item_date);
                if ((today[0] === dateOfCalendar && today[1] === monthOfCalendar && today[2] === year) && week === -1)
                    week = i;

                if (startWeekOfCalendar === -1 && (monthOfCalendar === month && yearOfCalendar === year)) {
                    startWeekOfCalendar = i;
                }
                dateOfCalendar++;
                if (dateOfCalendar > datesOfMonth[monthOfCalendar]) {
                    monthOfCalendar = monthOfCalendar == 11 ? 0 : monthOfCalendar + 1;
                    yearOfCalendar = monthOfCalendar === 0 ? yearOfCalendar + 1 : yearOfCalendar;
                    dateOfCalendar = 1;
                }
            }
            ret.push(datesOfWeek);
        }
        return { year: year, month: month, week: week, startWeekIndex: startWeekOfCalendar, datesOfCalendar: ret };
    }

    onPreviousMonth = () => {
        const { calendar } = this.state;
        const month = calendar.month - 1 < 0 ? 11 : calendar.month - 1;
        const year = month === 11 ? calendar.year - 1 : calendar.year;
        this.setState({ calendar: this.getCalendar(year, month, calendar.week) });
    }

    onNextMonth = () => {
        const { calendar } = this.state;
        const month = calendar.month + 1 > 11 ? 0 : calendar.month + 1;
        const year = month === 0 ? calendar.year + 1 : calendar.year;
        this.setState({ calendar: this.getCalendar(year, month, calendar.week) });
    }


    getSelectedDaysOutCalendar = (start, totalDays, direction) => {
        const ret = [];
        if (direction === -1) {
            for (let i = 0; i < totalDays; i++) {
                start.date = start.date - 1;
                start.index = start.index - 1 < 0 ? 6 : start.index - 1;
                if (start.date < 1) {
                    start.month = start.month - 1 < 0 ? 11 : start.month - 1;
                    start.year = start.month === 11 ? start.year - 1 : start.year;
                    start.date = datesOfMonth[start.month];
                }
                const item = { ...start, month: start.month + 1, checkDate: `${start.date}-${start.month + 1}-${start.year}` };
                ret.push(item);
            }
            return ret.reverse();
        } else if (direction === 1) {
            for (let i = 0; i < totalDays; i++) {
                start.date = start.date + 1;
                start.index = start.index + 1 > 6 ? 0 : start.index + 1;
                if (start.date > datesOfMonth[start.month]) {
                    start.month = start.month + 1 > 11 ? 0 : start.month + 1;
                    start.year = start.month === 0 ? start.year + 1 : start.year;
                    start.date = 1;
                }
                const item = { ...start, month: start.month + 1, checkDate: `${start.date}-${start.month + 1}-${start.year}` };
                ret.push(item);
            }
            return ret;
        }

        return ret;
    }

    onPrevious = () => {
        const { calendar, selectedDays, totalDays } = this.state;

        const new_selected_days = this.getSelectedDaysOutCalendar({ year: selectedDays[0].year, month: selectedDays[0].month - 1, date: selectedDays[0].date, index: selectedDays[0].index }, totalDays, -1);

        if (new_selected_days.length > 0) {
            const temp_start_day = new_selected_days[0];
            const temp_end_day = new_selected_days[new_selected_days.length - 1];
            let temp_calendar = calendar;
            if (calendar.month !== temp_start_day.month - 1 || calendar.year !== temp_start_day.year) {
                temp_calendar = this.getCalendar(temp_start_day.year, temp_start_day.month - 1, -1);
            }

            this.setState({ calendar: temp_calendar, selectedDays: new_selected_days, totalDays: new_selected_days.length, startDay: temp_start_day, endDay: temp_end_day, days: new_selected_days });
        }
    }

    onNext = () => {
        const { calendar, selectedDays, totalDays } = this.state;

        const new_selected_days = this.getSelectedDaysOutCalendar({ year: selectedDays[selectedDays.length - 1].year, month: selectedDays[selectedDays.length - 1].month - 1, date: selectedDays[selectedDays.length - 1].date, index: selectedDays[selectedDays.length - 1].index }, totalDays, 1);

        if (new_selected_days.length > 0) {
            const temp_start_day = new_selected_days[0];
            const temp_end_day = new_selected_days[new_selected_days.length - 1];
            let temp_calendar = calendar;
            if (calendar.month !== temp_start_day.month - 1 || calendar.year !== temp_start_day.year) {
                temp_calendar = this.getCalendar(temp_start_day.year, temp_start_day.month - 1, -1);
            }

            this.setState({ calendar: temp_calendar, selectedDays: new_selected_days, totalDays: new_selected_days.length, startDay: temp_start_day, endDay: temp_end_day, days: new_selected_days, clickedDay: temp_start_day });
        }
    }

    getPreviousDayFromDay = (item) => {
        const temp_start_date = item;
        let date = temp_start_date.date - 1;
        let index = temp_start_date.index - 1 < 0 ? 6 : temp_start_date.index - 1;
        let month = temp_start_date.month - 1;
        let year = temp_start_date.year;
        if (date < 1) {
            month = month - 1 < 0 ? 11 : month - 1;
            year = month === 11 ? year - 1 : year;
            date = datesOfMonth[month];
        }

        return { year: year, month: month, date: date, index: index };
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
            this.setState({ showPeriodType: type, startDay: startDay, endDay: endDay, selectedDays: tempDays, days: tempDays, typeOptions: typeOptions, totalDays: tempDays.length });
        } else if (type === SHOW_PERIOD_TYPE.WEEK) {
            const typeOptions = [...initialTypeOptions];
            const temp_start_date = this.getPreviousDayFromDay(selectedDays[0]);
            const new_selected_days = this.getSelectedDaysOutCalendar({ year: temp_start_date.year, month: temp_start_date.month, date: temp_start_date.date, index: temp_start_date.index }, 7, 1);

            this.setState({ showPeriodType: type, startDay: new_selected_days[0], endDay: new_selected_days[new_selected_days.length - 1], days: new_selected_days, selectedDays: new_selected_days, typeOptions: typeOptions, totalDays: new_selected_days.length });
        }
    }

    getLabelSelectedDays = () => {
        const { selectedDays, totalDays } = this.state;
        let label = '';

        if (totalDays === 1) {
            label = `${selectedDays[0].date} ${monthsOfYear[selectedDays[0].month - 1]} ${selectedDays[0].year}`;
        } else if (totalDays > 1) {
            if (selectedDays[0].year === selectedDays[selectedDays.length - 1].year) {
                if (selectedDays[0].month === selectedDays[selectedDays.length - 1].month) {
                    label = `${monthsOfYear[selectedDays[0].month - 1]} ${selectedDays[0].year}`;
                } else {
                    label = `${monthsOfYear[selectedDays[0].month - 1].substr(0, 3)} - ${monthsOfYear[selectedDays[selectedDays.length - 1].month - 1].substr(0, 3)} ${selectedDays[0].year}`;
                }
            } else {
                label = `${monthsOfYear[selectedDays[0].month - 1].substr(0, 3)} ${selectedDays[0].year} - ${monthsOfYear[selectedDays[selectedDays.length - 1].month - 1].substr(0, 3)} ${selectedDays[selectedDays.length - 1].year}`;
            }
        }


        return label;
    }

    onMouseUp = () => {
        const { clickedDay, startDay, endDay, selectedDays, totalDays, calendar } = this.state;
        const temp_selected_days = [];
        if (this.isMouseDown && !this.isMouseDrag) {
            const typeOptions = [...initialTypeOptions];
            let type = '';
            this.isMouseDown = false;

            if (clickedDay.checkDate === selectedDays[0].checkDate) {
                temp_selected_days.push(clickedDay);
                typeOptions.push(`${1} DAY`);
                type = `${1} DAY`;
                this.setState({ days: temp_selected_days, selectedDays: temp_selected_days, totalDays: temp_selected_days.length, typeOptions: typeOptions, showPeriodType: type });
            } else {
                if (totalDays <= 7) {
                    const temp_start_date = this.getPreviousDayFromDay(startDay);

                    const new_selected_days = this.getSelectedDaysOutCalendar({ year: temp_start_date.year, month: temp_start_date.month, date: temp_start_date.date, index: temp_start_date.index }, totalDays, 1);
                    typeOptions.push(`${totalDays} DAYS`);
                    type = `${totalDays} DAYS`;
                    this.setState({
                        selectedDays: new_selected_days, days: new_selected_days, totalDays: new_selected_days.length, typeOptions: typeOptions, showPeriodType: type
                    });

                } else if (totalDays > 7) {
                    const start_week = startDay.week;
                    const temp_start_date = this.getPreviousDayFromDay(calendar.datesOfCalendar[start_week][0]);

                    const new_selected_days = this.getSelectedDaysOutCalendar({ year: temp_start_date.year, month: temp_start_date.month, date: temp_start_date.date, index: temp_start_date.index }, totalDays, 1);
                    typeOptions.push(`${totalDays / 7} WEEKS`);
                    type = `${totalDays / 7} WEEKS`;
                    this.setState({
                        selectedDays: new_selected_days, days: new_selected_days, totalDays: new_selected_days.length, typeOptions: typeOptions, showPeriodType: type
                    });
                }
            }

        } else if (this.isMouseDown && this.isMouseDrag) {
            const typeOptions = [...initialTypeOptions];
            let type = '';
            this.isMouseDown = false;
            this.isMouseDrag = false;
            if (totalDays <= 7) {
                const temp_start_date = this.getPreviousDayFromDay(startDay);
                const new_selected_days = this.getSelectedDaysOutCalendar({ year: temp_start_date.year, month: temp_start_date.month, date: temp_start_date.date, index: temp_start_date.index }, totalDays, 1);
                typeOptions.push(`${totalDays} DAYS`);
                type = `${totalDays} DAYS`;
                this.setState({
                    selectedDays: new_selected_days, days: new_selected_days, totalDays: new_selected_days.length, typeOptions: typeOptions, showPeriodType: type
                });

            } else if (totalDays > 7) {
                const start_week = startDay.week;
                const temp_start_date = this.getPreviousDayFromDay(calendar.datesOfCalendar[start_week][0]);
                const new_selected_days = this.getSelectedDaysOutCalendar({ year: temp_start_date.year, month: temp_start_date.month, date: temp_start_date.date, index: temp_start_date.index }, totalDays, 1);
                typeOptions.push(`${totalDays / 7} WEEKS`);
                type = `${totalDays / 7} WEEKS`;
                this.setState({
                    selectedDays: new_selected_days, days: new_selected_days, totalDays: new_selected_days.length, typeOptions: typeOptions, showPeriodType: type
                });
            }
        }
    }

    onMouseClickCalendar = (item) => {
        this.isMouseDown = true;
        this.setState({ startDay: item, clickedDay: item, endDay: item });
    }

    onMouseDragCalendar = (item) => {
        const { clickedDay, calendar, totalDays, selectedDays } = this.state;
        const tempSelectedDays = [];
        let startDay = clickedDay;
        let endDay = item;
        this.isMouseDrag = true;


        const startDate = new Date(startDay.year, startDay.month - 1, startDay.date);
        const endDate = new Date(item.year, item.month - 1, item.date);
        if (startDate.getTime() > endDate.getTime()) {
            startDay = item;
            endDay = clickedDay;
        }

        let length = endDay.indexOfMonth - startDay.indexOfMonth + 1;
        if (length > 7) {
            startDay = calendar.datesOfCalendar[startDay.week][0];
            endDay = calendar.datesOfCalendar[endDay.week][6];
            length = endDay.indexOfMonth - startDay.indexOfMonth + 1;
        }


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

        console.log(startDay,endDay);

        this.setState({ selectedDays: tempSelectedDays, totalDays: tempSelectedDays.length, endDay: endDay, startDay: startDay });
    }

    onDayClick = (item) => {
        const typeOptions = [...initialTypeOptions];
        let type = '';
        const temp_selected_days = [];
        typeOptions.push(`${1} DAY`);
        type = `${1} DAY`;
        temp_selected_days.push(item);
        this.setState({ selectedDays: temp_selected_days, days: temp_selected_days, totalDays: temp_selected_days.length, typeOptions: typeOptions, showPeriodType: type });
        this.setState({ startDay: item, clickedDay: item, endDay: item });
    }

    render() {
        const { show } = this.props;
        const { showPeriodType, calendar, days, selectedDays, today, totalDays, typeOptions, clickedDay, startDay, endDay } = this.state;

        const _datesOfCalendar = calendar.datesOfCalendar || [];

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
                                        <button onClick={(e) => { }} onClick={(e) => this.onPreviousMonth()}><img src={arrow} alt={'arrow'} /></button>
                                        <button onClick={(e) => { }} onClick={(e) => this.onNextMonth()}><img src={arrow} alt={'arrow'} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                </div>
                                <div className='body_month_calendar'>
                                    {_datesOfCalendar.map((week, iw) => week.map((item, id) => {
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
                                            // parentClassname = parentClassname.concat(' _disabled');
                                        }

                                        return (
                                            <div className={parentClassname} key={iw + item.date}
                                                onMouseDown={(e) => {
                                                    this.onMouseClickCalendar(item);
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (this.isMouseDown) {
                                                        this.onMouseDragCalendar(item);
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
                                    <div className='_header_bar_left'><label className='lg_label'>{this.getLabelSelectedDays()}</label></div>
                                    <div className='_header_bar_right'>
                                        <button className='planner_create_button' style={{ marginRight: '10px' }}><img src={plus} /> Create</button>
                                        {/* <div className='notification_container'>
                                        <img src={bell} />
                                    </div> */}
                                        <TypeSelectInput value={showPeriodType} onChange={(v) => this.onShowPeriodTypeChange(v)}>
                                            {typeOptions.map((option => <option key={option} value={option}>{option}</option>))}
                                        </TypeSelectInput>
                                        <div className='button_container' style={{ marginLeft: '15px' }}>
                                            <button className='tiny_button arrow_previous' onClick={(e) => this.onPrevious()}><img src={slim_arrow} /></button>
                                            <button className='tiny_button arrow_next' onClick={(e) => this.onNext()}><img src={slim_arrow} /></button>
                                        </div>
                                    </div>
                                </div>
                                {days.length <= 7 ? <CalendarTimeline days={days} today={today} onDayClick={(item) => this.onDayClick(item)} /> : <CalendarBlock days={days} today={today} onDayClick={(item) => this.onDayClick(item)} />}
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
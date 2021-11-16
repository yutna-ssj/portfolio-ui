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

        this.setState({ _calendar: tempCalendar, calendar: tempCalendar, days: days, selectedDays: days, totalDays: days.length });
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
        if ((this.state.startDay?.checkDate !== prevState.startDay?.checkDate
            || this.state.endDay?.checkDate !== prevState.endDay?.checkDate) && this.isMousedown) {
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

    getCalendar = (year, month, week, spec) => {
        const { today } = this.state;
        const ret = [];
        let tempMonth = month;
        let tempYear = year;
        for (let i = 0; i < 3; i++) {
            tempMonth = tempMonth - 1 < 0 ? 11 : tempMonth - 1;
            tempYear = tempMonth === 11 ? tempYear - 1 : tempYear;
        }
        // let tempMonth = (month - 1 < 0 ? 11 : month - 1);
        // let tempYear = tempMonth === 11 ? year - 1 : year;
        const startDateOfMonth = new Date(tempYear, tempMonth, 1);
        let startWeekOfCalendar = -1;
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (tempMonth === 0 ? 11 : tempMonth - 1) : tempMonth;
        let dateOfCalendar = monthOfCalendar === tempMonth ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);
        let yearOfCalendar = tempMonth === 0 ? tempYear - 1 : tempYear;

        let _spec = { week: 0, index: 0 };

        if (startDateOfMonth.getDay() === 0) {
            monthOfCalendar = (monthOfCalendar - 1 < 0 ? 11 : monthOfCalendar - 1);
            yearOfCalendar = monthOfCalendar === 11 ? yearOfCalendar - 1 : yearOfCalendar;
            let extendedDays = datesOfMonth[monthOfCalendar] - 6;
            dateOfCalendar = extendedDays;
        } else {
            let extendedDays = dateOfCalendar - 7;
            dateOfCalendar = extendedDays;
        }

        for (let i = 0; i < 30; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                let item_date = { date: dateOfCalendar, month: monthOfCalendar + 1, year: yearOfCalendar, disabled: month !== monthOfCalendar, week: i, index: j, indexOfMonth: (i * 7) + j };
                item_date.checkDate = `${item_date.date}-${item_date.month}-${item_date.year}`;
                datesOfWeek.push(item_date);
                if ((today[0] === dateOfCalendar && today[1] === monthOfCalendar && today[2] === year) && week === -1)
                    week = i;

                if (spec) {
                    if ((spec.year === yearOfCalendar && spec.month === monthOfCalendar && spec.date === dateOfCalendar)) {
                        _spec = { week: i, index: j };
                    }
                }

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
        return { year: year, month: month, week: week, startWeekIndex: startWeekOfCalendar, datesOfCalendar: ret, spec: _spec };
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


    onPrevious = () => {
        const { _calendar, selectedDays, totalDays } = this.state;

        if (totalDays > 7) {
            if (selectedDays[0].indexOfMonth - totalDays >= 0) {
                let week = selectedDays[0].week - (totalDays / 7);
                let index = 0;
                let startDay = _calendar.datesOfCalendar[week][index];
                let endDay = startDay;
                const tempSelectedDays = [];
                for (let i = 0; i < totalDays; i++) {
                    tempSelectedDays.push(_calendar.datesOfCalendar[week][index]);
                    endDay = _calendar.datesOfCalendar[week][index];
                    index++;
                    if (index > 6) {
                        week++;
                        index = 0;
                    }
                }
                this.setState({ startDay: startDay, endDay: endDay, days: tempSelectedDays, selectedDays: tempSelectedDays });
            } else {
                const month = _calendar.month - 1 < 0 ? 11 : _calendar.month - 1;
                const year = month === 11 ? _calendar.year - 1 : _calendar.year;
                let oldStartDay = selectedDays[0];
                const tempCalendar = this.getCalendar(year, month, -1, { year: oldStartDay.year, month: oldStartDay.month - 1 < 0 ? 11 : oldStartDay.month - 1, date: oldStartDay.date });
                let week = tempCalendar.datesOfCalendar[tempCalendar.spec.week][tempCalendar.spec.index].week - (totalDays / 7);
                let index = 0;
                let startDay = tempCalendar.datesOfCalendar[week][index];
                let endDay = startDay;
                const tempSelectedDays = [];
                for (let i = 0; i < totalDays; i++) {
                    tempSelectedDays.push(tempCalendar.datesOfCalendar[week][index]);
                    endDay = tempCalendar.datesOfCalendar[week][index];
                    index++;
                    if (index > 6) {
                        week++;
                        index = 0;
                    }
                }
                this.setState({ startDay: startDay, endDay: endDay, days: tempSelectedDays, selectedDays: tempSelectedDays, _calendar: tempCalendar, calendar: tempCalendar });
                console.log(startDay, endDay, week);

            }
        } else {

        }

    }

    onNext = () => {

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

    render() {
        const { show } = this.props;
        const { showPeriodType, calendar, days, selectedDays, today, totalDays, typeOptions, clickedDay, startDay, endDay } = this.state;

        // const _datesOfCalendar = calendar.datesOfCalendar?.slice(calendar.startWeekIndex, calendar.startWeekIndex + 6) || [];
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
                                                    this.isMousedown = true;
                                                    if (selectedDays[0].checkDate === item.checkDate) {
                                                        this.setState({ startDay: item, endDay: item, clickedDay: item });
                                                    }
                                                    else if (totalDays > 7) {
                                                        let week = item.week;
                                                        let indexOfWeek = 0;
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
                                                        this.setState({ startDay: clickedDay, endDay: item, totalDays: totalDays + 1 });
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
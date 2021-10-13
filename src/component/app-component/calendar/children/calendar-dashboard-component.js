import React from 'react';
import ContentBox from '../../../share-component/content-box-component';
import arrow from '../../../../assets/arrow.svg';
import { checkLeftYear } from '../../../share-component/share-service';



const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


export default class CalendarDashBoard extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = {
            currentMonthOfCalendar: new Date().getMonth(),
            currentYearOfCalendar: new Date().getFullYear(),
            currentWeek: 0,
            today: [new Date().getDate(), new Date().getMonth(), new Date().getFullYear()],
            calendar: []
        };
    }

    componentDidMount() {
        const { currentYearOfCalendar, currentMonthOfCalendar } = this.state;
        this.getCalendar(currentYearOfCalendar, currentMonthOfCalendar);
        this.setState({ currentWeek: this.thisWeek });
    }

    getCalendar = (year, month) => {
        const { today } = this.state;
        const ret = [];
        const startDateOfMonth = new Date(year, month, 1);
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (month === 0 ? 11 : month - 1) : month;
        let dateOfCalendar = monthOfCalendar === month ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);

        for (let i = 0; i < 6; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                datesOfWeek.push(dateOfCalendar);
                if (today[0] === dateOfCalendar && today[1] === monthOfCalendar && today[2] === year)
                    this.thisWeek = i;
                dateOfCalendar++;
                if (dateOfCalendar > datesOfMonth[monthOfCalendar]) {
                    monthOfCalendar = monthOfCalendar == 11 ? 0 : monthOfCalendar + 1;
                    dateOfCalendar = 1;
                }
            }
            ret.push(datesOfWeek);
        }

        this.setState({ currentYearOfCalendar: year, currentMonthOfCalendar: month, calendar: ret });
    }

    onPreviousMonthClick = () => {
        const { currentYearOfCalendar, currentMonthOfCalendar } = this.state;
        const month = currentMonthOfCalendar - 1 < 0 ? 11 : currentMonthOfCalendar - 1;
        const year = month === 11 ? currentYearOfCalendar - 1 : currentYearOfCalendar;
        this.getCalendar(year, month);
    }

    onNextMonthClick = () => {
        const { currentYearOfCalendar, currentMonthOfCalendar } = this.state;
        const month = currentMonthOfCalendar + 1 > 11 ? 0 : currentMonthOfCalendar + 1;
        const year = month === 0 ? currentYearOfCalendar + 1 : currentYearOfCalendar;
        this.getCalendar(year, month);
    }

    onPreviousWeekClick = () => {
        const { currentWeek } = this.state;
        const week = currentWeek - 1 < 0 ? 5 : currentWeek - 1;
        if (week === 5)
            this.onPreviousMonthClick()
        this.setState({ currentWeek: week });
    }

    onNextWeekClick = () => {
        const { currentWeek } = this.state;
        const week = currentWeek + 1 > 5 ? 0 : currentWeek + 1;
        if (week === 0)
            this.onNextMonthClick()
        this.setState({ currentWeek: week });
    }

    render() {
        const { show } = this.props;
        const { currentYearOfCalendar, currentMonthOfCalendar, currentWeek, calendar, today } = this.state;
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
                                    <label>{monthsOfYear[currentMonthOfCalendar]} {currentYearOfCalendar}</label>
                                    <div className='button_container'>
                                        <button onClick={(e) => this.onPreviousMonthClick()}><img src={arrow} /></button>
                                        <button onClick={(e) => this.onNextMonthClick()}><img src={arrow} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                </div>
                                <div className='body_month_calendar'>
                                    {calendar.map((week, iw) => week.map((date) =>
                                        <div key={iw + week.indexOf(date)} className={iw === currentWeek ? 'current_week' : ''}>
                                            <div className={(today[0] === date && today[1] === currentMonthOfCalendar && today[2] === currentYearOfCalendar) ? 'today' : ''}>{date}</div>
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
                                    <label className='week_desc card'>
                                        Week {currentWeek + 1}
                                    </label>
                                    <label>{monthsOfYear[currentMonthOfCalendar]} {calendar[currentWeek] ? calendar[currentWeek][0] + '-' + calendar[currentWeek][6] : null}, {currentYearOfCalendar}</label>

                                </div>
                                <div className='header_week_calendar'>
                                    {calendar[currentWeek] ? calendar[currentWeek].map((date, index) =>
                                        <div key={date} className={(today[0] === date && today[1] === currentMonthOfCalendar && today[2] === currentYearOfCalendar) ? 'today' : ''}><label>{daysOfWeek[index]}</label><label>{date}</label></div>) : null}
                                </div>
                                <div className='body_week_calendar'>
                                    {daysOfWeek.map((day) => <div key={day}></div>)}
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
import React from "react";
import ContentBox from "../../../share-component/content-box-component";
import arrow from '../../../../assets/arrow.svg';



export default class CalendarPlanner extends React.Component {

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

    render() {
        const { show } = this.props;
        return (<React.Fragment>
            {show ? <React.Fragment>
                <ContentBox id='1' title='Assignment Planner'>
                    <div className='calendar_container'>
                        <div className='left'>
                            <div className='card container month_calendar_container'>
                                <div className='top_month_calendar'>
                                    {/* <label>{monthsOfYear[currentMonthOfCalendar]} {currentYearOfCalendar}</label> */}
                                    <div className='button_container'>
                                        <button onClick={(e) => {}}><img src={arrow} /></button>
                                        <button onClick={(e) => {}}><img src={arrow} /></button>
                                    </div>
                                </div>
                                <div className='header_month_calendar'>
                                    {/* {daysOfWeek.map((day) => <div key={day}>{day}</div>)} */}
                                </div>
                                <div className='body_month_calendar'>
                                    {/* {calendar.map((week, iw) => week.map((date) =>
                                        <div key={iw + week.indexOf(date)} className={iw === currentWeek ? 'current_week' : ''}>
                                            <div className={(today[0] === date && today[1] === currentMonthOfCalendar && today[2] === currentYearOfCalendar) ? 'today' : ''}>{date}</div>
                                        </div>))} */}
                                </div>
                            </div>
                        </div>
                        <div className='right'>
                            {/* <div className='week_calendar_overview_container'>
                                <div className='top_week_calendar'>
                                    <div className='button_container'>
                                        <button onClick={(e) => {}}><img src={arrow} /></button>
                                        <button onClick={(e) => {}}><img src={arrow} /></button>
                                    </div>
                                    <label className='week_desc card'>
                                        Week {1 + 1}
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
                            </div> */}

                        </div>
                    </div>
                </ContentBox>
            </React.Fragment> : null}
        </React.Fragment>);
    }

}
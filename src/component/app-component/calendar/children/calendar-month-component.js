import React from 'react';


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default class CalendarMonth extends React.Component {

    constructor(_props) {
        super(_props);
    }

    render() {
        const { calendar, today } = this.props;
        console.log(today);
        return (
            <div className='calendar_month_container'>
                <div className='_header_container'>
                    <div className='_time_header'></div>
                    <div className='_header_week_container'>
                        {calendar.datesOfCalendar[calendar.week].map((item, index) => {
                            const isToday = today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year;
                            return (<div key={index} className={isToday ? '_header_date today' : '_header_date'}>
                                <label className='_date_label'>{item.date}</label>
                                <label className='_weekly_day'>{daysOfWeek[index].toUpperCase()}</label>
                            </div>);
                        }

                        )}
                    </div>
                </div>
                <div className='_body_container'>
                    <div className='_period_row'>
                        <div className='_time_header' ><label>9 AM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header' ><label>10 AM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header' ><label>11 AM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header' ><label>12 AM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>1 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>2 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>3 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>4 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>5 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>6 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>7 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                    <div className='_period_row'>
                        <div className='_time_header'><label>8 PM</label></div>
                        <div className='_body_week_container'>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                            <div className='_period_block'></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
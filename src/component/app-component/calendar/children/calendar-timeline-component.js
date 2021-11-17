import React from 'react';


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const START_TIME = 8;
const HOURS_NUMBER = 15;

const HEADER_MONTH_HEIGHT = 80;
const HOUR_HEIGHT = 50;

export default class CalendarTimeline extends React.Component {

    timeset = null;

    constructor(_props) {
        super(_props);
        this.state = { all_time: [], currentTime: '', currentTimeTop: 0 }
    }

    getCurrentTime = () => {
        const { all_time } = this.state;
        let time = new Date();

        if ((time.getHours()) <= all_time[all_time.length - 1] && time.getHours() >= START_TIME) {
            let top = Math.abs((time.getHours() - START_TIME)) * HOUR_HEIGHT + HEADER_MONTH_HEIGHT;

            const percent = Math.floor(((time.getMinutes() * 100) / 60));
            const extra_top = Math.floor((percent * HOUR_HEIGHT) / 100);

            top += extra_top;

            this.setState({
                currentTime: time.getHours() + ':' + time.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 }),
                currentTimeTop: top
            });
        }
        this.timeset = setTimeout(this.getCurrentTime, 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.timeset);
    }

    componentDidMount() {
        const tempAllTime = [];
        let time = START_TIME;
        for (let i = 1; i <= HOURS_NUMBER; i++) {
            time += 1;
            tempAllTime.push(time);
        }
        this.setState({ all_time: tempAllTime });
        this.getCurrentTime();
    }

    render() {
        const { days, today, onDayClick } = this.props;
        const { all_time, currentTime, currentTimeTop } = this.state;
        let width = 0;
        width = Math.floor((100 / days.length) * 100) / 100;
        return (
            <div className='calendar_timeline_container'>
                <div className='_header_container'>
                    <div className='_time_header'><label>Time</label></div>
                    <div className='_header_week_container'>
                        {days.map((item, index) => {
                            const isToday = today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year;
                            return (<div key={index} className={isToday ? '_header_date today' : '_header_date'} style={{ width: width + '%' }} onClick={(e) => onDayClick(item)}>
                                <label className='_date_label'>{item.date}</label>
                                <label className='_weekly_day'>{daysOfWeek[item.index].toUpperCase()}</label>
                            </div>);
                        })}
                    </div>
                </div>
                <div className='_body_container'>
                    {currentTimeTop >= HEADER_MONTH_HEIGHT && currentTimeTop <= (HOUR_HEIGHT * HOURS_NUMBER) + HEADER_MONTH_HEIGHT ?
                        <div className='_current_time_line' style={{ top: currentTimeTop + 'px' }}>
                            <label className='_current_time'>{currentTime}</label>
                        </div> : null}
                    {all_time.map((time, index) => {
                        time = time > 23 ? time - 24 : time;
                        return (
                            <div className='_period_row' key={index}>
                                <div className='_time_header' ><label>{time.toString().concat(':00')}</label></div>
                                <div className='_body_week_container'>
                                    {days.map((item, index) =>
                                        <div key={index} className='_period_block' style={{ width: width + '%' }}></div>
                                    )}
                                </div>
                            </div>);
                    })}
                </div>
            </div>
        );
    }
}
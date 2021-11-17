import React from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default class CalendarBlock extends React.Component {

    constructor(_props) {
        super(_props);
    }


    render() {
        const { today, days, onDayClick } = this.props;
        return (
            <div className='calendar_block_container'>
                <div className='_header_container'>
                    <div className='_header_week_container'>
                        {daysOfWeek.map((day) =>
                            <div className='_header_date' key={day}>{day.toUpperCase()}</div>)}
                    </div>
                </div>
                <div className='_body_container'>
                    {days.map((item, index) => {
                        let itemDateClassname = '_item_day';
                        const isToday = today[0] === item.date && today[1] === item.month - 1 && today[2] === item.year;
                        if (isToday) {
                            itemDateClassname = itemDateClassname.concat(' today');
                        } else if (item.disabled) {
                            itemDateClassname = itemDateClassname.concat(' disabled');
                        }
                        return (<div key={index} className='_block_date'>
                            <div className={itemDateClassname} onClick={(e) => onDayClick(item)}>{item.date}</div>
                        </div>);
                    })}
                </div>
            </div>);
    }
}

import React from 'react';
import arrow from '../../assets/arrow.svg';
import calendarIcon from '../../assets/calendar.svg'
import xIcon from '../../assets/x.png';
import { checkLeftYear } from '../share-service/share-service';
import MessageComponent, { MESSAGE_TYPE } from './message-component';

export const TextInput = (props) => {
    const { label, disabled, value, onChange, placeholder, maxLength } = props;
    return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
        <div className='input_group'>
            <label>{label}</label>
            <input disabled={disabled} maxLength={maxLength} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            <span className="underline" />
        </div>
    </div>)
}

export const TextAreaInput = (props) => {
    const { label, disabled, value, onChange, placeholder, maxLength } = props;
    return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
        <div className='input_group'>
            <label>{label}</label>
            <textarea rows={1} disabled={disabled} maxLength={maxLength} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            <span className="underline" />
        </div>
    </div>)
}

export class TypeSelectInput extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { isOpen: false };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocClick);
    }

    onMouseLeave = () => {
        this.isMouseLeaveOnDropdown = true;
    }

    onMouseEnter = () => {
        this.isMouseLeaveOnDropdown = false;
    }

    onDocClick = () => {
        const { isOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isOpen) {
            this.setState({ isOpen: false });
            this.isMouseLeaveOnDropdown = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }

    mappingOptions = () => {
        const { children } = this.props;
        const options = [];
        children.map((child) => {
            if (React.isValidElement(child)) {
                options.push(this.getOption(child));
            } else if (child.length > 0) {
                for (let i = 0; i < child.length; i++) {
                    options.push(this.getOption(child[i]));
                }
            }
        })

        return options;
    }

    getOption = (child) => {
        const { value, children, disabled } = child.props;
        const { onChange } = this.props;
        return <div key={value} value={value} className={disabled ? 'disabled' : ''} onClick={(e) => {
            if (!disabled) {
                this.setState({ isOpen: false });
                onChange(value);
            }
        }}>{children}</div>;
    }

    render() {
        const { label, value, disabled } = this.props;
        const { isOpen } = this.state;
        const options = this.mappingOptions();
        const value_label = options.find((option) => option.props.value === value) ? options.find((option) => option.props.value === value).props.children : '';
        return (
            <div className='type_select_container'>
                <div ref={this.buttonRef}>
                    <div className={isOpen ? 'select clicked' : 'select'} onClick={() => this.setState({ isOpen: !isOpen })}>
                        <div className={value ? '' : 'placeholder-custom'}>{value_label}</div>
                        <img alt='arrow' src={arrow} />
                    </div>
                    {isOpen ? <div className='option_group'>
                        {
                            options.map((option) => option)
                        }
                    </div> : null
                    }
                </div>
                {isOpen ? <span className="underline focus" /> : <span className="underline" />}
            </div>);
    }
}



export class SelectInput extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isOpen: false };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocClick);
    }

    onMouseLeave = () => {
        this.isMouseLeaveOnDropdown = true;
    }

    onMouseEnter = () => {
        this.isMouseLeaveOnDropdown = false;
    }

    onDocClick = () => {
        const { isOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isOpen) {
            this.setState({ isOpen: false });
            this.isMouseLeaveOnDropdown = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }


    mappingOptions = () => {
        const { children } = this.props;
        const options = [];
        children.map((child) => {
            if (React.isValidElement(child)) {
                options.push(this.getOption(child));
            } else if (child.length > 0) {
                for (let i = 0; i < child.length; i++) {
                    options.push(this.getOption(child[i]));
                }
            }
        })

        return options;
    }

    getOption = (child) => {
        const { value, children, disabled } = child.props;
        const { onChange } = this.props;
        return <div key={value} value={value} className={disabled ? 'disabled' : ''} onClick={(e) => {
            if (!disabled) {
                this.setState({ isOpen: false });
                onChange(value);
            }
        }}>{children}</div>;
    }

    render() {
        const { label, value, disabled } = this.props;
        const { isOpen } = this.state;
        const options = this.mappingOptions();
        const value_label = options.find((option) => option.props.value === value) ? options.find((option) => option.props.value === value).props.children : '';
        return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
            <div className='input_group'>
                <label>{label}</label>
                <div className='select_container'>
                    <div ref={this.buttonRef}>
                        <div className={isOpen ? 'select clicked' : 'select'} onClick={() => this.setState({ isOpen: !isOpen })}>
                            <div className={value ? '' : 'placeholder-custom'}>{value_label}</div>
                            <img alt='arrow' src={arrow} />
                        </div>
                        {isOpen ? <div className='option_group'>
                            {
                                options.map((option) => option)
                            }
                        </div> : null

                        }
                    </div>
                    {isOpen ? <span className="underline focus" /> : <span className="underline" />}
                </div>
            </div>
        </div >);
    }

}


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const datesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export class DurationInput extends React.Component {


    constructor(_props) {
        super(_props);
        const today = new Date();
        this.state = {
            firstCalendar: { year: today.getFullYear(), month: today.getMonth(), datesOfCalendar: [] },
            secondCalendar: { year: today.getFullYear(), month: today.getMonth(), datesOfCalendar: [] },
            tempFromDate: [],
            tempToDate: [],
            isOpen: false,
            errorMessages: []
        }
    }

    componentDidMount() {
        const { fromDateValue, toDateValue } = this.props;
        document.addEventListener('mousedown', this.onDocClick);
        this.setState({ tempFromDate: fromDateValue });
        this.setState({ tempToDate: toDateValue });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocClick);
    }

    onMouseLeave = () => {
        this.isMouseLeaveOnDropdown = true;
    }

    onMouseEnter = () => {
        this.isMouseLeaveOnDropdown = false;
    }

    onDocClick = () => {
        const { isOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isOpen) {
            this.setState({ isOpen: false });
            this.isMouseLeaveOnDropdown = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }

    onOpen = () => {
        const { fromDateValue, toDateValue } = this.props;
        this.setState({
            firstCalendar: this.getCalendar(fromDateValue[0], fromDateValue[1] - 1), secondCalendar: this.getCalendar(toDateValue[0], toDateValue[1] - 1),
            tempFromDate: fromDateValue, tempToDate: toDateValue, isOpen: true
        });
    }

    getCalendar = (year, month) => {
        const ret = [];
        const startDateOfMonth = new Date(year, month, 1);
        datesOfMonth[1] = checkLeftYear(year) ? 29 : 28;

        let monthOfCalendar = startDateOfMonth.getDay() > 0 ? (month === 0 ? 11 : month - 1) : month;
        let dateOfCalendar = monthOfCalendar === month ? 1 : datesOfMonth[monthOfCalendar] - (startDateOfMonth.getDay() - 1);
        let yearOfCalendar = month === 0 ? year - 1 : year;
        for (let i = 0; i < 6; i++) {
            const datesOfWeek = [];
            for (let j = 0; j < 7; j++) {
                let item_date = { date: 0, month: -1, year: 0, disabled: false };
                item_date.date = dateOfCalendar;
                item_date.month = monthOfCalendar + 1;
                item_date.year = yearOfCalendar;
                item_date.disabled = month !== monthOfCalendar;
                datesOfWeek.push(item_date);
                dateOfCalendar++;
                if (dateOfCalendar > datesOfMonth[monthOfCalendar]) {
                    monthOfCalendar = monthOfCalendar == 11 ? 0 : monthOfCalendar + 1;
                    yearOfCalendar = monthOfCalendar === 0 ? yearOfCalendar + 1 : yearOfCalendar;
                    dateOfCalendar = 1;
                }
            }
            ret.push(datesOfWeek);
        }
        return { year: year, month: month, datesOfCalendar: ret };
    }

    onFirstCalendarPreviousMonthClick = () => {
        const { firstCalendar } = this.state;
        const month = firstCalendar.month - 1 < 0 ? 11 : firstCalendar.month - 1;
        const year = month === 11 ? firstCalendar.year - 1 : firstCalendar.year;
        this.setState({ firstCalendar: this.getCalendar(year, month) });
    }

    onFirstCalendarNextMonthClick = () => {
        const { firstCalendar } = this.state;
        const month = firstCalendar.month + 1 > 11 ? 0 : firstCalendar.month + 1;
        const year = month === 0 ? firstCalendar.year + 1 : firstCalendar.year;
        this.setState({ firstCalendar: this.getCalendar(year, month) });
    }

    onSecondCalendarPreviousMonthClick = () => {
        const { secondCalendar } = this.state;
        const month = secondCalendar.month - 1 < 0 ? 11 : secondCalendar.month - 1;
        const year = month === 11 ? secondCalendar.year - 1 : secondCalendar.year;
        this.setState({ secondCalendar: this.getCalendar(year, month) });
    }

    onSecondCalendarNextMonthClick = () => {
        const { secondCalendar } = this.state;
        const month = secondCalendar.month + 1 > 11 ? 0 : secondCalendar.month + 1;
        const year = month === 0 ? secondCalendar.year + 1 : secondCalendar.year;
        this.setState({ secondCalendar: this.getCalendar(year, month) });
    }

    render() {
        const { label, disabled, value, onChange, placeholder, fromDateValue, toDateValue } = this.props;
        const { firstCalendar, secondCalendar, isOpen, tempFromDate, tempToDate, errorMessages } = this.state;
        return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
            <div className='input_group'>
                <label>{label}</label>
                <div className='date_container'>
                    <div ref={this.buttonRef}>
                        <div className={isOpen ? 'date_picker clicked' : 'date_picker'} onClick={() => this.onOpen()}>
                            <div>{fromDateValue[1] ? monthsOfYear[fromDateValue[1] - 1].substr(0, 3) : ''} {fromDateValue[2] ? fromDateValue[2] : ''}, {fromDateValue[0] ? fromDateValue[0] : ''} - {toDateValue[1] ? monthsOfYear[toDateValue[1] - 1].substr(0, 3) : ''} {toDateValue[2] ? toDateValue[2] : ''}, {toDateValue[0] ? toDateValue[0] : ''}</div>
                            <img src={calendarIcon} />
                        </div>
                        {isOpen ? <div className='duration_picker_container card' style={{ position: 'absolute', height: 'auto' }}>
                            <button className='collaspe_button' onClick={() => this.setState({ isOpen: false })}><img src={xIcon} /></button>
                            <div className='duration_calendar_container container'>
                                <div className='month_calendar_container'>
                                    <label>From date</label>
                                    <div className='top_month_calendar'>
                                        <label>{monthsOfYear[firstCalendar.month]} {firstCalendar.year}</label>
                                        <div className='button_container'>
                                            <button onClick={(e) => this.onFirstCalendarPreviousMonthClick()}><img src={arrow} /></button>
                                            <button onClick={(e) => this.onFirstCalendarNextMonthClick()}><img src={arrow} /></button>
                                        </div>
                                    </div>
                                    <div className='header_month_calendar'>
                                        {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                    </div>
                                    <div className='body_month_calendar'>
                                        {firstCalendar.datesOfCalendar.map((week, index) => week.map((item) =>
                                            <div key={index + week.indexOf(item)}>
                                                <div className={(tempFromDate[2] === item.date && tempFromDate[1] === item.month && tempFromDate[0] === item.year) && !item.disabled ? 'today' : (item.disabled ? 'disabled' : '')}
                                                    onClick={() => !item.disabled ? this.setState({ tempFromDate: [item.year, item.month, item.date] }) : null}>{item.date}
                                                </div>
                                            </div>))}
                                    </div>
                                </div>
                                <div className='line' />
                                <div className='month_calendar_container'>
                                    <label>To date</label>
                                    <div className='top_month_calendar'>
                                        <label>{monthsOfYear[secondCalendar.month]} {secondCalendar.year}</label>
                                        <div className='button_container'>
                                            <button onClick={(e) => this.onSecondCalendarPreviousMonthClick()}><img src={arrow} /></button>
                                            <button onClick={(e) => this.onSecondCalendarNextMonthClick()}><img src={arrow} /></button>
                                        </div>
                                    </div>
                                    <div className='header_month_calendar'>
                                        {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
                                    </div>
                                    <div className='body_month_calendar'>
                                        {secondCalendar.datesOfCalendar.map((week, index) => week.map((item) =>
                                            <div key={index + week.indexOf(item)}>
                                                <div className={(tempToDate[2] === item.date && tempToDate[1] === item.month && tempToDate[0] === item.year) && !item.disabled ? 'today' : (item.disabled ? 'disabled' : '')}
                                                    onClick={() => !item.disabled ? this.setState({ tempToDate: [item.year, item.month, item.date] }) : null}>{item.date}</div>
                                            </div>))}
                                    </div>
                                </div>
                            </div>
                            <div className='container'>
                                {errorMessages.map((item, i) => <MessageComponent type={MESSAGE_TYPE.DANGER} mainMessage={item.message} onClose={() => {
                                    errorMessages.splice(i, 1);
                                    this.setState({ errorMessages: errorMessages });
                                }} />)}
                            </div>
                            <button className='button border_bottom_radius' onClick={(e) => {
                                const date1 = new Date(tempFromDate[0], tempFromDate[1] - 1, tempFromDate[2]);
                                const date2 = new Date(tempToDate[0], tempToDate[1] - 1, tempToDate[2]);
                                if (date1.getTime() <= date2.getTime()) {
                                    onChange(tempFromDate, tempToDate);
                                    this.setState({ isOpen: false, errorMessages: [] });
                                } else {
                                    const messages = [];
                                    messages.push({ message: 'From date must be before the To date' });
                                    this.setState({ errorMessages: messages });
                                }
                            }}>OK</button>
                        </div> : null}
                    </div>
                    {isOpen ? <span className="underline focus" /> : <span className="underline" />}
                </div>
            </div>
        </div >)
    }
}
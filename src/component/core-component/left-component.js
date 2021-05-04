import React from 'react';
import './core-component.css'
import calendar from '../../assets/calendar.svg';
import shopping_cart from '../../assets/shopping-cart.svg'

import arrow from '../../assets/arrow.svg';
class LeftComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { selected: '', isCollapse: false };
    }

    render() {
        const { selected, isCollapse } = this.state;
        return (< div className={isCollapse ? 'left_component collapse' : 'left_component'} >
            <div className='app_name' >{isCollapse ? 'P' : 'Portfolio'}</div>
            <div className='group_left_nav' >
                <LeftNav name='Calendar'
                    selected={selected}
                    icon={calendar}
                    onSelect={
                        (value) => this.setState({ selected: value })} />
                <LeftNav name='Shopping'
                    selected={selected}
                    icon={shopping_cart}
                    onSelect={
                        (value) => this.setState({ selected: value })}
                />
            </div>
            <div className={isCollapse ? 'collapse_left_button collapse' : 'collapse_left_button'} onClick={(e) => this.setState({ isCollapse: !isCollapse })}><img alt='arrow' src={arrow} /></div>
        </div>);
    }
}

const LeftNav = (props) => {
    const { name, selected, onSelect, icon } = props;
    return <div className={selected === name ? 'left_nav selected' : 'left_nav'}
        onClick={
            (e) => onSelect(name)}>
        <img alt={name} src={icon} />
        <div>{name}</div>
    </div>
}


export default LeftComponent;
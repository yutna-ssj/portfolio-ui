import React from 'react';
import calendar from '../../assets/calendar.svg';
import shopping_cart from '../../assets/shopping-cart.svg'
import covid from '../../assets/virus.svg'

import arrow from '../../assets/arrow.svg';
class LeftComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isCollapse: false };

        console.log(this.state);
    }

    //_props.route ? _props.route.substring(0, 1).toUpperCase() + _props.route.substring(1) : _props.route

    onNavClicked = (value) => {
        this.props.onRouteChange(value);
    }

    render() {
        const { isCollapse } = this.state;
        const navSelected = this.props.route ? this.props.route.replaceAll(/\//g, '') : '';
        console.log(navSelected);
        return (< div className={isCollapse ? 'left_component yuttana_collapse' : 'left_component'} >
            <div className='left_app_name' >{isCollapse ? 'P' : 'Portfolio'}</div>
            <div className='group_left_nav' >
                <LeftNav name='Covid-19 Situation'
                    selected={navSelected}
                    icon={covid}
                    path='covid19'
                    onSelect={
                        (value) => this.onNavClicked(value)}
                />
                <LeftNav name='Calendar'
                    selected={navSelected}
                    icon={calendar}
                    path='calendar'
                    onSelect={
                        (value) => this.onNavClicked(value)} />
                <LeftNav name='Shopping'
                    selected={navSelected}
                    icon={shopping_cart}
                    path='shopping'
                    onSelect={
                        (value) => this.onNavClicked(value)}
                />
            </div>
            <div className={isCollapse ? 'collapse_left_button yuttana_collapse' : 'collapse_left_button'} onClick={(e) => this.setState({ isCollapse: !isCollapse })}><img alt='arrow' src={arrow} /></div>
        </div>);
    }
}

const LeftNav = (props) => {
    const { name, selected, onSelect, icon, path } = props;
    return <div className={selected === path ? 'left_nav selected' : 'left_nav'}
        onClick={
            (e) => onSelect(path)}>
        <img alt={name} src={icon} />
        <div>{name}</div>
    </div>
}


export default LeftComponent;
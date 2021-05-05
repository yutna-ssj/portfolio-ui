import React from 'react';
import calendar from '../../assets/calendar.svg';
import shopping_cart from '../../assets/shopping-cart.svg'

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
        const navSelected = this.props.route ? this.props.route.replaceAll(/\//g,'') : '';
        console.log(navSelected);
        return (< div className={isCollapse ? 'left_component collapse' : 'left_component'} >
            <div className='app_name' >{isCollapse ? 'P' : 'Portfolio'}</div>
            <div className='group_left_nav' >
                <LeftNav name='calendar'
                    selected={navSelected}
                    icon={calendar}
                    onSelect={
                        (value) => this.onNavClicked(value)} />
                <LeftNav name='shopping'
                    selected={navSelected}
                    icon={shopping_cart}
                    onSelect={
                        (value) => this.onNavClicked(value)}
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
        <div>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
    </div>
}


export default LeftComponent;
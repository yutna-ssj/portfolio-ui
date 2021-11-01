import React from 'react';
import calendar from '../../assets/calendar.svg';
import shopping_cart from '../../assets/shopping-cart.svg'
import covid from '../../assets/virus.svg'
import x from '../../assets/x.png';
class LeftComponent extends React.Component {

    //_props.route ? _props.route.substring(0, 1).toUpperCase() + _props.route.substring(1) : _props.route

    onNavClicked = (value) => {
        this.props.onRouteChange(value);
    }

    render() {
        const { isCollapse, onCollapse } = this.props;
        const navSelected = this.props.route ? this.props.route.replaceAll(/\//g, '') : '';
        return (<div className={isCollapse ? 'left_component _collapse' : 'left_component'} >
            <div className={isCollapse ? 'left_app_name _collapse' : 'left_app_name'}>
                <label>Portfolio</label>
                <label>P</label>
            </div>
            <button className='left_collaspe_button' onClick={() => onCollapse()}><img src={x} /></button>

            <div className='group_left_nav' >
                <LeftNav name='CALENDAR'
                    selected={navSelected}
                    icon={calendar}
                    path='calendar'
                    onSelect={
                        (value) => this.onNavClicked(value)} />
            </div>
        </div >);
    }
}

const LeftNav = (props) => {
    const { name, selected, onSelect, icon, path } = props;
    return <div className={selected === path ? 'left_nav selected' : 'left_nav'}
        onClick={(e) => onSelect(path)}>
        <img alt={name} src={icon} />
        <div>{name}</div>
    </div>
}

export default LeftComponent;
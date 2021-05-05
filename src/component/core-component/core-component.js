
import React from 'react';
import LeftComponent from './left-component';
import './core-component.css';
import MainComponent from './main-component';

class CoreComponent extends React.Component {

    constructor(_props) {
        super(_props);

        console.log(_props);
    }

    onRouteChanged = (route) => {
        this.props.history.push({pathname: '/' + route.toLowerCase()})
    }  

    render() {
        return (<div className='core_component'>
            <LeftComponent onRouteChange={this.onRouteChanged} route={this.props.location.pathname} />
            <MainComponent />
        </div>);
    }
}

export default CoreComponent;

import React from 'react';
import LeftComponent from './left-component';
import './core-component.css';
import MainComponent from './main-component';




class CoreComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isCollapse: true };
    }

    onRouteChanged = (route) => {
        this.props.history.push({ pathname: '/' + route.toLowerCase(), state: { isCollapse: this.state.isCollapse } });
    }


    render() {
        const { isCollapse } = this.state;
        return (<div className='core_component'>
            <LeftComponent onRouteChange={this.onRouteChanged} route={this.props.location.pathname} isCollapse={isCollapse} />
            <MainComponent onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
        </div>);
    }
}

export default CoreComponent;
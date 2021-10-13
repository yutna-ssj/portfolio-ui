
import React from 'react';
import LeftComponent from './left-component';
import MainComponent from './main-component';




class CoreComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isCollapse: false };
    }

    onRouteChanged = (route) => {
        this.props.history.push({ pathname: '/' + route.toLowerCase(), state: { isCollapse: this.state.isCollapse } });
    }

    render() {
        const { isCollapse } = this.state;
        return (<div className='core_component'>
            <LeftComponent onRouteChange={this.onRouteChanged} route={this.props.location.pathname} isCollapse={isCollapse} />
            <MainComponent onRouteChange={this.onRouteChanged} onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
        </div>);
    }
}

export default CoreComponent;

import React from 'react';
import { connect } from 'react-redux';
import LeftComponent from './left-component';
import LoadingComponent from './loading-component';
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
        const { isLoading, logged } = this.props;
        return (
            <React.Fragment>
                <LoadingComponent isLoading={isLoading} />
                <div className='core_component'>
                    <LeftComponent onRouteChange={this.onRouteChanged} route={this.props.location.pathname} isCollapse={isCollapse} onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
                    <MainComponent logged={logged} onRouteChange={this.onRouteChanged} onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
                </div>
            </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.httpState.isLoading,
        logged: state.authState.logged
    };
};


export default connect(mapStateToProps)(CoreComponent);
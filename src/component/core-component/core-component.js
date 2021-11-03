
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

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize, false);
    }

    handleWindowResize = () => {
        let vh = window.innerHeight * 0.01;
        document.getElementsByClassName('top_bar_container')[0].style.top = '0px';
        document.getElementsByClassName('left_component')[0].style.top = '0px';
        document.getElementsByClassName('left_component')[0].style.height = 'calc( ' + vh * 100 + ')';;
    }

    onRouteChanged = (route) => {
        this.props.history.push({ pathname: '/' + route.toLowerCase(), state: { isCollapse: this.state.isCollapse } });
    }

    render() {
        const { isCollapse } = this.state;
        const { isLoading, logged, logged_id } = this.props;
        return (
            <React.Fragment>
                <LoadingComponent isLoading={isLoading} />
                <div className='core_component'>
                    <LeftComponent onRouteChange={this.onRouteChanged} route={this.props.location.pathname} isCollapse={isCollapse} onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
                    <MainComponent logged={logged} logged_id={logged_id} onRouteChange={this.onRouteChanged} onCollapse={() => this.setState({ isCollapse: !isCollapse })} />
                </div>
            </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.httpState.isLoading,
        logged: state.authState.logged,
        logged_id: state.authState.logged_id
    };
};


export default connect(mapStateToProps)(CoreComponent);
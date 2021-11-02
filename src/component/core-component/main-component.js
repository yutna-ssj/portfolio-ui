import React from 'react';
import AppRouter from '../../router/app-router';
import arrow from '../../assets/arrow.svg';
import slide from '../../assets/slide.png';
import info from '../../assets/info.svg'
import { http, HTTP_METHOD } from '../share-service/http-service';
import { env } from '../../env';
import { AuthAction } from '../../redux/reducer';
import { store } from '../..';

class MainComponent extends React.Component {

    userIcon = "";

    constructor(_props) {
        super(_props);
        this.state = { isNavOpen: false }
    }

    componentDidMount() {
        const { logged_id } = this.props;
        this.userIcon = env.url + '/auth/profile/image/get-by-user/' + logged_id;
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
        const { isNavOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isNavOpen) {
            this.setState({ isNavOpen: false });
            this.isMouseLeaveOnDropdown = false;
        }
    }

    buttonRef = (ref) => {
        if (ref) {
            ref.addEventListener('mouseleave', this.onMouseLeave);
            ref.addEventListener('mouseenter', this.onMouseEnter);
        }
    }


    onLogOut = () => {
        const { onRouteChange } = this.props;
        http(HTTP_METHOD.GET, env.url + '/auth/logout').then((res) => {
            store.dispatch({ type: AuthAction.LOGOUT });
            onRouteChange('login')
        }).catch((err) => {

        });
    }

    render() {
        const { isNavOpen } = this.state;
        const { onCollapse, logged, logged_id } = this.props;
        return (<div className='main_component'>
            <div className='top_bar_container'>
                <div className='top_bar_left'>
                    <div className='top_bar_collaspe_button' onClick={(e) => onCollapse()} ><img alt='slide' src={slide} /></div>
                    <div className='main_app_name'>Portfolio</div>
                </div>
                <div className='top_bar_right'>
                    <div className='top_bar_left_button'><img alt='info' src={info} /></div>
                    <div className='top_bar_profile'>
                        <img src={this.userIcon} />
                    </div>
                    <div ref={this.buttonRef}>
                        <div className={isNavOpen ? 'top_bar_button clicked' : 'top_bar_button'} onClick={(e) => this.setState({ isNavOpen: !isNavOpen })}>
                            <div>{logged}</div>
                            <img alt='arrow' src={arrow} />
                        </div>
                        {isNavOpen ?
                            <React.Fragment>
                                <div className='top_bar_group_nav'>
                                    <div className='top_bar_profile_container'>
                                        <div className='sm_profile_badge'><img src={this.userIcon} /></div>
                                    </div>
                                    <div className='top_bar_nav'>About me</div>
                                    <div className='top_bar_nav danger' onClick={(e) => this.onLogOut()}>Log out</div>
                                </div>
                            </React.Fragment>
                            : null}
                    </div>
                </div>
            </div>
            <AppRouter />
        </div >);
    }
}

export default MainComponent;
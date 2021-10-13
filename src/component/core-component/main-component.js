import React from 'react';
import AppRouter from '../../router/app-router';
import arrow from '../../assets/arrow.svg';
import slide from '../../assets/slide.png';
import info from '../../assets/info.svg'

class MainComponent extends React.Component {
    constructor(_props) {
        super(_props);
        this.state = { isNavOpen: false }
    }

    componentDidMount() {
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

    render() {
        const { isNavOpen } = this.state;
        const { onCollapse, onRouteChange } = this.props;
        return (<div className='main_component'>
            <div className='top_bar_container'>
                <div className='top_bar_left'>
                    <div className='top_bar_collaspe_button' onClick={(e) => onCollapse()} ><img alt='slide' src={slide} /></div>
                </div>
                <div className='top_bar_right'>
                    <div className='top_bar_left_button'><img alt='info' src={info} /></div>
                    <div className='top_bar_profile'>
                        G
                    </div>
                    <div ref={this.buttonRef}>
                        <div className={isNavOpen ? 'top_bar_button clicked' : 'top_bar_button'} onClick={(e) => this.setState({ isNavOpen: !isNavOpen })}>
                            <div>Robot Sudo</div>
                            <img alt='arrow' src={arrow} />
                        </div>
                        {isNavOpen ?
                            <div className='top_bar_group_nav'>
                                <div className='top_bar_nav'>About me</div>
                                <div className='top_bar_nav' onClick={(e) => onRouteChange('login')}>Log out</div>
                            </div>
                            : null}
                    </div>
                </div>
            </div>
            <AppRouter />
        </div >);
    }
}

export default MainComponent;
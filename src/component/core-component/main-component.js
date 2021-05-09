import React from 'react';
import AppRouter from '../../router/app-router';
import arrow from '../../assets/arrow.svg';
import '../app-component/app-component.css';


class MainComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isNavOpen: false }
    }

    render() {
        const { isNavOpen } = this.state;
        return (<div className='main_component'>
            <div className='top_bar_container'>
                <div className='top_bar_profile'>
                    G
                </div>
                <div className={isNavOpen ? 'top_bar_button clicked' : 'top_bar_button'} onClick={(e) => this.setState({ isNavOpen: !isNavOpen })}>
                    <div>Guest</div>
                    <img alt='arrow' src={arrow} /> 
                </div>
                {isNavOpen ?
                    <div className='top_bar_group_nav'>
                        <div className='top_bar_nav'>About me</div>
                        <div className='top_bar_nav'>Log out</div>
                    </div>
                    : null}




            </div>
            <AppRouter />

        </div>);
    }
}


export default MainComponent;
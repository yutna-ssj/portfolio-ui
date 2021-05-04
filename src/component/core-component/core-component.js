
import React from 'react';
import LeftComponent from './left-component';
import './core-component.css';

class CoreComponent extends React.Component {


    render() {
        return (<div className='core_component'>
            <LeftComponent/>
            </div>);
    }
}

export default CoreComponent;
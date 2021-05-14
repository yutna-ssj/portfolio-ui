import React from 'react';
import './share-component.css';

export class TabButton extends React.Component {

    render() {

        const { name, selected, onChange } = this.props;
        return (<div className={selected === name ? 'tab_button selected' : 'tab_button'} onClick={(e) => onChange(name)}>{name}
            <div className='tab_button_underline'></div>
        </div>);
    }
}



export class TabButtonGroup extends React.Component {

    render() {
        return (<div className='tab_button_group'>{this.props.children}</div>);
    }
}
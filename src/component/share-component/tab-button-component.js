import React from 'react';
import menu from '../../assets/menu.svg';

export class TabButton extends React.Component {

    render() {
        const { id, tabSelected, onChange } = this.props;
        return (<div className={tabSelected === id ? 'tab_button selected' : 'tab_button'} onClick={(e) => onChange(id)}>{this.props.children}
            <div className='tab_button_underline'></div>
        </div>);
    }
}



export class TabButtonGroup extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isGroupOpen: false };
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
        const { isGroupOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isGroupOpen) {
            this.setState({ isGroupOpen: false });
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
        const { tabSelected, onChange } = this.props;
        const { isGroupOpen } = this.state;
        return (
            <React.Fragment>
                <div className='tab_button_group'>{this.props.children.map((child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { onChange: (id) => { onChange(id) }, tabSelected });
                    }
                })}</div>
                <div ref={this.buttonRef}>
                    <div className={isGroupOpen ? 'sm_tab_button_group_button clicked' : 'sm_tab_button_group_button'} onClick={() => this.setState({ isGroupOpen: !isGroupOpen })}><img src={menu} /></div>
                    {
                        isGroupOpen ? <div className='sm_tab_button_group'>
                            {this.props.children.map((child) => {
                                return <div key={child.props.id} className='sm_tab_button' onClick={(e) => { onChange(child.props.id); this.setState({ isGroupOpen: false }) }}>{child.props.children.substring(0, 1).toUpperCase() + child.props.children.substring(1).toLowerCase()}</div>;
                            })}
                        </div> : null
                    }
                </div>

            </React.Fragment >);
    }
}
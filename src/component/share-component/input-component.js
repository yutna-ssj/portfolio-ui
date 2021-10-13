
import React from 'react';
import arrow from '../../assets/arrow.svg';

export const TextInput = (props) => {
    const { label, disabled } = props;
    return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
        <div className='input_group'>
            <label>{label}</label>
            <input disabled={disabled} />
            <span className="underline" />
        </div>
    </div>)
}


export class SelectInput extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = { isOpen: false };
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
        const { isOpen } = this.state;
        if (this.isMouseLeaveOnDropdown && isOpen) {
            this.setState({ isOpen: false });
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
        const { label, value, onChange, disabled } = this.props;
        const { isOpen } = this.state;
        return (<div className={disabled ? 'input_container disabled' : 'input_container'}>
            <div className='input_group'>
                <label>{label}</label>
                <div className='select_container'>
                    <div ref={this.buttonRef}>
                        <div className={isOpen ? 'select clicked' : 'select'} onClick={() => this.setState({ isOpen: !isOpen })}>
                            <div>{this.props.children.find(child => child.props.value === value)?.props.children}</div>
                            <img alt='arrow' src={arrow} />
                        </div>
                        {isOpen ? <div className='option_group'>
                            {this.props.children.map((child, index) => {
                                const { value, children, disabled } = child.props;
                                return <div key={index} className={disabled ? 'disabled' : ''} onClick={(e) => {
                                    if (!disabled) {
                                        this.setState({ isOpen: false });
                                        onChange(value);
                                    }
                                }}>{children}</div>;
                            })}
                        </div> : null}
                    </div>
                    {isOpen ? <span className="underline focus" /> : <span className="underline" />}
                </div>
            </div>
        </div >);
    }

}
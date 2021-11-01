
import React from 'react';
import warning from '../../assets/warning.png';
import x from '../../assets/x.png';
import info from '../../assets/info.png';
import success from '../../assets/check.png';

export const MESSAGE_TYPE = {
    DANGER: 1,
    INFO: 2,
    SUCCESS: 3
}

class MessageComponent extends React.Component {


    render() {
        const { type, mainMessage, subMessage, onClose } = this.props;
        let message;
        switch (type) {
            case MESSAGE_TYPE.DANGER:
                message = <DangerMessage main={mainMessage} sub={subMessage} onClose={() => onClose()} />
                break;
            case MESSAGE_TYPE.INFO:
                message = <InfoMessage main={mainMessage} sub={subMessage} onClose={() => onClose()} />
                break;
            case MESSAGE_TYPE.SUCCESS:
                message = <SuccessMessage main={mainMessage} sub={subMessage} onClose={() => onClose()} />
                break;
        }
        return (
            <React.Fragment >
                {message}
            </React.Fragment>
        );
    }
}

export default MessageComponent;


const DangerMessage = (props) => {
    const { main, sub, onClose } = props;
    return (<div className='message_container card'>
        <img src={warning} />
        <div className='message'>
            <div className='main'>{main}</div>
            <div className='sub'>{sub}</div>
        </div>
        <button onClick={(e) => onClose()}><img src={x} /></button>
    </div>);
}

const InfoMessage = (props) => {
    const { main, sub, onClose } = props;
    return (<div className='message_container card'>
        <img src={info} />
        <div className='message'>
            <div className='main'>{main}</div>
            <div className='sub'>{sub}</div>
        </div>
        <button onClick={(e) => onClose()}><img src={x} /></button>
    </div>);
}

const SuccessMessage = (props) => {
    const { main, sub, onClose } = props;
    return (<div className='message_container card'>
        <img src={success} />
        <div className='message'>
            <div className='main'>{main}</div>
            <div className='sub'>{sub}</div>
        </div>
        <button onClick={(e) => onClose()}><img src={x} /></button>
    </div>);
}
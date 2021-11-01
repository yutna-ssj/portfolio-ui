import React, { useState } from 'react';
import { Accordion, useAccordionButton } from 'react-bootstrap';
import arrow from '../../assets/arrow.svg';

export default class ContentBox extends React.Component {

    constructor(_props) {
        super(_props);
    }

    render() {
        const { title, children, id } = this.props;
        return (<Accordion defaultActiveKey={id}>
            <div className='box-container' style={{ marginTop: '10px' }}>
                <div className='header-box'>
                    <div className='header-label'>{title}</div>
                    <CollapseToggle eventKey={id} />
                </div>
                <Accordion.Collapse eventKey={id}>
                    <div className='body-box' style={{ paddingTop: '10px' }}>
                        <div className='line' />
                        {children}
                    </div>
                </Accordion.Collapse>
            </div>
        </Accordion>);
    }
}

const CollapseToggle = ({ eventKey }) => {
    const [collapse, setCollapse] = useState(false);
    const decoratedOnClick = useAccordionButton(eventKey, () => {
        setCollapse(!collapse);
    });

    return (
        <button className={collapse ? 'box-button' : 'box-button _collapse'} onClick={decoratedOnClick} >
            <img alt='box_colllapse' src={arrow} />
        </button>
    );
}

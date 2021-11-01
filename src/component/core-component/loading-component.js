import React from 'react';


export default class LoadingComponent extends React.Component {

    render() {
        const { isLoading } = this.props;
        return (
            <React.Fragment>
                {isLoading ? <div className='loading_container'>
                    <div className='loading'>
                        <div className="spinner-grow blue" role="status">
                        </div>
                        <div className="spinner-grow blue" role="status">
                        </div>
                        <div className="spinner-grow blue" role="status">
                        </div>
                    </div>
                </div> : null}
            </React.Fragment>
        );
    }
}
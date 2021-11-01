import React from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { env } from '../../env';
import { AuthAction } from '../../redux/reducer';
import { SelectInput, TextInput } from '../share-component/input-component';
import MessageComponent, { MESSAGE_TYPE } from '../share-component/message-component';
import { http, HTTP_METHOD } from '../share-service/http-service';
import LoadingComponent from './loading-component';

import profile from '../../assets/Sprite-0003.svg';

class Login extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { userID: '', userOptions: [], messages: [] };
    }

    componentDidMount() {
        http(HTTP_METHOD.GET, env.url + '/auth/profile/get-all').then((res) => {
            this.setState({ userOptions: res });
        }).catch((err) => {
            console.log(err);
        })
    }

    onLogIn = () => {
        const { userOptions, userID } = this.state;
        if (this.validateLogIn()) {
            http(HTTP_METHOD.POST, env.url + '/auth/login', { userID: this.state.userID }).then((res) => {
                store.dispatch({ type: AuthAction.LOGIN_SUCCESS, payload: { user_id: userOptions.find((user) => user.userID === parseInt(userID)).username } });
                this.props.history.push('/calendar')
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    validateLogIn = () => {
        const { userID } = this.state;
        let isValid = true;
        const messages = [];
        if (!userID) {
            isValid = false;
            messages.push({ type: MESSAGE_TYPE.DANGER, mainMessage: 'Profile is required !', subMessage: 'Please choose a profile.' });
        }

        this.setState({ messages: messages });

        return isValid;
    }

    render() {
        const { userID, userOptions, messages } = this.state;
        const { isLoading } = this.props;
        return (
            <React.Fragment>
                <LoadingComponent isLoading={isLoading} />
                <div className='login_bg_container'>
                    <div className='container center'>
                        <div className='card login_container'>
                            <label className='logo'>Yuttana's Portfolio</label>
                            <div className='profile_badge' style={{ overflow: 'hidden' }}>{userID ? <img src={env.url + '/auth/profile/image/get-by-user/' + userID} style={{ height: '150px', width: '150px' }} /> : null} </div>
                            <label className='profile_name'>{userID ? 'You will log in as ' + userOptions.find((user) => user.userID === parseInt(userID)).username + ' !' : 'Please select a profile !'}</label>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-sm-12'>
                                        <SelectInput label='Profile' value={userID} onChange={(e) => this.setState({ userID: e })}>
                                            <option value='' disabled>Select your profile</option>
                                            {userOptions.map((option, index) => <option key={index} value={option.userID.toString()}>{option.username + " - " + option.type}</option>)}
                                        </SelectInput>
                                    </div>
                                    <div className='col-sm-12'>
                                        {messages.map((item, index) => <MessageComponent type={item.type} mainMessage={item.mainMessage} subMessage={item.subMessage} onClose={() => {
                                            messages.splice(index, 1);
                                            this.setState({ messages: messages });
                                        }} />)}
                                    </div>
                                    <button className='button border_bottom_radius' onClick={(e) => this.onLogIn()}>LOG IN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.httpState.isLoading,
        logged: state.authState.logged
    };
};

export default connect(mapStateToProps)(Login);

import React from 'react';
import { SelectInput, TextInput } from '../share-component/input-component';


export default class Login extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { value: '' };
    }

    render() {
        const { value } = this.state;
        return (<div className='login_bg_container'>
            <div className='container center'>
                <div className='card login_container'>
                    <label className='logo'>Yuttana's Portfolio</label>
                    <div className='profile_badge'></div>
                    <label className='profile_name'>{value ? 'You will log in as ' + value + ' !' : 'Please choose a profile !'}</label>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <SelectInput label='Profile' value={value} onChange={(e) => this.setState({ value: e })}>
                                    <option value='' disabled>Choose your profile</option>
                                    <option value='1'>Steeve</option>
                                    <option value='2'>Alex</option>
                                    <option value='3'>Rose</option>
                                    <option value='4'>Bing</option>
                                </SelectInput>
                            </div>
                            <button className='button border_bottom_radius' onClick={(e) => this.props.history.push('/calendar')}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
import React from 'react'
import http, { HttpMethod } from '../../service/http-service';
import '../app-component/covid-component.css'

import { numberFormatter } from '../../service/formatter-service';

import virus from '../../assets/virus.svg';
import black_ribbon from '../../assets/black-ribbon.svg';
import health from '../../assets/health.svg';
import recovered from '../../assets/recovered.svg';


const initialState = {
    Confirmed: 0,
    Deaths: 0,
    Hospitalized: 0,
    NewConfirmed: 0,
    NewDeaths: 0,
    NewHospitalized: 0,
    NewRecovered: 0,
    Recovered: 0,
    UpdateDate: ''
}

class CovidComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.state = initialState;
    }

    componentDidMount() {
        this.getTodayCovidReport();
    }

    getTodayCovidReport() {
        http(HttpMethod.GET, 'https://covid19.th-stat.com/api/open/today').then((res) => {
            this.setState({ ...res });
        }).catch((err) => {

        });
    }

    render() {
        const { NewConfirmed, Confirmed, Hospitalized, NewRecovered, Recovered, NewDeaths, Deaths, UpdateDate } = this.state;
        console.log(NewDeaths)
        return (<div className='app_container'>
            <div className='app_name'>Covid-19 Situation</div>
            <div className='content_container'>
                <div className='covid_container'>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='covid_header'>Thailand {UpdateDate}</div>
                            <div className='covid_report_container'>
                                <div className='covid_block'>
                                    <div>NEW CASES</div>
                                    <div> +{numberFormatter(NewConfirmed)}</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='virus' src={virus} />
                                    <div className='tomato'>{numberFormatter(Confirmed)}</div>
                                    <div>TOTAL CASES</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='health' src={health} />
                                    <div className='blue'>{numberFormatter(Hospitalized)}</div>
                                    <div>RECEIVING MEDICAL TREATMENTS</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='recovered_by_Icongeek26' src={recovered} />
                                    <div className='green'>{numberFormatter(Recovered)} <div className='green'>[+{numberFormatter(NewRecovered)}]</div></div>
                                    <div>RECOVERED</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='black_ribbon' src={black_ribbon} />
                                    <div>{numberFormatter(Deaths)} <div>[+{numberFormatter(NewDeaths)}]</div> </div>
                                    <div>DEATHS</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='covid_graph_container'></div>
                        </div></div>
                </div>
            </div>
        </div>);
    }
}

export default CovidComponent;
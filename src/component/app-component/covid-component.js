import React from 'react'
import http, { HttpMethod } from '../../service/http-service';
import '../app-component/covid-component.css'

import { numberFormatter } from '../../service/formatter-service';

import virus from '../../assets/virus.svg';
import black_ribbon from '../../assets/black-ribbon.svg';
import health from '../../assets/health.svg';
import recovered from '../../assets/recovered.svg';
import GraphComponent from '../share-component/graph-component';


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

const testData = [{
    Confirmed: 43742,
    Date: "04/19/2021",
    Deaths: 104,
    Hospitalized: 14851,
    NewConfirmed: 1390,
    NewDeaths: 3,
    NewHospitalized: 1283,
    NewRecovered: 104,
    Recovered: 28787,
},
{
    Confirmed: 45185,
    Date: "04/20/2021",
    Deaths: 108,
    Hospitalized: 16119,
    NewConfirmed: 1443,
    NewDeaths: 4,
    NewHospitalized: 1268,
    NewRecovered: 171,
    Recovered: 28958,
},
{
    Confirmed: 46643,
    Date: "04/21/2021",
    Deaths: 110,
    Hospitalized: 17162,
    NewConfirmed: 1458,
    NewDeaths: 2,
    NewHospitalized: 1043,
    NewRecovered: 413,
    Recovered: 29371,
},
{
    Confirmed: 48113,
    Date: "04/22/2021",
    Deaths: 117,
    Hospitalized: 18148,
    NewConfirmed: 1470,
    NewDeaths: 7,
    NewHospitalized: 986,
    NewRecovered: 477,
    Recovered: 29848,
},
{
    Confirmed: 50183,
    Date: "04/23/2021",
    Deaths: 121,
    Hospitalized: 19873,
    NewConfirmed: 2070,
    NewDeaths: 4,
    NewHospitalized: 1725,
    NewRecovered: 341,
    Recovered: 30189,
}
]

class CovidComponent extends React.Component {



    constructor(_props) {
        super(_props);
        this.state = initialState;
    }

    componentDidMount() {
        this.getTodayCovidReport();
        this.getTimelineCovidReport();
    }

    getTodayCovidReport() {
        http(HttpMethod.GET, 'https://covid19.th-stat.com/api/open/today').then((res) => {
            this.setState({ ...res });
        }).catch((err) => {

        });
    }

    getTimelineCovidReport() {
        http(HttpMethod.GET, 'https://covid19.th-stat.com/api/open/timeline').then((res) => {
            console.log(res.Data.length / 20);
        }).catch((err) => {

        });

    }

    test(r) {
        if (r) {
            var ctx = r.getContext("2d");
            let scale = 2;
            console.log(r.offsetWidth);
            r.height = r.offsetHeight * scale;
            r.width = r.offsetWidth * scale;
            ctx.beginPath();
            ctx.rect(20 * scale, 20 * scale, 150 * scale, 100 * scale);
            ctx.stroke();
            ctx.closePath();

        }
    }

    render() {
        const { NewConfirmed, Confirmed, Hospitalized, NewRecovered, Recovered, NewDeaths, Deaths, UpdateDate } = this.state;
        return (<div className='app_container'>
            <div className='app_name'>Covid-19 Situation</div>
            <div className='content_container'>
                <div className='covid_container'>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='covid_update_desc'><label><b>Thailand</b>, {UpdateDate}</label></div>
                            <div className='covid_report_container'>
                                <div className='covid_block'>
                                    <div>NEW CASES</div>
                                    <div> +{numberFormatter(NewConfirmed)}</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='virus' src={virus} />
                                    <div>{numberFormatter(Confirmed)}</div>
                                    <div>TOTAL CASES</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='health' src={health} />
                                    <div>{numberFormatter(Hospitalized)}</div>
                                    <div>RECEIVING MEDICAL TREATMENTS</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='recovered_by_Icongeek26' src={recovered} />
                                    <div>{numberFormatter(Recovered)} <div>[+{numberFormatter(NewRecovered)}]</div></div>
                                    <div>RECOVERED</div>
                                </div>
                                <div className='covid_block'>
                                    <img alt='black_ribbon' src={black_ribbon} />
                                    <div>{numberFormatter(Deaths)} <div>[+{numberFormatter(NewDeaths)}]</div> </div>
                                    <div>DEATHS</div>
                                </div>
                            </div>
                            <div className='covid_update_desc'><label><b>Informations by</b>, https://covid19.ddc.moph.go.th/th/api</label></div>
                        </div>
                        <div className='col-sm-6'>
                            <GraphComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default CovidComponent;
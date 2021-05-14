import React, { createRef } from 'react'
import http, { HttpMethod } from '../../service/http-service';
import '../app-component/covid-component.css'

import { numberFormatter } from '../../service/formatter-service';

import virus from '../../assets/virus.svg';
import black_ribbon from '../../assets/black-ribbon.svg';
import health from '../../assets/health.svg';
import recovered from '../../assets/recovered.svg';
import GraphComponent from '../share-component/graph-component';

import { Line } from 'react-chartjs-2';
import { TabButton, TabButtonGroup } from '../share-component/tab-button-component';

const initialState = {
    Confirmed: 0,
    Deaths: 0,
    Hospitalized: 0,
    NewConfirmed: 0,
    NewDeaths: 0,
    NewHospitalized: 0,
    NewRecovered: 0,
    Recovered: 0,
    UpdateDate: '',
    dataSet: [],
    tabSelected: '',
    graphData: {},
}

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
            this.setState({
                dataSet: res.Data
            });
            this.changeGraphData("New Cases");
        }).catch((err) => {

        });

    }

    changeGraphData = (selected) => {
        const { dataSet } = this.state;
        const color = this.getColor(selected);
        const name = this.getProperty(selected);
        this.setState({
            graphData: {
                labels: dataSet.map((item) => {
                    return item.Date;
                }),
                datasets: [{
                    label: selected,
                    borderColor: color,
                    backgroundColor: color,
                    data: dataSet.map((item) => {
                        return item[name];
                    })
                }],
            }, tabSelected: selected
        })
    }


    getColor = (selected) => {
        switch (selected) {
            case "New Cases":
                return "tomato"
            case "New Recovered":
                return "green"
            case "New Deaths":
                return "gray"
            default: return "tomato"
        }
    }

    getProperty = (selected) => {
        switch (selected) {
            case "New Cases":
                return "NewConfirmed"
            case "New Recovered":
                return "NewRecovered"
            case "New Deaths":
                return "NewDeaths"
            default: return "Confirmed"
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.tabSelected !== this.state.tabSelected || nextState.Confirmed !== this.state.Confirmed
            || nextState.dataSet.length !== this.state.dataSet.length) {
            return true;
        } else {
            return false;
        }
    }

    // getSnapshotBeforeUpdate(PrevProps, PrevState) {
    //     if (PrevState.tabSelected !== this.state.tabSelected) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // componentDidUpdate(snapshot) {
    //     if (snapshot) {

    //     }
    // }


    render() {
        const { NewConfirmed, Confirmed, Hospitalized, NewRecovered, Recovered, NewDeaths, Deaths, UpdateDate, dataSet, tabSelected, graphData } = this.state;
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
                                    <div>{numberFormatter(Hospitalized)} </div>
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

                            <TabButtonGroup>
                                <TabButton name={'New Cases'} selected={tabSelected} onChange={(name) => this.changeGraphData(name)} />
                                <TabButton name={'New Recovered'} selected={tabSelected} onChange={(name) => this.changeGraphData(name)} />
                                <TabButton name={'New Deaths'} selected={tabSelected} onChange={(name) => this.changeGraphData(name)} />
                                <TabButton name={'Total Cases'} selected={tabSelected} onChange={(name) => this.changeGraphData(name)} />
                            </TabButtonGroup>

                            <Line data={graphData} height={240} />
                            {/* <GraphComponent dataSet={dataSet} height={240} color={'red'} labels={[]} data={[]} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default CovidComponent;
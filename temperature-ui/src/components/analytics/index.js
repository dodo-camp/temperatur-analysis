import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {compose} from "recompose";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Select from 'react-select';
import moment from 'moment';
import {getAnalytics} from '../../services/index';
import Chart from './chart';
import {heading} from '../../styles/index';
import SocketContext from "../socket-context";


class Index extends Component {
    state = {
        chartData: [],
        actualData: [],
        dateFrom: 3,
        timeDuration: [
            {
                value: 3,
                label: "Last 3 years"
            }
        ],
        defaultFromDate: {
            value: 3,
            label: "Last 3 Year"
        },
        currentFromDate: {},
        loading: true
    };

    componentDidMount() {
        this.props.socket.removeListener('analysis', () => {
            console.log("removed")
        });
        this.initialize();
    }

    setChartData = (res, io) => {
        let {chartData} = this.state;
        this.setState({chartData: chartData.concat(this.normaliseData(res))});
    };

    initialize = () => {
        let {dateFrom} = this.state;
        this.getData(dateFrom);
    };

    getData = (dateFrom) => {
        getAnalytics(dateFrom).then(doc => {
            let {data} = doc;
            if (data.success) {
                this.props.socket.on(`analysis`, (res) => {
                    this.setChartData(res);
                });
            }
        }).catch(e => {
            console.log(e);
        });
    };

    getDataByDate = (e) => {
        if (e) {
            this.props.socket.removeListener('analysis', () => {
                console.log("removed")
            });
            this.setState({dateFrom: e.value, currentFromDate: e, chartData: []}, () => {
                let {dateFrom} = this.state;
                this.getData(dateFrom);
            });
        } else this.setState({currentFromDate: {}});
    };

    normaliseData = (data) => {
        let chartData = data.map(doc => {
            return {
                "ts": moment(doc.ts).format("MMM YYYY"),
                "val": doc.val
            }
        });
        return chartData;
    };

    render() {
        let {
            timeDuration,
            chartData,
            defaultFromDate,
            currentFromDate
        } = this.state;
        let {classes} = this.props;
        return (<Grid container spacing={8}
                      style={
                          {width: '95%', margin: '1em auto'}}>
                <Grid item xs={12}
                      md={6}
                      sm={6}
                      lg={3}>
                    <Select value={Object.keys(currentFromDate).length ? currentFromDate : defaultFromDate}
                            style={
                                {width: '100%'}
                            }
                            onChange={this.getDataByDate}
                            placeholder="select time duration"
                            theme={
                                (theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary: '#031B4D',
                                    },
                                })
                            }
                            options={timeDuration}/> </Grid>
                <Grid item xs={12}
                      style={{marginTop: '1em'}}>
                    <Card className={classes.wrap}>
                        <CardHeader title="Last 3 years analysis"/>
                        <CardContent className={classes.content}> {
                            chartData.length ? <Chart data={chartData}
                                                      name={"val"}/> :
                                <p className={classes.title}> No Result Found </p>} </CardContent>
                    </Card>
                </Grid>

            </Grid>
        );
    }
}

const ComponentWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Index {...props} socket={socket}/>}
    </SocketContext.Consumer>
);

export default withRouter(compose(withStyles(heading))(ComponentWithSocket));
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import { Base64 } from 'js-base64';
import {
    Card,
    CardContent,
    withStyles,
    Fab
} from "@material-ui/core";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Add } from "@material-ui/icons";
import "./Dashboard.css";
import store from "../../store/store";
import { LOGIN_ERROR } from "../../actions/types";
import Power from "./Power";
import BatteryContent from "./BatteryContent";
import UpComingEvents from "./UpComingEvents";
import AddEvent from "../dialog/AddEvent"
import Can from "../common/Can"


const customStyles = {
    control: (base, state) => {
        return {
            ...base,
            "&:hover": {
                borderColor: state.isFocused ? "#00008b" : base.borderColor
            }
        }
    }
};


class Dashboard extends Component {
    state = {
        events: [],
        chartData: {},
        locations: [],
        loading: true,
        openAddEvent: false,
        location: null,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        validationText: ""
    };


    componentDidMount() {
        const { username, userpassword: password } = this.props.auth;
        window.addEventListener("resize", this.onResizeWindow);

        fetch(
            "https://vppspark.shinehub.com.au:8443/backend-service/dashboard/data/",
            {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                    "Content-Type": "application/json"
                },
            }
        )
            .then(chartData => chartData.json())
            .then(chartData => {

                return fetch(
                    "https://vppspark.shinehub.com.au:8443/backend-service/group/",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                            "Content-Type": "application/json"
                        },
                    }
                )
                    .then(res => res.json())
                    .then(locations => {
                        fetch(
                            "https://vppspark.shinehub.com.au:8443/backend-service/event/upcoming/",
                            {
                                method: "GET",
                                headers: {
                                    "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                                    "Content-Type": "application/json"
                                },
                            }
                        )
                            .then(res => res.json())
                            .then(events => {

                                if (events.r === -2 || chartData.success != 1) {
                                    return this.props.history.push('/login');
                                }
                                this.setState({
                                    loading: false,
                                    locations: locations.data,
                                    events: events.data || [],
                                    chartData: chartData.data || {}
                                });
                            });
                    });
            });
    }

    onResizeWindow = () => {
        console.log("width", window.innerWidth);
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
        console.log("height", window.innerHeight);
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeWindow);
    }

    onClickSave = (eventData = [null]) => {
        const { username, userpassword: password } = this.props.auth;
        const [power, location, date, from, to] = eventData;

        if (eventData.includes(null)) {
            return this.setState({ validationText: "Please enter all details" });
        }

        fetch(
            "https://vppspark.shinehub.com.au:8443/backend-service/event/group/",
            {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    groupId: location.id,
                    starttime: moment(from, "HH:mm:ss").format("HH:mm"),
                    endtime: moment(to, "HH:mm:ss").format("HH:mm"),
                    date: moment(date).format("YYYY-MM-DD"),
                    power: power * 1000,
                    eventStatus: 0
                })

            }
        )
            .then(res => res.text())
            .then(res => {

                if (JSON.parse(res).success !== 1) {
                    return store.dispatch({
                        type: LOGIN_ERROR,
                        payload: {
                            value:
                                "Cannot add this event. Please check your details and try again!"
                        }
                    });
                }
                Promise.all([
                    fetch(
                        "https://vppspark.shinehub.com.au:8443/backend-service/event/group/upcoming/" + location.id,
                        {
                            method: "GET",
                            headers: {
                                "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                                "Content-Type": "application/json"
                            },
                        }
                    ),
                    fetch(
                        "https://vppspark.shinehub.com.au:8443/backend-service/group/",
                        {
                            method: "GET",
                            headers: {
                                "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                                "Content-Type": "application/json"
                            },
                        }
                    )
                ])
                    .then(res => res.map(value => value.json()))
                    .then(res => {
                        Promise.all([res[0], res[1]]).then(res => {
                            return this.setState({
                                loading: false,
                                openAddEvent: false,
                                showEvents: res[0].data,
                                events: res[0].data,
                                locations: res[1].data
                            });
                        });
                    });
            });
    };

    onChangeLocation = (e) => {
        const { username, userpassword: password } = this.props.auth;
        this.setState({ location: e, loading: true }, () => {
            console.log("e.id", e.id);
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/event/group/upcoming/" + e.id,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                        "Content-Type": "application/json"
                    },
                }
            )
                .then(res => res.json())
                .then(events => {
                    fetch(
                        "https://vppspark.shinehub.com.au:8443/backend-service/dashboard/data/group/" + e.id,
                        {
                            method: "GET",
                            headers: {
                                "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                                "Content-Type": "application/json"
                            },
                        }
                    )
                        .then(res => res.json())
                        .then(chartData => {
                            // chartData={"data":{"SystemNumber":1,"NetToGrid":[3095.0,536.0,647.0,2683.0,6835.0,1816.0,4555.0,3037.0,2082.0,2534.0,4847.0,583.0,526.0,1128.0,528.0,1245.0,1437.0,688.0,514.0,1129.0,1289.0,520.0,1124.0,1029.0,565.0,1116.0,1087.0,1127.0,619.0,1216.0,1264.0,1257.0,506.0,1114.0,1279.0,586.0,1162.0,4549.0,514.0,1232.0,1289.0,630.0,691.0,1167.0,501.0,1125.0,1313.0,530.0,1117.0,567.0,1172.0,1274.0,619.0,1214.0,1300.0,1214.0,1196.0,572.0,1109.0,515.0,1135.0,1109.0,583.0,1201.0,575.0,627.0,1270.0,1238.0,625.0,570.0,1204.0,1339.0,507.0,502.0,507.0,1117.0,563.0,568.0,1378.0,630.0,624.0,511.0,577.0,593.0,1337.0,526.0,536.0,527.0,577.0,559.0,1291.0,619.0,1128.0,595.0,485.0,530.0,492.0,3410.0,2640.0,2655.0,2687.0,2707.0,5387.0,3086.0,2995.0,5405.0,3621.0,8672.0,3469.0,5087.0,4570.0,4721.0,4445.0,4447.0,3600.0,3978.0,5148.0,3736.0,3566.0,3731.0,7455.0,7540.0,3637.0,3757.0,5000.0,3838.0,3264.0,4180.0,2806.0,4236.0,5172.0,4842.0,7206.0,8372.0,4786.0,4728.0,4451.0,4314.0,4284.0,4000.0,4351.0,3780.0,7847.0,7830.0,4268.0,4274.0,6482.0,4182.0,4517.0,3685.0,4203.0,2704.0,7953.0,5837.0,1266.0,1415.0,2261.0,2412.0,2703.0,2206.0,3882.0,2924.0,4332.0,5579.0,5548.0,3814.0,3681.0,4618.0,3505.0,3185.0,3846.0,1071.0,-38.0,-106.0,485.0,695.0,2220.0,2.0,2242.0,3006.0,3778.0,3239.0,4595.0,5821.0,5002.0,7764.0,5085.0,5015.0,4288.0,3938.0,3809.0,8665.0,2586.0,2255.0,3598.0,4299.0,3901.0,4604.0,4213.0,4182.0,4486.0,4343.0,3947.0,3874.0,3764.0,3830.0,7658.0,6396.0,2473.0,2524.0,2580.0,2592.0,2420.0,258.0,293.0,190.0,248.0,214.0,229.0,328.0,456.0,456.0,409.0,298.0,298.0,295.0,358.0,321.0,266.0,261.0,263.0,252.0,263.0,429.0,432.0,369.0,266.0,261.0,263.0,255.0,319.0,321.0,263.0,255.0,263.0,385.0,432.0,376.0,265.0,261.0,263.0,255.0,319.0,318.0,4198.0,266.0,263.0,266.0,372.0,431.0,427.0,263.0,260.0,263.0,258.0,261.0,324.0,313.0,260.0],"AvailablePower":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1190.8500000000004,1704.5,0.0,0.0,0.0,830.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Time":["00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"],"CurrentAvailablePower":0.0},"success":1}

                            this.setState({
                                events: events.data || [],
                                chartData: chartData.data || {},
                                loading: false
                            });
                        });
                });
        });
    };

    render() {
        const { classes, auth: { user, error } } = this.props;
        const {
            events,
            chartData,
            locations,
            loading,
            location,
            openAddEvent,
            validationText
        } = this.state;

        const addEventProps = {
            openAddEvent,
            locations,
            validationText,
            error,
            onClickSave: ((...eventData) => this.onClickSave(eventData)),
            customStyles,
            classes,
            closeAddEvent: (() => this.setState({ openAddEvent: false }))
        }

        return (
            <div style={{ paddingLeft: "4vw" }}
            >
                {loading ? (
                    <Spinner />
                ) : (
                        <div>
                            {user.includes("admin") && (
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "1% 0 1% 5%",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "30%",
                                            paddingRight: "3%",
                                            color: "#BDBDBD",
                                            letterSpacing: "1.5px",
                                            fontFamily: "Gotham Rounded Medium"
                                        }}
                                    >
                                        <div style={{ fontSize: "1vw" }}>
                                            {"Location".toUpperCase()}
                                        </div>
                                        <Select
                                            onChange={this.onChangeLocation}
                                            value={location}
                                            styles={
                                                customStyles
                                            }
                                            placeholder="All States"
                                            options={
                                                locations
                                                    ? locations.map(location => {
                                                        return {
                                                            value: location.name,
                                                            label: location.name,
                                                            id: location.id
                                                        };
                                                    })
                                                    : []
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{
                                    width: "41vw",
                                    height: "20vw",
                                    marginRight: "2vw"
                                }} >
                                    <BatteryContent chartData={chartData} />
                                </div>
                                <div
                                    style={{
                                        width: "41vw",
                                        height: "20vw",
                                        position: "relative"
                                    }}
                                >
                                    <Card
                                        style={{
                                            overflow: "auto",
                                            height: "100%",
                                            borderRadius: 8
                                        }}
                                    >
                                        <CardContent
                                            style={{ width: "100%", height: "100%", padding: "2vw" }}
                                        >
                                            <Typography
                                                style={{
                                                    fontFamily: "Gotham Rounded Light",
                                                    color: "#83C4C4",
                                                    fontSize: "1.3vw",
                                                    textTransform: "uppercase"
                                                }}
                                            >
                                                Upcoming Events
                                        </Typography>
                                            <div style={{ padding: "2vw 0" }}>
                                                <UpComingEvents events={events} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Can show="AddEventButton"
                                        yes={() => (
                                            <div
                                            style={{
                                                position: "fixed",
                                                right: "4%",
                                                width: "4vw",
                                                height: "4vw",
                                                top: "90%",
                                                zIndex: 1
                                            }}
                                        >
                                            <Fab
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    alignSelf: "flex-end",
                                                    backgroundColor: "#25A8A8"
                                                }}
                                                onClick={() => this.setState({ openAddEvent: true })}
                                            >
                                                <Add style={{ color: "#fff", fontSize: "2vw" }} />
                                            </Fab>
                                        </div>
                                        )} />
                                </div>
                            </div>
                            <div style={{
                                padding: "3% 0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }} >
                                <Power chartData={chartData} />
                            </div>
                        </div>
                    )}
                <AddEvent  {...addEventProps} />
            </div>
        );
    }
}

const styles = {
    firstBarColor: {
        backgroundColor: "#E84A50"
    },
    secondBarColor: {
        backgroundColor: "#B5D145"
    },
    dateInput: {
        padding: "1%"
    }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default withStyles(styles)(connect(mapStateToProps)(Dashboard));

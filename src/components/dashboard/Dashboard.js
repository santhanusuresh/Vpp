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
        date: null,
        from: "02:00",
        to: "04:00",
        status: null,
        power: 45,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        validationText: ""
    };


    componentDidMount() {
        const { isAuthenticated, user, userid } = this.props.auth;
        const { username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;

        console.log("isAuthenticated", isAuthenticated);
        console.log("userid", userid);
        console.log("username", username);
        console.log("password", password);

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
                // console.log("isAuthenticated", isAuthenticated);

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

                                // console.log("events", events);
                                // console.log("locations".padEnd(30,'*'), locations);
                                // console.log("chartData".padEnd(30,'*'), chartData);

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

    componentDidUpdate() {
        console.log("isAuthenticated", this.props.auth.isAuthenticated);
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
        const { username, userpassword } = this.props.auth;
        const password = userpassword;
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
        const { classes } = this.props;
        const { isAuthenticated, user, error } = this.props.auth;
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
            <div
                style={{
                    paddingLeft: "4vw"
                }}
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
                                    {user.includes("admin") && (
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
                                    )}
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

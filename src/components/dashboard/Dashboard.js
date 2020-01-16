import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import { Base64 } from 'js-base64';
import {
    Card,
    CardContent,
    withStyles,
    Fab,
    Dialog,
    DialogContent,
    Slider,
    Button,
    TextField,
    createMuiTheme
} from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import {
    DatePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Add } from "@material-ui/icons";
import "./Dashboard.css";
import store from "../../store/store";
import { LOGIN_ERROR } from "../../actions/types";
import { ThemeProvider } from "@material-ui/styles";
import Power from "./Power";
import BatteryContent from "./BatteryContent";
import UpComingEvents from "./UpComingEvents";


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

const muiTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: "#25A8A8"
            }
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                // backgroundColor: lightBlue.A200,
                // color: "white",
            }
        },
        MuiPickersDay: {
            day: {
                color: "#25A8A8"
            },
            daySelected: {
                backgroundColor: "#25A8A8"
            },
            dayDisabled: {
                color: "#25A8A8"
            },
            current: {
                color: "#25A8A8"
            }
        },
        MuiPickersModal: {
            dialogAction: {
                color: "#25A8A8"
            }
        },
        MuiOutlinedInput: {
            // input:{
            //     border:'0.2rem solid black',
            //     borderRadius:'2px',
            //     '&$focused':{
            //       border:'0.2rem solid red',
            //       borderRadius:'100px'
            //     }
            // },
            // focused:{}
            root: {
                position: 'relative',
                '& $notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor: '#00008b',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                },
                '&$focused $notchedOutline': {
                    borderColor: '#4A90E2',
                    borderWidth: 2,
                },
            },
        }
    }
});

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

    onClickSave = () => {
        const { isAuthenticated, user } = this.props.auth;
        const { userid, username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;
        const { power, location, date, from, to } = this.state;

        if (location === null) {
            return this.setState({ validationText: "Please enter all details" });
        }

        if (date === null) {
            return this.setState({ validationText: "Please enter all details" });
        }

        if (from === null) {
            return this.setState({ validationText: "Please enter all details" });
        }

        if (to === null) {
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
                // console.log("save", res);
                // console.log("res.success", JSON.parse(res).success);
                // console.log("res.success", typeof JSON.parse(res).success);
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
                        // "http://localhost:9081/event/group/upcoming/"+location.id,
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

    onChange = (e, name, filter) => {
        console.log("e", e);

        switch (name) {
            case "date":
                const date = moment(e).format("YYYY-MM-DD");
                // const date = e;

                return this.setState({ [name]: date }, () => {
                    if (filter) {
                        this.onFilterEvents();
                    }
                });

            case "location":
                return this.setState({ location: e, power: e.maxPower }, () => {
                    if (filter) {
                        console.log("running callback");
                        this.onFilterEvents();
                    }
                });

            default:
                return this.setState({ [name]: e }, () => {
                    if (filter) {
                        this.onFilterEvents();
                    }
                });
        }
    };

    onChangeLocation = (e, name) => {
        const { userid, username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;
        this.setState({ [name]: e, loading: true }, () => {
            console.log("e.id", e.id);
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/event/group/upcoming/" + e.id,
                // "http://localhost:9081/event/group/upcoming/"+e.id,
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
                            // console.log("api 19 res", events);
                            // console.log("api 19 res", chartData);
                            this.setState({
                                events: events.data ? events.data : [],
                                chartData: chartData.data ? chartData.data : {},
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
            date,
            to,
            from,
            power,
            openAddEvent,
            windowHeight,
            windowWidth,
            validationText
        } = this.state;

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
                            { user.includes("admin")  &&  (
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
                                            onChange={e => this.onChangeLocation(e, "location")}
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
                            ) }
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <BatteryContent chartData={chartData} />
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
                                    {user.includes("admin")  && (
                                        <div
                                            style={{
                                                position: events.length === 0 ? "absolute" : "fixed",
                                                right: events.length === 0 ? "-3%" : "4%",
                                                width: "4vw",
                                                height: "4vw",
                                                top: events.length === 0 ? "-7%" : "90%",
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
                                    ) }
                                </div>
                            </div>
                            <Power chartData={chartData} />
                        </div>
                    )}
                <Dialog
                    fullWidth
                    style={{ zIndex: 2 }}
                    open={openAddEvent}
                    onClose={() => this.setState({ openAddEvent: false })}
                >
                    <DialogContent style={{ height: "28vw" }}>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                zIndex: 3
                            }}
                        >
                            <div
                                style={{
                                    width: "80%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    height: "100%"
                                }}
                            >
                                <Typography
                                    style={{
                                        color: "#25A8A8",
                                        fontFamily: "Gotham Rounded Light"
                                    }}
                                >
                                    {"Add event".toUpperCase()}
                                </Typography>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Typography style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Location</Typography>
                                    <div style={{ width: "70%" }}>
                                        <Select
                                            onChange={e => this.onChange(e, "location", false)}
                                            value={location}
                                            styles={{
                                                menuPortal: styles => ({ ...styles, zIndex: 4 })
                                            }, customStyles}
                                            placeholder="All States"
                                            options={
                                                locations
                                                    ? locations.map(location => {
                                                        return {
                                                            value: location.name,
                                                            label: location.name,
                                                            id: location.id,
                                                            maxPower: location.maxPower / 1000
                                                        };
                                                    })
                                                    : []
                                            }
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Typography style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Date</Typography>
                                    <div style={{ width: "70%" }}>
                                        <ThemeProvider theme={muiTheme}>

                                            <MuiPickersUtilsProvider
                                                className="MuiOutlinedInput-input"
                                                utils={MomentUtils}
                                            >
                                                <DatePicker
                                                    disableToolbar
                                                    inputVariant="outlined"
                                                    style={{ fontFamily: "Gotham Rounded Light" }}
                                                    placeholder="Date"
                                                    format="DD/MM/YY"
                                                    onChange={e => this.onChange(e, "date", false)}
                                                    value={date}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </ThemeProvider>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Typography style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Time</Typography>
                                    <div style={{
                                        display: "flex", width: "70%",
                                        alignItems: "center"
                                    }}>
                                        <div style={{ width: "40%" }}>
                                            <TextField
                                                type="time"
                                                inputProps={{
                                                    step: '1800'
                                                }}
                                                variant="outlined"
                                                value={from === null ? "02:00" : from}
                                                style={{ fontFamily: "Gotham Rounded Medium" }}
                                                placeholder={"Enter as 22:15"}
                                                onChange={e => this.setState({ from: e.target.value })}
                                            />

                                        </div>
                                        <Typography style={{
                                            color: "#333",
                                            width: "20%",
                                            textAlign: "center",
                                            fontFamily: "Gotham Rounded Light"
                                        }}>
                                            to
                                        </Typography>
                                        <div style={{ width: "40%" }}>
                                            <TextField
                                                type="time"
                                                inputProps={{
                                                    step: '1800'
                                                }}
                                                variant="outlined"
                                                value={to === null ? "04:00" : to}
                                                style={{ fontFamily: "Gotham Rounded Light" }}
                                                placeholder={"04:00"}
                                                onChange={e => this.setState({ to: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Typography style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Power</Typography>
                                    <Typography style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>{`${power} kW`}</Typography>
                                </div>
                                <Slider
                                    value={power}
                                    max={location ? location.maxPower : 100}
                                    aria-label="custom thumb label"
                                    onChange={(e, value) => {
                                        return this.setState({ power: value });
                                    }}
                                    classes={{
                                        thumb: classes.thumb,
                                        track: classes.track
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    {validationText ? (
                                        <Typography style={{ color: "red" }}>
                                            {validationText}
                                        </Typography>
                                    ) : null}
                                    {error ? (
                                        <Typography style={{ color: "red" }}>
                                            {error.value}
                                        </Typography>
                                    ) : null}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                >
                                    <Button
                                        onClick={this.onClickSave}
                                        variant="contained"
                                        style={{
                                            color: "#fff",
                                            textTransform: "none",
                                            backgroundColor: "#25A8A8",
                                            width: "30%"
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
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

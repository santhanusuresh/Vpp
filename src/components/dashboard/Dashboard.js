import React, { Component } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Select from "react-select";
import { Base64 } from 'js-base64';
import {
    Card,
    CardContent,
    LinearProgress,
    Icon,
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
    MuiPickersUtilsProvider,
    TimePicker
} from "@material-ui/pickers";
import {
    CircularProgressbar,
    buildStyles,
    CircularProgressbarWithChildren
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
import { connect } from "react-redux";

import RadialSeparators from "../common/RadialSeparators";
import ChartJS from "../common/Chart";
import logo from "../../assets/shinehub-logo.svg";
import avatar from "../../assets/Avatar.svg";
import bell from "../../assets/Shape.svg";
import analytics from "../../assets/icon-analytics.svg";
import fourRectangles from "../../assets/four-rectangles.svg";
import calendar from "../../assets/Calendar.svg";
import cogWheel from "../../assets/cog-wheel.svg";
import menuIcon from "../../assets/menu-icon.svg";
import stockMarketArrowDown from "../../assets/stock-market-arrow.svg";
import stockMarketArrowUp from "../../assets/stock-market-arrow-up.svg";
import Spinner from "../common/Spinner";
import { Add } from "@material-ui/icons";
import "./Dashboard.css";
import store from "../../store/store";
import { LOGIN_ERROR } from "../../actions/types";
import { ThemeProvider } from "@material-ui/styles";


const customStyles = {
    control: (base, state) => {
        // console.log('state',state);
        // console.log('base',base);
        return {
            ...base,
            // borderColor: state.isFocused?'red':'blue',
            "&:hover": {
                borderColor: state.isFocused ? "#00008b" :base.borderColor
            }
            // You can also use state.isFocused to conditionally style based on the focus state
        }}
};

const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
const userID = localStorage.getItem('userID');

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
        MuiOutlinedInput:{
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
        chartData: [],
        locations: [],
        loading: true,
        openAddEvent: false,
        location: null,
        date: null,
        from: null,
        to: null,
        status: null,
        power: 45,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        validationText: ""
    };



    componentDidMount() {
        const { isAuthenticated, user } = this.props.auth;

        console.log("isAuthenticated", isAuthenticated);
        console.log("this.props", this.props);

        window.addEventListener("resize", this.onResizeWindow);

        fetch(
            "http://54.206.87.91:8080/backend-service/dashboard/data/",
            {
                method: "GET",
                headers:{
                    "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                    "Content-Type": "application/json"
                },
            }
        )
            .then(chartData => chartData.json())
            .then(chartData => {
                console.log("isAuthenticated", isAuthenticated);

                return fetch(
                    "http://54.206.87.91:8080/backend-service/group/",
                    {
                        method: "GET",
                        headers:{
                            "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                            "Content-Type": "application/json"
                        },
                    }
                )
                    .then(res => res.json())
                    .then(locations => {
                        fetch(
                            "http://54.206.87.91:8080/backend-service/event/group/a3eee230-1ced-11ea-8009-4b84bd592adf/date/2019-12-26",
                            {
                                method: "GET",
                                headers:{
                                    "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                                    "Content-Type": "application/json"
                                },
                            }
                        )
                            .then(res => res.json())
                            .then(events => {

                                // console.log("events", events);
                                // console.log("locations", locations);
                                // console.log("chartData", chartData);

                                if(events.r===-2 || chartData.success!=1){
                                    return this.props.history.push('/login');
                                }
                                this.setState({
                                    loading: false,
                                    locations: locations.data,
                                    events: events.data?events.data:[],
                                    chartData: chartData.data?chartData.data:{}
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

    // onClickSave = () => {
    //   const { isAuthenticated, user } = this.props.auth;
    //   const { power, location, date, from, to,openAddEvent } = this.state;
    //   console.log("typeof from", typeof parseInt(location.id));
    //   console.log("typeof from", typeof parseInt(from));
    //   console.log(" from", from);
    //   console.log("typeof to", typeof parseInt(to));
    //   console.log("typeof date", typeof date);
    //   console.log("date", date);
    //   console.log("typeof date", typeof power);

    //   if(date===null || date){
    //     return;
    //   }
    //   if(location===null || location){
    //     return;
    //   }
    //   if(from===null || from){
    //     return;
    //   }
    //   if(to===null || to){
    //     return;
    //   }

    //   fetch(
    //     "https://monitoring.shinehub.com.au/handler/web/Group/handleAddRelationDispatch.php",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         d: JSON.stringify({
    //           cvs: {
    //             a: parseInt(location.id),
    //             st: parseInt(from.value),
    //             et: parseInt(to.value),
    //             // d: moment(date._d).format('YYYY-MM-DD'),
    //             d: date.toString(),
    //             p: power,
    //             i: 0
    //           }
    //         })
    //       })
    //     }
    //   )
    //     .then(res => res.text())
    //     .then(res => {
    //       console.log("save", res);
    //       Promise.all([
    //         fetch(
    //           "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupAllDischarge.php",
    //           {
    //             method: "POST",
    //             body: JSON.stringify({
    //               d: JSON.stringify({
    //                 cvs: {
    //                   u: user
    //                 }
    //               })
    //             })
    //           }
    //         ),
    //         fetch(
    //           "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupList.php",
    //           {
    //             method: "POST",
    //             body: JSON.stringify({
    //               d: JSON.stringify({
    //                 cvs: {
    //                   u: user
    //                 }
    //               })
    //             })
    //           }
    //         )
    //       ])
    //         .then(res => res.map(value => value.json()))
    //         .then(res => {
    //           let eventsRes, locationsRes;
    //           Promise.all([res[0], res[1]]).then(res => {
    //             console.log("reses", res);
    //             return this.setState({
    //               loading: false,
    //               openAddEvent: false,
    //               showEvents: res[0].d,
    //               events: res[0].d,
    //               locations: res[1].d
    //             });
    //           });
    //         });
    //     });
    // };

    onClickSave = () => {
        const { isAuthenticated, user } = this.props.auth;
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

        // console.log("typeof from", typeof parseInt(location.id));
        // console.log("typeof from", typeof parseInt(from));
        // console.log(" from", from);
        // console.log("typeof to", typeof parseInt(to));
        // console.log("typeof date", typeof date);
        // console.log("date", date);
        // console.log("typeof date", typeof power);

        fetch(
            "https://monitoring.shinehub.com.au/handler/web/Group/handleAddRelationDispatch.php",
            {
                method: "POST",
                body: JSON.stringify({
                    d: JSON.stringify({
                        cvs: {
                            a: parseInt(location.id),
                            st: moment(from, "HH:mm:ss").format("HH:mm"),
                            et: moment(to, "HH:mm:ss").format("HH:mm"),
                            d: moment(date).format("YYYY-MM-DD"),
                            p: power,
                            i: 0
                        }
                    })
                })
            }
        )
            .then(res => res.text())
            .then(res => {
                // console.log("save", res);
                // console.log("res.r", typeof JSON.parse(res).r);
                if (JSON.parse(res).r === 2) {
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
                        "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupAllDischarge.php",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                d: JSON.stringify({
                                    cvs: {
                                        u: user
                                    }
                                })
                            })
                        }
                    ),
                    fetch(
                        "http://54.206.123.91:8080/backend-service/group/",
                        {
                            method: "POST",
                            headers:{
                                "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                                "Content-Type": "application/json"
                            },
                        }
                    )
                ])
                    .then(res => res.map(value => value.json()))
                    .then(res => {
                        let eventsRes, locationsRes;
                        Promise.all([res[0], res[1]]).then(res => {
                            // console.log("reses", res);
                            return this.setState({
                                loading: false,
                                openAddEvent: false,
                                showEvents: res[0].d,
                                events: res[0].d,
                                locations: res[1].date
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
    this.setState({ [name]: e, loading: true }, () => {
      console.log("e.id", e.id);
      fetch(
        "http://54.206.87.91:8080/backend-service/event/group/a3eee230-1ced-11ea-8009-4b84bd592adf/date/2019-12-26",
        {
            method: "GET",
            headers:{
                "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                "Content-Type": "application/json"
            },
        }
      )
        .then(res => res.json())
        .then(events => {
          fetch(
            "http://54.206.87.91:8080/backend-service/dashboard/data/group/"+e.id,
            {
                method: "GET",
                headers:{
                    "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
                    "Content-Type": "application/json"
                },
            }
          )
            .then(res => res.json())
            .then(chartData => {
              // console.log("api 19 res", events);
              // console.log("api 19 res", chartData);
              this.setState({
                events: events.data?events.data:[],
                chartData: chartData.data?chartData.data:{},
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

        let chartContent;
        let batteryContent;
        let upcomingEventsContent;

        if (Object.keys(chartData).length > 0) {
            // console.log('results',graphcfreetdIna)
            chartData.BatteryCap = chartData.CurrentAvailablePower;
            chartData.BatteryCount = chartData.SystemNumber;
            chartData.BatteryTotal = chartData.CurrentAvailablePower;
            const { BatteryCap, BatteryCount, BatteryTotal } = chartData;
            // console.log("typeof BatteryCap", typeof BatteryCap);
            // console.log("typeof BatteryTotal", typeof BatteryTotal);
            // console.log("typeof BatteryCount", typeof BatteryCount);
            batteryContent = (
                <div
                    style={{
                        // height: "100%"
                        width: "41vw",
                        height: "20vw",
                        marginRight: "2vw"
                    }}
                >
                    <Card
                        style={{
                            borderRadius: 8,
                            //  height: "22.5rem"
                            height: "100%"
                        }}
                    >
                        <CardContent style={{ width: "100%", height: "100%" }}>
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    alignItems: "center"
                                }}
                            >
                                {/*{console.log("batteryCap", BatteryCap)}*/}
                                <div style={{ width: "16vw" }}>
                                    {/* <CircularProgressbarWithChildren
                    value={BatteryCap===undefined?0:BatteryCap}
                    text={`${Math.round(BatteryCap===undefined?0:BatteryCap)}W`}
                    circleRatio={0.5}
                    strokeWidth={6}
                    styles={buildStyles({
                      strokeLinecap: "round",
                      backgroundColor: "blue",
                      // trailColor: "red",
                      pathColor: "#25A8A8",
                      borderBottomColor: "transparent"
                    })}
                  >
                  <RadialSeparators
                      count={66}
                      style={{
                        borderRadius: -20,
                        borderBottomColor: "transparent",
                        background: "#000",
                        width: "6px",
                        // This needs to be equal to props.strokeWidth
                        height: `${6}%`
                      }}
                      />
                  </CircularProgressbarWithChildren> */}
                                    <CircularProgressbarWithChildren
                                        value={
                                            typeof BatteryCap !== "number" ||
                                            typeof BatteryTotal !== "number"
                                                ? (parseInt(BatteryCap) / parseInt(BatteryTotal)) * 100
                                                : 0
                                        }
                                        // text={`${50}%`}
                                        strokeWidth={15}
                                        circleRatio={0.6}
                                        className="CircularProgressbar"
                                        styles={buildStyles({
                                            rotation: 1 / 2 + 1 / 8,
                                            strokeLinecap: "butt",
                                            trailColor: "#D3E9EA",
                                            pathColor: "#25A8A8",
                                            alignSelf: "flex-end"
                                        })}
                                    >
                                        <RadialSeparators
                                            count={60}
                                            style={{
                                                // borderRadius: 5,
                                                borderBottomColor: "transparent",
                                                background: "#fff",
                                                width: `.45vw`,
                                                // This needs to be equal to props.strokeWidth
                                                height: `2.4vw`
                                            }}
                                        />
                                        <div
                                            style={{
                                                // padding: "10px 0 0 0",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: 0,
                                                    margin: 0
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontFamily: "Gotham Rounded Medium",
                                                        fontSize: "3.5vw",
                                                        padding: 0,
                                                        margin: 0
                                                    }}
                                                >
                                                    {Math.round(BatteryCap / 1000)}
                                                </div>
                                                <div
                                                    style={{
                                                        fontFamily: "Gotham Rounded Light",
                                                        margin: "2vw 0 0 0",
                                                        fontSize: "0.8vw",
                                                        padding: 0
                                                    }}
                                                >
                                                    kW
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: 0,
                                                    margin: 0
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color: "#83C4C4",
                                                        // fontWeight: "100",
                                                        fontSize: "1.1vw",
                                                        fontFamily: "Gotham Rounded Light",
                                                        padding: 0,
                                                        margin: 0,
                                                        textTransform: "uppercase"
                                                    }}
                                                >
                                                    Available
                                                </div>
                                                <div
                                                    style={{
                                                        color: "#83C4C4",
                                                        // fontWeight: "100",
                                                        fontFamily: "Gotham Rounded Light",
                                                        padding: 0,
                                                        margin: 0,
                                                        fontSize: "1.1vw",
                                                        textTransform: "uppercase"
                                                    }}
                                                >
                                                    Power
                                                </div>
                                            </div>
                                        </div>
                                    </CircularProgressbarWithChildren>
                                </div>
                                <div
                                    style={{
                                        fontFamily: "Gotham Rounded Bold",
                                        paddingLeft: "8px",
                                        paddingBottom: "10%"
                                    }}
                                >
                                    <Typography
                                        style={{
                                            fontFamily: "Gotham Rounded Medium",
                                            fontSize: "2.2vw"
                                        }}
                                    >
                                        Your Virtual
                                    </Typography>
                                    <Typography
                                        style={{
                                            fontFamily: "Gotham Rounded Medium",
                                            fontSize: "2.2vw"
                                        }}
                                    >
                                        Power Plant
                                    </Typography>
                                    <Typography
                                        style={{
                                            fontFamily: "Gotham Rounded Light",
                                            color: "#828282",
                                            fontSize: "1vw",
                                            display: "inline-block",
                                            overflowWrap: "break-word"
                                        }}
                                    >
                                        { (BatteryCount==1)?`There is currently ${BatteryCount}`:`There are currently ${BatteryCount}`}
                                        <Typography
                                            style={{
                                                display: "table",
                                                fontFamily: "Gotham Rounded Light",
                                                color: "#828282",
                                                fontSize: "1vw"
                                            }}
                                        >{ (BatteryCount==1)?`home in your fleet`:`homes in your fleet`}
                                        </Typography>
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

            chartContent = (
                <div
                    style={{
                        padding: "3% 0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Card style={{ borderRadius: 8, width: "84vw" }}>
                        <CardContent style={{ width: "100%" }}>
                            <div
                                style={{
                                    display: "flex",
                                    marginBottom: "6px",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Typography
                                    style={{
                                        padding: "0 0 3% 8%",
                                        color: "#83C4C4",
                                        fontSize: "1.3vw",
                                        fontFamily: "Gotham Rounded Light"
                                    }}
                                >
                                    {"Power".toUpperCase()}
                                </Typography>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        alignSelf: "flex-end"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            paddingRight: "2vw",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "#25A8A8",
                                                width: "1vw",
                                                height: "1vw",
                                                borderRadius: 50
                                            }}
                                        >
                                            &nbsp;
                                        </div>
                                        <Typography
                                            style={{
                                                fontSize: "1.5vw",
                                                fontFamily: "Gotham Rounded Light",
                                                color: "#828282"
                                            }}
                                        >
                                            Available Power
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "#B5D145",
                                                width: "1vw",
                                                height: "1vw",
                                                borderRadius: 40
                                            }}
                                        >
                                            &nbsp;
                                        </div>
                                        <Typography
                                            style={{
                                                fontSize: "1.5vw",
                                                fontFamily: "Gotham Rounded Light",
                                                color: "#828282",
                                                paddingRight: "28px"
                                            }}
                                        >
                                            Net Grid Power
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <ChartJS
                                charge={chartData.NetToGrid}
                                time={chartData.Time}
                                availablePower={chartData.AvailablePower}
                                netInGrid={chartData.NetToGrid}
                            />
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (events.length > 0) {
            upcomingEventsContent =
                events.length > 0 ? (
                    events.map(event => {
                        // console.log("filter api what", new Date(event.date));

                        return (
                            <div
                                style={
                                    {
                                        // padding: "1% 0"
                                    }
                                }
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <Typography
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontFamily: "Gotham Rounded Medium",
                                            fontSize: "1.3vw"
                                        }}
                                    >
                                        {event.groupId}
                                    </Typography>
                                    <div style={{ display: "flex" }}>
                                        <Typography
                                            style={{
                                                paddingRight: "1px",
                                                fontFamily: "Gotham Rounded Medium",
                                                fontSize: "1.3vw"
                                            }}
                                        >
                                            {`${parseInt(event.power) / 1000} kW`}
                                        </Typography>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "1% 0",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: "Gotham Rounded Medium",
                                            color: "#828282",
                                            fontSize: "1vw"
                                        }}
                                    >
                                        {moment(event.date).format("DD/MM/YYYY")}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Gotham Rounded Medium",
                                            color: "#828282",
                                            fontSize: "1vw"
                                        }}
                                    >{`${moment(event.startTime, "HH:mm:ss").format(
                                        "HH:mm"
                                    )}-${moment(event.endTime, "HH:mm:ss").format(
                                        "HH:mm"
                                    )}`}</div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Typography>No Upcoming Events!</Typography>
                );
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
                    <div
                        style={
                            {
                                // width: "100%"
                            }
                        }
                    >{console.log("user",user)}
                        {user.includes("admin") ? (
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
                                                    console.log("location all state",location)
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
                                {/* <div style={{ width: "30%" }}>
            <h5>Network Provider</h5>
            <Select
              onChange={() => {}}
              value="networkProvider"
              options={[
                { value: "ausgrid", label: "Ausgrid" }
              ]}
            />
          </div> */}
                            </div>
                        ) : (
                            ""
                        )}
                        {/* {user.includes("admin") ? (
              <div style={{width:'100%'}}>
              <div
                style={{
                  backgroundColor:'red',
                  width: "100%",
                  display: "flex",
                  justifyContent:'flex-end',
                  padding: "3% 0 0 3%"
                }}
              >

                <Fab
                  style={{
                    alignSelf:'flex-end',
                    backgroundColor: "#25A8A8"
                  }}
                  onClick={() => this.setState({ openAddEvent: true })}
                >
                  <Add style={{ color: "#fff" }} />
                </Fab>
              </div>
            </div>
            ) : (
              ""
            )} */}
                        <div
                            style={{
                                // position:'relative',
                                display: "flex",
                                justifyContent: "center",

                                alignItems: "center"
                                // padding: "3%",
                                // width: "100%",

                                // height: "40%"
                            }}
                        >
                            {batteryContent}
                            <div
                                style={{
                                    width: "41vw",
                                    height: "20vw",
                                    position: "relative"
                                }}
                            >
                                {events.length>=0?<Card
                                    style={{
                                        overflow: "auto",
                                        height: "100%",
                                        // height: "22.5rem",
                                        // width: "36rem",
                                        borderRadius: 8
                                        // padding: "1% 0",
                                        // marginLeft: "27px"
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
                                            // variant="subtitle2"
                                        >
                                            Upcoming Events
                                        </Typography>
                                        <div style={{ padding: "2vw 0" }}>
                                            {/* <div style={{ padding: "1% 0" }}>
                  <div
                  style={{
                    display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                  <Typography style={{ whiteSpace: "nowrap" }}>
                    New South Wales - Sydney
                    </Typography>
                    <div style={{ display: "flex" }}>
                    <Typography style={{ paddingRight: "5px" }}>
                        1428 kW{"   "}
                        </Typography>
                      <Typography>
                      <img src={stockMarketArrowDown} /> -7.6%
                      </Typography>
                    </div>
                  </div>
                  <LinearProgress
                  classes={{
                    bar1Determinate: classes.firstBarColor
                    }}
                    style={{ height: 10, borderRadius: 20, color: "#E84A50" }}
                    variant="determinate"
                    value={86}
                    />
                    </div>
                    <div style={{ padding: "1% 0" }}>
                    <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    >
                  <Typography style={{ whiteSpace: "nowrap" }}>
                  New South Wales - Sydney
                  </Typography>
                  <div style={{ display: "flex" }}>
                  <Typography style={{ paddingRight: "5px" }}>
                  1428 kW{"   "}
                  </Typography>
                  <Typography>
                  <img src={stockMarketArrowUp} /> 7.6%
                  </Typography>
                  </div>
                  </div>
                  <LinearProgress
                  style={{ height: 10, borderRadius: 20 }}
                  classes={{
                      bar1Determinate: classes.secondBarColor
                    }}
                    variant="determinate"
                    value={86}
                    />
                  </div> */}
                                            {upcomingEventsContent}
                                        </div>
                                    </CardContent>
                                </Card>:<Typography style={{fontSize:'3vw',fontFamily:'Gotham Rounded Bold',textAlign:'center'}}>Nothing to show!</Typography>}
                                {user.includes("admin") ? (
                                    <div
                                        style={{
                                            position: events.length>0?"absolute":"fixed",
                                            right: events.length>0?"-3%":"4%",
                                            width: "4vw",
                                            height: "4vw",
                                            top: events.length>0?"-7%":"90%",
                                            zIndex:1
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
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        {chartContent}
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
                                // fontFamily: "Gotham Rounded Medium",
                                alignItems: "center",
                                zIndex:3
                            }}
                        >
                            <div
                                style={{
                                    width: "80%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    // fontFamily: "Gotham Rounded Medium",
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
                                    <Typography  style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Location</Typography>
                                    <div style={{ width: "70%" }}>
                                        <Select
                                            onChange={e => this.onChange(e, "location", false)}
                                            value={location}
                                            // menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: styles => ({ ...styles, zIndex: 4 })
                                            },customStyles}
                                            placeholder="All States"
                                            options={
                                                locations
                                                    ? locations.map(location => {
                                                        // console.log("location all state",location)
                                                        return {
                                                            value: location.name,
                                                            label: location.name,
                                                            id: location.id,
                                                            maxPower: location.maxPower/1000
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
                                        {/* <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: styles => ({ ...styles, zIndex: 4 })
                      }}
                      options={[
                        { value: "2019-09-10", label: "10/09/2019" },
                        { value: "2019-09-11", label: "11/09/2019" },
                        { value: "2019-09-12", label: "12/09/2019" },
                        { value: "2019-09-13", label: "13/09/2019" },
                        { value: "2019-09-14", label: "14/09/2019" },
                        { value: "2019-09-15", label: "15/09/2019" },
                        { value: "2019-09-16", label: "16/09/2019" },
                        { value: "2019-09-17", label: "17/09/2019" },
                        { value: "2019-09-18", label: "18/09/2019" },
                        { value: "2019-09-19", label: "19/09/2019" },
                        { value: "2019-09-20", label: "20/09/2019" },
                        { value: "2019-09-21", label: "21/09/2019" },
                        { value: "2019-09-22", label: "22/09/2019" },
                        { value: "2019-09-23", label: "23/09/2019" },
                        { value: "2019-09-24", label: "24/09/2019" },
                        { value: "2019-09-26", label: "25/09/2019" },
                        { value: "2019-09-27", label: "26/09/2019" },
                        { value: "2019-09-28", label: "27/09/2019" },
                        { value: "2019-09-29", label: "28/09/2019" },
                        { value: "2019-09-30", label: "29/09/2019" },
                        { value: "2019-09-31", label: "30/09/2019" }
                      ]}
                      onChange={e => this.onChange(e, "date",false)}
                      value={date}
                    /> */}
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
                                                    // minDate={new Date()}
                                                    // minDateMessage="Date should not be in the past!"
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
                                    <div style={{ display: "flex", width: "70%",
                                        alignItems: "center"}}>
                                        <div style={{ width: "40%"}}>
                                            {/* <Select
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: styles => ({ ...styles, zIndex: 4 })
                        }}
                        value={from}
                        onChange={e => this.onChange(e, "from", false)}
                        options={[
                          { value: "01", label: "1 am" },
                          { value: "02", label: "2 am" },
                          { value: "03", label: "3 am" },
                          { value: "04", label: "4 am" },
                          { value: "05", label: "5 am" },
                          { value: "06", label: "6 am" },
                          { value: "07", label: "7 am" },
                          { value: "08", label: "8 am" },
                          { value: "09", label: "9 am" },
                          { value: "10", label: "10 am" },
                          { value: "11", label: "11 am" },
                          { value: "12", label: "12 pm" },
                          { value: "13", label: "1 pm" },
                          { value: "14", label: "2 pm" },
                          { value: "15", label: "3 pm" },
                          { value: "16", label: "4 pm" },
                          { value: "17", label: "5 pm" },
                          { value: "18", label: "6 pm" },
                          { value: "19", label: "7 pm" },
                          { value: "20", label: "8 pm" },
                          { value: "21", label: "9 pm" },
                          { value: "22", label: "10 pm" },
                          { value: "23", label: "11 pm" },
                          { value: "24", label: "12 pm" }
                        ]}
                      /> */}

                                            {/* <MuiPickersUtilsProvider utils={MomentUtils}>
                        <TimePicker
                          inputVariant="outlined"
                          clearable
                          ampm={false}
                          //  label="24 hours"
                          value={from}
                          onChange={e => this.onChange(e, "from", false)}
                        />
                      </MuiPickersUtilsProvider> */}
                                            <TextField
                                                type="time"
                                                inputProps={{
                                                    step:'1800'
                                                }}
                                                variant="outlined"
                                                value={from===null?"02:00":from}
                                                style={{ fontFamily: "Gotham Rounded Medium" }}
                                                placeholder={"Enter as 22:15"}
                                                onChange={e => this.setState({ from: e.target.value })}
                                            />

                                        </div>
                                        <Typography style={{  color: "#333",
                                            width: "20%",
                                            textAlign: "center",
                                            fontFamily: "Gotham Rounded Light" }}>
                                            to
                                        </Typography>
                                        <div style={{ width: "40%" }}>
                                            {/* <Select
                        onChange={e => this.onChange(e, "to", false)}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: styles => ({ ...styles, zIndex: 4 })
                        }}
                        options={[
                          { value: "01", label: "1 am" },
                          { value: "02", label: "2 am" },
                          { value: "03", label: "3 am" },
                          { value: "04", label: "4 am" },
                          { value: "05", label: "5 am" },
                          { value: "06", label: "6 am" },
                          { value: "07", label: "7 am" },
                          { value: "08", label: "8 am" },
                          { value: "09", label: "9 am" },
                          { value: "10", label: "10 am" },
                          { value: "11", label: "11 am" },
                          { value: "12", label: "12 pm" },
                          { value: "13", label: "1 pm" },
                          { value: "14", label: "2 pm" },
                          { value: "15", label: "3 pm" },
                          { value: "16", label: "4 pm" },
                          { value: "17", label: "5 pm" },
                          { value: "18", label: "6 pm" },
                          { value: "19", label: "7 pm" },
                          { value: "20", label: "8 pm" },
                          { value: "21", label: "9 pm" },
                          { value: "22", label: "10 pm" },
                          { value: "23", label: "11 pm" },
                          { value: "24", label: "12 pm" }
                        ]}
                        value={to}
                      /> */}
                                            {/* <MuiPickersUtilsProvider utils={MomentUtils}>
                        <TimePicker
                          inputVariant="outlined"
                          clearable
                          ampm={false}
                          //  label="24 hours"
                          value={to}
                          onChange={e => this.onChange(e, "to", false)}
                        />
                      </MuiPickersUtilsProvider> */}
                                            <TextField
                                                type="time"
                                                inputProps={{
                                                    step:'1800'
                                                }}
                                                variant="outlined"
                                                value={to===null?"04:00":to}
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
                                    <Typography  style={{
                                        color: "#333",
                                        fontFamily: "Gotham Rounded Light"
                                    }}>Power</Typography>
                                    <Typography style={{  color: "#333",
                                        fontFamily: "Gotham Rounded Light"}}>{`${power} kW`}</Typography>
                                </div>
                                <Slider
                                    value={power}
                                    max={location ? location.maxPower : 100}
                                    aria-label="custom thumb label"
                                    onChange={(e, value) => {
                                        // console.log("e", e);
                                        // console.log("value", value);
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

export default withStyles(styles)(
    connect(
        mapStateToProps,
        {}
    )(Dashboard)
);

{
    /*
     */
}

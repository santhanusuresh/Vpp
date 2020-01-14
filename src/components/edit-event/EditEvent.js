import React, {Component} from "react";
import {
    Button,
    Typography,
    Card,
    CardContent,
    TextField
} from "@material-ui/core";
import {connect} from "react-redux";
import ChartJS from "../common/Chart";
// import arrowDown from "../../assets/stock-market-arrow.svg";
// import arrowUp from "../../assets/arrow-up-icon.png";
import {CallMade, CallReceived} from '@material-ui/icons';
import Spinner from "../common/Spinner";
import moment from "moment";
import {TimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Base64} from "js-base64";

const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
// const username = 'saraswata';
// const password = '#abcd123';
const userID = localStorage.getItem('userID');

class EditEvent extends Component {
    state = {
        completed: false,
        event: {},
        chartData: [],
        loading: true,
        editClicked: false,
        date: "",
        startTime: '',
        endTime: '',
        power: ""
    };

    componentDidMount() {
        console.log("this.props", this.props);
        const {state} = this.props.location;
        const {isAuthenticated, user} = this.props.auth;

        console.log("user", user);
        console.log("isAuthenticated", isAuthenticated);
        if (state !== undefined) {
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/dashboard/data/group/" + state.event.groupId + "?date=" + state.event.sysReDDate,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(res => res.json())
                .then(res => {
                    console.log("chart res", res);
                    console.log("event", state.event);
                    return this.setState({
                        loading: false,
                        event: state.event,
                        date: state.event.sysReDDate,
                        startTime: moment(state.event.sysReDStartTime, "HH:mm"),
                        endTime: moment(state.event.sysReDEndTime, "HH:mm"),
                        power: parseInt(state.event.availablepower/1000),
                        chartData: res.data ? res.data : {},
                        completed: state.event.sysReDEventStatus === 0 ? false : state.event.sysReDEventStatus === 1 ? false : true

                    });
                });
        }
    }


    onChange = (e, name) => {
        console.log('name', name);
        console.log("e", e);
        switch (name) {
            case "startTime":
                return this.setState({startTime: e});

            case "endTime":
                return this.setState({endTime: e});
            default:
                return this.setState({[e.target.name]: e.target.value});
        }
    };

    onExportEvent = event => {
        // const {isAuthenticated, user,userid,username,userpassword} = this.props.auth;

        // window.open("https://vppspark.shinehub.com.au:8443/backend-service/system/export/")
        window.open("https://vppspark.shinehub.com.au:8443/backend-service/system/export/" + event.sysReDGroupID + "/" + event.sysReDDate + "/" + event.sysReDCreatTime + "/" + "report/")
        // window.open("http://localhost:9081/system/export/"+event.sysReDGroupID+"/"+event.sysReDDate+"/"+event.sysReDCreatTime+"/" +"filename/")

        // fetch(
        //     "http://localhost:9081/system/export/"+event.sysReDGroupID+"/"+event.sysReDDate+"/"+event.sysReDCreatTime+"/" +"whatname/",
        //     {
        //         method: "GET",
        //         headers: {
        //             "Authorization": "Basic " + Base64.encode(`${username}:${userpassword}`),
        //             "Content-Type": "application/json"
        //         }
        //     }
        // )
    };

    onEditEvent = event => {
        console.log("edit event");
        const {state} = this.props.location;
        const {isAuthenticated, user, userid, username, userpassword} = this.props.auth;
        const {date, startTime, endTime, power} = this.state;
        this.setState({loading: true});
        fetch(
            "https://vppspark.shinehub.com.au:8443/backend-service/event/group/" + event.sysReDGroupID,
            {
                method: "PATCH",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${username}:${userpassword}`),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    createTime: event.sysReDCreatTime,
                    date: date,
                    power: power*1000,
                    starttime: moment(startTime, "HH:mm").format("HH:mm"),
                    endtime: moment(endTime, "HH:mm").format("HH:mm")
                })
            }
        )
            .then(res => res.json())
            .then(res => {
                // console.log("handleEditRelationDispatch res", res);
                fetch(
                    "https://vppspark.shinehub.com.au:8443/backend-service/event/all/",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                            "Content-Type": "application/json"
                        },
                    }
                )
                    .then(res => res.json())
                    .then(res => {
                        // console.log("event", event);
                        // console.log("state.event", state.event);
                        // console.log("event.eventId", typeof event.eventId);
                        // console.log("state.event.sysReDId", typeof state.event.sysReDId);
                        const updatedEvent = res.data.filter(
                            event => event.eventId === state.event.sysReDId
                        );
                        // console.log("updatedEvent", updatedEvent);
                        // console.log("power", typeof updatedEvent.sysReDPower);
                        // console.log("power", typeof parseInt(updatedEvent.sysReDPower));
                        updatedEvent[0].availablepower = updatedEvent[0].power/1000
                        updatedEvent[0].groupname = updatedEvent[0].groupname
                        updatedEvent[0].sysReDCompVal = updatedEvent[0].compval
                        updatedEvent[0].sysReDControlMode = ''
                        updatedEvent[0].sysReDCreatTime = updatedEvent[0].createdTime
                        updatedEvent[0].sysReDDaily = ''
                        updatedEvent[0].sysReDDate = updatedEvent[0].date
                        updatedEvent[0].sysReDEndCap = updatedEvent[0].endCap
                        updatedEvent[0].sysReDEstGen = updatedEvent[0].estgen
                        updatedEvent[0].sysReDEventStatus = updatedEvent[0].eventstatus
                        updatedEvent[0].sysReDGroupID = updatedEvent[0].groupId
                        updatedEvent[0].sysReDId = updatedEvent[0].eventId
                        updatedEvent[0].sysReDIsComplete = updatedEvent[0].isComplete
                        updatedEvent[0].sysReDIsEmail = updatedEvent[0].isemail
                        updatedEvent[0].sysReDIsPrice = updatedEvent[0].isprice
                        updatedEvent[0].sysReDIsStart = updatedEvent[0].isStart
                        updatedEvent[0].sysReDIsValid = 1
                        updatedEvent[0].sysReDMode = ''
                        updatedEvent[0].sysReDNeedCharge = 0
                        updatedEvent[0].sysReDPower = updatedEvent[0].power
                        updatedEvent[0].sysReDPrice = updatedEvent[0].price
                        updatedEvent[0].sysReDSOC = 10
                        updatedEvent[0].sysReDStartCap = updatedEvent[0].startBattery
                        updatedEvent[0].sysReDStartTime = updatedEvent[0].startTime
                        updatedEvent[0].sysReDEndTime = updatedEvent[0].endTime
                        updatedEvent[0].sysReDStatus = "1"
                        updatedEvent[0].sysReDTargetCap = updatedEvent[0].finalBattery
                        return this.setState({
                            loading: false,
                            editClicked: false,
                            event: updatedEvent[0],
                            date: updatedEvent[0].sysReDDate,
                            startTime: moment(updatedEvent[0].sysReDStartTime, "HH:mm").format("HH:mm"),
                            endTime: moment(updatedEvent[0].sysReDEndTime, "HH:mm").format("HH:mm"),
                            power: parseInt(updatedEvent[0].availablepower),
                            completed: updatedEvent[0].sysReDEventStatus === 0 ? false : updatedEvent[0].sysReDEventStatus === 1 ? false : true
                        });
                    });
            });
    };

    render() {
        const {
            completed,
            event,
            editClicked,
            chartData,
            loading,
            power,
            date,
            startTime,
            endTime
        } = this.state;

        const {isAuthenticated, user} = this.props.auth;

        let chartContent;

        if (Object.keys(chartData).length > 0) {
            chartContent = (
                <div
                    style={{
                        // padding: "3% 0",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Card style={{borderRadius: 8, width: "100%"}}>
                        <CardContent style={{width: "100%"}}>
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
                                time={chartData.Time}
                                charge={chartData.NetToGrid}
                                availablePower={chartData.AvailablePower}
                                netInGrid={chartData.NetToGrid}
                            />
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div
                style={{
                    paddingLeft: "8vw",
                    display: "flex",
                    backgroundColor: "#FBFBFB",
                    width: "90vw",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                {loading ? (
                    <Spinner/>
                ) : (
                    <div style={{width: "100%"}}>
                        <div
                            style={{
                                width: "100%",
                                padding: "3% 0",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "flex-start",
                                    alignItems: "center"
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    style={{
                                        whiteSpace: "nowrap",
                                        color: "#2E384D",
                                        fontSize: "2.3vw",
                                        paddingRight: "1.3vw",
                                        fontFamily: "Gotham Rounded Medium"
                                    }}
                                >
                                    {event.groupname}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{
                                        whiteSpace: "nowrap",
                                        color: "#828282",
                                        paddingTop: "0.9vw",
                                        fontSize: "1.2vw",
                                        fontFamily: "Gotham Rounded Light"
                                    }}
                                >
                                    {`#${event.sysReDId.split(/-/)[0]}`}
                                </Typography>
                            </div>
                            {user.includes("admin") ? (
                                completed ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "20%"
                                        }}
                                    >
                                        <Button
                                            onClick={() => this.onExportEvent(event)}
                                            variant="contained"
                                            style={{
                                                color: "#fff",
                                                backgroundColor: "#25A8A8",
                                                width: "7vw",
                                                height: "2.3vw",
                                                fontSize: "0.7vw",
                                                textTransform: "none",
                                                fontFamily: "Gotham Rounded Light"
                                            }}
                                        >
                                            Export
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "20%"
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                !editClicked
                                                    ? this.setState({editClicked: true})
                                                    : this.onEditEvent(event);
                                            }}
                                            variant="contained"
                                            style={{
                                                color: "#fff",
                                                backgroundColor: "#25A8A8",
                                                width: "7vw",
                                                height: "2.3vw",
                                                fontSize: "0.7vw",
                                                textTransform: "none",
                                                fontFamily: "Gotham Rounded Light"
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                this.setState({editClicked: false});
                                            }}
                                            variant="outlined"
                                            style={{
                                                color: "#25A8A8",
                                                width: "7vw",
                                                height: "2.3vw",
                                                fontSize: "0.7vw",
                                                textTransform: "none",
                                                fontFamily: "Gotham Rounded Light"
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )
                            ) : (
                                ""
                            )}
                        </div>
                        <div
                            style={{
                                paddingBottom: "3%",
                                width: "100%",
                                height: "12vw",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Card style={{width: "70%", height: "100%", padding: "1% 0"}}>
                                <CardContent style={{height: "100%"}}>
                                    <div style={{display: "flex", height: "100%"}}>
                                        <div
                                            style={{
                                                paddingRight: "5%",
                                                width: "50%",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    paddingBottom: "6%",
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "#2E384D",
                                                        fontFamily: "Gotham Rounded Medium",
                                                        paddingRight: "4vw",
                                                        fontSize: "1vw"
                                                    }}
                                                >
                                                    Date
                                                </Typography>
                                                {editClicked ? (
                                                    <TextField
                                                        name="date"
                                                        onChange={this.onChange}
                                                        value={date}
                                                    />
                                                ) : (
                                                    <Typography
                                                        style={{
                                                            color: "#828282",
                                                            fontFamily: "Gotham Rounded Medium",
                                                            fontSize: "1vw"
                                                        }}
                                                    >
                                                        {moment(event.sysReDDate).format("DD/MM/YYYY")}
                                                    </Typography>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "#2E384D",
                                                        fontFamily: "Gotham Rounded Medium",
                                                        paddingRight: "4vw",
                                                        fontSize: "1vw"
                                                    }}
                                                >
                                                    Time
                                                </Typography>
                                                {editClicked ? (
                                                    <div style={{display: "flex"}}>
                                                        <TextField
                                                            name="startTime"
                                                            type="time"
                                                            inputProps={{
                                                                step: '1800'
                                                            }}
                                                            onChange={this.onChange}
                                                            value={moment(startTime, "HH:mm").format(
                                                                "HH:mm"
                                                            )}
                                                        />
                                                        -
                                                        <TextField
                                                            name="endTime"
                                                            type="time"
                                                            inputProps={{
                                                                step: '1800'
                                                            }}
                                                            onChange={this.onChange}
                                                            value={moment(endTime, "HH:mm").format(
                                                                "HH:mm"
                                                            )}
                                                        />
                                                        {/*<MuiPickersUtilsProvider utils={MomentUtils}>*/}
                                                        {/*<TimePicker*/}
                                                        {/*  clearable*/}
                                                        {/*  ampm={false}*/}
                                                        {/*  //  label="24 hours"*/}
                                                        {/*  value={startTime}*/}
                                                        {/*  onChange={e=>this.onChange(e,"startTime")}*/}
                                                        {/*/>*/}
                                                        {/*<TimePicker*/}
                                                        {/*  clearable*/}
                                                        {/*  ampm={false}*/}
                                                        {/*  //  label="24 hours"*/}
                                                        {/*  value={endTime}*/}
                                                        {/*  onChange={e=>this.onChange(e,"endTime")}*/}
                                                        {/*/>*/}
                                                        {/*</MuiPickersUtilsProvider>*/}

                                                    </div>
                                                ) : (
                                                    <Typography
                                                        style={{
                                                            color: "#828282",
                                                            fontFamily: "Gotham Rounded Medium",
                                                            fontSize: "1vw"
                                                        }}
                                                    >
                                                        {`${moment(event.sysReDStartTime, "HH:mm").format(
                                                            "HH:mm"
                                                        )}-${moment(event.sysReDEndTime, "HH:mm").format(
                                                            "HH:mm"
                                                        )}`}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: "50%",
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    paddingBottom: "6%",
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "#2E384D",
                                                        fontFamily: "Gotham Rounded Medium",
                                                        paddingRight: "4vw",
                                                        fontSize: "1vw"
                                                    }}
                                                >
                                                    Power
                                                </Typography>
                                                {editClicked ? (
                                                    <TextField
                                                        name="power"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">kWh</InputAdornment>
                                                            )
                                                        }}
                                                        inputProps={{style: {textAlign: "right"}}}
                                                        value={power}
                                                        onChange={this.onChange}
                                                    />
                                                ) : (
                                                    <Typography
                                                        style={{
                                                            color: "#828282",
                                                            fontFamily: "Gotham Rounded Medium",
                                                            fontSize: "1vw"
                                                        }}
                                                    >
                                                        {`${Math.round(event.sysReDTargetCap * 100) / 100} kWh out of ${(event.sysReDEstGen / 1000).toString().split('.')[0]}.${(event.sysReDEstGen / 1000).toString().split('.')[1].substr(0,2)} kWh`}
                                                    </Typography>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "#2E384D",
                                                        fontFamily: "Gotham Rounded Medium",
                                                        paddingRight: "4vw",
                                                        fontSize: "1vw"
                                                    }}
                                                >
                                                    Status
                                                </Typography>
                                                {editClicked ? (
                                                    <Typography
                                                        style={{
                                                            fontSize: "1vw",
                                                            color: "#828282",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        {(event.sysReDEventStatus === 0 || event.sysReDEventStatus === 1)
                                                            ? "Scheduled"
                                                            : (event.sysReDEventStatus === 2 ? "Completed" : event.sysReDEventStatus === 4 ? 'No Available Power\n to discharge' : 'Completed and\n Sent Email to Customer')}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        style={{
                                                            color: "#828282",
                                                            fontFamily: "Gotham Rounded Medium",
                                                            fontSize: "1vw"
                                                        }}
                                                    >
                                                        {(event.sysReDEventStatus === 0 || event.sysReDEventStatus === 1)
                                                            ? "Scheduled"
                                                            : (event.sysReDEventStatus === 2 ? "Completed" : event.sysReDEventStatus === 4 ? 'No Available Power\n to discharge' : 'Completed and\n Sent Email to Customer')}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card style={{width: "25%", height: "100%"}}>
                                <CardContent>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingLeft: "5%"
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    fontSize: "4vw",
                                                    color: "#2E384D",
                                                    fontFamily: "Gotham Rounded Medium"
                                                }}
                                            >
                                                {event.sysReDEstGen ? `${(event.sysReDEstGen / 1000).toString().split('.')[0]}.${(event.sysReDEstGen / 1000).toString().split('.')[1].substr(0,2)}`: "N/A"}
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontSize: "1vw",
                                                    paddingTop: "2vw",
                                                    fontFamily: "Gotham Rounded Medium"
                                                }}
                                            >
                                                {event.sysReDEstGen ? "kWh" : ""}
                                            </Typography>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                                height: "100%",
                                                paddingLeft: "5%",
                                                paddingTop: "0"
                                            }}
                                        >

                                            {
                                                parseInt(event.sysReDEventStatus) == 1 ?
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            paddingLeft: "2%",
                                                            paddingTop: "0",
                                                            alignItems: "center",
                                                            width: "100%",
                                                            height: "100%"
                                                        }}
                                                    >
                                                        <Typography
                                                            style={{
                                                                paddingTop: "0",
                                                                fontSize: "1.0vw",
                                                                paddingLeft: "4px",
                                                                color: "black",
                                                                fontWeight: "500"
                                                            }}
                                                        >
                                                            Discharging in progress
                                                        </Typography>
                                                    </div> :
                                                    parseInt(event.sysReDCompVal) >= 0
                                                        ?
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                paddingLeft: "2%",
                                                                paddingTop: "0",
                                                                alignItems: "center",
                                                                width: "100%",
                                                                height: "100%"
                                                            }}
                                                        >
                                                            <CallMade
                                                                style={{
                                                                    minWidth: 19,
                                                                    maxWidth: 50,
                                                                    height: "auto",
                                                                    color: 'green'
                                                                }}
                                                            />
                                                            <Typography
                                                                style={{
                                                                    paddingTop: "0",
                                                                    fontSize: "1.3vw",
                                                                    paddingLeft: "4px",
                                                                    color: "green",
                                                                    fontWeight: "500"
                                                                }}
                                                            >
                                                                {`${parseInt(event.sysReDCompVal*100)}%`}
                                                            </Typography>
                                                        </div>
                                                        :
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                paddingLeft: "2%",
                                                                paddingTop: "0",
                                                                alignItems: "center",
                                                                width: "100%",
                                                                height: "100%"
                                                            }}
                                                        >
                                                            <CallReceived
                                                                style={{
                                                                    minWidth: 19,
                                                                    maxWidth: 50,
                                                                    height: "auto",
                                                                    color: 'red',
                                                                    transform: 'rotate(270deg)'
                                                                }}
                                                            />
                                                            <Typography
                                                                style={{
                                                                    paddingTop: "0",
                                                                    fontSize: "1.3vw",
                                                                    paddingLeft: "4px",
                                                                    color: "red",
                                                                    fontWeight: "500"
                                                                }}
                                                            >
                                                                {`${parseInt(event.sysReDCompVal*100)}%`}
                                                            </Typography>
                                                        </div>


                                            }

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {chartContent}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {}
)(EditEvent);

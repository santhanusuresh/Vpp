import React, { Component } from "react";
import {
    Typography,
    withStyles,
    Card,
    CardContent,
    Slider,
    Fab,
    Dialog,
    DialogContent,
    Button,
    DialogTitle,
    TextField,
    DialogActions,
} from "@material-ui/core";
import {
    Add
} from "@material-ui/icons";
import { connect } from "react-redux";
import Select from "react-select";
import "./reactSelectFix.css";
import Spinner from "../common/Spinner";
import moment from "moment";
import {
    MuiPickersUtilsProvider,
    DatePicker
} from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import MomentUtils from "@date-io/moment";
import store from "../../store/store";
import { LOGIN_ERROR } from "../../actions/types";
import { ThemeProvider } from "@material-ui/styles";
import { Base64 } from "js-base64";
import EventsTable from "./EventsTable"
import AddEvent from "../dialog/AddEvent"


const customStyles = {
    control: (base, state) => {
        // console.log('state', state);
        // console.log('base', base);
        return {
            ...base,
            // borderColor: state.isFocused?'red':'blue',
            "&:hover": {
                borderColor: state.isFocused ? "#00008b" : base.borderColor
            }
            // You can also use state.isFocused to conditionally style based on the focus state
        }
    },
    input: (base, state) => {

        // console.log('dropdownIndicator base', base);
        // console.log('dropdownIndicator state', state);
        return {
            ...base,
            // color:"blue"
            // "&:hover":{
            //   // border:'0.2rem solid green'
            // },
            // "&:visited":{
            //   border:'0.2rem solid black'
            // }

        }

    }
};

const muiTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: "#25A8A8"
                // backgroundColor: "red"
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
        },

        MuiInputBase: focus => {
            console.log('focus', focus);
            return {
                formControl: {
                    //   border:"0.1px solid green",
                    //   borderRadius:'4px',
                    //   // console.log('focus',focus);
                    //   "&$focused":{
                    //     border:'0.2rem solid red'
                    //   },
                    //   "&:active":{
                    //     border:'0.2rem solid orange'
                    //   }
                },
                focused: {}
            }

        },
        //  MuiPickersCalendarHeader: {
        //   switchHeader: {
        //     backgroundColor: 'red',
        //     color: "red",
        //   }
        // },
        datePicker: {
            selectColor: 'red',
            borderColor: 'red',
            backgroundColor: 'red'
        },
        palette: {
            backgroundColor: 'red'
        },
        MuiPickersModal: {
            dialogAction: {
                color: "red",
                selectColor: 'red',
                backgroundColor: 'red'
            }
        }
    }
});

class Events extends Component {
    state = {
        openAddEvent: false,
        filterLocation: null,
        filterDate: null,
        filterStartPower: 15,
        filterEndPower: 30,
        filterStatus: "",
        events: [],
        showEvents: [],
        power: 45,
        locations: [],
        location: null,
        date: null,
        from: "02:00",
        to: "04:00",
        status: null,
        loading: true,
        openPriceDialog: false,
        price: "",
        touchedPower: false,
        idPrice: "",
        namePrice: "",
        datePrice: "",
        startTimePrice: "",
        endTimePrice: "",
        hasCompletedPrice: "",
        createtime: "",
        isEmail: "",
        validationText: ""
    };

    componentDidMount() {
        const { isAuthenticated, user, userid, username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;
        console.log("isAuthenticated", isAuthenticated);
        Promise.all([
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/event/all/",
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
                let eventsRes, locationsRes;

                Promise.all([res[0], res[1]]).then(res => {
                    // console.log("reses", res);
                    return this.setState({
                        loading: false,
                        showEvents: res[0].data,
                        events: res[0].data,
                        locations: res[1].data
                    });
                });
            });
    }

    onChange = (e, name, filter) => {
        console.log("e", e);

        switch (name) {
            case "location":
                return this.setState({ location: e, power: e.maxPower }, () => {
                    if (filter) {
                        console.log("running callback");
                        this.onFilterEvents();
                    }
                });
            case "price":
                return this.setState({ price: e.target.value }, () => {
                    if (filter) {
                        console.log("running callback");
                        this.onFilterEvents();
                    }
                });

            default:
                return this.setState({ [name]: e }, () => {
                    if (filter) {
                        console.log("running callback");
                        this.onFilterEvents();
                    }
                });
        }
    };

    moneyClickHandler = (row) => {
        this.setState({
            idPrice: row.groupId,
            price:
                row.price === null
                    ? ""
                    : row.price,
            isEmail: row.isemail,
            openPriceDialog: true,
            namePrice: row.groupname,
            datePrice: row.date,
            startTimePrice: row.startTime,
            endTimePrice: row.endTime,
            hasCompletedPrice:
                row.eventstatus,
            createtime: row.createdTime,
        })
    }

    onClickSave = (eventData = [null]) => {
        const { username, userpassword:  password } = this.props.auth;
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
                    eventStatus: 0,
                })
            }
        ).then(res => res.text())
            .then(res => {
                if (JSON.parse(res).success !== 1) {
                    return store.dispatch({
                        type: LOGIN_ERROR,
                        payload: {
                            value:
                                "Cannot add this event. Please correct your details and try again!"
                        }
                    });
                }
                Promise.all([
                    fetch(
                        "https://vppspark.shinehub.com.au:8443/backend-service/event/all/",
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

    onClickSavePrice = (id, price, dateprice, createtime) => {
        const { isAuthenticated, user, userid, username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;
        const { power, location, date, from, to } = this.state;

        console.log("createtime", createtime);
        console.log("date", dateprice);
        console.log("price", price);
        fetch(
            "https://vppspark.shinehub.com.au:8443/backend-service/event/group/price/" + id,
            {
                method: "PATCH",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    createTime: createtime,
                    date: dateprice,
                    price: price,
                })
            }
        )
            .then(res => res.text())
            .then(res => {
                // console.log("save", res);
                Promise.all([
                    fetch(
                        "https://vppspark.shinehub.com.au:8443/backend-service/event/all/",
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
                        let eventsRes, locationsRes;

                        Promise.all([res[0], res[1]]).then(res => {
                            // console.log("reses", res);

                            return this.setState({
                                loading: false,
                                openPriceDialog: false,
                                showEvents: res[0].data,
                                events: res[0].data,
                                locations: res[1].data
                            });
                        });
                    });
            });
    };

    onClickSaveAndSendPrice = (id, price, dateprice, createtime) => {
        const { isAuthenticated, user, userid, username, userpassword } = this.props.auth;
        const password = userpassword;
        const userID = userid;
        const { power, location, date, from, to } = this.state;


        if (window.confirm("Are you sure? This cannot be undone!")) {
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/event/group/email/" + id,
                {
                    method: "PATCH",
                    mode: 'cors',
                    headers: {
                        "Authorization": "Basic " + Base64.encode(`${username}:${password}`),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        createTime: createtime,
                        date: dateprice,
                        price: price,
                        eventStatus:3
                    })
                }
            )
                .then(res => res.text())
                .then(res => {
                    // console.log("save", res);
                    Promise.all([
                        fetch(
                            "https://vppspark.shinehub.com.au:8443/backend-service/event/all/",
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
                            let eventsRes, locationsRes;
                            Promise.all([res[0], res[1]]).then(res => {
                                // console.log("reses", res);

                                return this.setState({
                                    loading: false,
                                    openPriceDialog: false,
                                    showEvents: res[0].data,
                                    events: res[0].data,
                                    locations: res[1].data
                                });
                            });
                        });
                });
        }

        return;
    };

    onClickEvent = event => {
        event.availablepower = event.power
        event.groupname = event.groupname
        event.sysReDCompVal = event.compval
        event.sysReDControlMode = ''
        event.sysReDCreatTime = event.createdTime
        event.sysReDDaily = ''
        event.sysReDDate = event.date
        event.sysReDEndCap = event.endCap
        event.sysReDEstGen = event.estgen
        event.sysReDEventStatus = event.eventstatus
        event.sysReDGroupID = event.groupId
        event.sysReDId = event.eventId
        event.sysReDIsComplete = event.isComplete
        event.sysReDIsEmail = event.isemail
        event.sysReDIsPrice = event.isprice
        event.sysReDIsStart = event.isStart
        event.sysReDIsValid = 1
        event.sysReDMode = ''
        event.sysReDNeedCharge = 0
        event.sysReDPower = event.power
        event.sysReDPrice = event.price
        event.sysReDSOC = 10
        event.sysReDStartCap = event.startBattery
        event.sysReDStartTime = event.startTime
        event.sysReDEndTime = event.endTime
        event.sysReDStatus = "1"
        event.sysReDTargetCap = event.finalBattery

        this.props.history.push({
            pathname: "/edit-event",
            state: {
                event
            }
        });
    };

    onFilterEvents = () => {
        const {
            filterLocation,
            filterDate,
            filterStartPower,
            filterEndPower,
            filterStatus,
            events,
            touchedPower
        } = this.state;
        // console.log("bahar hai");
        // console.log("filterLocation", filterLocation);
        // console.log("filterStatus", filterStatus);
        // console.log("filterDate", filterDate);
        // console.log("filterStartPower", filterStartPower);
        // console.log("filterEndPower", filterEndPower);
        // console.log('bahar hai');

        const newEvents = events.filter(event => {
            // console.log('andar hai')
            // console.log('event',event);
            // console.log('typeof sysPower',typeof event.sysReDPower);
            // console.log('sysPower',parseInt(event.sysReDPower)/1000);
            // console.log('filterStartPower',filterStartPower);
            // console.log('filterEndPower',filterEndPower);
            // console.log('filterStatus.value',filterStatus.value);
            // console.log('date',new Date(event.sysReDDate).getDate()===new Date(filterDate ).getDate())
            // console.log(
            //   "filterEvents",
            //   event.groupname === filterLocation.value ||
            //     new Date(event.sysReDDate).getDate() ===
            //       new Date(filterDate).getDate() ||
            //     (parseInt(event.sysReDPower) / 1000 >= filterStartPower ||
            //       parseInt(event.sysReDPower) / 1000 <= filterEndPower) ||
            //     event.sysReDIsComplete === filterStatus.value
            // );
            // console.log("1", event.groupname === filterLocation.value);
            // console.log(
            //   "2",
            //   new Date(event.sysReDDate).getDate() === new Date(filterDate).getDate()
            // );
            // console.log(
            //   "3",
            //   parseInt(event.sysReDPower) / 1000 >= filterStartPower ||
            //     parseInt(event.sysReDPower) / 1000 <= filterEndPower
            // );
            // console.log("4", event.sysReDIsComplete === filterStatus.value);

            // console.log('filterDate.value',new Date(filterDate));
            // console.log('event.sysReDDate',new Date(event.sysReDDate));
            // return (
            //   event.groupname === filterLocation.value ||
            //   new Date(event.sysReDDate).getDate() ===
            //     new Date(filterDate).getDate() ||
            //   (parseInt(event.sysReDPower) / 1000 >= filterStartPower ||
            //     parseInt(event.sysReDPower) / 1000 <= filterEndPower) ||
            //   event.sysReDIsComplete === filterStatus.value
            // );

            // if (filterLocation && event.groupname === filterLocation.value) {
            //   console.log("loc");
            //   if (
            //     filterDate &&
            //     new Date(event.sysReDDate).getDate() ===
            //       new Date(filterDate._d).getDate()
            //   ) {
            //     console.log("date");
            //     console.log(
            //       "date",
            //       filterDate._d &&
            //         new Date(event.sysReDDate).getDate() ===
            //           new Date(filterDate._d).getDate()
            //     );
            //     console.log("filterDate", filterDate._d);
            //     console.log(
            //       `${new Date(event.sysReDDate).getDate()} ===${new Date(
            //         filterDate._d
            //       ).getDate()}`,
            //       new Date(event.sysReDDate).getDate() ===
            //         new Date(filterDate._d).getDate()
            //     );

            //     if (
            //       filterStartPower &&
            //       parseInt(event.sysReDPower) / 1000 >= filterStartPower
            //     ) {
            //       console.log("power");
            //       if (
            //         filterEndPower &&
            //         parseInt(event.sysReDPower) / 1000 <= filterEndPower
            //       ) {
            //         console.log("end pow");
            //         if (
            //           filterStatus &&
            //           event.sysReDIsComplete === filterStatus.value
            //         ) {
            //           console.log("status");

            //           return (
            //             new Date(event.sysReDDate).getDate() ===
            //               new Date(filterDate._d).getDate() &&
            //             event.groupname === filterLocation.value &&
            //             filterStartPower &&
            //             parseInt(event.sysReDPower) / 1000 >= filterStartPower &&
            //             parseInt(event.sysReDPower) / 1000 <= filterEndPower &&
            //             event.sysReDIsComplete === filterStatus.value
            //           );
            //         }

            //         return (
            //           new Date(event.sysReDDate).getDate() ===
            //             new Date(filterDate._d).getDate() &&
            //           event.groupname === filterLocation.value &&
            //           filterStartPower &&
            //           parseInt(event.sysReDPower) / 1000 >= filterStartPower &&
            //           parseInt(event.sysReDPower) / 1000 <= filterEndPower
            //         );
            //       }

            //       return (
            //         new Date(event.sysReDDate).getDate() ===
            //           new Date(filterDate._d).getDate() &&
            //         event.groupname === filterLocation.value &&
            //         filterStartPower &&
            //         parseInt(event.sysReDPower) / 1000 >= filterStartPower
            //       );
            //     }

            //     return (
            //       new Date(event.sysReDDate).getDate() ===
            //         new Date(filterDate._d).getDate() &&
            //       event.groupname === filterLocation.value
            //     );
            //   }

            //   // console.log('event.groupname',event.groupname);
            //   // console.log('filterLocation.value',filterLocation.value);

            //   return event.groupname === filterLocation.value;
            // }
            // console.log("filterDate", new Date(event.sysReDDate).getDate());
            //Daniel changed 07/10
            // if(filterLocation){
            //   if(filterDate){
            //
            //     if(touchedPower){
            //       // console.log('powerTime',powerTime)
            //       console.log('event.sysReDPower',event.sysReDPower);
            //       console.log('filterStartPower',filterStartPower);
            //
            //       if(filterStatus){
            //         console.log('filterStatus',typeof filterStatus.value);
            //         console.log('sysReDIsComplete',typeof event.sysReDIsComplete);
            //         return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate() && filterStartPower<=(parseInt(event.sysReDPower)/1000) && filterEndPower>=(parseInt(event.sysReDPower)/1000) &&  filterStatus.value===event.sysReDIsComplete;
            //       }
            //
            //       return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate() && filterStartPower<=(parseInt(event.sysReDPower)/1000) && filterEndPower>=(parseInt(event.sysReDPower)/1000);
            //     }
            //
            //
            //     return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate()
            //
            //   }
            //   return event.groupname===filterLocation.value
            // }

            event.availablepower = event.power
            event.groupname = event.groupname
            event.sysReDCompVal = event.compval
            event.sysReDControlMode = ''
            event.sysReDCreatTime = event.createdTime
            event.sysReDDaily = ''
            event.sysReDDate = event.date
            event.sysReDEndCap = event.endCap
            event.sysReDEstGen = event.estgen
            event.sysReDEventStatus = event.eventstatus
            event.sysReDGroupID = event.groupId
            event.sysReDId = event.eventId
            event.sysReDIsComplete = event.isComplete
            event.sysReDIsEmail = event.isemail
            event.sysReDIsPrice = event.isprice
            event.sysReDIsStart = event.isStart
            event.sysReDIsValid = 1
            event.sysReDMode = ''
            event.sysReDNeedCharge = 0
            event.sysReDPower = event.power
            event.sysReDPrice = event.price
            event.sysReDSOC = 10
            event.sysReDStartCap = event.startBattery
            event.sysReDStartTime = event.startTime
            event.sysReDEndTime = event.endTime
            event.sysReDStatus = "1"
            event.sysReDTargetCap = event.finalBattery
            if (filterLocation) {
                if (filterDate) {
                    if (touchedPower) {
                        if (filterStatus) {
                            return (
                                filterLocation.value === event.groupname &&
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000 &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                filterLocation.value === event.groupname &&
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000
                            );
                        }
                    } else {
                        if (filterStatus) {
                            return (
                                filterLocation.value === event.groupname &&
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                filterLocation.value === event.groupname &&
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate()
                            );
                        }
                    }
                } else {
                    if (touchedPower) {
                        if (filterStatus) {
                            return (
                                filterLocation.value === event.groupname &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000 &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                filterLocation.value === event.groupname &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000
                            );
                        }
                    } else {
                        if (filterStatus) {
                            return (
                                filterLocation.value === event.groupname &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return filterLocation.value === event.groupname;
                        }
                    }
                }
            } else {
                if (filterDate) {
                    if (touchedPower) {
                        if (filterStatus) {
                            return (
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000 &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000
                            );
                        }
                    } else {
                        if (filterStatus) {
                            return (
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate() &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                new Date(filterDate._d).getDate() ===
                                new Date(event.sysReDDate).getDate()
                            );
                        }
                    }
                } else {
                    if (touchedPower) {
                        if (filterStatus) {
                            return (
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000 &&
                                filterStatus.value === event.sysReDIsComplete
                            );
                        } else {
                            return (
                                filterStartPower <= parseInt(event.sysReDPower) / 1000 &&
                                filterEndPower >= parseInt(event.sysReDPower) / 1000
                            );
                        }
                    } else {
                        if (filterStatus) {
                            return filterStatus.value === event.sysReDIsComplete;
                        } else {
                            // console.log("no");
                            return null;
                        }
                    }
                }
            }
        });
        // console.log("newEvents", newEvents);
        this.setState({ showEvents: newEvents });
    };

    onClickPriceDialog = (e, name, date, startTime, endTime, hasCompleted) => {
        const { price, openPriceDialog } = this.state;

        return;
    };

    render() {
        const { classes } = this.props;
        const {
            validationText,
            filterLocation,
            filterDate,
            filterStatus,
            openAddEvent,
            loading,
            filterStartPower,
            filterEndPower,
            locations,
            showEvents,
            namePrice,
            datePrice,
            startTimePrice,
            endTimePrice,
            hasCompletedPrice,
            createtime,
            openPriceDialog,
            price,
            isEmail,
            idPrice
        } = this.state;

        const { isAuthenticated, user, error } = this.props.auth;

        const addEventProps = {
            openAddEvent,
            locations,
            validationText,
            error,
            onClickSave: ((...eventData) => this.onClickSave(eventData)) ,
            customStyles,
            classes,
            closeAddEvent: (() => this.setState({ openAddEvent: false }))
        }

        return (
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#FBFBFB",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: loading ? "center" : "flex-start",
                    padding: "5vw 0 0 5vw"
                }}
            >
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Spinner />
                    </div>
                ) : (
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-around",
                                alignItems: "center",
                                flexDirection: "column"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    width: "100%"
                                }}
                            >
                                <Dialog
                                    fullWidth
                                    open={openPriceDialog}
                                    onClose={() => this.setState({ openPriceDialog: false })}
                                >
                                    <DialogTitle
                                        style={{
                                            whiteSpace: "nowrap",
                                            color: "#25A8A8",
                                            cursor: "pointer",
                                            fontSize: "1.2vw",
                                            fontFamily: "Gotham Rounded Medium"
                                        }}
                                    >
                                        AEMO spot price
                                    </DialogTitle>
                                    <DialogContent>
                                        <div
                                            style={{
                                                color: "#BDBDBD",
                                                fontFamily: "Gotham Rounded Medium",
                                                padding: 0,
                                                margin: 0,
                                                fontSize: "1vw"
                                            }}
                                        >{`Please enter the AEMO spot price for the completed event on ${moment(
                                            datePrice
                                        ).format("DD/MM/YYYY")} from ${moment(
                                            startTimePrice,
                                            "HH:mm"
                                        ).format("HH:mm")} to ${moment(
                                            endTimePrice,
                                            "HH:mm"
                                        ).format("HH:mm")} in ${namePrice}`}</div>
                                        <div style={{ width: "15vw", height: "1vw" }}></div>
                                        <TextField
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">$</InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">/MWh</InputAdornment>
                                                )
                                            }}
                                            inputProps={{ style: { textAlign: "right" } }}
                                            disabled={isEmail === 0 ? false : true}
                                            placeholder="Enter your price"
                                            value={price === 0 ? '' : price}
                                            name="price"
                                            onChange={e => this.onChange(e, "price", false)}
                                        />
                                        {hasCompletedPrice !== 3 ? (
                                            <DialogActions>
                                                <div style={{ width: "15vw", height: "5vw" }}></div>
                                                <Button
                                                    style={{
                                                        color: "#fff",
                                                        textTransform: "none",
                                                        backgroundColor: "#25A8A8",
                                                        width: "30%"
                                                    }}
                                                    disabled={isEmail === 0 ? false : true}
                                                    onClick={() => this.onClickSavePrice(idPrice, price, datePrice, createtime)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        this.onClickSaveAndSendPrice(idPrice, price, datePrice, createtime)
                                                    }
                                                    style={{
                                                        color: "#fff",
                                                        textTransform: "none",
                                                        backgroundColor: "#25A8A8",
                                                        width: "30%"
                                                    }}
                                                    disabled={isEmail === 0 ? false : true}
                                                >
                                                    Save &#38; Email
                                                </Button>
                                            </DialogActions>
                                        ) : (
                                                <div style={{ width: "15vw", height: "2vw" }}></div>
                                            )}
                                    </DialogContent>
                                </Dialog>
                                <EventsTable showEvents={showEvents}
                                    moneyClickHandler={(row, e) => this.moneyClickHandler(row)}
                                    eventClickHandler={(row, e) => this.onClickEvent(row)} />
                                <div style={{ width: "15vw", height: "27vw" }}>
                                    <Card style={{ width: "100%", height: "100%" }}>
                                        <CardContent
                                            style={{
                                                display: "flex",
                                                height: "100%",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div style={{ width: "88%", height: "100%" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        height: "100%",
                                                        flexDirection: "column",
                                                        justifyContent: "space-evenly",
                                                        alignItems: "flex-start"
                                                    }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#25A8A8",
                                                            fontFamily: "Gotham Rounded Light",
                                                            letterSpacing: "1.2133px",
                                                            paddingBottom: "3%",
                                                            fontSize: "1vw",
                                                            textTransform: "uppercase"
                                                        }}
                                                    >
                                                        Filter
                                                </Typography>
                                                    <Typography
                                                        style={{
                                                            width: "30%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        Location
                                                </Typography>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                            //  padding: "3% 0 8% 0"
                                                        }}
                                                    >
                                                        <Select
                                                            value={filterLocation}
                                                            styles={customStyles}
                                                            onChange={e => {
                                                                // console.log("e", e);

                                                                this.onChange(e, "filterLocation", true);
                                                            }}
                                                            options={
                                                                locations
                                                                    ? locations.map(location => {
                                                                        console.log(location)
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
                                                    <Typography
                                                        style={{
                                                            width: "30%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        Date
                                                </Typography>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        <ThemeProvider theme={muiTheme}>
                                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                                <DatePicker
                                                                    // TextFieldComponent={<OutlinedInput style={{backgroundColor:'red'}}/>}
                                                                    InputProps={{
                                                                        classes: {
                                                                            // root:classes.datePickerInput
                                                                        }
                                                                    }}
                                                                    // classes={{
                                                                    //   input:classes.input
                                                                    // }}

                                                                    disableToolbar
                                                                    style={{
                                                                        padding: 0,
                                                                        fontFamily: "Gotham Rounded Medium"
                                                                    }}
                                                                    inputVariant="outlined"
                                                                    // minDate={new Date()}
                                                                    // minDateMessage="Date should not be in the past!"
                                                                    format="DD/MM/YY"
                                                                    placeholder="Date"
                                                                    // className="MuiOutlinedInput-input"
                                                                    onChange={e =>
                                                                        this.onChange(e, "filterDate", true)
                                                                    }
                                                                    value={filterDate}
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                        </ThemeProvider>
                                                        {/* <Select
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: styles => ({ ...styles, zIndex: 4 })
                          }}
                          value={filterDate}
                          onChange={e => {this.onChange(e, "filterDate",true)}}
                          options={[
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
                        /> */}
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            paddingBottom: "4%"
                                                        }}
                                                    >
                                                        <Typography
                                                            style={{
                                                                width: "30%",
                                                                paddingRight: "3%",
                                                                color: "#BDBDBD",
                                                                letterSpacing: "1.5px",
                                                                fontFamily: "Gotham Rounded Medium"
                                                            }}
                                                        >
                                                            Power
                                                    </Typography>
                                                        <Typography
                                                            style={{
                                                                whiteSpace: "nowrap",
                                                                color: "#828282",
                                                                fontFamily: "Gotham Rounded Medium",
                                                                fontSize: "1vw"
                                                            }}
                                                        >
                                                            {`${filterStartPower}-${filterEndPower} kWh`}
                                                        </Typography>
                                                    </div>
                                                    <Slider
                                                        classes={{
                                                            thumb: classes.thumb,
                                                            track: classes.track
                                                        }}
                                                        value={[filterStartPower, filterEndPower]}
                                                        onChange={(e, value) => {
                                                            //  console.log(typeof value[0]);
                                                            //  console.log(typeof value[1]);
                                                            this.setState(
                                                                {
                                                                    touchedPower: true,
                                                                    filterStartPower: value[0],
                                                                    filterEndPower: value[1]
                                                                },
                                                                () => {
                                                                    return this.onFilterEvents();
                                                                }
                                                            );
                                                        }}
                                                        valueLabelDisplay="auto"
                                                        aria-labelledby="range-slider"
                                                    // getAriaValueText={value => {
                                                    //   return `${value}`;
                                                    // }}
                                                    />
                                                    <Typography
                                                        style={{
                                                            width: "30%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        Status
                                                </Typography>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            padding: "3% 0 8% 0",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        <Select
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                menuPortal: styles => ({
                                                                    ...styles,
                                                                    zIndex: 0,
                                                                    paddingRight: "3%",
                                                                    color: "#BDBDBD",
                                                                    letterSpacing: "1.5px",
                                                                    fontFamily: "Gotham Rounded Medium"
                                                                })
                                                            }, customStyles}
                                                            options={[
                                                                { value: false, label: "Scheduled" },
                                                                { value: true, label: "Completed" }
                                                            ]}
                                                            value={filterStatus}
                                                            onChange={e => {
                                                                this.setState({ filterStatus: e }, () => {
                                                                    return this.onFilterEvents();
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {user.includes("admin") ? (
                                <div
                                    style={{
                                        position: "fixed",
                                        display: "flex",
                                        alignSelf: "flex-end",
                                        padding: "0 2vw",
                                        bottom: "3%",
                                        right: "3%"
                                    }}
                                >
                                    <Fab
                                        style={{
                                            // position: "absolute",
                                            // bottom: "3%",
                                            // right: "3%",
                                            backgroundColor: "#25A8A8"
                                        }}
                                        onClick={() => this.setState({ openAddEvent: true })}
                                    >
                                        <Add style={{ color: "#fff" }} />
                                    </Fab>
                                </div>
                            ) : (
                                    ""
                                )}
                        </div>
                    )}
                <AddEvent  { ...addEventProps } />
            </div>
        );
    }
}

const styles = {
    datePickerInput: {
        // border:'0.2rem solid red',
        // "&:visited":{
        //   border:"0.2rem solid blue"
        // },
        // "&:focus":{
        //   border:"0.2rem solid green"
        // }
    },
    root: {
        borderRadius: 20,
        marginBottom: "30px",
        display: "inline-block",
        backgroundColor: "orange"
    },
    thumb: {
        backgroundColor: "white",
        borderStyle: "solid",
        borderColor: "#25A8A8",
        borderWidth: "3px"
    },
    track: {
        height: "3px",
        backgroundColor: "#25A8A8"
    },
    dialogContainer: {
        width: "55vw"
    }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default withStyles(styles)(connect(mapStateToProps)(Events));

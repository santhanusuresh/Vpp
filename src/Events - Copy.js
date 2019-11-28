import React, { Component } from "react";
import {
  Typography,
  Table,
  withStyles,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  MuiThemeProvider
} from "@material-ui/core";
import { Add, Money, MoneyOff, AttachMoney, AttachMoneyOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import Select from "react-select";
import SelectPlus from "react-select";
import "./reactSelectFix.css";
import Spinner from "../common/Spinner";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker
} from "@material-ui/pickers";
import {createMuiTheme} from '@material-ui/core';
import MomentUtils from "@date-io/moment";
import store from "../../store/store";
import { LOGIN_ERROR } from "../../actions/types";
import { ThemeProvider } from "@material-ui/styles";
const md5 = require("md5");

const muiTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#25A8A8',
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: "white",
      },
    },
    MuiPickersDay: {
      day: {
        color: '#25A8A8',
      },
      daySelected: {
        backgroundColor: '#25A8A8',
      },
      dayDisabled: {
        color: '#25A8A8',
      },
      current: {
        color: '#25A8A8',
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color:'#25A8A8',
      },
    },
  },
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
    from: null,

    to: null,
    status: null,
    loading: true,
    openPriceDialog:false,
    price:'',
    touchedPower:false,
    idPrice:'',
    namePrice:'',
    datePrice:'',
    startTimePrice:'',
    endTimePrice:'',
    hasCompletedPrice:'',
    isEmail:'',
    validationText:''
  };


  

  componentDidMount() {
    const { isAuthenticated, user } = this.props.auth;
    // console.log("user", user);
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
        "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupList.php",
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
      )
    ])
      .then(res => res.map(value => value.json()))
      .then(res => {
        let eventsRes, locationsRes;
        Promise.all([res[0], res[1]]).then(res => {
          // console.log("reses", res);
          return this.setState({
            loading: false,
            showEvents: res[0].d,
            events: res[0].d,
            locations: res[1].d
          });
        });
      });
  } 

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
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
        return this.setState({ price:e.target.value }, () => {
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

  onClickSave = () => {
    const { isAuthenticated, user } = this.props.auth;
    const { power, location, date, from, to } = this.state;
   

    if (location === null) {
      
      return this.setState({validationText:'Please enter all details'});
    }

    if (date === null) {
      
      return this.setState({validationText:'Please enter all details'});
    }

    if (from === null) {
      return this.setState({validationText:'Please enter all details'});
    }

    if (to === null) {
      
      return this.setState({validationText:'Please enter all details'});
    }

    console.log("typeof from", typeof parseInt(location.id));
    console.log("typeof from", typeof parseInt(from));
    console.log(" from", from);
    console.log("typeof to", typeof parseInt(to));
    console.log("typeof date", typeof date);
    console.log("date", date);
    console.log("typeof date", typeof power);

    fetch(
      "https://monitoring.shinehub.com.au/handler/web/Group/handleAddRelationDispatch.php",
      {
        method: "POST",
        body: JSON.stringify({
          d: JSON.stringify({
            cvs: {
              a: parseInt(location.id),
              st: moment(from,"HH:mm:ss").format("HH:mm"),
              et: moment(to,"HH:mm:ss").format("HH:mm"),
              d: moment(date._d).format("YYYY-MM-DD"),
              p: power,
              i: 0
            }
          })
        })
      }
    )
      .then(res => res.text())
      .then(res => {
        console.log("save", res);

        if(JSON.parse(res).r===2){

          return store.dispatch({
            type:LOGIN_ERROR,
            payload:{
              value:'Cannot add this event. Please correct your details and try again!'
            }
          })


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
            "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupList.php",
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
            )
          ])
          .then(res => res.map(value => value.json()))
          .then(res => {
            let eventsRes, locationsRes;
            Promise.all([res[0], res[1]]).then(res => {
              console.log("reses", res);
              return this.setState({
                loading: false,
                openAddEvent: false,
                showEvents: res[0].d,
                events: res[0].d,
                locations: res[1].d
              });
            });
          });
        });
      };
      
      onClickSavePrice=(id,price)=>{

        const { isAuthenticated, user } = this.props.auth;
    const { power, location, date, from, to } = this.state;

        fetch('https://monitoring.shinehub.com.au/handler/web/Group/handleEditGroupDischargePrice.php',{
          method:"POST",
          body:JSON.stringify({
            d:JSON.stringify({
              cvs:{
                a:id,
                p:price
              }
            })
          })
        })
        .then(res=>res.text())
        .then(res => {
          console.log("save", res);
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
              "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupList.php",
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
              )
            ])
            .then(res => res.map(value => value.json()))
            .then(res => {
              let eventsRes, locationsRes;
              Promise.all([res[0], res[1]]).then(res => {
                console.log("reses", res);
                return this.setState({
                  loading: false,
                  openPriceDialog: false,
                  showEvents: res[0].d,
                  events: res[0].d,
                  locations: res[1].d
                });
              });
            });
          });
    
    
    
      }
      
      onClickSaveAndSendPrice=(id,price)=>{

        const { isAuthenticated, user } = this.props.auth;
    const { power, location, date, from, to } = this.state;

    if(window.confirm('Are you sure? This cannot be undone!')){
   

        fetch('https://monitoring.shinehub.com.au/handler/web/Group/handleEditPriceSendEmail.php',{
          method:"POST",
          body:JSON.stringify({
            d:JSON.stringify({
              cvs:{
                a:id,
                p:price
              }
            })
          })
        })
        .then(res=>res.text())
        .then(res => {
          console.log("save", res);
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
              "https://monitoring.shinehub.com.au/handler/web/Group/handleQueryGroupList.php",
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
              )
            ])
            .then(res => res.map(value => value.json()))
            .then(res => {
              let eventsRes, locationsRes;
              Promise.all([res[0], res[1]]).then(res => {
                console.log("reses", res);
                return this.setState({
                  loading: false,
                  openPriceDialog: false,
                  showEvents: res[0].d,
                  events: res[0].d,
                  locations: res[1].d
                });
              });
            });
          });
        }

    return;
    
      }


  onClickEvent = event => {
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
      console.log('filterDate',new Date(event.sysReDDate).getDate());
      if(filterLocation){
        if(filterDate){

          if(touchedPower){
            // console.log('powerTime',powerTime)
            console.log('event.sysReDPower',event.sysReDPower);
            console.log('filterStartPower',filterStartPower);

            if(filterStatus){
              console.log('filterStatus',typeof filterStatus.value);
              console.log('sysReDIsComplete',typeof event.sysReDIsComplete);
              return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate() && filterStartPower<=(parseInt(event.sysReDPower)/1000) && filterEndPower>=(parseInt(event.sysReDPower)/1000) &&  filterStatus.value===event.sysReDIsComplete;
            }

            return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate() && filterStartPower<=(parseInt(event.sysReDPower)/1000) && filterEndPower>=(parseInt(event.sysReDPower)/1000);
          }


          return filterLocation.value===event.groupname && new Date(filterDate._d).getDate()===new Date(event.sysReDDate).getDate()

        }
        return event.groupname===filterLocation.value
      }
    });
    console.log("newEvents", newEvents);
    this.setState({ showEvents: newEvents.length === 0 ? events : newEvents });
  };

  onClickPriceDialog=(e,name,date,startTime,endTime,hasCompleted)=>{

    const {price,openPriceDialog}=this.state;


    return 
  }


  render() {
    const { classes } = this.props;
    const {
      status,
      validationText,
      filterLocation,
      filterDate,
      filterStatus,
      openAddEvent,
      events,
      power,
      location,
      loading,
      date,
      editClicked,
      from,
      to,
      filterStartPower,
      filterEndPower,
      locations,
      showEvents,
      namePrice,
      datePrice,
      startTimePrice,
      endTimePrice,
      hasCompletedPrice,
      openPriceDialog,
      price,
      isEmail,
      idPrice
    } = this.state;

    const { isAuthenticated, user,error } = this.props.auth;

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
              <div
                style={{
                  display: "flex",
                  width: "65vw",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
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
                      fontSize: "2.2vw",
                      paddingRight: "20px",
                      fontWeight: "bolder",
                      fontFamily: "Gotham Rounded Bold"
                    }}
                  >
                    Events
                  </Typography>
                  <Typography
                    style={{
                      color: "#BDBDBD",
                      fontFamily: "Gotham Rounded Bold",
                      paddingTop: "1%",
                      fontSize: "1.3vw"
                    }}
                  >{`${Array.isArray(showEvents)?showEvents.length:''} ${
                    Array.isArray(showEvents)?(showEvents.length === 1 ? "result" : "results"):''
                  }`}</Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <Table>
                    <TableHead style={{ backgroundColor: "#FBFBFB" }}>
                      <TableCell
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "Gotham Rounded Bold",
                          fontSize: "1.3vw"
                        }}
                      >
                        Location
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "Gotham Rounded Bold",
                          fontSize: "1.3vw"
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "Gotham Rounded Bold",
                          fontSize: "1.3vw"
                        }}
                      >
                        Time
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "Gotham Rounded Bold",
                          fontSize: "1.3vw"
                        }}
                      >
                        Power
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "Gotham Rounded Bold",
                          fontSize: "1.3vw"
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(showEvents)?showEvents.map(row => {
                        return (
                          <TableRow
                            style={{
                              backgroundColor: "#fff",
                              border: "15px solid #FBFBFB"
                            }}
                          >
                            <TableCell style={{ whiteSpace: "nowrap" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "flex-end"
                                }}
                              >
                                <Typography
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    fontFamily: "Gotham Rounded Medium",
                                    color: "#2E384D",
                                    fontSize: "1.2vw"
                                  }}
                                >
                                  {row.groupname}
                                </Typography>
                                <Typography
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    color: "#BDBDBD",
                                    fontFamily: "Gotham Rounded Light",
                                    fontSize: "1.2vw"
                                  }}
                                >{`#${row.sysReDId}`}</Typography>
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                whiteSpace: "nowrap",
                                fontFamily: "Gotham Rounded Light",
                                color: "#2E384D",
                                fontSize: "1.2vw"
                              }}
                            >
                              {moment(row.sysReDDate).format("DD / MM / YY")}
                            </TableCell>
                            <TableCell
                              style={{
                                whiteSpace: "nowrap",
                                fontFamily: "Gotham Rounded Light",
                                color: "#2E384D",
                                fontSize: "1.2vw"
                              }}
                            >
                              {`${moment(row.sysReDStartTime, "HH:mm").format(
                                "HH:mm"
                              )} - ${moment(row.sysReDEndTime, "HH:mm").format(
                                "HH:mm"
                              )}`}
                            </TableCell>
                            <TableCell
                              style={{
                                whiteSpace: "nowrap",
                                fontFamily: "Gotham Rounded Light",
                                color: "#2E384D",
                                fontSize: "1.2vw"
                              }}
                            >
                              {`${row.sysReDPower / 1000}kW`}
                            </TableCell>
                            <TableCell
                              style={{
                                whiteSpace: "nowrap",
                                fontFamily: "Gotham Rounded Light",
                                color: "#2E384D",
                                fontSize: "1.2vw"
                              }}
                            >
                              <div style={(row.sysReDEventStatus==='0' || row.sysReDEventStatus==='1' || row.sysReDEventStatus==='4')?{backgroundColor:'#fff',border:'solid',borderColor:'rgb(124, 124, 124)',borderWidth:4,borderRadius:40,width:'1vw',height:'1vw'}:{backgroundColor:'green',borderRadius:40,width:'1vw',height:'1vw'}}>&nbsp;</div>
                            </TableCell>
                            <TableCell
                              style={{
                                // whiteSpace: "nowrap",
                                fontFamily: "Gotham Rounded Light",
                                color: "#2E384D",
                                fontSize: "1.2vw"
                              }}
                            >
                              {(row.sysReDEventStatus === "0" || row.sysReDEventStatus === "1")
                                ? "Scheduled"
                                : (row.sysReDEventStatus==='2'?"Completed":row.sysReDEventStatus==='4'?'No Available Power\n to discharge':'Completed and\n Sent Email to Customer')}
                            </TableCell>
                            <TableCell
                              // onClick={() => this.onClickEvent(row)}
                              style={{
                                whiteSpace: "nowrap",
                                color: "#25A8A8",
                                cursor: "pointer",
                                fontSize: "1.2vw",
                                fontFamily: "Gotham Rounded Medium"
                              }}
                            >
                              {(row.sysReDEventStatus==='0' || row.sysReDEventStatus==='1' || row.sysReDEventStatus==='4')?<MoneyOff/>:<AttachMoneyOutlined onClick={(e)=>this.setState({idPrice:row.sysReDId,price:row.sysReDPrice===null?'':row.sysReDPrice,isEmail:row.sysReDIsEmail,openPriceDialog:true,namePrice:row.groupname,datePrice:row.sysReDDate,startTimePrice:row.sysReDStartTime,endTimePrice:row.sysReDEndTime,hasCompletedPrice:row.sysReDEventStatus})}/>}
                            </TableCell>
                            <TableCell
                              onClick={() => this.onClickEvent(row)}
                              style={{
                                whiteSpace: "nowrap",
                                color: "#25A8A8",
                                cursor: "pointer",
                                fontSize: "1.2vw",
                                fontFamily: "Gotham Rounded Medium"
                              }}
                            >
                              {row.sysReDEventStatus === "0" ? "Edit" : "View"}
                            </TableCell>
                          </TableRow>
                        );
                      }):''}
                    </TableBody>
                  </Table>
                </div>
                <Dialog fullWidth open={openPriceDialog} onClose={()=>this.setState({openPriceDialog:false})}>
                  <DialogTitle>
                    Set your price right!
                  </DialogTitle>
                  <DialogContent>
                  <div>{`Please enter the AEMO spot price for the completed event on ${moment(datePrice).format('DD/MM/YYYY')} from ${moment(startTimePrice,'HH:mm').format('HH:mm')} to ${moment(endTimePrice,'HH:mm').format('HH:mm')} in ${namePrice}`}</div>
                  <TextField disabled={isEmail==='0'?false:true} placeholder="Enter your price" value={price} name="price" onChange={(e)=>this.onChange(e,"price",false)}/>
                  {hasCompletedPrice!=='3'?<DialogActions>
                    <Button style={isEmail==='0'?{backgroundColor:'#fff',color:'#83C4C4'}:{backgroundColor:'#FBFBFB',color:'grey'}} disabled={isEmail==='0'?false:true} onClick={()=>this.onClickSavePrice(idPrice,price)}>Save</Button>
                    <Button onClick={()=>this.onClickSaveAndSendPrice(idPrice,price)} style={isEmail==='0'?{backgroundColor:'#fff',color:'#83C4C4'}:{backgroundColor:'#FBFBFB',color:'grey'}} disabled={isEmail==='0'?false:true}>Save &#38; Send</Button>
                  </DialogActions>:''}
                  </DialogContent>
                </Dialog>
              </div>
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
                            color: "#83C4C4",
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
                            color: "#333",
                            fontFamily: "Gotham Rounded Medium",
                            padding: 0,
                            margin: 0,
                            fontSize: "1vw"
                          }}
                        >
                          Location
                        </Typography>
                        <div
                          style={{
                            width: "100%"
                            //  padding: "3% 0 8% 0"
                          }}
                        >
                          <Select
                            value={filterLocation}
                            onChange={e => {
                              // console.log("e", e);

                              this.onChange(e, "filterLocation", true);
                            }}
                            options={locations?locations.map(location => {
                              return {
                                value: location.DisGroupName,
                                label: location.DisGroupName,
                                id: location.DisGroupID
                              };
                            }):[]}
                          />
                        </div>
                        <Typography
                          style={{
                            color: "#333",
                            fontFamily: "Gotham Rounded Medium",
                            padding: 0,
                            margin: 0,
                            fontSize: "1vw"
                          }}
                        >
                          Date
                        </Typography>
                        <div style={{ width: "100%" }}>
                        <ThemeProvider theme={muiTheme}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              style={{ padding: 0,fontFamily:'Gotham Rounded Medium' }}
                              inputVariant="outlined"
                              // minDate={new Date()}
                              // minDateMessage="Date should not be in the past!"
                              format="DD/MM/YY"
                              placeholder="Enter your date"
                              className="MuiOutlinedInput-input"
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
                              color: "#333",
                              fontFamily: "Gotham Rounded Medium",
                              padding: 0,
                              fontSize: "1vw",
                              margin: 0
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
                                touchedPower:true,
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
                            color: "#333",
                            fontFamily: "Gotham Rounded Medium",
                            padding: 0,
                            margin: 0,
                            fontSize: "1vw"
                          }}
                        >
                          Status
                        </Typography>
                        <div style={{ width: "100%", padding: "3% 0 8% 0" }}>
                          <Select
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: styles => ({ ...styles, zIndex: 0 })
                            }}
                            options={[
                              { value: "0", label: "Scheduled" },
                              { value: "1", label: "Completed" }
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
        <Dialog
          fullWidth
          style={{ zIndex: 0 }}
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
                alignItems: "center"
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
                <Typography style={{ color: "#25A8A8",fontFamily:'Gotham Rounded Light' }}>
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
                  <Typography style={{color:'#333',fontFamily:'Gotham Rounded Medium'}}>Location</Typography>
                  <div style={{ width: "70%" }}>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: styles => ({ ...styles, zIndex: 4 })
                      }}
                      onChange={e => this.onChange(e, "location", false)}
                      options={locations?locations.map(location => {
                        // console.log("location", location.DisGroupName);
                        return {
                          value: location.DisGroupName,
                          label: location.DisGroupName,
                          id: location.DisGroupID,
                          maxPower: location.MaxPower
                        };
                      }):[]}
                      value={location}
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
                  <Typography style={{color:'#333',fontFamily:'Gotham Rounded Medium'}}>Date</Typography>
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        style={{ padding: 0,color:'#000',fontFamily:'Gotham Rounded Medium' }}
                        inputVariant="outlined"
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
                    alignItems:'center',
                    justifyContent: "space-between"
                  }}
                >
                  <Typography style={{color:'#333',fontFamily:'Gotham Rounded Medium'}}>Time</Typography>
                  <div style={{ display: "flex", width: "70%",alignItems:'center' }}>
                    <div style={{ width: "40%" }}>
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
                         variant="outlined"
                         value={from}
                         style={{fontFamily:'Gotham Rounded Medium'}}
                         placeholder={"Enter as 22:15"}
                         onChange={(e)=>this.setState({from:e.target.value})}
                         />
                    </div>
                    <Typography style={{ width: "20%", textAlign: "center",color:'#333',fontFamily:'Gotham Rounded Medium' }}>
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
                      <TextField 
                         variant="outlined"
                         value={to}
                         style={{fontFamily:'Gotham Rounded Medium'}}
                         placeholder={"Enter as 22:15"}
                         onChange={(e)=>this.setState({to:e.target.value})}
                         />
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
                  <Typography style={{color:'#333',fontFamily:'Gotham Rounded Medium'}}>Power</Typography>
                  <Typography style={{color:'#333',fontFamily:'Gotham Rounded Medium'}}>{`${power} kW`}</Typography>
                </div>
                <Slider
                  value={power}
                  aria-label="custom thumb label"
                  max={location ? location.maxPower : 100}
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
                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    {validationText?<Typography style={{color:'red'}}>{validationText}</Typography>:null}
                    {error?<Typography style={{color:'red'}}>{error.value}</Typography>:null}
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

/*
    {[
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Scheduled'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Completed'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Completed'},
                    {location:'New South Wales-Sydney #1210',date:'01/08/19',time:'3-6pm',power:'74 kW',status:'Completed'}
                ].map(row=>{
            
*/

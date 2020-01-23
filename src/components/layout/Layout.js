import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import { getSessionUser, logout } from "../../actions/authActions";
import {
  withStyles,
  Divider,
  Button,
  TextField
} from "@material-ui/core";
import "react-circular-progressbar/dist/styles.css";
import logo from "../../assets/shinehub-logo.svg";
import greyAvatar from "../../assets/avatar-icon.png";
import bell from "../../assets/Shape.svg";
import analytics from "../../assets/icon-analytics.svg";
import fourRectangles from "../../assets/four-rectangles.svg";
import calendar from "../../assets/Calendar.svg";
import cogWheel from "../../assets/cog-wheel.svg";
import menuIcon from "../../assets/menu-icon.svg";
import stockMarketArrowDown from "../../assets/stock-market-arrow.svg";
import stockMarketArrowUp from "../../assets/stock-market-arrow-up.svg";
import { withRouter } from "react-router-dom";
import { SESSION_USER } from "../../actions/types";
import store from "../../store/store";
import { Base64 } from "js-base64";
import Can from "../common/Can"

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    backgroundColor: "#FBFBFB"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  drawerRight: {
    width: drawerWidth + 100
  },
  drawerZIndex: {
    zIndex: 0
  }
}));

const Layout = props => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState({
    open: false,
    openRight: false,
    profile: "profile",
    editProfile: false,
    navbarHidden: false
  });
  let userID = '';
  const [sessionUser, setSessionUser] = React.useState({});
  const [profileDetails, setProfileDetails] = useState({
    email: "",
    phone: ""
  });
  function handleDrawerOpen(side, profile) {
    setState({
      ...state,
      [side]: true,
      profile
    });
  }

  const onProfileSave = () => {
    const { email, phone } = profileDetails;
    const {isAuthenticated,user, userid,username,userpassword} = props.auth;
    const password = userpassword;
    const userID = userid;
    // const username = 'saraswata';
    // const password = '#abcd123';
    // const userID = 'c4fb633e19ec8d3948e1951d62f5f067';
    console.log("isAuthenticated",isAuthenticated);
    fetch(
        "https://vppspark.shinehub.com.au:8443/backend-service/user/"+userID,
        {
          method: "PATCH",
          headers:{
            "Authorization":"Basic "+Base64.encode(`${username}:${password}`),
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            email:email,
            phone:phone
          })

        }
    )
        .then(res => res.json())
        .then(res => {
          props.getSessionUser(username,password)
              .then(res=>res.json())
              .then(res=>{

                // console.log('session user post update',res);

                setProfileDetails({
                  ...profileDetails,
                  email: res.data.email,
                  phone: res.data.phone
                });
                setSessionUser(res.d);
                setState({...state,editProfile:false});
                store.dispatch({
                  type: SESSION_USER,
                  payload: res.data
                });
              });


        })

  };

  const onChange = e => {
    const { email, phone } = profileDetails;

    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  function handleDrawerClose(side) {
    setState({ ...state, [side]: false });
  }

  useEffect(() => {
    // console.log("layout");
    const {username,userpassword} = props.auth;
    const password = userpassword;
    props
        .getSessionUser(username,password)
        .then(res => res.json())
        .then(res => {
          // console.log('session expiretime',typeof res.success);
          // console.log('++++++++++++++res',res);
          userID = res.data.id;

          // console.log('++++++++++++++userID',userID);
          if(res.success===0){
            props.history.push('/login');
          }

          // console.log("session user", res);
          setProfileDetails({
            ...profileDetails,
            email: res.data.email,
            phone: res.data.phone
          });
          setSessionUser(res.data);

          store.dispatch({
            type: SESSION_USER,
            payload: res.data
          });
        });

    if (props.location.pathname === "/login" || !props.auth.isAuthenticated ) {
      // console.log("yaha aaya");
      setState({ ...state, navbarHidden: true });
    } else {
      // console.log("yaha bhi aaya");
      setState({ ...state, navbarHidden: false });
    }
    // console.log("navbarHidden", state.navbarHidden);
  }, []);

  const onClickLogout = history => {
    props.logout(history);
  };

  return (
      <div>
        {state.navbarHidden ? null : (
            <div className={classes.root}>
              <CssBaseline />
              <AppBar
                  style={{ backgroundColor: "#fff" }}
                  position={"fixed"}
                  className={clsx(classes.appBar, {
                    [classes.appBarShift]: state.open
                  })}
              >
                <Toolbar>
                  <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                  >
                    <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                    >
                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          onClick={() => handleDrawerOpen("open")}
                          edge="start"
                          className={clsx(classes.menuButton, {
                            [classes.hide]: state.open
                          })}
                      >
                        <img src={menuIcon} />
                      </IconButton>
                      <Typography  variant="h6" noWrap>
                        <a  href={"https://monitor.shinehub.com.au"}><img src={logo}/></a>
                      </Typography>
                    </div>
                    <div
                        style={{
                          // padding: "0 3%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                    >
                      {/*<img
                    // style={{ paddingRight: "30%" }}
                    // src={bell}
                    // onClick={() => {
                    //   handleDrawerOpen("openRight", "bell");
                    // }}
                  />*/}
                      <img
                          onClick={() => {
                            handleDrawerOpen("openRight", "profile");
                          }}
                          src={greyAvatar}
                          style={{ width: 30, height: 30 }}
                      />
                      {/* <SupervisedUserCircleOutlined style={{color:'#83C4C4',fontSize:'41px'}} onClick={()=>handleDrawerOpen("openRight", "profile")} /> */}
                    </div>
                  </div>
                </Toolbar>
              </AppBar>
              <Drawer
                  style={{ textAlign: "center", margin: "0 auto" }}
                  variant="permanent"
                  className={clsx(classes.drawer, {
                    [classes.drawerOpen]: state.open,
                    [classes.drawerClose]: !state.open
                  })}
                  classes={{
                    paper: clsx({
                      [classes.drawerOpen]: state.open,
                      [classes.drawerClose]: !state.open
                    })
                  }}
                  open={state.open}
              >
                <div className={classes.toolbar}>
                  <IconButton onClick={() => handleDrawerClose("open")}>
                    {theme.direction === "rtl" ? (
                        <ChevronRightIcon />
                    ) : (
                        <ChevronLeftIcon />
                    )}
                  </IconButton>
                </div>
                <Divider />
                <List
                    classes={{
                      root: classes.listRootClose
                    }}
                    style={
                      state.open
                          ? {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            margin: "0 auto",
                            paddingLeft: "1%"
                            // paddingTop:'6vw'
                          }
                          : {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            margin: "0 auto",
                            paddingLeft: "7%"
                            // paddingTop:'6vw'
                          }
                    }
                >
                  {/*{console.log("window.innerHeight", window.innerHeight)}*/}
                  {[
                    { icon: analytics, component: "Dashboard", text: "Overview", onClick: "/" },
                    { icon: fourRectangles, component: "Fleet", text: "Fleet",onClick:"/fleet" },
                    { icon: calendar, component: "Events", text: "Events", onClick: "/events" }
                    // { icon: cogWheel, component: "Settings", text: "Settings",onClick:"/settings" }
              ].map((item, index) => (
                <Can key={index} perform={`${item.component}:V`}
                yes={() => (
                  <ListItem
                  button
                  style={item.text==='Events'?{paddingLeft:'12%',display: "flex", alignItems: "center" }:{display: "flex", alignItems: "center"}}
                  onClick={() => props.history.push(item.onClick)}
              >
                <ListItemIcon

                >
                  <img src={item.icon} />
                </ListItemIcon>
                <ListItemText
                    style={{ color: "#83C4C4" }}
                    primary={item.text}
                    classes={{
                      root: classes.text
                    }}
                />
              </ListItem>
                )} />
                  ))}
                </List>
              </Drawer>
              <Drawer
                  anchor="right"
                  classes={{
                    paperAnchorRight: classes.drawerRight
                  }}
                  style={{ zIndex: 1 }}
                  open={state.openRight}
                  onClose={() => handleDrawerClose("openRight")}
              >
                <div className={classes.toolbar} />
                {/*{console.log("state.profile", state.profile)}*/}
                {/*{console.log("state.profile", state)}*/}
                {state.profile === "profile" ? (
                    <div
                        style={{
                          display: "flex",
                          position: "relative",
                          flexDirection: "column",
                          alignItems: "center",
                          paddingTop: "13%",
                          height: "100%"
                        }}
                    >
                      <div
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            display: "flex"
                          }}
                      >
                        <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-evenly",
                              alignItems: "center"
                            }}
                        >
                          <img src={greyAvatar} style={{ width: 150, height: 150 }} />
                          {/* <SupervisedUserCircleOutlined style={{color:'#83C4C4',fontSize:'195px'}}/> */}
                          <Typography
                              style={{
                                padding: "3% 0 10% 0",
                                fontSize: "200%",
                                fontWeight: "500",
                                color: "#2E384D",
                                fontFamily: "Gotham Rounded Medium"
                              }}
                          >
                            {props.auth.sessionUser.name}
                          </Typography>
                          <Divider style={{ width: "80%" }} variant="middle" />
                        </div>
                        <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-evenly",
                              alignItems: "flex-start"
                            }}
                        >
                          <div style={{ width: "100%", padding: "6% 0 6% 6%" }}>
                            <Typography
                                style={{
                                  color: "#BDBDBD",
                                  fontFamily: "Gotham Rounded Medium",
                                  fontSize: 13
                                }}
                            >
                              {"email".toUpperCase()}
                            </Typography>
                            {state.editProfile ? (
                                <TextField
                                    variant="outlined"
                                    inputProps={{
                                      height: "1px",
                                      margin: 0,
                                      padding: 0
                                    }}
                                    name="email"
                                    onChange={onChange}
                                    value={profileDetails.email}
                                />
                            ) : (
                                <Typography
                                    style={{
                                      color: "#333333",
                                      fontFamily: "Gotham Rounded Medium"
                                    }}
                                >
                                  {props.auth.sessionUser.email}
                                </Typography>
                            )}
                          </div>
                          <div style={{ width: "100%", paddingLeft: "6%" }}>
                            <Typography
                                style={{
                                  color: "#BDBDBD",
                                  fontFamily: "Gotham Rounded Medium",
                                  fontSize: 13
                                }}
                            >
                              {"phone".toUpperCase()}
                            </Typography>
                            {state.editProfile ? (
                                <TextField
                                    variant="outlined"
                                    inputProps={{
                                      height: "1px",
                                      margin: 0,
                                      padding: 0
                                    }}
                                    name="phone"
                                    onChange={onChange}
                                    value={profileDetails.phone}
                                />
                            ) : (
                                <Typography
                                    style={{
                                      color: "#333333",
                                      fontFamily: "Gotham Rounded Medium"
                                    }}
                                >
                                  {props.auth.sessionUser.phone}
                                </Typography>
                            )}
                          </div>
                          {/* {state.editProfile ? (
                      <div
                        style={{
                          width: "100%",
                          paddingLeft: "6%",
                          paddingTop: "6%"
                        }}
                      >
                        <Typography>{"password".toUpperCase()}</Typography>
                        <TextField
                          variant="outlined"
                          inputProps={{
                            // height:'1px',
                            margin: 0,
                            padding: 0
                          }}
                          value="password"
                        />
                      </div>
                    ) : null} */}
                        </div>
                        <div
                            style={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              paddingTop: "10%"
                            }}
                        >
                          {!state.editProfile ? (
                              <Button
                                  onClick={() =>
                                      setState({ ...state, editProfile: true })
                                  }
                                  variant="contained"
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#25a8a8",
                                    textTransform: "none",
                                    fontFamily: "Gotham Rounded Medium"
                                  }}
                              >
                                Edit profile
                              </Button>
                          ) : (
                              <Button
                                  onClick={() => onProfileSave()}
                                  variant="contained"
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#25a8a8",
                                    textTransform: "none"
                                  }}
                              >
                                Save
                              </Button>
                          )}
                        </div>
                        <div
                            style={{
                              display: "flex",
                              width: "100%",
                              bottom: "3%",
                              justifyContent: "center",
                              paddingTop: "10%"
                            }}
                        >
                          <Button
                              onClick={() => onClickLogout(props.history)}
                              variant="contained"
                              style={{
                                color: "#fff",
                                backgroundColor: "#25a8a8",
                                textTransform: "none",
                                fontFamily: "Gotham Rounded Medium"
                              }}
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                ) : (
                    <div>
                      <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                      >
                        <Typography style={{ fontSize: "200%", fontWeight: "bold" }}>
                          Coming Soon!
                        </Typography>
                      </div>
                    </div>
                )}
              </Drawer>
            </div>
        )}
        <main className={clsx({ [classes.content]: !state.navbarHidden })}>
          {state.navbarHidden ? null : <div className={classes.toolbar} />}
          {props.children}
        </main>
      </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

const styles = {
  // listRootOpen:{
  //   margin:'0 auto',
  //   paddingLeft:'7%'
  // },
  listRootClose: {
    margin: "0 auto",
    paddingLeft: "1%"
  },
  text: {
    fontSize: "2vw"
  }
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        { getSessionUser, logout }
    )(withRouter(Layout))
);

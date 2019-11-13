import React, { Component } from "react";
import map from "../../assets/map.svg";
import {
  Card,
  CardContent,
  Typography,
  Button,
  withStyles,
  TextField
} from "@material-ui/core";
import logo from "../../assets/shinehub-logo.svg";
import axios from 'axios';
import {connect} from 'react-redux';
import {login} from '../../actions/authActions';
const md5 = require("md5");


class Login extends Component {
  state = {
    email:'',
    password:''
  };
  
  componentDidMount() {
  
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.auth.error){
      console.log('nextProps.auth.error',nextProps.auth.error);
    }
  }


  onChange=(e)=>{

    this.setState({[e.target.name]:e.target.value});

  }

  onSignIn=(e)=>{
    e.preventDefault();

    const {email,password}=this.state;

    this.props.login(email,password,this.props.history,md5);

  }

  render() {
    const { classes } = this.props;
    const {error}=this.props.auth;
    const {email,password}=this.state;
    
    return (
      <div
        style={{
          backgroundColor: "#E5E5E5",
          display: "flex",
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card style={{ height: "100%", width: "100%" }}>
          <CardContent style={{ display: "flex", height: "100%", padding: 0 }}>
            <div
              style={{
                padding: "5%",
                height: "100%",
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div style={{ width: "60%" }}>
                <div>
                  <img src={logo} />
                </div>
                <div
                  style={{
                    paddingTop: "15%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around"
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ fontFamily:'Gotham Rounded Bold',fontWeight: "bolder", color: "#2E384D" }}
                  >
                    ShineHub Virtual
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{ fontFamily:'Gotham Rounded Bold',fontWeight: "bolder", color: "#2E384D" }}
                  >
                    Power Plant
                  </Typography>
                  <Typography
                    style={{
                      color: "#8798AD",
                      fontSize: "87%",
                      paddingBottom: "7%",
                      fontFamily:'Gotham Rounded Medium'
                    }}
                  >
                    Login below to proceed
                  </Typography>
                  {Object.keys(error).length>0?
                <Typography
                style={{
                  color: "red",
                  fontSize: "87%",
                  paddingBottom: "7%"
                }}
              >
                {error.value}
              </Typography>
            :''  
            }

                  <Typography
                    style={{
                      fontSize: "70%",
                      color: "#BDBDBD",
                      letterSpacing: "1.12px",
                      fontWeight: "600",
                      fontFamily:'Gotham Rounded Bold'
                    }}
                    >
                    {"Email Address".toUpperCase()}
                  </Typography>
                          <form style={{width:'100%'}} noValidate onSubmit={this.onSignIn}>
                  <TextField
                  name="email"
                  style={{
                    width:'100%',
                    paddingTop:'2%',
                    fontFamily:'Gotham Rounded Bold'
                  }}
                    value={email}
                    onChange={this.onChange}
                    variant="outlined"
                    inputProps={{
                      style: {
                        height: "1px",
                        margin: 0,
                        backgroundColor: "rgba(224,231,255,0.2)",
                        fontFamily:'Gotham Rounded Bold'
                        // padding:0
                      }
                    }}
                  />
           </form>
                  {/* <input style={{height:'22px',borderRadius:4,borderWidth:1,borderColor:'rgb(224,231,255)',backgroundColor:'rgba(224,231,255,0.2)'}}/> */}
                  <div
                    style={{
                      paddingTop: "6%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    >
                    <Typography
                      style={{
                        fontSize: "70%",
                        color: "#BDBDBD",
                        letterSpacing: "1.12px",
                        fontWeight: "600",
                        fontFamily:'Gotham Rounded Bold'
                      }}
                    >
                      {"Password".toUpperCase()}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "70%",
                        color: "#BDBDBD",
                        letterSpacing: "1.12px",
                        fontWeight: "600",
                        fontFamily:'Gotham Rounded Bold'
                      }}
                    >
                      {"Forgot Password?"}
                    </Typography>
                  </div>
                  <form style={{width:'100%'}} onSubmit={this.onSignIn} noValidate >
                    <TextField
                  name="password"
                  type="password"  
                  style={{
                    width:'100%',
                    paddingTop:'2%',
                    fontFamily:'Gotham Rounded Bold'
                  }}
                  value={password}
                  onChange={this.onChange}
                  variant="outlined"
                  inputProps={{
                    style: {
                      height: "1px",
                      margin: 0,
                      backgroundColor: "rgba(224,231,255,0.2)",
                        // padding:0
                      }
                    }}
                    />
                  <div style={{ width: "100%", paddingTop: "7%" }}>
                    <Button
                      onClick={this.onSignIn}
                      style={{
                        backgroundColor: "#25A8A8",
                        width: "100%",
                        color: "#fff",
                        padding: "4% 0",
                        fontFamily:'Gotham Rounded Bold'
                      }}
                      variant="contained"
                      classes={{
                        label: classes.label
                      }}
                      >
                      Sign in
                    </Button>
                  </div>
                  </form>
                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      paddingTop: "3%"
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "80%",
                        paddingRight: "1%",
                        color: "#B0BAC9",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        fontFamily:'Gotham Rounded Bold'
                      }}
                    >
                      Don't have an account?
                    </Typography>
                    <Typography
                      style={{
                        color: "#25A8A8",
                        cursor: "pointer",
                        fontSize: "85%"
                      }}
                    >
                      Sign up
                    </Typography>
                  </div> */}
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage:`url(${map})`,
                width: "50%",
                position: "relative"
              }}
            >
              <div/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const styles = {
  label: {
    textTransform: "none"
  },
  textField: {
    height: "22px",
    padding: 0,
    margin: 0
  }
};

const mapStateToProps=state=>({
  auth:state.auth
})

export default withStyles(styles)(connect(mapStateToProps,{login})(Login));

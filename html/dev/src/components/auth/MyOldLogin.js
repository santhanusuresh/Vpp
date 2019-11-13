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
const md5 = require("md5");


class Login extends Component {
  state = {};
  
  componentDidMount() {
    // axios.post('https://monitoring.shinehub.com.au/handler/web/Dispatch/handleQueryDischargeList.php',{
    //   d:details
    // })
    // .then(res=>{
    //   console.log('res',res);
    // })
    const loginDetails = JSON.stringify({
        cvs: {
          a: "gtl",
          p: md5(`gtl${md5("123458")}f4225962934c5452hun3o`)
        }
    });


    console.log('password', md5(`gtl${md5("123456")}f4225962934c5452hun3o`));
    

    // fetch('https://monitoring.shinehub.com.au/handler/login/handleLogin.php',{
    //   method:'POST',
    //   body:JSON.stringify({
    //     d:loginDetails
    //   })
    // }).then(res=>res.text())
    // .then(res=>{

      fetch("http://localhost:1088/handler/web/Group/handleQueryGroupUpComing.php", {
        method: "POST",
        mode:'cors',
        body: JSON.stringify({
          d: JSON.stringify({
            cvs: {
              a:1,
            }
          })
        })
      })
        .then(res => res.text())
        .then(res => {
            console.log("res", res);
        });
    // })

  }

  render() {
    const { classes } = this.props;

    return (
      <div
        style={{
          backgroundColor: "#E5E5E5",
          display: "flex",
          height: "99vh",
          width: "99vw",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card style={{ height: "90%", width: "85%" }}>
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
                    style={{ fontWeight: "bolder", color: "#2E384D" }}
                  >
                    ShineHub Virtual
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{ fontWeight: "bolder", color: "#2E384D" }}
                  >
                    Power Plant
                  </Typography>
                  <Typography
                    style={{
                      color: "#8798AD",
                      fontSize: "87%",
                      paddingBottom: "7%"
                    }}
                  >
                    Login below to proceed
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "70%",
                      color: "#BDBDBD",
                      letterSpacing: "1.12px",
                      fontWeight: "600"
                    }}
                  >
                    {"Email Address".toUpperCase()}
                  </Typography>
                  <TextField
                    variant="outlined"
                    inputProps={{
                      style: {
                        height: "1px",
                        margin: 0,
                        backgroundColor: "rgba(224,231,255,0.2)"
                        // padding:0
                      }
                    }}
                  />
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
                        fontWeight: "600"
                      }}
                    >
                      {"Password".toUpperCase()}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "70%",
                        color: "#BDBDBD",
                        letterSpacing: "1.12px",
                        fontWeight: "600"
                      }}
                    >
                      {"Forgot Password?".toUpperCase()}
                    </Typography>
                  </div>
                  <TextField
                    variant="outlined"
                    inputProps={{
                      style: {
                        height: "1px",
                        margin: 0,
                        backgroundColor: "rgba(224,231,255,0.2)"
                        // padding:0
                      }
                    }}
                  />
                  <div style={{ width: "100%", paddingTop: "7%" }}>
                    <Button
                      style={{
                        backgroundColor: "#25A8A8",
                        width: "100%",
                        color: "#fff",
                        padding: "4% 0"
                      }}
                      variant="contained"
                      classes={{
                        label: classes.label
                      }}
                    >
                      Sign in
                    </Button>
                  </div>
                  <div
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
                        whiteSpace: "nowrap"
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
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                width: "50%",
                position: "relative"
              }}
            >
              <img src={map} />
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

export default withStyles(styles)(Login);

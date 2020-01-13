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
    Slider
} from "@material-ui/core";
import { connect } from "react-redux";
import Select from "react-select";
import "./reactSelectFix.css";
import Spinner from "../common/Spinner";
import { Base64 } from "js-base64";


const customStyles = {
    control: (base, state) => {
        return {
            ...base,
            "&:hover": {
                borderColor: state.isFocused ? "#00008b" : base.borderColor
            }
        }
    },
    input: base => {
        return {
            ...base,
        }
    }
};


class Fleet extends Component {
    state = {
        filterLocation: null,
        filterNetworkProvider: null,
        filterStartPower: 15,
        filterEndPower: 30,
        filterStatus: "",
        events: [],
        showEvents: [],
        locations: [],
        providers: [],
        loading: true
    };

    componentDidMount() {
        const { username, userpassword } = this.props.auth;
        const password = userpassword;
        Promise.all([
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/system/usersSystem",
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
            ),
            fetch(
                "https://vppspark.shinehub.com.au:8443/backend-service/system/providers/",
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
                Promise.all([res[0], res[1], res[2]]).then(res => {
                    return this.setState({
                        loading: false,
                        events: res[0].data,
                        showEvents: res[0].data,
                        locations: res[1].data,
                        providers: res[2].data.filter(p => res[0].data.map(event => event.providerId).includes(p.providerId))
                    });
                });
            });
    }

    onChange = (e, name) => {
        if(name === "power") {
            this.setState({filterStartPower: e[0], filterEndPower: e[1]}, () => {
                this.onFilterEvents('power');
            })
        } else {
            this.setState({ [name]: e }, () => {
                this.onFilterEvents();
            });
        }
    };

    onFilterEvents = (fieldName) => {
        let newEvents = this.state.events.slice();
        if(this.state.filterLocation) {
            newEvents = newEvents.filter(event => event.groupId === this.state.filterLocation.id);
        }
        if(this.state.filterNetworkProvider) {
            newEvents = newEvents.filter(event => event.providerId === this.state.filterNetworkProvider.id);
        }
        if(this.state.filterStatus) {
            newEvents = newEvents.filter(event => event.networkStatus === this.state.filterStatus.value);
        }
        if(fieldName === 'power') {
            newEvents = newEvents.filter(event => (event.poinv >= this.state.filterStartPower && event.poinv <= this.state.filterEndPower) );
        }
        this.setState({ showEvents: newEvents });
    };

    render() {
        const { classes } = this.props;
        const {
            filterLocation,
            filterNetworkProvider,
            filterStatus,
            loading,
            filterStartPower,
            filterEndPower,
            locations,
            showEvents,
            providers
        } = this.state;

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
                                            Fleet
                                    </Typography>
                                        <Typography
                                            style={{
                                                color: "#BDBDBD",
                                                fontFamily: "Gotham Rounded Bold",
                                                paddingTop: "1%",
                                                fontSize: "1.3vw"
                                            }}
                                        >{`${Array.isArray(showEvents) ? showEvents.length : ""} ${
                                            Array.isArray(showEvents)
                                                ? showEvents.length === 1
                                                    ? "battery"
                                                    : "batteries"
                                                : ""
                                            }`}</Typography>
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <Table>
                                            <TableHead style={{ backgroundColor: "#FBFBFB" }}>
                                                <TableRow>
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
                                                        Power
                                            </TableCell>
                                                    <TableCell
                                                        style={{
                                                            color: "#BDBDBD",
                                                            fontFamily: "Gotham Rounded Bold",
                                                            fontSize: "1.3vw"
                                                        }}
                                                    >
                                                        Capacity
                                            </TableCell>
                                                    <TableCell
                                                        style={{
                                                            color: "#BDBDBD",
                                                            fontFamily: "Gotham Rounded Bold",
                                                            fontSize: "1.3vw"
                                                        }}
                                                    >
                                                        Battery
                                            </TableCell>
                                                    <TableCell
                                                        style={{
                                                            color: "#BDBDBD",
                                                            fontFamily: "Gotham Rounded Bold",
                                                            fontSize: "1.3vw"
                                                        }}
                                                    >
                                                        Status
                                            </TableCell>
                                                    <TableCell
                                                        style={{
                                                            color: "#BDBDBD",
                                                            fontFamily: "Gotham Rounded Bold",
                                                            fontSize: "1.3vw"
                                                        }}
                                                    >
                                                        Grid
                                            </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Array.isArray(showEvents)
                                                    ? showEvents.map((row,key) => {
                                                        return (
                                                            <TableRow
                                                                key={row.systemId}
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
                                                                            {row.groupName}
                                                                        </Typography>
                                                                        <Typography
                                                                            style={{
                                                                                padding: 0,
                                                                                margin: 0,
                                                                                color: "#BDBDBD",
                                                                                fontFamily: "Gotham Rounded Light",
                                                                                fontSize: "1.2vw"
                                                                            }}
                                                                        >{`#${row.systemId.split(/-/)[0]}`}</Typography>
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
                                                                    {`${row.poinv}kW`}
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        fontFamily: "Gotham Rounded Light",
                                                                        color: "#2E384D",
                                                                        fontSize: "1.2vw"
                                                                    }}
                                                                >
                                                                    {`${row.batteryOutput}kW`}
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        fontFamily: "Gotham Rounded Light",
                                                                        color: "#2E384D",
                                                                        fontSize: "1.2vw"
                                                                    }}
                                                                >
                                                                    {row.brandname}
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        fontFamily: "Gotham Rounded Light",
                                                                        color: "#2E384D",
                                                                        fontSize: "1.2vw"
                                                                    }}
                                                                >
                                                                    {`${row.networkStatus === 1 ? 'Online' : 'Offline' }`}
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        fontFamily: "Gotham Rounded Light",
                                                                        color: "#2E384D",
                                                                        fontSize: "1.2vw"
                                                                    }}
                                                                >
                                                                    {row.providerName}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                    : ""}
                                            </TableBody>
                                        </Table>
                                    </div>
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
                                                        }}
                                                    >
                                                        <Select
                                                            value={filterLocation}
                                                            styles={customStyles}
                                                            onChange={e => {
                                                                this.onChange(e, "filterLocation");
                                                            }}
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
                                                    <Typography
                                                        style={{
                                                            width: "119%",
                                                            paddingRight: "3%",
                                                            color: "#BDBDBD",
                                                            letterSpacing: "1.5px",
                                                            fontFamily: "Gotham Rounded Medium"
                                                        }}
                                                    >
                                                        Network Provider
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
                                                        <Select
                                                            value={filterNetworkProvider}
                                                            styles={customStyles}
                                                            onChange={e => {
                                                                this.onChange(e, "filterNetworkProvider");
                                                            }}
                                                            options={
                                                                providers
                                                                    ? providers.map(provider => {
                                                                        console.log(provider)
                                                                        return {
                                                                            value: provider.providerName,
                                                                            label: provider.providerName,
                                                                            id: provider.providerId
                                                                        };
                                                                    })
                                                                    : []
                                                            }
                                                        />
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
                                                        onChange={(e,value) => {
                                                            this.onChange(value, "power");
                                                        }}
                                                        valueLabelDisplay="auto"
                                                        aria-labelledby="range-slider"
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
                                                                { value: 0, label: "Offline" },
                                                                { value: 1, label: "Online" }
                                                            ]}
                                                            value={filterStatus}
                                                            onChange={e => {
                                                                this.onChange(e, "filterStatus");
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}
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

export default withStyles(styles)(connect(mapStateToProps)(Fleet));

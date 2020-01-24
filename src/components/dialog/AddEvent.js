import React, { useState} from 'react'
import MomentUtils from "@date-io/moment";
import {
    DatePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import {
    Dialog,
    DialogContent,
    Slider,
    Button,
    TextField,
    createMuiTheme,
    Typography
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Select from "react-select";
import moment from "moment";
import Can from "../common/Can"

const AddEvent = ({ openAddEvent, locations, validationText, error, onClickSave, customStyles, classes, closeAddEvent }) => {

    const [location, setLocation] = useState(null)
    const [date, setDate] = useState(null)
    const [from, setFrom] = useState("02:00")
    const [to, setTo] = useState("04:00")
    const [power, setPower] = useState(45)

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

    return <Can perform="AddEvent:W"
    yes={() => (
        <Dialog
            fullWidth
            style={{ zIndex: 2 }}
            open={openAddEvent}
            onClose={() => closeAddEvent()}
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
                                    onChange={e => {
                                        setLocation(e)
                                        setPower(e.maxPower)
                                    }}
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
                                            onChange={e => setDate(moment(e).format("YYYY-MM-DD"))}
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
                                        onChange={e => setFrom(e.target.value)}
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
                                        onChange={e => setTo(e.target.value)}
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
                            onChange={(e, value) => setPower(value)}
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
                                onClick={()=>onClickSave( power, location, date, from, to)}
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
        </Dialog>)}/>
}

export default AddEvent

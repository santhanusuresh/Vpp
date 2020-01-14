import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    CardContent,
    Slider
} from "@material-ui/core";
import Select from "react-select";
import "./reactSelectFix.css";

const Filter = (props) => {

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

    const { locations, providers, classes, events, setShowEvents } = props;
    const [filterLocation, setFilterLocation] = useState(null);
    const [filterNetworkProvider, setFilterNetworkProvider] = useState(null);
    const [filterStartPower, setFilterStartPower] = useState(15);
    const [filterEndPower, setFilterEndPower] = useState(30);
    const [filterStatus, setFilterStatus] = useState();
    const [isTochedPower, setIsTochedPower] = useState(false);

    useEffect(() => {
        let newEvents = events.slice();
        if (filterLocation) {
            newEvents = newEvents.filter(event => event.groupId === filterLocation.id);
        }
        if (filterNetworkProvider) {
            newEvents = newEvents.filter(event => event.providerId === filterNetworkProvider.id);
        }
        if (filterStatus) {
            newEvents = newEvents.filter(event => event.networkStatus === filterStatus.value);
        }
        if (isTochedPower) {
            newEvents = newEvents.filter(event => (event.poinv >= filterStartPower && event.poinv <= filterEndPower));
        }
        setShowEvents(newEvents);
    }, [filterLocation, filterNetworkProvider, filterStatus, filterStartPower, filterEndPower]);

    return (
        <div style={{ width: "15vw", height: "27vw" }}>
            <Card style={{ width: "100%", height: "100%" }}>
                <CardContent style={{
                    display: "flex", height: "100%",
                    flexDirection: "column", alignItems: "center"
                }} >
                    <div style={{ width: "88%", height: "100%" }}>
                        <div style={{
                            display: "flex", height: "100%", flexDirection: "column",
                            justifyContent: "space-evenly", alignItems: "flex-start"
                        }}>
                            <Typography style={{
                                color: "#25A8A8", fontFamily: "Gotham Rounded Light",
                                letterSpacing: "1.2133px", paddingBottom: "3%", fontSize: "1vw",
                                textTransform: "uppercase"
                            }}>
                                Filter
                        </Typography>
                            <Typography style={{
                                width: "30%", paddingRight: "3%", color: "#BDBDBD",
                                letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                            }}>
                                Location
                        </Typography>
                            <div style={{
                                width: "100%", paddingRight: "3%", color: "#BDBDBD",
                                letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                            }}>
                                <Select value={filterLocation} styles={customStyles}
                                    onChange={e => setFilterLocation(e)}
                                    options={locations ? locations.map(location => {
                                        return {
                                            value: location.name,
                                            label: location.name,
                                            id: location.id
                                        }
                                    }) : []
                                    }
                                />
                            </div>
                            <Typography
                                style={{
                                    width: "100%", paddingRight: "3%", color: "#BDBDBD",
                                    letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                                }}>
                                Grid Provider
                        </Typography>
                            <div style={{
                                width: "100%", paddingRight: "3%", color: "#BDBDBD",
                                letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                            }}>
                                <Select value={filterNetworkProvider} styles={customStyles}
                                    onChange={e => setFilterNetworkProvider(e)}
                                    options={providers ? providers.map(provider => {
                                        return {
                                            value: provider.providerName,
                                            label: provider.providerName,
                                            id: provider.providerId
                                        }
                                    }) : []
                                    }
                                />
                            </div>
                            <div style={{
                                width: "100%", display: "flex", justifyContent: "space-between",
                                alignItems: "center", paddingBottom: "4%"
                            }}>
                                <Typography style={{
                                    width: "30%", paddingRight: "3%", color: "#BDBDBD",
                                    letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                                }}>
                                    Power
                            </Typography>
                                <Typography
                                    style={{
                                        whiteSpace: "nowrap", color: "#828282",
                                        fontFamily: "Gotham Rounded Medium", fontSize: "1vw"
                                    }}>
                                    {`${filterStartPower}-${filterEndPower} kWh`}
                                </Typography>
                            </div>
                            <Slider classes={{ thumb: classes.thumb, track: classes.track }}
                                value={[filterStartPower, filterEndPower]}
                                onChange={(e, value) => {
                                    setFilterStartPower(value[0]);
                                    setFilterEndPower(value[1]);
                                    setIsTochedPower(true)
                                }}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                            />
                            <Typography style={{
                                width: "30%", paddingRight: "3%", color: "#BDBDBD",
                                letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                            }}>
                                Status
                        </Typography>
                            <div style={{
                                width: "100%", adding: "3% 0 8% 0", color: "#BDBDBD",
                                letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
                            }}>
                                <Select menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: styles => ({
                                            ...styles, zIndex: 0,
                                            paddingRight: "3%", color: "#BDBDBD", letterSpacing: "1.5px",
                                            fontFamily: "Gotham Rounded Medium"
                                        })
                                    }, customStyles}
                                    options={[{ value: 0, label: "Offline" }, { value: 1, label: "Online" }]}
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Filter

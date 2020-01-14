import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Base64 } from "js-base64";
import axios from "axios";
import Events from "./Events"
import Filter from "./Filter"

const Fleet = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [showEvents, setShowEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [providers, setProviders] = useState([]);
    const { classes } = props;
    const filterProps = { locations, providers, classes, events, setShowEvents }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const options = {
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${props.auth.username}:${props.auth.userpassword}`),
                    "Content-Type": "application/json"
                }
            };
            const [events, locations, providers] = await Promise.all([
                axios.get("https://vppspark.shinehub.com.au:8443/backend-service/system/usersSystem", options),
                axios.get("https://vppspark.shinehub.com.au:8443/backend-service/group/", options),
                axios.get("https://vppspark.shinehub.com.au:8443/backend-service/system/providers/", options)
            ]);
            setEvents(events.data.data);
            setShowEvents(events.data.data);
            setLocations(locations.data.data);
            setProviders(providers.data.data.filter(p => events.data.data.map(event => event.providerId).includes(p.providerId)));
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const loadComponent = (component) => (isLoading ?
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner />
        </div> : component
    );

    return (
        <div style={{
            position: "relative", backgroundColor: "#FBFBFB", display: "flex",
            flexDirection: "column", justifyContent: "space-around",
            alignItems: isLoading ? "center" : "flex-start", padding: "5vw 0 0 5vw"
        }}>{loadComponent(
            <div style={{
                display: "flex", width: "100%", justifyContent: "space-around",
                alignItems: "center", flexDirection: "column"
            }}>
                <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
                <Events showEvents = {showEvents} />
                <Filter {...filterProps} />
                </div>
            </div>)}
        </div>
    )
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


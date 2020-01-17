import React from 'react'
import Typography from "@material-ui/core/Typography"
import moment from "moment"

const UpComingEvents = ({events = []}) => {
    return events.map(event => {
                return (
                    <div key = {event.eventId}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Typography
                                style={{
                                    whiteSpace: "nowrap",
                                    fontFamily: "Gotham Rounded Medium",
                                    fontSize: "1.3vw"
                                }}
                            >
                                {event.groupname}
                            </Typography>
                            <div style={{ display: "flex" }}>
                                <Typography
                                    style={{
                                        paddingRight: "1px",
                                        fontFamily: "Gotham Rounded Medium",
                                        fontSize: "1.3vw"
                                    }}
                                >
                                    {`${parseInt(event.power) / 1000} kW`}
                                </Typography>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                padding: "1% 0",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Gotham Rounded Medium",
                                    color: "#828282",
                                    fontSize: "1vw"
                                }}
                            >
                                {moment(event.date).format("DD/MM/YYYY")}
                            </div>
                            <div
                                style={{
                                    fontFamily: "Gotham Rounded Medium",
                                    color: "#828282",
                                    fontSize: "1vw"
                                }}
                            >{`${moment(event.startTime, "HH:mm:ss").format(
                                "HH:mm"
                            )}-${moment(event.endTime, "HH:mm:ss").format(
                                "HH:mm"
                            )}`}</div>
                        </div>
                    </div>
                )})
}

export default UpComingEvents

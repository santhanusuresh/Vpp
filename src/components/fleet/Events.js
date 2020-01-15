import React from 'react'
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";

const Events = ({ showEvents }) => {

    const tableHeaderStyle = {
        color: "#BDBDBD",
        fontFamily: "Gotham Rounded Bold",
        fontSize: "1.3vw"
    };
    const tableBodyStyle = {
        fontFamily: "Gotham Rounded Light",
        color: "#2E384D",
        fontSize: "1.2vw"
    };

    return (
        <div style={{ display: "flex", width: "65vw", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
                width: "100%", display: "flex", justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <Typography style={{
                    fontSize: "2.2vw", paddingRight: "20px",
                    fontWeight: "bolder", fontFamily: "Gotham Rounded Bold"
                }}>
                    Fleet
                </Typography>
                <Typography style={{
                    color: "#BDBDBD", fontFamily: "Gotham Rounded Bold",
                    paddingTop: "1%", fontSize: "1.3vw"
                }}
                > {`${Array.isArray(showEvents) ? showEvents.length : ""} 
                        ${Array.isArray(showEvents) ? showEvents.length === 1
                        ? "battery" : "batteries" : ""}`}
                </Typography>
            </div>
            <Table style={{ whiteSpace: "nowrap" }} >
                <TableHead style={{ backgroundColor: "#FBFBFB" }}>
                    <TableRow>
                        <TableCell style={{ ...tableHeaderStyle, width: "21%" }}>
                            Location
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "11%" }}>
                            Power
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "15%" }}>
                            Capacity
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "18%" }}>
                            NMI
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "12%" }}>
                            Status
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "23%" }}>
                            Grid
                            </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(showEvents) ? showEvents.map(row => {
                        return (
                            <TableRow key={row.systemId}
                                style={{ backgroundColor: "#fff", border: "15px solid #FBFBFB" }}>
                                <TableCell style={{ width: "21%" }}>
                                    <div style={{
                                        display: "flex", flexDirection: "column",
                                        justifyContent: "flex-end"
                                    }}>
                                        <Typography style={{
                                            padding: 0, margin: 0, color: "#2E384D",
                                            fontSize: "1.2vw", fontFamily: "Gotham Rounded Medium"
                                        }}>
                                            {row.groupName}
                                        </Typography>
                                        <Typography style={{
                                            color: "#BDBDBD", fontSize: "1.2vw",
                                            padding: 0, margin: 0, fontFamily: "Gotham Rounded Light"
                                        }}>
                                            {`#${row.systemId.split(/-/)[0]}`}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "11%" }}>
                                    {`${row.poinv}kW`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "15%" }}>
                                    {`${row.batteryOutput}kWh`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "18%" }}>
                                    {row.nmi}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "12%" }}>
                                    {`${row.networkStatus === 1 ? 'Online' : 'Offline'}`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "23%" }}>
                                    {row.providerName}
                                </TableCell>
                            </TableRow>
                        )
                    }) : ""
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default Events

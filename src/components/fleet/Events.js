import React from 'react'
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";

const Events = ({showEvents}) => {

    const tableHeaderStyle = {
        color: "#BDBDBD",
        fontFamily: "Gotham Rounded Bold",
        fontSize: "1.3vw"
    };
    const tableBodyStyle = {
        whiteSpace: "nowrap",
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
            <div style={{ width: "100%" }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#FBFBFB" }}>
                        <TableRow>
                            <TableCell style={tableHeaderStyle}>
                                Location
                            </TableCell>
                            <TableCell style={tableHeaderStyle}>
                                Power
                            </TableCell>
                            <TableCell style={tableHeaderStyle}>
                                Capacity
                            </TableCell>
                            <TableCell style={tableHeaderStyle}>
                                NMI
                            </TableCell>
                            <TableCell style={tableHeaderStyle}>
                                Status
                            </TableCell>
                            <TableCell style={tableHeaderStyle}>
                                Grid
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(showEvents) ? showEvents.map(row => {
                            return (
                                <TableRow key={row.systemId}
                                    style={{ backgroundColor: "#fff", border: "15px solid #FBFBFB" }}>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>
                                        <div style={{
                                            display: "flex", flexDirection: "column",
                                            justifyContent: "flex-end"
                                        }}>
                                            <Typography style={{ padding: 0, margin: 0, color: "#2E384D", 
                                                    fontSize: "1.2vw", fontFamily: "Gotham Rounded Medium" }}>
                                                {row.groupName}
                                            </Typography>
                                            <Typography style={{ color: "#BDBDBD", fontSize: "1.2vw", 
                                                padding: 0, margin: 0, fontFamily: "Gotham Rounded Light" }}>
                                                {`#${row.systemId.split(/-/)[0]}`}
                                            </Typography>
                                        </div>
                                    </TableCell>
                                    <TableCell style={tableBodyStyle}>
                                        {`${row.poinv}kW`}
                                    </TableCell>
                                    <TableCell style={tableBodyStyle}>
                                        {`${row.batteryOutput}kW`}
                                    </TableCell>
                                    <TableCell style={tableBodyStyle}>
                                        {row.nmi}
                                    </TableCell>
                                    <TableCell style={tableBodyStyle}>
                                        {`${row.networkStatus === 1 ? 'Online' : 'Offline'}`}
                                    </TableCell>
                                    <TableCell style={tableBodyStyle}>
                                        {row.providerName}
                                    </TableCell>
                                </TableRow>
                            )
                        }) : ""
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Events

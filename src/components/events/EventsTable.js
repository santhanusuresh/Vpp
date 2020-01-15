import React from 'react'
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";
import {
    MoneyOff,
    AttachMoneyOutlined
} from "@material-ui/icons";
import moment from "moment";

const EventsTable = ({ showEvents, moneyClickHandler, eventClickHandler }) => {

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
    const whiteStatus = {
        backgroundColor: "#fff",
        border: "solid",
        borderColor: "rgb(124, 124, 124)",
        borderWidth: 4,
        borderRadius: 40,
        width: "1vw",
        height: "1vw"
    }
    const greenStatus = {
        backgroundColor: "green",
        borderRadius: 40,
        width: "1vw",
        height: "1vw"
    }
    const getStatusIndicator = (eventstatus) => (eventstatus === 0 || eventstatus === 1 || eventstatus === 4) ? whiteStatus : greenStatus;
    const getStatus = (eventstatus) => {
        switch (eventstatus) {
            case 0:
            case 1: return "Scheduled";
            case 2: return "Completed";
            case 4: return "No Available Power\n to discharge";
            default: return  "Completed and\n Sent Email to Customer";
        }
    };
    const getMoneyIndicator = (row) => (row.eventstatus === 0 || row.eventstatus === 1 || row.eventstatus === 4) ? <MoneyOff /> :
        <AttachMoneyOutlined onClick={e => moneyClickHandler(row,e)} />;

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
                    Events
                </Typography>
                <Typography style={{
                    color: "#BDBDBD", fontFamily: "Gotham Rounded Bold",
                    paddingTop: "1%", fontSize: "1.3vw"
                }}
                > {`${Array.isArray(showEvents) ? showEvents.length : ""} 
                        ${Array.isArray(showEvents) ? showEvents.length === 1
                        ? "result" : "results" : ""}`}
                </Typography>
            </div>
            <Table style={{ whiteSpace: "nowrap", tableLayout:"fixed" }} >
                <TableHead style={{ backgroundColor: "#FBFBFB" }}>
                    <TableRow>
                        <TableCell style={{ ...tableHeaderStyle, width: "21%" }}>
                            Location
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "15%" }}>
                            Date
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "15%" }}>
                            Time
                            </TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "11%" }}>
                            Power
                            </TableCell>
                        <TableCell style={{width:"5%"}}></TableCell>
                        <TableCell style={{ ...tableHeaderStyle, width: "19%" }}>
                            Status
                            </TableCell>
                        <TableCell style={{width:"5%"}}></TableCell>
                        <TableCell style={{width:"9%"}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(showEvents) ? showEvents.map(row => {
                        return (
                            <TableRow key={row.eventId}
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
                                            {row.groupname}
                                        </Typography>
                                        <Typography style={{
                                            color: "#BDBDBD", fontSize: "1.2vw",
                                            padding: 0, margin: 0, fontFamily: "Gotham Rounded Light"
                                        }}>
                                            {`#${row.eventId.split(/-/)[0]}`}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "15%" }}>
                                    {`${moment(row.date).format( "DD / MM / YY")}`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "15%" }}>
                                    {`${moment(row.startTime,"HH:mm").format("HH:mm")} - ${moment( row.endTime,"HH:mm").format("HH:mm")}`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "11%" }}>
                                    {`${row.power / 1000}kW`}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "5%" }}>
                                    <div style={getStatusIndicator(row.eventstatus)}>&nbsp;</div>
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "19%", whiteSpace:"normal" }}>
                                    {getStatus(row.eventstatus)}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "5%", color: "#25A8A8",
                                                fontFamily: "Gotham Rounded Medium", cursor: "pointer" }}>
                                    {getMoneyIndicator(row)}
                                </TableCell>
                                <TableCell style={{ ...tableBodyStyle, width: "9%", color: "#25A8A8",
                                    fontFamily: "Gotham Rounded Medium", cursor: "pointer"}}
                                    onClick= {e=> eventClickHandler(row,e)}>
                                    {row.eventstatus === "0" ? "Edit" : "View"}
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

export default EventsTable

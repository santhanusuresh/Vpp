import React from 'react'
import {
    Card,
    CardContent,
    Typography
} from "@material-ui/core";
import ChartJS from "../common/Chart";

const Power = ({ chartData }) => {

    const chartJsProps = {
        time: chartData.Time,
        availablePower: ((chartData.AvailablePower && chartData.AvailablePower.map(d=>d/1000))||[]),
        netInGrid: ((chartData.NetToGrid && chartData.NetToGrid .map(d=>d/1000))||[])
    }
    
    return Object.entries(chartData).length > 0 && (
        <div
            style={{
                padding: "3% 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Card style={{ borderRadius: 8, width: "84vw" }}>
                <CardContent style={{ width: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            marginBottom: "6px",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            style={{
                                padding: "0 0 3% 8%",
                                color: "#83C4C4",
                                fontSize: "1.3vw",
                                fontFamily: "Gotham Rounded Light"
                            }}
                        >
                            {"Power".toUpperCase()}
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                alignSelf: "flex-end"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    paddingRight: "2vw",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#25A8A8",
                                        width: "1vw",
                                        height: "1vw",
                                        borderRadius: 50
                                    }}
                                >
                                    &nbsp;
                            </div>
                                <Typography
                                    style={{
                                        fontSize: "1.5vw",
                                        fontFamily: "Gotham Rounded Light",
                                        color: "#828282"
                                    }}
                                >
                                    Available Power
                            </Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#B5D145",
                                        width: "1vw",
                                        height: "1vw",
                                        borderRadius: 40
                                    }}
                                >
                                    &nbsp;
                            </div>
                                <Typography
                                    style={{
                                        fontSize: "1.5vw",
                                        fontFamily: "Gotham Rounded Light",
                                        color: "#828282",
                                        paddingRight: "28px"
                                    }}
                                >
                                    Net Grid Power
                            </Typography>
                            </div>
                        </div>
                    </div>
                    <ChartJS {...chartJsProps} />
                </CardContent>
            </Card>
        </div>
    )
}

export default Power

import React from 'react'
import {
    Card,
    CardContent,
    Typography
} from "@material-ui/core";
import {
    buildStyles,
    CircularProgressbarWithChildren
} from "react-circular-progressbar";
import RadialSeparators from "../common/RadialSeparators";

const BatteryContent = ({ BatteryCap, BatteryCount, BatteryTotal }) => {
    
    return (
        <div
            style={{
                width: "41vw",
                height: "20vw",
                marginRight: "2vw"
            }}
        >
            <Card
                style={{
                    borderRadius: 8,
                    height: "100%"
                }}
            >
                <CardContent style={{ width: "100%", height: "100%" }}>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center"
                        }}
                    >
                        <div style={{ width: "16vw" }}>

                            <CircularProgressbarWithChildren
                                value={
                                    typeof BatteryCap !== "number" ||
                                        typeof BatteryTotal !== "number"
                                        ? (parseInt(BatteryCap) / parseInt(BatteryTotal)) * 100
                                        : 0
                                }

                                strokeWidth={15}
                                circleRatio={0.6}
                                className="CircularProgressbar"
                                styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#D3E9EA",
                                    pathColor: "#25A8A8",
                                    alignSelf: "flex-end"
                                })}
                            >
                                <RadialSeparators
                                    count={60}
                                    style={{
                                        borderBottomColor: "transparent",
                                        background: "#fff",
                                        width: `.45vw`,
                                        height: `2.4vw`
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
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: 0,
                                            margin: 0
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontFamily: "Gotham Rounded Medium",
                                                fontSize: "3.5vw",
                                                padding: 0,
                                                margin: 0
                                            }}
                                        >
                                            {Math.round(BatteryCap / 1000)}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "Gotham Rounded Light",
                                                margin: "2vw 0 0 0",
                                                fontSize: "0.8vw",
                                                padding: 0
                                            }}
                                        >
                                            kW
                                    </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 0,
                                            margin: 0
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: "#83C4C4",
                                                fontSize: "1.1vw",
                                                fontFamily: "Gotham Rounded Light",
                                                padding: 0,
                                                margin: 0,
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            Available
                                    </div>
                                        <div
                                            style={{
                                                color: "#83C4C4",
                                                fontFamily: "Gotham Rounded Light",
                                                padding: 0,
                                                margin: 0,
                                                fontSize: "1.1vw",
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            Power
                                    </div>
                                    </div>
                                </div>
                            </CircularProgressbarWithChildren>
                        </div>
                        <div
                            style={{
                                fontFamily: "Gotham Rounded Bold",
                                paddingLeft: "8px",
                                paddingBottom: "10%"
                            }}
                        >
                            <Typography
                                style={{
                                    fontFamily: "Gotham Rounded Medium",
                                    fontSize: "2.2vw"
                                }}
                            >
                                Your Virtual
                        </Typography>
                            <Typography
                                style={{
                                    fontFamily: "Gotham Rounded Medium",
                                    fontSize: "2.2vw"
                                }}
                            >
                                Power Plant
                        </Typography>
                            <Typography component={'div'}
                                style={{
                                    fontFamily: "Gotham Rounded Light",
                                    color: "#828282",
                                    fontSize: "1vw",
                                    display: "inline-block",
                                    overflowWrap: "break-word"
                                }}
                            >
                                {(BatteryCount == 1) ? `There is currently ${BatteryCount}` : `There are currently ${BatteryCount}`}
                                <Typography
                                    style={{
                                        display: "table",
                                        fontFamily: "Gotham Rounded Light",
                                        color: "#828282",
                                        fontSize: "1vw"
                                    }}
                                >{(BatteryCount == 1) ? `home in your fleet` : `homes in your fleet`}
                                </Typography>
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BatteryContent

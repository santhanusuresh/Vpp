import React, { useState } from 'react'
import Select from "react-select";
import Can from '../common/Can';

const LocationFilter = ({ locations = [], onChangeLocation, customStyles }) => {
    const [location, setLocation] = useState(null);

    return <Can perform="LocationFilter:R"
        yes={() => <div style={{
            width: "30%", paddingRight: "3%", color: "#BDBDBD",
            letterSpacing: "1.5px", fontFamily: "Gotham Rounded Medium"
        }}>
            <div style={{ fontSize: "1vw" }}>{"Location".toUpperCase()}</div>
            <Select styles={customStyles} placeholder="All States"
                value={location} onChange={e => { setLocation(e); onChangeLocation(e) }}
                options={locations.map(location => {
                    return {
                        value: location.name,
                        label: location.name,
                        id: location.id
                    }
                })}
            />
        </div>} />
}

export default LocationFilter

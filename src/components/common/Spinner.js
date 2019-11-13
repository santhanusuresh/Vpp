import React from 'react';
import spinnerImg from '../../assets/spinner.gif';

const Spinner = () => {
    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <img src={spinnerImg} style={{width:100}}/>
        </div>
    );
}

export default Spinner;
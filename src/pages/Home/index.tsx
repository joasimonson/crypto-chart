import React, { useState } from 'react';

import Chart from '../../components/Chart';
import Header from '../../components/Header';

import './index.css';

function Home() {
    const [coinSelected, setCoinSelected] = useState("BTC");
    
    return (
        <div className="App">
            <Header onSelected={(coin) => setCoinSelected(coin)} />
            <Chart coin={coinSelected} />
        </div>
    );
}

export default Home;

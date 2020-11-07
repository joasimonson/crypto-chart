import * as React from 'react';

import './index.css';

interface LegendProps {
    legend: string
};

export default function Legend(props: LegendProps) {
    return (
        <div className="Legend">
            {props.legend}
        </div>
    );
};
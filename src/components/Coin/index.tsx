import React from "react";
import "./index.css";

interface CoinProps {
    coin: string;
    oldPrice: number;
    currentPrice: number;
}

export default function Coin(props: CoinProps) {
    const { coin, oldPrice, currentPrice } = props;
    const classes = ['Coin'];

    if (oldPrice < currentPrice) {
        classes.push('up');
    }

    if (oldPrice > currentPrice) {
        classes.push('down');
    }

    return (
        <div className={classes.join(' ')}>
            <span>{coin}</span>
            <span>R$ {currentPrice.toLocaleString()}</span>
        </div>
    );
};

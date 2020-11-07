import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, ISeriesApi } from "lightweight-charts";

import { api } from "../../services/api";
import Legend from "../Legend";

import "./index.css";

interface ChartProps {
    coin: string;
}

export default function Chart(props: ChartProps) {
    const { coin } = props;
    
    const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const candleSeriesRef = useRef() as MutableRefObject<ISeriesApi<"Candlestick">>;

    const [prices, setPrices] = useState<any[]>([]);
    const [chartLoaded, setChartLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            api
                .get(`histominute?fsym=${coin}&tsym=BRL&limit=1`)
                .then((response) => {
                    setPrices((prevState) => {
                        const price = response.data.Data[1];

                        const newPrice = {
                            time: price.time,
                            low: price.low,
                            high: price.high,
                            open: price.open,
                            close: price.close,
                            volume: price.volumefrom,
                        };

                        candleSeriesRef.current.update(newPrice);

                        return [...prevState, newPrice]
                    });
                });
        }, 60000);

        return () => clearInterval(interval);
    }, [coin]);

    useEffect(() => {
        if (!chartLoaded) {
            return;
        }

        api
            .get(`histoday?fsym=${coin}&tsym=BRL&limit=300`)
            .then((response) => {
                const prices = response.data.Data.map((row: any) => ({
                    time: row.time,
                    low: row.low,
                    high: row.high,
                    open: row.open,
                    close: row.close,
                    volume: row.volumefrom,
                }));
                setPrices(prices);
            });
    }, [coin, chartLoaded]);

    useEffect(() => {
        if (candleSeriesRef.current) {
            candleSeriesRef.current.setData(prices);
        }
    }, [prices]);

    useEffect(() => {
        setPrices([]);
    }, [coin]);

    useEffect(() => {
        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            layout: {
                backgroundColor: "#253248",
                textColor: "rgba(255,255,255,0.9)",
            },
            grid: {
                vertLines: {
                    color: "#334158",
                },
                horzLines: {
                    color: "#334158",
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            //@ts-ignore
            priceScale: {
                borderColor: "#485c7b",
            },
            timeScale: {
                borderColor: "#485c7b",
            },
        });

        candleSeriesRef.current = chart.addCandlestickSeries({
            upColor: "#4bffb5",
            downColor: "#ff4976",
            borderDownColor: "#ff4976",
            borderUpColor: "#4bffb5",
            wickDownColor: "#838ca1",
            wickUpColor: "#838ca1",
        });
        setChartLoaded(true);
    }, []);

    return (
        <div className="Chart" ref={containerRef}>
            <Legend legend={coin} />
        </div>
    );
};

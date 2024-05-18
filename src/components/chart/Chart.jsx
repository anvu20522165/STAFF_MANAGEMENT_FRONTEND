import './chart.scss';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';

const data = [
    { month: 1, total: 0 },
    { month: 2, total: 0 },
    { month: 3, total: 800 },
    { month: 4, total: 0 },
    { month: 5, total: 0 },
    { month: 6, total: 0 },
];

const Chart = ({ aspect, title }) => {
    var showYear = new Date();
    var displayCurrentYear = showYear.getFullYear();
    console.log(displayCurrentYear);
    const [earning, setEarning] = useState([]);
    const loadEarning = async () => {
        axios
            .get(`https://uitcinema.devhungops.website/api/statistics/getTotalEachMonth/${displayCurrentYear}`)
            .then((response) => {
                setEarning(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        loadEarning();
    }, []);

    const data = [
        { month: 1, total: 200000 },
        { month: 2, total: 800000 },
        { month: 3, total: 18050000 },
        { month: 4, total: 3500000 },
        { month: 5, total: 8000000 },
        { month: 6, total: 15500000 },
    ];

    return (
        <div className="chart">
            <div className="title">{title}</div>
            <ResponsiveContainer width="100%" aspect={aspect}>
                <AreaChart width={730} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="gray" />
                    <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;

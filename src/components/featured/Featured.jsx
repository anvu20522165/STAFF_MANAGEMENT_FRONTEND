import './featured.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
const targetMoney = 55550000;

const Featured = () => {
    //Date
    var showMonth = new Date();
    var displayCurrentMonth = showMonth.getMonth() + 1;

    var showYear = new Date();
    var displayCurrentYear = showYear.getFullYear();

    //Data
    const [earning, setEarning] = useState([]);
    const [percentThisMonth, setPercentThisMonth] = useState(70);
    const [earningThisMonth, setEarningThisMonth] = useState(80000000);
    const loadEarning = async () => {
        await axios
            .get(`https://uitcinema.devhungops.website/api/statistics/getTotalEachMonth/${displayCurrentYear}`)
            .then((response) => {
                setEarning(response.data);
                console.log(response.data);

                const money = response.data[displayCurrentMonth - 1].total;
                setEarningThisMonth(money);

                const percent = (money * 100) / targetMoney;
                const percentFinal = Math.round(percent * 100) / 100;
                setPercentThisMonth(percentFinal);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        loadEarning();
    }, []);

    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Doanh thu công ty tháng {displayCurrentMonth}</h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar
                        value={percentThisMonth}
                        text={percentThisMonth.toString() + '%'}
                        strokeWidth={5}
                    />
                </div>
                <p className="title">So với tháng trước </p>
                <p className="amount">
                    {earningThisMonth?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                </p>
                <p className="desc">Đây là doanh thu tháng hiện tại. Không bao gồm tháng khác.</p>
                <div className="summary">
                    {/* <div className="item">
                        <div className="itemTitle">Giá trị</div>
                        <div className="itemResult positive">
                            <div className="resultAmount">
                                {targetMoney?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Featured;

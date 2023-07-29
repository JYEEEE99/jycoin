import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";

interface IHistoryData {
  time_open: string;
time_close: string;
open: number;
high: number;
low: number;
close: number;
volume: number;
market_cap: string;
}

interface ChartProps {
  coinId: string;
}
function Chart({coinId}:ChartProps) {
  const {isLoading, data} = useQuery<IHistoryData[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId))
    return (
    <div>
      {isLoading ? "Loacidng chart..." : 
      <ApexCharts 
      type="line" 
      series={[
        {
          name: "price",
          data: data? data.map(price => price.close) : []
        }
      ]}
      options={{
        theme: {
          mode: 'dark',
          
      },
        chart: {
          height: 300,
          width: 500,
          toolbar: {
            show: false,
          },
          background: "transparent",
        },
        grid: {show: false},
        stroke: {
          curve: "smooth",
          width: 3,
        },
        yaxis:{
          show:false
        },
        xaxis:{
          labels: {show: false},
          axisTicks: {show: false},
          axisBorder: {show:false},
          categories: data?.map(price => price.time_close),
          type: "datetime",
        },
        fill: {
          type: "gradient", 
          gradient: {gradientToColors: ["#1D5D9B"], stops: [0, 100]},
      },
      colors: ["#F4D160"],
      tooltip: {
        y: {
          formatter: (value) => `$ ${value.toFixed(3)}`
        }
      }
      }}/>}
    </div>
    )
  }
  
  export default Chart;
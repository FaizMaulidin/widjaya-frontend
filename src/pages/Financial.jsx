import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, Legend, scales } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import TopSelling from './utils/TopSelling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'

const Financial = ({setSelected}) => {
    const [paintedFinancial, setPaintedFinancial] = useState(false)
    const [graphData, setGraphData] = useState()
    const [timeGraph, setTimeGraph] = useState({
        period: 'm',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })
    const [topSelling, setTopSelling] = useState()
	const [assets, setAssets] = useState()
	

    useEffect(() => {
        setSelected("Financial") 
		fetchAssets()   
        setTimeout(() => {
            setPaintedFinancial(true)
        }, 100);
    }, [])
    useEffect(() => {
        handleGraph()
        handleTopSelling()
    }, [timeGraph])

	const fetchAssets = async() => {
		try{
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/item/ASC/AllItems`)
            const totalAssets = res.data.reduce((assets, item) => {
				const itemAssets = JSON.parse(item.batchInfo).reduce((batchAssets, batch) => {
					return batchAssets + (batch.qty * batch.price)
				}, 0)
				return assets + itemAssets
			}, 0)
			setAssets(totalAssets)
        } catch(error){
            console.error(error)
        }
	}

    const handleGraph = async() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}financial/stats/${timeGraph.period}/${timeGraph.month}/${timeGraph.year}`)
            setGraphData(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleTopSelling = async() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}financial/top-selling/${timeGraph.period}/${timeGraph.month}/${timeGraph.year}`)
            setTopSelling(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', ' Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des']
    const monthOpt = () => {
        let today = new Date()
        today.setDate(1)
        const first = new Date(today.getFullYear() - 1, today.getMonth(), 1)
        let res = []
        while(today.toLocaleDateString() !== first.toLocaleDateString()){
            res.push({
                month: today.getMonth(),
                year: today.getFullYear()
            })
            today.setMonth(today.getMonth() - 1)
        }
        
        return res
    }
    const yearOpt = () => {
        let today = new Date()
        const first = new Date(2023, 0, 1)
        let res = []
        while(today.getFullYear() >= first.getFullYear()){
            res.push(today.getFullYear())
            today.setFullYear(today.getFullYear() - 1)
        }
        return res
    }

    return (
      <div className={'py-4 px-4 h-full relative transition-all duration-500 flex flex-col gap-3' + (paintedFinancial ? "" : " opacity-0 translate-y-10")}>
        <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-4xl font-bold text-defblue'>Financial</h1>
            </div>
            <div className='bg-transparent flex items-center gap-2'>
                <select onChange={(e) => {
                    setTimeGraph({month: new Date().getMonth() + 1,
                        year: new Date().getFullYear(), period: e.target.value})
                }}
                className=' px-4 h-full rounded cursor-pointer outline-none text-center bg-defblue text-white'>
                    <option value="m">Monthly</option>
                    <option value="y">Yearly</option>
                </select>
                {timeGraph.period === 'm'
                    ? <select onChange={(e) => {
                        setTimeGraph(JSON.parse(e.target.value))
                    }} className=' w-32 outline-none h-full border border-grayborderdim rounded cursor-pointer text-center bg-transparent'>
                        {monthOpt().map((data, i) => {
                            return <option key={i} value={`{"period":"${timeGraph.period}","month":${data.month+1},"year":${data.year}}`}>{months[data.month]} {data.year}</option>
                        })}
                    </select>
                    : <select onChange={(e) => {
                        setTimeGraph(JSON.parse(e.target.value))
                    }} className='w-32 outline-none h-full text-center border border-grayborderdim rounded cursor-pointer bg-transparent'>
                        {yearOpt().map(data => {
                            return <option key={data} value={`{"period":"${timeGraph.period}","month":0,"year":${data}}`}>{data}</option>
                        })}
                    </select>
                }
            </div>
        </div>
        <div className="flex items-center w-full h-72 gap-3">
            <div className='bg-white border border-grayborderdim rounded-sm flex justify-center items-center shadow-input h-full w-1/2 p-4 relative flex-col'>
                <h1 className='font-semibold text-defblue text-base absolute top-4'>Revenue and Expenses Graph</h1>
                <Line
                    options={{
                        scales:{
                            y:{
                                min: 0,
                                max: graphData?.maxY,
                                ticks:{
                                    callback: function(value) {
                                        return 'Rp' + parseInt(value).toLocaleString();
                                    }
                                }
                            },
                            x: {
                                ticks:{
                                    callback: (value, index, ticks) => {
                                        if(timeGraph.period === 'm'){
                                            return (value + 1) + ' ' + months[graphData.month - 1]
                                        } else{
                                            return months[value] + ' ' + timeGraph.year
                                        }
                                    },
                                    autoSkipPadding: 8,
                                    maxRotation: 0
                                }
                            },
                            
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins:{
                            title: {
                                display: true
                            },
                            tooltip: {
                                callbacks: {
                                    title: (data) => {
                                        let res = ''
                                        if(timeGraph.period === 'm'){
                                            data.forEach(el => {
                                                res = el.label + ' ' + months[graphData.month - 1]
                                            })
                                        } else {
                                            data.forEach(el => {
                                                res = el.label + ' ' + timeGraph.year
                                            })
                                        }
                                        return res
                                    },
                                    label: (data) => {
                                        return data.dataset.label + ': ' + 'Rp' + data.formattedValue
                                    }
                                }
                            }
                        }
                    }}
                    data={{
                        labels: graphData?.labels,
                        datasets:[
                            {
                                label:"Revenue",
                                data: graphData?.incomeData,
                                tension: 0.5,
                                borderColor: "rgb(22, 163, 74)",
                                backgroundColor: "rgba(22, 163, 74, 0.2)",
                                fill: true,
                                pointRadius: 2,
                                pointBackgroundColor: "rgb(22, 163, 74)",
                                borderWidth: 2,
                            },
                            {
                                label:"Expenses",
                                data:graphData?.expData,
                                tension: 0.5,
                                pointRadius: 2,
                                pointBackgroundColor: "rgb(220, 38, 38)",
                                borderWidth: 2,
                                borderColor: "rgb(220, 38, 38)",
                                backgroundColor: "rgba(220, 38, 38, 0.2)",
                                fill: true
                            },
                        ]
                    }}
                />
            </div>
            <div className='h-full flex-grow gap-3 grid grid-cols-2 grid-rows-2 text-white'>
                <div className='rounded-sm shadow-input flex flex-col  p-4 items-center font-semibold bg-green-600 text-lg relative'>
                    <h1 className=''>Total Revenue</h1>
                    <h2 className=' text-2xl  font-bold flex-grow flex items-center'>Rp{graphData?.totalIncome.toLocaleString()}</h2>
                </div>
                <div className='rounded-sm shadow-input flex bg-red-600 flex-col  p-4 items-center font-semibold relative'>
                    <h1 className=''>Total Expenses</h1>
                    <h2 className=' text-2xl font-bold flex-grow flex items-center'>Rp{graphData?.totalExp.toLocaleString()}</h2>
                </div>
                <div className='bg-white rounded-sm shadow-input flex flex-col border border-grayborderdim p-4 items-center font-semibold text-lg relative'>
                    <h1 className='text-blackop'>Net Profit</h1>
                    <h2 className=' text-2xl font-bold text-green-600 flex-grow flex items-center'>Rp{graphData?.profit.toLocaleString()}</h2>
                </div>
                <div className=' bg-white rounded-sm shadow-input border border-grayborderdim flex flex-col p-4 items-center font-semibold text-lg relative text-blackop'>
                    <h1 className=''>Quantity Sold</h1>
                    <h2 className=' text-4xl font-bold flex-grow flex items-center'>{graphData?.qtySold}</h2>
                </div>
            </div>
        </div>
        <div className="flex items-center w-full h-52 gap-3">
            <div className='bg-white rounded-sm shadow-input h-full w-[30%] p-4 pt-2 flex gap-4 flex-col justify-between items-center border border-grayborderdim'>
				<h1 className='font-semibold text-defblue text-lg pb-1 w-full text-center border-b border-grayborder'>Assets Details</h1>
				<div className=' flex flex-col w-full flex-grow gap-2 text-graytext'>
					<div className=' flex-grow flex flex-col justify-center items-center text-sm font-semibold'>
						<h1 className=''>Total Assets In Hand</h1>
						<p className=' text-defblue text-2xl font-bold flex-grow flex items-center'>Rp{assets?.toLocaleString()}</p>
					</div>
					<div className=' flex-grow flex flex-col justify-center items-center text-sm font-semibold'>
						<h1 className=''>Potential Sales Value</h1>
						<p className=' text-defblue text-2xl font-bold flex-grow flex items-center'>Rp{(assets * 135 / 100).toLocaleString()}</p>
					</div>
				</div>
            </div>
            <div className='bg-white rounded-sm shadow-input h-full flex-grow p-4 pt-2 flex gap-4 flex-col justify-between items-center border border-grayborderdim'>
                <h1 className='font-semibold text-defblue text-lg pb-1 w-full text-center border-b border-grayborder'>Top Revenue Items</h1>
                <div className=' w-full flex-grow justify-between flex text-xs gap-1'>
                    {topSelling?.map((item, i) => {
                        return <TopSelling key={i} item={item}/>
                    })}
                </div>
            </div>
        </div>
        <div className="flex items-center flex-grow w-full gap-3">
            <button className='border-2 border-defblue rounded-sm shadow-input h-full w-1/2 flex justify-center items-center gap-2 font-semibold text-defblue hover:scale-[1.02] transition-all hover:shadow-inputhov'>
                <FontAwesomeIcon icon={faFileLines}/>
                Print Transaction Report
            </button>
            <button className='bg-defblue rounded-sm shadow-input h-full flex-grow flex justify-center items-center font-semibold text-white hover:scale-[1.02] transition-all hover:shadow-inputhov gap-2'>
                <FontAwesomeIcon icon={faClockRotateLeft}/>
                See Transaction History
            </button>
        </div>
      </div>
    )
}

export default Financial
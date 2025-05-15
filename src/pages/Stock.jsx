import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import StockList from './inventory/StockList'
import Loading from '../components/Loading'
import Initial from './inventory/InitialStock'
import HeaderBox from './inventory/HeaderBox'
import StockBoxLow from './inventory/StockBoxLow'
import { Chart } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'

const Stock = ({setSelected}) => {
    const [stock, setStock] = useState()
    const [allStock, setAllStock] = useState()
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState({type: 'item', order: 'ASC', search: "AllItems"})
    const [loading, setLoading] = useState(true)
    const [batchState, setBatchState] = useState()
    const [initialStock, setInitialStock] = useState(false)
    const [paintedStock, setPaintedStock] = useState(false)
    const [stockDetails, setStockDetails] = useState({
        totalItems: 0,
        totalQty: 0
    })
    const [lowItems, setLowItems] = useState()
    const [activeItems, setActiveItems] = useState()

    const fetchStock = async({type, order, search}) => {
        const searching = search ? search : "AllItems"
        try {
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/${type}/${order}/${searching}`)
            setStock(res.data)
            
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAllStock = async() => {
        setLoading(true)
        try{
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/item/ASC/AllItems`)
            setAllStock(res.data)
            const active = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}active-items`)
            const totalQty = res.data.reduce((total, item) => {
                return total += item.qty
            }, 0)
            const totalItems = res.data.length
            const low = res.data.filter(item => item.qty < item.threshold)
            setLowItems(low)
            setStockDetails({totalItems: totalItems, totalQty: totalQty})
            setActiveItems(active.data)
        } catch(error){
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStock(sort)
    }, [sort])
    const handleSearch = async(e) => {
        setSort({...sort, search: e.target.value})
        setSearch(e.target.value)
    }
    useEffect(() => {
        setSelected('Inventory')
        fetchAllStock()
        setTimeout(() => {
            setPaintedStock(true)
        }, 100);
    }, [])


    return (
        <div className={'py-6 px-6 h-full flex flex-col gap-4 relative transition-all duration-500 overflow-hidden' + (paintedStock ? "" : " opacity-0 translate-y-10")}>
            {initialStock ? <Initial setInitialStock={setInitialStock} fetchStock={() => fetchStock(sort)} stock={allStock}/> : <></>}
            <div className='flex h-72 gap-4 w-full overflow-hiddn justify-between'>
                <HeaderBox>
                    <div className=' w-[30rem] px-7 py-6 h-full grid grid-cols-3 font-bold text-graytext gap-y-1'>
                        <div className=' flex gap-1 items-center justify-center '>
                            <h3 className=' flex justify-center items-center'>Active Items</h3>
                            <div className='text-xs h-4 w-4 border-2 border-black flex items-center justify-center rounded-full cursor-pointer relative group'>i
                                <p className=' absolute bg-white border border-grayborder shadow-input w-48 rounded-md -z-50 px-3 py-2 text-sm top-4 font-normal opacity-0 transition-all cursor-default group-hover:opacity-100 group-hover:z-10 delay-500 group-hover:top-8 after:w-6 after:h-6 after:bg-white after:rounded-md after:rotate-45 after:content-[""] after:-top-3 after:left-1/2 after:-translate-x-1/2 after:absolute after:border-s after:border-t after:border-grayborder ease-in-out'>
                                    Active Items: Items that sold 3 times or more in the last 30 days.
                                </p>
                            </div>
                        </div>
                        <h3 className=' flex justify-center items-center'>Total Items</h3>
                        <h3 className=' flex justify-center items-center'>Total Quantity</h3>
                        <div className='flex justify-center items-center flex-col gap-2'>
                            <div className=' w-[80%] relative'>
                                <div className=' absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-lg'>
                                {activeItems?.percentage}%</div>
                                <Doughnut 
                                    options={{
                                        plugins:{
                                            legend:{
                                                display: false
                                            }
                                        }
                                    }}
                                    data={{
                                        labels:['Active Items', 'Passive Items'],
                                        datasets:[{
                                            data:[activeItems?.percentage, 100 - activeItems?.percentage],
                                            backgroundColor:['#0C8990', 'rgba(0, 0, 0, 0.3)'],
                                            borderWidth: 0,
                                        }]
                                    }}  
                                        
                                />
                            </div>
                            <button className='text-xs text-blue-700 font-medium cursor-pointer hover:underline'>See active items</button>
                        </div>
                        <h1 className=' flex justify-center items-center text-5xl text-defblue'>{stockDetails.totalItems}</h1>
                        <h1 className=' text-5xl text-defblue flex justify-center items-center'>{stockDetails.totalQty}</h1>
                    </div>
                </HeaderBox>
                <HeaderBox>
                    <div className=' h-full w-[35rem] flex items-center justify-between gap-4 py-4 px-6 overflow-hidden'>
                        <div className='flex flex-col w-36 items-center h-4/6'>
                            <h3 className='font-bold text-red-600'>Low Items</h3>
                            <div className=' flex-grow flex justify-center items-center'>
                                <h1 className=' text-5xl font-bold text-red-600'>{lowItems?.length}</h1>
                            </div>
                        </div>
                        <div className=' flex h-full shadow-inner w-full overflow-x-scroll scroll-custom-hor'>
                            <div className=' flex gap-2 px-4 w-fit py-2'>
                                {lowItems?.map((item, i) => {return <StockBoxLow stock={item} key={i}/>})}
                            </div>
                        </div>
                    </div>
                </HeaderBox>
            </div>
            <div className=' h-[2px] w-full bg-blackop'></div>
            <div className='flex flex-col h-full gap-4 overflow-hidden'>
                <div className='w-full flex items-center gap-20'>
                    <input type="text" placeholder='Search Item' className='outline-none border border-grayborder rounded-lg px-4 py-1 flex-grow' onChange={handleSearch} />
                    <div className='flex gap-4 items-center'>
                        <div className='flex items-center gap-2 font-medium'>Sort : 
                            <select onChange={(e) => setSort(JSON.parse(e.target.value))} name="sort" id="" className=' outline-none border border-grayborder rounded-md py-2 font-normal px-4 cursor-pointer'>
                                <option value={`{"type":"item","order":"ASC", "search": "${search}"}`}>Item</option>
                                <option value={`{"type":"qty","order":"ASC", "search": "${search}"}`}>Quantity</option>
                                <option value={`{"type":"avgPrice","order":"DESC", "search": "${search}"}`}>Highest Price</option>
                                <option value={`{"type":"avgPrice","order":"ASC", "search": "${search}"}`}>Lowest Price</option>
                            </select>
                        </div>
                        <button onClick={() => setInitialStock(true)} className='bg-defblue rounded-lg px-4 hover:bg-defbluehov transition-all py-2 text-white font-medium'>+ Add Initial Stock</button>
                    </div>
                </div>
                <div className=' overflow-hidden flex flex-col'>
                    <div className='flex h-fit py-2 px-4 gap-2 bg-neutral-300 font-medium rounded-t-lg'>
                        <div className='w-[6%] flex'>Batch</div>
                        <div className='w-[13%] '>Code</div>
                        <div className='w-[20%] '>Item</div>
                        <div className='w-[15%] flex justify-center'>Brand</div>
                        <div className='w-[7%] flex justify-center'>Quantity</div>
                        <div className='w-[19%] flex justify-center'>Avg. Purchase Price</div>
                        <div className=' flex-grow flex justify-center'>Quantity Threshold</div>
                    </div>
                    <div className='flex flex-col overflow-y-auto scroll-custom flex-grow justify-start gap-0'>
                        {loading ? <Loading/> : (stock?.length > 0 ? stock.map(s => {
                            return <StockList stock={allStock} s={s} key={s.code} setBatchState={setBatchState} batchState={batchState} fetchStock={() => fetchStock(sort)} fetchAllStock={fetchAllStock}/>
                        }) : <h1 className='py-8 text-lg text-center'>Item not found.</h1>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stock
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const History = ({setHistory, transactions, months, timeGraph}) => {
    const [transSelect, setTransSelect] = useState('')
    let period = ''
    switch(timeGraph.period){
        case 't':
            period = 'Today'
            break
        case 'w':
            period = 'This Week'
            break
        case 'm':
            period = `${months[timeGraph.month - 1]} ${timeGraph.year}`
            break
        case 'y':
            period = `${timeGraph.year}`
            break
    }

    return (
        <div className=' absolute top-0 left-0 flex w-full h-screen justify-center items-center bg-blackop z-10 text-black'>
            <AnimatePresence>
                <motion.div 
                initial={{
                    opacity: 0,
                    y: 50
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    y: 50
                }}
                className=' bg-white h-5/6 w-5/6 rounded-lg p-6 flex flex-col overflow-hidden'>
                    <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-4xl font-bold text-defblue'>Transaction History ({period})</h1>
                        </div>
                        <button onClick={() => setHistory(false)} className='font-semibold h-8 w-8 text-lg rounded-full border-[2px] border-black opacity-70'>X</button>
                    </div>
                    <div className='w-full h-[90%] flex pt-4'>
                        <div className='w-7/12 p-3 px-2 flex flex-col gap-2 overflow-hidden flex-nowrap'>
                            <div className='w-full h-full overflow-y-auto scroll-custom p-2 flex flex-col gap-2'>
                                {transactions?.map((item, i) => {
                                    const DBdatetime = new Date(item.datetime)
                                    const datetime = new Date(DBdatetime.getTime() + 7 * 60 * 60 * 1000)
                                    const date = `${datetime.getDate()} ${months[datetime.getMonth()]} ${datetime.getFullYear()}`
                                    const hours = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours()
                                    const minutes = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()
                                    const length = JSON.parse(item.items).length
                                    return <button onClick={() => setTransSelect(item.code)} key={i} className={clsx('w-full bg-white rounded-sm shadow-input flex justify-between gap-1 p-2 py-4 text-sm items-center transition-all cursor-pointer hover:bg-grayborderdim h-20',{"bg-grayborderdim": item.code === transSelect})}>
                                        <div className='flex gap-2 flex-col justify-between h-full'>
                                            <p className='font-semibold text-neutral-600 opacity-90'>{item.code}</p>
                                            <span className='text-xs flex gap-2'><p>{date}</p><p>{hours}:{minutes}</p></span>
                                        </div>
                                        <div className={clsx('flex gap-1 flex-col items-center text-xs italic h-full',{"justify-center": item.trans_type === "sales", "justify-between": item.trans_type === "batch"})}>
                                            {item.trans_type === "batch" ? <p>{item.supplier}</p> : <></>}
                                            <p>({length} Item{length > 1 ? "s" : ""})</p>
                                        </div>
                                        <div className='flex gap-2 flex-col items-end justify-between h-full'>
                                            <p className='text-xs text-graytext'>{item.trans_type === "sales" ? "Total Sales" : "Total Expenses"}</p>
                                            <p className={clsx('font-semibold',{"text-green-600": item.trans_type === "sales", "text-red-600": item.trans_type === "batch"})}>Rp {item.total_price.toLocaleString()}</p>
                                        </div>
                                    </button>
                                })}
                            </div>
                        </div>
                        <div className=' flex-grow flex flex-col gap-4'>
                            <div className='w-full h-[83%] overflow-y-hidden p-4 flex flex-col gap-2 border-l-2 border-b-2 border-grayborder'>
                                {transSelect ? transactions?.map(item => {
                                    if(item.code === transSelect){
                                        const DBdatetime = new Date(item.datetime)
                                        const datetime = new Date(DBdatetime.getTime() + 7 * 60 * 60 * 1000)
                                        const date = `${datetime.getDate()} ${months[datetime.getMonth()]} ${datetime.getFullYear()}`
                                        const hours = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours()
                                        const minutes = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()
                                        const length = JSON.parse(item.items).length
                                        return <div key={item.code} className='flex flex-col'>
                                            <div className='flex justify-between items-center font-semibold'>
                                                <h1 className='text-defblue opacity-90'>{item.code}</h1>
                                                <h2 className={clsx("text-sm",{"text-green-600": item.trans_type === "sales", "text-red-600": item.trans_type === "batch"})}>{item.trans_type === "sales" ? "Debit" : "Credit"}</h2>
                                            </div>
                                            <h2 className='text-xs'>{date} {hours}:{minutes}</h2>
                                            <div className='justify-self-center'>
                                                <h2 className='font-semibold text-neutral-600 text-sm mt-4'>Items Details</h2>
                                                <div className='flex justify-between items-center gap-2 text-xs font-semibold opacity-90 mt-2'>
                                                    <h2 className='w-[40%]'>Item Name</h2>
                                                    <h2 className='w-[10%] text-center'>Qty</h2>
                                                    <h2 className='w-[25%] text-center'>Price</h2>
                                                    <h2 className='w-[25%] text-right pr-2'>Total</h2>
                                                </div>
                                                <div className='flex flex-col gap-1.5 mt-2 max-h-48 overflow-y-auto scroll-custom'>
                                                    {JSON.parse(item.items).map((item, i) => {
                                                        return <div key={i} className='flex justify-between items-center gap-2 text-xs'>
                                                            <h2 className='w-[40%]'>{item.item}</h2>
                                                            <h2 className='w-[10%] text-center'>{item.qty}</h2>
                                                            <h2 className='w-[25%] text-center'>Rp {item.price.toLocaleString()}</h2>
                                                            <h2 className='w-[25%] text-right'>Rp {(item.qty * item.price).toLocaleString()}</h2>
                                                        </div>
                                                    })}
                                                </div>
                                                <div className='flex justify-between items-center gap-2 text-xs py-2 mt-4 border-t border-grayborder'>
                                                    <h2 className='w-[40%]'>Total Price</h2>
                                                    <h2 className='w-[25%] text-right'>Rp {item.total_price.toLocaleString()}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                }): <div className='text-2xl flex justify-center font-semibold text-lg text-center h-full items-center'>Select a transaction to view details.</div>}

                            </div>
                            <button className='flex-grow bg-defblue text-white w-full font-semibold hover:bg-defbluehov transition-all duration-300'>Print Transaction History</button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default History
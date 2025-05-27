import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const History = ({setHistory, transactions, months}) => {
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
                            <h1 className='text-4xl font-bold text-defblue'>Transaction History</h1>
                        </div>
                        <button onClick={() => setHistory(false)} className='font-semibold h-8 w-8 text-lg rounded-full border-[2px] border-black opacity-70'>X</button>
                    </div>
                    <div className='w-full h-[90%] flex pt-4'>
                        <div className='w-7/12 p-3 border-r-2 border-grayborder px-2 flex flex-col gap-2 overflow-hidden flex-nowrap'>
                            <div className='w-full h-full overflow-y-auto scroll-custom p-2 flex flex-col gap-2'>
                                {transactions?.map((item, i) => {
                                    const DBdatetime = new Date(item.datetime)
                                    const datetime = new Date(DBdatetime.getTime() + 7 * 60 * 60 * 1000)
                                    const date = `${datetime.getDate()} ${months[datetime.getMonth()]} ${datetime.getFullYear()}`
                                    const hours = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours()
                                    const minutes = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()
                                    const length = JSON.parse(item.items).length
                                    return <div key={i} className='w-full bg-white rounded-sm shadow-input flex justify-between gap-1 p-2 py-4 text-sm items-center transition-all cursor-pointer hover:bg-grayborderdim h-20'>
                                        <div className='flex gap-2 flex-col justify-between h-full'>
                                            <p className='font-semibold text-neutral-600 opacity-90'>{item.code}</p>
                                            <p className='text-xs flex gap-2'><p>{date}</p><p>{hours}:{minutes}</p></p>
                                        </div>
                                        <div className={clsx('flex gap-1 flex-col items-center text-xs italic h-full',{"justify-center": item.trans_type === "sales", "justify-between": item.trans_type === "batch"})}>
                                            {item.trans_type === "batch" ? <p>{item.supplier}</p> : <></>}
                                            <p>({length} Item{length > 1 ? "s" : ""})</p>
                                        </div>
                                        <div className='flex gap-2 flex-col items-end justify-between h-full'>
                                            <p className='text-xs text-graytext'>{item.trans_type === "sales" ? "Total Sales" : "Total Expenses"}</p>
                                            <p className={clsx('font-semibold',{"text-green-600": item.trans_type === "sales", "text-red-600": item.trans_type === "batch"})}>Rp {item.total_price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className=' flex-grow'></div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default History
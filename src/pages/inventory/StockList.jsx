import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const StockList = ({s, setBatchState, batchState, fetchStock, fetchAllStock}) => {
    const state = batchState === s.code
    const price = s.avgPrice.toLocaleString()
    const batchInfo = JSON.parse(s.batchInfo)
    const [loading, setLoading] = useState(false)
    const ref = useRef()

    const handleThreshold = async(mode) => {
        try {
            setLoading(true)
            await axios.put(`${import.meta.env.VITE_DB_ENDPOINT}stock/${mode}`, {code: s.code, threshold: s.threshold})
            fetchStock()
            fetchAllStock()
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className=' items-center leading-none'>
            <div onClick={() => {state ? setBatchState(null) : setBatchState(s.code)}} className={'flex h-fit py-4 px-4 gap-2 transition-all cursor-pointer items-center' + (state ? ' bg-defblueop': ' bg-white hover:bg-neutral-100')}>
                <div className='w-[6%] flex'>
                    <button className={'px-1 font-semibold' + (state ? ' rotate-90' : "" )} >{'>'}</button>
                </div>
                <div className='w-[13%] text-nowrap overflow-hidden'>{s.code}</div>
                <div className='w-[20%] text-nowrap overflow-hidden'>{s.item}</div>
                <div className='w-[15%] flex justify-center text-nowrap overflow-hidden'>{s.brand}</div>
                <div className='w-[7%] flex justify-center text-nowrap overflow-hidden'>{s.qty}</div>
                <div className='w-[19%] flex justify-between px-10'><p>Rp</p>{price}</div>
                <div className=' flex gap-1 items-center justify-between flex-grow px-6 '>
                    <button disabled={s.threshold < 1} onClick={(e) => {e.stopPropagation();handleThreshold('-')}} className=' rounded-full h-6 w-6 text-lg font-medium text-defblue border border-defblue flex justify-center items-center disabled:text-blackop hover:disabled:bg-transparent disabled:border-blackop hover:bg-defblue hover:text-white transition-all'>-</button>
                    <h1 className={' flex-grow text-center' + (loading ? ' animate-ping' : '')}>{s.threshold}</h1>
                    <button onClick={(e) => {e.stopPropagation();handleThreshold('+')}} className=' rounded-full h-6 w-6 text-lg font-medium text-defblue border border-defblue flex justify-center items-center hover:bg-defblue hover:text-white transition-all'>+</button>
                </div>
            </div>
            <AnimatePresence>
                {state &&
                    <motion.div 
                    initial={{
                        opacity: 0,
                        scaleY: 0,
                    }}
                    animate={{
                        opacity: 1,
                        scaleY: 1,
                    }}
                    exit={{
                        opacity:0,
                        scaleY: 0,
                    }}
                    ref={ref} className={' px-4 bg-defblueop text-sm h-fit transition-all origin-top overflow-hidden'}>
                        {batchInfo.length > 0 ? <div className='flex h-fit py-2 font-medium justify-between text-graytext gap-2 px-8'>
                            <div className='w-[25%]'>Batch</div>
                            <div className='w-[25%] flex justify-center'>Supplier</div>
                            <div className='w-[25%] flex justify-center'>Quantity</div>
                            <div className='w-[25%] flex justify-end'>Purchase Price</div>
                        </div> : <div className='italic flex justify-center py-2 text-graytext'>There's no batch for this product.</div>}
                        {batchInfo.length > 0 && <div className='w-full bg-grayborder h-[1px]'></div>}
                        {batchInfo.map(batch => {
                            return <div key={batch.batch} className=' h-fit py-2 justify-between flex text-graytext gap-2 px-8'>
                                <div className='w-[25%]'>{batch.batch == 'Initial Stock' ? batch.batch : 'Batch-' + batch.batch}</div>
                                <div className='w-[25%] flex justify-center'>{batch.supplier}</div>
                                <div className='w-[25%] flex justify-center'>{batch.qty}</div>
                                <div className='w-[25%] flex justify-between pl-28'><p>Rp</p>{batch.price.toLocaleString()}</div>
                            </div>
                        })}
                    </motion.div>
                }
            </AnimatePresence>
            <div className='w-full bg-defblue h-[1px]'></div>
        </div>
    )
}

export default StockList
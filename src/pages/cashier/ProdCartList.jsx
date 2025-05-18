import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import SurePop from '../common/SurePop'
import { AnimatePresence, motion } from 'framer-motion'

const ProdCartList = ({item, fetchCart, mode, batchSelected, stock}) => {
    const [loading, setLoading] = useState(false)
    const [sureRemove, setSureRemove] = useState(false)
    const [surePop, setSurePop] = useState(false)
    const batchInfo = stock ? JSON.parse(stock.batch_info) : []
    const prod = useRef()

    const handleMin = async(e) => {
        try {
            if((item.qty > 1) === !sureRemove){
                setLoading(true)
                const data = mode === 'cashier' ? {code: item.code, batch: item.batch} : {code: item.code}
                await axios.put(import.meta.env.VITE_DB_ENDPOINT + 'cart/'+ mode +'/-', data)
                setSurePop(false)
                setSureRemove(false)
                fetchCart()
            } else {
                setSurePop(true)
                setSureRemove(true)
            }
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }
    const handlePlus = async() => {
        const thisBatch = item.batch === 0 ? "Initial Stock" : item.batch
        const itemBatch = batchInfo.filter(batch => batch.batch === thisBatch)[0]
        if(mode === 'cashier' && item.qty >= itemBatch.qty){
            prod.current.classList.add('bg-red-100')
            setTimeout(() => {
                prod.current.classList.remove('bg-red-100')
            }, 500);
        } else {
            try {
                setLoading(true)
                const data = mode === 'cashier' ? {code: item.code, batch: item.batch} : {code: item.code}
                await axios.put(import.meta.env.VITE_DB_ENDPOINT + 'cart/'+mode+'/+', data)
                fetchCart()
            } catch (error) {
                console.error(error)
            } finally{
                setLoading(false)
            }
        }
    }

    return (
            <div
            ref={prod} className=' py-2 px-3 flex justify-between text-sm text-black border-b border-grayborder items-center transition-all'>
                <div className='text-xs flex-col flex text-nowrap overflow-hidden'>
                    <h1 className=' font-medium'>{item.item}</h1>
                    <div className='flex text-[0.7rem] gap-2'>
                        <p className=' opacity-70'>@{item.price.toLocaleString()}</p>
                        <p className=' font-medium text-defblue'>Rp {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                </div>
                {mode === 'cashier' &&
                    <div className='text-xs border border-defblue text-defblue opacity-40 py-0.5 px-2'>{item.batch === 0 ? "Initial Stock" : "Batch-" + item.batch}</div>
                }
                <div className=' flex gap-1 items-center justify-between w-20'>
                    <button disabled={loading || surePop} onClick={handleMin} className=' rounded-full h-5 w-5 text-lg font-medium text-black border border-black flex justify-center items-center'>-</button>
                    <h1 className={' flex-grow text-center' + (loading ? ' animate-ping' : '')}>{item.qty}</h1>
                    <button onClick={handlePlus} className=' rounded-full h-5 w-5 text-lg font-medium text-black border border-black flex justify-center items-center'>+</button>
                </div>
                <SurePop text={"Are you sure you want to remove this item from the cart?"} surePop={surePop} setSurePop={setSurePop} setSure={setSureRemove} yesNclose={handleMin}/>
            </div>
    )
}

export default ProdCartList
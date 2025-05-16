import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../components/Loading'
import BatchList from './restock/BatchList'
import NewBatch from './restock/NewBatch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTag } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'

const Restock = ({setSelected}) => {
    const [batch, setBatch] = useState()
    const [loading, setLoading] = useState(true)
    const [itemState, setItemState] = useState(true)
    const [newBatch, setNewBatch] = useState(false)
    const [paintedClass, setPaintedClass] = useState(false)
    
    const fetchBatch = async () => {
        setLoading(true)
        try {
            const res = await axios.get(import.meta.env.VITE_DB_ENDPOINT + "batch")
            setBatch(res.data.reverse())
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        setSelected('Restock')
        fetchBatch()
        setTimeout(() => {
            setPaintedClass(true)
        }, 100);

        return () => {
            setPaintedClass(false)
        }
    }, [])

    return (
        <div className={'py-12 px-6 h-full relative transition-all duration-500' + (paintedClass ? "" : " opacity-0 translate-y-10")}>
            <div className='flex flex-col h-full gap-3 '>
                <div className='w-full flex items-center justify-between'>
                    <h1 className=' text-2xl font-semibold'>Restock Batch History</h1>
                    <div className='flex gap-3 items-center'>
                        <button className='py-2 rounded-md border border-defblue hover:bg-defbluehov text-defblue font-medium px-4 transition-all flex gap-2 items-center hover:text-white'>
                            <FontAwesomeIcon icon={faUserTag}/>
                            Supplier Quotation
                        </button>
                        <button onClick={() => setNewBatch(true)} className='py-2 rounded-md bg-defblue hover:bg-defbluehov text-white font-medium px-4 transition-all'>+ Add New Batch</button>
                    </div>
                </div>
                <div className=' overflow-hidden flex flex-col'>
                    <div className='flex h-fit py-2 px-8 gap-2 bg-neutral-300 font-medium rounded-t-lg'>
                        <div className='w-[7%] '>Items</div>
                        <div className='w-[18%] '>Date</div>
                        <div className='w-[20%] flex'>Batch</div>
                        <div className='w-[35%] flex justify-center'>Supplier</div>
                        <div className='w-[20%] flex justify-end'>Purchase Amount</div>
                    </div>
                        <div className='flex flex-col overflow-y-auto scroll-custom flex-grow justify-start gap-0'>
                            {loading ? <Loading/> : batch.map((b, i) => {
                                return <BatchList batch={b} key={b.batch} setItemState={setItemState} itemState={itemState} index={i}/>
                            })}
                        </div>
                </div>
            </div>
            {newBatch ? <NewBatch setNewBatch={setNewBatch} fetchBatch={fetchBatch} />: <></>}
        </div>
    )
}

export default Restock
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BatchList = ({batch, itemState, setItemState, index}) => {
    const state = itemState === batch.batch
    const batchItems = JSON.parse(batch.items)
    const date = new Date(batch.date)

    return (
        <div className=' items-center leading-none'>
            <div onClick={() => {state ? setItemState(null) : setItemState(batch.batch)}} className='flex h-fit py-4 px-8 gap-2 hover:bg-defblue hover:text-white transition-all cursor-pointer'>
                <div className='w-[7%] flex'>
                    <div className={'px-1 font-semibold' + (state ? ' rotate-90' : "" )} >{'>'}</div>
                </div>
                <div className='w-[18%] text-nowrap overflow-hidden'>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}</div>
                <div className='w-[20%] text-nowrap overflow-hidden flex'>Batch-{batch.batch}</div>
                <div className='w-[35%] flex justify-center text-nowrap overflow-hidden'>{batch.supplier}</div>
                <div className='w-[20%] flex justify-between pl-16'><p>Rp</p>{batch.totalPrice?.toLocaleString()}</div>
            </div>
            <AnimatePresence>
                {state && <motion.div 
                initial={{
                    opacity: 0,
                    scaleY: 0,
                }}
                animate={{
                    opacity: 1,
                    scaleY: 1,
                }}
                className={' px-4 bg-defblueop text-sm h-fit transition-all origin-top overflow-hidden'}>
                    <div className='flex h-fit py-2 font-medium justify-between text-graytext gap-2 px-8'>
                        <div className='w-[14%]'>Code</div>
                        <div className='w-[20%] flex'>Item</div>
                        <div className='w-[20%] flex justify-center'>Brand</div>
                        <div className='w-[20%] flex justify-center'>Quantity</div>
                        <div className='w-[20%] flex justify-end'>Purchase Price</div>
                    </div>
                    <div className='w-full bg-grayborder h-[1px]'></div>
                    {batchItems.map((item, i) => {
                        const bgCol = i % 2 === 0 ? "" : " bg-defblueop"
                        return <div key={item.code} className={' h-fit py-2 justify-between flex text-graytext gap-2 px-8' + bgCol}>
                            <div className='w-[14%]'>{item.code}</div>
                            <div className='w-[20%] flex'>{item.item}</div>
                            <div className='w-[20%] flex justify-center'>{item.brand}</div>
                            <div className='w-[20%] flex justify-center'>{item.qty}</div>
                            <div className='w-[20%] flex justify-between pl-24'><p>Rp</p>{item.price.toLocaleString()}</div>
                        </div>
                    })}                
                </motion.div>}
            </AnimatePresence>
            <div className='w-full bg-defblue h-[1px]'></div>
        </div>
    )
}

export default BatchList
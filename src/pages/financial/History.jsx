import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const History = ({setHistory, transactions}) => {
    console.log(transactions)
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
                className=' bg-white h-5/6 w-5/6 rounded-lg p-6 flex flex-col'>
                    <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-4xl font-bold text-defblue'>Transaction History</h1>
                        </div>
                        <button onClick={() => setHistory(false)} className='font-semibold h-8 w-8 text-lg rounded-full border-[2px] border-black opacity-70'>X</button>
                    </div>
                    <div className='w-full h-full flex pt-4'>
                        <div className='w-7/12 p-3 border-r-2 border-grayborder'>
                            {}
                        </div>
                        <div className=' flex-grow'></div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default History
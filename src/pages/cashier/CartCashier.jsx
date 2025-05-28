import React, { useEffect } from 'react'
import axios from 'axios'
import ProdCartList from './ProdCartList'
import { AnimatePresence, motion } from 'framer-motion'

const CartCashier = ({stockData, cart, setCart, popQty, batchSelected}) => {
    const fetchCart = async() => {
        const response = await axios.get(import.meta.env.VITE_DB_ENDPOINT + 'cart/cashier')
        setCart(response.data)
    }
    useEffect(() => {
        fetchCart()
    }, [popQty])
    return (
        <div className=' w-full h-full flex flex-col'>
            <div className='flex flex-col flex-grow overflow-y-auto scroll-custom relative'>
                    {cart.length > 1 && cart?.map((item, i) => {
                        if(i === cart.length - 1) return <div key={i}></div>
                        return <AnimatePresence key={i}>
                            <motion.div
                                initial={{opacity:0,y:25}}
                                animate={{opacity:1,y:0}}
                                exit={{opacity:0,y:25}}
                                layout
                            >
                                <ProdCartList item={item}  fetchCart={fetchCart} mode={'cashier'} batchSelected={batchSelected} stock={stockData?.filter(stock => stock.code === item.code)[0]}/>
                            </motion.div>
                        </AnimatePresence>
                    })}
            </div>
            <div className=' flex py-3 px-4 justify-between w-full border-t border-defblue font-semibold shadow-inner z-10'>
                <h1 className='flex gap-1'>Total Price:</h1>
                <h1 className='text-defblue'>Rp {cart[cart.length - 1]?.toLocaleString()}</h1>
            </div>
        </div>
    )
}

export default CartCashier
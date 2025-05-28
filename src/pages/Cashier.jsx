import React, { useEffect, useState, useRef } from 'react'
import Loading from '../components/Loading'
import SurePop from './common/SurePop'
import axios from 'axios'
import CartCashier from './cashier/CartCashier'
import StockBoxCashier from './cashier/StockBoxCashier'

const Cashier = ({setSelected}) => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState()
    const [saving, setSaving] = useState(false)
    const [stock, setStock] = useState()
    const [allStock, setAllStock] = useState()
    const [cart, setCart] = useState([])
    const [popQty, setPopQty] = useState('')
    const [surePop, setSurePop] = useState(false)
    const [surePopSubmit, setSurePopSubmit] = useState(false)
    const [sureSubmit, setSureSubmit] = useState(false)
    const [sureRemove, setSureRemove] = useState(false)
    const [paintedCashier, setPaintedCashier] = useState(false)
    const [batchSelected, setBatchSelected] = useState()
    const invalid = useRef()

    useEffect(() => {
        setSelected("Cashier")
        setTimeout(() => {
            setPaintedCashier(true)
        }, 100);
    }, [])

    const handleSearch = async(e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        if(search){
            const fetchSearch = async() => {
                setLoading(true)
                try {
                    const response = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/item/ASC/${search}`);
                    setStock(response.data);
                } catch (error) {
                    console.error("Error searching for Items:", error);
                } finally{
                    setLoading(false)
                }
            }
            fetchSearch()
        } else {fetchStock()}
    }, [search])

    const handleClear = async() => {
        if(!sureRemove && cart.length > 1){
            setSurePop(true)
            setSureRemove(true)
        } else {
            await axios.delete(import.meta.env.VITE_DB_ENDPOINT + 'cart/cashier')
            setSurePop(false)
            setSureRemove(false)
            setPopQty('clear')
        }
    }

    const fetchStock = async() => {
        setLoading(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/item/ASC/AllItems`)
            setStock(res.data)
            setAllStock(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async(e) => {
        if(cart.length > 1){
            if(sureSubmit){
                try {
                    setSurePopSubmit(false)
                    setSureSubmit(false)
                    setSaving(true)
                    const items = cart.filter((x, i) => i!==cart.length-1)
                    await axios.post(`${import.meta.env.VITE_DB_ENDPOINT}financial`, items)
                } catch (error) {
                    console.error(error)
                } finally{
                    await axios.delete(import.meta.env.VITE_DB_ENDPOINT + 'cart/cashier')
                    setSaving(false)
                    fetchStock()
                    setPopQty('saved new transaction')
                }
            } else {
                setSurePopSubmit(true)
                setSureSubmit(true)
            }
        } else{
            e.target.classList.remove('hover:bg-defbluehov')
            e.target.classList.replace('bg-defblue', 'bg-red-600')
            invalid.current.classList.replace('opacity-0', 'opacity-100')
            setTimeout(() => {
                e.target.classList.add('hover:bg-defbluehov')
                e.target.classList.replace('bg-red-600', 'bg-defblue')
                invalid.current.classList.replace('opacity-100', 'opacity-0')
            }, 2000);
        }
    }

    return (
        <div className={' flex w-full h-screen justify-center items-center z-10 text-black transition-all duration-500 delay-100' + (paintedCashier ? '' : " opacity-0 translate-y-10")}>
            <div className=' h-screen w-full rounded-lg p-6 flex flex-col'>
                <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-4xl font-bold text-defblue'>Cashier App</h1>
                    </div>
                </div>
                <div className=' flex-grow w-full mt-4 flex overflow-hidden'>
                    <div className='w-[64%] border-r-2 border-grayborder flex flex-col gap-3 pr-6 relative'>
                        <div className='flex gap-3'>
                            <input type="text" placeholder='Search Item' className='outline-none border border-grayborder rounded px-4 py-1 flex-grow bg-transparent' onChange={handleSearch}/>
                        </div>
                        <div className={loading ? 'flex w-full h-full justify-center items-center' :' w-full h-full p-3 gap-3 grid grid-cols-4 overflow-y-auto scroll-custom grid-flow-row'}>
                            {loading ? <Loading/> : stock?.map((sto, i) => {
                                    return <StockBoxCashier key={i} stock={sto} popQty={popQty} setPopQty={setPopQty} cart={cart} batchSelected={batchSelected} setBatchSelected={setBatchSelected}/>
                                })
                            }
                        </div>
                    </div>
                    <div className=' flex-grow flex flex-col gap-2 pl-6 justify-between overflow-hidden'>
                        <div className=' flex justify-between'>
                            <h1 className=' font-semibold text-xl text-defblue'>Shopping Cart</h1>
                            <button disabled={sureRemove || sureSubmit} onClick={handleClear} className='rounded px-2 py-1 text-white bg-defblue hover:bg-defbluehov text-xs transition-all'>Clear cart</button>
                        </div>
                        <div className='w-full flex-grow shadow-inner rounded flex flex-col justify-between overflow-hidden relative'>
                            <CartCashier stockData={stock} popQty={popQty} cart={cart} setCart={setCart}/>
                            <SurePop text={"Are you sure you want to clear all items from the cart?"} surePop={surePop} setSurePop={setSurePop} setSure={setSureRemove} yesNclose={handleClear}/>
                            <SurePop text={"Are you sure you want to proceed with this transaction? Please review the details before confirming."} surePop={surePopSubmit} setSurePop={setSurePopSubmit} setSure={setSureSubmit} yesNclose={handleSubmit}/>
                        </div>
                        <h3 ref={invalid} className='text-xs text-red-600 opacity-0 text-center transition-opacity'>Cart cannot be blank.</h3>
                        <button onClick={handleSubmit} className='h-9 bg-defblue rounded text-white font-medium flex justify-center items-center hover:bg-defbluehov transition-all'>{saving ? <Loading borderClass={" border-t-white border-neutral-300"} sizeClass={'w-[1.39rem] py-0'} /> : "Confirm Order"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cashier
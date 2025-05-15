import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Loading from '../../components/Loading'
import StockBox from './StockBox'
import CartBatch from './CartBatch'
import SurePop from '../common/SurePop'

const NewBatch = ({setNewBatch, fetchBatch}) => {
    const [loading, setLoading] = useState()
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [stock, setStock] = useState()
    const [allStock, setAllStock] = useState()
    const [cart, setCart] = useState([])
    const [popQty, setPopQty] = useState('')
    const [surePop, setSurePop] = useState(false)
    const [surePopSubmit, setSurePopSubmit] = useState(false)
    const [sureSubmit, setSureSubmit] = useState(false)
    const [sureRemove, setSureRemove] = useState(false)
    const [popNew, setPopNew] = useState(false)
    const [priceNew, setPriceNew] = useState('')
    const supplier = useRef()
    const invalid = useRef()
    const newBlank = useRef()
    const newExist = useRef()

    useEffect(() => {
        setPriceNew('')
    }, [popNew])

    const fetchStock = async() => {
        setLoading(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/qty/ASC/AllItems`)
            setStock(res.data)
            setAllStock(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async(e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        if(search){
            const fetchSearch = async() => {
                setLoading(true)
                try {
                    const response = await axios.get(`${import.meta.env.VITE_DB_ENDPOINT}stock/qty/ASC/${search}`);
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
            await axios.delete(import.meta.env.VITE_DB_ENDPOINT + 'cart/batch')
            setSurePop(false)
            setSureRemove(false)
            setPopQty('clear')
        }
    }
    const handleSubmit = async(e) => {
        if(cart.length > 1 && supplier.current.value !== ''){
            if(sureSubmit){
                try {
                    setSurePopSubmit(false)
                    setSureSubmit(false)
                    setSaving(true)
                    const items = cart.filter((x, i) => i!==cart.length-1)
                    const data = {
                        supplier: supplier.current.value,
                        items: items
                    }
                    await axios.post(`${import.meta.env.VITE_DB_ENDPOINT}batch`, data)
                } catch (error) {
                    console.error(error)
                } finally{
                    await axios.put(import.meta.env.VITE_DB_ENDPOINT + 'cart/batch/clear')
                    setSaving(false)
                    fetchBatch()
                    setNewBatch(false)
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

    const handleAddNew = async(e) => {
        e.preventDefault()
        const target = e.target
        let isValid = true
        if (!target[0].value || !target[1].value || !target[2].value || !target[3].value || !target[4].value){
            newBlank.current.classList.add('opacity-100')
            setTimeout(() => {
                newBlank.current.classList.remove('opacity-100')
            }, 2000);
            isValid = false
        }
        const codeExistStock = allStock.filter(item => item.code===target[1].value).length > 0
        const codeExistCart = cart.filter(item => item.code===target[1].value).length > 0
        if(codeExistCart || codeExistStock){
            target[1].value = ''
            target[1].classList.add('border-red-600')
            newExist.current.classList.replace('opacity-0', 'opacity-100')
            newExist.current.classList.replace('scale-0', 'scale-100')
            setTimeout(() => {
                target[1].classList.remove('border-red-600')
                newExist.current.classList.replace('opacity-100', 'opacity-0')
                newExist.current.classList.replace('scale-100', 'scale-0')
            }, 2000);
            isValid = false
        }
        if(isValid){
            const data = {
                code: target[1].value,
                item: target[0].value,
                brand: target[2].value,
                qty: target[3].valueAsNumber,
                price: parseInt(target[4].value.split(',').join(''))
            }
            await axios.post(import.meta.env.VITE_DB_ENDPOINT + 'cart/batch', data)
            setPopQty('Added New Item')
            setPopNew(false)
        }
    }

    const handleChangeNewPrice = (e) => {
        if (!e.target.value){
            setPriceNew('')
        } else {
            const next = e.target.value.split(',').join('')
            setPriceNew(parseInt(next))
        }
    }

    return (
        <div className=' absolute top-0 left-0 flex w-full h-screen justify-center items-center bg-blackop z-10 text-black'>
            <div className=' bg-white h-5/6 w-5/6 rounded-lg p-6 flex flex-col'>
                <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-4xl font-bold text-defblue'>Add New Batch</h1>
                        <h3 className=' text-sm font-medium'>Add a new restock batch to track your stock levels, restock history, and expenditures.</h3>
                    </div>
                    <button onClick={() => setNewBatch(false)} className='font-semibold h-8 w-8 text-lg rounded-full border-[2px] border-black opacity-70'>X</button>
                </div>
                <div className=' flex-grow w-full mt-4 flex overflow-hidden'>
                    <div className='w-3/5 border-r-2 border-grayborder flex flex-col gap-3 pr-6 relative'>
                        <div className='flex gap-3'>
                            <input type="text" placeholder='Search Item' className='outline-none border border-grayborder rounded px-4 py-1 flex-grow' onChange={handleSearch}/>
                        </div>
                        <div className={loading ? 'flex w-full h-full justify-center items-center' :' w-full h-full p-3 gap-3 grid grid-cols-3 overflow-y-auto scroll-custom grid-flow-row'}>
                            {loading ? <Loading/> : stock?.map((sto, i) => {
                                return <StockBox key={i} stock={sto} popQty={popQty} setPopQty={setPopQty} cart={cart} mode={"batch"}/>
                            })}
                            {!loading && <button onClick={() => setPopNew(true)} className=' shadow-input h-56 rounded-sm flex overflow-hidden hover:shadow-defblue transition-all justify-center items-center text-sm hover:text-defblue'>
                                <h2>+ Add New Item</h2>
                            </button>}
                            {popNew &&
                                <div className=' absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center cursor-default'>
                                    <form onClick={e => e.stopPropagation()} onSubmit={handleAddNew} className=' h-[75%] w-4/6 bg-white border border-grayborder rounded-md shadow-popup p-4 flex flex-col text-sm gap-2 justify-between'>
                                        <div className=' flex flex-col gap-2'>
                                            <h1 className=' font-semibold text-xl text-defblue'>Add New Item</h1>
                                            <div className='flex flex-col gap-1'>
                                                <label htmlFor="item">Item Name:</label>
                                                <input placeholder='' type="text" id='item' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='flex flex-col gap-1 relative w-4/6'>
                                                    <label htmlFor="code">Code:</label>
                                                    <input placeholder='' type="text" id='code' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                                    <p ref={newExist} className=' absolute bottom-1.5 left-2 text-red-600 opacity-0 scale-0 transition-opacity text-xs text-nowrap'>Code is already in cart/stock</p>
                                                </div>
                                                <div className='flex flex-col gap-1 flex-grow'>
                                                    <label htmlFor="brand">Brand:</label>
                                                    <input placeholder='' type="text" id='brand' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                                </div>
                                            </div>
                                            <div className=' flex gap-2 items-center'>
                                                <div className='flex flex-col gap-1'>
                                                    <label htmlFor="qty">Quantity:</label>
                                                    <input placeholder='0' type="number" min={0} id='qty' className='outline-none border border-grayborder rounded py-1 w-full px-2' onInvalid={e => e.target.classList.add('border-red-600')} />
                                                </div>
                                                <div className='flex flex-col gap-1 relative'>
                                                    <label htmlFor="price">Purchase Price:</label>
                                                    <input placeholder='0' type="text" id='price' className='outline-none border border-grayborder rounded py-1 w-full text-right pr-2' value={priceNew.toLocaleString()} onChange={handleChangeNewPrice}/>
                                                    <p className=' absolute bottom-1.5 left-2 text-black'>Rp</p>
                                                </div>
                                            </div>
                                        <p ref={newBlank} className=' text-red-600 text-xs opacity-0 transition-all'>All the fields above cannot be blank.</p>
                                        </div>
                                        <div className='flex justify-end gap-2'>
                                            <button onClick={(e) => {e.stopPropagation();setPopNew(false)}} className='rounded px-4 py-1 border border-grayborder transition-all hover:bg-neutral-100' type='button'>Cancel</button>
                                            <button className='rounded px-4 py-1 text-white font-medium bg-defblue transition-all hover:bg-defbluehov' type='submit'>Add to batch</button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                    <div className=' w-2/5 flex flex-col gap-2 pl-6 justify-between overflow-hidden'>
                        <div className=' flex justify-between'>
                            <h1 className=' font-semibold text-xl text-defblue'>Batch Cart</h1>
                            <button onClick={handleClear} className='rounded px-2 py-1 text-white bg-defblue hover:bg-defbluehov text-xs transition-all'>Clear cart</button>
                        </div>
                        <div className='w-full flex-grow shadow-inner rounded flex flex-col justify-between overflow-hidden relative'>
                            <CartBatch stockData={stock} popQty={popQty} cart={cart} setCart={setCart} popNew={popNew}/>
                            <SurePop text={"Are you sure you want to clear all items from the cart?"} surePop={surePop} setSurePop={setSurePop} setSure={setSureRemove} yesNclose={handleClear}/>
                            <SurePop text={"Are you sure you want to save all the items to a new restock batch?"} surePop={surePopSubmit} setSurePop={setSurePopSubmit} setSure={setSureSubmit} yesNclose={handleSubmit}/>
                        </div>
                        <div className=' flex gap-2 relative items-center'>
                            <label htmlFor="supplier"> Supplier: </label>
                            <input ref={supplier} type="text" id='supplier' className=' outline-none border border-grayborder rounded flex-grow py-1 px-2'/>
                        </div>
                        <h3 ref={invalid} className='text-xs text-red-600 opacity-0 text-center transition-opacity'>Cart and Supplier cannot be blank.</h3>
                        <button onClick={handleSubmit} className='h-9 bg-defblue rounded text-white font-medium flex justify-center items-center hover:bg-defbluehov transition-all'>{saving ? <Loading borderClass={" border-t-white border-neutral-300"} sizeClass={'w-[1.39rem] py-0'} /> : "Save Batch"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewBatch
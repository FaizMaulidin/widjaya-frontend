import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import DashButton from '../components/DashButton';
import { Route, Routes } from 'react-router-dom';
import Stock from './Stock';
import Restock from './Restock';
import Cashier from './Cashier'
import Financial from './Financial'
import Dashboard from './Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faCashRegister, faChartLine, faCoins, faWarehouse } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
    const { token, logout } = useAuth();
    const decodedToken = jwtDecode(token)
    const [selected, setSelected] = useState("Dashboard")
    const [logPop, setlogPop] = useState(false)

    return (
      <div className='flex w-full h-screen relative'>
            <div className='h-screen bg-darkerblack w-64 flex flex-col pb-8 justify-between font-semibold text-white z-0'>
                <div className=' flex flex-col gap-5'>
                    <div className='p-5 flex flex-col gap-3 bg-black'>
                        <div className='bg-defblue w-20 h-20'></div>
                        <h2 className=' text-lg'>Welcome, {decodedToken.username}</h2>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <DashButton id='Dashboard' selected={selected} click="/dashboard"><FontAwesomeIcon icon={faChartLine}/>Dashboard</DashButton>
                        <DashButton id='Inventory' selected={selected} click="/inventory"><FontAwesomeIcon icon={faWarehouse}/>Inventory</DashButton>
                        <DashButton id='Restock' selected={selected} click="/restock"><FontAwesomeIcon icon={faBasketShopping}/>Restock</DashButton>
                        <DashButton id='Cashier' selected={selected} click="/cashier"><FontAwesomeIcon icon={faCashRegister}/>Cashier App</DashButton>
                        <DashButton id='Financial' selected={selected} click="/financial"><FontAwesomeIcon icon={faCoins}/>Financial</DashButton>
                    </div>
                </div>
                <button onClick={() => setlogPop(true)} className=' font-medium border-[2px] border-white mx-4 rounded py-1 hover:text-darkerblack hover:bg-white transition-all'>Logout</button>
            </div>
            <div className=' flex-grow overflow-hidden bg-brokenwhite h-screen'>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard setSelected={setSelected}/>} />
                    <Route path="/inventory" element={<Stock setSelected={setSelected}/>} />
                    <Route path="/restock" element={<Restock setSelected={setSelected}/>} />
                    <Route path="/cashier" element={<Cashier setSelected={setSelected}/>} />
                    <Route path="/financial" element={<Financial setSelected={setSelected}/>} />
                </Routes>
            </div>
            {logPop &&
                <div className='absolute left-0 top-0 bg-blackop w-screen h-screen flex justify-center items-center z-50'>
                    <div className=' rounded-md bg-white text-graytext flex flex-col px-6 py-5 gap-10'>
                        Are you sure you want to log out?
                        <div className='flex gap-2 justify-end text-sm font-medium'>
                            <button onClick={() => setlogPop(false)} className='px-3 py-1 rounded-md border border-grayborder'>Cancel</button>
                            <button onClick={logout} className='px-3 py-1 rounded-md bg-red-600 text-white'>Log Out</button>
                        </div>
                    </div>
                </div>
            }
      </div>
    );
}

export default Menu
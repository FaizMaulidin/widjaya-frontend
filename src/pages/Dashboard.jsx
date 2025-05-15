import React, { useEffect, useState } from 'react'

const Dashboard = ({setSelected}) => {
    const [paintedDashboard, setPaintedDashboard] = useState(false)

    useEffect(() => {
        setSelected("Dashboard")
        setTimeout(() => {
            setPaintedDashboard(true)
        }, 100);
    }, [])

    return (
        <div className={'py-12 px-6 h-full relative transition-all duration-500 grid' + (paintedDashboard ? "" : " opacity-0 translate-y-10")}>
            <div style={{
                width: '48rem',
                height: '100px',
            }} className={'text-5xl flex text-center justify-center items-center ' + (paintedDashboard ? 'perspective' : 'perspective-hov')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae.
            </div>
        </div>
    )
}

export default Dashboard
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const DashButton = ({children, click, selected, id}) => {
    const isSelect = id == selected
    const bgClass = isSelect ? " bg-defbluehov" : ""
    
  return (
    <Link to={"/main" + click} className={'px-6 py-4 font-semibold text-white hover:bg-defbluehov transition-all flex justify-start w-full gap-3 items-center' + bgClass}>{children}</Link>
  )
}

export default DashButton
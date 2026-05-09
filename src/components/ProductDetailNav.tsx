"use client"

import {useState,useEffect, React} from 'react';

type Props = {
    setParentNavValue: (value: string) => void
}

export default function ProductDetailNav({setParentNavValue}: Props){
    const [navValue, setnavValue] = useState('Description')
    const [active, setActive] = useState("Description")
    const handleClick = (value: string) => {
        setnavValue(value)
        setParentNavValue(value)
        setActive(value)
    }
    return(
    <div>
        <div className='flex justify-start items-center gap-10 w-full'>
                <p onClick={() => handleClick("Description")} className={`cursor-pointer ${active==="Description" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                    Description
                </p>

                <p onClick={() => handleClick("Ingredients")} className={`cursor-pointer ${active==="Ingredients" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                    Ingredients
                </p>

                <p onClick={() => handleClick("How To Use")} className={`cursor-pointer ${active==="How To Use" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                    How To Use
                </p>

                <p onClick={() => handleClick("Review")} className={`cursor-pointer ${active==="Review" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                    Review
                </p>
        </div>
        <hr></hr>
    </div>
    )
}
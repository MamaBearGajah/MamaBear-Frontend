"use client"

import {useState,useEffect, React} from 'react';

type Props = {
    setParentNavValue: (value: string) => void
}

export default function ProductDetailNav({setParentNavValue}: Props){
    const [navValue, setnavValue] = useState('Description')
    const handleClick = (value: string) => {
        setnavValue(value)
        setParentNavValue(value)
    }
    return(
    <div>
        <div className='flex justify-start items-center gap-3'>
                <p onClick={() => handleClick("Description")}>
                    Description
                </p>

                <p onClick={() => handleClick("Ingredients")}>
                    Ingredients
                </p>

                <p onClick={() => handleClick("How To Use")}>
                    How To Use
                </p>

                <p onClick={() => handleClick("Review")}>
                    Review
                </p>
        </div>
        <hr></hr>
    </div>
    )
}
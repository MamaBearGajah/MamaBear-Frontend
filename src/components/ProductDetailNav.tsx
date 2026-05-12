"use client"

import {useState,useEffect, React} from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <div className='hidden md:flex md:justify-start md:items-center gap-10 w-full'>
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



        <div className='block md:hidden gap-10 w-full'>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><img className='w-[20px] cursor-pointer' src='/info.svg'/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuItem>                
                    <p onClick={() => handleClick("Description")} className={`cursor-pointer ${active==="Description" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                        Description
                    </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <p onClick={() => handleClick("Ingredients")} className={`cursor-pointer ${active==="Ingredients" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                        Ingredients
                    </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <p onClick={() => handleClick("How To Use")} className={`cursor-pointer ${active==="How To Use" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                        How To Use
                    </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <p onClick={() => handleClick("Review")} className={`cursor-pointer ${active==="Review" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
                        Review
                    </p>
                </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
            </DropdownMenu>
                {/* <p onClick={() => handleClick("Description")} className={`cursor-pointer ${active==="Description" ? "underline text-[var(--mamabear-light-pink)]" : null}`}>
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
                </p> */}
        </div>
        <hr></hr>
    </div>
    )
}
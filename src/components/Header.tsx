import Link from "next/link"

export default function Header() {
    return(
              
      <div className='h-[20vh] md:h-[10vh] border flex justify-center items-center gap-3 font-[var(--font-quicksand)]]'>
        <Link href='/'>Home</Link>
        <Link href='#'>Search</Link>
        <Link href='/about'>About</Link>
        <Link href='/product'>Product</Link>
        <Link href='/consultation'>Consultation</Link>
        <Link href='/auth/Login'>Login</Link>
        <Link href='/auth/Register'>Register</Link>
        <Link href='/auth/admin'>Admin</Link>
      </div>
      
    )
    
}
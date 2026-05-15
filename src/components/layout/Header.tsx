import Link from "next/link"

export default function Header() {
    return(
              
      <div className='h-[20vh] md:h-[10vh] border flex justify-center items-center gap-3 font-[var(--font-quicksand)]]'>
        <Link href='/'>Home</Link>
        <Link href='#'>Search</Link>
        <Link href='/about'>About</Link>
        <Link href='/product'>Product</Link>
        <Link href='/consultation'>Consultation</Link>
        <Link href='/login'>Login</Link>
        <Link href='/register'>Register</Link>
        <Link href='/auth/admin'>Admin</Link>
      </div>
      
    )
    
}
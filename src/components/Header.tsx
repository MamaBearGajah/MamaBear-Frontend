import Link from "next/link"

export default function Header() {
    return(
              
      <div>
        Header
        <Link href='#'>Search</Link>
        <Link href='/about'>About</Link>
        <Link href='/consultation'>Consultation</Link>
        <Link href='/auth/Login'>Login</Link>
        <Link href='/auth/Register'>Register</Link>
        <Link href='/auth/Admin'>Register</Link>
      </div>
      
    )
    
}
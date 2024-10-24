"use client";

import Link from "next/link";
import { Button } from "../ui/button";
const Header = () => {
  return (
  <header className='flex shadow-md py-4 px-4 bg-white min-h-[70px] tracking-wide relative z-50'>
     <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        <Link href={"/"}>Shopping Cart</Link>
      </div>
      <ul className="flex gap-6 items-center justify-center mr-10">
        <li className="text-lg font-semibold">
          <Link href={"/"}>Products</Link>
        </li>
        <li className="text-lg font-semibold">
          <Link href={"/cart"}>Cart</Link>
        </li>
      </ul>
      <div>
      <Button type="submit">LOGIN</Button>
      </div>
  </header>
  )
}

export default Header

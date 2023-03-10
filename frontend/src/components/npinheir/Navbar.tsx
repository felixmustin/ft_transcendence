import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import Link from "./Link"
import Logo from "../../assets/Logo.png"


type Props = {}

const Navbar = (props: Props) => {

  const flexBetween = "flex items-center justify-between"

  return (
    <nav>
      <div className={`${flexBetween} fixed top-0 z-30 w-full py-6 bg-gray-20`}>
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/** LEFT SIDE */}
            <img src={Logo} alt='logo' className="h-11 scale-150"/>
            {/** RIGHT SIDE */}
            <div className={`${flexBetween} w-full`}>
              {/** INNER RIGHT SIDE */}
              <div className={`${flexBetween} gap-8 text-sm`}>
                <Link title="Play" link="/play"/>
                <Link title="Home" link="/home"/>
                <Link title="Profile" link="/profile"/>
                <Link title="Ladder" link="/ladder"/>
                <Link title="Social" link="/social"/>
              </div>
              {/** INNER LEFT SIDE */}
              <div className={`${flexBetween} gap-8`}>
                <input placeholder="  Search for targets" className="bg-gray-50 rounded-md"></input>
                <Link title="Settings" link="/settings"/>
                <button className="bg-gray-800 text-gray-200">Log Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
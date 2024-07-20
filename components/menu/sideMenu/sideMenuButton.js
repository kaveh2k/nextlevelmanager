import React from 'react'
import Link from 'next/link'

const sideMenuButton = ({ children, link, name, isopen }) => {
    return (
        <>
            <Link href={link}>
                <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isopen ? 'justify-start' : 'justify-normal'}`}>
                    <div width={32} height={32}>
                        {children}
                        {isopen && name}
                    </div>
                </li>
            </Link>
        </>
    )
}

export default sideMenuButton
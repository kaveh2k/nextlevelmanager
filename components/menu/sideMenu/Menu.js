import { AiOutlineMenu, AiOutlineHome, AiOutlineFileSearch, AiOutlineShop, AiOutlineCluster, AiOutlineSetting } from 'react-icons/ai';
import Link from 'next/link';
import Image from 'next/image';
import logoPic from "@/DataBase/menu-logo.png"
import sideMenuButton from './sideMenuButton';

export default function Menu({ isMenuOpen, toggleMenu }) {
    return (
        <>
            {/* Menu Header */}
            <div className={`flex items-start justify-end p-4`}>
                {isMenuOpen && <Image alt='log pic' src={logoPic} className='w-[90%]' />}
                <button onClick={toggleMenu} className="text-xl">
                    <AiOutlineMenu width={32} height={32} />
                </button>
            </div>

            {/* Menu Items */}
            <ul className="mt-4">
                {/* TODO: update with menu button component */}
                {/* <sideMenuButton link="/" name="Home" isopen={isMenuOpen}>
                    <AiOutlineHome className="mr-2 inline" />
                </sideMenuButton> */}
                <Link href="/">
                    <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isMenuOpen ? 'justify-start' : 'justify-normal'}`}>
                        <div width={32} height={32}>
                            <AiOutlineHome className="mr-2 inline" />
                            {isMenuOpen && "Home"}
                        </div>
                    </li>
                </Link>
                <Link href="/search">
                    <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isMenuOpen ? 'justify-start' : 'justify-normal'}`}>
                        <div width={32} height={32}>
                            <AiOutlineFileSearch className="mr-2 inline" />
                            {isMenuOpen && "Product Search"}
                        </div>
                    </li>
                </Link>
                <Link href="/sell">
                    <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isMenuOpen ? 'justify-start' : 'justify-normal'}`}>
                        <div width={32} height={32}>
                            <AiOutlineShop className="mr-2 inline" />
                            {isMenuOpen && "Sell Product"}
                        </div>
                    </li>
                </Link>
                <Link href="/addproduct">
                    <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isMenuOpen ? 'justify-start' : 'justify-normal'}`}>
                        <div width={32} height={32}>
                            <AiOutlineCluster className="mr-2 inline" />
                            {isMenuOpen && "Add Product"}
                        </div>
                    </li>
                </Link>
                <Link href="/settings">
                    <li className={`p-4 hover:bg-gray-700 flex items-center transition-all duration-500 ${isMenuOpen ? 'justify-start' : 'justify-normal'}`}>
                        <div width={32} height={32}>
                            <AiOutlineSetting className="mr-2 inline" />
                            {isMenuOpen && "Settings"}
                        </div>
                    </li>
                </Link>
            </ul>
        </>
    );
}


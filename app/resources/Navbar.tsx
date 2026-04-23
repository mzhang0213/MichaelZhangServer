import React, {useEffect, useState} from "react";
import "./navbar.css"
import {gebi} from "@/app/resources/gebi";
import {usePathname} from "next/navigation";

type NavItemData = {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    accent?: string;
}

//ItemType no longer uses children; to improve consistency with DropdownType
//!! This means that its title is inlined, not in .innerHTML !!
export type ItemType = NavItemData & {
    itemTitle: React.ReactNode;
    page: string;
    redirect?: boolean;
    decoration?: string;
    weight?: string;
}

/**
 * Creates an item in the navbar, whether it is in the navbar itself or in an on-hover list on the navbar
 * @param id The id of this item
 * @param onClick OPTIONAL What happens when this item is clicked
 // *hard-coded* @param className OPTIONAL Styling classnames that apply to this item + TailwindCSS properties
 * @param style OPTIONAL Manual CSS properties
 * @param itemTitle The title of this item
 * @param decoration OPTIONAL Apply underline to the item
// *hard-coded* @param weight OPTIONAL Apply bold to the item
 */
function Item({id, page, redirect, style, itemTitle, accent, onMobileClick}: ItemType & {onMobileClick?: () => void}) {
    const newTab = redirect ? "_blank" : "_self";
    const clickFunct = () => {
        const openPage = page.charAt(0)=="/" ?
            () => window.open(window.location.origin+page, newTab) :
            () => window.open(page, newTab);
        openPage();
        if (onMobileClick) onMobileClick();
    }

    id="nav-"+id;
    const isActive = page === usePathname();
    const mergedStyle = {
        ...style,
        ...(accent ? {"--accent": accent} : {})
    } as React.CSSProperties;
    return (
        <button
            id={id}
            onClick={clickFunct}
            className={`navbar-item${isActive ? " nav-active" : ""}`}
            style={mergedStyle}
        >
            <div className={"nav-label"}>
                {itemTitle}
            </div>
        </button>
    )
}


type DropdownListType = ItemType & {
    itemTitle: React.ReactNode;
    children: React.ReactNode; //children are required!! or else create an Item
}
/**
 * Creates a dropdown list on the navbar
 *
 * (The name is DropdownList to avoid confusion between this and a List)
 * (<DropdownList>s are inherited types from <Item>s)
 *
 * @param id The id of this dropdown list
 * @param onClick OPTIONAL Result of clicking this dropdown list title button
 * @param itemTitle The title of this dropdown list
 * @param children The children of this dropdown list (ie the members of the dropdown)
 */
// think of this as just code for the container
// we dont gaf about whats inside, but MUST be item
function DropdownList({id, page, redirect, itemTitle, children, accent, onMobileClick}: DropdownListType & {onMobileClick?: () => void}) {
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const newTab = redirect ? "_blank" : "_self";
    const clickFunct = page.charAt(0)=="/" ? (()=>(window.open(window.location.origin+page, newTab))) : (()=>(window.open(page, newTab)))
    id="nav-"+id;
    const isActive = page === usePathname();
    const groupStyle = (accent ? {"--accent": accent} : {}) as React.CSSProperties;
    return (
        <div id={id} className={"navbar-group"} style={groupStyle}>
            <button id={id+"Button"} onClick={clickFunct}
                    className={`navbar-item${isActive ? " nav-active" : ""}`}>
                <span className={"nav-label"}>{itemTitle}</span>
            </button>
            <div id={id+"Content"} className={"navbar-content"}>
                {children}
            </div>

            {/* for mobile */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-gray-900 ${
                    isMobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{borderRadius: '0'}}
            >
                <div className="flex flex-col py-2">
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            return (
                                <div key={child.key} className="border-b border-gray-800 last:border-b-0">
                                    {React.cloneElement(child as React.ReactElement<any>, {
                                        onMobileClick: () => {
                                            setIsMobileDropdownOpen(false);
                                            if (onMobileClick) onMobileClick();
                                        },
                                        className: "w-full text-left py-3 px-6 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                    })}
                                </div>
                            );
                        }
                        return child;
                    })}
                </div>
            </div>
        </div>
    )
}

//just extends ItemType cuz the items in a dropdown list are rendered independently and inserted; thus it would be incorrect to call all the buttons on the navbar also DropdownListType cuz they only satisfy ItemType
export type NavDataType = ItemType & {
    isList: boolean;
    childrenItems: ItemType[]; //empty if isList is false
}

//default items in the nav bar if not supplied with other custom items
export const defaultItems: NavDataType[] = [
    {
        isList: false,
        childrenItems: [],
        id: "homeButton",
        page:"/",
        itemTitle: "hi!",
        accent: "var(--theme-blue)",
    },
    {
        isList: false,
        childrenItems: [],
        id: "experience",
        page:"/experience",
        itemTitle: "its me...",
        accent: "var(--theme-yellow)",
    },
    {
        isList: false,
        childrenItems: [],
        id: "aboutMe",
        page:"/about",
        itemTitle: "michael!!",
        accent: "var(--theme-red)",
    },
    {
        isList: true,
        childrenItems: [
            {
                id: "spotifyYt",
                page: "/spotifyYt",
                redirect: true,
                itemTitle: "Cracked Spotify"
            },
            {
                id: "bobabyte",
                page: "/bobabyte",
                redirect: true,
                itemTitle: "Hackathon Portal"
            },
            {
                id: "emailBot",
                page: "https://github.com/mzhang0213/email-send-robot",
                redirect: true,
                itemTitle: "Email Robot"
            },
            {
                id: "imageEditor",
                page: "https://github.com/mzhang0213/ae3",
                redirect: true,
                itemTitle: "Image Editor"
            }
        ],
        id: "projects",
        page: "/projects",
        itemTitle: "and i like to build",
        accent: "var(--theme-green)",
    },
    /*
    {
        isList: true,
        childrenItems: [

            {
                id: "sampleJob",
                onClick: ()=>window.location.href=window.location.origin+'/',
                itemTitle: "Sample-Job"
            }

        ],
        id: "experience",
        onClick: ()=>window.location.href=window.location.origin+'/experience/',
        itemTitle: "Experience"
    },*/
]

/**
 * Given children, render items for a dropdown list with such items
 *
 * @param items The items to be rendered
 */
function RenderItems({items, onMobileClick}: {items: ItemType[], onMobileClick?: () => void}) {
    return (
        <>
            {items.map(item => {
                return (
                    <Item
                        id={item.id}
                        key={item.id}
                        page={item.page}
                        redirect={item.redirect}
                        style={item.style}
                        accent={item.accent}
                        decoration={item.decoration}
                        weight={item.weight}
                        itemTitle={item.itemTitle}
                        onMobileClick={onMobileClick}
                    />
                )
            })}
        </>
    )
}

/**
 * Given a list of items and headers, render it into the navbar
 *
 * @param items The items of dropdownlists and items to be included in the navbar
 */
function RenderNavbar({ items, onMobileClick }: { items: NavDataType[], onMobileClick?: () => void }) {
    return (
        <>
            {items.map(navItem => {
                if (navItem.isList){
                    //actual syntax to create a dropdownlist and its items
                    return <DropdownList
                        id={navItem.id}
                        key={navItem.id}
                        page={navItem.page}
                        redirect={navItem.redirect}
                        style={navItem.style}
                        accent={navItem.accent}
                        decoration={navItem.decoration}
                        weight={navItem.weight}
                        itemTitle={navItem.itemTitle}
                        onMobileClick={onMobileClick}
                    >
                        <RenderItems
                            items={navItem.childrenItems}
                            onMobileClick={onMobileClick}
                        />
                    </DropdownList>
                }else{
                    return <Item
                        id={navItem.id}
                        key={navItem.id}
                        page={navItem.page}
                        redirect={navItem.redirect}
                        style={navItem.style}
                        accent={navItem.accent}
                        decoration={navItem.decoration}
                        weight={navItem.weight}
                        itemTitle={navItem.itemTitle}
                        onMobileClick={onMobileClick}
                    />
                }
            })}
        </>
    )
}

export default function Navbar({customItems, alwaysShow}: { customItems: NavDataType[] | null, alwaysShow: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const navBarFade = function(){
            if (window.scrollY>window.innerHeight*0.9 || alwaysShow){
                //show navbar
                gebi("navBar").style.opacity="1";
            }else{
                gebi("navBar").style.opacity="0";
            }
        }
        navBarFade();
        document.addEventListener("scroll",navBarFade);

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('scroll', navBarFade);
            window.removeEventListener('resize', handleResize);
        };
    }, [alwaysShow]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav id={"navBar"}>
                <div id={"navItemLogo"} onClick={() => window.open(window.location.origin)}
                     className={"navbar-chip flex-shrink-0"}
                     style={{"--accent": "var(--theme-purple)"} as React.CSSProperties}>
                    <img id={"logo"} src={"./icons/chillpanda.png"} alt={"navlogo"} className={"h-6 mr-2"}/>
                    <span className={"tracking-tight"}>Michael Zhang</span>
                </div>
                <div id={"navItemContainer"} className={"w-full h-full block flex-grow md:flex md:items-center md:justify-end md:w-auto text-sm hidden md:block"}>
                    <RenderNavbar items={customItems?customItems:defaultItems} />
                </div>
                <div className={"block md:hidden"}>
                    <button
                        id={"menuToggle"}
                        onClick={toggleMobileMenu}
                        className={"navbar-chip"}
                        style={{"--accent": "var(--theme-yellow)"} as React.CSSProperties}
                    >
                        <div className="relative w-5 h-4">
                            <span
                                className={`absolute block h-0.5 w-5 bg-current`}></span>
                            <span
                                className={`absolute block h-0.5 w-5 bg-current translate-y-1.5`}></span>
                            <span
                                className={`absolute block h-0.5 w-5 bg-current translate-y-3`}></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* mobile menu */}
            <div
                className={`fixed inset-0 z-50 md:hidden bg-black bg-opacity-95 backdrop-blur-sm transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={closeMobileMenu}
            >
                <div
                    className={`bg-gray-900 min-h-screen transition-transform duration-300 ease-out ${
                        isMobileMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <div className="flex items-center">
                            <img src={"./icons/chillpanda.png"} alt={"logo"} className={"h-6 mr-2"}/>
                            <span className="text-white text-lg">Michael Zhang</span>
                        </div>
                        <button
                            onClick={closeMobileMenu}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div className="mobile-nav px-4 py-4">
                        <RenderNavbar
                            items={customItems ? customItems : defaultItems}
                            onMobileClick={closeMobileMenu}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
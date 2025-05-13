import React, {useEffect} from "react";
import "./navbar.css"
import {gebi} from "@/app/resources/gebi";

type NavItemData = {
    id: string;
    className?: string;
    onClick?: () => void; //a function that has no param return nothing (ie just redirecting window)
    style?: React.CSSProperties;
}

//ItemType no longer uses children; to improve consistency with DropdownType
//!! This means that its title is inlined, not in .innerHTML !!
export type ItemType = NavItemData & {
    itemTitle: React.ReactNode;
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
function Item({id, onClick, style, itemTitle, decoration}: ItemType) {
    id="nav-"+id; //!! distinguish cuz yeah !!, maybe malpractice
    return (
        <button
            id={id}
            onClick={onClick}
            className={"navbar-item relative h-full inline-block text-gray-200"}
            style={style}
        >
            <div
                style={{
                    textDecoration: decoration,
                    fontWeight: "bold" //not using weight; everything bold for now
                }}
                className={"px-3"} //adding padding to element under a hover button listener is good to extend the hover range (ie width) of the upper (parent) element w/o needing to do some bs calculations of 100% + 2px yk
            >
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
function DropdownList({id, onClick, itemTitle, children}: DropdownListType) {
    id="nav-"+id; //!! distinguish cuz yeah !!, maybe malpractice
    return (
        <div id={id} className={"navbar-group navbar-item relative h-full inline-block text-gray-200"}>
            <button id={id+"Button"} onClick={onClick} className={"navbar-group-button w-full h-full px-3"}>
                {itemTitle}
            </button>
            <div id={id+"Content"} className={"navbar-content"}>
                {children}
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
        onClick: ()=>window.location.href=window.location.origin+'/',
        decoration: "underline",
        itemTitle: "Home"
    },
    {
        isList: true,
        childrenItems: [
            {
                id: "spotifyYt",
                onClick: ()=>window.open(window.location.origin+"/spotifyYt/","_blank"),
                itemTitle: "Cracked Spotify"
            },
            {
                id: "emailBot",
                onClick: ()=>window.open("https://github.com/mzhang0213/email-send-robot","_blank"),
                itemTitle: "Email Robot"
            },
            {
                id: "imageEditor",
                onClick: ()=>window.open("https://github.com/mzhang0213/ae3","_blank"),
                itemTitle: "Image Editor"
            }
        ],
        id: "projects",
        onClick: ()=>window.location.href=window.location.origin+'/projects/',
        itemTitle: "Projects"
    },
    {
        isList: true,
        childrenItems: [
            /*
            {
                id: "sampleJob",
                onClick: ()=>window.location.href=window.location.origin+'/',
                itemTitle: "Sample-Job"
            }
             */
        ],
        id: "experience",
        onClick: ()=>window.location.href=window.location.origin+'/experience/',
        itemTitle: "Experience"
    },
    {
        isList: true,
        childrenItems: [
            /*
            {
                id: "sampleJob",
                onClick: ()=>window.location.href=window.location.origin+'/',
                itemTitle: "Sample-Job"
            }
            */
        ],
        id: "volunteer",
        onClick: ()=>window.location.href=window.location.origin+'/volunteer/',
        itemTitle: "Volunteer"
    },
]

/**
 * Given children, render items for a dropdown list with such items
 *
 * @param items The items to be rendered
 */
function RenderItems({items}: {items: ItemType[]}) {
    return (
        <>
            {items.map(item => {
                return (
                    <Item
                        id={item.id}
                        key={item.id}
                        onClick={item.onClick}
                        style={item.style}
                        decoration={item.decoration}
                        weight={item.weight}
                        itemTitle={item.itemTitle}
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
function RenderNavbar({ items }: { items: NavDataType[] }) {
    return (
        <>
            {items.map(navItem => {
                if (navItem.isList){
                    //actual syntax to create a dropdownlist and its items
                    return <DropdownList
                        id={navItem.id}
                        key={navItem.id}
                        onClick={navItem.onClick}
                        style={navItem.style}
                        decoration={navItem.decoration}
                        weight={navItem.weight}
                        itemTitle={navItem.itemTitle}
                    >
                        <RenderItems
                            items={navItem.childrenItems}
                        />
                    </DropdownList>
                }else{
                    return <Item
                        id={navItem.id}
                        key={navItem.id}
                        onClick={navItem.onClick}
                        style={navItem.style}
                        decoration={navItem.decoration}
                        weight={navItem.weight}
                        itemTitle={navItem.itemTitle}
                    />
                }
            })}
        </>
    )
}

export default function Navbar({customItems}: { customItems: NavDataType[] | null }) {
    useEffect(() => {
        const navBarFade = function(){
            if (window.scrollY>window.innerHeight*0.9){
                //show navbar
                gebi("navBar").style.opacity="1";
            }else{
                gebi("navBar").style.opacity="0";
            }
        }
        navBarFade();
        document.addEventListener("scroll",navBarFade);
    }, []);
    return (
        <nav id={"navBar"}>
            <div id={"navItemLogo"} onClick={() => window.open(window.location.origin)} className={"h-full flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"}>
                <img id={"logo"} src={"./icons/chillpanda.png"} alt={"navlogo"} className={"h-8 mr-2"}/>
                <button className={"text-xl tracking-tight"}>Michael Zhang</button>
            </div>
            <div className={"block md:hidden"}>
                <button id={"menuToggle"} className={"flex items-center px-3 py-2 border rounded text-gray-300 border-gray-300 hover:text-white hover:border-white"}>
                    <svg className={"fill-current h-3 w-3"} viewBox={"0 0 20 20"} xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d={"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}/>
                    </svg>
                </button>
            </div>
            <div id={"navItemContainer"} className={"w-full h-full block flex-grow md:flex md:items-center md:justify-end md:w-auto text-sm"}>
                <RenderNavbar items={customItems?customItems:defaultItems} />
            </div>
        </nav>
    )
}
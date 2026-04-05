// components/FooterSection.tsx
import React from "react";
import {defaultItems, ItemType, NavDataType} from "@/app/resources/Navbar";
import "./footer.css"

function Section({elems}: { elems: ItemType[] }){
    return (
        elems.map(item => {
            const newTab = item.redirect ? "_blank" : "_self";
            const clickFunct = item.page.charAt(0)=="/" ? (()=>(window.open(window.location.origin+item.page, newTab))) : (()=>(window.open(item.page, newTab)))
            return <li key={item.id}>
                <p className="footer-item text-[11px] cursor-pointer hover:text-gray-300 transition-colors" onClick={clickFunct}>
                    {item.itemTitle}
                </p>
            </li>
        })
    )
}

export function FooterSection({ sections }: { sections: NavDataType[] }) {
    const itemClassName = "footer-header font-bold text-sm mb-3 cursor-pointer hover:text-gray-300 transition-colors";
    return (
        sections.map(section => {
            const newTab = section.redirect ? "_blank" : "_self";
            const clickFunct = section.page.charAt(0)=="/" ? (()=>(window.open(window.location.origin+section.page, newTab))) : (()=>(window.open(section.page, newTab)))
            if (section.isList)
                return (
                    <div key={section.id} className="mb-0">
                        <p className={itemClassName} onClick={clickFunct}>{section.itemTitle}</p>
                        <ul className="my-1">
                            <Section elems={section.childrenItems}/>
                        </ul>
                    </div>
                );
            else
                return (
                    <div key={section.id} className="mb-0">
                        <p className={itemClassName} onClick={clickFunct}>{section.itemTitle}</p>
                    </div>
                );
        })
    )
}

export default function Footer({customItems}: { customItems: NavDataType[] | null }) {
    return (
        <footer className="text-white px-8 lg:px-30 py-10" style={{backgroundColor:"var(--theme-black)"}}>
            <div className="flex justify-between px-15 pb-10 gap-4">
                <FooterSection sections={customItems?customItems:defaultItems} />
            </div>
            <div className="mt-10 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Michael Zhang. All rights reserved.
            </div>
        </footer>
    );
}
// components/FooterSection.tsx
import React from "react";
import {defaultItems, ItemType, NavDataType} from "@/app/resources/Navbar";
import "./footer.css"

function Section({elems}: { elems: ItemType[] }){
    return (
        elems.map(item => {
            return <li key={item.id}>
                <p className="footer-item text-[11px]" onClick={item.onClick}>
                    {item.itemTitle}
                </p>
            </li>
        })
    )
}

export function FooterSection({ sections }: { sections: NavDataType[] }) {
    const itemClassName = "footer-header font-bold text-sm mb-3";
    return (
        sections.map(section => {
            if (section.isList)
                return (
                    <div key={section.id}>
                        <p className={itemClassName} onClick={section.onClick}>{section.itemTitle}</p>
                        <ul className="my-1">
                            <Section elems={section.childrenItems}/>
                        </ul>
                    </div>
                );
            else
                return (
                    <div key={section.id}>
                        <p className={itemClassName} onClick={section.onClick}>{section.itemTitle}</p>
                    </div>
                );
        })
    )
}

export default function Footer({customItems}: { customItems: NavDataType[] | null }) {
    return (
        <footer className="text-white px-30 py-10" style={{backgroundColor:"var(--theme-black)"}}>
            <div className="flex justify-between px-15 pb-10">
                <FooterSection sections={customItems?customItems:defaultItems} />
            </div>
            <div className="mt-10 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Michael Zhang. All rights reserved.
            </div>
        </footer>
    );
}
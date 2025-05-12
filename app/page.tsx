"use client"
import Navbar from './resources/Navbar'
import React, {useEffect} from "react";
import "./page.css"
import {gebi} from "@/app/resources/gebi";
import {Background} from "@/app/resources/Background";
import BackgroundDim from "@/app/resources/BackgroundDim";
import {createRoot, Root} from "react-dom/client";
import Footer from "@/app/resources/Footer";
import {projects} from "@/app/projects";
import {technologies} from "@/app/technologies";


const summaryContainerWidth = 85;
const smallTransition = 500;
const largeTransition = 1000;
const detailsMenuWipe = 300;

/*
function SampleCat() {
    return <img
        className={"relative w-[400px]"}
        src={"https://scrumbles.co.uk/cdn/shop/articles/scottish-straight-cat-breed-guide-964256.jpg?v=1720002125"}
    />
}
 */


function scrollToElement(e: string) {
    gebi(e).scrollIntoView({behavior: "smooth", block: "center"})
}

const menuOptions = [
    {
        id: "about",
        onClick: () => scrollToElement("summaryContainer"),
        itemTitle: "About Me"
    },
    {
        id: "projects",
        onClick: () => scrollToElement("projectsTitle"),
        itemTitle: "Projects"
    },
    {
        id: "contact",
        onClick: () => scrollToElement("contactContainer"),
        itemTitle: "Contact"
    }
]

function FrontMenuOptions() {
    return (
        menuOptions.map(item => {
            return <p key={"optionItem-" + item.id} onClick={item.onClick}>{item.itemTitle}</p>
        })
    )
}

let currX = 0;
let currY = 0;
let activeDetails = false;
let directionLeft = false;

export type TechnologyType = {
    id: string,
    title: string,
    color: string,
    description:string,
    icon: string
}
type TechnologyEntryType = {
    id:string,
    description:string | null
}
export type ProjectType = {
    id: string,
    title: string,
    description: string,
    detailsDefault?: string,
    icon:string,
    technology: TechnologyEntryType[],
    link:{
        title:string,
        link:string
    }
}


let detailsMenuRoot: Root;
let linkRoot: Root;
function getProjectParent(e: Element | null) {
    if (e !== null) {
        let ret = e;
        while (ret.parentElement !== null && !ret.classList.contains("project-container")) {
            ret = ret.parentElement;
        }
        return ret;
    } else {
        console.log("not in viewport or smth");
        return e;
    }
}
function Technology({techEntries}: { techEntries: TechnologyEntryType[] }) {
    const technology:TechnologyType[] = [];

    for (let i=0;i<techEntries.length;i++){
        for (let j=0;j<technologies.length;j++){
            if (techEntries[i].id===technologies[j].id){
                const customDesc = techEntries[i].description;
                if (customDesc!=null){
                    technologies[j].description=customDesc;
                }
                technology.push(technologies[j]);
            }
        }
    }

    return (
        technology.map(item => {
            return <div key={item.id} id={"tech-" + item.id} className={`tech-item w-[48px] h-[48px] rounded-full mx-2`} style={{backgroundColor: item.color, boxShadow:"inset 0px 0px 0px 1px var(--theme-gray)"}} onMouseMove={() => {
                gebi("details_menu_title").innerHTML = item.title;
                gebi("details_menu_desc").innerHTML = item.description;
            }}>
                <img id={`tech-img-${item.id}`} src={`${item.icon}`}
                     className={"tech-img relative object-cover object-center w-full h-full p-2 rounded-full"} style={{backgroundColor:"var(--theme-gray)"}}
                     alt={`${item.title} icon`}/>
            </div>
        })
    )
}
function Projects() {
    function detailsMenu(event: React.MouseEvent) {
        let lastHovered: Element | null = event.target as Element;
        lastHovered = getProjectParent(lastHovered);
        setTimeout(function(){
            const currHovered = getProjectParent(document.elementFromPoint(currX,currY));
            if (lastHovered===currHovered){
                //start animation for highlighted element
                const currElement = currHovered as HTMLElement;
                if (!activeDetails) {
                    activeDetails = true;
                    gebi("bg_dim").style.display = "";
                    currElement.style.zIndex = "12";
                    gebi("details_background").style.zIndex = "11";
                    gebi("details_menu").style.display = "flex";
                    gebi("details_background").style.display = "";

                    const marginOffset = 25;
                    //see if put details on left or right
                    if (currElement.offsetLeft + currElement.offsetWidth * 2 > window.innerWidth) {
                        //left side (the main element on right)
                        directionLeft = true;
                        gebi("details_menu").style.left = "";
                        gebi("details_background").style.left = "";
                        const oldTransition = gebi("details_menu").style.transition;

                        gebi("details_menu").style.transition = ""; //set it to nothing to move the element right instantly
                        gebi("details_background").style.transition = "";

                        gebi("details_menu").style.right = (-10) + "px";
                        gebi("details_background").style.right = (-10) + "px";

                        gebi("details_menu").style.transition = oldTransition;
                        gebi("details_background").style.transition = oldTransition;

                        gebi("details_menu").style.right = (window.innerWidth - currElement.offsetLeft + marginOffset) + "px"; //now coming from right to the left
                        gebi("details_background").style.right = (window.innerWidth - currElement.offsetLeft - currElement.offsetWidth - marginOffset) + "px";

                        gebi("details_menu").style.transition = oldTransition;
                        gebi("details_background").style.transition = oldTransition;
                    } else {
                        //right side (the main element on left)
                        directionLeft = false;
                        gebi("details_menu").style.right = "";
                        gebi("details_background").style.right = "";
                        const oldTransition = gebi("details_menu").style.transition;

                        gebi("details_menu").style.transition = ""; //set it to nothing to move the element right instantly
                        gebi("details_background").style.transition = "";

                        gebi("details_menu").style.left = (-10) + "px";
                        gebi("details_background").style.left = (-10) + "px";

                        gebi("details_menu").style.transition = oldTransition;
                        gebi("details_background").style.transition = oldTransition;

                        gebi("details_menu").style.left = (currElement.offsetLeft + currElement.offsetWidth + marginOffset) + "px";
                        gebi("details_background").style.left = (currElement.offsetLeft - marginOffset) + "px";
                    }
                    gebi("details_menu").style.top = (currElement.offsetTop) + "px";
                    gebi("details_menu").style.width = (currElement.offsetWidth) + "px";
                    gebi("details_menu").style.height = (currElement.offsetHeight) + "px";

                    gebi("details_background").style.top = (currElement.offsetTop - marginOffset) + "px";
                    gebi("details_background").style.width = (currElement.offsetWidth * 2 + marginOffset * 3) + "px";
                    gebi("details_background").style.height = (currElement.offsetHeight + marginOffset * 2) + "px";

                    const id = currElement.id;
                    let proj: ProjectType = projects[0];
                    for (const p of projects) {
                        if (p.id === id) {
                            proj = p
                        }
                    }

                    linkRoot.render(
                        <>
                            <p onClick={() => {
                                window.open(proj.link.link, "_blank")
                            }} className={"project-link text-white"}
                               style={{cursor: "pointer", textDecoration: "underline"}}>{proj.link.title}</p>
                            <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[8px] h-[8px] ml-2"} style={{filter:"invert(1)"}}/>
                        </>
                    );
                    detailsMenuRoot.render(<Technology techEntries={proj.technology}/>);
                    if (proj.detailsDefault){
                        gebi("details_menu_desc").innerHTML=proj.detailsDefault;
                    }
                }
            }
        }, 500)
    }

    return (
        projects.map(project => {
            return (
                <div key={"project-"+project.id} id={project.id} className={"project-container m-4 min-h-[250px] flex flex-col rounded-2xl"} >
                    <div className={"project-content h-full p-3 rounded-2xl"} style={{border: "2px solid var(--theme-dark-gray)"}} onMouseEnter={detailsMenu}>
                        <div className={"project-topDiv flex justify-center items-center"}>
                            <img alt={project.title} src={project.icon} className={"project-icon w-[50px] h-[50px]"}/>
                            <div className={"project-title ml-2 mr-6 text-2xl"}>{project.title}</div>
                        </div>
                        <div className={"project-bottomDiv"}>
                            <p className={"text-center"}>{project.description}</p>
                        </div>
                    </div>
                </div>
            )
        })
    )
}

type ContactLinksType = {
    id: string,
    title: string,
    link: string,
    icon: string
}
const contactLinks: ContactLinksType[] = [
    {
        id: "email",
        title: "mzhang0213@gmail.com",
        link: "mailto:mzhang0213@gmail.com",
        icon: "/icons/gmail.png"
    },
    {
        id: "linkedin",
        title: "Linkedin",
        link: "https://linkedin.com/in/michael-zhang-a8a498276",
        icon: "/icons/linkedin.png"
    },
    {
        id: "github",
        title: "GitHub",
        link: "https://github.com/mzhang0213",
        icon: "/icons/github.png"
    },
    {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/mzjklol",
        icon: "/icons/instagram.png"
    }

]
function ContactLinks() {
    return (
        contactLinks.map(contact => {
            return <div key={contact.id} className={"flex p-2 mb-5 rounded-md"} onClick={()=>{window.open(contact.link,"_blank")}} style={{cursor: "pointer", boxShadow:"8px 8px 0px 0px var(--theme-green)", border:"2px solid var(--theme-dark-gray)"}}>
                <img src={contact.icon} alt={contact.title} className={"w-[32px] h-[32px] mr-2"}/>
                <p className={"w-[80%] flex items-center"}>{contact.title}</p>
                <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[12px] h-[12px] ml-2"}/>
            </div>
        })
    )
}

export default function Home() {
    useEffect(() => {

        linkRoot = createRoot(gebi("details_menu_link"));
        detailsMenuRoot = createRoot(gebi("details_menu_top"));

        //initial animation
        const showSmall = () => {
            gebi("messageSmall").style.top="15%";
            gebi("messageSmall").style.opacity="1";
        }
        const showLarge = () =>{
            gebi("messageLarge").style.top="40%";
            gebi("messageLarge").style.opacity="1";
        }
        const showMenu = () =>{
            gebi("openerMenu").style.top="0";
        }
        setTimeout(()=>{
            showSmall(); //0 ms from start
            setTimeout(()=>{
                showLarge(); //750 ms from start
                setTimeout(()=>{
                    showMenu(); //750+1000 ms from start
                },1000)
            },750)
        },0);

        document.body.addEventListener("mousemove",function(event: MouseEvent){
            currX = event.clientX;
            currY = event.clientY;
        })
        gebi("bg_dim").addEventListener("mousemove",function(){
            if (activeDetails){
                activeDetails=false;
                gebi("bg_dim").style.display="none";
                gebi("details_menu").style.width="";
                gebi("details_background").style.width="";
                gebi("details_background").style.zIndex="0";
                if (!directionLeft){
                    gebi("details_menu").style.left=(-gebi("details_menu").offsetWidth-10)+"px";
                    gebi("details_background").style.left=(-gebi("details_background").offsetWidth-10)+"px";
                }else{
                    gebi("details_menu").style.right="-10px";
                    gebi("details_background").style.right="-10px";
                }
                for(const e of gebi("projectsContainer").children){
                    gebi(e.id).style.zIndex="0";
                }
                gebi("details_menu_title").innerHTML="";
                gebi("details_menu_desc").innerHTML="";
                setTimeout(function(){
                    gebi("details_menu").style.display="none";
                    gebi("details_background").style.display="none";
                },detailsMenuWipe);
            }
        })
    }, []);
    return (
        <>
            <Navbar customItems={null}/>

            <Background/>
            <BackgroundDim/>

            <div id={"details_menu"} className={"absolute flex-col top-0 w-0 p-2 rounded-2xl"} style={{display:"none",backgroundColor:"var(--theme-dark-gray)", zIndex:"12", transition:`left ${detailsMenuWipe}ms ease-in-out, right ${detailsMenuWipe}ms ease-in-out, width ${detailsMenuWipe}ms ease-in-out ${detailsMenuWipe/2}ms`}}>
                <div id={"details_menu_link"} className={"w-full h-[10%] flex justify-center items-center"}></div>
                <div id={"details_menu_top"} className={"w-full h-[30%] flex justify-center items-center"}></div>
                <div id={"details_menu_bottom"} className={"w-full h-[60%]"}>
                    <p id={"details_menu_title"} className={"text-white text-xl"} style={{fontWeight:"bold"}}></p>
                    <p id={"details_menu_desc"} className={"text-white text-sm"}></p>
                </div>
            </div>

            <div id={"details_background"} className={"absolute top-0 w-0 p-2 rounded-xl opacity-90"} style={{display:"none",backgroundColor:"var(--theme-black)", zIndex:"11", transition:`left ${detailsMenuWipe}ms ease-in-out, right ${detailsMenuWipe}ms ease-in-out, width ${detailsMenuWipe}ms ease-in-out ${detailsMenuWipe/2}ms`}}></div>
            <div id={"openerContainer"} className={"animate"}>
                <div id={"openerMain"}>
                    <div id={"messageSmall"}
                         className={"object absolute flex justify-center items-center left-[15%] w-fit px-7 py-7 top-0 opacity-0"}
                         style={{
                             top: 0, // 0 >> 15%
                             transition: `opacity ${smallTransition}ms ease-in-out, top ${smallTransition}ms ease-in-out`
                         }}>
                        <p style={{textAlign: "center"}}>Welcome to my portfolio!</p>
                    </div>
                    <div id={"messageLarge"}
                         className={"object absolute flex justify-center items-center left-[27%] w-[50%] h-[35%] text-4xl px-12 py-12 opacity-0"}
                         style={{
                             top: 0, //0 >> 40%
                             transition: `opacity ${largeTransition}ms ease-in-out, top ${largeTransition}ms ease-in-out`
                         }}>
                        <p>Michael Zhang</p>
                    </div>
                </div>
                <div id={"openerMenuBg"}>
                    <div id={"openerMenu"}>
                        <img src={"/resources/explore.png"} alt={"explore more!"} className={"w-48 py-1"}
                             style={{filter: "invert(1)"}}/>
                        <FrontMenuOptions/>
                    </div>
                </div>
            </div>

            <div id={"summaryContainer"} className={"relative flex rounded-xl py-32 my-52"} style={{width: summaryContainerWidth + "vw", backgroundColor:"var(--theme-green)", left: (100 - summaryContainerWidth) / 2 + "vw", boxShadow:"8px 8px 0px 0px var(--theme-yellow)", border:"2px solid var(--theme-dark-gray)"}}>
                <div id={"summaryContainerLeft"} className={"w-[35%]"}>
                    <img id={"summaryImg"} src={"/resources/IMG_1399.jpg"}
                         className={"relative object-cover object-center w-[300px] h-[400px]"} style={{float: "right"}}
                         alt={"portrait photo"}/>
                </div>
                <div id={"summaryContainerRight"} className={"w-[65%] ml-5"}>
                    <div id={"summaryInfo"} className={"relative h-full flex flex-col justify-center"}>
                        <p id={"summary-title"} className={"text-4xl mb-2"}>Hi there!</p>
                        <p id={"summary-desc"} className={"w-[80%]"}>
                            I'm Michael, a rising sophomore at Northeastern University studying CS. I'm extremely passionate about everything computer science, from full-stack web development to computer vision and new fields like AI/Machine Learning.
                        </p>
                    </div>
                </div>
            </div>

            <div id={"projectsTitle"} className={"text-6xl text-white w-full mt-64 mb-8 flex justify-center items-center font-bold"}>
                <p className={"rounded-xl w-fit py-7 px-12"} style={{backgroundColor:"var(--theme-gray)", boxShadow:"8px 8px 0px 0px var(--theme-black)", border:"2px solid var(--theme-dark-gray)"}}>Projects</p>
            </div>
            <div id={"projectsContainer"} className={"grid grid-cols-3 mx-5 mb-64"}>
                <Projects/>
            </div>
            <div id={"contactContainer"} className={"relative flex flex-col justify-start items-center w-full pt-20 pb-60 mt-52"} style={{backgroundColor:"var(--theme-white)"}}>
                <div id={"contact-title"} className={"text-5xl mb-12 p-7 rounded-xl"} style={{boxShadow:"8px 8px 0px 0px var(--theme-blue)", border:"2px solid var(--theme-dark-gray)"}}>Contact Info</div>
                <div id={"contact-items"}>
                    <ContactLinks/>
                </div>
            </div>

            <Footer customItems={null}/>
        </>
    );
}
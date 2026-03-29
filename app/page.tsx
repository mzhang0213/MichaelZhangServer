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
import {experiences} from "@/app/experiences";


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

let activeDetails = false;
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let mobileToggleStates: {[key: string]: boolean} = {};

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
    },
    github?: string
}
export type ExperienceType = {
    id: string,
    title: string,
    role: string,
    duration: string,
    description: string,
    icon: string,
    type: "work" | "volunteer"
    link: string //will just be applied on the title
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
            return <div key={item.id} id={"tech-" + item.id} className={`tech-item w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] rounded-full mx-1 sm:mx-2`} style={{backgroundColor: item.color, boxShadow:"inset 0px 0px 0px 1px var(--theme-gray)"}} onMouseMove={() => {
                gebi("details_menu_title").innerHTML = item.title;
                gebi("details_menu_desc").innerHTML = item.description;
            }}>
                <img id={`tech-img-${item.id}`} src={`${item.icon}`}
                     className={"tech-img relative object-cover object-center w-full h-full p-1 sm:p-2 rounded-full"} style={{backgroundColor:"var(--theme-gray)"}}
                     alt={`${item.title} icon`}/>
            </div>
        })
    )
}
const MARGINOFFSET = 15;
const MINDETAILSHEIGHT = 275;
function Projects() {
    function handleMobileClick(event: React.MouseEvent, project: ProjectType) {
        if (window.innerWidth >= 640) return; // mobile only

        event.preventDefault();
        const projectElement = event.currentTarget as HTMLElement;
        const projectContent = projectElement.querySelector('.project-content') as HTMLElement;
        const isToggled = mobileToggleStates[project.id] || false;

        if (!isToggled) {
            mobileToggleStates[project.id] = true;

            const techElements = project.technology.map(techEntry => {
                let tech: TechnologyType | undefined;
                for (const t of technologies) {
                    if (t.id === techEntry.id) {
                        tech = t;
                        break;
                    }
                }
                if (!tech) return '';

                const description = techEntry.description || tech.description;
                return `<div class="tech-item w-[32px] h-[32px] rounded-full mx-1 flex-shrink-0 cursor-pointer" style="background-color: ${tech.color}; box-shadow: inset 0px 0px 0px 1px var(--theme-gray)" data-tech-id="${tech.id}" data-project-id="${project.id}" data-tech-desc="${description.replace(/"/g, '&quot;')}" data-tech-title="${tech.title}">
                    <img src="${tech.icon}" class="w-full h-full p-1 rounded-full object-cover" style="background-color: var(--theme-gray)" alt="${tech.title}"/>
                </div>`;
            }).join('');

            projectContent.style.border="3px solid var(--theme-blue)"
            projectContent.innerHTML = `
                <div class="flex justify-center items-center mb-3">
                    <a href="${project.link.link}" target="_blank" class="project-link-mobile text-white underline text-sm flex items-center">
                        ${project.link.title}
                        <img src="/icons/redirect.png" alt="redirect" class="w-[8px] h-[8px] ml-2" style="filter:invert(1)"/>
                    </a>
                </div>
                <div class="flex flex-wrap justify-center items-center mb-3">
                    ${techElements}
                </div>
                <div>
                    <p class="text-white text-xs text-center mobile-desc">${project.detailsDefault || project.description}</p>
                </div>
            `;
        } else {
            mobileToggleStates[project.id] = false;

            projectContent.style.border="2px solid var(--theme-dark-gray)";
            projectContent.innerHTML = `
                <div class="project-topDiv flex justify-center items-center">
                    <img alt="${project.title}" src="${project.icon}" class="project-icon w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"/>
                    <div class="project-title ml-2 mr-2 sm:mr-6 text-lg sm:text-2xl">${project.title}</div>
                </div>
                <div class="project-bottomDiv">
                    <p class="text-center text-sm sm:text-base">${project.description}</p>
                </div>
            `;
        }
    }

    function detailsMenu(event: React.MouseEvent) {
        if (window.innerWidth < 640) return;
        if (activeDetails) return;

        if (holdTimer !== null) { clearTimeout(holdTimer); holdTimer = null; }

        const targetElement = getProjectParent(event.target as Element) as HTMLElement;
        if (!targetElement) return;

        targetElement.classList.add('card-held');

        holdTimer = setTimeout(function() {
            holdTimer = null;
            if (!activeDetails) {
                const currElement = targetElement;
                const containerHeight = MINDETAILSHEIGHT + MARGINOFFSET * 3 + currElement.offsetHeight;
                activeDetails = true;
                currElement.classList.add('see-more-active');
                gebi("bg_dim").style.animation = `fadeInFromNone ${detailsMenuWipe}ms ease-out`;
                gebi("bg_dim").style.display = "";
                gebi("bg_dim").style.opacity = "1";
                currElement.style.zIndex = "12";
                gebi("details_background").style.zIndex = "11";
                gebi("details_background").style.visibility = "visible";
                gebi("details_background").style.opacity = "1";

                gebi("details_menu_container").style.height = containerHeight + "px";
                gebi("details_background").style.left = (currElement.offsetLeft - MARGINOFFSET) + "px";
                gebi("details_background").style.top = (currElement.offsetTop - MARGINOFFSET) + "px";
                gebi("details_background").style.width = (currElement.offsetWidth + MARGINOFFSET * 2) + "px";
                gebi("details_menu").style.width = (currElement.offsetWidth) + "px";
                gebi("details_menu_desc").style.width = (currElement.offsetWidth - 16) + "px";
                gebi("details_menu_link").style.width = (currElement.offsetWidth - 16) + "px";
                gebi("details_menu_top").style.width = (currElement.offsetWidth - 16) + "px";
                gebi("details_menu").style.height = (MINDETAILSHEIGHT) + "px";
                gebi("details_menu").style.marginBottom = (MARGINOFFSET+10) + "px";
                gebi("details_background").style.height = containerHeight + "px";

                const id = currElement.id;
                let proj: ProjectType = projects[0];
                for (const p of projects) { if (p.id === id) { proj = p; } }

                linkRoot.render(
                    <>
                        {proj.link.link.includes("github.com") && <img src={"/icons/github.png"} alt={"github"} className={"w-[12px] h-[12px] mr-1"} style={{filter:"invert(1)"}}/>}
                        <p onClick={() => { window.open(proj.link.link, "_blank"); }} className={"project-link text-white"} style={{cursor:"pointer",textDecoration:"underline"}}>{proj.link.title}</p>
                        <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[8px] h-[8px] ml-2"} style={{filter:"invert(1)"}}/>
                    </>
                );
                detailsMenuRoot.render(<Technology techEntries={proj.technology}/>);
                gebi("details_menu_desc").innerHTML = proj.description;
            }
        }, 500);
    }

    return (
        projects.map(project => {
            return (
                //min-h-[200px] sm:min-h-[250px]
                <div key={"project-"+project.id} id={project.id} className={"project-container m-2 sm:m-4 flex flex-col rounded-2xl"}
                     onClick={(e) => handleMobileClick(e, project)}
                     onMouseMove={function(e){
                         gebi("details_menu_title").innerHTML="";
                         gebi("details_menu_desc").innerHTML=project.description;
                     }}
                >
                    <div className={"project-content h-full p-2 sm:p-3 rounded-2xl"} style={{border: "2px solid var(--theme-dark-gray)"}} onMouseDown={(e) => detailsMenu(e)}>
                        <div className={"project-topDiv flex justify-center items-center"}>
                            <img alt={project.title} src={project.icon} className={"project-icon w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"}/>
                            <div className={"project-title ml-2 mr-2 sm:mr-6 text-lg sm:text-2xl text-center"}>{project.title}</div>
                        </div>
                        <div className={"project-bottomDiv"}>
                            {/*<p className={"text-center text-sm sm:text-base"}>{project.description}</p>*/}
                        </div>
                    </div>
                    <div className={"see-more-wrapper hidden sm:block"}>
                        {/* Right-pointing arrow (left/mid column cards) */}
                        <svg className={"see-more-arrow-right-svg"} width="160" height="80" overflow="visible" style={{position:"absolute",top:0,left:0}}>
                            <path className={"see-more-arrow-path"} d="M 5 40 C 25 20, 65 10, 73 65" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" pathLength="100"/>
                            <path className={"see-more-arrow-head"} d="M 73 70 L 79 56" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                            <path className={"see-more-arrow-head"} d="M 73 70 L 64 59" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                        </svg>
                        {/* Left-pointing arrow (right column cards) */}
                        <svg className={"see-more-arrow-left-svg"} width="160" height="80" overflow="visible" style={{position:"absolute",top:0,left:0}}>
                            <path className={"see-more-arrow-path"} d="M 155 40 C 135 20, 95 10, 87 65" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" pathLength="100"/>
                            <path className={"see-more-arrow-head"} d="M 87 70 L 81 56" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                            <path className={"see-more-arrow-head"} d="M 87 70 L 96 59" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                        </svg>
                        <div
                            className={"see-more-bubble"}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.link.link, "_blank");
                            }}
                        >
                            <span>See more!</span>
                            <img src={"/icons/redirect.png"} alt={"redirect"} style={{width:"8px",height:"8px"}}/>
                        </div>
                    </div>
                    {project.github && (
                        <div
                            className={"github-bubble hidden sm:block"}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.github!, "_blank");
                            }}
                        >
                            <img src={"/icons/github.png"} alt={"GitHub"} style={{width:"34px",height:"34px"}}/>
                        </div>
                    )}
                </div>
            )
        })
    )
}

function Experiences() {
    const mainFont = "var(--theme-white)"
    return (
        experiences.map(exp => {
            return <div key={exp.id} id={exp.id} className={"flex p-2 mb-6 sm:mb-10 rounded-md"} style={{
                boxShadow: "8px 8px 0px 0px var(--theme-purple)",
                backgroundColor: "var(--theme-gray)",
                border: "2px solid var(--theme-dark-gray)"
            }}>
                <img src={exp.icon} alt={exp.title} className={"h-[40px] sm:h-[50px] mt-[10px] ml-1 mr-1 rounded-lg"}/>
                <div className={"flex flex-col w-full p-1 sm:p-2 mb-6 sm:mb-10 rounded-md"}>
                    <div className={"flex flex-row w-full"}>
                        <p className={"text-lg sm:text-2xl flex items-center w-fit"} style={{cursor: "pointer", color: mainFont}} onClick={() => {window.open(exp.link, "_blank")}}>
                            {exp.title}
                        </p>
                    </div>
                    <p className={"text-[10px] sm:text-[12px] w-[100%] flex items-center mb-1 text-gray-400"}>
                        {exp.role}&nbsp;&nbsp;|&nbsp;&nbsp;<i>{exp.duration}</i>
                    </p>
                    <p className={"text-[14px] sm:text-[16px] w-[100%] flex items-center"} style={{color: mainFont}}>
                        {exp.description}
                    </p>
                </div>
            </div>
            //<img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[12px] h-[12px] ml-2"}/>
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
        title: "michael@mzhang.dev",
        link: "mailto:michael@mzhang.dev",
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
    }

]
function ContactLinks() {
    return (
        contactLinks.map(contact => {
            return <div key={contact.id} className={"flex p-2 mb-3 sm:mb-5 rounded-md"} onClick={()=>{window.open(contact.link,"_blank")}} style={{cursor: "pointer", boxShadow:"8px 8px 0px 0px var(--theme-green)", border:"2px solid var(--theme-dark-gray)"}}>
                <img src={contact.icon} alt={contact.title} className={"w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] mr-2"}/>
                <p className={"w-[80%] flex items-center text-sm sm:text-base"}>{contact.title}</p>
                <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] ml-2"}/>
            </div>
        })
    )
}

export default function Home() {
    useEffect(() => {

        linkRoot = createRoot(gebi("details_menu_link"));
        detailsMenuRoot = createRoot(gebi("details_menu_top"));

        document.body.style.overflowX = "hidden";

        document.body.addEventListener('click', function(event: Event) {
            const target = event.target as HTMLElement;
            
            // Handle technology item clicks
            const techItem = target.closest('.tech-item');
            if (techItem && techItem.hasAttribute('data-tech-id')) {
                event.stopPropagation();
                const projectId = techItem.getAttribute('data-project-id');
                const techDesc = techItem.getAttribute('data-tech-desc');
                const descElement = document.querySelector(`#${projectId} .mobile-desc`) as HTMLElement;
                if (descElement && techDesc) {
                    descElement.innerHTML = techDesc;
                }
                const techItems = techItem.parentElement as HTMLElement;
                for (let children of techItems.children){
                    let childrenItem = children as HTMLElement;
                    childrenItem.style.border = "";
                }
                let currItem = techItem as HTMLElement;
                currItem.style.border = `2px solid ${currItem.style.backgroundColor}`;
            }
            
            // Handle project link clicks
            const projectLink = target.closest('.project-link-mobile');
            if (projectLink) {
                event.preventDefault();
                const href = projectLink.getAttribute('href');
                if (href) {
                    window.open(href, '_blank');
                }
            }
        });

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
            gebi("openerMenu").style.right="0";
        }
        setTimeout(()=>{
            showSmall(); //0 ms from start
            setTimeout(()=>{
                showLarge(); //750 ms from start
            },250)
            setTimeout(()=>{
                showMenu(); //750+1000 ms from start
            },750)
        },0);

        document.body.addEventListener("mousemove",function(event: MouseEvent){
            if (window.innerWidth >= 640) { // no tracking mobile
                currX = event.clientX;
                currY = event.clientY;
            }
        })
        function updateCardColumns() {
            const container = gebi("projectsContainer");
            const cards = Array.from(container.children) as HTMLElement[];
            if (!cards.length) return;
            let currentTop = -1;
            let currentRow: HTMLElement[] = [];
            const rows: HTMLElement[][] = [];
            for (const card of cards) {
                const el = card as HTMLElement;
                if (el.offsetTop !== currentTop) {
                    if (currentRow.length) rows.push(currentRow);
                    currentRow = [el];
                    currentTop = el.offsetTop;
                } else {
                    currentRow.push(el);
                }
            }
            if (currentRow.length) rows.push(currentRow);
            for (const row of rows) {
                const n = row.length;
                row.forEach((card, i) => {
                    card.classList.remove('card-col-left', 'card-col-mid', 'card-col-right');
                    if (n <= 1 || i === 0) card.classList.add('card-col-left');
                    else if (i === n - 1) card.classList.add('card-col-right');
                    else card.classList.add('card-col-mid');
                });
            }
        }
        updateCardColumns();
        window.addEventListener('resize', updateCardColumns);

        document.addEventListener("mouseup", function() {
            if (holdTimer !== null) { clearTimeout(holdTimer); holdTimer = null; }
            for (const e of gebi("projectsContainer").children) {
                (e as HTMLElement).classList.remove('card-held');
            }
        });

        gebi("bg_dim").addEventListener("click",function(){
            if (activeDetails && window.innerWidth >= 640){ // dim only on comp
                activeDetails=false;
                gebi("details_background").style.height="0";
                gebi("details_background").style.opacity="0";
                gebi("bg_dim").style.animation=`fadeOutToNone ${detailsMenuWipe}ms ease-out`;
                gebi("bg_dim").style.opacity="0";
                setTimeout(function(){
                    gebi("details_menu_title").innerHTML="";
                    gebi("details_menu_desc").innerHTML="";
                    for(const e of gebi("projectsContainer").children){
                        gebi(e.id).style.zIndex="0";
                        gebi(e.id).classList.remove('see-more-active');
                        gebi(e.id).classList.remove('card-held');
                    }
                    gebi("bg_dim").style.display="none";
                    gebi("details_background").style.zIndex="0";
                    gebi("details_background").style.left=(-gebi("details_background").offsetWidth-10)+"px";
                    gebi("details_background").style.visibility="hidden";
                },detailsMenuWipe);
            }
        })
        return () => window.removeEventListener('resize', updateCardColumns);
    }, []);
    return (
        <>
            <Navbar customItems={null} alwaysShow={false}/>

            <Background/>
            <BackgroundDim/>


            <div id={"details_background"} className={"absolute top-0 w-0 h-0 p-2 rounded-xl opacity-0"} style={{
                visibility: "hidden",
                backgroundColor: "var(--theme-black)",
                zIndex: "11",
                overflow:"hidden",
                //left ${detailsMenuWipe}ms ease-in-out, right ${detailsMenuWipe}ms ease-in-out,
                transition: `height ${detailsMenuWipe}ms ease-in-out, opacity ${detailsMenuWipe}ms ease-in-out`
            }}>
                <div id={"details_menu_container"} className={"w-full flex justify-center items-end"}>
                    <div id={"details_menu"} className={"relative flex-col top-0 w-0 p-2 rounded-2xl"} style={{
                        display:"flex",
                        position:"relative",
                        backgroundColor: "var(--theme-dark-gray)",
                        // zIndex: "12",
                        overflow: "hidden",
                        // transition: `height ${detailsMenuWipe}ms ease-in-out ${detailsMenuWipe / 2}ms`
                    }}>
                        <div id={"details_menu_link"} className={"w-full h-fit flex justify-center items-center"}></div>
                        <div id={"details_menu_top"}
                             className={"w-full h-fit mb-auto py-3 flex flex-wrap justify-center items-center"}></div>
                        <div id={"details_menu_bottom"} className={"w-full h-[60%] overflow-x-hidden overflow-y-auto"} style={{scrollbarWidth:"thin"}}>
                            <p id={"details_menu_title"} className={"text-white text-lg sm:text-xl"}
                               style={{fontWeight: "bold"}}></p>
                            <p id={"details_menu_desc"} className={"text-white text-xs sm:text-sm"}></p>
                        </div>
                    </div>
                </div>
            </div>
            <div id={"openerContainer"} className={"animate"}>
                <div id={"openerMain"}>
                    <div id={"messageSmall"}
                         className={"object absolute flex justify-center items-center left-[5%] sm:left-[15%] w-fit px-4 sm:px-7 py-4 sm:py-7 top-0 opacity-0"}
                         style={{
                             top: 0, // 0 >> 15%
                             transition: `opacity ${smallTransition}ms ease-in-out, top ${smallTransition}ms ease-in-out`
                         }}>
                        <p className={"text-sm sm:text-base"} style={{textAlign: "center"}}>Welcome to my portfolio!</p>
                    </div>
                    <div id={"messageLarge"}
                         className={"object absolute flex justify-center items-center left-[10%] sm:left-[27%] w-[80%] sm:w-[50%] h-[35%] text-2xl sm:text-4xl px-6 sm:px-12 py-6 sm:py-12 opacity-0"}
                         style={{
                             top: 0, //0 >> 40%
                             transition: `opacity ${largeTransition}ms ease-in-out, top ${largeTransition}ms ease-in-out`
                         }}>
                        <p>Michael Zhang</p>
                    </div>
                </div>
                <div id={"openerMenuBg"}>
                    <div id={"openerMenu"}>
                        <img src={"/resources/explore.png"} alt={"explore more!"} className={"w-32 sm:w-48 py-1"}
                             style={{filter: "invert(1)"}}/>
                        <FrontMenuOptions/>
                    </div>
                </div>
            </div>

            <div id={"summaryContainer"} className={"relative flex flex-col sm:flex-row rounded-xl py-16 sm:py-32 my-32 sm:my-52"} style={{
                width: summaryContainerWidth + "vw",
                backgroundColor: "var(--theme-green)",
                left: (100 - summaryContainerWidth) / 2 + "vw",
                boxShadow: "8px 8px 0px 0px var(--theme-yellow)",
                border: "2px solid var(--theme-dark-gray)"
            }}>
                <div id={"summaryContainerLeft"} className={"w-full ml-8 sm:w-[35%] flex justify-center sm:block"}>
                    <img id={"summaryImg"} src={"/resources/IMG_1399.jpg"}
                         className={"relative object-cover object-center w-[250px] sm:w-[300px] h-[300px] sm:h-[400px]"} style={{float: "right"}}
                         alt={"portrait photo"}/>
                </div>
                <div id={"summaryContainerRight"} className={"w-full sm:w-[65%] ml-0 sm:ml-5 mt-6 sm:mt-0"}>
                    <div id={"summaryInfo"} className={"relative h-full flex flex-col justify-center px-4 sm:px-0"}>
                        <p id={"summary-title"} className={"text-2xl sm:text-4xl mb-2"}>Hi there!</p>
                        <p id={"summary-desc"} className={"w-full sm:w-[80%] text-base sm:text-lg"}>
                            I'm Michael, a sophomore at Northeastern University studying CS. I'm extremely
                            passionate about everything computer science, from full-stack web development to computer
                            vision and new fields like AI/Machine Learning. I'm excited to learn more and build my
                            career in the world of tech!
                            <br/>
                            <br/>
                            <span style={{fontSize:"16px"}}>Outside of programming I enjoy basketball, skating, piano, travelling, discovering new food, and j-pop.</span>
                        </p>
                    </div>
                </div>
            </div>

            <div id={"projectsTitle"}
                 className={"text-4xl sm:text-6xl text-white w-full mt-32 sm:mt-64 mb-6 sm:mb-8 flex justify-center items-center font-bold"}>
                <p className={"rounded-xl w-fit py-4 sm:py-7 px-6 sm:px-12"} style={{
                    backgroundColor: "var(--theme-gray)",
                    boxShadow: "8px 8px 0px 0px var(--theme-black)",
                    border: "2px solid var(--theme-dark-gray)"
                }}>Projects</p>
            </div>
            <div id={"projectsContainer"} className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-[80%] mx-auto mb-32"}>
                <Projects/>
            </div>

            <div id={"experienceTitle"}
                 className={"text-4xl sm:text-6xl text-white w-full mt-32 sm:mt-56 mb-6 sm:mb-8 flex justify-center items-center font-bold"}>
                <p className={"rounded-xl w-fit py-4 sm:py-7 px-6 sm:px-12"} style={{
                    backgroundColor: "var(--theme-gray)",
                    boxShadow: "8px 8px 0px 0px var(--theme-black)",
                    border: "2px solid var(--theme-dark-gray)"
                }}>Experience</p>
            </div>
            <div id={"experienceContainer"} className={"flex flex-col mx-4 sm:mx-20 mb-32 sm:mb-64"}>
                <Experiences/>
            </div>

            <div id={"contactContainer"}
                 className={"relative flex flex-col justify-start items-center w-full pt-12 sm:pt-20 pb-32 sm:pb-60 mt-32 sm:mt-52"}
                 style={{backgroundColor: "var(--theme-white)"}}>
                <div id={"contact-title"} className={"text-3xl sm:text-5xl mb-8 sm:mb-12 p-4 sm:p-7 rounded-xl"} style={{
                    boxShadow: "8px 8px 0px 0px var(--theme-blue)",
                    border: "2px solid var(--theme-dark-gray)"
                }}>Contact Info
                </div>
                <div id={"contact-items"}>
                    <ContactLinks/>
                </div>
            </div>

            <Footer customItems={null}/>
        </>
    );
}
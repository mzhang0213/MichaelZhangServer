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
import {reset} from "next/dist/lib/picocolors";


const summaryContainerWidth = 85;
const smallTransition = 500;
const largeTransition = 1000;
const detailsMenuWipe = 300;
const BLOOM_WIDTH = 420;

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
let activeExpDetails = false;
let helpModalActive = false;
let directionLeft = false;
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
    bgIcon: string,
    type: "work" | "volunteer"
    link: string //will just be applied on the title
}


let detailsMenuRoot: Root;
let linkRoot: Root;
let expDetailsMenuRoot: Root;
let expLinkRoot: Root;
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
function resetChildrenZIndex(){
    for (const e of gebi("projectsContainer").children) {
        gebi(e.id).style.zIndex = "0";
    }
    for (const e of gebi("experienceContainer").children) {
        gebi(e.id).style.zIndex = "0";
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
                    <img alt="${project.title}" src="${project.icon}" class="project-icon w-[50px] h-[50px]"/>
                    <div class="project-title ml-2 mr-6 text-2xl">${project.title}</div>
                </div>
                <div class="project-bottomDiv">
                    <p class="text-center text-base">${project.description}</p>
                </div>
            `;
        }
    }

    function detailsMenu(event: React.MouseEvent) {
        if (window.innerWidth < 640) return; // skip on mobile

        let lastHovered: Element | null = event.target as Element;
        lastHovered = getProjectParent(lastHovered);
        console.log(lastHovered)
        setTimeout(function(){
            const currHovered = getProjectParent(document.elementFromPoint(currX,currY));
            console.log(currHovered)
            if (lastHovered===currHovered){
                //start animation for highlighted element
                const currElement = currHovered as HTMLElement;
                const containerHeight = (MINDETAILSHEIGHT + MARGINOFFSET * 3 + currElement.offsetHeight)
                if (!activeDetails) {
                    activeDetails = true;
                    currElement.classList.add('see-more-active');
                    gebi("bg_dim").style.animation = `fadeInFromNone ${detailsMenuWipe}ms ease-out`;
                    gebi("bg_dim").style.display = "";
                    gebi("bg_dim").style.opacity = "1";
                    resetChildrenZIndex()
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
                    gebi("details_menu").style.marginBottom = (MARGINOFFSET + 10) + "px";
                    gebi("details_background").style.height = containerHeight + "px";

                    const id = currElement.id;
                    let proj: ProjectType = projects[0];
                    for (const p of projects) {
                        if (p.id === id) {
                            proj = p
                        }
                    }
                    linkRoot.render(
                      <>
                          {proj.link.link.includes("github.com") &&
                            <img src={"/icons/github.png"} alt={"github"} className={"w-[12px] h-[12px] mr-1"}
                                 style={{filter: "invert(1)"}}/>}
                          <p onClick={() => {
                              window.open(proj.link.link, "_blank");
                          }} className={"project-link text-white"}
                             style={{cursor: "pointer", textDecoration: "underline"}}>{proj.link.title}</p>
                          <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[8px] h-[8px] ml-2"}
                               style={{filter: "invert(1)"}}/>
                      </>
                    );
                    detailsMenuRoot.render(<Technology techEntries={proj.technology}/>);
                    gebi("details_menu_desc").innerHTML = proj.description;
                }
            }
        }, 500)
    }

    return (
        projects.map(project => {
            return (
                //min-h-[200px] sm:min-h-[250px]
                <div key={"project-"+project.id} id={project.id} className={"project-container m-4 flex flex-col rounded-2xl"}
                     onClick={(e) => handleMobileClick(e, project)}>
                    <div className={"project-content h-full p-3 rounded-2xl"} style={{border: "2px solid var(--theme-dark-gray)"}} onMouseEnter={detailsMenu}>
                        <div className={"project-topDiv flex justify-center items-center"}>
                            <img alt={project.title} src={project.icon} className={"project-icon w-[50px] h-[50px]"}/>
                            <div className={"project-title ml-2 mr-6 text-2xl text-center"}>{project.title}</div>
                        </div>
                        <div className={"project-bottomDiv"}>
                            {/*<p className={"text-center text-sm sm:text-base"}>{project.description}</p>*/}
                        </div>
                    </div>
                    <div className={"see-more-wrapper block"}>
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
                            className={"github-bubble block"}
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

function ExperienceGrid() {
    function expDetailsMenu(event: React.MouseEvent) {
        if (window.innerWidth < 640) return;

        let lastHovered: Element | null = event.target as Element;
        lastHovered = getProjectParent(lastHovered);
        setTimeout(function(){
            const currHovered = getProjectParent(document.elementFromPoint(currX,currY));
            if (lastHovered===currHovered){
                const currElement = currHovered as HTMLElement;
                const containerHeight = (MINDETAILSHEIGHT + MARGINOFFSET * 3 + currElement.offsetHeight)
                if (!activeExpDetails) {
                    activeExpDetails = true;
                    gebi("bg_dim").style.animation = `fadeInFromNone ${detailsMenuWipe}ms ease-out`;
                    gebi("bg_dim").style.display = "";
                    gebi("bg_dim").style.opacity = "1";
                    resetChildrenZIndex()
                    const bloomWidth = Math.max(BLOOM_WIDTH, currElement.offsetWidth + MARGINOFFSET * 2);
                    const bloomHeight = MINDETAILSHEIGHT + MARGINOFFSET * 2;
                    const cardCenterX = currElement.offsetLeft + currElement.offsetWidth / 2;
                    const cardCenterY = currElement.offsetTop + currElement.offsetHeight / 2;
                    const bloomLeft = cardCenterX - bloomWidth / 2;
                    const bloomTop = cardCenterY - bloomHeight / 2;

                    const db = gebi("exp_details_background");
                    db.style.transition = "none";
                    db.style.transformOrigin = "center center";
                    db.style.transform = "scale(0)";
                    db.style.left = bloomLeft + "px";
                    db.style.top = bloomTop + "px";
                    db.style.width = bloomWidth + "px";
                    db.style.height = bloomHeight + "px";
                    db.style.zIndex = "11";
                    db.style.visibility = "visible";
                    db.style.opacity = "0";
                    // gebi("exp_details_menu_container").style.height = bloomHeight + "px";

                    requestAnimationFrame(() => {
                        db.style.transition = `transform ${detailsMenuWipe}ms ease-out, opacity ${detailsMenuWipe}ms ease-out`;
                        db.style.transform = "scale(1)";
                        db.style.opacity = "1";
                    });
                    gebi("exp_details_menu").style.width = (bloomWidth - MARGINOFFSET * 2) + "px";
                    gebi("exp_details_menu_desc").style.width = (bloomWidth - MARGINOFFSET * 2 - 16) + "px";
                    gebi("exp_details_menu_link").style.width = (bloomWidth - MARGINOFFSET * 2 - 16) + "px";
                    gebi("exp_details_menu_top").style.width = (bloomWidth - MARGINOFFSET * 2 - 16) + "px";
                    // gebi("exp_details_menu").style.height = (MINDETAILSHEIGHT) + "px";

                    const id = currElement.id;
                    let exp: ExperienceType = experiences[0];
                    for (const e of experiences) { if (e.id === id) { exp = e; } }

                    // Position & activate standalone see-more wrapper
                    const smw = gebi("exp_see_more_wrapper");
                    const smArrowR = gebi("exp_see_more_arrow_right");
                    const smArrowL = gebi("exp_see_more_arrow_left");
                    const isRightCol = currElement.classList.contains('card-col-right');
                    const smWidth = 160;
                    smw.style.visibility = "visible";
                    smw.style.top = (bloomTop + bloomHeight * 0.5 - 43) + "px";
                    if (isRightCol) {
                        smw.style.left = (bloomLeft - smWidth) + "px";
                        smArrowR.style.display = "none";
                        smArrowL.style.display = "block";
                    } else {
                        smw.style.left = (bloomLeft + bloomWidth) + "px";
                        smArrowR.style.display = "block";
                        smArrowL.style.display = "none";
                    }
                    const smBubble = gebi("exp_see_more_bubble");
                    if (isRightCol) {
                        smBubble.style.left = "50px";
                        smBubble.style.right = "auto";
                    } else {
                        smBubble.style.left = "auto";
                        smBubble.style.right = "50px";
                    }
                    smBubble.onclick = (e) => { e.stopPropagation(); window.open(exp.link, "_blank"); };
                    smw.classList.add('see-more-active');

                    expLinkRoot.render(
                        <>
                            <p onClick={() => { window.open(exp.link, "_blank"); }} className={"project-link text-white"} style={{cursor:"pointer",textDecoration:"underline"}}>{"Website link!"}</p>
                            <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[8px] h-[8px] ml-2"} style={{filter:"invert(1)"}}/>
                        </>
                    );
                    expDetailsMenuRoot.render(
                    <>
                        <div className="asdf pointer-events-none absolute inset-0 z-0 overflow-hidden">
                            <div
                              className={`h-[150%] w-[150%] -translate-x-10 -translate-y-10 -skew-y-12 bg-[url('${exp.bgIcon}')] bg-[length:60px_60px] bg-repeat opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]`}>
                            </div>
                        </div>
                    </>
                    );
                    gebi("exp_details_menu_desc").innerHTML = `<span style="color:gray;font-size:12px">${exp.role} &nbsp;|&nbsp; <i>${exp.duration}</i></span><br/><br/>${exp.description}`;
                }
            }
        }, 500)
    }

    return (
      experiences.map(exp => (
        <div key={"exp-" + exp.id} id={exp.id}
             className={"project-container experience-container m-4 flex flex-col rounded-2xl"}
             onMouseMove={() => {
                 gebi("exp_details_menu_title").innerHTML = ""; }}
            >
                <div className={"project-content h-full p-6 rounded-2xl flex justify-center items-center"} style={{border: "2px solid var(--theme-dark-gray)"}} onMouseEnter={expDetailsMenu}>
                    <img alt={exp.title} src={exp.icon} className={"w-[60px] h-[60px] object-contain rounded-sm"}/>
                </div>
            </div>
        ))
    );
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
    },
    {
        id: "resume",
        title: "Resume",
        link: "https://resume.mzhang.dev",
        icon: "/icons/document.png"
    }

]
function ContactLinks() {
    return (
        contactLinks.map(contact => {
            return <div key={contact.id} className={"flex p-2 mb-5 rounded-md"} onClick={()=>{window.open(contact.link,"_blank")}} style={{cursor: "pointer", boxShadow:"8px 8px 0px 0px var(--theme-green)", border:"2px solid var(--theme-dark-gray)"}}>
                <img src={contact.icon} alt={contact.title} className={"w-[32px] h-[32px] mr-2"}/>
                <p className={"w-[80%] flex items-center text-base"}>{contact.title}</p>
                <img src={"/icons/redirect.png"} alt={"redirect"} className={"w-[12px] h-[12px] ml-2"}/>
            </div>
        })
    )
}

export default function Home() {
    useEffect(() => {
        linkRoot = createRoot(gebi("details_menu_link"));
        detailsMenuRoot = createRoot(gebi("details_menu_top"));
        expLinkRoot = createRoot(gebi("exp_details_menu_link"));
        expDetailsMenuRoot = createRoot(gebi("exp_details_menu_top"));

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

        function updateExpColumns() {
            const container = gebi("experienceContainer");
            const cards = Array.from(container.children) as HTMLElement[];
            if (!cards.length) return;
            let currentTop = -1;
            let currentRow: HTMLElement[] = [];
            const rows: HTMLElement[][] = [];
            for (const card of cards) {
                if (card.offsetTop !== currentTop) {
                    if (currentRow.length) rows.push(currentRow);
                    currentRow = [card];
                    currentTop = card.offsetTop;
                } else {
                    currentRow.push(card);
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
        updateExpColumns();
        window.addEventListener('resize', updateExpColumns);

        function closeDetails() {
            if ((!activeDetails && !activeExpDetails) || window.innerWidth < 640) return;

            gebi("bg_dim").style.animation = `fadeOutToNone ${detailsMenuWipe}ms ease-out`;
            gebi("bg_dim").style.opacity = "0";

            for (const e of gebi("projectsContainer").children) {
                gebi(e.id).classList.remove('see-more-active');
                gebi(e.id).classList.remove('card-held');
            }
            for (const e of gebi("experienceContainer").children) {
                gebi(e.id).classList.remove('see-more-active');
                gebi(e.id).classList.remove('card-held');
            }

            if (activeDetails) {
                activeDetails = false;
                gebi("details_background").style.height = "0";
                gebi("details_background").style.opacity = "0";
                setTimeout(function() {
                    gebi("details_menu_title").innerHTML = "";
                    gebi("details_menu_desc").innerHTML = "";
                    gebi("details_background").style.zIndex = "0";
                    gebi("details_background").style.left = (-gebi("details_background").offsetWidth - 10) + "px";
                    gebi("details_background").style.visibility = "hidden";
                }, detailsMenuWipe);
            }

            if (activeExpDetails) {
                activeExpDetails = false;
                gebi("exp_details_background").style.transform = "scale(0)";
                gebi("exp_details_background").style.opacity = "0";
                // Trigger dismiss animations on standalone see-more wrapper
                gebi("exp_see_more_wrapper").classList.remove('see-more-active');
                setTimeout(function() {
                    gebi("exp_details_menu_title").innerHTML = "";
                    gebi("exp_details_menu_desc").innerHTML = "";
                    gebi("exp_details_background").style.zIndex = "0";
                    gebi("exp_details_background").style.left = (-gebi("exp_details_background").offsetWidth - 10) + "px";
                    gebi("exp_details_background").style.visibility = "hidden";
                }, detailsMenuWipe);
            }

            setTimeout(function() {
                gebi("bg_dim").style.display = "none";
            }, detailsMenuWipe);
        }

        gebi("bg_dim").addEventListener("click", function() {
            if (helpModalActive) {
                helpModalActive = false;
                gebi("bg_dim").style.animation = `fadeOutToNone ${detailsMenuWipe}ms ease-out`;
                gebi("bg_dim").style.opacity = "0";
                setTimeout(function() {
                    gebi("bg_dim").style.display = "none";
                    gebi("help_modal").style.display = "none";
                }, detailsMenuWipe);
            } else {
                closeDetails();
            }
        });

        // Help system — track lifetime visits via localStorage
        const visitKey = 'mz_help_visits';
        const visitCount = parseInt(localStorage.getItem(visitKey) || '0') + 1;
        localStorage.setItem(visitKey, visitCount.toString());
        const showHelpPtr = visitCount <= 3;

        let helpBtnVisible = false;

        const helpScrollHandler = function() {
            const pastOpener = window.scrollY > window.innerHeight * 0.5;
            if (pastOpener && !helpBtnVisible) {
                helpBtnVisible = true;
                gebi("help_btn").style.opacity = "1";
                gebi("help_btn").style.pointerEvents = "auto";
                if (showHelpPtr) {
                    gebi("help_ptr").style.display = "flex";
                }
            } else if (!pastOpener && helpBtnVisible) {
                helpBtnVisible = false;
                gebi("help_btn").style.opacity = "0";
                gebi("help_btn").style.pointerEvents = "none";
                gebi("help_ptr").style.display = "none";
            }
        };
        window.addEventListener('scroll', helpScrollHandler);

        gebi("help_btn").addEventListener('click', function(e) {
            e.stopPropagation();
            gebi("help_ptr").style.display = "none";
            helpModalActive = true;
            gebi("bg_dim").style.animation = `fadeInFromNone ${detailsMenuWipe}ms ease-out`;
            gebi("bg_dim").style.display = "";
            gebi("bg_dim").style.opacity = "1";
            gebi("help_modal").style.display = "flex";
        });

        return () => {
            window.removeEventListener('resize', updateCardColumns);
            window.removeEventListener('resize', updateExpColumns);
            window.removeEventListener('scroll', helpScrollHandler);
        };
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
                transition: `transform ${detailsMenuWipe}ms ease-out, opacity ${detailsMenuWipe}ms ease-out, height ${detailsMenuWipe}ms ease-in-out`
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
                            <p id={"details_menu_title"} className={"text-white text-xl"}
                               style={{fontWeight: "bold"}}></p>
                            <p id={"details_menu_desc"} className={"text-white text-sm"}></p>
                        </div>
                    </div>
                </div>
            </div>
            <div id={"exp_details_background"} className={"absolute top-0 w-0 h-0 p-6 rounded-xl opacity-0"} style={{
                visibility: "hidden",
                backgroundColor: "var(--theme-black)",
                zIndex: "11",
                overflow:"hidden",
                transition: `transform ${detailsMenuWipe}ms ease-out, opacity ${detailsMenuWipe}ms ease-out`
            }}>
                <div id={"exp_details_menu_container"} className={"w-full h-full flex justify-center items-end"}>
                    <div id={"exp_details_menu"} className={"relative flex flex-col top-0 w-0 h-full p-2 rounded-2xl bg-(--theme-dark-gray)"} style={{
                        overflow: "hidden"
                    }}>
                        <div id={"exp_details_menu_link"} className={"w-full h-fit flex justify-center items-center"}></div>
                        <div id={"exp_details_menu_top"}
                             className={"w-full h-fit mb-auto py-3 flex flex-wrap justify-center items-center"}></div>
                        <div id={"exp_details_menu_bottom"} className={"w-full h-[60%] overflow-x-hidden overflow-y-auto"} style={{scrollbarWidth:"thin"}}>
                            <p id={"exp_details_menu_title"} className={"text-white text-xl"}
                               style={{fontWeight: "bold"}}></p>
                            <p id={"exp_details_menu_desc"} className={"text-white text-sm"}></p>
                        </div>
                    </div>
                </div>
            </div>
            <div id={"exp_see_more_wrapper"} className={"see-more-wrapper"} style={{top:0, left:0, transform:"none", visibility:"hidden"}}>
                <svg id={"exp_see_more_arrow_right"} className={"see-more-arrow-right-svg"} width="160" height="80" overflow="visible" style={{position:"absolute",top:0,left:0,display:"block"}}>
                    <path className={"see-more-arrow-path"} d="M 5 40 C 25 20, 65 10, 73 65" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" pathLength="100"/>
                    <path className={"see-more-arrow-head"} d="M 73 70 L 79 56" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                    <path className={"see-more-arrow-head"} d="M 73 70 L 64 59" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                </svg>
                <svg id={"exp_see_more_arrow_left"} className={"see-more-arrow-left-svg"} width="160" height="80" overflow="visible" style={{position:"absolute",top:0,left:0,display:"none"}}>
                    <path className={"see-more-arrow-path"} d="M 155 40 C 135 20, 95 10, 87 65" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" pathLength="100"/>
                    <path className={"see-more-arrow-head"} d="M 87 70 L 81 56" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                    <path className={"see-more-arrow-head"} d="M 87 70 L 96 59" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="100"/>
                </svg>
                <div id={"exp_see_more_bubble"} className={"see-more-bubble"}>
                    <span>See more!</span>
                    <img src={"/icons/redirect.png"} alt={"redirect"} style={{width:"8px",height:"8px"}}/>
                </div>
            </div>
            <div id={"openerContainer"} className={"animate"}>
                <div id={"openerMain"}>
                    <div id={"messageSmall"}
                         className={"object absolute flex justify-center items-center left-[15%] w-fit px-7 py-7 top-0 opacity-0"}
                         style={{
                             top: 0, // 0 >> 15%
                             transition: `opacity ${smallTransition}ms ease-in-out, top ${smallTransition}ms ease-in-out`
                         }}>
                        <p className={"text-base"} style={{textAlign: "center"}}>Welcome to my portfolio!</p>
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

            <div id={"summaryContainer"} className={"relative flex flex-row rounded-xl py-32 my-52"} style={{
                width: summaryContainerWidth + "vw",
                backgroundColor: "var(--theme-green)",
                left: (100 - summaryContainerWidth) / 2 + "vw",
                boxShadow: "8px 8px 0px 0px var(--theme-yellow)",
                border: "2px solid var(--theme-dark-gray)"
            }}>
                <div id={"summaryContainerLeft"} className={"w-[35%] ml-8 block"}>
                    <img id={"summaryImg"} src={"/resources/IMG_1399.jpg"}
                         className={"relative object-cover object-center w-[300px] h-[400px]"} style={{float: "right"}}
                         alt={"portrait photo"}/>
                </div>
                <div id={"summaryContainerRight"} className={"w-[65%] ml-5 mt-0"}>
                    <div id={"summaryInfo"} className={"relative h-full flex flex-col justify-center px-0"}>
                        <p id={"summary-title"} className={"text-4xl mb-2"}>Hi there!</p>
                        <p id={"summary-desc"} className={"w-[80%] text-lg"}>
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

            <div className="bg-[#a9c4eb] pt-1 pb-40">
                <div id={"projectsTitle"}
                     className={"text-6xl text-white w-full mt-64 mb-8 flex justify-center items-center font-bold"}>
                    <p className={"rounded-xl w-fit py-7 px-12"} style={{
                        backgroundColor: "var(--theme-gray)",
                        boxShadow: "8px 8px 0px 0px var(--theme-black)",
                        border: "2px solid var(--theme-dark-gray)"
                    }}>Projects</p>
                </div>
                <div id={"projectsContainer"} className={"grid grid-cols-2 lg:grid-cols-3 w-[80%] mx-auto mb-32"}>
                    <Projects/>
                </div>
            </div>

            <div className="bg-[#cb84d9] pt-1 pb-40">
                <div id={"experienceTitle"}
                     className={"text-6xl text-white w-full mt-56 mb-8 flex justify-center items-center font-bold"}>
                    <p className={"rounded-xl w-fit py-7 px-12"} style={{
                        backgroundColor: "var(--theme-gray)",
                        boxShadow: "8px 8px 0px 0px var(--theme-black)",
                        border: "2px solid var(--theme-dark-gray)"
                    }}>Experience</p>
                </div>
                <div id={"experienceContainer"} className={"grid grid-cols-3 lg:grid-cols-4 w-[50%] mx-auto mb-32"}>
                    <ExperienceGrid/>
                </div>
            </div>

            <div id={"contactContainer"}
                 className={"relative flex flex-col justify-start items-center w-full pt-20 pb-60"}
                 style={{backgroundColor: "var(--theme-white)"}}>
                <div id={"contact-title"} className={"text-5xl mb-12 p-7 rounded-xl"} style={{
                    boxShadow: "8px 8px 0px 0px var(--theme-blue)",
                    border: "2px solid var(--theme-dark-gray)"
                }}>Contact Info
                </div>
                <div id={"contact-items"}>
                    <ContactLinks/>
                </div>
            </div>

            {/* Help button — fixed circle 'i', fades in after scrolling past opener */}
            <div id="help_btn" style={{
                position:"fixed", bottom:"24px", right:"24px",
                width:"44px", height:"44px", borderRadius:"50%",
                backgroundColor:"var(--theme-dark-gray)",
                border:"2px solid var(--theme-blue)",
                display:"flex", alignItems:"center", justifyContent:"center",
                zIndex:20, cursor:"pointer",
                opacity:0, pointerEvents:"none",
                transition:"opacity 300ms ease-in-out",
                color:"var(--theme-blue)", fontSize:"22px", fontWeight:"bold", fontStyle:"italic",
                userSelect:"none", boxShadow:"3px 3px 0px 0px var(--theme-black)"
            }}>i&nbsp;</div>

            {/* Help pointer — bobbing ptr_mm.png with bubble, shown only on first 3 visits */}
            <div id="help_ptr" style={{
                position:"fixed", bottom:"80px", right:"12px",
                zIndex:21, display:"none",
                flexDirection:"column", alignItems:"end",
                pointerEvents:"none", gap:"6px"
            }}>
                <div style={{
                    backgroundColor:"var(--theme-white)", color:"var(--theme-black)",
                    borderRadius:"10px", padding:"6px 10px",
                    fontSize:"11px", fontWeight:"bold", whiteSpace:"nowrap",
                    boxShadow:"3px 3px 0px 0px var(--theme-dark-gray)",
                    border:"1.5px solid var(--theme-dark-gray)", position:"relative"
                }}>
                    need some help?
                    {/* bubble tail border */}
                    <div style={{
                        position:"absolute", bottom:"-7px", left:"50%",
                        transform:"translateX(200%)",
                        width:0, height:0,
                        borderLeft:"6px solid transparent", borderRight:"6px solid transparent",
                        borderTop:"7px solid var(--theme-dark-gray)"
                    }}/>
                    {/* bubble tail fill */}
                    <div style={{
                        position:"absolute", bottom:"-5px", left:"50%",
                        transform:"translateX(245%)",
                        width:0, height:0,
                        borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
                        borderTop:"6px solid var(--theme-white)"
                    }}/>
                </div>
                <img id="help_ptr_img" src="/icons/ptr_mm.png" alt="pointer" style={{
                    width:"40px", height:"40px", objectFit:"contain", marginRight:"10px",marginTop:"15px"
                }}/>
            </div>

            {/* Help modal — centered card above bg_dim, pointer-events none on wrapper */}
            <div id="help_modal" style={{
                position:"fixed", top:0, left:0,
                width:"100vw", height:"100vh",
                zIndex:15, display:"none",
                alignItems:"center", justifyContent:"center",
                pointerEvents:"none"
            }}>
                <div id="help_modal_inner" onClick={(e) => e.stopPropagation()} style={{
                    backgroundColor:"var(--theme-dark-gray)",
                    border:"2px solid var(--theme-gray)",
                    borderRadius:"16px", padding:"24px",
                    maxWidth:"340px", width:"90vw",
                    boxShadow:"8px 8px 0px 0px var(--theme-black)",
                    pointerEvents:"auto"
                }}>
                    <p style={{color:"var(--theme-white)", fontSize:"20px", fontWeight:"bold", textAlign:"center", marginBottom:"20px"}}>
                        Navigation Help
                    </p>

                    <div className="help-step">
                        <div className="help-step-icon" style={{backgroundColor:"var(--theme-blue)"}}>
                        </div>
                        <div>
                            <p className="help-step-title">Projects</p>
                            <p className="help-step-desc">
                                <span className="inline">Hold</span>
                                {" "}on a project card (~0.5s) to expand details, tech stack &amp; links
                            </p>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-icon" style={{backgroundColor:"var(--theme-purple)"}}>
                        </div>
                        <div>
                            <p className="help-step-title">Experience</p>
                            <p className="help-step-desc">Click experience titles to open their links</p>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-icon" style={{backgroundColor:"var(--theme-gray)"}}>
                        </div>
                        <div>
                            <p className="help-step-title">Close</p>
                            <p className="help-step-desc">Click the dark overlay to close any open panel — try it now!</p>
                        </div>
                    </div>

                    <p style={{color:"#666", fontSize:"11px", textAlign:"center", marginTop:"16px"}}>
                        click outside to close
                    </p>
                </div>
            </div>

            <Footer customItems={null}/>
        </>
    );
}
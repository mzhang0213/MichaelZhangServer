import {ProjectType} from "@/app/page";

export const projects: ProjectType[] = [
    {
        id: "spotify-cracked",
        title: "Spotify Cracked",
        description: "Created in an effort to bring more accessibility to music streaming and improving students' focus.",
        technology: [
            {
                id:"nodejs",
                description:"Used as server infrastructure for my website. Implemented OAuth v2.0 login flow for Spotify API."
            },
            {
                id:"expressjs",
                description:"Server-side framework for app. Hooked up RESTful API calls allowing communication between server and client. Managed database calls and updates."
            },
            {
                id:"spotify-api",
                description:"Used to get user info for the app - primarily user playlists and songs from those playlists. Data fed into algorithm for YouTube searches."
            },
            {
                id:"youtube-api",
                description:"Used to provide ad-less videos in order to play ad-free music. Takes search queries mixed with song data from Spotify API to find best music video results. Implemented YouTube player embed in app."
            },

        ],
        link: {
            title:"spot website",
            link:"https://google.com"
        }
    },
    {
        id: "hackathon-portal",
        title: "Hackathon Portal",
        description: "Developed for usage in my two hackathons I founded and hosted. Functions as the main portal for the hackathons where competitors are able to form groups and submit their projects. Additionally had voting functionality for the competitions. Assisted in communication with staff and participants.",
        technology: [
            {
                id:"tailwind-css",
                description:""
            }
        ],
        link: {
            title:"",
            link:""
        }
    },
    {
        id: "email-bot",
        title: "Email Bot",
        description: "Assisted in mass-emailing for sponsorship and outreach in hackathons. Uses email templates populated with supplied data of email recipient to create MIME format emails.",
        technology: [
            {
                id:"tailwind-css",
                description:""
            }
        ],
        link: {
            title:"",
            link:""
        }
    },
    {
        id: "image-editor",
        title: "Dynamic Image Editor",
        description: "Class project designed to edit images based on a system of image brightness",
        technology: [
            {
                id:"tailwind-css",
                description:""
            }
        ],
        link: {
            title:"",
            link:""
        }
    }
]

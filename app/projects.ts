import {ProjectType} from "@/app/page";

export const projects: ProjectType[] = [
    {
        id: "spotify-cracked",
        title: "Spotify Cracked",
        description: "An app created in an effort to bring more accessibility to music streaming and improving focus while working. Serves YouTube videos in embeds for music streaming functionality. Time-tracking \"Spotify Wrapped\" feature implemented using JavaScript.",
        detailsDefault:"Originally implemented as an all-in-one style client-side app on my personal website. Migrated to Next.js only changing authentication flow and its interaction with the server. The app itself is implemented in JavaScript and HTML.",
        icon:"/icons/spotifyYt.png",
        technology: [
            {
                id:"nodejs",
                description:"Early versions used as server infrastructure for my website. Implemented OAuth v2.0 login flow for Spotify API."
            },
            {
                id:"expressjs",
                description:"Server-side framework for app. Hooked up RESTful API calls allowing communication between server and client. Managed database calls and updates."
            },
            {
                id:"nextjs",
                description:"Used with Vercel serverless functions framework to implement a version of the app with Next.js and its benefits - hosting alongside my personal website, usage of TypeScript, and a clearer backend."
            },
            {
                id:"typescript",
                description:"Used to implement server-side functions used in Next.js app. Converted from equivalent functions used in Node.js app."
            },
            {
                id:"mongodb",
                description:"Database instantiated to store user time listened for \"Spotify Wrapped\" feature."
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
            title:"live deployment",
            link:"https://mzhang.dev/spotifyYt"
        }
    },
    {
        id: "hackathon-portal",
        title: "Hackathon Portal",
        description: "Developed for usage in my two hackathons I founded and hosted. Functions as the main portal for the hackathons where competitors are able to form groups and submit their projects. Additionally had voting functionality for the competitions. Assisted in communication between staff and participants.",
        icon:"/icons/bobabyte.png",
        technology: [
            {
                id:"nodejs",
                description:"Used as server infrastructure for the application. Utilized CLI interface to check server health and logs remotely as the competitions occurred where the server encountered heavier traffic. Implemented WebSocket API to add announcements to the portal."
            },
            {
                id:"expressjs",
                description:"Server-side framework for app functionality. Managed RESTful calls between server and client for managing competitor's projects and voting. Connected to the database to the server storing project and voting entries."
            },
            {
                id:"mongodb",
                description:"Created to store competitor's account information, group (team) information, project information for each group, as well as voting information. Additionally stored notification information from announcement feature."
            },
            {
                id:"websocket",
                description:"Used to implement announcements as notifications pushed to clients (competitors) during the competition. Allows for asynchronous receiving of notifications in the background."
            },
            {
                id:"tailwind-css",
                description:"Helped to streamline page styling, from navbar to the title page and body."
            }
        ],
        link: {
            title:"live deployment",
            link:"https://mzhang.dev/bobabyte"
        }
    },
    {
        id: "email-bot",
        title: "Email Bot",
        description: "A Python script bot assisting in mass-emailing for sponsorship and outreach in hackathons. Uses email templates populated with supplied data of email recipient to create MIME format emails.",
        icon:"/icons/emailbot.png",
        technology: [
            {
                id:"python",
                description:"Implements SMTP library for sending SSL encrypted letters. Uses command-line prompts to control template, data, and time for emails to be sent."
            }
        ],
        link: {
            title:"GitHub Repo",
            link:"https://github.com/mzhang0213/email-send-robot"
        }
    },
    {
        id: "image-editor",
        title: "Dynamic Image Editor",
        description: "A class project designed to edit images based on a system of image brightness given by the assignment prompt.",
        icon:"/icons/imageeditor.png",
        technology: [
            {
                id:"java",
                description:"Converted images to Lists of LinkedLists containing Java's AWT Color class. Implemented DP techniques to remove so-called \"seams\" in the image, a series of pixels across the rows of the image of least energy (determined by brightness). Implemented Command design pattern in the image's editor."
            }
        ],
        link: {
            title:"GitHub Repo",
            link:"https://github.com/mzhang0213/ae3"
        }
    }
]

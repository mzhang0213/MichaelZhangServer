import {ProjectType} from "@/app/page";

export const projects: ProjectType[] = [
    {
        id: "bonsai",
        title: "BonsAi",
        description: "A mobile fitness app bringing a comfortable experience to fitness tracking and calorie logging, all in one. Designed to be user-friendly for everyone, from first time lifters needing direction to experienced lifters wanting to level up their gains. Flagship progress tracking features powered by AI implemented in a virtual assistant.",
        detailsDefault:"",
        icon:"/icons/bonsai.png",
        technology: [
            {
                id:"swift",
                description:"My first time developing with Swift and mobile apps - it was a challenge but I got the hang of it by thinking in the same way as I did with web development. Ended up really enjoying recreating the features and animations I see in apps I use everyday. Mobile iOS platform entirely developed in Swift."
            },
            {
                id:"flask",
                description:"I applied my experience with Python to use Flask. I drew many parallels to Node.js, and with both Python and JS being very simple, it wasn't very difficult to get it spun up. Implemented logic to utilize WebSockets and communicate with database. Used for all backend development."
            },
            {
                id:"aws",
                description:"I was able to explore the implementation of cloud computing and system design techniques using AWS. Used ECS for deploying my code in horizontally scalable containers behind a ALB. Also utilized RDS with PostgreSQL for storage of user accounts and user progress. Shoutout @arjay_the_dev for such great videos about system design."
            },
            {
                id:"gpt",
                description:"I used the GPT-4o-mini to help retrieve bi-weekly graded fitness scores, which is used to track a user's fitness progress towards their goals across a timeframe. Implemented with OpenAI's API and custom prompt engineering to control costs."
            },
            {
                id:"opencv",
                description:"I had a lot of fun earlier in Summer '25 messing around with OpenCV's python library. I sought after a more cost-effective way to read the information off of a calorie label using computer vision techniques rather than a plug-and-chug into a LLM. Used to flatten and section boxes on a calorie label before feeding row-by-row to an OCR text detection service (PyTesseract) for text parsing."
            },
            {
                id:"postgres",
                description: "I applied what I studied about SQL to create tables for my waitlist and my main user account information storage. Implemented relational database to track user account information, meal and workout information and history, and fitness progress (history). Used as RDS with AWS."
            },
            {
                id:"docker",
                description:"Containerized project files with Docker for deployment on AWS ECS. Wrote Dockerfiles for production and docker-compose files for testing."
            },
        ],
        link: {
            title:"concept page",
            link:"https://bulk.mzhang.dev"
        }
    },
    {
        id: "yes_coach",
        title: "Yes, Coach!",
        description: "",
        detailsDefault:"",
        icon:"/icons/yescoach.png",
        technology: [
            {
                id:"python",
                description:""
            },
            {
                id:"opencv",
                description:""
            },
            {
                id:"fastapi",
                description:""
            },
        ],
        link: {
            title:"live deployment",
            link:"https://mzhang.dev/spotifyYt"
        }
    },
    {
        id: "rebound",
        title: "Rebound",
        description:"I joined two teammates in 24 hours for Hack Health 2026 hosted by Northeastern's ACM. I met two guys from BU and together we designed an app to help support anyone facing injuries in the rehabilitation process. We had many features, and with features many bugs, frankly, but we were able to present an amazing app which helped us win <span class='bg-clip-text bg-gradient-to-tr from-yellow-300 to-white'>first place</span> for the physical health track.", //PUT GRADIENT HERE ON FIRST PLACE
        detailsDefault:"",
        icon:"/icons/serviceeye.png",
        technology: [
            {
                id:"react-native",
                description:""
            },
            {
                id:"expo",
                description:""
            },
            {
                id:"fastapi",
                description:""
            },
            {
                id:"supabase",
                description:""
            },
            {
                id:"openstreetmap",
                description:""
            },
            {
                id:"gemini",
                description:""
            },
            {
                id:"yolo",
                description:""
            },
            {
                id:"cloudflare",
                description:""
            },
            {
                id:"nginx",
                description:""
            },
        ],
        link: {
            title:"Devpost",
            link:"https://devpost.com/software/rebound-l42rzs"
        }
    },
    /*
    {
        id: "serviceEye",
        title: "Service Eye",
        description: "A cost-effective device assisting visually impaired individuals navigate with auditory signals and commands alarming the user of danger and navigation directions. Utilizes machine learning object detection models paired with voice synthesis libraries to deliver a clean, real-time, experience similar to that of having a service dog.",
        detailsDefault:"",
        icon:"/icons/serviceeye.png",
        technology: [
            {
                id:"python",
                description: "I fully exploited Python's language accessibility for file manipulation for managing the training data powering the YOLO object detection model. Utilized to compile data from COCO dataset, Berkeley DeepDrive dataset, and manually labeled images with CVAT."
            },
            {
                id:"yolo",
                description: "Object detection-based machine learning model primarily used in detecting objects and hazards on the road. Researched effective and efficient model training practice and optimized datasets to conform to proper practice. Interfaced with video stream from Raspberry PI Camera for live object detection."
            },
            // IS THIS GONNA HAPPEN? IDK MAYBE I DONT NEED TS
            {
                id:"gpt",
                description: "Inputted results from object detection to synthesize small alert phrases"
            },
            {
                id:"raspberrypi",
                description: "Hardware behind communication between camera and user. Hosted web server for server to client connection. Custom physical squeeze with Raspberry PI pinouts to enhance caution alerts. Shoutout @michaelreeves808 and William Osman for showing me the creative ways electronics can interface with computer programming to meet at robotics."
            }
        ],
        link: {
            title:"coming soon!",
            link:""
        }
    },
    */
    {
        id: "lockin-focus",
        title: "Lock-In Focus",
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
                description:"Used with Vercel serverless functions framework to implement a version of the app with Next.js and its benefits - easy deployment, usage of TypeScript, and clearer backend."
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
        id: "flock",
        title: "Flock",
        description:"I built this app in a team of five for HackBeanpot 2026 where we decided on this app that matches commuters the other commuters on the long boring daily commute to make it more fun and help people meet new friends. We had some difficulty with app design but ultimately pulled through within 24 hours to get the app finished.",
        detailsDefault:"",
        icon:"/icons/flock-cut.png",
        technology: [
            {
                id:"react-native",
                description:""
            },
            {
                id:"expo",
                description:""
            },
            {
                id:"fastapi",
                description:""
            },
            {
                id:"mongodb",
                description:""
            },
            {
                id:"redis",
                description:""
            },
            {
                id:"openstreetmap",
                description:""
            },
            {
                id:"gemini",
                description:""
            },
        ],
        link: {
            title:"live deployment",
            link:"https://mzhang.dev/spotifyYt"
        }
    },
    /*
    {
        id: "bci26",
        title: "Cortex Crew",
        description: "",
        detailsDefault:"",
        icon:"/icons/bci-icon.png",
        technology: [
        ],
        link: {
            title:"live deployment",
            link:"https://mzhang.dev/spotifyYt"
        }
    },

     */
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
                description:"Server-side framework for app functionality. Managed RESTful calls between server and client for managing competitor\'s projects and voting. Connected to the database to the server storing project and voting entries."
            },
            {
                id:"mongodb",
                description:"Created to store competitor\'s account information, group (team) information, project information for each group, as well as voting information. Additionally stored notification information from announcement feature."
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
        description: "Python script bot assisting in mass-emailing for sponsorship and outreach in my hackathons. Uses email templates populated with supplied data of email recipient to create MIME format emails.",
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
        },
        github:"https://github.com/mzhang0213/email-send-robot"
    },
    /*s
    {
        id:"cappy",
        title: "Cappy",
        description: "I built this to package remote access in an all-in-one app that can help people monitor their computers remotely from another device (for instance, when stepping to the bathroom).",
        icon:"/icons/.png",
        technology: [
            {
                id:"nodejs",
                description:""
            },
            {
                id:"expressjs",
                description:""
            },
            {
                id:"html",
                description:""
            },
            {
                id:"css",
                description:""
            },
        ],
        link: {
            title: "GitHub Repo",
            link:""
        }
    },*/

    /*
    {
        id: "image-editor",
        title: "Dynamic Image Editor",
        description: "A class project designed to edit images based on a system of image brightness given by the assignment prompt.",
        icon:"/icons/imageeditor.png",
        technology: [
            {
                id:"java",
                description:"Converted images to Lists of LinkedLists containing Java\'s AWT Color class. Implemented DP techniques to remove so-called \"seams\" in the image, a series of pixels across the rows of the image of least energy (determined by brightness). Implemented Command design pattern in the image\'s editor."
            }
        ],
        link: {
            title:"GitHub Repo",
            link:"https://github.com/mzhang0213/ae3"
        }
    },

     */
]

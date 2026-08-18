import {ProjectType} from "@/app/page";
import projectsData from "@/app/projects_data.json";

export const projects: ProjectType[] = projectsData as ProjectType[];

/*
notes:
line 76 - //PUT GRADIENT HERE ON FIRST PLACE


  {
      "id": "serviceEye",
      "title": "Service Eye",
      "description": "A cost-effective device assisting visually impaired individuals navigate with auditory signals and commands alarming the user of danger and navigation directions. Utilizes machine learning object detection models paired with voice synthesis libraries to deliver a clean, real-time, experience similar to that of having a service dog.",
      "detailsDefault":"",
      "icon":"/icons/serviceeye.png",
      "technology": [
          {
              "id":"python",
              "description": "I fully exploited Python's language accessibility for file manipulation for managing the training data powering the YOLO object detection model. Utilized to compile data from COCO dataset, Berkeley DeepDrive dataset, and manually labeled images with CVAT."
          },
          {
              "id":"yolo",
              "description": "Object detection-based machine learning model primarily used in detecting objects and hazards on the road. Researched effective and efficient model training practice and optimized datasets to conform to proper practice. Interfaced with video stream from Raspberry PI Camera for live object detection."
          },
          // IS THIS GONNA HAPPEN? IDK MAYBE I DONT NEED TS
          {
              "id":"gpt",
              "description": "Inputted results from object detection to synthesize small alert phrases"
          },
          {
              "id":"raspberrypi",
              "description": "Hardware behind communication between camera and user. Hosted web server for server to client connection. Custom physical squeeze with Raspberry PI pinouts to enhance caution alerts. Shoutout @michaelreeves808 and William Osman for showing me the creative ways electronics can interface with computer programming to meet at robotics."
          }
      ],
      "link": {
          "title":"coming soon!",
          "link":""
      }
  }


  {
      "id": "bci26",
      "title": "Cortex Crew",
      "description": "",
      "detailsDefault":"",
      "icon":"/icons/bci-icon.png",
      "technology": [
      ],
      "link": {
          "title":"live deployment",
          "link":"https://mzhang.dev/spotifyYt"
      }
  }




  {
      "id":"cappy",
      "title": "Cappy",
      "description": "I built this to package remote access in an all-in-one app that can help people monitor their computers remotely from another device (for instance, when stepping to the bathroom).",
      "icon":"/icons/.png",
      "technology": [
          {
              "id":"nodejs",
              "description":""
          },
          {
              "id":"expressjs",
              "description":""
          },
          {
              "id":"html",
              "description":""
          },
          {
              "id":"css",
              "description":""
          },
      ],
      "link": {
          "title": "GitHub Repo",
          "link":""
      }
  },

  {
      "id": "image-editor",
      "title": "Dynamic Image Editor",
      "description": "A class project designed to edit images based on a system of image brightness given by the assignment prompt.",
      "icon":"/icons/imageeditor.png",
      "technology": [
          {
              "id":"java",
              "description":"Converted images to Lists of LinkedLists containing Java\'s AWT Color class. Implemented DP techniques to remove so-called \"seams\" in the image, a series of pixels across the rows of the image of least energy (determined by brightness). Implemented Command design pattern in the image\'s editor."
          }
      ],
      "link": {
          "title":"GitHub Repo",
          "link":"https://github.com/mzhang0213/ae3"
      }
  }




 */
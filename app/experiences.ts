import {ExperienceType} from "@/app/page";
import fs from "node:fs";

const data = fs.readFileSync("@/app/projects_data.json", 'utf8');
export const experiences: ExperienceType[] = JSON.parse(data)
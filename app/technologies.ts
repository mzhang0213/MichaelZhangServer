import {TechnologyType} from "@/app/page";
import fs from "node:fs";

const data = fs.readFileSync("@/app/technologies_data.json", 'utf8');
export const technologies: TechnologyType[] = JSON.parse(data)
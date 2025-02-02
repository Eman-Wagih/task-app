import { task } from "./task";

export interface user {
    id: number, 
    name: string, 
    email: string,
    job_title: string,
    tasks: task[]
}
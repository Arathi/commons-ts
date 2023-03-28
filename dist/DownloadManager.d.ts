import { Aria2Client } from "./Aria2Client";
export declare class Task {
    id: number | string;
    uri: string;
    fileName: string | null;
    msgId: number | string | null;
    gid: string | null;
    status: string | null;
    totalLength: number | null;
    completedLength: number;
    constructor(id: number | string, uri: string, fileName?: string | null);
}
export declare class TaskGroup {
    id: number | string;
    name: string;
    dir: string | null;
    proxy: string | null;
    constructor(id: number | string, name: string, dir?: string | null, proxy?: string | null);
}
export declare class DownloadManager {
    aria2: Aria2Client;
    constructor(url: string, token?: string);
    download(group: TaskGroup, task: Task): void;
}

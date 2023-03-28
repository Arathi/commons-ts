import { Aria2Client } from "./Aria2Client";
import Logger from "./Logger";

export class Task {
    id: number | string;
    uri: string;
    fileName: string | null;
    
    msgId: number | string | null = null;
    gid: string | null = null;
    status: string | null = null;
    totalLength: number | null = null;
    completedLength: number = 0;

    constructor(
        id: number | string,
        uri: string,
        fileName: string | null = null
    ) {
        this.id = id;
        this.uri = uri;
        this.fileName = fileName;
    }
}

export class TaskGroup {
    id: number | string;
    name: string;
    dir: string | null;
    proxy: string | null;

    constructor(
        id: number | string,
        name: string,
        dir: string | null = null,
        proxy: string | null = null
    ) {
        this.id = id;
        this.name = name;
        this.dir = dir;
        this.proxy = proxy;
    }
}

let logger = Logger.getLogger("download-mgr");

export class DownloadManager {
    aria2: Aria2Client;

    constructor(url: string, token?: string) {
        this.aria2 = new Aria2Client({
            url: url,
            msgTypeId: "string",
            token: token,
            timeout: 10000,
            interval: 1
        });
    }

    download(group: TaskGroup, task: Task) {
        let uris = [ task.uri ];
        let options = {};

        if (group.dir != null) {
            // @ts-ignore
            options.dir = group.dir;
        }

        if (task.fileName != null) {
            // @ts-ignore
            options.out = task.fileName;
        }

        if (group.proxy != null) {
            // @ts-ignore
            options["all-proxy"] = group.proxy;
        }
        
        this.aria2.addUri(
            uris,
            options
        ).then((gid) => {
            logger.info(`下载任务 ${task.id} 已创建，gid为 ${gid}`);
        });
    }
}
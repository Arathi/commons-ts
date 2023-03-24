import { Aria2Client } from "./Aria2Client";

export default class DownloadManager {
    aria2: Aria2Client

    constructor(url: string, token?: string) {
        this.aria2 = new Aria2Client({
            url: url,
            msgTypeId: "string",
            token: token,
            timeout: 10000,
            interval: 1
        });
    }
}
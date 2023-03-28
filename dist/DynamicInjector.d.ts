export default class DynamicInjector {
    private static instance;
    cdn: string;
    timeout: number;
    checkInterval: number;
    constructor(cdn?: string, timeout?: number, checkInterval?: number);
    static getInstance(): DynamicInjector;
    getExtName(urlStr: string): string;
    injectByUrl<T>(url: string, timeout: number, checkLoaded?: (payload?: any) => T | null): Promise<T>;
    injectFromCDN<T>(cdn: string, pkg: string, version: string, path: string, timeout: number, checkLoaded?: (payload?: any) => T | null): Promise<T>;
    inject<T>(pkg: string, version: string, path: string, checkLoaded?: (payload?: any) => T | null): Promise<T>;
}

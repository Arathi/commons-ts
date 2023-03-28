import DynamicInjector from './DynamicInjector';
interface VueAppLoaderOptions {
    mountPointId: string;
    html: string | null;
    styles: string | null;
    vueVersion: string | null;
    elementVersion: string | null;
    vueOptions: object | null;
    provides: object | null;
    plugins: object[];
}
export default class VueAppLoader {
    injector: DynamicInjector;
    options: VueAppLoaderOptions;
    constructor(options: object);
    load(opts?: object): Promise<any>;
}
export {};

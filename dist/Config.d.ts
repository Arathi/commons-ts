export default class Config {
    private static instance;
    useLocalStorage: boolean;
    constructor(useLocalStorage?: boolean);
    static getInstance(): Config;
    /**
     * 获取所有配置项名称
     * @returns 配置项名称数组
     */
    listValues(): string[];
    /**
     * 根据名称获取配置项的值
     * @param key 配置项名称
     * @param defaultValue 默认值
     * @returns 配置项的值
     */
    getValue<V>(key: string, defaultValue?: V): V;
    /**
     * 设置配置项
     * @param key 配置项名称
     * @param value 配置项值
     */
    setValue(key: string, value: any): void;
    /**
     * 当找不到配置项时初始化
     * @param key 配置项名称
     * @param initValue 初始值
     */
    initValueIfNotExists(key: string, initValue: any): void;
    /**
     * 删除配置项
     * @param key 配置项名称
     */
    deleteValue(key: string): void;
    /**
     * 获取所有配置项名称（异步）
     * @returns 配置项名称数组
     */
    listValuesAsync(): Promise<string[]>;
    /**
     * 根据名称获取配置项的值（异步）
     * @param key 配置项名称
     * @param defaultValue 默认值
     * @returns 配置项的值
     */
    getValueAsync<V>(key: string, defaultValue?: V): Promise<V>;
    /**
     * 设置配置项（异步）
     * @param key 配置项名称
     * @param value 配置项值
     */
    setValueAsync(key: string, value: any): Promise<void>;
    /**
     * 删除配置项（异步）
     * @param key 配置项名称
     */
    deleteValueAsync(key: string): Promise<void>;
}

import Logger from "./Logger";

let logger = Logger.getLogger("config");

export default class Config {
    private static instance: Config;

    // logger: Logger;
    useLocalStorage: boolean;

    constructor(useLocalStorage: boolean = false) {
        this.useLocalStorage = useLocalStorage;
    }

    public static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    // #region 同步API
    /**
     * 获取所有配置项名称
     * @returns 配置项名称数组
     */
    listValues() : string[] {
        if (this.useLocalStorage) {
            let keys: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key != null) {
                    keys.push(key);
                }
            }
            return keys;
        }

        let keys = GM_listValues();
        logger.debug("获取所有配置项名称: ", keys);
        return keys;
    }

    /**
     * 根据名称获取配置项的值
     * @param key 配置项名称
     * @param defaultValue 默认值
     * @returns 配置项的值
     */
    getValue<V>(key: string, defaultValue?: V) : V {
        if (this.useLocalStorage) {
            let json = localStorage.getItem(key);
            if (json == null) {
                return defaultValue!;
            }
            return JSON.parse(json) as V;
        }

        let v = GM_getValue<V>(key, defaultValue);
        logger.debug("获取配置项%s，结果: ", key, v);
        return v;
    }

    /**
     * 设置配置项
     * @param key 配置项名称
     * @param value 配置项值
     */
    setValue(key: string, value: any) : void {
        if (this.useLocalStorage) {
            let json = JSON.stringify(value);
            localStorage.setItem(key, json);
            return;
        }

        logger.debug("设置配置项%s设置为: ", key, value);
        GM_setValue(key, value);
    }

    /**
     * 当找不到配置项时初始化
     * @param key 配置项名称
     * @param initValue 初始值
     */
    initValueIfNotExists(key: string, initValue: any) : void {
        let v: any | null = this.getValue(key, null);
        if (v == null) {
            logger.debug("配置项%s不存在，初始化为: ", key, initValue);
            this.setValue(key, initValue);
        }
        else {
            logger.debug("配置项%s已存在，值为: ", key, v);
        }
    }

    /**
     * 删除配置项
     * @param key 配置项名称
     */
    deleteValue(key: string) : void {
        if (this.useLocalStorage) {
            localStorage.removeItem(key);
            return;
        }

        logger.debug("删除配置项%s", key);
        GM_deleteValue(key);
    }
    // #endregion

    // #region 异步API
    /**
     * 获取所有配置项名称（异步）
     * @returns 配置项名称数组
     */
    listValuesAsync() : Promise<string[]> {
        return GM.listValues();
    }

    /**
     * 根据名称获取配置项的值（异步）
     * @param key 配置项名称
     * @param defaultValue 默认值
     * @returns 配置项的值
     */
    getValueAsync<V>(key: string, defaultValue?: V) : Promise<V> {
        return GM.getValue(key, defaultValue);
    }

    /**
     * 设置配置项（异步）
     * @param key 配置项名称
     * @param value 配置项值
     */
    setValueAsync(key: string, value: any) : Promise<void> {
        return GM.setValue(key, value);
    }

    /**
     * 删除配置项（异步）
     * @param key 配置项名称
     */
    deleteValueAsync(key: string) : Promise<void> {
        return GM.deleteValue(key);
    }
    // #endregion
}
// ==UserScript==
// @name         TmUsCommons-dev
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  try to take over the world!
// @author       Arathi of Nebnizilla
// @match        https://telegra.ph/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://127.0.0.1:5173/dist/commons.umd.js?t=230324-1521
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const {
    Logger,
    Config,
    Aria2Client
} = TmUsCommons

function loggetTests() {
    let logger = new Logger()
    logger.info("%s v%s", GM_info.script.name, GM_info.script.version)
    logger.debug("debug level", {a: 'a', b: 'b'})
    logger.trace("trace")
    logger.warn("WARN Log")
    logger.error("error LoG")

    let msgLogger = new Logger("msgLog")
    msgLogger.trace("S->C CONNECT")
}

function configTests() {
    let logger = new Logger()
    let config = new Config()
    config.initValueIfNotExists("aria2", {
        "url": "ws://127.0.0.1:6800/jsonrpc",
        "token": "47bfbcf3"
    })
    let aria2config = config.getValue("aria2", {})
    logger.info("aria2地址为", aria2config.url)
}

async function aria2Tests() {
    let logger = new Logger()
    let config = new Config()
    let options = config.getValue("aria2", {})
    let aria2 = new Aria2Client(options)
    let connectTimeCost = await aria2.waitForOpen()
    logger.info("连接耗时%dms", connectTimeCost)
    let version = await aria2.getVersion()
    logger.info("获取版本信息：", version)
}

async function main() {
    aria2Tests()
}

main()

package internals

import "burned-toast/backend/utils"

var AppCurrentDirectory string = utils.GetCurrentDir()

var DataFolderPath string = AppCurrentDirectory + "/data"
var JournalFolderPath string = DataFolderPath + "/journals"
var CacheFolderPath string = DataFolderPath + "/cache"
var Webview2DataPath string = DataFolderPath + "/edgewebvieeew"

var ResourcesFolderPath string = AppCurrentDirectory + "/resource"
var AppStaticFilesPath string = AppCurrentDirectory + "/static"

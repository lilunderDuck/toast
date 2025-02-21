package internals

import "burned-toast/backend/utils"

var currentDir string = utils.GetCurrentDir()

var DataFolderPath string = currentDir + "/data"
var JournalFolderPath string = DataFolderPath + "/journals"
var CacheFolderPath string = DataFolderPath + "/cache"
var Webview2DataPath string = DataFolderPath + "/edgewebvieeew"

var ResourcesFolderPath string = currentDir + "/resource"
var AppStaticFilesPath string = currentDir + "/static"

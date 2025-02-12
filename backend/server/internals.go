package server

import "server/utils"

var currentDir string = utils.GetCurrentDir()

var DataFolderPath string = currentDir + "/data"
var JournalFolderPath string = DataFolderPath + "/journals"
var CacheFolderPath string = DataFolderPath + "/cache"

var ResourcesFolderPath string = currentDir + "/resource"
var AppStaticFilesPath string = currentDir + "/static"

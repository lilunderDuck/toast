import { 
  copyOthersFiles, 
  createOutputDirectory, 
  manglePropsManually, 
  writeAllProcessedFile 
} from "./task"
import { categorizeFileType, getAllFilesFromDir } from "./utils"

const OUTPUT_DIRECTORY = "./out/server/statis"
const DIRECTORY_TO_READ = "./out/client"
const allFiles = getAllFilesFromDir(DIRECTORY_TO_READ)
const { cssFiles, jsFiles, htmlFiles, others } = categorizeFileType(allFiles)

createOutputDirectory(OUTPUT_DIRECTORY)
copyOthersFiles(OUTPUT_DIRECTORY, others)
const optimizedFiles = manglePropsManually([...cssFiles, ...jsFiles, ...htmlFiles])
writeAllProcessedFile(OUTPUT_DIRECTORY, optimizedFiles)
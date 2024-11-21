// import { 
//   copyOthersFiles, 
//   createOutputDirectory, 
//   manglePropsManually, 
//   writeAllProcessedFile 
// } from "./task"
// import { categorizeFileType, getAllFilesFromDir } from "./utils"

import { createSecretHtmlContent } from "./tools";
import { categorizeFileType, getAllFilesFromDir, minify, tasking, writeFile } from "./utils";

// const OUTPUT_DIRECTORY = "./out/server/statis"
// const DIRECTORY_TO_READ = "./out/client"
// const allFiles = getAllFilesFromDir(DIRECTORY_TO_READ)
// const { cssFiles, jsFiles, htmlFiles, others } = categorizeFileType(allFiles)

// createOutputDirectory(OUTPUT_DIRECTORY)
// copyOthersFiles(OUTPUT_DIRECTORY, others)
// const optimizedFiles = manglePropsManually([...cssFiles, ...jsFiles, ...htmlFiles])
// writeAllProcessedFile(OUTPUT_DIRECTORY, optimizedFiles)
const APP_BUILD_OUTPUT_PATH = './out/server/resource' as const

let stuff: ReturnType<typeof categorizeFileType>
tasking.add(function doStuff() {
  const all = getAllFilesFromDir(APP_BUILD_OUTPUT_PATH)
  stuff = categorizeFileType(APP_BUILD_OUTPUT_PATH, all)
})

tasking.add(async function superSecret() {
  // the folder name, must start with a slash or leave it empty
  const outputFolderName = '' as const
  // the output html file name, must end with a ".html" extension
  const outputHtmlFileName = 'yup.html' as const

  const outputPath = `${APP_BUILD_OUTPUT_PATH}${outputFolderName}` as const
  const appMainHtml = stuff.htmlFiles[0]

  // find this peace of text here, and replace this with another one.
  // Okay, if you want to edit this <noscript> tag in the index.html,
  // make sure to update this as well
  const thingToReplace = /*html*/`<noscript>Nothing here...</noscript>`
  const injectedHtml = await minify(/*html*/`
    <noscript>
      <style>
        noscript { position: absolute }

        noscript, iframe {
          width: 100%;
          height: 100%;
          display: block;
        }

        noscript iframe {
          overflow: hidden;
        }

        #duck {
          display: none;
        }
      </style>
      <iframe src=".${outputFolderName}/${outputHtmlFileName}"></iframe>
    </noscript>
  `)

  const mainHtml = appMainHtml.content.replace(thingToReplace, injectedHtml)
  
  // override the old content with a new one
  writeFile(`${outputPath}/${outputHtmlFileName}`, await createSecretHtmlContent())
  writeFile(`${APP_BUILD_OUTPUT_PATH}/${appMainHtml.fileName}`, mainHtml)
})

tasking.run()
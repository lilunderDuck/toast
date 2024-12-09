import { createSecretHtmlContent } from "./tools"
import { categorizeFileType, getAllFilesFromDir, minify, tasking, writeFile } from "./utils"

const APP_BUILD_OUTPUT_PATH = './out/server/resource' as const

let stuff: ReturnType<typeof categorizeFileType>

tasking.add('Categorizing all of the built file', () => {
  const all = getAllFilesFromDir(APP_BUILD_OUTPUT_PATH)
  stuff = categorizeFileType(APP_BUILD_OUTPUT_PATH, all)
})

tasking.add('Injecting a html file, this only show if you disable javascipt', async() => {
  // the folder name, must start with a slash or leave it empty
  const outputFolderName = '' as const
  // the output html file name, must end with a ".html" extension
  const outputHtmlFileName = 'yup.html' as const

  const outputPath = `${APP_BUILD_OUTPUT_PATH}${outputFolderName}` as const
  const appMainHtml = stuff.find(it => it.fileName === 'index.html')
  if (!appMainHtml) return

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

tasking.add('Mangling every single properties starts with a dollar sign -> $', () => {
  const propsList = [
    'editor-tour-sidebar',
    'editor-tour-create-journal-button',
    'editor-tour-create-journal-category-button',
    'editor-tour-toggle-edit-or-readonly-button',
    'editor-tour-customize-layout-button',
    'editor-tour-home-button',
    'app-scrollbar',
    'app-scrollbar-vertical',
    'app-invs-scrollbar'
  ]
})

tasking.run()
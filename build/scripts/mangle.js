// @bun
// stuff/mangle/src/main.ts
import { writeFileSync } from "fs";

// stuff/logging.ts
var RESET = "\x1B[0m";
var FG_RED = "\x1B[31m";
var FG_YELLOW = "\x1B[33m";
function warnLog(...something) {
  console.error(`${FG_YELLOW}warn${RESET}:`, ...something);
}
function panic(...something) {
  console.error(`${FG_RED}panic${RESET}:`, ...something);
  process.exit(1);
}

// stuff/mangle/src/context.ts
var context = {
  fileContentMapping: new Map,
  mangleMapping: new Map
};

// stuff/mangle/src/utils.ts
import { readdirSync, readFileSync } from "fs";
function generateCombinations(chars, length, startIndex) {
  if (length === 0)
    return [""];
  const combinations = [];
  const smallerCombinations = generateCombinations(chars, length - 1, 0);
  for (let i = startIndex;i < chars.length; i++) {
    for (const smallerCombination of smallerCombinations) {
      combinations.push(chars[i] + smallerCombination);
    }
  }
  return combinations;
}
function* randomCharGenerator(length) {
  for (const char of generateCombinations("_qwertyuiopasdfghjklzxcvbnm", length, 0)) {
    yield char;
  }
}
function getAllFiles(targetDir) {
  for (const fileName of readdirSync(targetDir)) {
    if (!(fileName.endsWith(".css") || fileName.endsWith(".js"))) {
      console.log("Skip: \t", `${targetDir}/${fileName}`);
      continue;
    }
    try {
      const filePathToRead = `${targetDir}/${fileName}`;
      console.log("Read: \t", filePathToRead);
      context.fileContentMapping.set(fileName, readFileSync(filePathToRead, { encoding: "utf-8" }));
    } catch (error) {
      console.error(error);
    }
  }
}
function sortedMapFromLongestToShortest(map) {
  const sortedArray = Array.from(map).sort((a, b) => {
    return b[0].length - a[0].length;
  });
  return new Map(sortedArray);
}

// stuff/mangle/src/presets/propsEndWithDollarSign.ts
var PROPS_ENDS_WITH_DOLLAR_SIGN = /[a-zA-Z0-9_]+\$/gm;
function propsEndWithDollarSignPreset() {
  const randomGenerator = randomCharGenerator(2);
  return {
    discover(fileContent) {
      const result = fileContent.match(PROPS_ENDS_WITH_DOLLAR_SIGN);
      if (!result) {
        console.log("| No prop needs to be mangled, skipping");
        return;
      }
      console.log(`| Found`, result.length, "props that need to be mangled.");
      for (const prop of result) {
        if (prop.length <= 2) {
          console.log(`| Skip prop: 	${prop}, it's already short enough.`);
          continue;
        }
        if (!context.mangleMapping.has(prop)) {
          const randomValue = randomGenerator.next().value;
          context.mangleMapping.set(prop, randomValue);
          console.log(`| Map: 			${prop} -> ${randomValue}`);
          continue;
        }
        console.log(`| Already mapped: 	${prop}`);
      }
    },
    mangle(fileContent) {
      let newFileContent = fileContent;
      for (const [originalProp, mangledProp] of context.mangleMapping) {
        newFileContent = newFileContent.replaceAll(originalProp, mangledProp);
      }
      return newFileContent;
    }
  };
}
// stuff/json_config.ts
import { readFileSync as readFileSync2 } from "fs";
import path from "path";
function mustReadJsonConfig(jsonConfigName) {
  const [_processName, _scriptPath, jsonConfigLocation] = process.argv;
  const cwd = process.cwd();
  try {
    if (jsonConfigLocation) {
      if (!jsonConfigLocation.includes(jsonConfigName)) {
        panic(`Your config file must be named: ${jsonConfigName}, currently your config file name is "${path.basename(jsonConfigLocation)}" in ${jsonConfigLocation}`);
      }
    }
    return JSON.parse(readFileSync2(jsonConfigLocation ? jsonConfigLocation : `${cwd}/${jsonConfigName}`, { encoding: "utf-8" }));
  } catch (error) {
    return panic(`Failed to read ${jsonConfigName}: ${error}`);
  }
}

// stuff/mangle/src/main.ts
var builtinPreset = {
  propsEndWithDollarSign: propsEndWithDollarSignPreset
};
function mangle(config) {
  getAllFiles(config.targetDir);
  for (const preset of config.preset) {
    const presetHandler = builtinPreset[preset];
    if (!presetHandler) {
      warnLog(`Preset ${preset} not found, ignoring...`);
      continue;
    }
    for (const [fileName, content] of context.fileContentMapping) {
      console.log("Discovering\t", fileName);
      presetHandler().discover(content);
    }
  }
  context.mangleMapping = sortedMapFromLongestToShortest(context.mangleMapping);
  for (const preset of config.preset) {
    const presetHandler = builtinPreset[preset];
    if (!presetHandler) {
      warnLog(`Preset ${preset} not found, ignoring...`);
      continue;
    }
    for (const [fileName, content] of context.fileContentMapping) {
      console.log("Mangling\t", fileName);
      const newFileContent = presetHandler().mangle(content);
      writeFileSync(`${config.targetDir}/${fileName}`, newFileContent);
    }
  }
  console.log("All of the names are belong to the ducks.");
}
mangle(mustReadJsonConfig("mangle.json"));

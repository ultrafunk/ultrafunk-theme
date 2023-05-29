//
// Update config.js and config.php build environments
//
// https://ultrafunk.com
//


import { join } from "path";

import {
  readdirSync,
  lstatSync,
  readFileSync,
  writeFile,
} from "fs";


/*************************************************************************************************/


let   packageUltrafunk    = null;
const isProdBuildRegEx    = /const\s+IS_PROD_BUILD\s+=\s+(false|true)/i;
const isDebugRegEx        = /const\s+IS_DEBUG\s+=\s+(false|true)/i;
const jsChunkFilesRegEx   = /^chunk.*\.js$/i;
const jsPreloadChunkRegEx = /const\s+JS_PRELOAD_CHUNK\s+=\s+'.*?'/i;


// ************************************************************************************************
// Entry point
// ************************************************************************************************

if (process.argv.length === 3) // eslint-disable-line no-undef
{
  packageUltrafunk = readPackageJson('./package.json')?.com_ultrafunk;

  if ((packageUltrafunk !== null) && (packageUltrafunk !== undefined))
  {
    const isProdBuild   = (process.argv[2].toLowerCase() === 'prod');  // eslint-disable-line no-undef
    const isDevBuild    = (process.argv[2].toLowerCase() === 'dev');   // eslint-disable-line no-undef
    const isJSChunkFile = (process.argv[2].toLowerCase() === 'chunk'); // eslint-disable-line no-undef

    if (isProdBuild || isDevBuild)
    {
      updateJSConfig(isProdBuild);
      updatePHPConfigs(isProdBuild);
    }
    else if (isJSChunkFile)
    {
      updatePHPConfigJSChunkFile();
    }
    else
    {
      console.error('Unknown argument! Usage: npm run update-build-configs { dev | prod | chunk }');
    }
  }
}
else
{
  console.error('Wrong number of arguments! Usage: npm run update-build-configs { dev | prod | chunk }');
}


// ************************************************************************************************
// Update config.js and config.php
// ************************************************************************************************

function updateJSConfig(isProdBuild)
{
  updateConfigFile(packageUltrafunk.themeJavaScriptConfig, (fileString) =>
  {
    return fileString.replace(isProdBuildRegEx, `const IS_PROD_BUILD = ${isProdBuild}`)
                     .replace(isDebugRegEx,     `const IS_DEBUG      = ${!isProdBuild}`);
  });
}

function updatePHPConfigs(isProdBuild)
{
  updateConfigFile(packageUltrafunk.themePHPConfig, (fileString) =>
  {
    return fileString.replace(isProdBuildRegEx, `const IS_PROD_BUILD = ${isProdBuild}`)
                     .replace(isDebugRegEx,     `const IS_DEBUG      = ${!isProdBuild}`);
  });

  updateConfigFile(packageUltrafunk.pluginPHPConfig, (fileString) =>
  {
    return fileString.replace(isProdBuildRegEx, `const IS_PROD_BUILD = ${isProdBuild}`)
                     .replace(isDebugRegEx,     `const IS_DEBUG      = ${!isProdBuild}`);
  });
}

function updatePHPConfigJSChunkFile()
{
  const newestChunk = getMostRecentFile(packageUltrafunk.javaScriptChunkPath);

  if (newestChunk !== undefined)
  {
    updateConfigFile(packageUltrafunk.themePHPConfig, (fileString) =>
    {
      return fileString.replace(jsPreloadChunkRegEx, `const JS_PRELOAD_CHUNK = '/js/dist/${newestChunk['file']}'`);
    });
  }
  else
  {
    console.error(`getMostRecentFile() failed for: ${packageUltrafunk.javaScriptChunkPath}`);
  }
}


// ************************************************************************************************
// Misc. helper functions
// ************************************************************************************************

function readPackageJson(packageJsonPath)
{
  try
  {
    return JSON.parse(readFileSync(packageJsonPath));
  }
  catch (error)
  {
    console.error(`Unable to read package.json from: ${packageJsonPath}`);
  }

  return null;
}

function getMostRecentFile(dir)
{
  const files = orderReccentFiles(dir);
  return ((files.length !== 0) ? files[0] : undefined);
}

function orderReccentFiles(dir)
{
  return readdirSync(dir)
    .filter((file) => lstatSync(join(dir, file)).isFile())
    .filter((file) => file.match(jsChunkFilesRegEx))
    .map((file)    => ({ file, mtime: lstatSync(join(dir, file)).mtime }))
    .sort((a, b)   => b.mtime.getTime() - a.mtime.getTime());
}

function updateConfigFile(filePath, onFileReadCallback)
{
  try
  {
    const fileString = readFileSync(filePath, 'utf-8');

    writeFile(filePath, onFileReadCallback(fileString), (error) =>
    {
      if (error)
        return console.error(error);
    });
  }
  catch (error)
  {
    console.error(error);
  }
}

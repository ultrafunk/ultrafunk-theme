//
// Update theme and plugin config.js and config.php build environments
//
// https://ultrafunk.com
//


import { join } from 'path';

import {
  readdirSync,
  lstatSync,
  readFileSync,
  writeFile,
} from 'fs';


/*************************************************************************************************/


let packageUltrafunk = null;

const isProdBuildRegEx    = /const\s+IS_PROD_BUILD\s+=\s+(false|true)/i;
const isDebugRegEx        = /const\s+IS_DEBUG\s+=\s+(false|true)/i;
const jsChunkFilesRegEx   = /^chunk.*\.js$/i;
const jsPreloadChunkRegEx = /const\s+JS_PRELOAD_CHUNK\s+=\s+'.*?'/i;

const isProdBuild   = (process.argv[2]?.toLowerCase() === 'prod');  // eslint-disable-line no-undef
const isDevBuild    = (process.argv[2]?.toLowerCase() === 'dev');   // eslint-disable-line no-undef
const isJSChunkFile = (process.argv[2]?.toLowerCase() === 'chunk'); // eslint-disable-line no-undef


// ************************************************************************************************
// Entry point
// ************************************************************************************************

if (process.argv.length === 3) // eslint-disable-line no-undef
{
  const hasValidArgument = isProdBuild || isDevBuild || isJSChunkFile;

  if (hasValidArgument)
  {
    packageUltrafunk = getPackageUltrafunk('./package.json');

    if (packageUltrafunk !== null)
      updateConfigs();
    else
      console.error('Error parsing package.json, it must contain a "com_ultrafunk" field!');
  }
  else
  {
    console.error('Unknown argument! Usage: npm run update-build-configs { dev | prod | chunk }');
  }
}
else
{
  console.error('Wrong number of arguments! Usage: npm run update-build-configs { dev | prod | chunk }');
}


// ************************************************************************************************
// Update config.js and config.php
// ************************************************************************************************

function updateConfigs()
{
  if (packageUltrafunk.theme !== undefined)
  {
    if (isProdBuild || isDevBuild)
    {
      updateConfig(packageUltrafunk.theme.javaScriptConfig);
      updateConfig(packageUltrafunk.theme.phpConfig);
    }
    else if (isJSChunkFile)
    {
      updatePHPConfigJSChunkFile(packageUltrafunk.theme.phpConfig);
    }
  }
  else if (packageUltrafunk.plugin !== undefined)
  {
    if (isProdBuild || isDevBuild)
      updateConfig(packageUltrafunk.plugin.phpConfig);
  }
}

function updateConfig(configPath)
{
  updateConfigFile(configPath, (fileString) =>
  {
    return fileString.replace(isProdBuildRegEx, `const IS_PROD_BUILD = ${isProdBuild}`)
                     .replace(isDebugRegEx,     `const IS_DEBUG      = ${!isProdBuild}`);
  });
}

function updatePHPConfigJSChunkFile(configPath)
{
  const newestChunk = getMostRecentFile(packageUltrafunk.theme.javaScriptChunkPath);

  if (newestChunk !== undefined)
  {
    updateConfigFile(configPath, (fileString) =>
    {
      return fileString.replace(jsPreloadChunkRegEx, `const JS_PRELOAD_CHUNK = '/js/dist/${newestChunk['file']}'`);
    });
  }
  else
  {
    console.error(`getMostRecentFile() failed for: ${packageUltrafunk.theme.javaScriptChunkPath}`);
  }
}


// ************************************************************************************************
// Misc. helper functions
// ************************************************************************************************

function getPackageUltrafunk(packageJsonPath)
{
  try
  {
    const parsedConfig = JSON.parse(readFileSync(packageJsonPath))?.com_ultrafunk;
    return ((parsedConfig !== undefined) ? parsedConfig : null);
  }
  catch (error) // eslint-disable-line no-unused-vars
  {
    console.error(`Unable to read package.json from: ${packageJsonPath}`);
  }

  return null;
}

function getMostRecentFile(dir)
{
  const files = orderRecentFiles(dir);
  return ((files.length !== 0) ? files[0] : undefined);
}

function orderRecentFiles(dir)
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

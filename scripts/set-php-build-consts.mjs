//
// Update constants.php build environment variables
//
// https://ultrafunk.com
//


import { readdirSync, lstatSync, readFileSync, writeFile } from "fs";
import { join } from "path";


/*************************************************************************************************/


const jsChunksPath      = './js/dist/';
const jsChunkFilesRegEx = /^chunk.*\.js$/i;


// ************************************************************************************************
// Get newest esbuild chunk file
// ************************************************************************************************

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


// ************************************************************************************************
// Update constants.php environment variables
// ************************************************************************************************

const newestChunk = getMostRecentFile(jsChunksPath);

if ((newestChunk !== undefined) && (process.argv.length === 3)) // eslint-disable-line no-undef
{
  const isProdBuild = (process.argv[2].toLowerCase() === 'prod') ? true : false; // eslint-disable-line no-undef
  const replaceData =
`const IS_PROD_BUILD    = ${isProdBuild};
const JS_PRELOAD_CHUNK = '/js/dist/${newestChunk['file']}';
`;

  try
  {
    const fileString = readFileSync('./php/constants.php', 'utf-8');
    let replacePos   = fileString.search('const IS_PROD_BUILD');

    if (replacePos === -1)
      replacePos = fileString.length;

    const writeData = fileString.slice(0, replacePos) + replaceData;

    writeFile('./php/constants.php', writeData, (error) =>
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
else
{
  console.error('getMostRecentFile() failed for: ' + jsChunksPath);
}

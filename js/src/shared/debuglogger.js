//
// Debug logging helper classes & functions
//
// https://ultrafunk.com
//


import {
  IS_DEBUG,
  THEME_ENV,
} from '../config.js';


// ************************************************************************************************
// DebugLog parent and child classes
// ************************************************************************************************

export function newDebugLogger(moduleName)
{
  return (IS_DEBUG ? new DevBuild(moduleName) : new ProdBuild(moduleName));
}

class DebugLog
{
  moduleName = 'unknown';

  constructor(moduleName)
  {
    this.moduleName = (moduleName.length > 20)
      ? moduleName.slice(0, 20).toUpperCase()
      : moduleName.padEnd(20, '.').toUpperCase();
  }

  warn(data)  { console.warn(`${this.moduleName}:`,  data); }
  error(data) { console.error(`${this.moduleName}:`, data); }
}

class DevBuild extends DebugLog
{
  log(data)
  {
    console.log(`${this.moduleName}:`, data);
  }

  getKeyForValue(object, value)
  {
    return Object.keys(object).find(key => (object[key] === value));
  }
}

class ProdBuild extends DebugLog
{
  log() {}
  getKeyForValue() {}
}


// ************************************************************************************************
// Measure JavaScript startup execution time
// ************************************************************************************************

let executionStart = 0;
let executionStop  = 0;

export function measureStartupExecutionTime()
{
  executionStart = performance.now();
}

export const logCss = `
  background-color: rgb(30, 60, 120);
  padding: 2px 5px`;

export function logStartupExecutionTime()
{
  executionStop = performance.now();
  console.log(`%cJavaScript startup execution time: ${(Math.round((executionStop - executionStart) * 100) / 100)} ms. for ${THEME_ENV.siteUrl}`, logCss);
}

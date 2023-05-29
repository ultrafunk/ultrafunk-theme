//
// Debug logging helper classes
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

export function newInstance(moduleName)
{
  return (IS_DEBUG ? new DevBuild(moduleName) : new ProdBuild(moduleName));
}

class DebugLog
{
  constructor(moduleName = 'unknown')
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

  logEventLog(eventLog, eventSource, eventType)
  {
    const entries = [];

    for (let i = 0; i < eventLog.length; i++)
    {
      const data = {
        eventSource: this.getKeyForValue(eventSource, eventLog[i].eventSource),
        eventType:   this.getKeyForValue(eventType, eventLog[i].eventType),
        uId:         eventLog[i].uId,
        timeStamp:   eventLog[i].timeStamp,
      };

      entries.push(data);
    }

    this.log(entries);
  }

  getKeyForValue(object, value)
  {
    return Object.keys(object).find(key => (object[key] === value));
  }
}

class ProdBuild extends DebugLog
{
  log()            {}
  logEventLog()    {}
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

//
// Debug logging helper classes
//
// https://ultrafunk.com
//


const DEBUG = false;


/*************************************************************************************************/


let executionStart = 0;
let executionStop  = 0;


// ************************************************************************************************
// DebugLog parent and child classes
// ************************************************************************************************

class DebugLog
{
  constructor(moduleName = 'unknown')
  {
    this.moduleName = padString(moduleName.toUpperCase(), 20, '.');
  }

  isDebug()   { return DEBUG;                               }
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
// DebugLog class support functions
// ************************************************************************************************

export function newInstance(moduleName)
{
  return ((DEBUG === true)
           ? new DevBuild(moduleName)
           : new ProdBuild(moduleName));
}

function padString(string, maxLength, padChar)
{
  return ((string.length > maxLength)
           ? string.slice(0, maxLength)
           : string.padEnd(maxLength, padChar));
}

export function logErrorOnServer(errorCategory, errorData)
{
  const eventAction = errorData.mediaUrl + ' | ' + errorData.mediaTitle;

  console.warn(`logErrorOnServer(): ${errorCategory} - ${eventAction}`);

  gtag('event', eventAction, // eslint-disable-line no-undef
  {
    event_category: errorCategory,
    event_label:    'Ultrafunk Client Error',
  });
}

export function measureStartupExecutionTime()
{
  executionStart = performance.now();
}

const logCss = `
  background-color: rgb(40, 80, 160);
  padding: 2px 5px`;

export function logStartupExecutionTime()
{
  executionStop = performance.now();
  console.log(`%cultrafunk.com startup JavaScript execution time: ${(Math.round((executionStop - executionStart) * 100) / 100)} ms.`, logCss);
}

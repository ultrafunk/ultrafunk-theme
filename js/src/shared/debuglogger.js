//
// Debug logging helper classes
//
// https://ultrafunk.com
//



const DEBUG = false;



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

export function logErrorOnServer(errorType, errorData)
{
  console.warn(`logErrorOnServer(): ${errorType} => ${errorData.mediaTitle} | ${errorData.mediaUrl}`);

  /*
  gtag('event', errorType, // eslint-disable-line no-undef
  {
    link_text: errorData.mediaTitle,
    link_url:  errorData.mediaUrl,
  });
  */
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

const logCss = `
  background-color: rgb(30, 60, 120);
  padding: 2px 5px`;

const SITE_URL = DEBUG
  ? 'https://wordpress.ultrafunk.com'
  : 'https://ultrafunk.com';

export function logStartupExecutionTime()
{
  executionStop = performance.now();
  console.log(`%cJavaScript startup execution time: ${(Math.round((executionStop - executionStart) * 100) / 100)} ms. for ${SITE_URL}`, logCss);
}

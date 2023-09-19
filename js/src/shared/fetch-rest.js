//
// JavaScript async fetch() wrapper with timeout and better result data + details
//
// https://ultrafunk.com
//


import { newDebugLogger } from './debuglogger.js';


/*************************************************************************************************/


const debug = newDebugLogger('fetch-rest');

export const HTTP_RESPONSE = {
  OK: 200,
};

export const FETCH_ERROR = {
  UNKNOWN: 0,
  NETWORK: 1,
  TIMEOUT: 2,
};


// ************************************************************************************************
//
// ************************************************************************************************

export async function fetchRest({
  path     = '/wp-json/wp/v2/',
  endpoint = null,
  id       = null,
  query    = null,
  timeoutSeconds = 10,
} = {})
{
  let restRequest = path;

  if ((endpoint !== null) && (id !== null))
    restRequest += `${endpoint}/${parseInt(id)}`;
  else if (endpoint !== null)
    restRequest += endpoint;

  if (query !== null)
    restRequest += `?${query}`;

  debug.log(`"${restRequest}" - timeout: ${timeoutSeconds} sec.`);

  const controller = new AbortController();
  setTimeout(() => controller.abort(), (timeoutSeconds * 1000));

  return fetch(restRequest, { signal: controller.signal })
  .then(async (response) =>
  {
    if (!response.ok)
    {
      debug.warn(response);
      return { status: { code: response.status, details: await response.json() }, data: [] };
    }

    return { status: { code: response.status }, data: await response.json() };
  })
  .catch(exception =>
  {
    debug.error(exception);
    return { status: { code: 0, errorType: getFetchErrorType(exception), errorMessage: exception.message }, data: [] };
  });
}

function getFetchErrorType(error)
{
  if (error instanceof TypeError)
    return FETCH_ERROR.NETWORK;

  if (error instanceof DOMException)
    return FETCH_ERROR.TIMEOUT;

  return FETCH_ERROR.UNKNOWN;
}

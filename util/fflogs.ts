import querystring from 'querystring';

import * as _ from 'lodash';
import { HttpClient } from '@actions/http-client';

type Response = {
  events: unknown[];
  nextPageTimestamp: number;
}

const httpClient = new HttpClient();

export const _fetch = async (apiUrl: string, options: Record<string, string | number>,
): Promise<Response> => {
  const res = await httpClient.get(apiUrl + '?' + querystring.stringify(options));
  const body = await res.readBody();
  let data;
  try {
    data = JSON.parse(body) as Response;
  } catch (e) {
    throw new Error('Could not parse response: ' + body);
  }
  if (res.message.statusCode !== 200) {
    if ('error' in data)
      throw new Error(`FFLogs error: ${data['error']}`);
    throw new Error('Could not parse response: ' + body);
  }
  return data;
};

export const api = async (
    call: string,
    report: string,
    prefix: string,
    options: Record<string, string | number>,
) => {
  if (!['fights', 'events'].includes(call))
    return {};

  if (!['www', 'fr', 'ja', 'de', 'cn'].includes(prefix))
    throw new Error('Invalid prefix: ' + prefix);

  const apiUrl = `https://${prefix}.fflogs.com:443/v1/report/${call}/${report}`;

  const data = await _fetch(apiUrl, options);

  // If this is a fight list, we're done already
  if (call === 'fights')
    return data;

  // If this is events, there might be more. Fetch until we have all of it
  while ('nextPageTimestamp' in data) {
    //  Set the new start time
    options = _.cloneDeep(options);
    options['start'] = data['nextPageTimestamp'];

    // Get the extra data
    const moreData = await _fetch(apiUrl, options);

    data['events'].push(...moreData['events']);

    //  Continue the loop if there's more
    if ('nextPageTimestamp' in moreData) {
      data['nextPageTimestamp'] = moreData['nextPageTimestamp'];
    } else {
      _.unset(data, 'nextPageTimestamp');
      break;
    }
  }

  return data;
};

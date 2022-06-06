import fetch from 'node-fetch';

// The FFLogs API returns more data than just this,
// but it's only status information for source and target,
// and currently nothing in the timeline utilities needs this.
type ffLogsEventEntry = {
  timestamp: number;
  type: string;
  sourceID: number;
  sourceIsFriendly: boolean;
  targetID: number;
  targetIsFriendly: boolean;
  ability: {
    name: string;
    guid: number;
    type: number;
  };
  fight: number;
};

type fflogsEventResponse = {
  count: number;
  events: ffLogsEventEntry[];
  nextPageTimestamp?: number;
};

const makeRequest = async (url: string, options: URLSearchParams) => {
  const requestUrl = `${url}?${options.toString()}`;
  const response = await fetch(requestUrl);
  const responseText = JSON.parse(await response.text()) as fflogsEventResponse;
  return responseText;
};

const callFFLogs = async (
  fightsOrEvents: 'fights' | 'events',
  reportId: string,
  prefix: 'www' | 'fr' | 'ja' | 'de' | 'cn',
  options: URLSearchParams,
): Promise<fflogsEventResponse> => {
  // The Event call requires specifying a View parameter.
  // There's a long list of these, but choosing "Summary"
  // permits us to filter more granularly via the option parameters.
  const urlSegment = fightsOrEvents === 'fights' ? fightsOrEvents : `${fightsOrEvents}/summary`;
  const url = `https://${prefix}.fflogs.com:443/v1/report/${urlSegment}/${reportId}`;

  const data = await makeRequest(url, options);

  // For a simple list of encounters, one call should be enough.
  if (fightsOrEvents === 'fights')
    return data;

  // For Event retrieval, check whether the data is paginated.
  // If it is, recursively retrieve it until it is all obtained.
  if (data.nextPageTimestamp !== undefined) {
    const nextOptions = new URLSearchParams();
    Object.assign(nextOptions, options);
    nextOptions.set('start', data.nextPageTimestamp.toString());
    const nextData = await makeRequest(url, nextOptions);
    const mergedData = Object.assign(data, nextData);
    return mergedData;
  }
  return data;
};

export default callFFLogs;

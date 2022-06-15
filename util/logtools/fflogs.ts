import fetch from 'node-fetch';

// The FFLogs API returns more data than just this,
// but it's only status information for source and target,
// and currently nothing in the timeline utilities needs this.
export type ffLogsEventEntry = {
  timestamp: number;
  type: string;
  sourceID?: number;
  source?: {
    name: string;
    id: number;
    guid: number;
    type: string;
  };
  sourceInstance?: number;
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

export type fflogsFightListEntry = {
  id: number;
  boss: number;
  // eslint-disable-next-line camelcase
  start_time: number;
  // eslint-disable-next-line camelcase
  end_time: number;
  name: string;
  zoneID: number;
  zoneName: string;
  size: number;
  difficulty: number;
  kill: boolean;
  partial: number;
  inProgress: boolean;
  standardComposition: boolean;
  hasEcho: boolean;
  bossPercentage: number;
  fightPercentage: number;
  lastPhaseAsAbsoluteIndex: number;
  lastPhaseForPercentageDisplay: number;
  maps: {
    mapID: number;
    mapName: string;
  };
};

export type fflogsEventResponse = {
  count: number;
  events: ffLogsEventEntry[];
  nextPageTimestamp?: number;
};

export type fflogsFightResponse = {
  lang: 'en' | 'fr' | 'ja' | 'de' | 'cn';
  start: number;
  end: number;
  fights: fflogsFightListEntry[];
  title: string;
  zone: number;
  enemies: fflogsEnemy[];
  nextPageTimestamp?: number;
};

export type fflogsEnemy = {
  guid: number;
  icon: string;
  id: number;
  name: string;
  type: string;
};

const makeRequest = async (url: string, options: URLSearchParams) => {
  const requestUrl = `${url}?${options.toString()}`;
  const response = await fetch(requestUrl);
  const responseText = JSON.parse(await response.text()) as
    | fflogsFightResponse
    | fflogsEventResponse;
  return responseText;
};

class FFLogs {
  static callFFLogs = async (
    fightsOrEvents: 'fights' | 'events',
    reportId: string,
    prefix: 'www' | 'fr' | 'ja' | 'de' | 'cn',
    options: URLSearchParams,
  ): Promise<fflogsEventResponse | fflogsFightResponse> => {
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
      const nextData = await this.callFFLogs('fights', reportId, 'www', nextOptions);
      const mergedData = Object.assign(data, nextData);
      return mergedData;
    }
    return data;
  };

  static getFightInfo = async (
    reportId: string,
    key: string,
  ): Promise<fflogsFightResponse> => {
    const fightOptions = new URLSearchParams();
    fightOptions.set('api_key', key);
    const fightListData = await FFLogs.callFFLogs(
      'fights',
      reportId,
      'www',
      fightOptions,
    ) as fflogsFightResponse;
    return fightListData;
  };

  static extractEnemiesFromReport = (
    fightData: fflogsFightResponse,
  ): { [index: string]: string } => {
    const enemies: { [index: string]: string } = {};
    for (const enemy of fightData.enemies)
      enemies[enemy.id] = enemy.name;
    return enemies;
  };

  static getEventData = async (
    reportId: string,
    key: string,
    startTime: number,
    endTime: number,
    filter = 'source.disposition="enemy" and type="cast"',
    translate = true,
  ): Promise<ffLogsEventEntry[]> => {
    const eventOptionParams = new URLSearchParams({
      'api_key': key,
      'start': startTime.toString(),
      'end': endTime.toString(),
      'filter': filter,
      'translate': translate.toString(),
    });
    const eventData = await this.callFFLogs(
      'events',
      reportId,
      'www',
      eventOptionParams,
    ) as fflogsEventResponse;
    return eventData.events;
  };
}

export default FFLogs;

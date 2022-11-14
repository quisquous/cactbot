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

export type fflogsParsedEntry = {
  timestamp: number;
  combatant: string;
  abilityId: string;
  abilityName: string;
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

    let data = await makeRequest(url, options);

    // For a simple list of encounters, one call should be enough.
    if (fightsOrEvents === 'fights')
      return data;

    // For Event retrieval, check whether the data is paginated.
    // If it is, recursively retrieve it until it is all obtained.
    if (data.nextPageTimestamp !== undefined) {
      const nextOptions = new URLSearchParams();
      Object.assign(nextOptions, options);
      nextOptions.set('start', data.nextPageTimestamp.toString());
      data = data as fflogsEventResponse;
      const nextData = await this.callFFLogs(
        'events',
        reportId,
        'www',
        nextOptions,
      ) as fflogsEventResponse;
      data.events = data.events.concat(nextData.events);
      data.count += nextData.count;
      data.nextPageTimestamp = nextData.nextPageTimestamp;
      return data;
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

  static parseFFLogsEvent = (
    event: ffLogsEventEntry,
    enemies: { [index: string]: string },
    startTime: number,
  ): fflogsParsedEntry => {
    const timestamp = startTime + event.timestamp;

    let combatant: string | undefined;
    if (event.source !== undefined)
      combatant = enemies[event.source.id];
    else if (event.sourceID !== undefined)
      combatant = enemies[event.sourceID];
    combatant ??= 'Unknown';

    const abilityId = event.ability.guid.toString(16).toUpperCase();
    let ability = event.ability.name;
    if (event.ability.name.toLowerCase().startsWith('unknown_'))
      ability = '--sync--';

    const entry: fflogsParsedEntry = {
      timestamp: timestamp,
      combatant: combatant,
      abilityId: abilityId,
      abilityName: ability,
      type: event.type,
    };
    return entry;
  };

  static parseReport = async (
    reportId: string,
    fightIndex: number,
    apiKey: string,
  ): Promise<fflogsParsedEntry[]> => {
    const rawReportData = await FFLogs.getFightInfo(reportId, apiKey);
    const reportStartTime = rawReportData.start;
    // First we verify that the user entered a valid index
    let chosenFight;
    for (const fight of rawReportData.fights) {
      if (fight.id === fightIndex)
        chosenFight = fight;
    }
    if (chosenFight === undefined)
      throw new Error(`No encounter found in report ${reportId} at index ${fightIndex}`);

    // Knowing that the encounter exists in the report,
    // we next assemble the list of all hostile entities in the report.
    // Unfortunately, entity data is not present in the data for individual encounters,
    // so we have to do some matching magic.
    const enemies = FFLogs.extractEnemiesFromReport(rawReportData);
    const rawFightData = await FFLogs.getEventData(
      reportId,
      apiKey,
      chosenFight.start_time,
      chosenFight.end_time,
    );

    const startTime = chosenFight.start_time + reportStartTime;
    return rawFightData.map((event) => this.parseFFLogsEvent(event, enemies, startTime));
  };
}

export default FFLogs;

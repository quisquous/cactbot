import path from 'path';

import fetch from 'node-fetch';

import { CoinachWriter } from './coinach';

const _OUTPUT_FILE = 'world_id.ts';

const worldFieldMap = {
  'ID': 'id',
  'InternalName': 'internalName',
  'Name': 'name',
  'Region': 'region',
  'UserType': 'userType',
  'DataCenter': 'dataCenter',
  'IsPublic': 'isPublic',
} as const;

const dataCenterFieldMap = {
  'ID': 'id',
  'Name': 'name',
} as const;

type ResultDataCenter = {
  ID: number;
  Name: string;
};

type ResultWorld = {
  ID: number;
  InternalName: string;
  Name: string;
  Region: number;
  UserType: number;
  DataCenter: null | ResultDataCenter;
};

type XivapiResult = {
  Results: {
    [key: number]: ResultWorld;
  };
};

type DataCenter = {
  [key in keyof ResultDataCenter as (typeof dataCenterFieldMap)[key]]: ResultDataCenter[key];
};

type World = {
  [key in keyof ResultWorld as (typeof worldFieldMap)[key]]: key extends 'DataCenter'
    ? (DataCenter | undefined)
    : ResultWorld[key];
};

const fetchXivapi = async () => {
  const url = `https://xivapi.com/World?columns=${Object.keys(worldFieldMap).join(',')}`;
  const response = await fetch(url);
  const json = (await response.json()) as XivapiResult;
  return json.Results;
};

const remapResults = (
  content: XivapiResult['Results'],
): Record<number, World> => {
  const result: Record<number, World> = {};
  for (const [, data] of Object.entries(content)) {
    const dc = data.DataCenter === null ? undefined : {
      id: data.DataCenter.ID,
      name: data.DataCenter.Name,
    };
    result[data.ID] = {
      id: data.ID,
      internalName: data.InternalName,
      name: data.Name,
      region: data.Region,
      userType: data.UserType,
      dataCenter: dc,
    };
  }
  return result;
};

export default async (): Promise<void> => {
  const table = remapResults(await fetchXivapi());

  const writer = new CoinachWriter(null, true);
  const header = `export type DataCenter = {
    id: number;
    name: string;
  };

export type World = {
  id: number;
  internalName: string;
  name: string;
  region: number;
  userType: number;
  dataCenter?: DataCenter;
  isPublic?: boolean;
};

export type Worlds = {
  [id: string]: World
};

export const worldNameToWorld = (name: string): World | undefined => {
  return Object.values(data).find((world: World) => {
    if (world.name === name) {
      return true;
    }
  });
};
`;
  await writer.writeTypeScript(
    path.join('resources', _OUTPUT_FILE),
    'world_id.ts',
    header,
    'Worlds',
    true,
    table,
  );
};

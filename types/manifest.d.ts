declare module '*/raidboss_manifest.txt' {
  export interface RaidbossFileData {
    [filename: string]: import('./trigger').LooseTriggerSet | string;
  }
  const raidbossFileData: RaidbossFileData;
  export default raidbossFileData;
}

declare module '*/oopsy_manifest.txt' {
  export interface OopsyFileData {
    [filename: string]: import('./oopsy').LooseOopsyTriggerSet;
  }
  const oopsyFileData: OopsyFileData;
  export default oopsyFileData;
}

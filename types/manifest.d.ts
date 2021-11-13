declare module '*/raidboss_manifest.txt' {
  const raidbossFileData: import('./trigger').RaidbossFileData;
  export default raidbossFileData;
}

declare module '*/oopsy_manifest.txt' {
  export interface OopsyFileData {
    [filename: string]: import('./oopsy').LooseOopsyTriggerSet;
  }
  const oopsyFileData: OopsyFileData;
  export default oopsyFileData;
}

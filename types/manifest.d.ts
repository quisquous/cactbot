declare module '*/raidboss_manifest.txt' {
  export interface RaidbossFileData {
    [filename: string]: LooseTriggerSet;
  }
  const raidbossFileData: RaidbossFileData;
  export default raidbossFileData;
}

declare module '*/oopsy_manifest.txt' {
  export interface OopsyFileData {
    [filename: string]: LooseOopsyTriggerSet;
  }
  const oopsyFileData: OopsyFileData;
  export default oopsyFileData;
}

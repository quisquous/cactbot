declare module '*/raidboss_manifest.txt' {
  export interface RaidbossFileData {
    [filename: string]: string;
  }
  const raidbossFileData: RaidbossFileData;
  export default raidbossFileData;
}

declare module '*/oopsy_manifest.txt' {
  export interface OopsyFileData {
    [filename: string]: unknown; // TODO
  }
  const oopsyFileData: OopsyFileData;
  export default oopsyFileData;
}

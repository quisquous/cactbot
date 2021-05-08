
// TODO: why do I have to use * here?
// TODO: why can't I call this '*/ui/raidboss/data/manifest.txt'?
declare module '*/data/manifest.txt' {
  export interface RaidbossFileData {
    [filename: string]: unknown;
  }
  const raidbossFileData: RaidbossFileData;
  export default raidbossFileData;
}

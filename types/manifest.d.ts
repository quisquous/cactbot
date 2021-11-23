declare module '*/raidboss_manifest.txt' {
  const raidbossFileData: import('./trigger').RaidbossFileData;
  export default raidbossFileData;
}

declare module '*/oopsy_manifest.txt' {
  const oopsyFileData: import('./oopsy').OopsyFileData;
  export default oopsyFileData;
}

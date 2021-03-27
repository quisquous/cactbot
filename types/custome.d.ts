declare module 'ui/raidboss/data/*/*/*.js' {
  import { TriggerFile } from './cactbot';
  export default TriggerFile;
}

declare module '*/manifest.txt' {
  import { ManiFest } from './mainfest';
  export default v as ManiFest;
}

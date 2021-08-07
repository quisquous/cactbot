import path from 'path';

import markdownMagic from 'markdown-magic';

import { isLang, languages, NonEnLang } from '../resources/languages';
import logDefinitions, { LogDefinitionTypes } from '../resources/netlog_defs';
import NetRegexes from '../resources/netregexes';
import Regexes from '../resources/regexes';
import LogRepository from '../ui/raidboss/emulator/data/network_log_converter/LogRepository';
import ParseLine from '../ui/raidboss/emulator/data/network_log_converter/ParseLine';

type LangObject<T> = { en: T } & { [lang in NonEnLang]?: T };

const curPath = path.resolve();

// Exclude these types since they're not relevant
type ExcludedLineDocs = 'None';
type LineDocTypes = Exclude<LogDefinitionTypes, ExcludedLineDocs>;

type LineDocType = {
  // We can generate `network` type automatically for everything but regex
  regexes: {
    network: string;
    logLine: string;
  };
  examples: LangObject<readonly string[]>;
};

type LineDocs = {
  [type in LineDocTypes]: LineDocType;
};

// @TODO: Remove Partial once everything is mapped
const lineDocs: Partial<LineDocs> = {
  GameLog: {
    regexes: {
      network: NetRegexes.gameLog({ capture: true }).source,
      logLine: Regexes.gameLog({ capture: true }).source,
    },
    examples: {
      en: [
        '00|2021-04-26T14:12:30.0000000-04:00|0839||You change to warrior.|d8c450105ea12854e26eb687579564df',
        '00|2021-04-26T16:57:41.0000000-04:00|0840||You can now summon the antelope stag mount.|caa3526e9f127887766e9211e87e0e8f',
        '00|2021-04-26T14:17:11.0000000-04:00|0b3a||You defeat the embodiment.|ef3b7b7f1e980f2c08e903edd51c70c7',
        '00|2021-04-26T14:12:30.0000000-04:00|302b||The gravity node uses Forked Lightning.|45d50c5f5322adf787db2bd00d85493d',
        '00|2021-04-26T14:12:30.0000000-04:00|322a||The attack misses.|f9f57724eb396a6a94232e9159175e8c',
      ],
    },
  },
} as const;

type LogGuideOptions = {
  lang?: string;
  type?: string;
};

const isLineType = (type?: string): type is LineDocTypes => {
  return type !== undefined && type in lineDocs;
};

const mappedLogLines: LangObject<LineDocTypes[]> = {
  en: [],
};

const config: markdownMagic.Configuration = {
  outputDir: path.posix.relative(curPath, path.posix.join(curPath, 'docs')),
  transforms: {
    logLines(_content, options: LogGuideOptions): string {
      const language = options.lang;
      const lineType = options.type;
      if (!isLang(language) || !isLineType(lineType))
        return '';

      const lineDoc = lineDocs[lineType];

      if (!lineDoc)
        return '';

      mappedLogLines[language] ??= [];
      mappedLogLines[language]?.push(lineType);

      const logRepo = new LogRepository();
      let ret = '';
      const lineDef = logDefinitions[lineType];
      const structureNetworkArray = [
        lineDef.type,
        '2021-04-26T14:11:35.0000000-04:00',
      ];
      let lastIndex = 0;

      for (const [name, index] of Object.entries(lineDef.fields)) {
        if (['type', 'timestamp'].includes(name))
          continue;
        structureNetworkArray[index] = `[${name}]`;
        lastIndex = Math.max(lastIndex, index);
      }

      for (let index = 2; index <= lastIndex; ++index)
        structureNetworkArray[index] ??= '';

      const structureNetwork = structureNetworkArray.join('|');
      const structureLogLine = ParseLine.parse(logRepo, structureNetwork);
      const structureLog = structureLogLine?.properCaseConvertedLine ??
        structureLogLine?.convertedLine ?? '';

      const examplesNetwork = lineDoc.examples[language]?.join('\n') ?? '';
      const examplesLogLine = lineDoc.examples[language]?.map((e) => {
        const line = ParseLine.parse(logRepo, e);
        return line?.properCaseConvertedLine ?? line?.convertedLine;
      }).join('\n') ?? '';

      ret += `
#### Structure

\`\`\`log
Network Log Line Structure:
${structureNetwork}

ACT Log Line Structure:
${structureLog}
\`\`\`

#### Regexes

\`\`\`log
Network Regex:
${lineDoc.regexes.network}

ACT Log Line Regex:
${lineDoc.regexes.logLine}
\`\`\`

#### Examples

\`\`\`log
Network Examples:
${examplesNetwork}

ACT Log Line Examples:
${examplesLogLine}
\`\`\`
`;
      return ret;
    },
  },
};

markdownMagic(
  path.posix.relative(curPath, path.posix.join(curPath, 'docs', 'templates')),
  config,
  (_error, output) => {
    let exitCode = 0;
    for (const lang of languages) {
      // Only check this lang if it was converted/base file existed
      if (!output.some((o) => o.originalPath.includes('-' + lang + '.md')))
        continue;
      const convertedLines = mappedLogLines[lang];
      for (const type in logDefinitions) {
        if (!isLineType(type))
          continue;
        if (!convertedLines?.includes(type)) {
          console.error(`Language ${lang} is missing LogGuide doc entry for type ${type}`);
          exitCode = 1;
        }
      }
    }
    process.exit(exitCode);
  },
);

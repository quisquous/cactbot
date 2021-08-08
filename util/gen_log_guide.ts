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
        '00|2021-07-05T18:01:21.0000000-04:00|0044|Tsukuyomi|Oh...it\'s going to be a long night.|1a81d186fd4d19255f2e01a1694c7607',
      ],
    },
  },
  ChangeZone: {
    regexes: {
      network: NetRegexes.changeZone({ capture: true }).source,
      logLine: Regexes.changeZone({ capture: true }).source,
    },
    examples: {
      en: [
        '01|2021-04-26T14:13:17.9930000-04:00|326|Kugane Ohashi|b9f401c0aa0b8bc454b239b201abc1b8',
        '01|2021-04-26T14:22:04.5490000-04:00|31f|Alphascape (V2.0)|8299b97fa36500118fc3a174ed208fe4',
      ],
    },
  },
  ChangedPlayer: {
    regexes: {
      // @TODO: Add this to NetRegexes/Regexes if we're going to mention them in the log guide?
      network: '',
      logLine: '',
    },
    examples: {
      en: [
        '02|2021-04-26T14:11:31.0200000-04:00|10ff0001|Tini Poutini|5b0a5800460045f29db38676e0c3f79a',
        '02|2021-04-26T14:13:17.9930000-04:00|10ff0002|Potato Chippy|34b657d75218545f5a49970cce218ce6',
      ],
    },
  },
  AddedCombatant: {
    regexes: {
      network: NetRegexes.addedCombatantFull({ capture: true }).source,
      logLine: Regexes.addedCombatantFull({ capture: true }).source,
    },
    examples: {
      en: [
        '03|2021-06-16T20:46:38.5450000-07:00|10ff0001|Tini Poutini|24|46|0|28|Jenova|0|0|30460|30460|10000|10000|0|0|-0.76|15.896|0|-3.141593||c0e6f1c201e7285884fb6bf107c533ee',
        '03|2021-06-16T21:35:11.3060000-07:00|4000b364|Catastrophe|0|46|0|0||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05||9c22c852e1995ed63ff4b71c09b7d1a7',
        '03|2021-06-16T21:35:11.3060000-07:00|4000b363|Catastrophe|0|46|0|0||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05||9438b02195d9b785e07383bc84b2bf37',
        '03|2021-06-16T21:35:11.3060000-07:00|4000b362|Catastrophe|0|46|0|0||5631|7305|13165210|13165210|10000|10000|0|0|0|-15|0|-4.792213E-05||1c4bc8f27640fab6897dc90c02bba79d',
        '03|2021-06-16T21:35:11.4020000-07:00|4000b365|Catastrophe|0|46|0|0||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05||8b3f6cf1939428dd9ab0a319aba44910',
        '03|2021-06-16T21:35:11.4020000-07:00|4000b36a|Catastrophe|0|46|0|0||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05||b3b3b4f926bcadd8b6ef008232d58922',
      ],
    },
  },
  RemovedCombatant: {
    regexes: {
      network: NetRegexes.removingCombatant({ capture: true }).source,
      logLine: Regexes.removingCombatant({ capture: true }).source,
    },
    examples: {
      en: [
        '04|2021-07-23T23:01:27.5480000-07:00|10ff0001|Tini Poutini|5|1e|0|35|Jenova|0|0|816|816|10000|10000|0|0|-66.24337|-292.0904|20.06466|1.789943||4fbfc851937873eacf94f1f69e0e2ba9',
        '04|2021-06-16T21:37:36.0740000-07:00|4000b39c|Petrosphere|0|46|0|0||6712|7308|0|57250|0|10000|0|0|-16.00671|-0.01531982|0|1.53875||980552ad636f06249f1b5c7a6e675aad',
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
Network Log Line Regex:
${lineDoc.regexes.network}

ACT Log Line Regex:
${lineDoc.regexes.logLine}
\`\`\`

#### Examples

\`\`\`log
Network Log Line Examples:
${examplesNetwork}

ACT Log Line Examples:
${examplesLogLine}
\`\`\`
`;
      return ret;
    },
  },
};

const enLogGuidePath = path.posix.relative(
  curPath,
  path.posix.join(curPath, 'docs', 'LogGuide.md'),
);

markdownMagic(
  [
    enLogGuidePath,
    path.posix.relative(curPath, path.posix.join(curPath, 'docs', '*', 'LogGuide.md')),
  ],
  config,
  (_error, output) => {
    let exitCode = 0;
    for (const lang of languages) {
      // Only check this lang if it was converted/base file existed
      if (
        !(
          output.some((o) =>
            RegExp(('[^\\w]' + lang + '[^\\w]')).exec(o.originalPath.toLowerCase())
          ) ||
          (lang === 'en' && !output.some((o) => o.originalPath.includes(enLogGuidePath)))
        )
      )
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

import path from 'path';

import markdownMagic from 'markdown-magic';

import { isLang, languages } from '../resources/languages';
import logDefinitions, { LogDefinitionTypes } from '../resources/netlog_defs';
import NetRegexes from '../resources/netregexes';
import { UnreachableCode } from '../resources/not_reached';
import Regexes from '../resources/regexes';
import { LocaleObject } from '../types/trigger';
import LogRepository from '../ui/raidboss/emulator/data/network_log_converter/LogRepository';
import ParseLine from '../ui/raidboss/emulator/data/network_log_converter/ParseLine';
import { translate } from '../ui/raidboss/emulator/translations';

const curPath = path.resolve();

// Exclude these types since they're not relevant or covered elsewhere
type ExcludedLineDocs =
  | 'None'
  | 'addBuff'
  | 'removeBuff'
  | 'flyingText'
  | 'outgoingAbility'
  | 'incomingAbility'
  | 'combatantHP'
  | 'networkAOEAbility'
  | 'networkWorld'
  | 'networkEffectResult'
  | 'parserInfo'
  | 'processInfo'
  | 'debug'
  | 'packetDump'
  | 'version'
  | 'error'
  | 'timer';

// @TODO: These types are missing or unused
type MissingLineDocs = 'Map';

type LineDocTypes = Exclude<LogDefinitionTypes, ExcludedLineDocs | MissingLineDocs>;

type LineDocType = {
  // We can generate `network` type automatically for everything but regex
  regexes?: {
    network: string;
    logLine: string;
  };
  examples: LocaleObject<readonly string[]>;
};

type LineDocs = {
  [type in LineDocTypes]: LineDocType;
};

// @TODO: Remove Partial once everything is mapped
const lineDocs: LineDocs = {
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
  partyList: {
    examples: {
      en: [
        '11|2021-06-16T20:46:38.5450000-07:00|8|10FF0002|10FF0003|10FF0004|10FF0001|10FF0005|10FF0006|10FF0007|10FF0008|',
        '11|2021-06-16T21:47:56.7170000-07:00|4|10FF0002|10FF0001|10FF0003|10FF0004|',
      ],
    },
  },
  PlayerStats: {
    regexes: {
      network: NetRegexes.statChange({ capture: true }).source,
      logLine: Regexes.statChange({ capture: true }).source,
    },
    examples: {
      en: [
        '12|2021-04-26T14:30:07.4910000-04:00|21|5456|326|6259|135|186|340|5456|380|3863|135|186|2628|1530|380|0|1260|4000174AE14AB6|3c03ce9ee4afccfaae74695376047054',
        '12|2021-04-26T14:31:25.5080000-04:00|24|189|360|5610|356|5549|1431|189|1340|3651|5549|5549|1661|380|1547|0|380|4000174AE14AB6|53b98d383806c5a29dfe33720f514288',
        '12|2021-08-06T10:29:35.3400000-04:00|38|308|4272|4443|288|271|340|4272|1210|2655|288|271|2002|1192|380|0|380|4000174AE14AB6|4ce3eac3dbd0eb1d6e0044425d9e091d',
      ],
    },
  },
  StartsUsing: {
    regexes: {
      network: NetRegexes.startsUsing({ capture: true }).source,
      logLine: Regexes.startsUsing({ capture: true }).source,
    },
    examples: {
      en: [
        '20|2021-07-27T12:47:23.1740000-04:00|40024FC4|The Manipulator|F63|Carnage|40024FC4|The Manipulator|4.70|-0.01531982|-13.86256|10.59466|-4.792213E-05||488abf3044202807c62fa32c2e36ee81',
        '20|2021-07-27T12:48:33.5420000-04:00|10FF0001|Tini Poutini|DF0|Stone III|40024FC4|The Manipulator|2.35|-0.06491255|-9.72675|10.54466|-3.141591||2a24845eab5ed48d4f043f7b6269ef70',
        '20|2021-07-27T12:48:36.0460000-04:00|10FF0002|Potato Chippy|BA|Succor|10FF0002|Potato Chippy|1.93|-0.7477417|-5.416992|10.54466|2.604979||99a70e6f12f3fcb012e59b3f098fd69b',
        '20|2021-07-27T12:48:29.7830000-04:00|40024FD0|The Manipulator|13BE|Judgment Nisi|10FF0001|Tini Poutini|3.20|8.055649|-17.03842|10.58736|-4.792213E-05||bc1c3d72782de2199bfa90637dbfa9b8',
        '20|2021-07-27T12:48:36.1310000-04:00|40024FCE|The Manipulator|13D0|Seed Of The Sky|E0000000||2.70|8.055649|-17.03842|10.58736|-4.792213E-05||5377da9551e7ca470709dc08e996bb75',
      ],
    },
  },
  Ability: {
    regexes: {
      network: NetRegexes.abilityFull({ capture: true }).source,
      logLine: Regexes.abilityFull({ capture: true }).source,
    },
    examples: {
      en: [
        '21|2021-07-27T12:48:22.4630000-04:00|40024FD1|Steam Bit|F67|Aetherochemical Laser|10FF0001|Tini Poutini|750003|4620000|1B|F678000|0|0|0|0|0|0|0|0|0|0|0|0|36022|36022|5200|10000|0|1000|1.846313|-12.31409|10.60608|-2.264526|16000|16000|8840|10000|0|1000|-9.079163|-14.02307|18.7095|1.416605|0000DE1F|0|5d60825d70bb46d7fcc8fc0339849e8e',
        '21|2021-07-27T12:46:22.9530000-04:00|10FF0002|Potato Chippy|07|Attack|40024FC5|Right Foreleg|710003|3910000|0|0|0|0|0|0|0|0|0|0|0|0|0|0|378341|380640|8840|10000|0|1000|-6.37015|-7.477235|10.54466|0.02791069|26396|26396|10000|10000|0|1000|-5.443688|-1.163282|10.54466|-2.9113|0000DB6E|0|58206bdd1d0bd8d70f27f3fb2523912b',
        '21|2021-07-27T12:46:21.5820000-04:00|10FF0001|Tini Poutini|03|Sprint|10FF0001|Tini Poutini|1E00000E|320000|0|0|0|0|0|0|0|0|0|0|0|0|0|0|19053|26706|10000|10000|0|1000|-1.210526|17.15058|10.69944|-2.88047|19053|26706|10000|10000|0|1000|-1.210526|17.15058|10.69944|-2.88047|0000DB68|0|29301d52854712315e0951abff146adc',
        '21|2021-07-27T12:47:28.4670000-04:00|40025026|Steam Bit|F6F|Laser Absorption|40024FC4|The Manipulator|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|685814|872320|8840|10000|0|1000|-0.01531982|-13.86256|10.59466|-4.792213E-05|16000|16000|8840|10000|0|1000|0|22.5|10.64999|-3.141593|0000DCEC|0|0f3be60aec05333aae73a042edb7edb4',
        '21|2021-07-27T12:48:39.1260000-04:00|40024FCE|The Manipulator|13D0|Seed Of The Sky|E0000000||0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|||||||||||16000|16000|8840|10000|0|1000|8.055649|-17.03842|10.58736|-4.792213E-05|0000DE92|0|ca5594611cf4ca4e276f64f2cfba5ffa',
      ],
    },
  },
  networkCancelAbility: {
    examples: {
      en: [
        '23|2021-07-27T13:04:38.7790000-04:00|10FF0002|Potato Chippy|408D|Veraero II|Cancelled||dbce3801c08020cb8ae7da9102034131',
        '23|2021-07-27T13:04:39.0930000-04:00|40000132|Garm|D10|The Dragon\'s Voice|Interrupted||bd936fde66bab0e8cf2874ebd75df77c',
        '23|2021-07-27T13:04:39.1370000-04:00|4000012F||D52|Unknown_D52|Cancelled||8a15bad31745426d65cc13b8e0d50005',
      ],
    },
  },
  networkDoT: {
    examples: {
      en: [
        '24|2021-07-27T12:47:05.5100000-04:00|10FF0002|Potato Chippy|HoT|0|3A1|21194|21194|8964|10000|0|1000|-1.815857|-5.630676|10.55192|2.929996||63d7d7e99108018a1890f367f89eae43',
        '24|2021-07-27T12:47:05.5990000-04:00|10FF0001|Tini Poutini|HoT|0|3BC|26396|26396|10000|10000|0|1000|-0.1373901|-8.438293|10.54466|3.122609||21b814e6f165bc1cde4a6dc23046ecb0',
        '24|2021-07-27T12:47:06.9340000-04:00|40024FC4|The Manipulator|DoT|0|B7F|709685|872320|8840|10000|0|1000|-0.01531982|-13.86256|10.59466|-4.792213E-05||ce3fd23ca493a37ab7663b8212044e78',
      ],
    },
  },
  WasDefeated: {
    regexes: {
      network: NetRegexes.wasDefeated({ capture: true }).source,
      logLine: Regexes.wasDefeated({ capture: true }).source,
    },
    examples: {
      en: [
        '25|2021-07-27T13:11:08.6990000-04:00|10FF0002|Potato Chippy|4000016E|Angra Mainyu||fd3760add061a5d2e23f63003cd7101d',
        '25|2021-07-27T13:11:09.4110000-04:00|10FF0001|Tini Poutini|4000016E|Angra Mainyu||933d5e946659aa9cc493079d4f6934b3',
        '25|2021-07-27T13:11:11.6840000-04:00|4000016E|Angra Mainyu|10FF0002|Potato Chippy||0b79669140c20f9aa92ad5559be75022',
        '25|2021-07-27T13:13:10.6310000-04:00|400001D1|Queen Scylla|10FF0001|Tini Poutini||8798f2cb87c42fde4601258ae94ffb7f',
      ],
    },
  },
  GainsEffect: {
    regexes: {
      network: NetRegexes.gainsEffect({ capture: true }).source,
      logLine: Regexes.gainsEffect({ capture: true }).source,
    },
    examples: {
      en: [
        '26|2021-04-26T14:36:09.4340000-04:00|35|Physical Damage Up|15.00|400009D5|Dark General|400009D5|Dark General|00|48865|48865||cbcfac4df1554b8f59f343f017ebd793',
        '26|2021-04-26T14:40:04.3810000-04:00|74d|Gale Enforcer|9.00|40000A3F|Garuda-Egi|40000A3F|Garuda-Egi|00|4439|4439||d31868a54e5032a255823c3578ca1bd7',
        '26|2021-04-26T14:23:38.3570000-04:00|f6|Demolish|18.00|10FF0001|Tini Poutini|4000B262|Midgardsormr|00|10851737|55189||fa360eae5d0b81647855b4fe4044c957',
        '26|2021-04-26T14:23:38.7560000-04:00|13b|Whispering Dawn|21.00|4000B283|Selene|10FF0002|Potato Chippy|4000016E|00|51893|49487||c7400f0eed1fe9d29834369affc22d3b',
        '26|2021-04-26T14:17:14.3270000-04:00|f6|Demolish|18.00|10FF0001|Tini Poutini|4001C48F|Embodiment|00|515250|55714||daaf86ce75560793e829a7c0891ec2a8',
        '26|2021-04-26T14:17:42.8900000-04:00|34b|Combust II|30.00|10FF0002|Potato Chippy|4001C490|Yojimbo|00|8522235|52418||fb0bb0e7e9432991cc57c9df52e51e33',
        '26|2021-04-26T14:14:09.1650000-04:00|79a|Wildfire|10.00|10FF0002|Potato Chippy|10FF0002|Potato Chippy|4000016E|00|57744|57744||033a0110024e447188cd03916733c63a',
        '26|2021-05-11T14:36:17.2510000-04:00|7c|Venomous Bite|30.00|4002E660||4002E66C|Speckled Spider|14|116300|||878cc5c4f151d16cc02e1336cd32697b',
        '26|2021-07-02T21:57:07.9110000-04:00|82c|Damage Down|30.00|40003D9F|Eden\'s Promise|40003D9D||00|148000|63981880||86ff6bf4cfdd68491274fce1db5677e8',
      ],
    },
  },
  HeadMarker: {
    regexes: {
      network: NetRegexes.headMarker({ capture: true }).source,
      logLine: Regexes.headMarker({ capture: true }).source,
    },
    examples: {
      en: [
        '27|2021-04-26T14:37:48.3550000-04:00|10FF0001|Tini Poutini|0000|0000|0018|0000|0000|0000||051a1ab18b11a70c22fe56d716a75a20',
        '27|2021-04-26T14:38:00.0360000-04:00|10FF0001|Tini Poutini|0000|0000|001A|0000|0000|0000||81351db91d8a53406106f4fe94dccf3a',
        '27|2021-04-26T14:29:35.7180000-04:00|10FF0001|Tini Poutini|0000|E000|00A0|0000|0000|0000||44b502d374749978aa96969869b49afc',
        '27|2021-04-26T14:17:31.6980000-04:00|10FF0001|Tini Poutini|0000|A9B9|0057|0000|0000|0000||4fb326d8899ffbd4cbfeb29bbc3080f8',
        '27|2021-05-11T13:48:45.3370000-04:00|40000950|Copied Knave|0000|0000|0117|0000|0000|0000||fa2e93fccf397a41aac73a3a38aa7410',
      ],
    },
  },
  networkRaidMarker: {
    examples: {
      en: [
        '28|2021-04-26T19:04:39.1920000-04:00|Delete|7|10FF0001|Tini Poutini|0|0|0|b714a8b5b34ea60f8bf9f480508dc427',
        '28|2021-04-26T19:27:23.5340000-04:00|Add|4|10FF0001|Tini Poutini|76.073|110.588|0|bcf81fb146fe88230333bbfd649eb240',
      ],
    },
  },
  networkTargetMarker: {
    examples: {
      en: [
        '29|2021-06-10T20:15:15.1000000-04:00|Delete|0|10FF0001|Tini Poutini|4000641D|||50460af5ff3f8ec9ad03e6953d3d1ba9',
        '29|2021-06-10T20:15:15.1000000-04:00|Add|0|10FF0001|Tini Poutini|400075A9|||0afeb301004fc6d8c7bd5f6cbda9dce7',
        '29|2021-05-25T22:54:32.5660000-04:00|Add|6|10FF0001|Tini Poutini|10FF0002|Potato Chippy||70a8c8a728d09af83e0a486e8271cc57',
      ],
    },
  },
  LosesEffect: {
    regexes: {
      network: NetRegexes.losesEffect({ capture: true }).source,
      logLine: Regexes.losesEffect({ capture: true }).source,
    },
    examples: {
      en: [
        '30|2021-04-26T14:38:09.6990000-04:00|13a|Inferno|0.00|400009FF|Ifrit-Egi|400009FD|Scylla|00|941742|4933||19164478551c91375dc13d0998365130',
        '30|2021-04-26T14:37:12.8740000-04:00|77b|Summon Order|0.00|400009E8|Eos|400009E8|Eos|01|5810|5810||b1736ae2cf65864623f9779635c361cd',
        '30|2021-04-26T14:23:38.8440000-04:00|bd|Bio II|0.00|10FF0001|Tini Poutini|4000B262|Midgardsormr|00|10851737|51654||e34ec8d3a8db783fe34f152178775804',
      ],
    },
  },
  networkGauge: {
    examples: {
      en: [
        '31|2019-11-27T23:22:40.6960000-05:00|10FF0001|FA753019|FD37|E9A55201|7F47|f17ea56b26ff020d1c0580207f6f4673',
        '31|2021-04-28T00:26:19.1320000-04:00|10FF0002|BF000018|10035|40006600|00|f31bf7667388ce9b11bd5dd2626c7b99',
      ],
    },
  },
  ActorControl: {
    regexes: {
      network: NetRegexes.network6d({ capture: true }).source,
      logLine: Regexes.network6d({ capture: true }).source,
    },
    examples: {
      en: [
        '33|2021-04-26T14:17:16.7440000-04:00|80034E5B|8000000C|16|E74|00|00|55e425f79b5cadd724dbc718b86f70b1',
        '33|2021-04-26T14:17:31.6980000-04:00|80034E5B|8000000C|16|FFFFFFFF|00|00|b543f3c5c715e93d9de2aa65b8fe83ad',
        '33|2021-04-26T14:18:39.0120000-04:00|80034E5B|40000007|00|01|00|00|7a2b827bbc7a58ecc0c5edbdf14a2c14',
      ],
    },
  },
  NameToggle: {
    // @TODO: There's a NetRegexes but no Regexes for this one?
    /* regexes: {
      network: NetRegexes.nameToggle({ capture: true }).source,
      logLine: Regexes.nameToggle({ capture: true }).source,
    }, */
    examples: {
      en: [
        '34|2021-04-26T14:19:48.0400000-04:00|4001C51C|Dragon\'s Head|4001C51C|Dragon\'s Head|00|a7248aab1da528bf94faf2f4b1728fc3',
        '34|2021-04-26T14:22:19.1960000-04:00|4000B283|Selene|4000B283|Selene|01|734eef0f5b1b10810af8f7257d738c67',
        '34|2021-04-26T14:25:06.0720000-04:00|4000B262|Midgardsormr|4000B262|Midgardsormr|00|e3482e01bb9e1c358c23a843b6c63556',
        '34|2021-04-26T14:18:00.9980000-04:00|10FF0001|Tini Poutini|10FF0001|Tini Poutini|00|5b840ff5e79d908b3f9a3e806a64fd0b',
      ],
    },
  },
  Tether: {
    regexes: {
      network: NetRegexes.network6d({ capture: true }).source,
      logLine: Regexes.network6d({ capture: true }).source,
    },
    examples: {
      en: [
        '35|2021-04-26T17:27:07.0310000-04:00|40003202|Articulated Bit|10FF0001|Tini Poutini|0000|0000|0001|10029769|000F|0000||ad71d456437e6792f68b19dbef9507d5',
        '35|2021-04-27T22:36:58.1060000-04:00|10FF0001|Tini Poutini|4000943B|Bomb Boulder|0000|0000|0007|4000943B|000F|0000||a6adfcdf5dad0ef891deeade4d285eb2',
        '35|2021-06-13T17:41:34.2230000-04:00|10FF0001|Tini Poutini|10FF0002|Potato Chippy|0000|0000|006E|1068E3EF|000F|0000||c022382c6803d1d6c1f84681b7d8db20',
        '35|2021-04-26T21:12:22.3130000-04:00|4000158E|Copied Knave|40001590|Knave Of Hearts|0000|0000|0098|40001590|000F|0000||f980da434aac6cfb97c19ec26359c3b9',
        '35|2021-04-26T19:10:04.7570000-04:00|40009B34||40009B33||A1FA|0000|009C|40009B33|000F|7FF0||467cec67b35e7de046e5ed9ce8986a54',
      ],
    },
  },
  limitBreak: {
    examples: {
      en: [
        '36|2021-04-26T14:20:09.6880000-04:00|6A90|3|88ce578cb8f05d74feb3a7fa155bedc5',
        '36|2021-04-26T14:20:19.6580000-04:00|4E20|2|a3bf154ba550e147d4fbbd4266db4eb9',
        '36|2021-04-26T14:20:23.9040000-04:00|0000|0|703872b50849730773f7b21897698d00',
        '36|2021-04-26T14:22:03.8370000-04:00|0000|1|c85f02ac4780e208357383afb6cbc232',
      ],
    },
  },
  StatusEffect: {
    regexes: {
      network: NetRegexes.statusEffectExplicit({ capture: true }).source,
      logLine: Regexes.statusEffectExplicit({ capture: true }).source,
    },
    examples: {
      en: [
        '38|2021-04-26T14:13:16.2760000-04:00|10FF0001|Tini Poutini|46504615|75407|75407|10000|10000|24|0|-645.238|-802.7854|8|1.091302|1500|3C|0|0A016D|41F00000|E0000000|1E016C|41F00000|E0000000||c1b3e1d63f03a265ffa85f1517c1501e',
        '38|2021-04-26T14:13:16.2760000-04:00|10FF0001||46504621|49890|49890|10000|10000|24|0|||||1500|3C|0||f62dbda5c947fa4c11b63c90c6ee4cd9',
        '38|2021-04-26T14:13:44.5020000-04:00|10FF0002|Potato Chippy|46504621|52418|52418|10000|10000|32|0|99.93127|113.8475|-1.862645E-09|3.141593|200F|20|0|0A016D|41F00000|E0000000|1E016C|41F00000|E0000000|0345|41E8D4FC|10FF0001|0347|80000000|10FF0002||d57fd29c6c4856c091557968667da39d',
      ],
    },
  },
  networkUpdateHP: {
    examples: {
      en: [
        '39|2021-04-26T14:12:29.5060000-04:00|10FF0001|Tini Poutini|121087|121087|10000|10000|0|0|-648.3234|-804.5252|8.570148|1.010669||a0cca3b79b0fd65541e3fa6b11fa386e',
        '39|2021-04-26T14:12:32.4990000-04:00|10FF0001|Tini Poutini|140281|191948|10000|10000|0|0|-648.3234|-804.5252|8.570148|1.010669||de4c6c2f99d2f1bf2f3b5e5eb3250d4b',
        '39|2021-04-26T14:12:35.4830000-04:00|10FF0001|Tini Poutini|159475|191948|10000|10000|0|0|-648.3234|-804.5252|8.570148|1.010669||e34562c0c4e117e3709cf28a0c7759f6',
        '39|2021-04-26T14:12:38.5160000-04:00|10FF0001|Tini Poutini|178669|191948|10000|10000|0|0|-648.3234|-804.5252|8.570148|1.010669||7ebe348673aa2a11e4036274becabc81',
        '39|2021-04-26T14:13:21.6370000-04:00|10592642|Senor Esteban|54792|54792|10000|10000|0|0|100.268|114.22|-1.837917E-09|3.141593||883da0db11a9c950eefdbcbc50e86eca',
        '39|2021-04-26T14:13:21.6370000-04:00|106F5D49|O\'ndanya Voupin|79075|79075|10000|10000|0|0|99.93127|114.2443|-1.862645E-09|-3.141593||8ed73ee57c4ab7159628584e2f4d5243',
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

const mappedLogLines: LocaleObject<LineDocTypes[]> = {
  en: [],
};

const config: markdownMagic.Configuration = {
  outputDir: path.posix.relative(curPath, path.posix.join(curPath, 'docs')),
  transforms: {
    logLines(_content, options: LogGuideOptions): string {
      const language = options.lang;
      const lineType = options.type;
      if (!isLang(language)) {
        console.error(`Received invalid lang specification: ${language ?? 'undefined'}`);
        process.exit(-1);
      }
      if (!isLineType(lineType)) {
        console.error(`Received invalid type specification: ${lineType ?? 'undefined'}`);
        process.exit(-2);
      }

      const lineDoc = lineDocs[lineType];

      if (!lineDoc) {
        console.error(`Received missing type specification: ${lineType ?? 'undefined'}`);
        process.exit(-3);
      }

      mappedLogLines[language] ??= [];
      mappedLogLines[language]?.push(lineType);

      const logRepo = new LogRepository();
      // Add the default combatants to the repo for name lookup when names are blank
      logRepo.Combatants['10FF0001'] = { spawn: 0, despawn: 0, name: 'Tini Poutini' };
      logRepo.Combatants['10FF0002'] = { spawn: 0, despawn: 0, name: 'Potato Chippy' };

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
        structureNetworkArray[index] ??= '[?]';

      let structureNetwork = structureNetworkArray.join('|');
      const structureLogLine = ParseLine.parse(logRepo, structureNetwork);
      let structureLog = structureLogLine?.properCaseConvertedLine ??
        structureLogLine?.convertedLine;

      if (!structureLog)
        throw new UnreachableCode();

      // Replace default timestamp with `[timestamp]` indicator
      // We have to do this here because LineEvent needs to parse the timestamp to convert
      structureNetwork = structureNetwork.replace(/^(\d+)\|[^|]+\|/, '$1|[timestamp]|');
      structureLog = structureLog.replace(/^\[[^\]]+\]/, '[timestamp]');

      const examples = translate(language, lineDoc.examples);

      const examplesNetwork = examples.join('\n') ?? '';
      const examplesLogLine = examples.map((e) => {
        const line = ParseLine.parse(logRepo, e);
        if (!line)
          throw new UnreachableCode();
        return line?.properCaseConvertedLine ?? line?.convertedLine;
      }).join('\n') ?? '';

      const regexes = lineDoc.regexes;

      ret += `
#### Structure

\`\`\`log
Network Log Line Structure:
${structureNetwork}

ACT Log Line Structure:
${structureLog}
\`\`\`
`;

      if (regexes) {
        ret += `
#### Regexes

\`\`\`log
Network Log Line Regex:
${regexes.network}

ACT Log Line Regex:
${regexes.logLine}
\`\`\`
`;
      }

      ret += `
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
    for (const file of output) {
      const filePath = file.originalPath;
      // Figure out what language this file is by checking the path, default to 'en'
      const lang = languages.filter((lang) =>
        RegExp(('[^\\w]' + lang + '[^\\w]')).exec(filePath.toLowerCase())
      )[0] ?? 'en';
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

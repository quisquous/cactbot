import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// O3S - Deltascape 3.0 Savage
export default {
  zoneId: ZoneId.DeltascapeV30Savage,
  timelineFile: 'o3s.txt',
  timelineTriggers: [
    {
      id: 'O3S Great Dragon Frost Breath',
      regex: /Frost Breath/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dragon Cleave',
          de: 'Drachen-Cleave',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'O3S Panel Swap Phase Counter',
      netRegex: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: (data) => {
        data.phase = (data.phase || 0) + 1;
        delete data.seenHolyThisPhase;
      },
    },
    {
      id: 'O3S Critical Hit',
      netRegex: NetRegexes.startsUsing({ id: '22EB', source: 'Halicarnassus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '22EB', source: 'Halikarnassos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '22EB', source: 'Halicarnasse' }),
      netRegexJa: NetRegexes.startsUsing({ id: '22EB', source: 'ハリカルナッソス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '22EB', source: '哈利卡纳苏斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '22EB', source: '할리카르나소스' }),
      condition: Conditions.caresAboutPhysical(),
      // "Use Awareness!! <se.6>"
      response: Responses.tankBuster(),
    },
    {
      id: 'O3S Dimensional Wave',
      netRegex: NetRegexes.startsUsing({ id: '22F6', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F6', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F6', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F6', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F6', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F6', source: '할리카르나소스', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Look for spellblade holy so that the last noisy waltz
      // books message in the library phase can be ignored.
      id: 'O3S Spellblade Holy Counter',
      netRegex: NetRegexes.ability({ id: '22EF', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '22EF', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '22EF', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '22EF', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '22EF', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '22EF', source: '할리카르나소스', capture: false }),
      run: (data) => {
        // In case something went awry, clean up any holy targets
        // so the next spellblade holy can start afresh.
        delete data.holyTargets;
        delete data.holyTethers;
        data.seenHolyThisPhase = true;
      },
    },
    {
      // Normal spellblade holy with tethers and one stack point.
      // "64" is a stack marker.  "65" is the prey marker.
      // The debuff order in the logs is:
      //   (0) tethers go out
      //   (1) stack marker (tethered to #2)
      //   (2) prey marker (tethered to #1)
      //   (3) prey marker (tethered to #4)
      //   (4) prey marker (tethered to #3)
      // So, #2 is the person everybody should stack on.
      id: 'O3S Spellblade Holy',
      netRegex: NetRegexes.headMarker({ id: ['0064', '0065'] }),
      condition: (data, matches) => {
        // Library phase stack markers behave differently.
        if (data.phase === 3)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches.target);
        return true;
      },
      delaySeconds: 0.3,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          othersStackOnHoly: {
            en: '(others stack on ${player})',
            de: 'andere stacken auf ${player}',
            fr: 'Les autres se packent sur ${player}',
            ja: '他は${player}と頭割り',
            cn: '其他分摊${player}',
            ko: '${player} 다른 쉐어징',
          },
          spread: Outputs.spread,
          stackOnHoly: Outputs.stackOnPlayer,
          stackOnYou: Outputs.stackOnYou,
        };

        // If already run, abort.
        if (!data.holyTargets || data.holyTargets.length < 2)
          return;

        const stackTarget = data.holyTargets[1];

        const ret = {};
        if (data.me === stackTarget) {
          ret.alarmText = output.stackOnYou();
        } else {
          if (data.holyTargets.includes(data.me)) {
            ret.alertText = output.spread();
            ret.infoText = output.othersStackOnHoly({ player: data.ShortName(stackTarget) });
          } else {
            ret.infoText = output.stackOnHoly({ player: data.ShortName(stackTarget) });
          }
        }
        return ret;
      },
      run: (data) => {
        delete data.holyTargets;
        delete data.holyTethers;
      },
    },
    {
      // Library phase spellblade holy with 2 stacks / 4 preys / 2 unmarked.
      id: 'O3S Library Spellblade',
      netRegex: NetRegexes.headMarker({ id: ['0064', '0065'] }),
      condition: (data, matches) => {
        // This is only for library phase.
        if (data.phase !== 3)
          return false;

        if (matches.target === data.me)
          data.librarySpellbladeMe = matches.id;

        return true;
      },
      // Because people can be dead and there are eight marks, delay to
      // accumulate logs instead of counting marks.  Instantly print if
      // anything is on you.  The 6 triggers will all have condition=true
      // and run, but only the first one will print.
      delaySeconds: (data, matches) => matches.target === data.me ? 0 : 0.5,
      alertText: (data, _matches, output) => {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe === '0064')
          return output.goSouthStackOnYou();

        if (data.librarySpellbladeMe === '0065')
          return output.goNorth();

        return output.goSouthStackOnFriend();
      },
      outputStrings: {
        goSouthStackOnYou: {
          en: 'Go South: Stack on YOU',
          de: 'Nach Süden: stack auf DIR',
          fr: 'Allez au sud : Package sur VOUS',
          ja: '南へ: 自分に頭割り',
          cn: '去南边分摊点名',
          ko: '남쪽으로: 쉐어징 대상자',
        },
        goNorth: {
          en: 'Go North',
          de: 'nach norden',
          fr: 'Allez au nord',
          ja: '南へ',
          cn: '去南边',
          ko: '북쪽으로',
        },
        goSouthStackOnFriend: {
          en: 'Go South: Stack on Friend',
          de: 'nach süden: stack auf freund',
          fr: 'Allez au sud : Package sur un ami',
          ja: '南へ: 頭割り',
          cn: '去南边分摊',
          ko: '남쪽으로: 쉐어징',
        },
      },
    },
    {
      id: 'O3S Right Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '510' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Right',
          de: 'Geistlenkung: Rechts',
          fr: 'Contrainte mentale : Vers la droite',
          ja: 'マインドジャック: 右折',
          cn: '右',
          ko: '정신장악: 오른쪽',
        },
      },
    },
    {
      id: 'O3S Forward March',
      netRegex: NetRegexes.gainsEffect({ effectId: '50D' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Forward',
          de: 'Geistlenkung: Vorwärts',
          fr: 'Contrainte mentale : Vers l\'avant',
          ja: 'マインドジャック: 前進',
          cn: '前',
          ko: '정신장악: 앞쪽',
        },
      },
    },
    {
      id: 'O3S Left Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '50F' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Left',
          de: 'Geistlenkung: Links',
          fr: 'Contrainte mentale : Vers la gauche',
          ja: 'マインドジャック: 左折',
          cn: '左',
          ko: '정신장악: 왼쪽',
        },
      },
    },
    {
      id: 'O3S About Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '50E' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Back',
          de: 'Geistlenkung: Zurück',
          fr: 'Contrainte mentale : Vers l\'arrière',
          ja: 'マインドジャック: 後退',
          cn: '后',
          ko: '정신장악: 뒤쪽',
        },
      },
    },
    {
      id: 'O3S Ribbit',
      netRegex: NetRegexes.startsUsing({ id: '22F7', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F7', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F7', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F7', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F7', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F7', source: '할리카르나소스', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'O3S Oink',
      netRegex: NetRegexes.startsUsing({ id: '22F9', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F9', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F9', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F9', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F9', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F9', source: '할리카르나소스', capture: false }),
      response: Responses.doritoStack(),
    },
    {
      id: 'O3S Squelch',
      netRegex: NetRegexes.startsUsing({ id: '22F8', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F8', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F8', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F8', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F8', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F8', source: '할리카르나소스', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O3S Individual Adds',
      // npcNameId, npcBaseId
      // 5626, 7399 = White Flame
      // 6724, 7400 = Great Dragon
      // 6056, 7401 = Apanda
      // There are a bunch of 6056, 7404 Apandas that get added at the beginning.
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: ['5626', '6724', '6056'], npcBaseId: ['7399', '7400', '7401'] }),
      infoText: (_data, matches, output) => output.kill({ name: matches.name }),
      outputStrings: {
        kill: {
          en: 'Kill ${name}',
          de: 'Töte ${name}',
        },
      },
    },
    {
      id: 'O3S Iron Giant',
      // 5636 = Iron Giant
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '5636', capture: false }),
      infoText: (_data, _matches, output) => output.kill(),
      outputStrings: {
        kill: {
          en: 'Kill Giant + Ninjas',
          de: 'Töte Riese + Ninjas',
        },
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      netRegex: NetRegexes.startsUsing({ id: '230E', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '230E', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '230E', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '230E', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '230E', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '230E', source: '할리카르나소스', capture: false }),
      condition: (data) => {
        // Deliberately skip printing the waltz message for the
        // spellblade holy -> waltz that ends the library phase.
        return data.phase !== 3 || !data.seenHolyThisPhase;
      },
      alertText: (data, _matches, output) => {
        data.bookCount = (data.bookCount || 0) + 1;
        // The second books (with the Apanda) has big magic hammer circles.
        // Usually folks handle this by going to the inner corners.
        return data.bookCount !== 2 ? output.books() : output.magicHammer();
      },
      outputStrings: {
        books: {
          en: 'Books (One Per Square)',
          de: 'Bücher (Eins pro Feld)',
          fr: 'Danse de la reine : Livres', // FIXME
          ja: '女王の舞い: 本', // FIXME
          cn: '中间两排分格站位', // FIXME
          ko: '여왕의 춤: 책', // FIXME
        },
        magicHammer: {
          en: 'Books + Magic Hammer',
          de: 'Bücher + Zauberhammer',
        },
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      netRegex: NetRegexes.startsUsing({ id: '2306', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2306', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2306', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2306', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2306', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2306', source: '할리카르나소스', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Clock',
          de: 'Himmelsrichtungen',
          fr: 'Danse de la reine : Position', // FIXME
          ja: '女王の舞い: 散開', // FIXME
          cn: '万变水波站位', // FIXME
          ko: '여왕의 춤: 산개', // FIXME
        },
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      netRegex: NetRegexes.startsUsing({ id: '230A', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '230A', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '230A', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '230A', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '230A', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '230A', source: '할리카르나소스', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Be On Blue Square',
          de: 'Stehe auf einem blauem Feld',
          fr: 'Danse de la reine : Carré de cristal', // FIXME
          ja: '女王の舞い: 床', // FIXME
          cn: '站在蓝地板', // FIXME
          ko: '여왕의 춤: 대지', // FIXME
        },
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      netRegex: NetRegexes.startsUsing({ id: '2308', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2308', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2308', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2308', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2308', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2308', source: '할리카르나소스', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tethers',
          de: 'Dornenranken-Verbindungen',
          fr: 'Danse de la reine : Liens', // FIXME
          ja: '女王の舞い: 茨', // FIXME
          cn: '先集中后扯线', // FIXME
          ko: '여왕의 춤: 가시', // FIXME
        },
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers You',
      netRegex: NetRegexes.tether({ id: '0012' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.breakTether({ player: data.ShortName(matches.source) });
        else if (data.me === matches.source)
          return output.breakTether({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        breakTether: {
          en: 'Break Tether (${player})',
          de: 'Verbindung trennen (${player})',
          ko: '가시줄 끊기 ("${player}")',
        },
      },
    },
    {
      id: 'O3S Soul Reaper',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '5634' }),
      alertText: (data, matches, output) => {
        data.reapers = data.reapers || [];
        data.reapers.push(matches);

        if (data.reapers.length !== 4)
          return;

        // Everything is symmetrical and safe spots are on the diagonal,
        // so treat this as a linear problem.
        const safeSpots = new Set([0, 1, 2, 3]);

        // x, y coordinates: -15, 5, 5, 15 on rows/columns.
        // x, y coordinates: -19 or 19 if outside.
        const mapPosToIndex = (coord) => Math.round((coord + 15) / 10);
        for (const reaper of data.reapers) {
          const x = parseFloat(reaper.x);
          const y = parseFloat(reaper.y);

          // Skip the ~center one.
          if (Math.abs(x) < 1 && Math.abs(y) < 1)
            continue;

          if (Math.abs(x) < 17)
            safeSpots.delete(mapPosToIndex(x));
          if (Math.abs(y) < 17)
            safeSpots.delete(mapPosToIndex(y));
        }

        const spots = Array.from(safeSpots);
        if (spots.length !== 1)
          return output.unknown();

        return {
          0: output.nwOutside(),
          1: output.nwInside(),
          2: output.seInside(),
          3: output.seOutside(),
        }[spots[0]];
      },
      outputStrings: {
        unknown: Outputs.unknown,
        nwOutside: {
          en: 'NW Outside',
          de: 'NW Außen',
        },
        nwInside: {
          en: 'NW Inside',
          de: 'NW Innen',
        },
        seInside: {
          en: 'SE Inside',
          de: 'SO Innen',
        },
        seOutside: {
          en: 'SE Outside',
          de: 'SO Außen',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Oink/Ribbit/Squelch': 'Random Animal',
        'Spellblade Blizzard/Fire/Thunder': 'Elemental Spellblade',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Halicarnassus': 'Halikarnassos',
        'Apanda': 'Apanda',
        'Soul Reaper': 'Seelenschnitter',
      },
      'replaceText': {
        '\\(Apanda\\)': '(Apanda)',
        '\\(Books\\)': '(Bücher)',
        '\\(Cave\\)': '(Positionen)',
        '\\(Clock\\)': '(Positionen)',
        '\\(Crystals\\)': '(Kristalle)',
        '\\(Great Dragon\\)': '(Riesendrache)',
        '\\(library\\)': '(Bibliothek)',
        '\\(Ninjas/Giant\\)': '(Ninjas/Eisengigant)',
        '\\(Random\\)': '(Zufall)',
        '\\(Soul Reapers\\)': '(Seelenschnitter)',
        '\\(Spellblade Books\\)': '(Magieklingen Bücher)',
        '\\(Thorns\\)': '(Dornen)',
        '\\(White Flame\\)': '(Weiße Flamme)',
        'Blizzard': 'Eis',
        'Critical Hit': 'Kritischer Treffer',
        'Dimensional Wave': 'Dimensionswelle',
        'Fire': 'Feuer',
        'Haste': 'Hast',
        'Magic Hammer': 'Zauberhammer',
        'Mindjack': 'Geistlenkung',
        'Oink': 'Quiiiek',
        'Panel Swap': 'Neuaufstellung',
        'Place Dark Token': 'Todesspielstein',
        'Place Token': 'Spielstein',
        'Ribbit': 'Quaaak',
        'Spellblade Holy': 'Magieklinge Sanctus',
        'Squelch': 'Gurrr',
        'Tethers': 'Verbindungen',
        'The Game': 'Spielbeginn',
        'The Playing Field': 'Spielfeld',
        '(The )?Queen\'s Waltz': 'Tanz Der Königin',
        'Thunder': 'Blitz',
        'Cross Reaper': 'Sensenschwung',
        'Frost Breath': 'Frostiger Atem',
        'Grand Sword': 'Großschwert',
        'Gusting Gouge': 'Meißelstoß',
        'Holy Blur': 'Heiliger Nebel',
        'Holy Edge': 'Heiliger Grat',
        'Pole Shift': 'Umpolung',
        'Pummel': 'Deftige Dachtel',
        'Ray of White': 'Weißer Strahl',
        'Sword Dance': 'Schwerttanz',
        'Uplift': 'Erhöhung',
        'White Wind': 'Weißer Wind',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Apanda': 'Apanda',
        'Halicarnassus': 'Halicarnasse',
        'Soul Reaper': 'Faucheur D\'âmes',
      },
      'replaceText': {
        '\\(Books\\)': '(Livres)',
        '\\(Clock\\)': '(Positions)',
        '\\(Crystals\\)': '(Cristaux)',
        '\\(Great Dragon\\)': '(Dragon suprême)',
        '\\(Ninjas/Giant\\)': '(Ninjas/Géant)',
        '\\(Random\\)': '(Aléatoire)',
        '\\(Soul Reapers\\)': '(Faucheurs D\'âmes)',
        '\\(Spellblade Books\\)': '(Livres de sorts)',
        '\\(Thorns\\)': '(Ronces)',
        '\\(Tethers\\)': '(Liens)',
        '\\(White Flame\\)': '(Flamme blanche)',
        'Critical Hit': 'Attaque critique',
        'Cross Reaper': 'Fauchaison',
        'Dimensional Wave': 'Onde dimensionnelle',
        'Frost Breath': 'Souffle glacé',
        'Grand Sword': 'Grande épée',
        'Gusting Gouge': 'Gouge cisaillante',
        'Haste': 'Hâte',
        'Holy Blur': 'Brume sacrée',
        'Holy Edge': 'Taille sacrée',
        'Magic Hammer': 'Marteau magique',
        'Mindjack': 'Contrainte mentale',
        'Oink(?!/)': 'Abracadabri',
        'Oink/Ribbit/Squelch': 'Animal aléatoire',
        'Panel Swap': 'Remplacement des cases',
        'Place Dark Token': 'Pions obscurs en jeu',
        'Place Token': 'Pion en jeu',
        'Pole Shift': 'Inversion des pôles',
        'Pummel': 'Torgnole',
        'Ray of White': 'Tir blanc',
        '(?<!/)Ribbit(?!/)': 'Coâââ',
        'Spellblade Blizzard/Fire/Thunder': 'Magilame élémentaire',
        'Spellblade Blizzard III': 'Magilame Méga Glace',
        'Spellblade Fire III': 'Magilame Méga Feu',
        'Spellblade Holy': 'Magilame Miracle',
        'Spellblade Thunder III': 'Magilame Méga Foudre',
        '(?<!/)Squelch': 'Abracadabra',
        'Sword Dance': 'Danse du sabre',
        'The Game': 'Début de partie',
        'The Playing Field': 'Plateau de jeu',
        'The Queen\'s Waltz': 'Danse de la reine',
        'Uplift': 'Exhaussement',
        'White Wind': 'Vent blanc',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Halicarnassus': 'ハリカルナッソス',
        'Apanda': 'アパンダ',
        'Soul Reaper': 'ソウルリーパー',
      },
      'replaceText': {
        'Blizzard': 'ブリザド',
        'Books': '本',
        'Clock': '散開',
        'Critical Hit': 'クリティカル',
        'Crystals': '床',
        'Dimensional Wave': '次元波動',
        'Fire': 'ファイア',
        'Haste': 'ヘイスト',
        'Magic Hammer': 'マジックハンマー',
        'Mindjack': 'マインドジャック',
        'Ninjas/Giant': 'ニンジャ / 鉄巨人',
        'Oink': 'ポルルルル！',
        'Panel Swap': 'パネルシャッフル',
        'Place Dark Token': 'サモンデストークン',
        'Place Token': 'サモントークン',
        '(?<=\\()Random(?=\\))': 'ランダム',
        'Ribbit': 'クルルルル！',
        'Spellblade Holy': '魔法剣ホーリー',
        'Squelch': 'カルルルル！',
        'Tethers': '茨',
        'The Game': 'ゲームスタート',
        'The Playing Field': 'ゲームボード',
        '(The )?Queen\'s Waltz': '女王の舞い',
        'Thunder': 'サンダー',
        'Cross Reaper': 'クロスリーパー',
        'Frost Breath': 'フロストブレス',
        'Grand Sword': 'グランドソード',
        'Gusting Gouge': 'ガスティンググージ',
        'Holy Blur': 'ホーリーミスト',
        'Holy Edge': 'ホーリーエッジ',
        'Pole Shift': '磁場転換',
        'Pummel': '殴打',
        'Ray of White': 'ホワイトショット',
        'Sword Dance': '剣の舞い',
        'Uplift': '隆起',
        'White Wind': 'ホワイトウィンド',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Halicarnassus': '哈利卡纳苏斯',
        'Apanda': '阿班达',
        'Soul Reaper': '灵魂收割者',
      },
      'replaceText': {
        '\\(Random\\)': '(随机)',
        '\\(Apanda\\)': '(阿班达)',
        '\\(Books\\)': '(图书)',
        '\\(Clock\\)': '(八方)',
        '\\(Crystals\\)': '(水晶)',
        '\\(Ultimate\\)': '(狂暴)',
        'Blizzard': '冰结',
        'Critical Hit': '暴击',
        'Dimensional Wave': '次元波动',
        'Fire': '火炎',
        'Haste': '加速',
        'Magic Hammer': '魔法锤',
        'Mindjack': '精神控制',
        'Ninjas/Giant': '忍者/巨人',
        'Oink': '哼哼哼哼哼！',
        'Panel Swap': '刷新盘面',
        'Place Dark Token': '召唤死形',
        'Place Token': '召唤魔形',
        '(The )?Queen\'s Waltz': '女王之舞',
        'Ribbit': '呱呱呱呱呱！',
        'Spellblade Holy': '魔法剑·神圣',
        'Squelch': '喀喀喀喀喀！',
        'Tethers': '连线',
        'The Game': '游戏开始',
        'The Playing Field': '游戏盘面',
        'Thunder': '闪雷',
        'Cross Reaper': '交叉斩击',
        'Frost Breath': '寒霜吐息',
        'Grand Sword': '巨剑',
        'Gusting Gouge': '削风',
        'Holy Blur': '神圣雾',
        'Holy Edge': '神圣刃',
        'Pole Shift': '磁场转换',
        'Pummel': '殴打',
        'Ray of White': '苍白射击',
        'Sword Dance': '剑舞',
        'Uplift': '隆起',
        'White Wind': '白风',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Halicarnassus': '할리카르나소스',
        'Apanda': '아판다',
        'Soul Reaper': '영혼 수확자',
      },
      'replaceText': {
        '\\(Random\\)': '(무작위)',
        '\\(Apanda\\)': '(아판다)',
        '\\(Books\\)': '(책)',
        '\\(Clock\\)': '(팔방 산개)',
        '\\(Crystals\\)': '(크리스탈)',
        '\\(Ultimate\\)': '(최종)',
        'Blizzard': '블리자드',
        'Critical Hit': '극대화',
        'Dimensional Wave': '차원 파동',
        'Fire': '파이어',
        'Haste(?! )': '헤이스트',
        'Haste III': '헤이스가',
        'Magic Hammer': '마법 망치',
        'Mindjack': '정신 장악',
        'Oink': '꿀꿀꿀꿀!',
        'Panel Swap': '판 바꾸기',
        'Place Dark Token': '죽음의 토큰 소환',
        'Place Token': '토큰 소환',
        'Ribbit': '개굴개굴!',
        'Spellblade Holy': '마법검 홀리',
        'Squelch': '보글보글!',
        'Tethers': '선',
        'The Game': '게임 시작',
        'The Playing Field': '게임판',
        '(The )?Queen\'s Waltz': '여왕의 춤',
        'Thunder': '선더',
        'Ninjas/Giant': '닌자/철거인',
        'Cross Reaper': '사신의 낫',
        'Frost Breath': '서리 숨결',
        'Grand Sword': '웅장한 검격',
        'Gusting Gouge': '칼날 돌풍',
        'Holy Blur': '성스러운 안개',
        'Holy Edge': '성스러운 칼날',
        'Pole Shift': '자기장 전환',
        'Pummel': '구타',
        'Ray of White': '하얀 사격',
        'Sword Dance': '칼춤',
        'Uplift': '융기',
        'White Wind': '하얀 바람',
      },
    },
  ],
};

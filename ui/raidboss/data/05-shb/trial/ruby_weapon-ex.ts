import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenFlight?: boolean;
  ravens?: { [color: string]: string | undefined };
  colors?: { [name: string]: string };
  ravenDead?: boolean;
  colorToImageId?: { [color: string]: string };
  imageIdToAction?: { [id: string]: string };
}

// TODO: ravensflight calls would be nice

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.CinderDriftExtreme,
  timelineFile: 'ruby_weapon-ex.txt',
  timelineTriggers: [
    {
      id: 'RubyEx Magitek Meteor Behind',
      regex: /Magitek Meteor/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Meteor',
          de: 'Hinter dem Meteor verstecken',
          fr: 'Cachez-vous derrière le météore',
          ja: 'メテオの後ろに',
          cn: '躲在陨石后',
          ko: '운석 뒤에 숨기',
        },
      },
    },
    {
      id: 'RubyEx Magitek Meteor Away',
      regex: /Magitek Meteor/,
      beforeSeconds: 0,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Meteor',
          de: 'Weg vom Meteor',
          fr: 'Éloignez-vous du météore',
          ja: 'メテオから離れる',
          cn: '远离陨石',
          ko: '운석에게서 멀어지기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'RubyEx Optimized Ultima',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4ABE', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'RubyEx Stamp',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B03' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'RubyEx Ravensclaw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4ACC', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Line Ends',
          de: 'Weg von den Linienenden',
          fr: 'Éloignez-vous des fins de lignes',
          ja: '線の端から避ける',
          cn: '远离线末端',
          ko: '선 끝나는 곳 피하기',
        },
      },
    },
    {
      id: 'RubyEx Undermine',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Lines',
          de: 'Weg von den Linien',
          fr: 'Éloignez-vous des sillons',
          ja: '線から離れる',
          cn: '远离线',
          ko: '선 피하기',
        },
      },
    },
    {
      id: 'RubyEx Liquefaction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4ACF', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get On Lines',
          de: 'Auf die Linien gehen',
          fr: 'Allez sur les sillons',
          ja: '線を踏む',
          cn: '靠近线',
          ko: '선 위로 올라가기',
        },
      },
    },
    {
      id: 'RubyEx Liquefaction Ravensflight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEC', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.seenFlight)
          return output.outOfMiddle!();
        return output.getMiddle!();
      },
      run: (data) => data.seenFlight = true,
      outputStrings: {
        getMiddle: Outputs.goIntoMiddle,
        outOfMiddle: {
          en: 'Out Of Middle',
          de: 'Raus aus der Mitte',
          fr: 'Sortez du milieu',
          ja: '横へ',
          cn: '远离中间',
          ko: '가운데 피하기',
        },
      },
    },
    {
      id: 'RubyEx Ruby Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B02', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'RubyEx Cut And Run',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8', capture: false }),
      suppressSeconds: 1,
      response: Responses.stackMarker(),
    },
    {
      // Enrage can start casting before Ruby Weapon has finished their rotation
      // Give a friendly reminder to pop LB3 if you haven't already
      id: 'RubyEx Optimized Ultima Enrage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Enrage!',
          de: 'Finalangriff!',
          fr: 'Enrage !',
          ja: '時間切れ!',
          cn: '狂暴',
          ko: '전멸기!',
        },
      },
    },
    {
      id: 'RubyEx Raven\'s Image',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Raven\'s Image' }),
      run: (data, matches) => {
        // 112,108 (east)
        // 88,108 (west)
        // TODO: it's impossible to do anything with this now,
        // as there's no actor id in the startsUsing line.  T_T
        data.ravens ??= {};
        if (parseFloat(matches.x) < 100)
          data.ravens.red = matches.id;
        else
          data.ravens.blue = matches.id;
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8A2' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => {
        // data.colors is the color of the add you are attacking (this debuff is red).
        data.colors ??= {};
        data.colors[matches.target] = 'blue';
      },
      outputStrings: {
        text: {
          en: 'Attack Blue (East)',
          de: 'Greife Blau an (Osten)',
          fr: 'Attaquez le bleu (Est)',
          ja: '青色に攻撃 (東)',
          cn: '攻击蓝色(东)',
          ko: '파란색 공격 (오른쪽)',
        },
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8A3' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => {
        // data.colors is the color of the add you are attacking (this debuff is blue).
        data.colors ??= {};
        data.colors[matches.target] = 'red';
      },
      outputStrings: {
        text: {
          en: 'Attack Red (West)',
          de: 'Greife Rot an (Westen)',
          fr: 'Attaquez le rouge (Ouest)',
          ja: '赤色に攻撃 (西)',
          cn: '攻击红色(西)',
          ko: '빨간색 공격 (왼쪽)',
        },
      },
    },
    {
      id: 'RubyEx Meteor Stream',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00E0' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubyEx Ruby Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF' }),
      condition: (data, matches) => {
        if (data.role !== 'healer' && data.role !== 'tank')
          return false;
        const myColor = data.colors?.[data.me];
        if (myColor && myColor === data.colors?.[matches.target])
          return true;
        return data.me === matches.target;
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'RubyEx Raven Death',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '8A3', capture: false }),
      suppressSeconds: 10,
      run: (data) => {
        // This effect persists through death, and is removed off of everybody
        // about two seconds before the 19: defeated log line.
        // TODO: it'd be nice to say to attack the other add, if you knew which one was dead.
        data.ravenDead = true;
      },
    },
    {
      id: 'RubyEx Image Colors',
      type: 'GainsEffect',
      // Blind to Rage: 8A0
      // Blind to Grief: 8A1
      netRegex: NetRegexes.gainsEffect({ effectId: ['8A0', '8A1'] }),
      run: (data, matches) => {
        const isBlue = matches.effectId.toUpperCase() === '8A1';
        data.colorToImageId ??= {};
        data.colorToImageId[isBlue ? 'blue' : 'red'] = matches.targetId;
      },
    },
    {
      id: 'RubyEx Image Chariot Dynamo Collect',
      type: 'StartsUsing',
      // Lunar Dynamo = 4EB0
      // Iron Chariot = 4EB1
      netRegex: NetRegexes.startsUsing({ source: 'Raven\'s Image', id: ['4EB0', '4EB1'] }),
      run: (data, matches) => {
        data.imageIdToAction ??= {};
        data.imageIdToAction[matches.sourceId] = matches.id;
      },
    },
    {
      id: 'RubyEx Image Chariot Dynamo',
      type: 'StartsUsing',
      // Lunar Dynamo = 4EB0
      // Iron Chariot = 4EB1
      netRegex: NetRegexes.startsUsing({ source: 'Raven\'s Image', id: ['4EB0', '4EB1'], capture: false }),
      delaySeconds: 0.1,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          text: {
            en: '${dir} (${suffix})',
            de: '${dir} (${suffix})',
            fr: '${dir} (${suffix})',
            ja: '${dir} (${suffix})',
            cn: '${dir} (${suffix})',
            ko: '${dir} (${suffix})',
          },
          out: Outputs.out,
          in: Outputs.in,
          blueSuffix: {
            en: 'blue',
            de: 'Blau',
            fr: 'Bleu',
            ja: '青',
            cn: '蓝',
            ko: '파랑',
          },
          redSuffix: {
            en: 'red',
            de: 'Rot',
            fr: 'Rouge',
            ja: '赤',
            cn: '红',
            ko: '빨강',
          },
          bothSuffix: {
            en: 'both',
            de: 'Beides',
            fr: 'Les deux',
            ja: '両方',
            cn: '全部',
            ko: '둘 다',
          },
        };

        if (!data.colorToImageId || !data.imageIdToAction)
          return;

        const myColor = data.colors && data.colors[data.me];

        const colorToAction: { [color: string]: string } = {};
        for (const color of ['blue', 'red']) {
          const id = data.colorToImageId[color];
          if (!id)
            continue;
          const action = data.imageIdToAction[id];
          if (!action)
            continue;
          colorToAction[color] = action;
        }

        const numAdds = Object.keys(colorToAction).length;
        let suffix: string;
        let actionId: string | undefined;

        if (numAdds === 2 && colorToAction['blue'] === colorToAction['red']) {
          actionId = colorToAction['blue'];
          suffix = output.bothSuffix!();
        } else if (numAdds === 1) {
          const color = Object.keys(colorToAction)[0];
          if (!color)
            throw new UnreachableCode();
          suffix = color === 'blue' ? output.blueSuffix!() : output.redSuffix!();
          actionId = colorToAction[color];
        } else if (myColor && colorToAction[myColor]) {
          suffix = myColor === 'blue' ? output.blueSuffix!() : output.redSuffix!();
          actionId = colorToAction[myColor];
        } else {
          // Two adds doing different things but somehow you died and don't have a color.
          // Don't call anything out, because it'd be confusing.
          return;
        }

        if (!suffix || !actionId)
          return;

        const isDynamo = actionId === '4EB0';
        const text = isDynamo ? 'alertText' : 'alarmText';
        const actionStr = isDynamo ? output.in!() : output.out!();
        return { [text]: output.text!({ dir: actionStr, suffix: suffix }) };
      },
      run: (data) => delete data.imageIdToAction,
    },
    {
      id: 'RubyEx Change of Heart',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AFC', capture: false }),
      preRun: (data) => {
        data.ravens ??= {};

        const tmp = data.ravens.red;
        data.ravens.red = data.ravens.blue;
        data.ravens.blue = tmp;
      },
      // This gets cast twice (maybe once for each add)?
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        // TODO: it'd be nice to call out which raven was alive?
        if (data.ravenDead)
          return;
        const color = data.colors?.[data.me];
        if (!color)
          return;
        if (color === 'red')
          return output.attackRedEast!();

        return output.attackBlueWest!();
      },
      outputStrings: {
        attackRedEast: {
          en: 'Attack Red (East)',
          de: 'Greife Rot an (Osten)',
          fr: 'Attaquez le rouge (Est)',
          ja: '赤色に攻撃 (東)',
          cn: '攻击红色(东)',
          ko: '빨간색 공격 (오른쪽)',
        },
        attackBlueWest: {
          en: 'Attack Blue (West)',
          de: 'Greife Blau an (Westen)',
          fr: 'Attaquez le bleu (Ouest)',
          ja: '青色に攻撃 (西)',
          cn: '攻击蓝色(西)',
          ko: '파란색 공격 (왼쪽)',
        },
      },
    },
    {
      id: 'RubyEx White Agony Tether',
      type: 'Tether',
      // White Agony is the blue head.
      // This trigger doesn't run for the initial tether because the add
      // spawns with the tether, but will run if somebody dies.
      netRegex: NetRegexes.tether({ source: 'White Agony', id: '0011' }),
      condition: Conditions.targetIsYou(),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          text: {
            en: 'Blue Head (Go East)',
            de: 'Blauer Kopf (Geh nach Osten)',
            fr: 'Tête bleu (Allez à l\'est)',
            ja: '青いヘッド (東へ)',
            cn: '蓝头 (去东边)',
            ko: '파란색 (동쪽)',
          },
        };

        // Use alarm if you have to go to the opposite color of the one you would be attacking.
        const textType = data.colors && data.colors[data.me] === 'blue' ? 'alarmText' : 'alertText';
        return { [textType]: output.text!() };
      },
    },
    {
      id: 'RubyEx White Fury Tether',
      type: 'Tether',
      // White Fury is the red head.
      // This trigger doesn't run for the initial tether because the add
      // spawns with the tether, but will run if somebody dies.
      netRegex: NetRegexes.tether({ source: 'White Fury', id: '0011' }),
      condition: Conditions.targetIsYou(),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          text: {
            en: 'Red Head (Go West)',
            de: 'Roter Kopf (Geh nach Westen)',
            fr: 'Tête rouge (Allez à l\'ouest)',
            ja: '赤いヘッド (西へ)',
            cn: '红头 (去西边)',
            ko: '빨간색 (서쪽)',
          },
        };

        // Use alarm if you have to go to the opposite color of the one you would be attacking.
        const textType = data.colors && data.colors[data.me] === 'red' ? 'alarmText' : 'alertText';
        return { [textType]: output.text!() };
      },
    },
    {
      id: 'RubyEx Negative Aura',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AFE', capture: false }),
      response: Responses.lookAway('alert'),
    },
    {
      id: 'RubyEx Meteor',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00(?:C[A-F]|D0|D1)' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => output.text!({ num: parseInt(matches.id, 16) - parseInt('00CA', 16) + 1 }),
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'RubyEx Screech',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'RubyEx Magitek Meteor Burst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AF0', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Meteor!',
          de: 'Weg vom Meteor!',
          fr: 'Éloignez-vous du météore !',
          ja: 'メテオから離れる',
          cn: '远离陨石',
          ko: '운석에게서 멀어지기',
        },
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      condition: (data) => data.role === 'tank',
      delaySeconds: 11.5,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in Meteor Tankbuster',
          de: 'Stehe im Meteor - Tankbuster',
          fr: 'Tank buster, Restez dans la comète',
          ja: 'タンクバスター、メテオへ',
          cn: '接刀',
          ko: '운석 막기',
        },
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Other',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      condition: (data) => data.role !== 'tank',
      delaySeconds: 13,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Meteor Adds',
          de: 'Besiege die Meteor Adds',
          fr: 'Tuez les comètes',
          ja: 'メテオを処理',
          cn: '击杀陨石',
          ko: '운석 부수기',
        },
      },
    },
    {
      id: 'RubyEx Bradamante',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tanks with laser',
          de: 'Tanks nicht mit dem Laser treffen',
          fr: 'Évitez les tanks avec votre laser',
          ja: 'タンクレーザーを避け',
          cn: '躲开坦克激光',
          ko: '레이저 대상자 - 탱커 피하기',
        },
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Directions',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Comet' }),
      infoText: (_data, matches, output) => {
        // Possible positions:
        // 85.16,100.131 and 115.16,100.131
        // 100.16,85.13102 and 100.16,115.131
        if (parseFloat(matches.y) < 90)
          return output.cometsNorthSouth!();
        else if (parseFloat(matches.x) < 90)
          return output.cometsEastWest!();
      },
      outputStrings: {
        cometsNorthSouth: {
          en: 'Comets N/S',
          de: 'Meteor N/S',
          fr: 'Comètes N/S',
          ja: 'コメット 北/南',
          cn: '彗星 北/南',
          ko: '남/북 운석 낙하',
        },
        cometsEastWest: {
          en: 'Comets E/W',
          de: 'Meteor O/W',
          fr: 'Comètes E/O',
          ja: 'コメット 東/西',
          cn: '彗星 东/西',
          ko: '동/서 운석낙하',
        },
      },
    },
    {
      id: 'RubyEx Outrage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B04', capture: false }),
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Ruby Weapon': 'Rubin-Waffe',
        'Ruby Bit': 'Rubin-Drohne',
        'Raven\'s Image': 'Naels Trugbild',
        'Meteor': 'Meteor',
        'Comet': 'Komet',
        'White Agony': 'Naels Trauer',
        'White Fury': 'Naels Zorn',
      },
      'replaceText': {
        'Undermine': 'Untergraben',
        'Stamp': 'Zerstampfen',
        'Spike Of Flame': 'Flammenstachel',
        'Ruby Sphere': 'Rubin-Sphäre',
        'Ruby Ray': 'Rubin-Strahl',
        'Ruby Dynamics': 'Rubin-Dynamo',
        'Ravensflight': 'Flug des Raben',
        'Ravensclaw': 'Rabenklauen',
        'Optimized Ultima': 'Ultima-System',
        'Magitek Ray': 'Magitek-Laser',
        'Magitek Charge': 'Magitek-Sprengladung',
        'Magitek Bit': 'Magitek-Bit',
        'Liquefaction': 'Verflüssigen',
        '(?<! )Homing Lasers': 'Leitlaser',
        'Helicoclaw': 'Spiralklauen',
        'Flexiclaw': 'Flex-Klauen',
        'Bradamante': 'Bradamante',
        'Burst': 'Explosion',
        'Chariot/Dynamo': 'Streitwagen/Dynamo',
        'Dalamud Impact': 'Dalamud-Sturz',
        'Landing': 'Einschlag',
        'Change Of Heart': 'Sinneswandel',
        'Cut And Run': 'Klauensturm',
        'Greater Memory': 'Tiefe Erinnerung',
        'High-Powered Homing Lasers': 'Hochenergie-Leitlaser',
        'Magitek Meteor': 'Magitek-Meteor',
        'Mark II Magitek Comet': 'Magitek-Komet Stufe II',
        'Meteor Mine': 'Meteorsprengung',
        'Meteor Project': 'Projekt Meteor',
        'Meteor Stream': 'Meteorflug',
        'Negative Affect': 'Affectus Negativa',
        'Negative Aura': 'Aura Negativa',
        'Negative Personae': 'Persona Negativa',
        'Outrage': 'Empörung',
        'Ruby Claw': 'Rubin-Klauen',
        'Screech': 'Kreischen',
        'Tank Comets': 'Tank Meteore',
        '--cutscene--': '--Zwischensequenz--',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Comet': 'Comète',
        'Meteor': 'Météore',
        'Ruby Bit': 'Drones rubis',
        'Raven\'s Image': 'Spectre De Nael',
        'The Ruby Weapon': 'Arme Rubis',
        'White Agony': 'Angoisse De Nael',
        'White Fury': 'Fureur De Nael',
      },
      'replaceText': {
        '\\?': ' ?',
        '--cutscene--': '--cinématique--',
        'Undermine': 'Griffe souterraine',
        'Tank Comets': 'Comètes Tank',
        'Stamp': 'Piétinement sévère',
        'Spike Of Flame': 'Explosion de feu',
        'Screech': 'Éclat de voix',
        'Ruby Sphere': 'Sphère rubis',
        'Ruby Ray': 'Rayon rubis',
        'Ruby Dynamics': 'Générateur rubis',
        'Ruby Claw': 'Griffe rubis',
        'Ravensflight': 'Vol du rapace',
        'Ravensclaw': 'Griffes du rapace',
        'Outrage': 'Indignation',
        'Optimized Ultima': 'Ultima magitek',
        'Negative Personae': 'Ipséité négative',
        'Negative Aura': 'Aura négative',
        'Negative Affect': 'Affect négatif',
        'Meteor Stream': 'Rayon météore',
        'Meteor Project': 'Projet Météore',
        'Meteor Mine': 'Météore explosif',
        'Mark II Magitek Comet': 'Comète magitek II',
        'Magitek Ray': 'Laser magitek',
        'Magitek Meteor': 'Météore magitek',
        'Magitek Charge': 'Éthéroplasma magitek',
        'Magitek Bit': 'Éjection de drones',
        'Landing': 'Atterrissage rapide',
        'Liquefaction': 'Sables mouvants',
        '(?<! )Homing Lasers': 'Lasers autoguidés',
        'High-Powered Homing Lasers': 'Lasers autoguidés surpuissants',
        'Helicoclaw': 'Héliogriffes',
        'Greater Memory': 'Expansion mémorielle',
        'Flexiclaw': 'Flexigriffes',
        'Dalamud Impact': 'Impact de Dalamud',
        'Cut And Run': 'Ruée de griffes',
        'Chariot/Dynamo': 'Char/Dynamo',
        'Change Of Heart': 'Changement émotionnel',
        'Burst': 'Explosion',
        'Bradamante': 'Bradamante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Comet': 'コメット',
        'Meteor': 'メテオ',
        'Ruby Bit': 'ルビービット',
        'Raven\'s Image': 'ネールの幻影',
        'The Ruby Weapon': 'ルビーウェポン',
        'White Agony': 'ネールの悲嘆',
        'White Fury': 'ネールの憤怒',
      },
      'replaceText': {
        '\\?': ' ?',
        '--cutscene--': '--カットシン--',
        'Undermine': 'クローマイン',
        'Tank Comets': 'タンクコメット',
        'Stamp': 'ストンピング',
        'Spike of Flame': '爆炎',
        'Screech': '叫声',
        'Ruby Sphere': 'ルビースフィア',
        'Ruby Ray': 'ルビーレイ',
        'Ruby Dynamics': 'ルビーダイナモ',
        'Ruby Claw': 'ルビークロー',
        'Ravensflight': 'レイヴェンダイブ',
        'Ravensclaw': 'レイヴェンクロー',
        'Outrage': 'アウトレイジ',
        'Optimized Ultima': '魔導アルテマ',
        'Negative Personae': 'ネガティブペルソナ',
        'Negative Aura': 'ネガティブオーラ',
        'Negative Affect': 'ネガティブアフェクト',
        'Meteor Stream': 'メテオストリーム',
        'Meteor Project': 'メテオ計劃',
        'Meteor Mine': 'メテオマイン',
        'Mark II Magitek Comet': '魔導コメットII',
        'Magitek Ray': '魔導レーザー',
        'Magitek Meteor': '魔導メテオ',
        'Magitek Charge': '魔導爆雷',
        'Magitek Bit': 'ビット射出',
        'Landing': '落着',
        'Liquefaction': 'リクェファクション',
        '(?<! )Homing Lasers': '誘導レーザー',
        'High-powered Homing Lasers': '高出力誘導レーザー',
        'Helicoclaw': 'スパイラルクロー',
        'Greater Memory': '記憶増幅',
        'Flexiclaw': 'フレキシブルクロー',
        'Dalamud Impact': 'ダラガブインパクト',
        'Cut and Run': 'クロースラッシュ',
        'Chariot/Dynamo': 'チャリオット/ダイナモ',
        'Change Of Heart': '感情変化',
        'Burst': '大爆発',
        'Bradamante': 'ブラダマンテ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Ruby Weapon': '红宝石神兵',
        'Ruby Bit': '红宝石浮游炮',
        'Raven\'s Image': '奈尔的幻影',
        'Meteor': '陨石',
        'Comet': '彗星',
        'White Agony': '奈尔的悲叹',
        'White Fury': '奈尔的愤怒',
      },
      'replaceText': {
        '--cutscene--': '--过场动画--',
        'Optimized Ultima': '魔导究极',
        'Magitek Bit': '浮游炮射出',
        'Flexiclaw': '潜地爪',
        'Magitek Ray': '魔导射线',
        'Helicoclaw': '螺旋爪',
        'Spike Of Flame': '爆炎柱',
        'Stamp': '重踏',
        'Ruby Sphere': '红宝石能量球',
        'Ravensclaw': '凶鸟爪',
        'Undermine': '掘地雷',
        'Ruby Ray': '红宝石射线',
        'Liquefaction': '地面液化',
        'Ravensflight': '凶鸟冲',
        'Ruby Dynamics': '红宝石电圈',
        'High-Powered Homing Lasers': '高功率诱导射线',
        'Cut And Run': '利爪突进',
        '(?<! )Homing Lasers': '诱导射线',
        'Magitek Charge': '魔导炸弹',
        'Meteor Project': '陨石计划',
        'Negative Personae': '消极人格',
        'Meteor Stream': '陨石流',
        'Greater Memory': '记忆增幅',
        'Chariot': '月流电圈',
        'Dynamo': '钢铁战车',
        'Negative Affect': '消极情感',
        'Ruby Claw x5': '红宝石之爪',
        'Change Of Heart': '感情变化',
        'Negative Aura': '消极视线',
        'Dalamud Impact': '卫月冲击',
        'Meteor Mine': '陨石雷',
        'Landing x8': '落地',
        'Screech': '嘶嚎',
        'Burst x8': '爆炸',
        'Magitek Meteor': '魔导陨石',
        'Mark II Magitek Comet': '魔导彗星II',
        'Tank Comets': '坦克彗星',
        'Bradamante': '布拉达曼特',
        'Outrage': '震怒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Ruby Weapon': '루비 웨폰',
        'Ruby Bit': '루비 비트',
        'Raven\'s Image': '넬의 환영',
        'Meteor': '메테오',
        'Comet': '혜성',
        'White Agony': '넬의 비탄',
        'White Fury': '넬의 분노',
      },
      'replaceText': {
        '--cutscene--': '--컷신--',
        'Optimized Ultima': '마도 알테마',
        'Magitek Bit': '비트 사출',
        'Flexiclaw': '가변 발톱',
        'Magitek Ray': '마도 레이저',
        'Helicoclaw': '나선 발톱',
        'Spike Of Flame': '폭염',
        'Stamp': '발구름',
        'Ruby Sphere': '루비 구체',
        'Ravensclaw': '흉조 발톱',
        'Undermine': '발톱 지뢰',
        'Ruby Ray': '루비 광선',
        'Liquefaction': '융해',
        'Ravensflight': '흉조 돌진',
        'Ruby Dynamics': '루비의 원동력',
        'High-Powered Homing Lasers': '고출력 유도 레이저',
        'Cut And Run': '발톱 휘두르기',
        '(?<! )Homing Lasers': '유도 레이저',
        'Magitek Charge': '마도 폭뢰',
        'Meteor Project': '메테오 계획',
        'Negative Personae': '부정적 페르소나',
        'Meteor Stream': '유성 폭풍',
        'Greater Memory': '기억 증폭',
        'Chariot': '강철 전차',
        'Dynamo': '달의 원동력',
        'Negative Affect': '부정적 작용',
        'Ruby Claw': '루비 발톱',
        'Change Of Heart': '감정 변화',
        'Negative Aura': '부정적 오라',
        'Dalamud Impact': '달라가브 낙하',
        'Meteor Mine': '운석 지뢰',
        'Landing': '경착륙',
        'Screech': '부르짖음',
        'Burst': '폭발',
        'Magitek Meteor': '마도 메테오',
        'Mark II Magitek Comet': '마도 혜성 2',
        'Tank Comets': '탱커 혜성 처리',
        'Bradamante': '브라다만테',
        'Outrage': '격노',
      },
    },
  ],
};

export default triggerSet;

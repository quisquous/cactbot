import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: grand cross "plummet" attacks have locations,
// so it should be possible to tell people where to go.
// This is not true for Mustadio's Maintenance.

export default defineTriggerSet<{
  agriasGhostCleanse?: boolean;
  halidom?: string[];
}>({
  zoneId: ZoneId.TheOrbonneMonastery,
  timelineFile: 'orbonne_monastery.txt',
  timelineTriggers: [
    {
      // I know, I know, there's two warnings for this.
      // But like seriously you've got like at least thirty years,
      // and if you do it wrong it wipes the raid.  So... /shrug??
      id: 'Orbonne Agrias Duskblade',
      regex: /Duskblade/,
      beforeSeconds: 15,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to your pads',
          de: 'Geh auf Dein Feld',
          fr: 'Allez sur votre tour',
          ja: '各サークルに入る',
          cn: '踩塔',
          ko: '장판 밟기',
        },
      },
    },
    {
      id: 'Orbonne Ultima Dominion Tether',
      regex: /Demi-Virgo.*Tether/,
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pick up tether',
          de: 'Verbindung abnehmen',
          fr: 'Prenez le lien',
          ja: '線を取る',
          cn: '坦克接线',
          ko: '선 가져오기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Orbonne Harpy Devitalize',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3778', source: 'Harpy', capture: false }),
      suppressSeconds: 10,
      response: Responses.lookAway(),
    },
    {
      id: 'Orbonne Mustadio Right Handgonne',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '373E', source: 'Mustadio', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Orbonne Mustadio Left Handgonne',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '373F', source: 'Mustadio', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Orbonne Mustadio Last Testament',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3737', source: 'Mustadio', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Point opening at Mustadio',
          de: 'Richte Öffnung auf Mustadio',
          fr: 'Pointez l\'ouverture vers Mustadio',
          ja: '未解析の方角をボスに向ける',
          cn: '脚下光环缺口对准boss',
          ko: '문양이 빈 쪽을 무스타디오쪽으로 향하게 하기',
        },
      },
    },
    {
      id: 'Orbonne Mustadio Arm Shot',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3739', source: 'Mustadio' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Orbonne Mustadio Searchlight',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A4' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Searchlight on YOU',
          de: 'Suchscheinwerfer auf DIR',
          fr: 'Repérage sur VOUS',
          ja: '地雷を外に放置（踏まない）',
          cn: '远离人群放地雷后离开',
          ko: '탐조등 대상자',
        },
      },
    },
    {
      id: 'Orbonne Spread Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Orbonne Agrias Thunder Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3866', source: 'Agrias' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Orbonne Agrias Cleansing Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3854', source: 'Agrias', capture: false }),
      preRun: (data) => data.halidom = [],
      delaySeconds: 50,
      run: (data) => delete data.agriasGhostCleanse,
    },
    {
      id: 'Orbonne Agrias Vacuum',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A5' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.agriasGhostCleanse = true,
    },
    {
      id: 'Orbonne Agrias Consecration',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3850', source: 'Agrias', capture: false }),
      condition: (data) => !data.agriasGhostCleanse,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pick up swords',
          de: 'Schwerter aufnehmen',
          fr: 'Prenez les épées',
          ja: 'ソード（剣）を取る',
          cn: '进入附近的剑标记圈',
          ko: '검 들기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Halidom Inside',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3851', source: 'Halidom' }),
      run: (data, matches) => {
        data.halidom ??= [];
        data.halidom.push(matches.target);
      },
    },
    {
      id: 'Orbonne Agrias Halidom Outside',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3851', source: 'Halidom', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.agriasGhostCleanse || data.halidom?.includes(data.me))
          return;
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Use Swords On Jails',
          de: 'Kristalle mit Schwert zerschlagen',
          fr: 'Utilisez les épées sur les prisons',
          ja: '（コンテンツアクション）剣で魂を討つ',
          cn: '使用额外技能攻击',
          ko: '감옥에 검 사용하기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Hallowed Bolt',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A6' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go To Center',
          de: 'In die Mitte gehen',
          fr: 'Allez au centre',
          ja: '中央に入る',
          cn: '前往中间',
          ko: '중앙으로 이동',
        },
      },
    },
    {
      id: 'Orbonne Agrias Adds Phase',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '385D', source: 'Agrias', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Shield',
          de: 'Schild nehmen',
          fr: 'Prenez un bouclier',
          ja: 'シールド（盾）を取る',
          cn: '进入盾标记圈',
          ko: '방패 들기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Mortal Blow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '385E', source: 'Sword Knight', capture: false }),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use Shield, Face Knights',
          de: 'Schild benutzen, Ritter anschauen',
          fr: 'Utilisez un bouclier, face aux chevaliers',
          ja: '騎士に向けてシールドを使う',
          cn: '面对剑骑使用盾牌',
          ko: '방패 사용하고, 기사 바라보기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Extra Adds',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Emblazoned Shield', capture: false }),
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill shields with sword',
          de: 'Schilde mit Schwert zerstören',
          fr: 'Détruisez les boucliers avec les épées',
          ja: '剣で大盾を破れ',
          cn: '用剑摧毁护盾',
          ko: '방패에 검 사용하기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Judgment Blade',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3857', source: 'Agrias', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use shield, face boss',
          de: 'Schild benutzen, Boss anschauen',
          fr: 'Utilisez un bouclier, face au boss',
          ja: 'ボスに向いてシールドを使う',
          cn: '面对boss使用盾牌',
          ko: '방패 사용하고, 보스 바라보기',
        },
      },
    },
    {
      id: 'Orbonne Agrias Divine Ruination',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3858', source: 'Agrias', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use shield if tethered',
          de: 'Schild benutzen, wenn verbunden',
          fr: 'Utilisez un bouclier si lié',
          ja: '線と繋ったらシールドを使う',
          cn: '被连线使用盾牌',
          ko: '선 연결되면 방패 사용하기',
        },
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Healer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3752', source: 'The Thunder God' }),
      condition: (data) => data.role === 'healer',
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Orbonne Cid Crush Helm Feint',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3752', source: 'The Thunder God', capture: false }),
      condition: (data) => data.CanFeint(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Feint Tank Buster',
          de: 'Tankbuster Zermürben',
          fr: 'Évitez le Tank buster',
          ja: 'タンクバスター（牽制使って）',
          cn: '坦克死刑',
          ko: '성천폭격타 탱버',
        },
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3753', source: 'The Thunder God' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Orbonne Cid Crush Armor Tank',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3758', source: 'The Thunder God', capture: false }),
      condition: (data) => data.role === 'tank',
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Give Tether Away',
          de: 'Verbindung abgeben',
          fr: 'Éloignez-vous et donnez le lien',
          ja: '線を取らない！',
          cn: '获取连线受到一次伤害后转给下一个',
          ko: '선 건네주기',
        },
      },
    },
    {
      id: 'Orbonne Cid Crush Armor',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3759', source: 'The Thunder God' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Give Tether Away',
          de: 'Verbindung abgeben',
          fr: 'Éloignez-vous et donnez le lien',
          ja: '線を次の人と交代',
          cn: '获取连线受到一次伤害后转给下一个',
          ko: '선 맞고, 다음 사람에게 건네주기',
        },
      },
    },
    {
      id: 'Orbonne Cid Crush Accessory',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '375A', source: 'The Thunder God', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Icewolf Adds',
          de: 'Besiege die Eiswolf Adds',
          fr: 'Tuez les Grêlons de glace',
          ja: '氷狼を討つ',
          cn: '速度消灭冰狼',
          ko: '얼음 잡기',
        },
      },
    },
    {
      id: 'Orbonne Cid Cleansing Strike',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3751', source: 'The Thunder God', capture: false }),
      condition: (data) => data.role === 'healer',
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal To Full',
          de: 'Vollheilen',
          fr: 'Soignez complètement',
          ja: '全員のHPを全回復',
          cn: '奶满全队',
          ko: '체력 풀피로',
        },
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Pads',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3761', source: 'The Thunder God', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand on Pads',
          de: 'Auf Felder stellen',
          fr: 'Placez-vous sur les pads',
          ja: '各サークルに入る',
          cn: '踩塔',
          ko: '장판 밟기',
        },
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Bubble',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00AA' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Bubble In Back',
          de: 'Blase hinten ablegen',
          fr: 'Déposez les bulles derrière',
          ja: '後ろに捨てる',
          cn: '将身上圆圈放在圆型区域后方',
          ko: '징 뒤쪽에 깔기',
        },
      },
    },
    {
      id: 'Orbonne Cid Hallowed Bolt',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bolt on YOU',
          de: 'Blitz auf DIR',
          fr: 'Éclair sur VOUS',
          ja: '剣から離れる',
          cn: '离开剑所指的区域',
          ko: '번개찌르기 대상자',
        },
      },
    },
    {
      id: 'Orbonne Cid Crush Weapon',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '005C' }),
      condition: Conditions.targetIsYou(),
      response: Responses.getOut('alarm'),
    },
    {
      id: 'Orbonne Cid Hallowed Bolt Stack',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      suppressSeconds: 10,
      response: Responses.stackMarker(),
    },
    {
      id: 'Orbonne Cid Divine Ruination',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Point Line Outside',
          de: 'Linie nach Außen',
          fr: 'Pointez la ligne vers l\'extérieur',
          ja: '（線形AoE）外周に向かって捨てる',
          cn: '向外远离',
          ko: '성광폭렬파 바깥으로 빼기',
        },
      },
    },
    {
      id: 'Orbonne Cid Holy Sword In',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3750', source: 'The Thunder God', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Orbonne Cid Holy Sword Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '374F', source: 'The Thunder God', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3749', source: 'The Thunder God', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '374A', source: 'The Thunder God', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Orbonne Cid Holy Sword Three 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '374C', source: 'The Thunder God', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // e.g. E / NE / NW platforms
          en: 'Rotate right',
          de: 'Im Uhrzeigersinn ausweichen',
          fr: 'Tournez dans le sens anti-horaire',
          ja: '右へ（反時計回り）',
          cn: '向右移动避开',
          ko: '오른쪽으로 돌기',
        },
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Three 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '374D', source: 'The Thunder God', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // NW / NE / E platforms
          en: 'Rotate left',
          de: 'Schwertern im Uhrzeigersinn ausweichen',
          fr: 'Tournez dans le sens horaire',
          ja: '左へ（時計回り）',
          cn: '向左移动避开',
          ko: '왼쪽으로 돌기',
        },
      },
    },
    {
      id: 'Orbonne Ultima Redemption',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '38AA', source: 'Ultima, The High Seraph' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Orbonne Ultima Dark Cannonade',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0037' }),
      condition: Conditions.targetIsYou(),
      response: Responses.doritoStack(),
    },
    {
      id: 'Orbonne Ultima Eruption',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0066' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Eruption on YOU',
          de: 'Eruption auf DIR',
          fr: 'Éruption sur vous',
          ja: '自分にエラプション',
          cn: '地火喷发',
          ko: '불기둥 대상자',
        },
      },
    },
    {
      id: 'Orbonne Ultima Flare IV',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      response: Responses.getOut('alarm'),
    },
    {
      id: 'Orbonne Ultima Time Eruption',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '38CF', source: 'Demi-Belias', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand on Slow Clock',
          de: 'In der langsamen Uhr stehen',
          fr: 'Placez-vous sur une horloge lente',
          ja: '遅い時計で待機（早い方が爆発したらすぐ安置へ）',
          cn: '站慢速时钟等待快速爆炸后立即离开',
          ko: '느린 시계 위로',
        },
      },
    },
    {
      id: 'Orbonne Ultima Extreme Edge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '38DA', source: 'Demi-Hashmal', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Look for Hashmal dash',
          de: 'Nach Hashmal-Dash ausschau halten',
          fr: 'Repérez Hashmal pour la ruée',
          ja: '十字レーザーを避ける',
          cn: '观察场地三个大十字路径并远离',
          ko: '하쉬말 돌진 확인',
        },
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion Healer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3895', source: 'Ultima, The High Seraph', capture: false }),
      condition: (data) => data.role === 'healer',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal Like Whoa',
          de: 'Heilen was das Zeug hält',
          fr: 'Soignez à mort',
          ja: 'ヒーラー頑張って！',
          cn: '加大治疗',
          ko: '계속 힐 돌리기',
        },
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3895', source: 'Ultima, The High Seraph', capture: false }),
      condition: (data) => data.role !== 'healer',
      // zzz
      delaySeconds: 23.5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Ruination!',
          de: 'Zerstörung vernichten',
          fr: 'Tuez la Marque des déchus',
          ja: '堕天の証を倒す',
          cn: '速度消灭堕天之证',
          ko: '타락의 증거 잡기',
        },
      },
    },
    {
      id: 'Orbonne Ultima Acceleration Bomb',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '430' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      response: Responses.stopEverything(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Agrias': 'Agrias',
        'Aspersory': 'Aspersorium',
        'Dark Crusader': 'Düsterritter',
        'Demi-Belias': 'Demi-Belias',
        'Demi-Famfrit': 'Demi-Famfrit',
        'Demi-Hashmal': 'Demi-Hashmallim',
        'Dominion': 'Dominion',
        'Early Turret': 'alt(?:e|er|es|en) Gefechtsturm',
        'Emblazoned Shield': 'geschmückt(?:e|er|es|en) Schild',
        'Ephemeral Knight': 'vergänglich(?:e|er|es|en) Ritter',
        'Halidom': 'Falsch(?:e|er|es|en) Heiligtum',
        'Harpy': 'Harpyie',
        'I see it now': 'Ich sehe ihn in dir!',
        'Iron Construct': 'Eisenkonstrukt',
        'Mustadio': 'Mustadio',
        'Ramza': 'Ramza',
        'Sword Knight': 'Schwertritter',
        'The Crystalline Gaol': 'Kristallkerker',
        'The Realm of the Machinists': 'Reich der Maschinisten',
        'The Realm of the Templars': 'Reich der Tempelritter',
        'The Realm of the Thunder God': 'Reich des Donnergottes',
        '(?<! )The Thunder God': 'Cidolfus',
        'The lifeless alley': 'Leblosen Pfad',
        'Ultima, the High Seraph': 'Cherub Ultima',
      },
      'replaceText': {
        '--ghost stun--': '--Geist unterbrechen--',
        '--crystal stun--': '--Kristall unterbrechen--',
        'Analysis': 'Analyse',
        'Arm Shot': 'Armschuss',
        'Auralight': 'Aurastrahl',
        'Balance Asunder': 'Bruch des Gleichgewichts',
        'Ballistic Impact': 'Ballistischer Einschlag',
        'Ballistic Missile': 'Ballistische Rakete',
        'Cataclysm': 'Kosmischer Kataklysmus',
        'Cleansing Flame': 'Flamme der Läuterung',
        'Cleansing Strike': 'Säuberungsschlag',
        'Colosseum': 'Kolosseum',
        'Compress': 'Zerdrücken',
        'Consecration': 'Konsekration',
        'Control Tower': 'Turmkontrolle',
        'Crush Accessory': 'Hagelkörner',
        'Crush Armor': 'Helmspalter',
        'Crush Helm': 'Himmelsbombardement',
        'Crush Weapon': 'Jenseitsschrei',
        'Dark Cannonade': 'Dunkler Blitz',
        'Dark Ewer': 'Dunkler Wasserkrug',
        'Dark Rite': 'Dunkler Brauch',
        'Demi-Aquarius': 'Demi-Aquarius',
        'Demi-Aries': 'Demi-Aries',
        'Demi-Leo': 'Demi-Leo',
        'Demi-Virgo Feet': 'Demi-Virgo Füße',
        'Demi-Virgo Line(?!\/)': 'Demi-Virgo Linie',
        'Demi-Virgo Line/Tether': 'Demi-Virgo Linie/Verbindung',
        'Demi-Virgo Tether(?!\/)': 'Demi-Virgo Verbindung',
        'Demi-Virgo Tether/Feet': 'Demi-Virgo Verbindung/Füße',
        'Divine Light': 'Göttliches Licht',
        'Divine Ruination': 'Göttliche Zerstörung',
        'Duskblade': 'Dämmerklinge',
        'Earth Hammer': 'Erdhammer',
        'East/West March': 'Ost-/West-Marsch',
        'Embrace': 'Umschließen',
        'Energy Burst': 'Energiestoß',
        '(?<![\\w| ])Eruption': 'Eruption',
        'Extreme Edge': 'Extremkante',
        'Flare IV': 'Giga-Flare',
        'Grand Cross': 'Supernova',
        'Hallowed Bolt': 'Geheiligter Blitz',
        'Hammerfall': 'Hammerschlag',
        'Heavenly Judgment': 'Urteil des Himmels',
        'Holy IV': 'Giga-Sanctus',
        'Infernal Wave': 'Infernowelle',
        'Judgment Blade': 'Klinge des Urteils',
        'L/R Handgonne': 'L/R Donnerbüchse',
        'Last Testament': 'Letztes Vermächtnis',
        'Leg Shot': 'Beinschuss',
        'Maintenance': 'Wartung',
        'Materialize': 'Trugbild',
        'Mortal Blow': 'Tödlicher Hieb',
        'Noahionto': 'Noahionto',
        'Northswain\'s Strike': 'Schlag des Polarsterns',
        'Ray of Light': 'Lichtstrahl',
        'Redemption': 'Zerstörung',
        'Sanction': 'Sanktion',
        'Satellite Beam': 'Satellit',
        'Searchlight': 'Suchscheinwerfer',
        'Shadowblade': 'Schattenklinge',
        'Shockwave': 'Schockwelle',
        'Stack': 'Sammeln',
        'Sword In/Out': 'Schwert Rein/Raus',
        'Sword L/R': 'Schwert L/R',
        'Sword Out/In': 'Schwert Raus/Rein',
        'Sword Three In A Row': 'Schwertreihenschlag',
        'Thunder Slash': 'Donnerhieb',
        'Time Eruption': 'Zeiteruption',
        'Towerfall': 'Turmsturz',
        'Ultimate Illusion': 'Ultimative Illusion',
        'Marks': 'Markierungen',
        '(?<!Sword )In/Out': 'Rein/Raus',
        '(?<!Sword )Out/In': 'Raus/Rein',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Agrias': 'Agrias',
        'Aspersory': 'aiguière bénie',
        'Dark Crusader': 'conquérant sombre',
        'Demi-Belias': 'Demi-Belias',
        'Demi-Famfrit': 'Demi-Famfrit',
        'Demi-Hashmal': 'Demi-Hashmal',
        'Dominion': 'Dominion',
        'Early Turret': 'tourelle archaïque',
        'Emblazoned Shield': 'pavois miroitant',
        'Ephemeral Knight': 'chevalier évanescent',
        'Halidom': 'faux sanctuaire',
        'Harpy': 'harpie',
        'I see it now': 'À vous, maintenant',
        'Iron Construct': 'bâtisseur de fer',
        'Mustadio': 'Mustadio',
        'Ramza': 'Ramza',
        'Sword Knight': 'chevalier à l\'épée',
        'The Crystalline Gaol': 'la Geôle cristalline',
        'The Realm of the Machinists': 'cloître de l\'ingénieur',
        'The Realm of the Templars': 'cloître de la chevalière sacrée',
        'The Realm of the Thunder God': 'cloître du Dieu de la Foudre',
        '(?<! )The Thunder God': 'Cid le Dieu de la Foudre',
        'The lifeless alley': 'corridors silencieux',
        'Ultima, the High Seraph': 'Ultima la Grande Séraphine',
      },
      'replaceText': {
        '--crystal stun--': '--Étourdissement et Cristaux--',
        '--ghost stun--': '--Étourdissement et Fantômes--',
        'Analysis': 'Analyse',
        'Arm Shot': 'Visée des bras',
        'Auralight': 'Rayon auralithe',
        'Balance Asunder': 'Bouleversement de l\'équilibre',
        'Ballistic Impact': 'Impact de missile',
        'Ballistic Missile': 'Missiles balistiques',
        'Cataclysm': 'Cataclysme cosmique',
        'Cleansing Flame': 'Irradiation divine',
        'Cleansing Strike': 'Impact purifiant',
        'Colosseum': 'Arène des Braves',
        'Compress': 'Écraser',
        'Consecration': 'Joug sanctifié',
        'Control Tower': 'Tour de contrôle',
        'Crush Accessory': 'Grêlons fracassants',
        'Crush Armor': 'Brèche insidieuse',
        'Crush Helm': 'Bombardement céleste',
        'Crush Weapon': 'Cri de l\'au-delà',
        'Dark Cannonade': 'Bombardement ténébreux',
        'Dark Ewer': 'Aiguières ténèbreuses',
        'Dark Rite': 'Cérémonie ténébreuse',
        'Demi-Aquarius': 'Demi-Verseau',
        'Demi-Aries': 'Demi-Bélier',
        'Demi-Leo': 'Demi-Lion',
        'Demi-Virgo Feet': 'Demi-Vierge pieds',
        'Demi-Virgo Line(?!\/)': 'Demi-Vierge ligne',
        'Demi-Virgo Line/Tether': 'Demi-Vierge ligne/lien',
        'Demi-Virgo Tether(?!\/)': 'Demi-Vierge lien',
        'Demi-Virgo Tether/Feet': 'Demi-Vierge lien/pieds',
        'Divine Light': 'Onde de lumière évanescente',
        'Divine Ruination': 'Ire céleste',
        'Duskblade': 'Lame sombre',
        'Earth Hammer': 'Marteau tellurique',
        'East/West March': 'Marche Est/Ouest',
        'Embrace': 'Étreinte',
        'Energy Burst': 'Éruption d\'énergie',
        '(?<![\\w| ])Eruption': 'Éruption',
        'Extreme Edge': 'Taille suprême',
        'Flare IV': 'Giga Brasier',
        'Grand Cross': 'Croix suprême',
        'Hallowed Bolt': 'Éclair sacré',
        'Hammerfall': 'Aplatissoir',
        'Heavenly Judgment': 'Jugement céleste',
        'Holy IV(?! Ground)': 'Giga Miracle',
        'Holy IV Ground': 'Giga Miracle au sol',
        '(?<!\\w)In/Out': 'à l\'intérieur/extérieur',
        'Infernal Wave': 'Onde infernale',
        'Judgment Blade': 'Lame du jugement',
        'Handgonne': 'Mitraillage',
        'Last Testament': 'Dernier testament',
        'Leg Shot': 'Visée des jambes',
        'L/R': 'G/D',
        'Maintenance': 'Maintenance',
        'Marks': 'marques',
        'Materialize': 'Apparition',
        'Mortal Blow': 'Frappe brutale',
        'Noahionto': 'Noahionto',
        'Northswain\'s Strike': 'Frappe de l\'Étoile Polaire',
        '(?<!\\w)Out/In': 'à l\'extérieur/intérieur',
        'Ray of Light': 'Onde de lumière',
        'Redemption': 'Destruction',
        'Sanction': 'Sanction',
        'Satellite Beam': 'Rayon satellite',
        'Searchlight': 'Repérage lumineux',
        'Shadowblade': 'Lame des ténèbres',
        'Shockwave': 'Onde de choc',
        'Stack': 'Packez-vous',
        'Sword(?! Three In A Row)': 'Épée',
        'Sword Three In A Row': '3 coups d\'épée à la suite',
        'Thunder Slash': 'Foudrolle',
        'Time Eruption': 'Éruption à retardement',
        'Towerfall': 'Écroulement',
        'Ultimate Illusion': 'Fantaisie finale',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Agrias': '聖騎士アグリアス',
        'Aspersory': '聖雲の水瓶',
        'Dark Crusader': 'ダーククルセイダー',
        'Demi-Belias': 'デミ・ベリアス',
        'Demi-Famfrit': 'デミ・ファムフリート',
        'Demi-Hashmal': 'デミ・ハシュマリム',
        'Dominion': 'ドミニオン',
        'Early Turret': '古の機工兵器',
        'Emblazoned Shield': '光輝の大盾',
        'Ephemeral Knight': '幻影の騎士',
        'Halidom': '模造聖域',
        'Harpy': 'ハーピー',
        'I see it now': '我ノ力、スベテ解キ放トウゾ……！',
        'Iron Construct': '労働型鉄巨人',
        'Mustadio': '機工士ムスタディオ',
        'Ramza': '勇者ラムザ',
        'Sword Knight': '剣の騎士',
        'The Crystalline Gaol': '水晶の監獄',
        'The Realm of the Machinists': '機工士の領域',
        'The Realm of the Templars': '聖騎士の領域',
        'The Realm of the Thunder God': '雷神の領域',
        '(?<! )The Thunder God': '雷神シド',
        'The lifeless alley': '命なき街路',
        'Ultima, the High Seraph': '聖天使アルテマ',
      },
      'replaceText': {
        '--ghost stun--': 'ゴーストスタン',
        '--crystal stun--': 'クリスタルスタン',
        'Analysis': 'アナライズ',
        'Arm Shot': '腕を狙う',
        'Auralight': '聖石光',
        'Balance Asunder': 'バランスブレイク',
        'Ballistic Impact': 'ミサイル着弾',
        'Ballistic Missile': 'ミサイル発射',
        'Cataclysm': '天変地異',
        'Cleansing Flame': '聖光焼却撃',
        'Cleansing Strike': '乱命割殺打',
        'Colosseum': '剣闘技場',
        'Compress': '圧縮する',
        'Consecration': '聖域束縛式',
        'Control Tower': '統制の塔',
        'Crush Accessory': '咬撃氷狼破',
        'Crush Armor': '強甲破点突き',
        'Crush Helm': '星天爆撃打',
        'Crush Weapon': '冥界恐叫打',
        'Dark Cannonade': '闇の砲撃',
        'Dark Ewer': '暗雲の水瓶',
        'Dark Rite': '闇の儀式',
        'Demi-Aquarius': 'デミ・アクエリアス',
        'Demi-Aries': 'デミ・アリエス',
        'Demi-Leo': 'デミ・レオ',
        'Demi-Virgo Feet': 'デミ・ヴァルゴ（足）',
        'Demi-Virgo Line(?!\/)': 'デミ・ヴァルゴ（直線）',
        'Demi-Virgo Line/Tether': 'デミ・ヴァルゴ（直線/線繋ぐ）',
        'Demi-Virgo Tether(?!\/)': 'デミ・ヴァルゴ（線繋ぐ）',
        'Demi-Virgo Tether/Feet': 'デミ・ヴァルゴ（線繋ぐ/足）',
        'Divine Light': '幻光波',
        'Divine Ruination': '聖光爆裂破',
        'Duskblade': '暗の剣',
        'Earth Hammer': '大地のハンマー',
        'East/West March': '東/西マーチ',
        'Embrace': '抱締',
        'Energy Burst': 'エネルギーバースト',
        '(?<![\\w| ])Eruption': 'エラプション',
        'Extreme Edge': 'ブーストエッジ',
        'Flare IV': 'フレアジャ',
        'Grand Cross': 'グランドクロス',
        'Hallowed Bolt(?! )': '無双稲妻突き',
        'Hallowed Bolt In/Out': '無双稲妻突き (入る/出る)',
        'Hallowed Bolt Marks': '無双稲妻突き (マーク)',
        'Hallowed Bolt Out/In': '無双稲妻突き (出る/入る)',
        'Hammerfall': 'ハンマークラッシュ',
        'Heavenly Judgment': 'ヘヴンリージャッジメント',
        'Holy IV(?! )': 'ホーリジャ',
        'Holy IV Ground': 'ホーリジャ (床)',
        'Infernal Wave': 'インファーナルウェーブ',
        'Judgment Blade': '不動無明剣',
        'L/R Handgonne': '左舷掃射/右舷掃射',
        'Last Testament': 'ファイナルテスタメント',
        'Leg Shot': '足を狙う',
        'Maintenance': 'メンテナンス',
        'Materialize': '幻出',
        'Mortal Blow': '強打',
        'Noahionto': 'ノアヒオント',
        'Northswain\'s Strike': '北斗骨砕打',
        'Ray of Light': '光波',
        'Redemption': '破壊',
        'Sanction': '制裁の刃',
        'Satellite Beam': 'サテライトビーム',
        'Searchlight': 'サーチライト',
        'Shadowblade': '闇の剣',
        'Shockwave': '衝撃波',
        'Stack': '集合',
        'Sword In/Out': '雷神式聖剣技（入る/出る）',
        'Sword L/R': '雷神式聖剣技（左/右）',
        'Sword Out/In': '雷神式聖剣技（出る/入る）',
        'Sword Three In A Row': '雷神式聖剣技（三つの剣）',
        'Thunder Slash': '雷鳴剣',
        'Time Eruption': 'タイムエラプション',
        'Towerfall': '倒壊',
        'Ultimate Illusion': '究極幻想',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Agrias': '圣骑士阿格莉亚丝',
        'Aspersory': '圣云水瓶',
        'Dark Crusader': '黑暗十字军',
        'Demi-Belias': '亚灵贝利亚斯',
        'Demi-Famfrit': '亚灵法姆弗里特',
        'Demi-Hashmal': '亚灵哈修马利姆',
        'Dominion': '主天使',
        'Early Turret': '古代机工兵器',
        'Emblazoned Shield': '光辉的大盾',
        'Ephemeral Knight': '幻影骑士',
        'Halidom': '仿制圣域',
        'Harpy': '哈比鸟',
        'I see it now': '我将释放全部力量……',
        'Iron Construct': '劳动型铁巨人',
        'Mustadio': '机工士姆斯塔迪奥',
        'Ramza': '勇者拉姆萨',
        'Sword Knight': '剑之骑士',
        'The Crystalline Gaol': '水晶监狱',
        'The Realm of the Machinists': '机工士的领域',
        'The Realm of the Templars': '圣骑士的领域',
        'The Realm of the Thunder God': '雷神的领域',
        '(?<! )The Thunder God': '雷神西德',
        'The lifeless alley': '无命街路',
        'Ultima, the High Seraph': '圣天使阿尔蒂玛',
      },
      'replaceText': {
        '--ghost stun--': '幽灵击晕',
        '--crystal stun--': '水晶击晕',
        'Analysis': '分析',
        'Arm Shot': '击腕',
        'Auralight': '圣石光',
        'Balance Asunder': '平衡崩坏',
        'Ballistic Impact': '导弹命中',
        'Ballistic Missile': '导弹发射',
        'Cataclysm': '天崩地裂',
        'Cleansing Flame': '圣光烧却击',
        'Cleansing Strike': '乱命割杀打',
        'Colosseum': '剑斗技场',
        'Compress': '执行压缩',
        'Consecration': '圣域束缚式',
        'Control Tower': '统治之塔',
        'Crush Accessory': '咬击冰狼破',
        'Crush Armor': '强甲破点突',
        'Crush Helm': '星天爆击打',
        'Crush Weapon': '冥界恐叫打',
        'Dark Cannonade': '暗炮击',
        'Dark Ewer': '暗云水瓶',
        'Dark Rite': '暗之仪式',
        'Demi-Aquarius': '亚灵水瓶座',
        'Demi-Aries': '亚灵白羊座',
        'Demi-Leo': '亚灵狮子座',
        'Demi-Virgo Feet': '亚灵室女座 脚',
        'Demi-Virgo Line(?!\/)': '亚灵室女座 直线',
        'Demi-Virgo Line/Tether': '亚灵室女座 直线/连线',
        'Demi-Virgo Tether(?!\/)': '亚灵室女座 连线',
        'Demi-Virgo Tether/Feet': '亚灵室女座 连线/脚',
        'Divine Light': '幻光波',
        'Divine Ruination': '圣光爆裂破',
        'Duskblade': '暗影之剑',
        'Earth Hammer': '大地之锤',
        'East/West March': '东/西进军',
        'Embrace': '抱拥',
        'Energy Burst': '能量爆发',
        '(?<![\\w| ])Eruption': '地火喷发',
        'Extreme Edge': '加速刃',
        'Flare IV': '核轰',
        'Grand Cross': '大十字',
        'Hallowed Bolt': '无双惊电突',
        'Hammerfall': '锤击',
        'Heavenly Judgment': '圣天击灭斩',
        'Holy IV': '极圣',
        'Infernal Wave': '地狱波动',
        'Judgment Blade': '不动无明剑',
        'L/R Handgonne': '左/右舷扫射',
        'Last Testament': '最终圣约',
        'Leg Shot': '击足',
        'Maintenance': '维护',
        'Materialize': '现身',
        'Mortal Blow': '强击',
        'Noahionto': '新烈光',
        'Northswain\'s Strike': '北斗骨碎打',
        'Ray of Light': '光波',
        'Redemption': '破坏',
        'Sanction': '制裁之刃',
        'Satellite Beam': '卫星光束',
        'Searchlight': '探照灯',
        'Shadowblade': '暗黑之剑',
        'Shockwave': '冲击波',
        'Stack': '集合',
        'Sword In/Out': '剑 靠近/远离',
        'Sword L/R': '剑 左/右',
        'Sword Out/In': '剑 远离/靠近',
        'Sword Three In A Row': '一行三剑',
        'Thunder Slash': '雷鸣剑',
        'Time Eruption': '时空地火喷发',
        'Towerfall': '崩塌',
        'Ultimate Illusion': '究极幻想',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Agrias': '성기사 아그리아스',
        'Aspersory': '성운의 물병',
        'Dark Crusader': '암흑 성전사',
        'Demi-Belias': '데미벨리아스',
        'Demi-Famfrit': '데미팜프리트',
        'Demi-Hashmal': '데미하쉬말림',
        'Dominion': '도미니온',
        'Early Turret': '고대 기공병기',
        'Emblazoned Shield': '찬란한 방패',
        'Ephemeral Knight': '환영 기사',
        'Halidom': '모조 성역',
        'Harpy': '하피',
        'I see it now': '물병이여,  곧장 진격하여',
        'Iron Construct': '노동형 철거인',
        'Mustadio': '기공사 무스타디오',
        'Ramza': '용사 람자',
        'Sword Knight': '검의 기사',
        'The Crystalline Gaol': '수정 감옥',
        'The Realm of the Machinists': '기공사의 영역',
        'The Realm of the Templars': '성기사의 영역',
        'The Realm of the Thunder God': '뇌신의 영역',
        '(?<! )The Thunder God': '뇌신 시드',
        'The lifeless alley': '생명 없는 길',
        'Ultima, the High Seraph': '성천사 알테마',
      },
      'replaceText': {
        'Analysis': '분석',
        'Arm Shot': '팔 조준',
        'Auralight': '성석광',
        'Balance Asunder': '미사일 착탄',
        'Ballistic Impact': '충격탄',
        'Ballistic Missile': '미사일 발사',
        'Cataclysm': '천재지변',
        'Cleansing Flame': '성광소각격',
        'Cleansing Strike': '난명할살타',
        'Colosseum': '검투기장',
        'Compress': '압축',
        'Consecration': '성역 속박식',
        'Control Tower': '통제의 탑',
        'Crush Accessory': '교격빙랑파',
        'Crush Armor': '강갑 파점 찌르기',
        'Crush Helm': '성천폭격타',
        'Crush Weapon': '명계공규타',
        'Dark Cannonade': '어둠의 포격',
        'Dark Ewer': '암운의 물병',
        'Dark Rite': '어둠의 의식',
        'Demi-Aquarius': '데미아쿠아리우스',
        'Demi-Aries': '데미아리에스',
        'Demi-Leo': '데미레오',
        'Demi-Virgo Feet': '데미비르고 화살표',
        'Demi-Virgo Line(?!\/)': '데미비르고 직선장판',
        'Demi-Virgo Line/Tether': '데미비르고 직선장판/선연결',
        'Demi-Virgo Tether(?!\/)': '데미비르고 선연결',
        'Demi-Virgo Tether/Feet': '데미비르고 선연결/화살표',
        'Divine Light': '환광파',
        'Divine Ruination': '성광폭렬파',
        'Duskblade': '암흑의 검',
        'Earth Hammer': '대지의 망치',
        'East/West March': '동/서 행진',
        'Embrace': '껴안기',
        'Energy Burst': '에너지 폭발',
        '(?<![\\w| ])Eruption': '용암 분출',
        'Extreme Edge': '돌격하는 칼날',
        'Flare IV': '플레어쟈',
        'Grand Cross': '그랜드크로스',
        'Hallowed Bolt(?! )': '무쌍 번개 찌르기',
        'Hallowed Bolt In/Out': '무쌍 번개 찌르기 (안/밖)',
        'Hallowed Bolt Marks': '무쌍 번개 찌르기 (징)',
        'Hallowed Bolt Out/In': '무쌍 번개 찌르기 (밖/안)',
        'Hammerfall': '망치 강타',
        'Heavenly Judgment': '성스러운 심판',
        'Holy IV(?! Ground)': '홀리쟈',
        'Holy IV Ground': '홀리쟈 장판',
        'Infernal Wave': '지옥의 파동',
        'Judgment Blade': '부동무명검',
        'L/R Handgonne': '좌/우현 소사',
        'Last Testament': '최후의 증명',
        'Leg Shot': '다리 조준',
        'Maintenance': '수리',
        'Materialize': '환출',
        'Mortal Blow': '강타',
        'Noahionto': '노아히온토',
        'Northswain\'s Strike': '북두골쇄타',
        'Ray of Light': '빛살',
        'Redemption': '파괴',
        'Sanction': '제재의 칼날',
        'Satellite Beam': '위성 저격',
        'Searchlight': '탐조등',
        'Shadowblade': '어둠의 검',
        'Shockwave': '충격파',
        'Stack': '모이기',
        'Sword In/Out': '검 안/밖',
        'Sword L/R': '검 좌/우',
        'Sword Out/In': '검 밖/안',
        'Sword Three In A Row': '3연속 검',
        'Thunder Slash': '뇌명검',
        'Time Eruption': '시간의 불기둥',
        'Towerfall': '무너지는 탑',
        'Ultimate Illusion': '궁극의 환상',
        'crystal stun': '크리스탈 스턴',
        'ghost stun': '유령 스턴',
      },
    },
  ],
});

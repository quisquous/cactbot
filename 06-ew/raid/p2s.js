// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Doubled Impact (0103).
const firstHeadmarker = parseInt('0103', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  zoneId: ZoneId.AsphodelosTheSecondCircleSavage,
  timelineFile: 'p2s.txt',
  triggers: [
    {
      id: 'P2S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P2S Murky Depths',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6833', source: 'ヒッポカムポス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6833', source: '鱼尾海马怪', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P2S Doubled Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6832', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6832', source: '鱼尾海马怪' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2S Sewage Deluge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6810', source: 'ヒッポカムポス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6810', source: '鱼尾海马怪', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P2S Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'ヒッポカムポス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: '鱼尾海马怪', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.directions(),
      outputStrings: {
        directions: {
          en: 'Back of head',
          de: 'Zur Rückseite des Kopfes',
          fr: 'Derrière la tête',
          ja: '頭の後ろへ',
          cn: '去头的后面',
          ko: '뒤통수 쪽으로',
        },
      },
    },
    {
      id: 'P2S Winged Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'ヒッポカムポス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: '鱼尾海马怪', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.directions(),
      outputStrings: {
        directions: {
          en: 'Front of head',
          de: 'Zur Vorderseite des Kopfes',
          fr: 'Devant la tête',
          ja: '頭の前へ',
          cn: '去头的前面',
          ko: '바라보는 쪽으로',
        },
      },
    },
    {
      id: 'P2S Ominous Bubbling',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '682B', source: 'ヒッポカムポス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '682B', source: '鱼尾海马怪', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.groups(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'P2S Mark of the Tides Collect',
      type: 'GainsEffect',
      // Status goes out with Predatory Avarice (6827).
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD0' }),
      run: (data, matches) => (data.avarice ?? (data.avarice = [])).push(matches),
    },
    {
      id: 'P2S Mark of the Tides',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD0', capture: false }),
      delaySeconds: (data) => data.avarice?.length === 2 ? 0 : 0.5,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          marks: {
            en: 'Marks: ${player1}, ${player2}',
            de: 'Marker: ${player1}, ${player2}',
            fr: 'Marques sur : ${player1}, ${player2}',
            ja: 'マーカー: ${player1}, ${player2}',
            cn: '标记: ${player1}, ${player2}',
            ko: '징: ${player1}, ${player2}',
          },
          avariceOnYou: {
            en: 'Avarice on YOU',
            de: 'Marker auf DIR',
            fr: 'Marque sur VOUS',
            ja: 'マーカーついた',
            cn: '标记点名',
            ko: '내가 징 대상자',
          },
          unknown: Outputs.unknown,
        };
        if (data.avarice === undefined)
          return;
        const name1 = data.avarice[0] ? data.ShortName(data.avarice[0]?.target) : output.unknown();
        const name2 = data.avarice[1] ? data.ShortName(data.avarice[1]?.target) : output.unknown();
        const markText = output.marks({ player1: name1, player2: name2 });
        const isOnYou = data.avarice.find((m) => m.target === data.me);
        if (isOnYou) {
          return {
            alertText: output.avariceOnYou(),
            infoText: markText,
          };
        }
        return { infoText: markText };
      },
      run: (data) => delete data.avarice,
    },
    {
      id: 'P2S Mark of the Tides Move',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD0' }),
      condition: Conditions.targetIsYou(),
      // 23 second duration, safe to move ~16.7s for first time, ~15s for the second.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      alarmText: (_data, _matches, output) => output.awayFromGroup(),
      outputStrings: {
        awayFromGroup: Outputs.awayFromGroup,
      },
    },
    {
      id: 'P2S Mark of the Depths',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD1' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.stackOnYou(),
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'P2S Channeling Flow',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD2', 'AD3', 'AD4', 'AD5'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const t = parseFloat(matches.duration);
        // Effect durations are 13 seconds (short) and 28 seconds (long)
        if (t < 15)
          return output.arrowFirst();
        return output.spreadFirst();
      },
      outputStrings: {
        arrowFirst: {
          en: 'Arrow First',
          de: 'Pfeil zuerst',
          fr: 'Flèches en premières',
          ja: '突進→散開',
          cn: '先对冲',
          ko: '화살표 돌진 먼저',
        },
        spreadFirst: {
          en: 'Spread First',
          de: 'Verteilen zuerst',
          fr: 'Dispersez-vous en premier',
          ja: '散開→突進',
          cn: '先散开',
          ko: '산개 먼저',
        },
      },
    },
    {
      // Aoe from head outside the arena
      id: 'P2S Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '682E', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '682E', source: '鱼尾海马怪' }),
      alertText: (_data, matches, output) => {
        const xCoord = parseFloat(matches.x);
        if (xCoord > 100)
          return output.w();
        if (xCoord < 100)
          return output.e();
      },
      outputStrings: {
        e: Outputs.east,
        w: Outputs.west,
      },
    },
    {
      // Spread aoe marker on some players, not all
      id: 'P2S Tainted Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6838', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6838', source: '鱼尾海马怪' }),
      condition: (data, matches) => matches.target === data.me,
      response: Responses.spread(),
    },
    {
      id: 'P2S Coherence Flare',
      type: 'Tether',
      // Whoever has tether when cast of 681B ends will be flared
      netRegex: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.tether({ id: '0054', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.tether({ id: '0054', source: '鱼尾海马怪' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      run: (data, matches) => data.flareTarget = matches.target,
      outputStrings: {
        text: {
          en: 'Flare Tether',
          de: 'Flare Verbindung',
          fr: 'Lien Brasier',
          ja: 'フレアの線',
          cn: '核爆连线',
          ko: '플레어 선',
        },
      },
    },
    {
      id: 'P2S Coherence Stack',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '681B', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '681B', source: '鱼尾海马怪' }),
      condition: (data) => data.flareTarget !== data.me,
      // 12 second cast, delay for tether to settle
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.flareLineTank();
        return output.flareLineStack();
      },
      outputStrings: {
        flareLineStack: {
          en: 'Line Stack (behind tank)',
          de: 'Linien-Sammeln (hinter dem Tank)',
          fr: 'Package en ligne (derrière le tank)',
          ja: '直線頭割り（タンクより後ろ）',
          cn: '直线分摊（站坦克后面）',
          ko: '탱커 뒤로 직선 쉐어',
        },
        flareLineTank: {
          en: 'Line Stack (be in front)',
          de: 'Linien-Sammeln (vorne sein)',
          fr: 'Package en ligne (Placez-vous devant)',
          ja: '直線頭割り（みんなの前に）',
          cn: '直线分摊（坦克站前面）',
          ko: '직선 쉐어 맨 앞으로',
        },
      },
    },
    {
      // Raidwide knockback -> dont get knocked into slurry
      id: 'P2S Shockwave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '682F', source: 'ヒッポカムポス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '682F', source: '鱼尾海马怪' }),
      // 7.7 cast time, delay for proper arm's length
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'P2S Kampeos Harma Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: Conditions.targetIsYou(),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          squareAcross: {
            en: '#${num} Square, go across',
            de: '#${num} Viereck, geh gegenüber',
            fr: '#${num} Carré, allez à l\'opposé',
            ja: '四角 #${num}：ボスの対角へ',
            cn: '方块 #${num}: 去Boss斜对角',
            ko: '#${num} 네모, 보스 대각 발판으로',
          },
          // Trying not to confuse with boss/across
          squareBoss: {
            en: '#${num} Square, boss tile',
            de: '#${num} Viereck, Boss Fläche',
            fr: '#${num} Carré, case du boss',
            ja: '四角 #${num}：ボスの下へ',
            cn: '方块 #${num}: 去Boss后面',
            ko: '#${num} 네모, 보스 발판으로',
          },
          triangle: {
            en: '#${num} Triangle',
            de: '#${num} Dreieck',
            fr: '#${num} Triangle',
            ja: '三角 #${num}',
            cn: '三角 #${num}',
            ko: '#${num} 세모',
          },
        };
        const id = getHeadmarkerId(data, matches);
        if (!id)
          return;
        const harmaMarkers = [
          '0091',
          '0092',
          '0093',
          '0094',
          '0095',
          '0096',
          '0097',
          '0098',
        ];
        if (!harmaMarkers.includes(id))
          return;
        let num = parseInt(id);
        const isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;
        // 1/3 have to run to the other side, so make this louder.
        const isOdd = num % 2;
        if (isTriangle)
          return { ['infoText']: output.triangle({ num: num }) };
        else if (isOdd)
          return { ['alarmText']: output.squareAcross({ num: num }) };
        return { ['alertText']: output.squareBoss({ num: num }) };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Spoken Cataract/Winged Cataract': 'Spoken/Winged Cataract',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Hippokampos': 'Hippokampos',
      },
      'replaceText': {
        '\\(knockback\\)': '(Rückstoß)',
        '\\(short\\)': '(Kurz)',
        '\\(long\\)': '(Lang)',
        'Channeling Flow': 'Kanalschnellen',
        'Channeling Overflow': 'Kanalfluten',
        'Coherence(?! [FL])': 'Kohärenz',
        'Coherence Flare': 'Kohärenz Flare',
        'Coherence Line': 'Kohärenz Linie',
        'Crash': 'Impakt',
        'Deadly Current': 'Tödliche Strömung',
        'Dissociation(?! Dive)': 'Dissoziation',
        'Dissociation Dive': 'Dissoziation Sturzflug',
        'Doubled Impact': 'Doppeleinschlag',
        'Great Typhoon': 'Große Welle',
        'Hard Water': 'Reißendes Wasser',
        'Kampeos Harma': 'Kampeos Harma',
        'Murky Depths': 'Trübe Tiefen',
        'Ominous Bubbling(?! Groups)': 'Kopfwasser',
        'Ominous Bubbling Groups': 'Kopfwasser Gruppen',
        'Predatory Avarice': 'Massenmal',
        'Predatory Sight': 'Mal der Beute',
        'Sewage Deluge': 'Abwasserflut',
        'Sewage Eruption': 'Abwassereruption',
        'Shockwave': 'Schockwelle',
        'Spoken Cataract': 'Gehauchter Katarakt',
        'Tainted Flood': 'Verseuchte Flut',
        'Winged Cataract': 'Beschwingter Katarakt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hippokampos': 'hippokampos',
      },
      'replaceText': {
        '\\(long\\)': '(long)',
        '\\(knockback\\)': '(poussée)',
        '\\(short\\)': '(court)',
        'Channeling Flow': 'Courant canalisant',
        'Channeling Overflow': 'Déversement canalisant',
        'Coherence(?! [FL])': 'Cohérence',
        'Coherence Flare': 'Cohérence Brasier',
        'Coherence Line': 'Cohérence en ligne',
        'Crash': 'Collision',
        'Deadly Current': 'Torrent mortel',
        'Dissociation(?! Dive)': 'Dissociation',
        'Dissociation Dive': 'Dissociation et plongeon',
        'Doubled Impact': 'Double impact',
        'Great Typhoon': 'Flots tumultueux',
        'Hard Water': 'Oppression aqueuse',
        'Kampeos Harma': 'Kampeos harma',
        'Murky Depths': 'Tréfonds troubles',
        'Ominous Bubbling(?! Groups)': 'Hydro-agression',
        'Ominous Bubbling Groups': 'Hydro-agression en groupes',
        'Predatory Avarice': 'Double marque',
        'Predatory Sight': 'Marque de la proie',
        'Sewage Deluge': 'Déluge d\'eaux usées',
        'Sewage Eruption': 'Éruption d\'eaux usées',
        'Shockwave': 'Onde de choc',
        'Spoken Cataract/Winged Cataract': 'Souffle/Aile et cataracte',
        'Tainted Flood': 'Inondation infâme',
        'Winged Cataract/Spoken Cataract': 'Aile/Souffle et cataracte',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'ヒッポカムポス',
      },
      'replaceText': {
        'Channeling Flow': 'チャネリングフロウ',
        'Channeling Overflow': 'チャネリングオーバーフロウ',
        'Coherence(?! [FL])': 'コヒーレンス',
        'Crash': '衝突',
        'Deadly Current': '激流衝',
        'Dissociation': 'ディソシエーション',
        'Doubled Impact': 'ダブルインパクト',
        'Great Typhoon': '荒波',
        'Hard Water': '重水塊',
        'Kampeos Harma': 'カンペオスハルマ',
        'Murky Depths': 'マーキーディープ',
        'Ominous Bubbling': '霊水弾',
        'Predatory Avarice': '多重刻印',
        'Predatory Sight': '生餌の刻印',
        'Sewage Deluge': 'スウェッジデリージュ',
        'Sewage Eruption': 'スウェッジエラプション',
        'Shockwave': 'ショックウェーブ',
        'Spoken Cataract': 'ブレス＆カタラクティス',
        'Tainted Flood': 'テインテッドフラッド',
        'Winged Cataract': 'ウィング＆カタラクティス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hippokampos': '鱼尾海马怪',
      },
      'replaceText': {
        '\\(knockback\\)': '(击退)',
        '\\(short\\)': '(短)',
        '\\(long\\)': '(长)',
        'Channeling Flow': '沟流充溢',
        'Channeling Overflow': '沟流溢出',
        'Coherence(?! [FL])': '连贯攻击',
        'Coherence Flare': '连贯攻击 (核爆)',
        'Coherence Line': '连贯攻击 (分摊)',
        'Crash': '冲撞',
        'Deadly Current': '激流冲',
        'Dissociation(?! Dive)': '分离',
        'Dissociation Dive': '分离 (冲锋)',
        'Doubled Impact': '双重冲击',
        'Great Typhoon': '荒波',
        'Hard Water': '重水块',
        'Kampeos Harma': '海怪战车',
        'Murky Depths': '深度污浊',
        'Ominous Bubbling(?! Groups)': '灵水弹',
        'Ominous Bubbling Groups': '灵水弹 (分组)',
        'Predatory Avarice': '多重刻印',
        'Predatory Sight': '活饵的刻印',
        'Sewage Deluge': '污水泛滥',
        'Sewage Eruption': '污水喷发',
        'Shockwave': '震荡波',
        'Spoken Cataract': '吐息飞瀑',
        'Tainted Flood': '污染洪水',
        'Winged Cataract': '展翅飞瀑',
      },
    },
  ],
});

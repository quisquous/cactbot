import { FullLocaleText } from '../types/trigger';

// Output strings for now require a field for every language, so this is a
// helper function to generate one for literal numbers.
const numberToOutputString = function(n: number): FullLocaleText {
  const str = n.toString();
  return {
    en: str,
    de: str,
    fr: str,
    ja: str,
    cn: str,
    ko: str,
  };
};

// General guidelines:
// * property names should closely match English text
// * use OnPlayer suffix for things with `${player}`
// * use OnTarget suffix for things with `${name}`
// * any other parameters (of which there are none, currently) should use consistent suffixes.
// * the value of each property should be a single object with localized keys
export default {
  aoe: {
    en: 'aoe',
    de: 'AoE',
    fr: 'AoE',
    ja: 'AoE',
    cn: 'AoE',
    ko: '전체 공격',
  },
  bigAoe: {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '大ダメージAoE',
    cn: '大AoE伤害！',
    ko: '강한 전체 공격!',
  },
  tankBuster: {
    en: 'Tank Buster',
    de: 'Tank buster',
    fr: 'Tank buster',
    ja: 'タンクバスター',
    cn: '坦克死刑',
    ko: '탱버',
  },
  miniBuster: {
    en: 'Mini Buster',
    de: 'Kleiner Tankbuster',
    fr: 'Mini Buster',
    ja: 'ミニバスター',
    cn: '小死刑',
    ko: '약한 탱버',
  },
  tankBusterOnPlayer: {
    en: 'Tank Buster on ${player}',
    de: 'Tank buster auf ${player}',
    fr: 'Tank buster sur ${player}',
    ja: '${player}にタンクバスター',
    cn: '死刑 点 ${player}',
    ko: '"${player}" 탱버',
  },
  tankBusterOnYou: {
    en: 'Tank Buster on YOU',
    de: 'Tank buster auf DIR',
    fr: 'Tank buster sur VOUS',
    ja: '自分にタンクバスター',
    cn: '死刑点名',
    ko: '탱버 대상자',
  },
  // when there are multiple tankbusters going out
  tankBusters: {
    en: 'Tank Busters',
    de: 'Tank buster',
    fr: 'Tank busters',
    ja: 'タンクバスター',
    cn: '坦克死刑',
    ko: '탱버',
  },
  tankCleave: {
    en: 'Tank cleave',
    de: 'Tank Cleave',
    fr: 'Tank cleave',
    ja: '前方範囲攻撃',
    cn: '顺劈',
    ko: '광역 탱버',
  },
  avoidTankCleave: {
    en: 'Avoid tank cleave',
    de: 'Tank Cleave ausweichen',
    fr: 'Évitez le tank cleave',
    ja: '前方範囲攻撃を避ける',
    cn: '远离顺劈',
    ko: '광역 탱버 피하기',
  },
  tankCleaveOnYou: {
    en: 'Tank cleave on YOU',
    de: 'Tank Cleave aud DIR',
    fr: 'Tank cleave sur VOUS',
    ja: '自分に前方範囲攻撃',
    cn: '顺劈点名',
    ko: '나에게 광역 탱버',
  },
  tankSwap: {
    en: 'Tank Swap!',
    de: 'Tankwechsel!',
    fr: 'Tank swap !',
    ja: 'タンクスイッチ!',
    cn: '换T！',
    ko: '탱 교대',
  },
  spread: {
    en: 'Spread',
    de: 'Verteilen',
    fr: 'Dispersez-vous',
    ja: '散開',
    cn: '分散',
    ko: '산개',
  },
  stackMarker: {
    // for stack marker situations
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '頭割り',
    cn: '分摊',
    ko: '쉐어뎀',
  },
  getTogether: {
    // for getting together without stack marker
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '集合',
    cn: '集合',
    ko: '쉐어뎀',
  },
  stackOnYou: {
    en: 'Stack on YOU',
    de: 'Auf DIR sammeln',
    fr: 'Package sur VOUS',
    ja: '自分に集合',
    cn: '集合点名',
    ko: '쉐어징 대상자',
  },
  stackOnPlayer: {
    en: 'Stack on ${player}',
    de: 'Auf ${player} sammeln',
    fr: 'Packez-vous sur ${player}',
    ja: '${player}に集合',
    cn: '靠近 ${player}集合',
    ko: '"${player}" 쉐어징',
  },
  stackMiddle: {
    en: 'Stack in middle',
    de: 'In der Mitte sammeln',
    fr: 'Packez-vous au milieu',
    ja: '中央で集合',
    cn: '中间集合',
    ko: '중앙에서 모이기',
  },
  doritoStack: {
    en: 'Dorito Stack',
    de: 'Mit Marker sammeln',
    fr: 'Packez les marquages',
    ja: 'マーカー付けた人と集合',
    cn: '点名集合',
    ko: '징끼리 모이기',
  },
  spreadThenStack: {
    en: 'Spread => Stack',
    de: 'Verteilen => Sammeln',
    fr: 'Dispersion => Package',
    ja: '散開 => 集合',
    cn: '分散 => 集合',
    ko: '산개 => 집합',
  },
  stackThenSpread: {
    en: 'Stack => Spread',
    de: 'Sammeln => Verteilen',
    fr: 'Package => Dispersion',
    ja: 'スタック => 散開',
    cn: '集合 => 分散',
    ko: '집합 => 산개',
  },
  knockback: {
    en: 'Knockback',
    de: 'Rückstoß',
    fr: 'Poussée',
    ja: 'ノックバック',
    cn: '击退',
    ko: '넉백',
  },
  knockbackOnYou: {
    en: 'Knockback on YOU',
    de: 'Rückstoß auf DIR',
    fr: 'Poussée sur VOUS',
    ja: '自分にノックバック',
    cn: '击退点名',
    ko: '넉백징 대상자',
  },
  knockbackOnPlayer: {
    en: 'Knockback on ${player}',
    de: 'Rückstoß auf ${player}',
    fr: 'Poussée sur ${player}',
    ja: '${player}にノックバック',
    cn: '击退点名${player}',
    ko: '"${player}" 넉백징',
  },
  lookTowardsBoss: {
    en: 'Look Towards Boss',
    de: 'Anschauen Boss',
    fr: 'Regardez le boss',
    ja: 'ボスを見る',
    cn: '面向Boss',
    ko: '쳐다보기',
  },
  lookAway: {
    en: 'Look Away',
    de: 'Wegschauen',
    fr: 'Regardez ailleurs',
    ja: 'ボスを見ない',
    cn: '背对Boss',
    ko: '뒤돌기',
  },
  lookAwayFromPlayer: {
    en: 'Look Away from ${player}',
    de: 'Schau weg von ${player}',
    fr: 'Ne regardez pas ${player}',
    ja: '${player}を見ない',
    cn: '背对${player}',
    ko: '${player}에게서 뒤돌기',
  },
  lookAwayFromTarget: {
    en: 'Look Away from ${name}',
    de: 'Schau weg von ${name}',
    fr: 'Ne regardez pas ${name}',
    ja: '${name}を見ない',
    cn: '背对${name}',
    ko: '${name}에게서 뒤돌기',
  },
  getBehind: {
    en: 'Get Behind',
    de: 'Hinter ihn',
    fr: 'Passez derrière',
    ja: '背面へ',
    cn: '去背后',
    ko: '보스 뒤로',
  },
  goFrontOrSides: {
    en: 'Go Front / Sides',
    de: 'Gehe nach Vorne/ zu den Seiten',
    fr: 'Allez Devant / Côtés',
    ja: '前／横へ',
    cn: '去前侧方',
    ko: '보스 후방 피하기',
  },
  goFront: {
    en: 'Go Front',
    de: 'Geh nach vorn',
    fr: 'Allez Devant',
    ja: '前へ',
    cn: '去前面',
    ko: '앞으로',
  },
  // getUnder is used when you have to get into the bosses hitbox
  getUnder: {
    en: 'Get Under',
    de: 'Unter ihn',
    fr: 'En dessous',
    ja: 'ボスに貼り付く',
    cn: '去脚下',
    ko: '보스 아래로',
  },
  // in is more like "get close but maybe even melee range is fine"
  in: {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  },
  // out means get far away
  out: {
    en: 'Out',
    de: 'Raus',
    fr: 'Exterieur',
    ja: '外へ',
    cn: '远离',
    ko: '밖으로',
  },
  outOfMelee: {
    en: 'Out of melee',
    de: 'Raus aus Nahkampf',
    fr: 'Sortez de la mêlée',
    ja: '近接最大レンジ',
    cn: '近战最远距离回避',
    ko: '근접범위 밖으로',
  },
  inThenOut: {
    en: 'In, then out',
    de: 'Rein, dann raus',
    fr: 'Intérieur, puis extérieur',
    ja: '中 => 外',
    cn: '先靠近，再远离',
    ko: '안으로 => 밖으로',
  },
  outThenIn: {
    en: 'Out, then in',
    de: 'Raus, dann rein',
    fr: 'Extérieur, puis intérieur',
    ja: '外 => 中',
    cn: '先远离，再靠近',
    ko: '밖으로 => 안으로',
  },
  backThenFront: {
    en: 'Back Then Front',
    de: 'Nach Hinten, danach nach Vorne',
    fr: 'Derrière puis devant',
    ja: '後ろ => 前',
    cn: '后 => 前',
    ko: '뒤로 => 앞으로',
  },
  frontThenBack: {
    en: 'Front Then Back',
    de: 'Nach Vorne, danach nach Hinten',
    fr: 'Devant puis derrière',
    ja: '前 => 後ろ',
    cn: '前 => 后',
    ko: '앞으로 => 뒤로',
  },
  goIntoMiddle: {
    en: 'go into middle',
    de: 'in die Mitte gehen',
    fr: 'Allez au milieu',
    ja: '中へ',
    cn: '去中间',
    ko: '중앙으로',
  },
  right: {
    en: 'Right',
    de: 'Rechts',
    fr: 'À droite ',
    ja: '右へ',
    cn: '右',
    ko: '오른쪽',
  },
  left: {
    en: 'Left',
    de: 'Links',
    fr: 'À gauche',
    ja: '左へ',
    cn: '左',
    ko: '왼쪽',
  },
  getLeftAndWest: {
    en: '<= Get Left/West',
    de: '<= Nach Links/Westen',
    fr: '<= Allez à Gauche/Ouest',
    ja: '<= 左/西へ',
    cn: '<= 去左/西边',
    ko: '<= 왼쪽으로',
  },
  getRightAndEast: {
    en: 'Get Right/East =>',
    de: 'Nach Rechts/Osten =>',
    fr: 'Allez à Droite/Est =>',
    ja: '右/東へ =>',
    cn: '去右/东边 =>',
    ko: '오른쪽으로 =>',
  },
  goFrontBack: {
    en: 'Go Front/Back',
    de: 'Geh nach Vorne/Hinten',
    fr: 'Allez Devant/Derrière',
    ja: '縦へ',
    cn: '去前后',
    ko: '앞/뒤로',
  },
  sides: {
    en: 'Sides',
    de: 'Seiten',
    fr: 'Côtés',
    ja: '横へ',
    cn: '去侧面',
    ko: '양옆으로',
  },
  middle: {
    en: 'Middle',
    de: 'Mitte',
    fr: 'Milieu',
    ja: '中へ',
    cn: '中间',
    ko: '중앙',
  },
  // killAdds is used for adds that will always be available
  killAdds: {
    en: 'Kill adds',
    de: 'Adds besiegen',
    fr: 'Tuez les adds',
    ja: '雑魚を処理',
    cn: '击杀小怪',
    ko: '쫄 잡기',
  },
  // killExtraAdd is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: {
    en: 'Kill Extra Add',
    de: 'Add besiegen',
    fr: 'Tuez l\'add',
    ja: '雑魚を倒す',
    cn: '击杀小怪',
    ko: '쫄 잡기',
  },
  awayFromFront: {
    en: 'Away From Front',
    de: 'Weg von Vorne',
    fr: 'Éloignez-vous du devant',
    ja: '前方から離れる',
    cn: '远离正面',
    ko: '보스 전방 피하기',
  },
  sleepTarget: {
    en: 'Sleep ${name}',
    de: 'Schlaf auf ${name}',
    fr: 'Sommeil sur ${name}',
    ja: '${name} にスリプル',
    cn: '催眠 ${name}',
    ko: '${name} 슬리플',
  },
  stunTarget: {
    en: 'Stun ${name}',
    de: 'Betäubung auf ${name}',
    fr: 'Étourdissez ${name}',
    ja: '${name} にスタン',
    cn: '眩晕 ${name}',
    ko: '${name}기절',
  },
  interruptTarget: {
    en: 'interrupt ${name}',
    de: 'unterbreche ${name}',
    fr: 'Interrompez ${name}',
    ja: '${name} に沈黙',
    cn: '打断${name}',
    ko: '${name}기술 시전 끊기',
  },
  preyOnYou: {
    en: 'Prey on YOU',
    de: 'Marker auf DIR',
    fr: 'Marquage sur VOUS',
    ja: '自分に捕食',
    cn: '掠食点名',
    ko: '홍옥징 대상자',
  },
  preyOnPlayer: {
    en: 'Prey on ${player}',
    de: 'Marker auf ${player}',
    fr: 'Marquage sur ${player}',
    ja: '${player}に捕食',
    cn: '掠食点名${player}',
    ko: '"${player}" 홍옥징',
  },
  awayFromGroup: {
    en: 'Away from Group',
    de: 'Weg von der Gruppe',
    fr: 'Éloignez-vous du groupe',
    ja: '外へ',
    cn: '远离人群',
    ko: '다른 사람들이랑 떨어지기',
  },
  awayFromPlayer: {
    en: 'Away from ${player}',
    de: 'Weg von ${player}',
    fr: 'Éloignez-vous de ${player}',
    ja: '${player}から離れる',
    cn: '远离${player}',
    ko: '"${player}"에서 멀어지기',
  },
  meteorOnYou: {
    en: 'Meteor on YOU',
    de: 'Meteor auf DIR',
    fr: 'Météore sur VOUS',
    ja: '自分にメテオ',
    cn: '陨石点名',
    ko: '나에게 메테오징',
  },
  stopMoving: {
    en: 'Stop Moving!',
    de: 'Bewegung stoppen!',
    fr: 'Ne bougez pas !',
    ja: '移動禁止！',
    cn: '停止移动！',
    ko: '이동 멈추기!',
  },
  stopEverything: {
    en: 'Stop Everything!',
    de: 'Stoppe Alles!',
    fr: 'Arrêtez TOUT !',
    ja: '行動禁止！',
    cn: '停止行动！',
    ko: '행동 멈추기!',
  },
  moveAway: {
    // move away to dodge aoes
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '避けて！',
    cn: '快躲开！',
    ko: '이동하기!',
  },
  moveAround: {
    // move around (e.g. jumping) to avoid being frozen
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '動く！',
    cn: '快动！',
    ko: '움직이기!',
  },
  breakChains: {
    en: 'Break chains',
    de: 'Kette zerbrechen',
    fr: 'Brisez les chaines',
    ja: '線を切る',
    cn: '切断连线',
    ko: '선 끊기',
  },
  moveChainsTogether: {
    en: 'Move chains together',
    de: 'Ketten zusammen bewegen',
    fr: 'Bougez les chaines ensemble',
    ja: '線同士一緒に移動',
    cn: '连线一起移动',
    ko: '선 붙어서 같이 움직이기',
  },
  earthshakerOnYou: {
    en: 'Earth Shaker on YOU',
    de: 'Erdstoß auf DIR',
    fr: 'Marque de terre sur VOUS',
    ja: '自分にアースシェイカー',
    cn: '大地摇动点名',
    ko: '어스징 대상자',
  },
  wakeUp: {
    en: 'WAKE UP',
    de: 'AUFWACHEN',
    fr: 'RÉVEILLES-TOI',
    ja: '目を覚まして！',
    cn: '醒醒！动一动！！',
    ko: '강제 퇴장 7분 전',
  },
  closeTethersWithPlayer: {
    en: 'Close Tethers (${player})',
    de: 'Nahe Verbindungen (${player})',
    fr: 'Liens proches avec (${player})',
    ja: '(${player})に近づく',
    cn: '靠近连线 (${player})',
    ko: '상대와 가까이 붙기 (${player})',
  },
  farTethersWithPlayer: {
    en: 'Far Tethers (${player})',
    de: 'Entfernte Verbindungen (${player})',
    fr: 'Liens éloignés avec (${player})',
    ja: ' (${player})から離れる',
    cn: '远离连线 (${player})',
    ko: '상대와 떨어지기 (${player})',
  },
  unknownTarget: {
    en: '???',
    de: '???',
    fr: '???',
    ja: '???',
    cn: '???',
    ko: '???',
  },
  north: {
    en: 'North',
    de: 'Norden',
    fr: 'Nord',
    ja: '北',
    cn: '上(北)',
    ko: '북쪽',
  },
  south: {
    en: 'South',
    de: 'Süden',
    fr: 'Sud',
    ja: '南',
    cn: '下(南)',
    ko: '남쪽',
  },
  east: {
    en: 'East',
    de: 'Osten',
    fr: 'Est',
    ja: '東',
    cn: '右(东)',
    ko: '동쪽',
  },
  west: {
    en: 'West',
    de: 'Westen',
    fr: 'Ouest',
    ja: '西',
    cn: '左(西)',
    ko: '서쪽',
  },
  northwest: {
    en: 'Northwest',
    de: 'Nordwesten',
    fr: 'nord-ouest',
    ja: '北西',
    cn: '左上(西北)',
    ko: '북서',
  },
  northeast: {
    en: 'Northeast',
    de: 'Nordosten',
    fr: 'nord-est',
    ja: '北東',
    cn: '右上(东北)',
    ko: '북동',
  },
  southwest: {
    en: 'Southwest',
    de: 'Südwesten',
    fr: 'sud-ouest',
    ja: '南西',
    cn: '左下(西南)',
    ko: '남서',
  },
  southeast: {
    en: 'Southeast',
    de: 'Südosten',
    fr: 'sud-est',
    ja: '南東',
    cn: '右下(东南)',
    ko: '남동',
  },
  dirN: {
    en: 'N',
    de: 'N',
    fr: 'N',
    ja: '北',
    cn: '上(北)',
    ko: '북쪽',
  },
  dirS: {
    en: 'S',
    de: 'S',
    fr: 'S',
    ja: '南',
    cn: '下(南)',
    ko: '남쪽',
  },
  dirE: {
    en: 'E',
    de: 'O',
    fr: 'E',
    ja: '東',
    cn: '右(东)',
    ko: '동쪽',
  },
  dirW: {
    en: 'W',
    de: 'W',
    fr: 'O',
    ja: '西',
    cn: '左(西)',
    ko: '서쪽',
  },
  dirNW: {
    en: 'NW',
    de: 'NW',
    fr: 'NO',
    ja: '北西',
    cn: '左上(西北)',
    ko: '북서',
  },
  dirNE: {
    en: 'NE',
    de: 'NO',
    fr: 'NE',
    ja: '北東',
    cn: '右上(东北)',
    ko: '북동',
  },
  dirSW: {
    en: 'SW',
    de: 'SW',
    fr: 'SO',
    ja: '南西',
    cn: '左下(西南)',
    ko: '남서',
  },
  dirSE: {
    en: 'SE',
    de: 'SO',
    fr: 'SE',
    ja: '南東',
    cn: '右下(东南)',
    ko: '남동',
  },
  // Literal numbers.
  num0: numberToOutputString(0),
  num1: numberToOutputString(1),
  num2: numberToOutputString(2),
  num3: numberToOutputString(3),
  num4: numberToOutputString(4),
  num5: numberToOutputString(5),
  num6: numberToOutputString(6),
  num7: numberToOutputString(7),
  num8: numberToOutputString(8),
  num9: numberToOutputString(9),
} as const;


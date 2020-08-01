'use strict';

[{
  zoneRegex: {
    en: /^The Weeping City Of Mhach$/,
  },
  zoneId: ZoneId.TheWeepingCityOfMhach,
  timelineFile: 'weeping_city.txt',
  timelineTriggers: [
    {
      id: 'Weeping City Dark Spike',
      regex: /Dark Spike/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Weeping City Widow\'s Kiss',
      regex: /The Widow's Kiss/,
      beforeSeconds: 5,
      // Probably kills the player if failed, so it gets an alert.
      alertText: {
        en: 'Stand on webs',
        de: 'Auf den Spinnennetzen stehen',
      },
    },
    {
      id: 'Weeping City Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 10,
      infoText: {
        en: 'Get Puddles',
        de: 'Flächen nehmen',
        fr: 'Allez dans les zones au sol',
        ja: '踏む',
        cn: '踩圈',
        ko: '바닥 징 밟기',
      },
    },
    {
      id: 'Weeping City Bloodied Nail',
      regex: /Bloodied Nail/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 10,
      response: Responses.tankBuster(),
    },
    {
      id: 'Weeping City Split End',
      regex: /Split End/,
      beforeSeconds: 4,
      suppressSeconds: 10,
      response: Responses.tankCleave(),
    },
    {
      id: 'Weeping City Aura Burst',
      regex: /Aura Burst/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      // 2 of the 4 encounters in Weeping City use the 0017 head marker.
      // 2 of the 4 use the 003E head marker.
      // Because of this, we restrict those triggers for each boss to activate
      // only when that boss is in progress.
      id: 'Weeping City HeadMarker Arachne',
      netRegex: NetRegexes.message({ line: '.*Queen\'s Room will be sealed off.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: '.*Spinnenfalle will be sealed off.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: '.*Domaine de la Tisseuse will be sealed off.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '.*蜘蛛女の狩場 will be sealed off.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '.*女王蛛猎场 will be sealed off.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '.*거미 여왕의 사냥터 will be sealed off.*?', capture: false }),
      run: function(data) {
        data.arachneStarted = true;
      },
    },
    {
      id: 'Weeping City HeadMarker Ozma',
      netRegex: NetRegexes.message({ line: '.*Gloriole will be sealed off.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: '.*金字塔上层 will be sealed off.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: '.*Aureole will be sealed off.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '.*Hauteurs de la pyramide will be sealed off.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '.*ピラミッド上部層 will be sealed off.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '.*피라미드 상층부 will be sealed off.*?', capture: false }),
      run: function(data) {
        data.arachneStarted = false;
        data.ozmaStarted = true;
      },
    },
    {
      id: 'Weeping City HeadMarker Calofisteri',
      netRegex: NetRegexes.message({ line: '.*Tomb Of The Nullstone will be sealed off.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: '.*Kammer des Nullsteins will be sealed off.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: '.*Tombeau de la Clef de voûte will be sealed off.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '.*要の玄室 will be sealed off.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '.*契约石玄室 will be sealed off.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '.*쐐기 안치소 will be sealed off.*?', capture: false }),
      run: function(data) {
        data.ozmaStarted = false;
        data.calStarted = true;
      },
    },
    {
      id: 'Weeping City Sticky Wicket',
      netRegex: NetRegexes.headMarker({ id: '003C', capture: false }),
      suppressSeconds: 10,
      response: Responses.spread(),
    },
    {
      id: 'Weeping City Shadow Burst',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: function(data) {
        return data.arachneStarted;
      },
      response: Responses.stackOn(),
    },
    {
      id: 'Weeping City Frond Affeared',
      netRegex: NetRegexes.startsUsing({ id: '183A', source: 'Arachne Eve', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '183A', source: 'Arachne (?:der|die|das) Ahnin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '183A', source: 'Arachné Mère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '183A', source: 'アルケニー', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '183A', source: '아라크네', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '183A', source: '阿剌克涅', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Weeping City Arachne Web',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.arachneStarted && data.me == matches.target;
      },
      infoText: {
        en: 'Drop Web Outside',
        de: 'Spinnennetz draußen ablegen',
      },
    },
    {
      id: 'Weeping City Brand Of The Fallen',
      netRegex: NetRegexes.headMarker({ id: '0037' }),
      condition: Conditions.targetIsYou(),
      response: Responses.doritoStack(),
    },
    {
      id: 'Weeping City Dark Eruption',
      netRegex: NetRegexes.headMarker({ id: '0019' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Puddles on YOU',
        de: 'Pfützen auf DIR',
        fr: 'Mare sur VOUS',
        ja: '自分に床範囲',
        cn: '点名',
        ko: '장판 바깥에 깔기',
      },
    },
    {
      id: 'Weeping City Beguiling Mist',
      netRegex: NetRegexes.startsUsing({ id: '17CE', source: 'Summoned Succubus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '17CE', source: 'Beschworen(?:e|er|es|en) Sukkubus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '17CE', source: 'Succube Adjuré' }),
      netRegexJa: NetRegexes.startsUsing({ id: '17CE', source: 'サモン・サキュバス' }),
      netRegexKo: NetRegexes.startsUsing({ id: '17CE', source: '소환된 서큐버스' }),
      netRegexCn: NetRegexes.startsUsing({ id: '17CE', source: '被召唤出的梦魔' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'Weeping City Mortal Ray',
      netRegex: NetRegexes.startsUsing({ id: '17D4', source: 'Summoned Haagenti', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '17D4', source: 'Beschworen(?:e|er|es|en) Haagenti', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '17D4', source: 'Haagenti Adjuré', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '17D4', source: 'サモン・ハーゲンティ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '17D4', source: '소환된 하겐티', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '17D4', source: '被召唤出的哈加提', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Weeping City Hell Wind',
      netRegex: NetRegexes.startsUsing({ id: '17CB', source: 'Forgall', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '17CB', source: 'Forgall', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '17CB', source: 'Forgall', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '17CB', source: 'フォルガル', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '17CB', source: '포르갈', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '17CB', source: '弗加尔', capture: false }),
      // Hell Wind sets HP to single digits, so mitigations don't work. Don't notify non-healers.
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Weeping City Mega Death',
      netRegex: NetRegexes.startsUsing({ id: '17CA', source: 'Forgall', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '17CA', source: 'Forgall', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '17CA', source: 'Forgall', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '17CA', source: 'フォルガル', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '17CA', source: '포르갈', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '17CA', source: '弗加尔', capture: false }),
      alertText: {
        en: 'Stand in one puddle',
        de: 'In einer Fläche stehen',
      },
    },
    {
      id: 'Weeping City Meteor Impact',
      netRegex: NetRegexes.headMarker({ id: '0039' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Drop meteor back or left',
        de: 'Meteor hinten oder links ablegen',
      },
    },
    {
      // The ability used here is Ozma entering Pyramid form.
      // Execration follows this up almost immediately.
      id: 'Weeping City Execration',
      netRegex: NetRegexes.ability({ id: '1826', source: 'Ozma', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1826', source: 'Yadis', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1826', source: 'Ozma', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1826', source: 'オズマ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1826', source: '오즈마', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1826', source: '奥兹玛', capture: false }),
      alertText: {
        en: 'Get off rectangle platform',
        de: 'Von der plattform runter gehen',
      },
    },
    {
      // The ability used here is Ozma entering Cube form.
      // Flare Star and tank lasers follow shortly.
      id: 'Weeping City Flare Star Ring',
      netRegex: NetRegexes.ability({ id: '1803', source: 'Ozma', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1803', source: 'Yadis', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1803', source: 'Ozma', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1803', source: 'オズマ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1803', source: '오즈마', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1803', source: '奥兹玛', capture: false }),
      response: Responses.getIn(),
    },
    {
      // The ability used here is Ozma entering Cube form. The actual laser ability, 1831,
      // is literally named "attack". Ozma zaps the 3 highest-threat targets. (Not always tanks!)
      // This continues until the next Sphere form, whether by time or by HP push.
      id: 'Weeping City Tank Lasers',
      netRegex: NetRegexes.ability({ id: '1803', source: 'Ozma', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1803', source: 'Yadis', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1803', source: 'Ozma', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1803', source: 'オズマ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1803', source: '오즈마', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1803', source: '奥兹玛', capture: false }),
      // Delaying here to avoid colliding with other Flare Star triggers.
      delaySeconds: 4,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank lasers--Avoid party',
            de: 'Tank lasers--Weg von der Party',
          };
        }
        return {
          en: 'Avoid tanks',
          de: 'Weg von den Tanks',
        };
      },
    },
    {
      // The NPC name is Ozmasphere. These need to be popped just like any other Flare Star.
      // Failing to pop an orb means it will explode, dealing damage with 1808 Aethernova.
      id: 'Weeping City Flare Star Orbs',
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: '4889', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'Get orbs',
        de: 'Kugeln nehmen',
      },
    },
    {
      id: 'Weeping City Acceleration Bomb',
      netRegex: NetRegexes.gainsEffect({ effectId: '430' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      response: Responses.stopEverything(),
    },
    {
      id: 'Weeping City Assimilation',
      netRegex: NetRegexes.startsUsing({ id: '1802', source: 'Ozmashade', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1802', source: 'Yadis-Schatten', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1802', source: 'Ombre D\'Ozma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1802', source: 'オズマの影', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1802', source: '오즈마의 그림자', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1802', source: '奥兹玛之影', capture: false }),
      response: Responses.lookAway(),
    },
    {
      // Each party gets a stack marker, so this is the best we can do.
      id: 'Weeping City Meteor Stack',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      condition: function(data) {
        return data.ozmaStarted;
      },
      suppressSeconds: 5,
      response: Responses.stack(),
    },
    {
      // Coif Change is always followed up shortly by Haircut.
      // There's no castbar or indicator except that she grows a scythe on one side.
      // It's not a very obvious visual cue unless the player knows to look for it.
      id: 'Weeping City Coif Change Left',
      netRegex: NetRegexes.ability({ id: '180A', source: 'Calofisteri', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '180A', source: 'Calofisteri', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '180A', source: 'Calofisteri', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '180A', source: 'カロフィステリ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '180A', source: '칼로피스테리', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '180A', source: '卡洛菲斯提莉', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Weeping City Coif Change Right',
      netRegex: NetRegexes.ability({ id: '180E', source: 'Calofisteri', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '180E', source: 'Calofisteri', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '180E', source: 'Calofisteri', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '180E', source: 'カロフィステリ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '180E', source: '칼로피스테리', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '180E', source: '卡洛菲斯提莉', capture: false }),
      response: Responses.goLeft(),
    },
    {
      // 4899 is the base ID for bulb hair. 4900 is axe hair.
      // Bulbs do a circle AoE surrounding them, while axes are a donut.
      id: 'Weeping City Living Lock Axes',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: ['4899', '4900'], capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Close to axes, avoid bulbs',
        de: 'Nahe den Äxten, vermeide Knospen',
      },
    },
    {
      id: 'Weeping City Living Lock Scythes',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '4898', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Avoid scythe line AoEs',
        de: 'Weiche den Sensen AOEs aus',
      },
    },
    {
      // These adds are the purple circles waiting to grab people and Garrotte them.
      id: 'Weeping City Entanglement',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '4904', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid purple circles',
        de: 'Vermeide die lilanen Flächen',
      },
    },
    {
      // If by some chance someone actually did stand in the purple circles, break them out.
      // The actual ability here is an Unknown ability, but it begins slightly before Garrotte.
      id: 'Weeping City Garrotte',
      netRegex: NetRegexes.ability({ id: '181D', source: 'Entanglement', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '181D', source: 'Verfilzung', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '181D', source: 'Emmêlement', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '181D', source: '魔髪の縛め', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '181D', source: '머리카락 포박', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '181D', source: '魔发束缚', capture: false }),
      suppressSeconds: 5,
      response: Responses.killExtraAdd(),
    },
    {
      id: 'Weeping City Particle Beam',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data) {
        return data.calStarted;
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: '16x Sky Laser on YOU!',
            de: '16x Himmelslaser auf DIR!',
          };
        }
        return {
          en: 'Avoid Sky Lasers',
          de: 'Himmelslaser ausweichen',
        };
      },
    },
    {
      // The actual ability here is Mana Drain, which ends the intermission.
      // Dancing Mad follows this up closely enough to make this the best time to notify.
      id: 'Weeping City Dancing Mad',
      netRegex: NetRegexes.ability({ id: '1819', source: 'Calofisteri', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1819', source: 'Calofisteri', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1819', source: 'Calofisteri', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1819', source: 'カロフィステリ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1819', source: '칼로피스테리', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1819', source: '卡洛菲斯提莉', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Weeping City Penetration',
      netRegex: NetRegexes.startsUsing({ id: '1822', source: 'Calofisteri', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1822', source: 'Calofisteri', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1822', source: 'Calofisteri', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1822', source: 'カロフィステリ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1822', source: '칼로피스테리', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1822', source: '卡洛菲斯提莉', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Weeping City Depth Charge',
      netRegex: NetRegexes.startsUsing({ id: '1820', source: 'Calofisteri', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1820', source: 'Calofisteri', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1820', source: 'Calofisteri', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1820', source: 'カロフィステリ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1820', source: '칼로피스테리', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1820', source: '卡洛菲斯提莉', capture: false }),
      response: Responses.awayFromFront(),
    },
  ],
}];

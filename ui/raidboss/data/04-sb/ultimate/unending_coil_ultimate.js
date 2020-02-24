'use strict';

// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: {
    en: /^The Unending Coil Of Bahamut \(Ultimate\)$/,
    cn: /^巴哈姆特绝境战$/,
    ko: /^절 바하무트 토벌전$/,
  },
  timelineFile: 'unending_coil_ultimate.txt',
  triggers: [
    // --- State ---
    {
      id: 'UCU Firescorched Gain',
      regex: Regexes.gainsEffect({ effect: 'Firescorched' }),
      regexDe: Regexes.gainsEffect({ effect: 'Feuerhorn' }),
      regexFr: Regexes.gainsEffect({ effect: 'Corne-De-Feu' }),
      regexJa: Regexes.gainsEffect({ effect: 'ファイアホーン' }),
      regexCn: Regexes.gainsEffect({ effect: '火角' }),
      regexKo: Regexes.gainsEffect({ effect: '화염뿔' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.fireDebuff = true;
      },
    },
    {
      id: 'UCU Firescorched Lose',
      regex: Regexes.losesEffect({ effect: 'Firescorched' }),
      regexDe: Regexes.losesEffect({ effect: 'Feuerhorn' }),
      regexFr: Regexes.losesEffect({ effect: 'Corne-De-Feu' }),
      regexJa: Regexes.losesEffect({ effect: 'ファイアホーン' }),
      regexCn: Regexes.losesEffect({ effect: '火角' }),
      regexKo: Regexes.losesEffect({ effect: '화염뿔' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.fireDebuff = false;
      },
    },
    {
      id: 'UCU Icebitten Gain',
      regex: Regexes.gainsEffect({ effect: 'Icebitten' }),
      regexDe: Regexes.gainsEffect({ effect: 'Eisklaue' }),
      regexFr: Regexes.gainsEffect({ effect: 'Griffe-De-Glace' }),
      regexJa: Regexes.gainsEffect({ effect: 'アイスクロウ' }),
      regexCn: Regexes.gainsEffect({ effect: '冰爪' }),
      regexKo: Regexes.gainsEffect({ effect: '얼음발톱' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.iceDebuff = true;
      },
    },
    {
      id: 'UCU Icebitten Lose',
      regex: Regexes.losesEffect({ effect: 'Icebitten' }),
      regexDe: Regexes.losesEffect({ effect: 'Eisklaue' }),
      regexFr: Regexes.losesEffect({ effect: 'Griffe-De-Glace' }),
      regexJa: Regexes.losesEffect({ effect: 'アイスクロウ' }),
      regexCn: Regexes.losesEffect({ effect: '冰爪' }),
      regexKo: Regexes.losesEffect({ effect: '얼음발톱' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.iceDebuff = false;
      },
    },
    {
      id: 'UCU Fireball Counter',
      regex: Regexes.ability({ id: '26C5', source: 'Firehorn' }),
      regexDe: Regexes.ability({ id: '26C5', source: 'Feuerhorn' }),
      regexFr: Regexes.ability({ id: '26C5', source: 'Corne-De-Feu' }),
      regexJa: Regexes.ability({ id: '26C5', source: 'ファイアホーン' }),
      regexCn: Regexes.ability({ id: '26C5', source: '火角' }),
      regexKo: Regexes.ability({ id: '26C5', source: '화염뿔' }),
      run: function(data, matches) {
        data.fireballs[data.naelFireballCount].push(matches.target);
      },
    },
    {
      id: 'UCU Quickmarch Phase',
      regex: Regexes.startsUsing({ id: '26E2', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E2', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E2', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E2', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E2', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E2', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('quickmarch');
      },
    },
    {
      id: 'UCU Blackfire Phase',
      regex: Regexes.startsUsing({ id: '26E3', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E3', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E3', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E3', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E3', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E3', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('blackfire');
      },
    },
    {
      id: 'UCU Fellruin Phase',
      regex: Regexes.startsUsing({ id: '26E4', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E4', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E4', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E4', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E4', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E4', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('fellruin');
      },
    },
    {
      id: 'UCU Heavensfall Phase',
      regex: Regexes.startsUsing({ id: '26E5', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E5', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E5', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E5', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E5', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E5', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('heavensfall');
      },
    },
    {
      id: 'UCU Tenstrike Phase',
      regex: Regexes.startsUsing({ id: '26E6', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E6', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E6', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E6', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E6', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E6', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('tenstrike');
      },
    },
    {
      id: 'UCU Octet Phase',
      regex: Regexes.startsUsing({ id: '26E7', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26E7', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26E7', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26E7', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26E7', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26E7', source: '바하무트 프라임', capture: false }),
      run: function(data) {
        if (data.resetTrio) data.resetTrio('octet');
      },
    },
    {
      id: 'UCU Ragnarok Party Tracker',
      regex: Regexes.ability({ id: '26B8', source: 'Ragnarok' }),
      regexDe: Regexes.ability({ id: '26B8', source: 'Ragnarök' }),
      regexFr: Regexes.ability({ id: '26B8', source: 'Ragnarok' }),
      regexJa: Regexes.ability({ id: '26B8', source: 'ラグナロク' }),
      regexCn: Regexes.ability({ id: '26B8', source: '诸神黄昏' }),
      regexKo: Regexes.ability({ id: '26B8', source: '라그나로크' }),
      run: function(data, matches) {
        // This happens once during the nael transition and again during
        // the heavensfall trio.  This should proooobably hit all 8
        // people by the time you get to octet.
        data.partyList = data.partyList || {};
        data.partyList[matches.target] = true;
      },
    },

    // --- Twintania ---
    {
      id: 'UCU Twisters',
      regex: Regexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26AA', source: 'Gémellia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26AA', source: 'ツインタニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26AA', source: '双塔尼亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26AA', source: '트윈타니아', capture: false }),
      alertText: {
        en: 'Twisters',
        fr: 'Tornades',
        de: 'Wirbelstürme',
        ja: '大竜巻',
        cn: '大龙卷',
        ko: '회오리',
      },
    },
    {
      id: 'UCU Death Sentence',
      regex: Regexes.startsUsing({ id: '26A9', source: 'Twintania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26A9', source: 'Twintania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26A9', source: 'Gémellia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26A9', source: 'ツインタニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26A9', source: '双塔尼亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26A9', source: '트윈타니아', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Death Sentence',
            fr: 'Peine de mort',
            de: 'Todesurteil',
            ja: 'デスセンテンス',
            cn: '死刑',
            ko: '사형 선고',
          };
        }
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            fr: 'Anti-tank',
            de: 'basta',
            ja: 'タンク即死級',
            cn: '死刑',
            ko: '탱버',
          };
        }
      },
    },
    {
      id: 'UCU Hatch Collect',
      regex: Regexes.headMarker({ id: '0076' }),
      run: function(data, matches) {
        data.hatch = data.hatch || [];
        data.hatch.push(matches.target);
      },
    },
    {
      id: 'UCU Hatch Marker YOU',
      regex: Regexes.headMarker({ id: '0076' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Hatch on YOU',
        fr: 'Éclosion sur VOUS',
        de: 'Ausbrüten auf DIR',
        ja: '自分に魔力爆散',
        cn: '点名魔力爆散',
        ko: '나에게 마력연성',
      },
      tts: {
        en: 'hatch',
        fr: 'Éclosion',
        de: 'ausbrüten',
        ja: '魔力爆散',
        cn: '魔力爆散',
        ko: '마력연성',
      },
    },
    {
      id: 'UCU Hatch Callouts',
      regex: Regexes.headMarker({ id: '0076', capture: false }),
      delaySeconds: 0.25,
      infoText: function(data) {
        if (!data.hatch)
          return;
        let hatches = data.hatch.map(function(n) {
          return data.ShortName(n);
        }).join(', ');
        delete data.hatch;
        return {
          en: 'Hatch: ' + hatches,
          fr: 'Éclosion: ' + hatches,
          de: 'Ausbrüten: ' + hatches,
          ja: '魔力爆散' + hatches,
          cn: '魔力爆散' + hatches,
          ko: '마력연성: ' + hatches,
        };
      },
    },
    {
      id: 'UCU Hatch Cleanup',
      regex: Regexes.headMarker({ id: '0076', capture: false }),
      delaySeconds: 5,
      run: function(data) {
        delete data.hatch;
      },
    },
    {
      id: 'UCU Twintania P2',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '75', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '75', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '75', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '75', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '75', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '75', capture: false }),
      sound: 'Long',
      infoText: {
        en: 'Phase 2 Push',
        fr: 'Phase 2 poussée',
        de: 'Phase 2 Stoß',
        ja: 'フェーズ2',
        cn: 'P2准备',
        ko: '트윈 페이즈2',
      },
    },
    {
      id: 'UCU Twintania P3',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '45', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '45', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '45', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '45', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '45', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '45', capture: false }),
      sound: 'Long',
      infoText: {
        en: 'Phase 3 Push',
        fr: 'Phase 3 poussée',
        de: 'Phase 3 Stoß',
        ja: 'フェーズ3',
        cn: 'P3准备',
        ko: '트윈 페이즈3',
      },
    },

    // --- Nael ---
    {
      // https://xivapi.com/NpcYell/6497?pretty=true
      id: 'UCU Nael Quote 1',
      regex: /From on high I descend, the hallowed moon to call/,
      regexDe: /Seht, ich steige herab, vom rotglühenden Monde/,
      regexFr: /Des cieux je vais descendre et révérer la lune/,
      regexJa: /\u6211\u3001\u821e\u3044\u964d\u308a\u3066\s*\u6708\u3092\u4ef0\u304c\u3093\uff01/,
      regexCn: /\u6211\u964d\u4e34\u4e8e\u6b64\uff0c\s*\u5bf9\u6708\u957f\u5578\uff01/,
      regexKo: /흉조가 내려와 달을 올려다보리라!/,
      infoText: {
        en: 'Spread => In',
        fr: 'Se dispercer => Dedans',
        de: 'Verteilen => Rein',
        ja: '散開 => 密着',
        cn: '分散 => 靠近',
        ko: '산개 => 안으로',
      },
      durationSeconds: 6,
    },
    {
      // https://xivapi.com/NpcYell/6496?pretty=true
      id: 'UCU Nael Quote 2',
      regex: /From on high I descend, the iron path to walk/,
      regexDe: /Seht, ich steige herab, um euch zu beherrschen/,
      regexFr: /Du haut des cieux, je vais descendre pour conquérir/,
      regexJa: /\u6211\u3001\u821e\u3044\u964d\u308a\u3066\s*\u9244\u306e\u8987\u9053\u3092\u5f81\u304f\uff01/,
      regexCn: /\u6211\u964d\u4e34\u4e8e\u6b64\uff0c\s*\u5f81\u6218\u94c1\u8840\u9738\u9053\uff01/,
      regexKo: /흉조가 내려와 강철의 패도를 걸으리라!/,
      infoText: {
        en: 'Spread => Out',
        fr: 'Se dispercer => Dehors',
        de: 'Verteilen => Raus',
        ja: '散開 => 離れる',
        cn: '分散 => 远离',
        ko: '산개 => 밖으로',
      },
      durationSeconds: 6,
    },
    {
      // https://xivapi.com/NpcYell/6495?pretty=true
      id: 'UCU Nael Quote 3',
      regex: /Take fire, O hallowed moon/,
      regexDe: /Flammender Pfad, geschaffen vom roten Mond/,
      regexFr: /Baignez dans la bénédiction de la lune incandescente/,
      regexJa: /\u8d64\u71b1\u305b\u3057\s*\u6708\u306e\u795d\u798f\u3092\uff01/,
      regexCn: /\u70bd\u70ed\u71c3\u70e7\uff01\s*\u7ed9\u4e88\u6211\u6708\u4eae\u7684\u795d\u798f\uff01/,
      regexKo: /붉게 타오른 달의 축복을!/,
      infoText: {
        en: 'Stack => In',
        fr: 'Se rassembler => Dedans',
        de: 'Stack => Rein',
        ja: '頭割り => 密着',
        cn: '集合 => 靠近',
        ko: '쉐어 => 안으로',
      },
      durationSeconds: 6,
    },
    {
      // https://xivapi.com/NpcYell/6494?pretty=true
      id: 'UCU Nael Quote 4',
      regex: /Blazing path, lead me to iron rule/,
      regexDe: /Umloderter Pfad, führe mich zur Herrschaft/,
      regexFr: /La voie marquée par l'incandescence mène à la domination/,
      regexJa: /\u8d64\u71b1\u3057\u3001\u713c\u304b\u308c\u3057\u9053\u3092\s*\u9244\u306e\u8987\u9053\u3068\u6210\u3059\uff01/,
      regexCn: /\u88ab\u70bd\u70ed\u707c\u70e7\u8fc7\u7684\u8f68\u8ff9\s*\u4e43\u6210\u94c1\u8840\u9738\u9053\uff01/,
      regexKo: /붉게 타오른 길을 강철의 패도로 만들겠노라!/,
      infoText: {
        en: 'Stack => Out',
        fr: 'Se rassembler => Dehors',
        de: 'Stack => Raus',
        ja: '頭割り => 離れる',
        cn: '集合 => 远离',
        ko: '쉐어 => 밖으로',
      },
    },
    {
      // https://xivapi.com/NpcYell/6493?pretty=true
      id: 'UCU Nael Quote 5',
      regex: /O hallowed moon, take fire and scorch my foes/,
      regexDe: /O roter Mond! Umlodere meinen Pfad/,
      regexFr: /Que l'incandescence de la lune brûle mes ennemis/,
      regexJa: /\u6708\u3088\uff01\s*\u8d64\u71b1\u3057\u3001\u795e\u6575\u3092\u713c\u3051\uff01/,
      regexCn: /\u6708\u5149\u554a\uff01\s*\u7528\u4f60\u7684\u70bd\u70ed\u70e7\u5c3d\u654c\u4eba\uff01/,
      regexKo: /달이여! 붉게 타올라 신의 적을 태워버려라!/,
      infoText: {
        en: 'In => Stack',
        fr: 'Dedans => Se rassembler',
        de: 'Rein => Stack',
        ja: '密着 => 頭割り',
        cn: '靠近 => 集合',
        ko: '안으로 => 쉐어',
      },
    },
    {
      // https://xivapi.com/NpcYell/6492?pretty=true
      id: 'UCU Nael Quote 6',
      regex: /O hallowed moon, shine you the iron path/,
      regexDe: /O roter Mond! Führe mich zur Herrschaft/,
      regexFr: /Ô lune! Éclaire la voie de la domination/,
      regexJa: /\u6708\u3088\uff01\s*\u9244\u306e\u8987\u9053\u3092\u7167\u3089\u305b\uff01/,
      regexCn: /\u6708\u5149\u554a\uff01\s*\u7167\u4eae\u94c1\u8840\u9738\u9053\uff01/,
      regexKo: /달이여! 강철의 패도를 비춰라!/,
      infoText: {
        en: 'In => Out',
        fr: 'Dedans => Dehors',
        de: 'Rein => Raus',
        ja: '密着 => 離れる',
        cn: '靠近 => 远离',
        ko: '안으로 => 밖으로',
      },
    },
    {
      // https://xivapi.com/NpcYell/6501?pretty=true
      id: 'UCU Nael Quote 7',
      regex: /Fleeting light! 'Neath the red moon, scorch you the earth/,
      regexDe: /Neues Gestirn! Glühe herab und umlodere meinen Pfad/,
      regexFr: /Supernova, brille de tout ton feu et irradie la terre rougie/,
      regexJa: /\u8d85\u65b0\u661f\u3088\u3001\u8f1d\u304d\u3092\u5897\u305b\uff01\s*\u7d05\u6708\u4e0b\u306e\u8d64\u71b1\u305b\u3057\u5730\u3092\u7167\u3089\u305b\uff01/,
      regexCn: /\u8d85\u65b0\u661f\u554a\uff0c\u66f4\u52a0\u95ea\u8000\u5427\uff01\s*\u7167\u4eae\u7ea2\u6708\u4e0b\u70bd\u70ed\u4e4b\u5730\uff01/,
      regexKo: /초신성이여, 빛을 더하라! 붉은 달 아래, 붉게 타오르는 땅을 비춰라!/,
      infoText: {
        en: 'Away from Tank => Stack',
        fr: 'S\'éloigner du tank => Se rassembler',
        de: 'Weg vom Tank => Stack',
        ja: 'タンクから離れる => 頭割り',
        cn: '远离坦克 => 集合',
        ko: '탱커 피하기 => 쉐어',
      },
      durationSeconds: 6,
      delaySeconds: 4,
    },
    {
      // https://xivapi.com/NpcYell/6500?pretty=true
      id: 'UCU Nael Quote 8',
      regex: /Fleeting light! Amid a rain of stars, exalt you the red moon/,
      regexDe: /Neues Gestirn! Überstrahle jede Sternschnuppe/,
      regexFr: /Supernova, brille de tout ton feu et glorifie la lune rouge/,
      regexJa: /\u8d85\u65b0\u661f\u3088\u3001\u8f1d\u304d\u3092\u5897\u305b\uff01\s*\u661f\u964d\u308a\u306e\u591c\u306b\u3001\u7d05\u6708\u3092\u79f0\u3048\u3088\uff01/,
      regexCn: /\u8d85\u65b0\u661f\u554a\uff0c\u66f4\u52a0\u95ea\u8000\u5427\uff01\s*\u5728\u661f\u964d\u4e4b\u591c\uff0c\u79f0\u8d5e\u7ea2\u6708\uff01/,
      regexKo: /초신성이여, 빛을 더하라! 유성이 쏟아지는 밤에, 붉은 달을 우러러보라!/,
      infoText: {
        en: 'Spread => Away from Tank',
        fr: 'Se dispercer => S\'éloigner du Tank',
        de: 'Verteilen => Weg vom Tank',
        ja: '散開 => タンクから離れる',
        cn: '分散 => 远离坦克',
        ko: '산개 => 탱커 피하기',
      },
      durationSeconds: 6,
      delaySeconds: 4,
    },
    {
      // https://xivapi.com/NpcYell/6502?pretty=true
      id: 'UCU Nael Quote 9',
      regex: /From on high I descend, the moon and stars to bring/,
      regexDe: /Ich steige herab zu Ehre des roten Mondes! Einer Sternschnuppe gleich/,
      regexFr: /Du haut des cieux, j'appelle une pluie d'étoiles/,
      regexJa: /\u6211\u3001\u821e\u3044\u964d\u308a\u3066\u6708\u3092\u4ef0\u304e\s*\u661f\u964d\u308a\u306e\u591c\u3092\u62db\u304b\u3093\uff01/,
      regexCn: /\u6211\u964d\u4e34\u4e8e\u6b64\u5bf9\u6708\u957f\u5578\uff01\s*\u53ec\u5524\u661f\u964d\u4e4b\u591c\uff01/,
      regexKo: /흉조가 내려와, 달을 올려다보니 유성이 쏟아지는 밤이 도래하리라!/,
      durationSeconds: 9,
      infoText: {
        en: 'Spread => In',
        fr: 'Se dispercer => Dedans',
        de: 'Verteilen => Rein',
        ja: '散開 => 密着',
        cn: '分散 => 靠近',
        ko: '산개 => 안으로',
      },
    },
    {
      // https://xivapi.com/NpcYell/6503?pretty=true
      id: 'UCU Nael Quote 10',
      regex: /From hallowed moon I descend, a rain of stars to bring/,
      regexDe: /O roter Mond, sieh mich herabsteigen! Einer Sternschnuppe gleich/,
      regexFr: /Depuis la lune, j'invoque une pluie d'étoiles/,
      regexJa: /\u6211\u3001\u6708\u3088\u308a\u821e\u3044\u964d\u308a\u3066\s*\u661f\u964d\u308a\u306e\u591c\u3092\u62db\u304b\u3093\uff01/,
      regexCn: /\u6211\u81ea\u6708\u800c\u6765\u964d\u4e34\u4e8e\u6b64\uff0c\s*\u53ec\u5524\u661f\u964d\u4e4b\u591c\uff01/,
      regexKo: /달로부터 흉조가 내려와 유성이 쏟아지는 밤이 도래하리라!/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Spread',
        fr: 'Dedans => Se dispercer',
        de: 'Rein => Verteilen',
        ja: '密着 => 散開',
        cn: '靠近 => 分散',
        ko: '안으로 => 산개',
      },
    },
    {
      // https://xivapi.com/NpcYell/6507?pretty=true
      id: 'UCU Nael Quote 11',
      regex: /From hallowed moon I bare iron, in my descent to wield/,
      regexDe: /O roter Mond, als Künder deiner Herrschaft stieg ich herab/,
      regexFr: /De la lune je m'arme d'acier et descends/,
      regexJa: /\u6211\u3001\u6708\u3088\u308a\u9244\u3092\u5099\u3048\s*\u821e\u3044\u964d\u308a\u3093\uff01/,
      regexCn: /\u6211\u81ea\u6708\u800c\u6765\u643a\u94a2\u94c1\u964d\u4e34\u4e8e\u6b64\uff01/,
      regexKo: /달로부터 강철의 패도를 거쳐 흉조가 내려오리라!/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Out => Spread',
        fr: 'Dedans => Dehors => Se dispercer',
        de: 'Rein => Raus => Verteilen',
        ja: '密着 => 離れる => 散開',
        cn: '靠近 => 远离 => 分散',
        ko: '안으로 => 밖으로 => 산개',
      },
    },
    {
      // https://xivapi.com/NpcYell/6506?pretty=true
      id: 'UCU Nael Quote 12',
      regex: /From hallowed moon I descend, upon burning earth to tread/,
      regexDe: /O roter Mond! Ich stieg herab, um deine Herrschaft zu bringen/,
      regexFr: /De la lune, je descends et marche sur la terre ardente/,
      regexJa: /\u6211\u3001\u6708\u3088\u308a\u821e\u3044\u964d\u308a\u3066\s*\u8d64\u71b1\u305b\u3057\u5730\u3092\u6b69\u307e\u3093\uff01/,
      regexCn: /\u6211\u81ea\u6708\u800c\u6765\u964d\u4e34\u4e8e\u6b64\uff0c\s*\u8e0f\u8fc7\u70bd\u70ed\u4e4b\u5730\uff01/,
      regexKo: /달로부터 흉조가 내려와 붉게 타오르는 땅을 걸으리라!/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Spread => Stack',
        fr: 'Dedans => Se dispercer => Se rassembler',
        de: 'Rein => Verteilen => Stack',
        ja: '密着 => 散開 => 頭割り',
        cn: '靠近 => 分散 => 集合',
        ko: '안으로 => 산개 => 쉐어',
      },
    },
    {
      // https://xivapi.com/NpcYell/6504?pretty=true
      id: 'UCU Nael Quote 13',
      regex: /Unbending iron, take fire and descend/,
      regexDe: /Zur Herrschaft führt mein umloderter Pfad! Auf diesen steige ich herab/,
      regexFr: /Ô noble acier! Rougis ardemment et deviens ma lame transperçante/,
      regexJa: /\u9244\u3088\u3001\u8d64\u71b1\u305b\u3088\uff01\s*\u821e\u3044\u964d\u308a\u3057\u6211\u304c\u5203\u3068\u306a\u308c\uff01/,
      regexCn: /\u94a2\u94c1\u71c3\u70e7\u5427\uff01\s*\u6210\u4e3a\u6211\u964d\u4e34\u4e8e\u6b64\u7684\u5200\u5251\u5427\uff01/,
      regexKo: /강철이여, 붉게 타올라라! 흉조가 내려오니 그 칼날이 되어라!/,
      durationSeconds: 9,
      infoText: {
        en: 'Out => Stack => Spread',
        fr: 'Dehors => Se rassembler => Se dispercer',
        de: 'Raus => Stack => Verteilen',
        ja: '離れる => 頭割り => 散開',
        cn: '远离 => 集合 => 分散',
        ko: '밖으로 => 쉐어 => 산개',
      },
    },
    {
      // https://xivapi.com/NpcYell/6505?pretty=true
      id: 'UCU Nael Quote 14',
      regex: /Unbending iron, descend with fiery edge/,
      regexDe: /Zur Herrschaft steige ich herab, auf umlodertem Pfad/,
      regexFr: /Fier acier! Sois ma lame plongeante et deviens incandescent/,
      regexJa: /\u9244\u3088\u3001\u821e\u3044\u964d\u308a\u3057\s*\u6211\u306e\u5203\u3068\u306a\u308a\u8d64\u71b1\u305b\u3088\uff01/,
      regexCn: /\u94a2\u94c1\u6210\u4e3a\u6211\u964d\u4e34\u4e8e\u6b64\u7684\u71c3\u70e7\u4e4b\u5251\uff01/,
      regexKo: /강철이여, 흉조가 내려오는도다! 그 칼날이 되어 붉게 타올라라!/,
      durationSeconds: 9,
      infoText: {
        en: 'Out => Spread => Stack',
        fr: 'Dehors => Se dispercer => Se rassembler',
        de: 'Raus => Verteilen => Stack',
        ja: '離れる => 散開 => 頭割り',
        cn: '远离 => 分散 => 集合',
        ko: '밖으로 => 산개 => 쉐어',
      },
    },
    {
      id: 'UCU Nael Thunderstruck',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: Regexes.ability({ source: 'Thunderwing', id: '26C7' }),
      regexDe: Regexes.ability({ source: 'Donnerschwinge', id: '26C7' }),
      regexFr: Regexes.ability({ source: 'Aile-De-Foudre', id: '26C7' }),
      regexJa: Regexes.ability({ source: 'サンダーウィング', id: '26C7' }),
      regexCn: Regexes.ability({ source: '雷翼', id: '26C7' }),
      regexKo: Regexes.ability({ source: '번개날개', id: '26C7' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Thunder on YOU',
        fr: 'Foudre sur VOUS',
        de: 'Blitz auf DIR',
        ja: '自分にサンダー',
        cn: '雷点名',
        ko: '나에게 번개',
      },
      tts: {
        en: 'thunder',
        fr: 'Foudre',
        de: 'blitz',
        ja: 'サンダー',
        cn: '雷点名',
        ko: '번개',
      },
    },
    {
      id: 'UCU Nael Your Doom',
      regex: Regexes.gainsEffect({ effect: 'Doom' }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis' }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas' }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告' }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고' }),
      condition: function(data, matches) {
        // FIXME: temporary workaround for "gains the effect for 9999.00"
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223
        if (matches[2] > 1000)
          return false;
        return data.me == matches.target;
      },
      // FIXME: temporary workaround for multiple gains effects messages.
      // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223#issuecomment-513486275
      suppressSeconds: 20,
      durationSeconds: function(data, matches) {
        if (parseFloat(matches.duration) <= 6)
          return 3;

        if (parseFloat(matches.duration) <= 10)
          return 6;

        return 9;
      },
      alarmText: function(data, matches) {
        if (parseFloat(matches.duration) <= 6) {
          return {
            en: 'Doom #1 on YOU',
            fr: 'Glas #1 sur VOUS',
            de: 'Verhängnis #1 auf DIR',
            ja: '自分に一番目死の宣告',
            cn: '死宣一号点名',
            ko: '죽음의 선고 1번',
          };
        }
        if (parseFloat(matches.duration) <= 10) {
          return {
            en: 'Doom #2 on YOU',
            fr: 'Glas #2 sur VOUS',
            de: 'Verhängnis #2 auf DIR',
            ja: '自分に二番目死の宣告',
            cn: '死宣二号点名',
            ko: '죽음의 선고 2번',
          };
        }
        return {
          en: 'Doom #3 on YOU',
          fr: 'Glas #3 sur VOUS',
          de: 'Verhängnis #3 auf DIR',
          ja: '自分に三番目死の宣告',
          cn: '死宣三号点名',
          ko: '죽음의 선고 3번',
        };
      },
      tts: function(data, matches) {
        if (parseFloat(matches.duration) <= 6)
          return '1';

        if (parseFloat(matches.duration) <= 10)
          return '2';

        return '3';
      },
    },
    {
      id: 'UCU Doom Init',
      regex: Regexes.gainsEffect({ effect: 'Doom' }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis' }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas' }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告' }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고' }),
      condition: function(data, matches) {
        // FIXME: temporary workaround for "gains the effect for 9999.00"
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223
        return matches.duration < 1000;
      },
      run: function(data, matches) {
        data.dooms = data.dooms || [null, null, null];
        let order = null;
        if (parseFloat(matches.duration) < 9)
          order = 0;
        else if (parseFloat(matches.duration) < 14)
          order = 1;
        else
          order = 2;

        // FIXME: temporary workaround for multiple gains effects messages.
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223#issuecomment-513486275
        if (order !== null && data.dooms[order] === null)
          data.dooms[order] = matches.target;
      },
    },
    {
      id: 'UCU Doom Cleanup',
      regex: Regexes.gainsEffect({ effect: 'Doom', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고', capture: false }),
      delaySeconds: 20,
      run: function(data) {
        delete data.dooms;
        delete data.doomCount;
      },
    },
    {
      id: 'UCU Nael Cleanse Callout',
      regex: Regexes.ability({ source: 'Fang Of Light', id: '26CA', capture: false }),
      regexDe: Regexes.ability({ source: 'Lichtklaue', id: '26CA', capture: false }),
      regexFr: Regexes.ability({ source: 'Croc De Lumière', id: '26CA', capture: false }),
      regexJa: Regexes.ability({ source: 'ライトファング', id: '26CA', capture: false }),
      regexCn: Regexes.ability({ source: '光牙', id: '26CA', capture: false }),
      regexKo: Regexes.ability({ source: '빛의 송곳니', id: '26CA', capture: false }),
      infoText: function(data) {
        data.doomCount = data.doomCount || 0;
        let name;
        if (data.dooms)
          name = data.dooms[data.doomCount];
        data.doomCount++;
        if (name) {
          return {
            en: 'Cleanse #' + data.doomCount + ': ' + data.ShortName(name),
            fr: 'Purifié #' + data.doomCount + ': ' + data.ShortName(name),
            de: 'Medica #' + data.doomCount + ': ' + data.ShortName(name),
            ja: '解除に番目' + data.doomCount + ': ' + data.ShortName(name),
            cn: '解除死宣 #' + data.doomCount + ': ' + data.ShortName(name),
            ko: '선고 해제 ' + data.doomCount + ': ' + data.ShortName(name),
          };
        }
      },
    },
    {
      id: 'UCU Nael Fireball 1',
      regex: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexDe: Regexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      regexFr: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexJa: Regexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      regexCn: Regexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      regexKo: Regexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      infoText: {
        en: 'Fire IN',
        fr: 'Feu EN DEDANS',
        de: 'Feuer INNEN',
        ja: 'ファイアボールは密着',
        cn: '火进',
        ko: '불 같이맞기',
      },
      tts: {
        en: 'fire in',
        fr: 'Feu en dedans',
        de: 'Feuer innen',
        ja: 'ファイアボール密着',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
    {
      id: 'UCU Nael Fireball 2',
      regex: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexDe: Regexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      regexFr: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexJa: Regexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      regexCn: Regexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      regexKo: Regexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 51,
      suppressSeconds: 99999,
      infoText: function(data) {
        if (data.fireballs[1].indexOf(data.me) >= 0) {
          return {
            en: 'Fire OUT',
            fr: 'Feu EN DEHORS',
            de: 'Feuer AUßEN',
            ja: 'ファイアボールは離れる',
            cn: '火出',
            ko: '불 대상자 밖으로',
          };
        }
      },
      alertText: function(data) {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (data.fireballs[1].indexOf(data.me) == -1) {
          return {
            en: 'Fire OUT: Be in it',
            fr: 'Feu EN DEHORS : Allez dessus',
            de: 'Feuer AUßEN: Drin sein',
            ja: 'ファイアボールは離れる: 自分に密着',
            cn: '火出，踩火',
            ko: '불 대상자 밖으로: 나는 같이 맞기',
          };
        }
      },
      tts: function(data) {
        if (data.fireballs[1].indexOf(data.me) == -1) {
          return {
            en: 'fire out; go with',
            fr: 'Feu en dehors; y allez',
            de: 'feuer außen; mitgehen',
            ja: 'ファイアボール離れる: 自分に密着',
            cn: '火出，分摊',
            ko: '밖에서 불 같이 맞기',
          };
        }
        return {
          en: 'fire out',
          fr: 'Feu en dehors',
          de: 'feuer außen',
          ja: 'ファイアボール離れる',
          cn: '火出',
          ko: '불 대상자 밖으로',
        };
      },

      run: function(data) {
        data.naelFireballCount = 2;
      },
    },
    {
      id: 'UCU Nael Fireball 3',
      regex: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexDe: Regexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      regexFr: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexJa: Regexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      regexCn: Regexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      regexKo: Regexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 77,
      suppressSeconds: 99999,
      infoText: function(data) {
        let tookTwo = data.fireballs[1].filter(function(p) {
          return data.fireballs[2].indexOf(p) >= 0;
        });
        if (tookTwo.indexOf(data.me) >= 0)
          return;

        let str = '';
        if (tookTwo.length > 0) {
          str += ' (' + tookTwo.map(function(n) {
            return data.ShortName(n);
          }).join(', ');
          if (data.lang == 'fr')
            str += ' éviter)';
          else if (data.lang == 'de')
            str += ' raus)';
          else
            str += ' out)';
        }
        return {
          en: 'Fire IN' + str,
          fr: 'Feu EN DEDANS' + str,
          de: 'Feuer INNEN',
          ja: 'ファイアボールは密着',
          cn: '火进',
          ko: '불 같이맞기',
        };
      },
      alertText: function(data) {
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to not stack.
        if (data.fireballs[1].indexOf(data.me) >= 0 && data.fireballs[2].indexOf(data.me) >= 0) {
          return {
            en: 'Fire IN: AVOID!',
            fr: 'Feu EN DEDANS : L\'ÉVITER !',
            de: 'Feuer INNEN: AUSWEICHEN!',
            ja: 'ファイアボールは密着: 自分に離れる',
            cn: '火进：躲避！',
            ko: '불 같이맞기: 나는 피하기',
          };
        }
      },
      tts: function(data) {
        if (data.fireballs[1].indexOf(data.me) >= 0 && data.fireballs[2].indexOf(data.me) >= 0) {
          return {
            en: 'avoid fire in',
            fr: 'Éviter le feu en dedans',
            de: 'feuer innen ausweichen',
            ja: 'ファイアボール密着: 自分に離れる',
            cn: '躲避火进',
            ko: '불 같이맞으면 안됨',
          };
        }
        return {
          en: 'fire in',
          fr: 'Feu en dedans',
          de: 'feuer innen',
          ja: 'ファイアボール密着',
          cn: '火进',
          ko: '불 같이맞기',
        };
      },
      run: function(data) {
        data.naelFireballCount = 3;
      },
    },
    {
      id: 'UCU Nael Fireball 4',
      regex: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexDe: Regexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      regexFr: Regexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      regexJa: Regexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      regexCn: Regexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      regexKo: Regexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 98,
      suppressSeconds: 99999,
      preRun: function(data) {
        let tookTwo = data.fireballs[1].filter(function(p) {
          return data.fireballs[2].indexOf(p) >= 0;
        });
        let tookThree = tookTwo.filter(function(p) {
          return data.fireballs[3].indexOf(p) >= 0;
        });
        data.tookThreeFireballs = tookThree.indexOf(data.me) >= 0;
      },
      infoText: function(data) {
        if (!data.tookThreeFireballs) {
          return {
            en: 'Fire IN',
            fr: 'Feu EN DEDANS',
            de: 'Feuer INNEN',
            ja: 'ファイアボール密着',
            cn: '火进',
            ko: '불 같이맞기',
          };
        }
      },
      alertText: function(data) {
        // It's possible that you can take 1, 2, and 3 even if nobody dies with
        // careful ice debuff luck.  However, this means you probably shouldn't
        // take 4.
        if (data.tookThreeFireballs) {
          return {
            en: 'Fire IN: AVOID!',
            fr: 'Feu EN DEDANS : L\'ÉVITER !',
            de: 'Feuer INNEN: AUSWEICHEN!',
            ja: 'ファイアボールは密着: 自分に離れる',
            cn: '火进：躲避！',
            ko: '불 같이맞기: 나는 피하기',
          };
        }
      },
      tts: {
        en: 'fire in',
        fr: 'Feu en dedans',
        de: 'feuer innen',
        ja: 'ファイアボール密着',
        cn: '火进',
        ko: '불 같이맞기',
      },
      run: function(data) {
        data.naelFireballCount = 4;
      },
    },
    {
      id: 'UCU Dragon Tracker',
      regex: Regexes.abilityFull({ source: ['Iceclaw', 'Thunderwing', 'Fang Of Light', 'Tail Of Darkness', 'Firehorn'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      regexDe: Regexes.abilityFull({ source: ['Eisklaue', 'Donnerschwinge', 'Lichtklaue', 'Dunkelschweif', 'Feuerhorn'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      regexFr: Regexes.abilityFull({ source: ['Griffe-De-Glace', 'Aile-De-Foudre', 'Croc De Lumière', 'Queue De Ténèbres', 'Corne-De-Feu'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      regexJa: Regexes.abilityFull({ source: ['アイスクロウ', 'サンダーウィング', 'ライトファング', 'ダークテイル', 'ファイアホーン'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      regexCn: Regexes.abilityFull({ source: ['冰爪', '雷翼', '光牙', '暗尾', '火角'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      regexKo: Regexes.abilityFull({ source: ['얼음발톱', '번개날개', '빛의 송곳니', '어둠의 꼬리', '화염뿔'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      condition: function(data, matches) {
        return !data.seenDragon || !(matches.source in data.seenDragon);
      },
      run: function(data, matches) {
        // seenDragon[dragon name] => boolean
        data.seenDragon = data.seenDragon || [];
        data.seenDragon[matches.source] = true;

        let x = parseFloat(matches.x);
        let y = parseFloat(matches.y);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        let dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        // naelDragons[direction 0-7 (N-NW)] => boolean
        data.naelDragons = data.naelDragons || [0, 0, 0, 0, 0, 0, 0, 0];
        data.naelDragons[dir] = 1;

        if (Object.keys(data.seenDragon).length != 5)
          return;

        let output = data.findDragonMarks(data.naelDragons);
        let dir_names;
        if (data.lang == 'fr')
          dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        else if (data.lang == 'de')
          dir_names = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
        else if (data.lang == 'ko')
          dir_names = ['12시', '1시', '3시', '5시', '6시', '7시', '9시', '11시'];
        else
          dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = output.marks.map(function(i) {
          return dir_names[i];
        });
        data.wideThirdDive = output.wideThirdDive;
        data.unsafeThirdMark = output.unsafeThirdMark;
        delete data.naelDragons;
        // In case you forget, print marks in the log.
        // TODO: Maybe only if Options.Debug?
        console.log(data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''));
      },
    },
    {
      id: 'UCU Nael Dragon Placement',
      regex: Regexes.ability({ source: 'Iceclaw', id: '26C6', capture: false }),
      regexDe: Regexes.ability({ source: 'Eisklaue', id: '26C6', capture: false }),
      regexFr: Regexes.ability({ source: 'Griffe-De-Glace', id: '26C6', capture: false }),
      regexJa: Regexes.ability({ source: 'アイスクロウ', id: '26C6', capture: false }),
      regexCn: Regexes.ability({ source: '冰爪', id: '26C6', capture: false }),
      regexKo: Regexes.ability({ source: '얼음발톱', id: '26C6', capture: false }),
      condition: function(data) {
        return data.naelMarks && !data.calledNaelDragons;
      },
      durationSeconds: 20,
      infoText: function(data) {
        data.calledNaelDragons = true;
        return {
          en: 'Marks: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''),
          fr: 'Marque : ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (LARGE)' : ''),
          de: 'Markierungen : ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (GROß)' : ''),
          ja: 'マーカー: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (広)' : ''),
          cn: '标记: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (大)' : ''),
          ko: '징: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (넓음)' : ''),
        };
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Me',
      regex: Regexes.headMarker({ id: '0014' }),
      condition: function(data) {
        return !data.trio;
      },
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target != data.me)
          return;
        let marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        let dir = data.naelMarks[data.naelDiveMarkerCount];
        return {
          en: 'Go To ' + marker + ' (in ' + dir + ')',
          fr: 'Aller en ' + marker + ' (au ' + dir + ')',
          de: 'Gehe zu ' + marker + ' (im ' + dir + ')',
          ja: marker + 'に行く' + ' (あと ' + dir + '秒)',
          cn: '冲向' + marker + ' (剩余 ' + dir + '秒)',
          ko: marker + '로 이동' + ' (그리고 ' + dir + '로)',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Aller en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          de: 'Gehe zu ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ja: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '行くよ',
          cn: '前往 ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ko: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '로 이동',
        };
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Others',
      regex: Regexes.headMarker({ id: '0014' }),
      condition: function(data) {
        return !data.trio;
      },
      infoText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target == data.me)
          return;
        let num = data.naelDiveMarkerCount + 1;
        return {
          en: 'Dive #' + num + ': ' + data.ShortName(matches.target),
          fr: 'Bombardement #' + num + ' : ' + data.ShortName(matches.target),
          de: 'Sturz #' + num + ' : ' + data.ShortName(matches.target),
          ja: 'ダイブ' + num + '番目:' + data.ShortName(matches.target),
          cn: '冲 #' + num + ': ' + data.ShortName(matches.target),
          ko: '카탈 ' + num + ': ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Counter',
      regex: Regexes.headMarker({ id: '0014', capture: false }),
      condition: function(data) {
        return !data.trio;
      },
      run: function(data) {
        data.naelDiveMarkerCount++;
      },
    },
    {
      // Octet marker tracking (77=nael, 14=dragon, 29=baha, 2A=twin)
      id: 'UCU Octet Marker Tracking',
      regex: Regexes.headMarker({ id: ['0077', '0014', '0029'] }),
      condition: function(data) {
        return data.trio == 'octet';
      },
      run: function(data, matches) {
        data.octetMarker = data.octetMarker || [];
        data.octetMarker.push(matches.target);
        if (data.octetMarker.length != 7)
          return;

        let partyList = Object.keys(data.partyList);

        if (partyList.length != 8) {
          console.error('Octet error: bad party list size: ' + JSON.stringify(partyList));
          return;
        }
        let uniq_dict = {};
        for (let i = 0; i < data.octetMarker.length; ++i) {
          uniq_dict[data.octetMarker[i]] = true;
          if (partyList.indexOf(data.octetMarker[i]) < 0) {
            console.error('Octet error: could not find ' + data.octetMarker[i] + ' in ' + JSON.stringify(partyList));
            return;
          }
        }
        let uniq = Object.keys(uniq_dict);
        // If the number of unique folks who took markers is not 7, then
        // somebody has died and somebody took two.  Could be on anybody.
        if (uniq.length != 7)
          return;

        let remainingPlayers = partyList.filter(function(p) {
          return data.octetMarker.indexOf(p) < 0;
        });
        if (remainingPlayers.length != 1) {
          // This could happen if the party list wasn't unique.
          console.error('Octet error: failed to find player, ' + JSON.stringify(partyList) + ' ' + JSON.stringify(data.octetMarker));
          return;
        }

        // Finally, we found it!
        data.lastOctetMarker = remainingPlayers[0];
      },
    },
    {
      id: 'UCU Octet Nael Marker',
      regex: Regexes.headMarker({ id: '0077' }),
      condition: function(data) {
        return data.trio == 'octet';
      },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (nael)',
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches.target) + ' (nael)',
          de: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (nael)',
          ja: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (ネール)',
          cn: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (奈尔)',
          ko: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (넬)',
        };
      },
    },
    {
      id: 'UCU Octet Dragon Marker',
      regex: Regexes.headMarker({ id: '0014' }),
      condition: function(data) {
        return data.trio == 'octet';
      },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches.target),
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches.target),
          de: data.octetMarker.length + ': ' + data.ShortName(matches.target),
          ko: data.octetMarker.length + ': ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'UCU Octet Baha Marker',
      regex: Regexes.headMarker({ id: '0029' }),
      condition: function(data) {
        return data.trio == 'octet';
      },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (baha)',
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches.target) + ' (baha)',
          de: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (baha)',
          ja: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (バハ)',
          cn: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (巴哈)',
          ko: data.octetMarker.length + ': ' + data.ShortName(matches.target) + ' (바하)',
        };
      },
    },
    {
      id: 'UCU Octet Twin Marker',
      regex: Regexes.headMarker({ id: '0029', capture: false }),
      condition: function(data) {
        return data.trio == 'octet';
      },
      delaySeconds: 0.5,
      alarmText: function(data) {
        if (data.lastOctetMarker == data.me) {
          return {
            en: 'YOU Stack for Twin',
            fr: 'VOUS devez appâter Gémellia',
            de: 'DU stackst für Twintania',
            ja: '自分にタニアには頭割り',
            cn: '双塔集合',
            ko: '내가 트윈징 대상자',
          };
        }
      },
      infoText: function(data) {
        if (!data.lastOctetMarker) {
          return {
            en: '8: ??? (twin)',
            fr: '8 : ??? (Gémellia)',
            de: '8: ??? (Twintania)',
            ja: '8: ??? (ツインタニア)',
            cn: '8: ??? (双塔)',
            ko: '8: ??? (트윈타니아)',
          };
        }
        // If this person is not alive, then everybody should stack,
        // but tracking whether folks are alive or not is a mess.
        if (data.lastOctetMarker != data.me) {
          return {
            en: '8: ' + data.ShortName(data.lastOctetMarker) + ' (twin)',
            fr: '8 : ' + data.ShortName(data.lastOctetMarker) + ' (Gémellia)',
            de: '8: ' + data.ShortName(data.lastOctetMarker) + ' (Twintania)',
            ja: '8: ' + data.ShortName(data.lastOctetMarker) + ' (ツインタニア)',
            cn: '8: ' + data.ShortName(data.lastOctetMarker) + ' (双塔)',
            ko: '8: ' + data.ShortName(data.lastOctetMarker) + ' (트윈타니아)',
          };
        }
      },
      tts: function(data) {
        if (!data.lastOctetMarker || data.lastOctetMarker == data.me) {
          return {
            en: 'stack for twin',
            fr: 'Se rassembler pour appâter Gémellia',
            de: 'stek für twintania',
            ja: '頭割り',
            cn: '双塔集合',
            ko: '트윈타니아 옆에 서기',
          };
        }
      },
    },
    {
      id: 'UCU Twister Dives',
      regex: Regexes.ability({ source: 'Twintania', id: '26B2', capture: false }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '26B2', capture: false }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '26B2', capture: false }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '26B2', capture: false }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '26B2', capture: false }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '26B2', capture: false }),
      alertText: {
        en: 'Twisters',
        fr: 'Tornades',
        de: 'Wirbelstürme',
        ja: 'ツイスター',
        cn: '旋风冲',
        ko: '회오리',
      },
      tts: {
        en: 'twisters',
        fr: 'Tornades',
        de: 'Wirbelstürme',
        ja: 'ツイスター',
        cn: '旋风冲',
        ko: '회오리',
      },
    },
    {
      id: 'UCU Bahamut Gigaflare',
      regex: Regexes.startsUsing({ id: '26D6', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26D6', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26D6', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26D6', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26D6', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26D6', source: '바하무트 프라임', capture: false }),
      alertText: {
        en: 'Gigaflare',
        fr: 'GigaBrasier',
        de: 'Gigaflare',
        ja: 'ギガフレア',
        cn: '十亿核爆',
        ko: '기가플레어',
      },
      tts: {
        en: 'gigaflare',
        fr: 'Giga Brasier',
        de: 'Gigafleer',
        ja: 'ギガフレア',
        cn: '十亿核爆',
        ko: '기가플레어',
      },
    },
    {
      id: 'UCU Megaflare Stack Me',
      regex: Regexes.headMarker({ id: '0027' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Megaflare Stack',
        fr: 'MegaBrasier rassemblement',
        de: 'Megaflare Stack',
        ja: 'メガフレア頭割り',
        cn: '百万核爆集合',
        ko: '기가플레어 쉐어',
      },
      tts: {
        en: 'stack',
        fr: 'Se rassembler',
        de: 'stek',
        ja: '頭割り',
        cn: '集合',
        ko: '쉐어',
      },
    },
    {
      id: 'UCU Megaflare Stack Tracking',
      regex: Regexes.headMarker({ id: '0027' }),
      run: function(data, matches) {
        data.megaStack.push(matches.target);
      },
    },
    {
      id: 'UCU Megaflare Tower',
      regex: Regexes.headMarker({ id: '0027', capture: false }),
      infoText: function(data) {
        if (data.trio != 'blackfire' && data.trio != 'octet' || data.megaStack.length != 4)
          return;

        if (data.megaStack.indexOf(data.me) >= 0)
          return;

        if (data.trio == 'blackfire') {
          return {
            en: 'Tower, bait hypernova',
            fr: 'Tour, appâter Supernova',
            de: 'Turm, Hypernova ködern',
            ja: 'タワーやスーパーノヴァ',
            cn: '踩塔, 引导超新星',
            ko: '초신성 피하고 기둥 밟기',
          };
        }
        if (!data.lastOctetMarker || data.lastOctetMarker == data.me) {
          return {
            en: 'Bait Twin, then tower',
            fr: 'Appâter Gémellia, puis tour',
            de: 'Twintania in Turm locken',
            ja: 'タニアダイブやタワー',
            cn: '引导双塔, 踩塔',
            ko: '트윈타니아 유도 후 기둥 밟기',
          };
        }
        return {
          en: 'Get in a far tower',
          fr: 'Aller dans une tour lointaine',
          de: 'Geh in entfernten Turm',
          ja: '遠いタワー',
          cn: '踩远塔',
          ko: '기둥 밟기',
        };
      },
      tts: function(data) {
        if (data.trio != 'blackfire' && data.trio != 'octet' || data.megaStack.length != 4)
          return;

        if (data.megaStack.indexOf(data.me) == -1) {
          return {
            en: 'tower',
            fr: 'Tour',
            de: 'Turm',
            ja: 'タワー',
            cn: '塔',
            ko: '기둥',
          };
        }
      },
    },
    {
      id: 'UCU Megaflare Twin Tower',
      regex: Regexes.headMarker({ id: '0027', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: function(data) {
        if (data.trio != 'blackfire' && data.trio != 'octet' || data.megaStack.length != 4)
          return;
        if (!data.lastOctetMarker || data.lastOctetMarker == data.me)
          return;

        let twin = data.ShortName(data.lastOctetMarker);
        if (data.megaStack.indexOf(data.lastOctetMarker) >= 0) {
          return {
            en: twin + ' (twin) has megaflare',
            cn: twin + ' (双塔) 带百万核爆',
            ko: twin + ' (트윈 징 대상자) => 쉐어',
          };
        }
        return {
          en: twin + ' (twin) needs tower',
          cn: twin + ' (双塔) 需要踩塔',
          ko: twin + ' (트윈 징 대상자) => 기둥',
        };
      },
      tts: null,
    },
    {
      id: 'UCU Earthshaker Me',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Earthshaker on YOU',
        fr: 'Secousse sur VOUS',
        de: 'Erdstoß auf Dir',
        ja: '自分にアースシェイカー',
        cn: '地震点名',
        ko: '나에게 어스징',
      },
      tts: {
        en: 'shaker',
        fr: 'Secousse',
        de: 'Erdstoß',
        ja: 'アースシェイカー',
        cn: '地震',
        ko: '어스',
      },
    },
    {
      id: 'UCU Earthshaker Tracking',
      regex: Regexes.headMarker({ id: '0028' }),
      run: function(data, matches) {
        data.shakers.push(matches.target);
      },
    },
    {
      id: 'UCU Earthshaker Not Me',
      regex: Regexes.headMarker({ id: '0028', capture: false }),
      alertText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank') {
            return {
              en: 'Pick up tether',
              fr: 'Prendre un lien',
              de: 'Verbindung holen',
              ja: 'テンペストウィング線',
              cn: '接线',
              ko: '줄 가로채기',
            };
          }
        }
      },
      infoText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;

          if (data.shakers.indexOf(data.me) == -1 && data.role != 'tank') {
            return {
              en: 'No shaker; stack south.',
              fr: 'Pas de Secousse; se rassembler au Sud.',
              de: 'Kein Erdstoß; im süden sammeln',
              ja: 'シェイカーない；頭割りで南',
              cn: '不地震，南侧集合',
              ko: '징 없음, 모여서 쉐어',
            };
          }
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            if (data.shakers.indexOf(data.me) == -1) {
              return {
                en: 'Stack on safe spot',
                fr: 'Se rassembler au point sauf',
                de: 'In Sicherheit steken',
                ja: '頭割りで安全',
                cn: '安全点集合',
                ko: '안전장소에 모이기',
              };
            }
          }
        }
      },
      tts: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank') {
            return {
              en: 'tether',
              fr: 'Lien',
              de: 'Verbindung',
              ja: '線',
              cn: '线',
              ko: '줄',
            };
          }
          if (data.shakers.indexOf(data.me) == -1) {
            return {
              en: 'stack south',
              fr: 'Se rassembler au sud',
              de: 'stek im süden',
              ja: '頭割りで南',
              cn: '南侧集合',
              ko: '모여서 쉐어',
            };
          }
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            if (!(data.me in data.shakers)) {
              return {
                en: 'safe spot',
                fr: 'Point sauf',
                de: 'in sicherheit',
                ja: '安全',
                cn: '安全点',
                ko: '안전장소로',
              };
            }
          }
        }
      },
      run: function(data) {
        if (data.trio == 'tenstrike' && data.shakers.length == 4)
          data.shakers = [];
      },
    },
    {
      id: 'UCU Morn Afah',
      regex: Regexes.startsUsing({ id: '26EC', source: 'Bahamut Prime' }),
      regexDe: Regexes.startsUsing({ id: '26EC', source: 'Prim-Bahamut' }),
      regexFr: Regexes.startsUsing({ id: '26EC', source: 'Primo-Bahamut' }),
      regexJa: Regexes.startsUsing({ id: '26EC', source: 'バハムート・プライム' }),
      regexCn: Regexes.startsUsing({ id: '26EC', source: '至尊巴哈姆特' }),
      regexKo: Regexes.startsUsing({ id: '26EC', source: '바하무트 프라임' }),
      preRun: function(data) {
        data.mornAfahCount = data.mornAfahCount || 0;
        data.mornAfahCount++;
      },
      alertText: function(data, matches) {
        let str = 'Morn Afah #' + data.mornAfahCount;
        if (matches.target == data.me) {
          return {
            en: str + ' (YOU)',
            fr: str + ' (VOUS)',
            de: str + ' (DU)',
            ja: 'モーン・アファー' + data.mornAfahCount + '回' + ' (自分)',
            cn: '无尽顿悟 #' + data.mornAfahCount,
            ko: '몬 아파 ' + data.mornAfahCount + ' (나에게)',
          };
        }
        return {
          en: str + ' (' + data.ShortName(matches.target) + ')',
          fr: str + ' (' + data.ShortName(matches.target) + ')',
          de: str + ' (' + data.ShortName(matches.target) + ')',
          ja: 'モーン・アファー' + data.mornAfahCount + '回' + ' (' + data.ShortName(matches.target) + ')',
          cn: '无尽顿悟 #' + data.mornAfahCount,
          ko: '몬 아파 ' + data.mornAfahCount + ' (' + data.ShortName(matches.target) + ')',
        };
      },
      tts: function(data, matches) {
        return {
          en: 'morn afah ' + data.ShortName(matches.target),
          cn: '无尽顿悟 ' + data.ShortName(matches.target),
          ko: '몬 아파 ' + data.mornAfahCount,
        };
      },
    },
    {
      id: 'UCU Akh Morn',
      regex: Regexes.startsUsing({ id: '26EA', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26EA', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26EA', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26EA', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26EA', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26EA', source: '바하무트 프라임', capture: false }),
      preRun: function(data) {
        data.akhMornCount = data.akhMornCount || 0;
        data.akhMornCount++;
      },
      infoText: function(data) {
        return {
          en: 'Akh Morn #' + data.akhMornCount,
          cn: '死亡轮回 #' + data.akhMornCount,
          ko: '아크 몬 ' + data.akhMornCount,
        };
      },
    },
    {
      id: 'UCU Exaflare',
      regex: Regexes.startsUsing({ id: '26EF', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26EF', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26EF', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26EF', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26EF', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26EF', source: '바하무트 프라임', capture: false }),
      preRun: function(data) {
        data.exaflareCount = data.exaflareCount || 0;
        data.exaflareCount++;
      },
      infoText: function(data) {
        return {
          en: 'Exaflare #' + data.exaflareCount,
          fr: 'ExaBrasier #' + data.exaflareCount,
          de: 'Exaflare #' + data.exaflareCount,
          ja: 'エクサフレア' + data.exaflareCount + '回',
          cn: '百京核爆 #' + data.exaflareCount,
          ko: '엑사플레어 ' + data.exaflareCount,
        };
      },
      tts: function(data) {
        return {
          en: 'exaflare ' + data.exaflareCount,
          fr: 'Exabrasier '+ data.exaflareCount,
          de: 'Exafleer '+ data.exaflareCount,
          ja: 'エクサフレア' + data.exaflareCount,
          cn: '百京核爆 ' + data.exaflareCount,
        };
      },
    },
    {
      // One time setup.
      id: 'UCU Initial Setup',
      regex: Regexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '26AA', source: 'Gémellia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '26AA', source: 'ツインタニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '26AA', source: '双塔尼亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '26AA', source: '트윈타니아', capture: false }),
      suppressSeconds: 99999,
      run: function(data) {
        // TODO: a late white puddle can cause dragons to get seen for the next
        // phase so clear them again here.  Probably data for triggers needs
        // to be cleared at more reliable times.
        delete data.naelDragons;
        delete data.seenDragon;
        delete data.naelMarks;
        delete data.wideThirdDive;
        delete data.unsafeThirdMark;

        data.naelFireballCount = 0;
        data.fireballs = {
          1: [],
          2: [],
          3: [],
          4: [],
        };

        data.resetTrio = function(trio) {
          this.trio = trio;
          this.shakers = [];
          this.megaStack = [];
        };

        // Begin copy and paste from dragon_test.js.
        let modDistance = function(mark, dragon) {
          let oneWay = (dragon - mark + 8) % 8;
          let otherWay = (mark - dragon + 8) % 8;
          let distance = Math.min(oneWay, otherWay);
          console.assert(distance >= 0);
          return distance;
        };

        let badSpots = function(mark, dragon) {
          // All spots between mark and dragon are bad.  If distance == 1,
          // then the dragon hits the spot behind the mark too.  e.g. N
          // mark, NE dragon will also hit NW.
          let bad = [];
          let distance = modDistance(mark, dragon);
          console.assert(distance > 0);
          console.assert(distance <= 2);
          if ((mark + distance + 8) % 8 == dragon) {
            // Clockwise.
            for (let i = 0; i <= distance; ++i)
              bad.push((mark + i) % 8);
            if (distance == 1)
              bad.push((mark - 1 + 8) % 8);
          } else {
            // Widdershins.
            for (let i = 0; i <= distance; ++i)
              bad.push((mark - i + 8) % 8);
            if (distance == 1)
              bad.push((mark + 1) % 8);
          }
          return bad;
        };

        let findDragonMarks = function(array) {
          let marks = [-1, -1, -1];
          let ret = {
            // Third drive is on a dragon three squares away and will cover
            // more of the middle than usual, e.g. SE dragon, SW dragon,
            // mark W (because S is unsafe from 2nd dive).
            wideThirdDive: false,
            // Third mark spot is covered by the first dive so needs to be
            // patient.  Third mark should always be patient, but you never
            // know.
            unsafeThirdMark: false,
            marks: ['error', 'error', 'error'],
          };

          let dragons = [];
          for (let i = 0; i < 8; ++i) {
            if (array[i])
              dragons.push(i);
          }

          if (dragons.length != 5)
            return ret;

          // MARK 1: counterclockwise of #1 if adjacent, clockwise if not.
          if (dragons[0] + 1 == dragons[1]) {
            // If the first two dragons are adjacent, they *must* go CCW.
            // In the scenario of N, NE, SE, S, W dragons, the first marker
            // could be E, but that forces the second mark to be S (instead
            // of E), making SW unsafe for putting the mark between S and W.
            // Arguably, NW could be used here for the third mark, but then
            // the S dragon would cut off more of the middle of the arena
            // than desired.  This still could happen anyway in the
            // "tricksy" edge case below, but should be avoided if possible.
            marks[0] = (dragons[0] - 1 + 8) % 8;
          } else {
            // Split dragons.  Bias towards first dragon.
            marks[0] = Math.floor((dragons[0] + dragons[1]) / 2);
          }

          // MARK 2: go counterclockwise, unless dragon 2 is adjacent to 3.
          if (dragons[1] == dragons[2] - 1) {
            // Go clockwise.
            marks[1] = dragons[2] + 1;
          } else {
            // Go counterclockwise.
            marks[1] = dragons[2] - 1;
          }

          // MARK 3: if split, between 4 & 5.  If adjacent, clockwise of 5.
          if (dragons[3] + 1 == dragons[4]) {
            // Adjacent dragons.
            // Clockwise is always ok.
            marks[2] = (dragons[4] + 1) % 8;

            // Minor optimization:
            // See if counterclockwise is an option to avoid having mark 3
            // in a place that the first pair covers.
            //
            // If dragon 3 is going counterclockwise, then only need one
            // hole between #3 and #4, otherwise need all three holes.
            // e.g. N, NE, E, W, NW dragon pattern should prefer third
            // mark SW instead of N.
            let distance = marks[1] == dragons[2] - 1 ? 2 : 4;
            if (dragons[3] >= dragons[2] + distance)
              marks[2] = dragons[3] - 1;
          } else {
            // Split dragons.  Common case: bias towards last dragon, in case
            // 2nd charge is going towards this pair.
            marks[2] = Math.ceil((dragons[3] + dragons[4]) / 2);
            if (marks[1] == dragons[3] && marks[2] == marks[1] + 1) {
              // Tricksy edge case, e.g. N, NE, E, SE, SW.  S not safe for
              // third mark because second mark is at SE, and E dragon will
              // clip S.  Send all dragons CW even if this means eating more
              // arena space.
              marks[2] = (dragons[4] + 1) % 8;
              ret.wideThirdDive = true;
            }
          }

          let bad = badSpots(marks[0], dragons[0]);
          bad.concat(badSpots(marks[0], dragons[1]));
          ret.unsafeThirdMark = bad.indexOf(marks[2]) != -1;

          let dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          ret.marks = marks;
          return ret;
        };
        // End copy and paste.

        data.findDragonMarks = findDragonMarks;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bahamut Prime': 'Prim-Bahamut',
        'Fang of Light': 'Lichtklaue',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Deus Darnus': 'Nael deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Oviform': 'Magiekompressor',
        'Ragnarok': 'Ragnarök',
        'Tail of Darkness': 'Dunkelschweif',
        'Thunderwing': 'Donnerschwinge',
        'Twintania': 'Twintania',
      },
      'replaceText': {
        '--push--': '--stoß--',
        'Aetheric Profusion': 'Ätherische Profusion',
        'Akh Morn': 'Akh Morn',
        'Bahamut Marker': 'Bahamut Marker',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Blackfire Trio': 'Schwarzfeuer-Trio',
        'Calamitous Blaze': 'Katastrophale Lohe',
        'Calamitous Flame': 'Katastrophale Flammen',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Death Sentence': 'Todesurteil',
        'Deathstorm': 'Todessturm',
        'Dive . Dynamo/Chariot': 'Sturzflug + Dynamo/Streitwagen',
        'Dive Dynamo Combo': 'Sturzflug Dynamo Kombo',
        'Divebomb': 'Sturzbombe',
        'Doom': 'Verhängnis',
        'Dynamo . Beam/Chariot': 'Dynamo + Strahl/Streitwagen',
        'Earth Shaker': 'Erdstoß',
        'Exaflare': 'Exaflare',
        'Fellruin Trio': 'Untergangs-Trio',
        'Fireball(?! Soak)': 'Feuerball',
        'Fireball Soak': 'Feuerball aufsaugen',
        'Flames Of Rebirth': 'Flammen der Wiedergeburt',
        'Flare Breath': 'Flare-Atem',
        'Flatten': 'Einebnen',
        'Generate': 'Formung',
        'Gigaflare': 'Gigaflare',
        'Grand Octet': 'Großes Oktett',
        'Hatch': 'Austritt',
        'Heavensfall Trio': 'Himmelssturz-Trio',
        'Heavensfall(?! )': 'Himmelssturz',
        'Hypernova': 'Supernova',
        'Iceball': 'Eisball',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Liquid Hell': 'Höllenschmelze',
        'Lunar Dive': 'Lunarer Sturz',
        'Lunar Dynamo': 'Lunarer Dynamo',
        '(?<! )Marker(?!\\w)': 'Marker',
        'Markers appear': 'Marker escheinen',
        'Megaflare': 'Megaflare',
        'Megaflare Dive': 'Megaflare-Sturz',
        'Meteor Stream': 'Meteorflug',
        'Meteor/Dive or Dive/Beam': 'Meteor/Sturzflug oder Sturzflug/Strahl',
        'Morn Afah': 'Morn Afah',
        'Nael Dive': 'Nael Sturzflug',
        'Nael Marker': 'Nael Marker',
        'Pepperoni': 'Pepperoni', // FIXME
        'Plummet(?!\/)': 'Herabstürzen',
        'Plummet/Claw': 'Herabstürzen/Klaue',
        'Quickmarch Trio': 'Todesmarsch-Trio',
        'Random Combo Attack': 'Zufälliger Komboangriff',
        'Raven Dive': 'Bahamuts Schwinge',
        '(?<!\/)Ravensbeak': 'Bradamante',
        'Sentence/Ravensbeak': 'Urteil/Bradamante',
        'Seventh Umbral Era': 'Siebte Ära des Schattens',
        'Stack': 'Sammeln',
        'Targeted Fire': 'Feuer auf Ziel',
        'Tempest Wing': 'Sturm-Schwinge',
        'Tenstrike Trio': 'Zehnschlag-Trio',
        'Teraflare': 'Teraflare',
        'Thermionic . Dynamo/Chariot': 'Thermo + Dynamo/Streitwagen',
        'Thermionic Beam': 'Thermionischer Strahl',
        'Thermionic Burst': 'Thermionische Eruption',
        'Thunderstruck': 'Donnerschwinge',
        'Towers': 'Türme',
        'Triple Nael Quote': 'Drei Nael Zitate',
        'Twin Marker': 'Twin Marker',
        'Twister': 'Wirbelsturm',
        'Twisting Dive': 'Spiralschwinge',
        'White Fury': 'Naels Zorn',
        'Wings of Salvation': 'Rettende Schwinge',
      },
      '~effectNames': {
        'Doom': 'Verhängnis',
        'Down For The Count': 'Am Boden',
        'Earth Resistance Down II': 'Erdresistenz - (stark)',
        'Firescorched': 'Feuerhorn',
        'Icebitten': 'Eisklaue',
        'Lohs Daih': 'Lohs Daih',
        'Mana Hypersensitivity': 'Magieempfindlichkeit',
        'Neurolink': 'Neurolink',
        'Phoenix\'s Blessing': 'Stärke des Phönix',
        'Piercing Resistance Down II': 'Stichresistenz - (stark)',
        'Slashing Resistance Down II': 'Hiebresistenz - (stark)',
        'Thunderstruck': 'Donnerschwinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'Fang of Light': 'croc de lumière',
        'Firehorn': 'corne-de-feu',
        'Iceclaw': 'griffe-de-glace',
        'Nael Deus Darnus': 'Nael deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Oviform': 'oviforme',
        'Ragnarok': 'Ragnarok',
        'Tail of Darkness': 'queue de ténèbres',
        'Thunderwing': 'aile-de-foudre',
        'Twintania': 'Gémellia',
      },
      'replaceText': {
        '--push--': '--Poussé(e)--',
        'Aetheric Profusion': 'Excès d\'éther',
        'Akh Morn': 'Akh Morn',
        'Bahamut Marker': 'Marqueur de Bahamut',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Blackfire Trio': 'Trio des flammes noires',
        'Calamitous Blaze': 'Brasier du Fléau',
        'Calamitous Flame': 'Flammes du Fléau',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Death Sentence': 'Peine de mort',
        'Deathstorm': 'Tempête de la mort',
        'Dive . Dynamo/Chariot': 'Plongeon + Dynamo/Char',
        'Dive Dynamo Combo': 'Plongeon Dynamo Combo',
        'Divebomb': 'Bombe plongeante',
        'Doom': 'Glas',
        'Dynamo . Beam/Chariot': 'Dynamo + Rayon/Char',
        'Earth Shaker': 'Secousse',
        'Exaflare': 'ExaBrasier',
        'Fellruin Trio': 'Trio du désastre',
        'Fireball(?! Soak)': 'Boule de feu',
        'Fireball Soak': 'Absorption Boule De Feu',
        'Flames Of Rebirth': 'Feu résurrecteur',
        'Flare Breath': 'Souffle brasier',
        'Flatten': 'Compression',
        'Generate': 'Synthèse de mana',
        'Gigaflare': 'GigaBrasier',
        'Grand Octet': 'Octuors des dragons',
        'Hatch': 'Éclosion',
        'Heavensfall Trio': 'Trio de l\'univers',
        'Heavensfall(?! )': 'Destruction Universelle',
        'Hypernova': 'Hypernova',
        'Iceball': 'Orbe de glace',
        'Iron Chariot': 'Char de fer',
        'Liquid Hell': 'Enfer liquide',
        'Lunar Dive': 'Plongeon lunaire',
        'Lunar Dynamo': 'Dynamo lunaire',
        '(?<! )Marker(?!\\w)': 'Marqueur',
        'Markers appear': 'Apparition des marqueurs',
        'Megaflare': 'MégaBrasier',
        'Megaflare Dive': 'Plongeon MégaBrasier',
        'Meteor Stream': 'Rayon météore',
        'Meteor/Dive or Dive/Beam': 'Météore/Plongeon ou Plongeon/Rayon',
        'Morn Afah': 'Morn Afah',
        'Nael Dive': 'Plongeon de Nael',
        'Nael Marker': 'Marqueur de Nael',
        'Pepperoni': 'Pepperoni', // FIXME
        'Plummet(?!\/)': 'Piqué',
        'Plummet/Claw': 'Piqué/Griffe',
        'Quickmarch Trio': 'Trio de la marche militaire',
        'Random Combo Attack': 'Attaque combo aléatoire',
        'Raven Dive': 'Fonte du rapace',
        '(?<!\/)Ravensbeak': 'Bec du rapace',
        'Sentence/Ravensbeak': 'Peine De Mort/Bec Du Rapace',
        'Seventh Umbral Era': '7e fléau',
        'Stack': 'Se rassembler',
        'Targeted Fire': 'Feu ciblé',
        'Tempest Wing': 'Aile de tempête',
        'Tenstrike Trio': 'Trio des attaques',
        'Teraflare': 'TéraBrasier',
        'Thermionic . Dynamo/Chariot': 'Rayon + Dynamo/Char',
        'Thermionic Beam': 'Rayon thermoïonique',
        'Thermionic Burst': 'Rafale thermoïonique',
        'Thunderstruck': 'Aile-de-foudre',
        'Towers': 'Tours',
        'Triple Nael Quote': 'Triple citation de Nael',
        'Twin Marker': 'Marqueur de Gémellia',
        'Twister': 'Grande trombe',
        'Twisting Dive': 'Plongeon-trombe',
        'White Fury': 'Colère de Nael',
        'Wings of Salvation': 'Aile de la salvation',
      },
      '~effectNames': {
        'Doom': 'Glas',
        'Down For The Count': 'Au tapis',
        'Earth Resistance Down II': 'Résistance à la terre réduite+',
        'Firescorched': 'Corne-de-feu',
        'Icebitten': 'Griffe-de-glace',
        'Lohs Daih': 'Lohs Daih',
        'Mana Hypersensitivity': 'Hypersensibilité à la mana',
        'Neurolink': 'Neurolien',
        'Phoenix\'s Blessing': 'Protection de Phénix',
        'Piercing Resistance Down II': 'Résistance au perforant réduite+',
        'Slashing Resistance Down II': 'Résistance au tranchant réduite+',
        'Thunderstruck': 'Aile-de-foudre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'Fang of Light': 'ライトファング',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Deus Darnus': 'ネール・デウス・ダーナス',
        'Nael Geminus': 'ネール・ジェミナス',
        'Oviform': '魔力圧縮体',
        'Ragnarok': 'ラグナロク',
        'Tail of Darkness': 'ダークテイル',
        'Thunderwing': 'サンダーウィング',
        'Twintania': 'ツインタニア',
      },
      'replaceText': {
        '--push--': '--push--', // FIXME
        'Aetheric Profusion': 'エーテリックプロフュージョン',
        'Akh Morn': 'アク・モーン',
        'Bahamut Marker': 'Bahamut Marker', // FIXME
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Blackfire Trio': '黒炎の三重奏',
        'Calamitous Blaze': '災いの焔',
        'Calamitous Flame': '災いの炎',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Death Sentence': 'デスセンテンス',
        'Deathstorm': 'デスストーム',
        'Dive . Dynamo/Chariot': 'Dive . Dynamo/Chariot', // FIXME
        'Dive Dynamo Combo': 'Dive Dynamo Combo', // FIXME
        'Divebomb': 'ダイブボム',
        'Doom': '死の宣告',
        'Dynamo . Beam/Chariot': 'Dynamo . Beam/Chariot', // FIXME
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Fellruin Trio': '厄災の三重奏',
        'Fireball(?! Soak)': 'ファイアボール',
        'Fireball Soak': 'Fireball Soak', // FIXME
        'Flames Of Rebirth': '転生の炎',
        'Flare Breath': 'フレアブレス',
        'Flatten': 'フラッテン',
        'Generate': '魔力錬成',
        'Gigaflare': 'ギガフレア',
        'Grand Octet': '群竜の八重奏',
        'Hatch': '魔力爆散',
        'Heavensfall Trio': '天地の三重奏',
        'Heavensfall(?! )': '天地崩壊',
        'Hypernova': 'スーパーノヴァ',
        'Iceball': 'アイスボール',
        'Iron Chariot': 'アイアンチャリオット',
        'Liquid Hell': 'ヘルリキッド',
        'Lunar Dive': 'ルナダイブ',
        'Lunar Dynamo': 'ルナダイナモ',
        '(?<! )Marker(?!\\w)': 'Marker', // FIXME
        'Markers appear': 'Markers appear', // FIXME
        'Megaflare': 'メガフレア',
        'Megaflare Dive': 'メガフレアダイブ',
        'Meteor Stream': 'メテオストリーム',
        'Meteor/Dive or Dive/Beam': 'Meteor/Dive or Dive/Beam', // FIXME
        'Morn Afah': 'モーン・アファー',
        'Nael Dive': 'Nael Dive', // FIXME
        'Nael Marker': 'Nael Marker', // FIXME
        'Pepperoni': 'Pepperoni', // FIXME
        'Plummet(?!\/)': 'プラメット',
        'Plummet/Claw': 'Plummet/Claw', // FIXME
        'Quickmarch Trio': '進軍の三重奏',
        'Random Combo Attack': 'Random Combo Attack', // FIXME
        'Raven Dive': 'レイヴンダイブ',
        '(?<!\/)Ravensbeak': 'レイヴェンズビーク',
        'Sentence/Ravensbeak': 'Sentence/Ravensbeak', // FIXME
        'Seventh Umbral Era': '第七霊災',
        'Stack': 'Stack', // FIXME
        'Targeted Fire': 'Targeted Fire', // FIXME
        'Tempest Wing': 'テンペストウィング',
        'Tenstrike Trio': '連撃の三重奏',
        'Teraflare': 'テラフレア',
        'Thermionic . Dynamo/Chariot': 'Thermionic . Dynamo/Chariot', // FIXME
        'Thermionic Beam': 'サーミオニックビーム',
        'Thermionic Burst': 'サーミオニックバースト',
        'Thunderstruck': 'サンダーウィング',
        'Towers': 'Towers', // FIXME
        'Triple Nael Quote': 'Triple Nael Quote', // FIXME
        'Twin Marker': 'Twin Marker', // FIXME
        'Twister': 'ツイスター',
        'Twisting Dive': 'ツイスターダイブ',
        'White Fury': 'ネールの憤怒',
        'Wings of Salvation': 'サルヴェーションウィング',
      },
      '~effectNames': {
        'Doom': '死の宣告',
        'Down For The Count': 'ノックダウン',
        'Earth Resistance Down II': '土属性耐性低下［強］',
        'Firescorched': 'ファイアホーン',
        'Icebitten': 'アイスクロウ',
        'Lohs Daih': 'ロース・ダイ',
        'Mana Hypersensitivity': '魔力過敏症',
        'Neurolink': '拘束装置',
        'Phoenix\'s Blessing': 'フェニックスの加護',
        'Piercing Resistance Down II': '突属性耐性低下[強]',
        'Slashing Resistance Down II': '斬属性耐性低下［強］',
        'Thunderstruck': 'サンダーウィング',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bahamut Prime': '至尊巴哈姆特',
        'Fang of Light': '光牙',
        'Firehorn': '火角',
        'Iceclaw': '冰爪',
        'Nael Deus Darnus': '奈尔·神·达纳斯',
        'Nael Geminus': '奈尔双生子',
        'Oviform': '魔力压缩体',
        'Ragnarok': '诸神黄昏',
        'Tail of Darkness': '暗尾',
        'Thunderwing': '雷翼',
        'Twintania': '双塔尼亚',
      },
      'replaceText': {
        '--push--': '--push--', // FIXME
        'Aetheric Profusion': '以太失控',
        'Akh Morn': '死亡轮回',
        'Bahamut Marker': '巴哈标记',
        'Bahamut\'s Claw': '巴哈姆特之爪',
        'Bahamut\'s Favor': '龙神的加护',
        'Blackfire Trio': '黑炎的三重奏',
        'Calamitous Blaze': '灵灾之焰',
        'Calamitous Flame': '灵灾之炎',
        'Cauterize': '低温俯冲',
        'Chain Lightning': '雷光链',
        'Dalamud Dive': '月华冲',
        'Death Sentence': '死刑',
        'Deathstorm': '死亡风暴',
        'Dive . Dynamo/Chariot': '冲 + 月环/钢铁',
        'Dive Dynamo Combo': '冲月环连招',
        'Divebomb': '爆破俯冲',
        'Doom': '死亡宣告',
        'Dynamo . Beam/Chariot': '月环 + 光束/钢铁',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Fellruin Trio': '灾厄的三重奏',
        'Fireball(?! Soak)': '火球',
        'Fireball Soak': '火球分摊',
        'Flames Of Rebirth': '转生之炎',
        'Flare Breath': '核爆吐息',
        'Flatten': '平击',
        'Generate': '魔力炼成',
        'Gigaflare': '十亿核爆',
        'Grand Octet': '群龙的八重奏',
        'Hatch': '魔力爆散',
        'Heavensfall Trio': '天地的三重奏',
        'Heavensfall(?! )': '天崩地裂',
        'Hypernova': '超新星',
        'Iceball': '寒冰球',
        'Iron Chariot': '钢铁战车',
        'Liquid Hell': '液体地狱',
        'Lunar Dive': '月流冲',
        'Lunar Dynamo': '月流电圈',
        '(?<! )Marker(?!\\w)': '标记',
        'Markers appear': '标记出现',
        'Megaflare': '百万核爆',
        'Megaflare Dive': '百万核爆冲',
        'Meteor Stream': '陨石流',
        'Meteor/Dive or Dive/Beam': '陨石/冲 或 冲/光束',
        'Morn Afah': '无尽顿悟',
        'Nael Dive': '奈尔冲',
        'Nael Marker': '奈尔标记',
        'Pepperoni': '大圈',
        'Plummet(?!\/)': '垂直下落',
        'Plummet/Claw': '垂直下落/爪',
        'Quickmarch Trio': '进军的三重奏',
        'Random Combo Attack': '随机连招',
        'Raven Dive': '凶鸟冲',
        '(?<!\/)Ravensbeak': '凶鸟尖喙',
        'Sentence/Ravensbeak': '死刑/凶鸟尖喙',
        'Seventh Umbral Era': '第七灵灾',
        'Stack': '集合',
        'Targeted Fire': '火球点名',
        'Tempest Wing': '风暴之翼',
        'Tenstrike Trio': '连击的三重奏',
        'Teraflare': '万亿核爆',
        'Thermionic . Dynamo/Chariot': '离子 + 月环/钢铁',
        'Thermionic Beam': '热离子光束',
        'Thermionic Burst': '热离子爆发',
        'Thunderstruck': '雷翼',
        'Towers': '塔',
        'Triple Nael Quote': '三黑球',
        'Twin Marker': '双塔标记',
        'Twister': '旋风',
        'Twisting Dive': '旋风冲',
        'White Fury': '奈尔之怒',
        'Wings of Salvation': '救世之翼',
      },
      '~effectNames': {
        'Doom': '死亡宣告',
        'Down For The Count': '击倒',
        'Earth Resistance Down II': '土属性耐性大幅降低',
        'Firescorched': '火角',
        'Icebitten': '冰爪',
        'Lohs Daih': '真力解放',
        'Mana Hypersensitivity': '魔力过敏',
        'Neurolink': '拘束装置',
        'Phoenix\'s Blessing': '不死鸟的加护',
        'Piercing Resistance Down II': '突刺耐性大幅降低',
        'Slashing Resistance Down II': '斩击耐性大幅降低',
        'Thunderstruck': '雷翼',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bahamut Prime': '바하무트 프라임',
        'Fang of Light': '빛의 송곳니',
        'Firehorn': '화염뿔',
        'Iceclaw': '얼음발톱',
        'Nael Deus Darnus': '넬 데우스 다르누스',
        'Nael Geminus': '넬 게미누스',
        'Oviform': '마력 압축체',
        'Ragnarok': '라그나로크',
        'Tail of Darkness': '어둠의 꼬리',
        'Thunderwing': '번개날개',
        'Twintania': '트윈타니아',
      },
      'replaceText': {
        '--push--': '--최소 RDPS컷--',
        'Aetheric Profusion': '에테르 홍수',
        'Akh Morn': '아크 몬',
        'Bahamut Marker': '바하무트 징',
        'Bahamut\'s Claw': '바하무트의 발톱',
        'Bahamut\'s Favor': '용신의 가호',
        'Blackfire Trio': '흑염의 3중주',
        'Calamitous Blaze': '재앙의 화염',
        'Calamitous Flame': '재앙의 불꽃',
        'Cauterize': '인두질',
        'Chain Lightning': '번개 사슬',
        'Dalamud Dive': '달라가브 강하',
        'Death Sentence': '사형 선고',
        'Deathstorm': '죽음의 폭풍',
        'Dive . Dynamo/Chariot': '강하 + 달/강철',
        'Dive Dynamo Combo': '강하 달 콤보',
        'Divebomb': '급강하 폭격',
        'Doom': '죽음의 선고',
        'Dynamo . Beam/Chariot': '달 + 광선/강철',
        'Earth Shaker': '요동치는 대지',
        'Exaflare': '엑사플레어',
        'Fellruin Trio': '재앙의 3중주',
        'Fireball(?! Soak)': '화염구',
        'Fireball Soak': '화염구 쉐어',
        'Flames Of Rebirth': '윤회의 불꽃',
        'Flare Breath': '타오르는 숨결',
        'Flatten': '짓뭉개기',
        'Generate': '마력 연성',
        'Gigaflare': '기가플레어',
        'Grand Octet': '용들의 8중주',
        'Hatch': '마력 방출',
        'Heavensfall Trio': '천지의 3중주',
        'Heavensfall(?! )': '천지붕괴(?! )',
        'Hypernova': '초신성',
        'Iceball': '얼음구',
        'Iron Chariot': '강철 전차',
        'Liquid Hell': '지옥의 늪',
        'Lunar Dive': '달 강하',
        'Lunar Dynamo': '달의 원동력',
        '(?<! )Marker(?!\\w)': '징',
        'Markers appear': '징 표시',
        'Megaflare': '메가플레어',
        'Megaflare Dive': '메가플레어 다이브',
        'Meteor Stream': '유성 폭풍',
        'Meteor/Dive or Dive/Beam': '유성/강하 or 강하/광선',
        'Morn Afah': '몬 아파',
        'Nael Dive': '넬 강하',
        'Nael Marker': '넬 징',
        'Pepperoni': '메가플레어 장판',
        'Plummet(?!\/)': '곤두박질',
        'Plummet/Claw': '곤두박질/발톱',
        'Quickmarch Trio': '진군의 3중주',
        'Random Combo Attack': '랜덤 콤보 공격',
        'Raven Dive': '흉조의 강하',
        '(?<!\/)Ravensbeak': '흉조의 부리',
        'Sentence/Ravensbeak': '선고/부리',
        'Seventh Umbral Era': '제7재해',
        'Stack': '모이기',
        'Targeted Fire': '대상자 화염구',
        'Tempest Wing': '폭풍우 날개',
        'Tenstrike Trio': '연격의 3중주',
        'Teraflare': '테라플레어',
        'Thermionic . Dynamo/Chariot': '열전자 + 달/강철',
        'Thermionic Beam': '열전자 광선',
        'Thermionic Burst': '열전자 폭발',
        'Thunderstruck': '번개날개',
        'Towers': '기둥',
        'Triple Nael Quote': '넬 3회 대사',
        'Twin Marker': '트윈 징',
        'Twister': '회오리',
        'Twisting Dive': '회오리 강하',
        'White Fury': '넬의 분노',
        'Wings of Salvation': '구원의 날개',
      },
      '~effectNames': {
        'Doom': '죽음의 선고',
        'Down For The Count': '넉다운',
        'Earth Resistance Down II': '땅속성 저항 감소[강]',
        'Firescorched': '화염뿔',
        'Icebitten': '얼음발톱',
        'Lohs Daih': '로스 다이',
        'Mana Hypersensitivity': '마력 과민증',
        'Neurolink': '구속 장치',
        'Phoenix\'s Blessing': '피닉스의 가호',
        'Piercing Resistance Down II': '찌르기 저항 감소[강]',
        'Slashing Resistance Down II': '베기 저항 감소[강]',
        'Thunderstruck': '번개날개',
      },
    },
  ],
}];

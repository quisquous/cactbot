// UCU - The Unending Coil Of Bahamut (Ultimate)
// localization:
//   de: partial timeline, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
  timelineFile: 'unending_coil_ultimate.txt',
  triggers: [
    // --- State ---
    {
      regex: /:(\y{Name}) gains the effect of Firescorched/,
      regexDe: /:(\y{Name}) gains the effect of Feuerhorn/,
      regexFr: /:(\y{Name}) gains the effect of Corne-de-feu/,
      regexJa: /:(\y{Name}) gains the effect of ファイアホーン/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = true; },
    },
    {
      regex: /:(\y{Name}) loses the effect of Firescorched/,
      regexDe: /:(\y{Name}) loses the effect of Feuerhorn/,
      regexFr: /:(\y{Name}) loses the effect of Corne-de-feu/,
      regexJa: /:(\y{Name}) loses the effect of ファイアホーン/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = false; },
    },
    {
      regex: /:(\y{Name}) gains the effect of Icebitten/,
      regexDe: /:(\y{Name}) gains the effect of Eisklaue/,
      regexFr: /:(\y{Name}) gains the effect of Griffe-de-glace/,
      regexJa: /:(\y{Name}) gains the effect of アイスクロウ/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.iceDebuff = true; },
    },
    {
      regex: /:(\y{Name}) loses the effect of Icebitten/,
      regexDe: /:(\y{Name}) loses the effect of Eisklaue/,
      regexFr: /:(\y{Name}) loses the effect of Griffe-de-glace/,
      regexJa: /:(\y{Name}) loses the effect of アイスクロウ/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.iceDebuff = false; },
    },
    {
      regex: /1[56]:\y{ObjectId}:Firehorn:26C5:Fireball:\y{ObjectId}:(\y{Name}):/,
      regexDe: /1[56]:\y{ObjectId}:Feuerhorn:26C5:Feuerball:\y{ObjectId}:(\y{Name}):/,
      regexFr: /1[56]:\y{ObjectId}:Corne-de-feu:26C5:Boule De Feu:\y{ObjectId}:(\y{Name}):/,
      regexJa: /1[56]:\y{ObjectId}:ファイアホーン:26C5:ファイアボール:\y{ObjectId}:(\y{Name}):/,
      run: function(data, matches) {
        data.fireballs[data.naelFireballCount].push(matches[1]);
      },
    },
    {
      regex: /:26E2:Bahamut Prime starts using Quickmarch Trio/,
      regexDe: /:26E2:Prim-Bahamut starts using Todesmarsch-Trio/,
      regexFr: /:26E2:Primo-Bahamut starts using Trio De La Marche Militaire/,
      regexJa: /:26E2:バハムート・プライム starts using 進軍の三重奏/,
      run: function(data) { if (data.resetTrio) data.resetTrio('quickmarch'); },
    },
    {
      regex: /:26E3:Bahamut Prime starts using Blackfire Trio/,
      regexDe: /:26E3:Prim-Bahamut starts using Schwarzfeuer-Trio/,
      regexFr: /:26E3:Primo-Bahamut starts using Trio Des Flammes Noires/,
      regexJa: /:26E3:バハムート・プライム starts using 黒炎の三重奏/,
      run: function(data) { if (data.resetTrio) data.resetTrio('blackfire'); },
    },
    {
      regex: /:26E4:Bahamut Prime starts using Fellruin Trio/,
      regexDe: /:26E4:Prim-Bahamut starts using Untergangs-Trio/,
      regexFr: /:26E4:Primo-Bahamut starts using Trio Du Désastre/,
      regexJa: /:26E4:バハムート・プライム starts using 厄災の三重奏/,
      run: function(data) { if (data.resetTrio) data.resetTrio('fellruin'); },
    },
    {
      regex: /:26E5:Bahamut Prime starts using Heavensfall Trio/,
      regexDe: /:26E5:Prim-Bahamut starts using Himmelssturz Trio/,
      regexFr: /:26E5:Primo-Bahamut starts using Trio De L'univers/,
      regexJa: /:26E5:バハムート・プライム starts using 天地崩壊 Trio/,
      run: function(data) { if (data.resetTrio) data.resetTrio('heavensfall'); },
    },
    {
      regex: /:26E6:Bahamut Prime starts using Tenstrike Trio/,
      regexDe: /:26E6:Prim-Bahamut starts using Zehnschlag-Trio/,
      regexFr: /:26E6:Primo-Bahamut starts using Trio Des Attaques/,
      regexJa: /:26E6:バハムート・プライム starts using 連撃の三重奏/,
      run: function(data) { if (data.resetTrio) data.resetTrio('tenstrike'); },
    },
    {
      regex: /:26E7:Bahamut Prime starts using Grand Octet/,
      regexDe: /:26E7:Prim-Bahamut starts using Großes Oktett/,
      regexFr: /:26E7:Primo-Bahamut starts using Octuors Des Dragons/,
      regexJa: /:26E7:バハムート・プライム starts using 群竜の八重奏/,
      run: function(data) { if (data.resetTrio) data.resetTrio('octet'); },
    },
    {
      regex: /16:........:Ragnarok:26B8:Heavensfall:........:(\y{Name}):/,
      regexDe: /16:........:Ragnarök:26B8:Himmelssturz:........:(\y{Name}):/,
      regexFr: /16:........:Ragnarok:26B8:Destruction Universelle:........:(\y{Name}):/,
      regexJa: /16:........:ラグナロク:26B8:天地崩壊:........:(\y{Name}):/,
      run: function(data, matches) {
        // This happens once during the nael transition and again during
        // the heavensfall trio.  This should proooobably hit all 8
        // people by the time you get to octet.
        data.partyList = data.partyList || {};
        data.partyList[matches[1]] = true;
      },
    },

    // --- Twintania ---
    { id: 'UCU Twisters',
      regex: /:26AA:Twintania starts using/,
      regexDe: /:26AA:Twintania starts using/,
      regexFr: /:26AA:Gémellia starts using/,
      regexJa: /:26AA:ツインタニア starts using/,
      alertText: {
        en: 'Twisters',
        fr: 'Tornades',
      },
      tts: {
        en: 'twisters',
        fr: 'Tornades',
      },
    },
    { id: 'UCU Death Sentence',
      regex: /:Twintania readies Death Sentence/,
      regexDe: /:Twintania readies Todesurteil/,
      regexFr: /:Gémellia readies Peine De Mort/,
      regexJa: /:ツインタニア readies デスセンテンス/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer')
          return {
            en: 'Death Sentence',
            fr: 'Peine de mort',
          };
      },
      tts: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer')
          return {
            en: 'buster',
            fr: 'Anti-tank',
          };
      },
    },
    { // Hatch Collect
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      run: function(data, matches) {
        data.hatch = data.hatch || [];
        data.hatch.push(matches[1]);
      },
    },
    { id: 'UCU Hatch Marker YOU',
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: {
        en: 'Hatch on YOU',
        fr: 'Éclosion sur VOUS',
      },
      tts: {
        en: 'hatch',
        fr: 'Éclosion',
      },
    },
    {
      id: 'UCU Hatch Callouts',
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      delaySeconds: 0.25,
      infoText: function(data, matches) {
        if (!data.hatch)
          return;
        var hatches = data.hatch.map(function(n) { return data.ShortName(n); }).join(', ');
        delete data.hatch;
        return {
          en: 'Hatch: ' + hatches,
          fr: 'Éclosion: ' + hatches,
        };
      },
    },
    { // Hatch Cleanup
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      delaySeconds: 5,
      run: function(data) {
        delete data.hatch;
      },
    },
    { id: 'UCU Twintania P2',
      regex: /:Twintania HP at 75%/,
      regexDe: /:Twintania HP at 75%/,
      regexFr: /:Gémellia HP at 75%/,
      regexJa: /:ツインタニア HP at 75%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return {
          en: 'Phase 2 Push',
          fr: 'Phase 2 poussée',
        };
      },
    },
    { id: 'UCU Twintania P3',
      regex: /:Twintania HP at 45%/,
      regexDe: /:Twintania HP at 45%/,
      regexFr: /:Gémellia HP at 45%/,
      regexJa: /:ツインタニア HP at 45%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return {
          en: 'Phase 3 Push',
          fr: 'Phase 3 poussée',
        };
      },
    },

    // --- Nael ---
    { id: 'UCU Nael Quote 1',
      regex: /From on high I descend, in blessed light to bask/,
      regexFr: /Des cieux je vais descendre et révérer la lune/,
      infoText: {
        en: 'Spread => In',
        fr: 'Se dispercer => Dedans',
      }, 
      durationSeconds: 6,
      tts: {
        en: 'spread then in',
        fr: 'Se dispercer, puis dedans',
      },
    },
    { id: 'UCU Nael Quote 2',
      regex: /From on high I descend, mine enemies to smite/,
      regexFr: /Du haut des cieux, je vais descendre pour conquérir/,
      infoText: {
        en: 'Spread => Out',
        fr: 'Se dispercer => Dehors',
      },
      durationSeconds: 6,
      tts: {
        en: 'spread then out',
        fr: "Se dispercer, puis dehors",
      },
    },
    { id: 'UCU Nael Quote 3',
      regex: /O refulgent moon, shine down your light/,
      regexFr: /Baignez dans la bénédiction de la lune incandescente/,
      infoText: {
        en: 'Stack => In',
        fr: 'Se rassembler => Dedans',
      },
      durationSeconds: 6,
      tts: {
        en: 'stack then in',
        fr: 'Se rassembler, puis dedans',
      },
    },
    { id: 'UCU Nael Quote 4',
      regex: /Blazing path, lead me to conquest/,
      regexFr: /La voie marquée par l'incandescence mène à la domination/,
      infoText: {
        en: 'Stack => Out',
        fr: 'Se rassembler => Dehors',
      },
      durationSeconds: 6,
      tts: {
        en: 'stack then out',
        fr: "Se rassembler, puis dehors",
      },
    },
    { id: 'UCU Nael Quote 5',
      regex: /O red moon, scorch mine enemies/,
      regexFr: /Que l'incandescence de la lune brûle mes ennemis/,
      infoText: {
        en: 'In => Stack',
        fr: 'Dedans => Se rassembler',
      },
      durationSeconds: 6,
      tts: {
        en: 'in then stack',
        fr: 'Dedans, puis se rassembler',
      },
    },
    { id: 'UCU Nael Quote 6',
      regex: /O red moon, shine the path to conquest/,
      regexFr: /Ô lune! Éclaire la voie de la domination/,
      infoText: {
        en: 'In => Out',
        fr: 'Dedans => Dehors',
      },
      durationSeconds: 6,
      tts: {
        en: 'in then out',
        fr: "Dedans, puis dehors",
      },
    },
    { id: 'UCU Nael Quote 7',
      regex: /Fleeting light, score the earth with a fiery kiss/,
      regexFr: /Supernova, brille de tout ton feu et irradie la terre rougie/,
      infoText: {
        en: 'Away from Tank => Stack',
        fr: "S'éloigner du tank => Se rassembler",
      },
      durationSeconds: 6,
      delaySeconds: 4,
      tts: {
        en: 'away from tank then stack',
        fr: "S'éloigner du tank, puis se rassembler",
      },
    },
    { id: 'UCU Nael Quote 8',
      regex: /Fleeting light, outshine the stars for the moon/,
      regexFr: /Supernova, brille de tout ton feu et glorifie la lune rouge/,
      infoText: {
        en: 'Spread => Away from Tank',
        fr: "Se dispercer => S'éloigner du Tank",
      },
      durationSeconds: 6,
      delaySeconds: 4,
      tts: {
        en: 'spread then away from tank',
        fr: "Se dispercer, puis s'éloigner du tank",
      },
    },
    { id: 'UCU Nael Quote 9',
      regex: /From on high I descend, a hail of stars to bring/,
      regexFr: /Du haut des cieux, j'appelle une pluie d'étoiles/,
      durationSeconds: 9,
      infoText: {
        en: 'Spread => In',
        fr: 'Se dispercer => Dedans',
      },
      tts: {
        en: 'spread then in',
        fr: 'Se dispercer, puis dedans',
      },
    },
    { id: 'UCU Nael Quote 10',
      regex: /From red moon I descend, a hail of stars to bring/,
      regexFr: /Depuis la lune, j'invoque une pluie d'étoiles/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Spread',
        fr: 'Dedans => Se dispercer',
      },
      tts: {
        en: 'in then spread',
        fr: 'Dedans, puis se dispercer',
      },
    },
    { id: 'UCU Nael Quote 11',
      regex: /From red moon I draw steel, in my descent to bare/,
      regexFr: /De la lune je m'arme d'acier et descends/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Out => Spread',
        fr: 'Dedans => Dehors => Se dispercer',
      },
      tts: {
        en: 'in then out then spread',
        fr: 'Dedans, puis dehors, puis se dispercer',
      },
    },
    { id: 'UCU Nael Quote 12',
      regex: /From red moon I descend, upon burning earth to tread/,
      regexFr: /De la lune, je descends et marche sur la terre ardente/,
      durationSeconds: 9,
      infoText: {
        en: 'In => Spread => Stack',
        fr: 'Dedans => Se dispercer => Se rassembler',
      },
      tts: {
        en: 'in then spread then stack',
        fr: 'Dedans, puis se dispercer, puis se rassembler',
      },
    },
    { id: 'UCU Nael Quote 13',
      regex: /Gleaming steel, take fire and descend/,
      regexFr: /Ô noble acier! Rougis ardemment et deviens ma lame transperçante/,
      durationSeconds: 9,
      infoText: {
        en: 'Out => Stack => Spread',
        fr: 'Dehors => Se rassembler => Se dispercer',
      },
      tts: {
        en: 'out then stack then spread',
        fr: 'Dehors, puis se rassembler, puis se dispercer',
      },
    },
    { id: 'UCU Nael Quote 14',
      regex: /Gleaming steel, plunge and take fiery edge/,
      regexFr: /Fier acier! Sois ma lame plongeante et deviens incandescent/,
      durationSeconds: 9,
      infoText: {
        en: 'Out => Spread => Stack',
        fr: 'Dehors => Se dispercer => Se rassembler',
      },
      tts: {
        en: 'out then spread then stack',
        fr: 'Dehors, puis se dispercer, puis se rassembler',
      },
    },
    { id: 'UCU Nael Thunderstruck',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: /:Thunderwing:26C7:.*?:........:(\y{Name}):/,
      regexDe: /:Donnerschwinge:26C7:.*?:........:(\y{Name}):/,
      regexFr: /:Aile-de-foudre:26C7:.*?:........:(\y{Name}):/,
      regexJa: /:サンダーウィング:26C7:.*?:........:(\y{Name}):/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: {
        en: 'Thunder on YOU',
        fr: 'Foudre sur VOUS',
      },
      tts: {
        en: 'thunder',
        fr: 'Foudre',
      },
    },
    { id: 'UCU Nael Your Doom',
      regex: /:(\y{Name}) gains the effect of Doom from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Verhängnis from .*? for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of Glas from .*? for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of 死の宣告 from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return data.me == matches[1]; },
      durationSeconds: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) <= 6)
          return 3;
        if (data.ParseLocaleFloat(matches[2]) <= 10)
          return 6;
        return 9;
      },
      alarmText: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) <= 6)
          return {
            en: 'Doom #1 on YOU',
            fr: 'Glas #1 sur VOUS',
          };
        if (data.ParseLocaleFloat(matches[2]) <= 10)
          return {
            en: 'Doom #2 on YOU',
            fr: 'Glas #2 sur VOUS',
          };
        return {
          en: 'Doom #3 on YOU',
          fr: 'Glas #3 sur VOUS',
        };
      },
      tts: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) <= 6)
          return '1';
        if (data.ParseLocaleFloat(matches[2]) <= 10)
          return '2';
        return '3';
      },
    },
    {
      // Doom tracking init.
      regex: /:(\y{Name}) gains the effect of Doom from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Verhängnis from .*? for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of Glas from .*? for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of 死の宣告 from .*? for (\y{Float}) Seconds/,
      run: function(data, matches) {
        data.dooms = data.dooms || [null, null, null];
        var order = null;
        if (data.ParseLocaleFloat(matches[2]) < 9)
          order = 0;
        else if (data.ParseLocaleFloat(matches[2]) < 14)
          order = 1;
        else
          order = 2;
        data.dooms[order] = matches[1];
      },
    },
    {
      // Doom tracking cleanup.
      regex: /gains the effect of Doom/,
      regexDe: /gains the effect of Verhängnis/,
      regexFr: /gains the effect of Glas/,
      regexJa: /gains the effect of 死の宣告/,
      delaySeconds: 20,
      run: function(data) {
        delete data.dooms;
        delete data.doomCount;
      },
    },
    {
      id: 'UCU Nael Cleanse Callout',
      // FIXME: need translations
      regex: /:Fang of Light:26CA:/,
      regexFr: /:Croc de lumière:26CA:/,
      infoText: function(data) {
        data.doomCount = data.doomCount || 0;
        if (data.dooms)
          var name = data.dooms[data.doomCount];
        data.doomCount++;
        if (name)
          return {
            en: 'Cleanse #' + data.doomCount + ': ' + data.ShortName(name),
            fr: 'Purifié #' + data.doomCount + ': ' + data.ShortName(name),
          };
      },
    },
    { id: 'UCU Nael Fireball 1',
      regex: /:Ragnarok:26B8:/,
      regexDe: /:Ragnarök:26B8:/,
      regexFr: /:Ragnarok:26B8:/,
      regexJa: /:ラグナロク:26B8:/,
      delaySeconds: 35,
      suppressSeconds: 99999,
      infoText: {
        en: 'Fire IN',
        fr: 'Feu EN DEDANS',
      },
      tts: {
        en: 'fire in',
        fr: 'Feu en dedans',
      },
      run: function(data) { data.naelFireballCount = 1; },
    },
    { id: 'UCU Nael Fireball 2',
      regex: /:Ragnarok:26B8:/,
      regexDe: /:Ragnarök:26B8:/,
      regexFr: /:Ragnarok:26B8:/,
      regexJa: /:ラグナロク:26B8:/,
      delaySeconds: 51,
      suppressSeconds: 99999,
      infoText: function(data) {
        if (data.fireballs[1].indexOf(data.me) >= 0)
          return {
            en: 'Fire OUT',
            fr: 'Feu EN DEHORS',
          };
      },
      alertText: function(data) {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (data.fireballs[1].indexOf(data.me) == -1)
          return {
            en: 'Fire OUT: Be in it',
            fr: 'Feu EN DEHORS : Allez dessus',
          };
      },
      tts: function(data) {
        if (data.fireballs[1].indexOf(data.me) == -1)
          return {
            en: 'fire out; go with',
            fr: 'Feu en dehors; y allez',
          };
        return {
          en: 'fire out',
          fr: 'Feu en dehors',
        }
      },

      run: function(data) { data.naelFireballCount = 2; },
    },
    { id: 'UCU Nael Fireball 3',
      regex: /:Ragnarok:26B8:/,
      regexDe: /:Ragnarök:26B8:/,
      regexFr: /:Ragnarok:26B8:/,
      regexJa: /:ラグナロク:26B8:/,
      delaySeconds: 77,
      suppressSeconds: 99999,
      infoText: function(data) {
        var tookTwo = data.fireballs[1].filter(function(p) { return data.fireballs[2].indexOf(p) >= 0; });
        if (tookTwo.indexOf(data.me) >= 0)
          return;
        var str = '';
        if (tookTwo.length > 0) {
          str += ' (' + tookTwo.map(function(n) { return data.ShortName(n); }).join(', ');
          if (data.lang == 'fr')
            str += ' éviter)';
          else
            str += ' out)';
        }
        return {
          en: 'Fire IN' + str,
          fr: 'Feu EN DEDANS' + str,
        };
      },
      alertText: function(data) {
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to not stack.
        if (data.fireballs[1].indexOf(data.me) >= 0 && data.fireballs[2].indexOf(data.me) >= 0)
          return {
            en: 'Fire IN: AVOID!',
            fr: "Feu EN DEDANS : L'ÉVITER !",
          };
      },
      tts: function(data) {
        if (data.fireballs[1].indexOf(data.me) >= 0 && data.fireballs[2].indexOf(data.me) >= 0)
          return {
            en: 'avoid fire in',
            fr: 'Éviter le feu en dedans',
          };
        return {
          en: 'fire in',
          fr: 'Feu en dedans',
        }
      },
      run: function(data) { data.naelFireballCount = 3; },
    },
    { id: 'UCU Nael Fireball 4',
      regex: /:Ragnarok:26B8:/,
      regexDe: /:Ragnarök:26B8:/,
      regexFr: /:Ragnarok:26B8:/,
      regexJa: /:ラグナロク:26B8:/,
      delaySeconds: 98,
      suppressSeconds: 99999,
      preRun: function(data) {
        var tookTwo = data.fireballs[1].filter(function(p) { return data.fireballs[2].indexOf(p) >= 0; });
        var tookThree = tookTwo.filter(function(p) { return data.fireballs[3].indexOf(p) >= 0; });
        data.tookThreeFireballs = tookThree.indexOf(data.me) >= 0;
      },
      infoText: function(data) {
        if (!data.tookThreeFireballs)
          return {
            en: 'Fire IN',
            fr: 'Feu EN DEDANS',
          };
      },
      alertText: function(data) {
        // It's possible that you can take 1, 2, and 3 even if nobody dies with
        // careful ice debuff luck.  However, this means you probably shouldn't
        // take 4.
        if (data.tookThreeFireballs)
          return {
            en: 'Fire IN: AVOID!',
            fr: "Feu EN DEDANS : L'ÉVITER !",
          };
      },
      tts: function(data) {
        return {
          en: 'fire in',
          fr: 'Feu en dedans',
        };
      },
      run: function(data) { data.naelFireballCount = 4; },
    },
    {
      // FIXME: need Tail of Darkness/Fang of Light translations
      regex: /:(Iceclaw:26C6|Thunderwing:26C7|Fang of Light:26CA|Tail of Darkness:26C9|Firehorn:26C5):.*:(\y{Float}):(\y{Float}):\y{Float}:$/,
      regexFr: /:(Griffe-de-glace:26C6|Aile-de-foudre:26C7|Croc de lumière:26CA|Queue de ténèbres:26C9|Corne-de-feu:26C5):.*:(\y{Float}):(\y{Float}):\y{Float}:$/,
      condition: function(data, matches) { return !data.seenDragon || !(matches[1] in data.seenDragon); },
      run: function(data, matches) {
        // seenDragon[dragon name] => boolean
        data.seenDragon = data.seenDragon || [];
        data.seenDragon[matches[1]] = true;

        var x = data.ParseLocaleFloat(matches[2]);
        var y = data.ParseLocaleFloat(matches[3]);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        var dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        // naelDragons[direction 0-7 (N-NW)] => boolean
        data.naelDragons = data.naelDragons || [0,0,0,0,0,0,0,0];
        data.naelDragons[dir] = 1;

        if (Object.keys(data.seenDragon).length != 5)
          return;

        var output = data.findDragonMarks(data.naelDragons);
        var dir_names;
        if (data.lang == 'fr')
          dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        else
          dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = output.mark_dirs.map(function(i) { return dir_names[i]; });

        data.wideThirdDive = output.wideThirdDive;
        data.unsafeThirdMark = output.unsafeThirdMark;
        delete data.naelDragons;
        // In case you forget, print marks in the log.
        // TODO: Maybe only if Options.Debug?
        console.log(data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''));
      },
    },
    { id: 'UCU Nael Dragon Placement',
      regex: /:Iceclaw:26C6/,
      regexDe: /:Eisklaue:26C6/,
      regexFr: /:Griffe-de-glace:26C6/,
      regexJa: /:アイスクロウ:26C6/,
      condition: function(data) {
        return data.naelMarks && !data.calledNaelDragons;
      },
      durationSeconds: 12,
      infoText: function(data) {
        data.calledNaelDragons = true;
        return {
          en: 'Marks: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''),
          fr: 'Marque : ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (LARGE)' : '')
        };
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Me',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data) { return !data.trio; },
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        var marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        var dir = data.naelMarks[data.naelDiveMarkerCount];
        return {
          en: 'Go To ' + marker + ' (in ' + dir + ')',
          fr: 'Aller en ' + marker + ' (au ' + dir + ')',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Aller en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
        };
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Others',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data) { return !data.trio; },
      infoText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] == data.me)
          return;
        var num = data.naelDiveMarkerCount + 1;
        return {
          en: 'Dive #' + num + ': ' + data.ShortName(matches[1]),
          fr: 'Bombardement #' + num + ' : ' + data.ShortName(matches[1]),
        };
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Counter',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data) { return !data.trio; },
      run: function(data) {
        data.naelDiveMarkerCount++;
      },
    },
    { // Octet marker tracking (77=nael, 14=dragon, 29=baha, 2A=twin)
      regex: /1B:........:(\y{Name}):....:....:00(?:77|14|29):0000:0000:0000:/,
      condition: function(data) { return data.trio == 'octet'; },
      run: function(data, matches) {
        data.octetMarker = data.octetMarker || [];
        data.octetMarker.push(matches[1]);
        if (data.octetMarker.length != 7)
          return;

        var partyList = Object.keys(data.partyList);

        if (partyList.length != 8) {
          console.error('Octet error: bad party list size: ' + JSON.stringify(partyList));
          return;
        }
        var uniq_dict = {};
        for (var i = 0; i < data.octetMarker.length; ++i) {
          uniq_dict[data.octetMarker[i]] = true;
          if (partyList.indexOf(data.octetMarker[i]) < 0) {
            console.error('Octet error: could not find ' + data.octetMarker[i] + ' in ' + JSON.stringify(partyList));
            return;
          }
        }
        var uniq = Object.keys(uniq_dict);
        // If the number of unique folks who took markers is not 7, then
        // somebody has died and somebody took two.  Could be on anybody.
        if (uniq.length != 7)
          return;

        var remainingPlayers = partyList.filter(function(p) {
          return data.octetMarker.indexOf(p) < 0;
        });
        if (remainingPlayers.length != 1) {
          // This could happen if the party list wasn't unique.
          console.error('Octet error: failed to find player, ' + JSON.stringify(partyList) + ' ' + JSON.stringify(data.octetMarker));
          return;
        }

        // Finally, we found it!
        data.lastOctetMarker = remainingPlayers[0];
      }
    },
    { id: 'UCU Octet Nael Marker',
      regex: /1B:........:(\y{Name}):....:....:0077:0000:0000:0000:/,
      condition: function(data) { return data.trio == 'octet'; },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches[1]) + ' (nael)',
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches[1]) + ' (nael)',
        };
      },
    },
    { id: 'UCU Octet Dragon Marker',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data) { return data.trio == 'octet'; },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches[1]),
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches[1]),
        };
      },
    },
    { id: 'UCU Octet Baha Marker',
      regex: /1B:........:(\y{Name}):....:....:0029:0000:0000:0000:/,
      condition: function(data) { return data.trio == 'octet'; },
      infoText: function(data, matches) {
        return {
          en: data.octetMarker.length + ': ' + data.ShortName(matches[1]) + ' (baha)',
          fr: data.octetMarker.length + ' : ' + data.ShortName(matches[1]) + ' (baha)',
        };
      },
    },
    { id: 'UCU Octet Twin Marker',
      regex: /1B:........:(\y{Name}):....:....:0029:0000:0000:0000:/,
      condition: function(data) { return data.trio == 'octet'; },
      delaySeconds: 0.5,
      alarmText: function(data) {
        if (data.lastOctetMarker == data.me)
          return {
            en: 'YOU Stack for Twin',
            fr: 'VOUS devez appâter Gémellia',
          };
      },
      infoText: function(data) {
        if (!data.lastOctetMarker)
          return {
            en: '8: ??? (twin)',
            fr: '8 : ??? (Gémellia)',
          };
        // If this person is not alive, then everybody should stack,
        // but tracking whether folks are alive or not is a mess.
        if (data.lastOctetMarker != data.me)
          return {
            en: '8: ' + data.ShortName(data.lastOctetMarker) + ' (twin)',
            fr: '8 : ' + data.ShortName(data.lastOctetMarker) + ' (Gémellia)',
          };
      },
      tts: function(data) {
        if (!data.lastOctetMarker || data.lastOctetMarker == data.me)
          return {
            en: 'stack for twin',
            fr: 'Se rassembler pour appâter Gémellia',
          };
      },
    },
    { id: 'UCU Twister Dives',
      regex: /:Twintania:26B2:Twisting Dive:/,
      regexDe: /:Twintania:26B2:Spiralschwinge:/,
      regexFr: /:Gémellia:26B2:Plongeon-trombe:/,
      regexJa: /:ツインタニア:26B2:ツイスターダイブ:/,
      alertText: {
        en: 'Twisters',
        fr: 'Tornades',
      },
      tts: {
        en: 'twisters',
        fr: 'Tornades',
      },
    },
    { id: 'UCU Bahamut Gigaflare',
      regex: /14:26D6:Bahamut Prime starts using Gigaflare/,
      regexDe: /14:26D6:Prim-Bahamut starts using Gigaflare/,
      regexFr: /14:26D6:Primo-Bahamut starts using GigaBrasier/,
      regexJa: /14:26D6:バハムート・プライム starts using ギガフレア/,
      alertText: {
        en: 'Gigaflare',
        fr: 'GigaBrasier',
      },
      tts: {
        en: 'gigaflare',
        fr: 'Giga Brasier',
      },
    },
    {
      id: 'UCU Megaflare Stack Me',
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: {
        en: 'Megaflare Stack',
        fr: 'MegaBrasier rassemblement',
      },
      tts: {
        en: 'stack',
        fr: 'Se rassembler',
      },
    },
    { // Megaflare stack tracking
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      run: function(data, matches) {
        data.megaStack.push(matches[1]);
      },
    },
    {
      id: 'UCU Megaflare Tower',
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      infoText: function(data) {
        if (data.trio != 'blackfire' && data.trio != 'octet' || data.megaStack.length != 4)
          return;
        if (data.megaStack.indexOf(data.me) >= 0)
          return;
        if (data.trio == 'blackfire')
          return {
            en: 'Tower, bait hypernova',
            fr: 'Tour, appâter Supernova',
          };
        if (!data.lastOctetMarker || data.lastOctetMarker == data.me)
          return {
            en: 'Bait Twin, then tower',
            fr: 'Appâter Gémellia, puis tour',
          };
        return {
          en: 'Get in a far tower',
          fr: 'Aller dans une tour lointaine',
        };
      },
      tts: function(data) {
        if (data.trio != 'blackfire' && data.trio != 'octet' || data.megaStack.length != 4)
          return;
        if (data.megaStack.indexOf(data.me) == -1) {
          return {
            en: 'tower',
            fr: 'Tour',
          };
        }
      },
    },
    {
      id: 'UCU Earthshaker Me',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: {
        en: 'Earthshaker on YOU',
        fr: 'Secousse sur VOUS',
      },
      tts: {
        en: 'shaker',
        fr: 'Secousse',
      },
    },
    { // Earthshaker tracking
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      run: function(data, matches) {
        data.shakers.push(matches[1]);
      },
    },
    {
      id: 'UCU Earthshaker Not Me',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      alertText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank')
            return {
             en: 'Pick up tether',
             fr: 'Prendre un lien',
            };
        }
      },
      infoText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.shakers.indexOf(data.me) == -1 && data.role != 'tank')
            return {
              en: 'No shaker; stack south.',
              fr: 'Pas de Secousse; se rassembler au Sud.',
            };
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            if (data.shakers.indexOf(data.me) == -1) {
              return {
                en: 'Stack on safe spot',
                fr: 'Se rassembler au point sauf',
              };
            }
          }
        }
      },
      tts: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank')
            return {
              en: 'tether',
              fr: 'Lien',
            };
          if (data.shakers.indexOf(data.me) == -1)
            return {
              en: 'stack south',
              fr: 'Se rassembler au sud',
            };
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            if (!(data.me in data.shakers)) {
              return {
                en: 'safe spot',
                fr: 'Point sauf',
              };
            }
          }
        }
      },
      run: function(data) {
        if (data.trio == 'tenstrike' && data.shakers.length == 4) {
          data.shakers = [];
        }
      },
    },
    {
      id: 'UCU Morn Afah',
      regex: / 14:26EC:Bahamut Prime starts using Morn Afah on (\y{Name})/,
      regexDe: / 14:26EC:Prim-Bahamut starts using Morn Afah on (\y{Name})/,
      regexFr: / 14:26EC:Primo-Bahamut starts using Morn Afah on (\y{Name})/,
      regexJa: / 14:26EC:バハムート・プライム starts using モーン・アファー on (\y{Name})/,
      preRun: function(data) {
        data.mornAfahCount = data.mornAfahCount || 0;
        data.mornAfahCount++;
      },
      alertText: function(data, matches) {
        var str = 'Morn Afah #' + data.mornAfahCount;
        if (matches[1] == data.me)
          return {
            en: str + ' (YOU)',
            fr: str + ' (VOUS)',
          };
        return str + ' (' + data.ShortName(matches[1]) + ')';
      },
      tts: function(data, matches) {
        return 'morn afah ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'UCU Akh Morn',
      regex: / 14:26EA:Bahamut Prime starts using Akh Morn on (\y{Name})/,
      regexDe: / 14:26EA:Prim-Bahamut starts using Akh Morn on (\y{Name})/,
      regexFr: / 14:26EA:Primo-Bahamut starts using Akh Morn on (\y{Name})/,
      regexJa: / 14:26EA:バハムート・プライム starts using アク・モーン on (\y{Name})/,
      preRun: function(data) {
        data.akhMornCount = data.akhMornCount || 0;
        data.akhMornCount++;
      },
      infoText: function(data, matches) {
        return 'Akh Morn #' + data.akhMornCount;
      },
      tts: function(data, matches) {
        return 'akh morn ' + data.akhMornCount;
      },
    },
    {
      id: 'UCU Exaflare',
      regex: /14:26EF:Bahamut Prime starts using Exaflare/,
      regexDe: /14:26EF:Prim-Bahamut starts using Exaflare/,
      regexFr: /14:26EF:Primo-Bahamut starts using ExaBrasier/,
      regexJa: /14:26EF:バハムート・プライム starts using エクサフレア/,
      preRun: function(data) {
        data.exaflareCount = data.exaflareCount || 0;
        data.exaflareCount++;
      },
      infoText: function(data, matches) {
        return {
          en: 'Exaflare #' + data.exaflareCount,
          fr: 'ExaBrasier #' + data.exaflareCount,
        };
      },
      tts: function(data, matches) {
        return {
          en: 'exaflare ' + data.exaflareCount,
          fr: 'Exabrasier '+ data.exaflareCount,
        };
      },
    },
    {
      // One time setup.
      id: 'UCU Initial Setup',
      regex: /:26AA:Twintania starts using/,
      regexDe: /:26AA:Twintania starts using/,
      regexFr: /:26AA:Gémellia starts using/,
      regexJa: /:26AA:ツインタニア starts using/,
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
        var modDistance = function(mark, dragon) {
          var oneWay = (dragon - mark + 8) % 8;
          var otherWay = (mark - dragon + 8) % 8;
          var distance = Math.min(oneWay, otherWay);
          console.assert(distance >= 0);
          return distance;
        };

        var badSpots = function(mark, dragon) {
          // All spots between mark and dragon are bad.  If distance == 1,
          // then the dragon hits the spot behind the mark too.  e.g. N
          // mark, NE dragon will also hit NW.
          var bad = [];
          var distance = modDistance(mark, dragon);
          console.assert(distance > 0);
          console.assert(distance <= 2);
          if ((mark + distance + 8) % 8 == dragon) {
            // Clockwise.
            for (var i = 0; i <= distance; ++i)
              bad.push((mark + i) % 8);
            if (distance == 1)
              bad.push((mark - 1 + 8) % 8);
          } else {
            // Widdershins.
            for (var i = 0; i <= distance; ++i)
              bad.push((mark - i + 8) % 8);
            if (distance == 1)
              bad.push((mark + 1) % 8);
          }
          return bad;
        };

        var findDragonMarks = function(array) {
          var marks = [-1, -1, -1];
          var ret = {
            // Third drive is on a dragon three squares away and will cover
            // more of the middle than usual, e.g. SE dragon, SW dragon,
            // mark W (because S is unsafe from 2nd dive).
            wideThirdDive:  false,
            // Third mark spot is covered by the first dive so needs to be
            // patient.  Third mark should always be patient, but you never
            // know.
            unsafeThirdMark: false,
            marks: ['error', 'error', 'error'],
          };

          var dragons = [];
          for (var i = 0; i < 8; ++i) {
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
            var distance = marks[1] == dragons[2] - 1 ? 2 : 4;
            if (dragons[3] >= dragons[2] + distance) {
              marks[2] = dragons[3] - 1;
            }
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

          var bad = badSpots(marks[0], dragons[0]);
          bad.concat(badSpots(marks[0], dragons[1]));
          ret.unsafeThirdMark = bad.indexOf(marks[2]) != -1;

          var dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          ret.marks = marks.map(function(i) { return dir_names[i]; });
          ret.mark_dirs = dir_names;
          return ret;
        };
        // End copy and paste.

        data.findDragonMarks = findDragonMarks;
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
      replaceSync: {
        'Bahamut Prime': 'Prim-Bahamut',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Deus Darnus': 'Nael Deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Oviform': 'Magiekompressor',
        'Ragnarok': 'Ragnarök',
        'Thunderwing': 'Donnerschwinge',
        'Twintania': 'Twintania',
        // FIXME:
        'Tail of Darkness': 'Tail of Darkness',
        'Fang of Light': 'Fang of Light',
      },
      replaceText: {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aetheric Profusion': 'Ätherische Profusion',
        'Akh Morn': 'Akh Morn',
        "Bahamut's Claw": "Klauen Bahamuts",
        "Bahamut's Favor": "Bahamuts Segen",
        'Blackfire Trio': 'Schwarzfeuer-Trio',
        'Calamitous Blaze': 'Katastrophale Lohe',
        'Calamitous Flame': 'Katastrophale Flammen',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Death Sentence': 'Todesurteil',
        'Deathstorm': 'Todessturm',
        'Earth Shaker': 'Erdstoß',
        'Engage!': 'Start!',
        'Enrage': 'Finalangriff',
        'Exaflare': 'Exaflare',
        'Fellruin Trio': 'Untergangs-Trio',
        'Fireball': 'Feuerball',
        'Flames Of Rebirth': 'Flammen Der Wiedergeburt',
        'Flare Breath': 'Flare-Atem',
        'Flatten': 'Einebnen',
        'Generate': 'Formung',
        'Gigaflare': 'Gigaflare',
        'Grand Octet': 'Großes Oktett',
        'Hatch': 'Austritt',
        'Heavensfall(?! )': 'Himmelssturz',
        'Heavensfall Trio': 'Himmelssturz-Trio',
        'Hypernova': 'Supernova',
        'Iceball': 'Eisball',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Liquid Hell': 'Höllenschmelze',
        'Lunar Dive': 'Lunarer Sturz',
        'Lunar Dynamo': 'Lunarer Dynamo',
        'Megaflare': 'Megaflare',
        'Megaflare Dive': 'Megaflare-Sturz',
        'Meteor Stream': 'Meteorflug',
        'Morn Afah': 'Morn Afah',
        'Plummet': 'Herabstürzen',
        'Quickmarch Trio': 'Todesmarsch-Trio',
        'Raven Dive': 'Bahamuts Schwinge',
        'Ravensbeak': 'Bradamante',
        'Seventh Umbral Era': 'Siebte Ära Des Schattens',
        'Tempest Wing': 'Sturm-Schwinge',
        'Tenstrike Trio': 'Zehnschlag-Trio',
        'Teraflare': 'Teraflare',
        'Thermionic Beam': 'Thermionischer Strahl',
        'Thermionic Burst': 'Thermionische Eruption',
        'Twister': 'Wirbelsturm',
        'Twisting Dive': 'Spiralschwinge',
        'White Fury': 'Naels Zorn',
        'Wings Of Salvation': 'Rettende Schwinge',
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
        "Phoenix's Blessing": "Stärke Des Phönix",
        'Piercing Resistance Down II': 'Stichresistenz - (stark)',
        'Slashing Resistance Down II': 'Hiebresistenz - (stark)',
        'Thunderstruck': 'Donnerschwinge',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        'Bahamut Prime': 'Primo-Bahamut',
        'Fang of Light': 'Croc de lumière',
        'Firehorn': 'Corne-de-feu',
        'Iceclaw': 'Griffe-de-glace',
        'Nael Deus Darnus': 'Nael Deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Oviform': 'Oviforme',
        'Ragnarok': 'Ragnarok',
        'Tail of Darkness': 'Queue de ténèbres',
        'Thunderwing': 'Aile-de-foudre',
        'Twintania': 'Gémellia',
      },
      replaceText: {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--synchronisation--',
        "--push--": '--poussé(e)--',
        "--untargetable--": '--impossible à cibler--',
        '--targetable--': '--ciblable--',
          
        "Targeted Fire": 'Feu ciblé',
        "Enrage": 'Enragement',
        "Dynamo + Beam/Chariot": 'Dynamo + Rayon/Char',
        "Thermionic + Dynamo/Chariot": 'Rayon + Dynamo/Char',
        "Dive + Dynamo/Chariot": 'Plongeon + Dynamo/Char',
        "Marker": 'Marqueur',
        "Divebomb": 'Bombardement',
        "Meteor/Dive or Dive/Beam": 'Météore/Plongeon ou Plongeon/Rayon',
        "Random Combo Attack": 'Attaque combo aléatoire',
        "Stack": 'Se rassembler',
        "Towers": 'Tours',
        "Dive Dynamo Combo": 'Plongeon Dynamo Combo',
        "Markers appear": 'Apparition des marqueurs',
        "Fireball Soak": 'Absorption Boule De Feu',
        "Nael Marker": 'Marqueur de Nael',
        "Nael Dive": 'Plongeon de Nael',
        "Bahamut Marker": 'Marqueur de Bahamut',
        "Twin Marker": 'Marqueur de Gémellia',
        "Plummet/Claw": 'Piqué/Griffe',
        "Triple Nael Quote": 'Triple citation de Nael',
        "Sentence/Ravensbeak": 'Peine De Mort/Bec Du Rapace',
          
        "Aetheric Profusion": "Excès D'éther",
        'Akh Morn': 'Akh Morn',
        "Bahamut's Claw": "Griffe De Bahamut",
        "Bahamut's Favor": "Auspice Du Dragon",
        'Blackfire Trio': 'Trio Des Flammes Noires',
        'Calamitous Blaze': 'Brasier Du Fléau',
        'Calamitous Flame': 'Flammes Du Fléau',
        'Cauterize': 'Cautérisation',
        "Chain Lightning": "Chaîne D'éclairs",
        'Dalamud Dive': 'Chute De Dalamud',
        'Death Sentence': 'Peine De Mort',
        'Deathstorm': 'Tempête De La Mort',
        'Earth Shaker': 'Secousse',
        "Engage!": "À l'attaque",
        'Exaflare': 'ExaBrasier',
        'Fellruin Trio': 'Trio Du Désastre',
        'Fireball': 'Boule De Feu',
        'Flames Of Rebirth': 'Feu Résurrecteur',
        'Flare Breath': 'Souffle Brasier',
        'Flatten': 'Compression',
        'Generate': 'Synthèse De Mana',
        'Gigaflare': 'GigaBrasier',
        'Grand Octet': 'Octuors Des Dragons',
        'Hatch': 'Explosion De Mana',
        'Heavensfall(?! )': 'Destruction Universelle',
        "Heavensfall Trio": "Trio De L'univers",
        'Hypernova': 'Supernova',
        'Iceball': 'Orbe De Glace',
        'Iron Chariot': 'Char De Fer',
        'Liquid Hell': 'Enfer Liquide',
        'Lunar Dive': 'Plongeon Lunaire',
        'Lunar Dynamo': 'Dynamo Lunaire',
        'Megaflare': 'MégaBrasier',
        'Megaflare Dive': 'Plongeon MégaBrasier',
        'Meteor Stream': 'Rayon Météore',
        'Morn Afah': 'Morn Afah',
        'Plummet': 'Piqué',
        'Quickmarch Trio': 'Trio De La Marche Militaire',
        'Raven Dive': 'Fonte Du Rapace',
        'Ravensbeak': 'Bec Du Rapace',
        'Seventh Umbral Era': '7e Fléau',
        'Tempest Wing': 'Aile De Tempête',
        'Tenstrike Trio': 'Trio Des Attaques',
        'Teraflare': 'TéraBrasier',
        'Thermionic Beam': 'Rayon Thermoïonique',
        'Thermionic Burst': 'Rafale Thermoïonique',
        'Twister': 'Grande Trombe',
        'Twisting Dive': 'Plongeon-trombe',
        'White Fury': 'Colère De Nael',
        'Wings Of Salvation': 'Aile De La Salvation',
      },
      '~effectNames': {
        'Doom': 'Glas',
        'Down For The Count': 'Au Tapis',
        'Earth Resistance Down II': 'Résistance à La Terre Réduite+',
        'Firescorched': 'Corne-de-feu',
        'Icebitten': 'Griffe-de-glace',
        'Lohs Daih': 'Lohs Daih',
        'Mana Hypersensitivity': 'Hypersensibilité à La Mana',
        'Neurolink': 'Neurolien',
        "Phoenix's Blessing": "Protection De Phénix",
        'Piercing Resistance Down II': 'Résistance Au Perforant Réduite+',
        'Slashing Resistance Down II': 'Résistance Au Tranchant Réduite+',
        'Thunderstruck': 'Aile-de-foudre',
      },
    },
    {
      locale: 'ja',
      replaceSync: {
        'Bahamut Prime': 'バハムート・プライム',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Deus Darnus': 'ネール・デウス・ダーナス',
        'Nael Geminus': 'ネール・ジェミナス',
        'Oviform': '魔力圧縮体',
        'Ragnarok': 'ラグナロク',
        'Thunderwing': 'サンダーウィング',
        'Twintania': 'ツインタニア',
        // FIXME:
        'Tail of Darkness': 'Tail of Darkness',
        'Fang of Light': 'Fang of Light',
      },
      replaceText: {
        'Aetheric Profusion': 'エーテリックプロフュージョン',
        'Akh Morn': 'アク・モーン',
        "Bahamut's Claw": "バハムートクロウ",
        "Bahamut's Favor": "龍神の加護",
        'Blackfire Trio': '黒炎の三重奏',
        'Calamitous Blaze': '災いの焔',
        'Calamitous Flame': '災いの炎',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Death Sentence': 'デスセンテンス',
        'Deathstorm': 'デスストーム',
        'Earth Shaker': 'アースシェイカー',
        'Engage!': '戦闘開始！',
        'Exaflare': 'エクサフレア',
        'Fellruin Trio': '厄災の三重奏',
        'Fireball': 'ファイアボール',
        'Flames Of Rebirth': '転生の炎',
        'Flare Breath': 'フレアブレス',
        'Flatten': 'フラッテン',
        'Generate': '魔力錬成',
        'Gigaflare': 'ギガフレア',
        'Grand Octet': '群竜の八重奏',
        'Hatch': '魔力爆散',
        'Heavensfall(?! )': '天地崩壊',
        'Heavensfall Trio': '天地の三重奏',
        'Hypernova': 'スーパーノヴァ',
        'Iceball': 'アイスボール',
        'Iron Chariot': 'アイアンチャリオット',
        'Liquid Hell': 'ヘルリキッド',
        'Lunar Dive': 'ルナダイブ',
        'Lunar Dynamo': 'ルナダイナモ',
        'Megaflare': 'メガフレア',
        'Megaflare Dive': 'メガフレアダイブ',
        'Meteor Stream': 'メテオストリーム',
        'Morn Afah': 'モーン・アファー',
        'Plummet': 'プラメット',
        'Quickmarch Trio': '進軍の三重奏',
        'Raven Dive': 'レイヴンダイブ',
        'Ravensbeak': 'レイヴェンズビーク',
        'Seventh Umbral Era': '第七霊災',
        'Tempest Wing': 'テンペストウィング',
        'Tenstrike Trio': '連撃の三重奏',
        'Teraflare': 'テラフレア',
        'Thermionic Beam': 'サーミオニックビーム',
        'Thermionic Burst': 'サーミオニックバースト',
        'Twister': 'ツイスター',
        'Twisting Dive': 'ツイスターダイブ',
        'White Fury': 'ネールの憤怒',
        'Wings Of Salvation': 'サルヴェーションウィング',
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
        "Phoenix's Blessing": "フェニックスの加護",
        'Piercing Resistance Down II': '突属性耐性低下[強]',
        'Slashing Resistance Down II': '斬属性耐性低下［強］',
        'Thunderstruck': 'サンダーウィング',
      },
    },
  ],
}]

'use strict';

// In your cactbot/user/raidboss.js file, add the line:
//   Options.cactbote8sUptimeKnockbackStrat = true;
// .. if you want cactbot to callout Mirror Mirror 4's double knockback
// Callout happens during/after boss turns and requires <1.4s reaction time
// to avoid both Green and Read Mirror knockbacks.
// Example: https://clips.twitch.tv/CreativeDreamyAsparagusKlappa
// Group splits into two groups behind boss after the jump.
// Tanks adjust to where the Red and Green Mirror are located.
// One tank must be inbetween the party, the other closest to Greem Mirror.
// Once Green Mirror goes off, the tanks adjust for Red Mirror.

// TODO: figure out *anything* with mirrors and mirror colors
// TODO: yell at you to take the last tower for Light Rampant if needed
// TODO: yell at you to take the last tower for Icelit Dragonsong if needed
// TODO: House of light clock position callout
// TODO: Light Rampant early callouts (who has prox marker, who gets aoes)
// TODO: reflected scythe kick callout (stand by mirror)
// TODO: reflected axe kick callout (get under)
// TODO: callouts for initial Hallowed Wings mirrors?
// TODO: callouts for the stack group mirrors?
// TODO: icelit dragonsong callouts?

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  timelineFile: 'e8s.txt',
  timelineTriggers: [
    {
      id: 'E8S Shining Armor',
      regex: /(?<!Reflected )Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Reflected Armor',
      regex: /Reflected Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Frost Armor',
      // Not the reflected one, as we want the "move" call there
      // which will happen naturally from `Reflected Drachen Armor`.
      regex: /^Frost Armor$/,
      beforeSeconds: 2,
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'E8S Rush',
      regex: /Rush \d/,
      beforeSeconds: 5,
      infoText: function(data) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return {
          en: 'Tether ' + data.rushCount,
          de: 'Verbindung ' + data.rushCount,
          fr: 'Lien ' + data.rushCount,
          ko: '선: ' + data.rushCount,
          cn: '和' + data.rushCount + '连线',
        };
      },
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DCC', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DCC', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost First Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      condition: function(data) {
        // Have not seen any frost yet.
        return !data.firstFrost;
      },
      // This cast is 5 seconds, so don't muddy the back/front call.
      // But also don't wait too long to give directions?
      delaySeconds: 2,
      infoText: {
        // Sorry, there are no mirror colors in the logs (YET),
        // and so this is the best that can be done.
        en: 'Go Back, Red Mirror Side',
        de: 'Nach Hinten gehen, Seite des roten Spiegels',
        fr: 'Allez derrière, côté miroir rouge',
        ko: '빨간 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Driving Frost First Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      condition: function(data) {
        return !data.firstFrost;
      },
      // See comments on Biting Frost First Mirror above.
      delaySeconds: 2,
      infoText: {
        en: 'Go Front, Green Mirror Side',
        fr: 'Allez devant, côté miroir vert',
        de: 'Nach Vorne gehen, Seite des grünen Spiegels',
        ko: '초록 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Reflected Frost 1',
      regex: Regexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
      regexDe: Regexes.ability({ source: 'Eisspiegel', id: '4DB[78]', capture: false }),
      regexFr: Regexes.ability({ source: 'miroir de glace', id: '4DB[78]', capture: false }),
      regexJa: Regexes.ability({ source: '氷面鏡', id: '4DB[78]', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Swap Sides',
        de: 'Seiten wechseln',
        fr: 'Changez de côté',
        ko: '반대로 이동',
      },
    },
    {
      id: 'E8S Biting Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      response: Responses.getBehind(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      alertText: {
        en: 'Go Front / Sides',
        de: 'Gehe nach Vorne/ zu den Seiten',
        fr: 'Allez Devant / Côtés',
        ko: '앞 / 양옆으로',
        cn: '去前侧方',
      },
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6[67]', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6[67]', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6[67]', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 43,
      suppressSeconds: 80,
      infoText: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            ko: '다음: Biting/スラッシュ',
            cn: '下次攻击前侧方',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          ko: '다음: Driving/スラスト',
          cn: '下次攻击后方',
        };
      },
      tts: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            ko: '다음: 바이팅 스라슈',
            cn: '下次攻击前侧方',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          ko: '다음: 드라이빙 스라스토',
          cn: '下次攻击后方',
        };
      },
    },
    {
      id: 'E8S Diamond Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Icicle Impact',
      regex: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexDe: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexFr: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexJa: Regexes.abilityFull({ source: 'シヴァ', id: '4DA0' }),
      regexCn: Regexes.abilityFull({ source: '希瓦', id: '4DA0' }),
      regexKo: Regexes.abilityFull({ source: '시바', id: '4DA0' }),
      suppressSeconds: 20,
      infoText: function(data, matches) {
        let x = parseFloat(matches.x);
        if (x >= 99 && x <= 101) {
          return {
            en: 'North / South',
            de: 'Norden / Süden',
            fr: 'Nord / Sud',
            ko: '남 / 북',
            cn: '南北站位',
          };
        }
        return {
          en: 'East / West',
          de: 'Osten / Westen',
          fr: 'Est / Ouest',
          ko: '동 / 서',
          cn: '东西站位',
        };
      },
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4D6C', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4D6C', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4D6C', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse',
        de: 'Reinigen',
        fr: 'Guérison',
        ko: '에스나',
        cn: '驱散',
      },
    },
    {
      id: 'E8S Double Slap',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D65' }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D65' }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6D', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6D', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D73', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D73', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Refulgent Chain',
      regex: Regexes.tether({ id: '006E' }),
      condition: function(data, matches) {
        switch (data.options.e8sLightRampantStrat) {
        case 'sharingan':
          data.rampant = data.rampant || {
            chainCount: 0,
            chains: {},
          };

          data.rampant.chains[matches.source] = data.rampant.chains[matches.source] || [];
          data.rampant.chains[matches.source].push(matches.target);
          data.rampant.chains[matches.target] = data.rampant.chains[matches.target] || [];
          data.rampant.chains[matches.target].push(matches.source);

          // Need to track chains this way instead of counting sources on the object
          // because the trigger will fire for both the third and fourth chain, and
          // the third firing will have incomplete data
          ++data.rampant.chainCount;

          return data.rampant.chainCount === 4;
        }

        return data.me == matches.source;
      },
      response: function(data, matches) {
        switch (data.options.e8sLightRampantStrat) {
        case 'sharingan': {
          let jobPriority = (job) => {
            return ([
              'GNB', 'DRK', 'WAR', 'PLD', // Tank Northwest
              'SCH', 'WHM', 'AST', // Healer Northeast
              'MNK', 'DRG', 'NIN', 'SAM', // Melee Southwest
              'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', // Ranged Southeast
            ].indexOf(job));
          };
          let chains = Object.keys(data.rampant.chains).sort((a, b) => {
            return jobPriority(data.party.jobName(a)) - jobPriority(data.party.jobName(b));
          });

          // now chains[0] = tank, chains[1] = healer, chains[2] = melee DPS, chains[3] ranged DPS
          // spots = 0, 1, 2, 3 equivalent to nw, ne, se, sw

          let tank = chains[0];

          let ret;
          let alertFor;

          if (!data.rampant.chains[tank].includes(chains[2])) {
            // Box formation (no link to SE), tank swaps with SE
            ret = {
              en: 'Chain: Tank SE',
            };
            alertFor = [tank, chains[2]];
          } else if (!data.rampant.chains[tank].includes(chains[3])) {
            // Hourglass formation (no link to SW), tank swaps with SW
            ret = {
              en: 'Chain: Tank SW',
            };
            alertFor = [tank, chains[3]];
          } else {
            // Bowtie formation, tank stays
            ret = {
              en: 'Chain: Tank NW',
            };
          }

          // If we need to move, alert us, otherwise just show info
          if (alertFor.includes(data.me)) {
            return {
              alertText: ret,
            };
          }
          // This is intentionally showing for all players
          // not just players with chains, for callout purposes
          return {
            infoText: ret,
          };
        }
        }
        return {
          infoText: {
            en: 'Chain on YOU',
            de: 'Kette auf DIR',
            fr: 'Chaîne sur VOUS',
            ko: '사슬 대상자',
            cn: '连线',
          },
        };
      },
      run: function(data) {
        // Clean up for later
        delete data.rampant.chains, data.rampant.chainCount;
      },
    },
    {
      id: 'E8S Holy Light',
      regex: Regexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      promise: function(data, matches) {
        if (data.options.e8sLightRampantStrat === undefined || data.options.e8sLightRampantStrat === 'none')
          return null;

        // Orbs spawn at combat start but are not moved into position until the tethers go out
        // So we need to fetch up-to-date position info from the game client
        let p = new Promise(async (res) => {
          let combatantData = await window.callOverlayHandler({
            call: 'getCombatants',
            ids: [matches.sourceId],
          });
          data.rampant = data.rampant || {};
          if (combatantData === null ||
            !combatantData.combatants ||
            !combatantData.combatants.length) {
            res();
            return;
          }
          data.rampant.orb = combatantData.combatants.pop();
          res();
        });
        return p;
      },
      infoText: function(data) {
        switch (data.options.e8sLightRampantStrat) {
        case 'sharingan':
          if (data.rampant.orb) {
            if (data.rampant.orb.PosX > 105) {
              return {
                en: 'Bait orb West',
              };
            } else if (data.rampant.orb.PosX < 95) {
              return {
                en: 'Bait orb East',
              };
            } else if (data.rampant.orb.PosY > 105) {
              return {
                en: 'Bait orb South',
              };
            } else if (data.rampant.orb.PosY < 95) {
              return {
                en: 'Bait orb North',
              };
            }
            break;
          }
        }
        return {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          ko: '구슬 대상자',
          cn: '拉球',
        };
      },
      run: function(data) {
        // Clean up for later
        delete data.rampant.orb;
      },
    },
    {
      id: 'E8S Banish III',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D80', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D80', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D80', capture: false }),
      response: Responses.stack('info'),
    },
    {
      id: 'E8S Banish III Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D81', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D81', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Akh Morn',
      regex: Regexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'] }),
      regexDe: Regexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'] }),
      regexFr: Regexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'] }),
      regexJa: Regexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'] }),
      preRun: function(data, matches) {
        data.akhMornTargets = data.akhMornTargets || [];
        data.akhMornTargets.push(matches.target);
      },
      response: function(data, matches) {
        if (data.me == matches.target) {
          let onYou = {
            en: 'Akh Morn on YOU',
            fr: 'Akh Morn sur VOUS',
            ko: '아크몬 대상자',
          };
          // It'd be nice to have this be an alert, but it mixes with a lot of
          // other alerts (akh rhai "move" and worm's lament numbers).
          if (data.role == 'tank')
            return { infoText: onYou };
          return { alarmText: onYou };
        }
        if (data.akhMornTargets.length != 2)
          return;
        if (data.akhMornTargets.includes(data.me))
          return;
        return {
          infoText: {
            en: 'Akh Morn: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            fr: 'Akh Morn : ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
          },
        };
      },
    },
    {
      id: 'E8S Akh Morn Cleanup',
      regex: Regexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'], capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'], capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'], capture: false }),
      regexJa: Regexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'], capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.akhMornTargets;
      },
    },
    {
      id: 'E8S Morn Afah',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7B' }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7B' }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7B' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Morn Afah on YOU',
            de: 'Morn Afah auf DIR',
            fr: 'Morn Afah sur VOUS',
            ko: '몬아파 대상자',
            cn: '无尽顿悟点名',
          };
        }
        if (data.role == 'tank' || data.role == 'healer' || data.CanAddle()) {
          return {
            en: 'Morn Afah on ' + data.ShortName(matches.target),
            de: 'Morn Afah auf ' + data.ShortName(matches.target),
            fr: 'Morn Afah sur ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 몬 아파',
            cn: '无尽顿悟点名' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D75', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D75', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D76', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D76', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D76', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E8S Hallowed Wings Knockback',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D77', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D77', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D77', capture: false }),
      condition: function(data) {
        return data.options.cactbote8sUptimeKnockbackStrat;
      },
      // This gives a warning within 1.4 seconds, so you can hit arm's length.
      delaySeconds: 8.6,
      durationSeconds: 1.4,
      response: Responses.knockback(),
    },
    {
      id: 'E8S Wyrm\'s Lament',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      regex: Regexes.gainsEffect({ effect: 'Wyrmclaw' }),
      regexDe: Regexes.gainsEffect({ effect: 'Krallen Des Heiligen Drachen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Griffes du Dragon divin' }),
      regexJa: Regexes.gainsEffect({ effect: '聖竜の爪' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmclawNumber = {
            '14': 1,
            '22': 2,
            '30': 3,
            '38': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmclawNumber = {
            '22': 1,
            '38': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Red #' + data.wyrmclawNumber,
          de: 'Rot #' + data.wyrmclawNumber,
          fr: 'Rouge #' + data.wyrmclawNumber,
          ko: '빨강 ' + data.wyrmclawNumber + '번',
          cn: '红色 #' + data.wyrmclawNumber,
        };
      },
    },
    {
      id: 'E8S Wyrmfang',
      regex: Regexes.gainsEffect({ effect: 'Wyrmfang' }),
      regexDe: Regexes.gainsEffect({ effect: 'Reißzähne Des Heiligen Drachen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Crocs du Dragon divin' }),
      regexJa: Regexes.gainsEffect({ effect: '聖竜の牙' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmfangNumber = {
            '20': 1,
            '28': 2,
            '36': 3,
            '44': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmfangNumber = {
            '28': 1,
            '44': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Blue #' + data.wyrmfangNumber,
          de: 'Blau #' + data.wyrmfangNumber,
          fr: 'Bleu #' + data.wyrmfangNumber,
          ko: '파랑 ' + data.wyrmfangNumber + '번',
          cn: '蓝色 #' + data.wyrmfangNumber,
        };
      },
    },
    {
      id: 'E8S Drachen Armor',
      regex: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4DD2', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4DD2', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4DD2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Reflected Drachen Armor',
      regex: Regexes.ability({ source: 'Frozen Mirror', id: '4DC2', capture: false }),
      regexDe: Regexes.ability({ source: 'Eisspiegel', id: '4DC2', capture: false }),
      regexFr: Regexes.ability({ source: 'Miroir De Glace', id: '4DC2', capture: false }),
      regexJa: Regexes.ability({ source: '氷面鏡', id: '4DC2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Holy',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D82', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D82', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D83', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D83', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D83', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D68', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D68', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D68', capture: false }),
      alertText: {
        en: 'Back Then Front',
        de: 'Nach Hinten, danach nach Vorne',
        fr: 'Derrière puis devant',
        ko: '뒤로 => 앞으로',
        cn: '后 => 前',
      },
    },
    {
      id: 'E8S Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D69', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D69', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D69', capture: false }),
      alertText: {
        en: 'Front Then Back',
        de: 'Nach Vorne, danach nach Hinten',
        fr: 'Devant puis derrière',
        ko: '앞으로 => 뒤로',
        cn: '前 => 后',
      },
    },
    {
      id: 'E8S Spiteful Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D70', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D70', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4D7D', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4D7D', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4D7D', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse DPS Only',
        de: 'Nur DPS reinigen',
        fr: 'Guérison sur les DPS seulement',
        ko: '딜러만 에스나',
        cn: '驱散DPS',
      },
    },
    {
      id: 'E8S Banish',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7E', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Stack in Tower',
        de: 'Auf Tank im Turm sammeln',
        fr: 'Package tanks dans les tours',
        cn: '坦克塔内分摊',
        ko: '탱커 집합',
      },
    },
    {
      id: 'E8S Banish Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7F', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Spread in Tower',
        cn: '坦克塔内分散',
        de: 'Tank im Turm verteilen',
        fr: 'Dispersion tanks dans les tours',
        ko: '탱커 산개',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Luminous Aether': 'Lichtäther',
        'holy light': 'heilig(?:e|er|es|en) Licht',
        'great wyrm': 'Körper des heiligen Drachen',
        'Frozen Mirror': 'Eisspiegel',
        'Electric Aether': 'Blitzäther',
        'Earthen Aether': 'Erdäther',
        'Aqueous Aether': 'Wasseräther',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Urkristall',
      },
      'replaceText': {
        'The Path Of Light': 'Pfad des Lichts',
        'The House Of Light': 'Tsunami des Lichts',
        'Wyrm\'s Lament': 'Brüllen des heiligen Drachen',
        'Twin Stillness': 'Zwillingsschwerter der Stille',
        'Stoneskin': 'Steinhaut',
        'Spiteful Dance': 'Kalter Tanz',
        'Skyfall': 'Vernichtung der Welt',
        'Shock Spikes': 'Schockstachel',
        'Shining Armor': 'Funkelnde Rüstung',
        'Shattered World': 'Zersplitterte Welt',
        'Scythe Kick': 'Abwehrtritt',
        'Rush': 'Sturm',
        'Reflected Shining Armor': 'Spiegelung: Funkelnde Rüstung',
        'Reflected Scythe Kick': 'Spiegelung: Abwehrtritt',
        'Reflected Hallowed Wings': 'Spiegelung: Heilige Schwingen',
        'Reflected Frost Armor': 'Spiegelung: Frostrüstung',
        'Reflected Drachen Armor': 'Spiegelung: Drachenrüstung',
        'Reflected Biting Frost': 'Spiegelung: Frosthieb',
        'Morn Afah': 'Morn Afah',
        'Mirror, Mirror': 'Spiegelland',
        'Longing of the Lost': 'Heiliger Drache',
        'Light Rampant': 'Überflutendes Licht',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Icelit Dragonsong': 'Lied von Eis und Licht',
        'Holy': 'Sanctus',
        'Heavenly Strike': 'Elysischer Schlag',
        'Heart Asunder': 'Herzensbrecher',
        'Hallowed Wings': 'Heilige Schwingen',
        'Frost Armor(?! )': 'Frostrüstung',
        'Frigid Water': 'Eisfrost',
        'Frigid Stone': 'Eisstein',
        'Frigid Needle': 'Eisnadel',
        'Frigid Eruption': 'Eiseruption',
        'Driving Frost': 'Froststoß',
        'Draconic Strike': 'Drakonischer Schlag',
        'Drachen Armor': 'Drachenrüstung',
        'Double Slap': 'Doppelschlag',
        'Diamond Frost': 'Diamantstaub',
        'Bright Pulse': 'Glühen',
        'Bright Hunger': 'Erosionslicht',
        'Biting Frost': 'Frosthieb',
        'Banish III Divided': 'Geteiltes Verbannga',
        'Banish III': 'Verbannga',
        'Banish Divided': 'Geteiltes Verbannen',
        'Banish(?! )': 'Verbannen',
        'Axe Kick': 'Axttritt',
        'Akh Rhai': 'Akh Rhai',
        'Akh Morn': 'Akh Morn',
        'Absolute Zero': 'Absoluter Nullpunkt',
        'Reflected Frost \\(G\\)': 'Spiegelung Frost (G)',
        'Reflected Frost \\(R\\)': 'Spiegelung Frost (R)',
        'Reflected Kick \\(G\\)': 'Spiegelung Tritt (G)',
        'Reflected Wings \\(B\\)': 'Spiegelung Schwingen (B)',
        'Reflected Wings \\(G\\)': 'Spiegelung Schwingen (G)',
        'Reflected Wings \\(R\\)': 'Spiegelung Schwingen (R)',
        'Twin Silence/Stillness': 'Zwillingsschwerter der Ruhe/Stille',
        'Reflected Armor \\(B\\)': 'Spiegelung Rüstung (B)',
        'Reflected Armor \\(G\\)': 'Spiegelung Rüstung (G)',
        'Reflected Armor \\(R\\)': 'Spiegelung Rüstung (R)',
        'Spiteful/Embittered Dance': 'Kalter/Strenger Tanz',
        'Reflected Drachen': 'Spiegelung Drachen',
        'Inescapable Illumination': 'Expositionslicht',
      },
      '~effectNames': {
        'Wyrmfang': 'Reißzähne des heiligen Drachen',
        'Wyrmclaw': 'Krallen des heiligen Drachen',
        'Thin Ice': 'Glatteis',
        'Refulgent Fate': 'Bann des Lichts',
        'Refulgent Chain': 'Lichtfessel',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Lightsteeped': 'Exzessives Licht',
        'Light Resistance Down': 'Lichtresistenz -',
        'Heavy': 'Gewicht',
        'Hated of the Wyrm': 'Verfluchung des Drachen',
        'Hated of Frost': 'Verfluchung der Eisgöttin',
        'Freezing': 'Allmähliche Kühlung',
        'Down for the Count': 'Am Boden',
        'Deep Freeze': 'Tiefkühlung',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'luminous Aether': 'éther de lumière',
        'holy light': 'lumière sacrée',
        'great wyrm': 'Dragon divin',
        'frozen mirror': 'miroir de glace',
        'electric Aether': 'éther de foudre',
        'earthen Aether': 'éther de terre',
        'aqueous Aether': 'éther d\'eau',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Cristal-mère',
      },
      'replaceText': {
        'the Path of Light': 'Voie de lumière',
        'the House of Light': 'Raz-de-lumière',
        'Wyrm\'s Lament': 'Rugissement du Dragon divin',
        'Twin Stillness': 'Entaille de la quiétude',
        'Stoneskin': 'Cuirasse',
        'Spiteful Dance': 'Danse de la froideur',
        'Skyfall': 'Anéantissement',
        'Shock Spikes': 'Pointes de foudre',
        'Shining Armor': 'Armure scintillante',
        'Shattered World': 'Monde fracassé',
        'Scythe Kick': 'Jambe faucheuse',
        'Rush': 'Jaillissement',
        'Reflected Shining Armor': 'Réverbération : Armure scintillante',
        'Reflected Scythe Kick': 'Réverbération : Jambe faucheuse',
        'Reflected Hallowed Wings': 'Réverbération : Aile sacrée',
        'Reflected Frost Armor': 'Réverbération : Armure de givre',
        'Reflected Drachen Armor': 'Réverbération : Armure des dragons',
        'Reflected Biting Frost': 'Réverbération : Taillade de givre',
        'Morn Afah': 'Morn Afah',
        'Mirror, Mirror': 'Monde des miroirs',
        'Longing of the Lost': 'Esprit du Dragon divin',
        'Light Rampant': 'Débordement de Lumière',
        'Icicle Impact': 'Impact de stalactite',
        'Icelit Dragonsong': 'Chant de Glace et de Lumière',
        'Holy': 'Miracle',
        'Heavenly Strike': 'Frappe céleste',
        'Heart Asunder': 'Cœur déchiré',
        'Hallowed Wings': 'Aile sacrée',
        'Frost Armor(?! )': 'Armure de givre',
        'Frigid Water': 'Cataracte gelée',
        'Frigid Stone': 'Rocher de glace',
        'Frigid Needle': 'Dards de glace',
        'Frigid Eruption': 'Éruption de glace',
        'Driving Frost': 'Percée de givre',
        'Draconic Strike': 'Frappe draconique',
        'Drachen Armor': 'Armure des dragons',
        'Double Slap': 'Gifle redoublée',
        'Diamond Frost': 'Poussière de diamant',
        'Bright Pulse': 'Éclat',
        'Bright Hunger': 'Lumière dévorante',
        'Biting Frost': 'Taillade de givre',
        'Banish III Divided': 'Méga Bannissement fractionné',
        'Banish III': 'Méga Bannissement',
        'Banish Divided': 'Bannissement fractionné',
        'Banish(?! )': 'Bannissement',
        'Axe Kick': 'Jambe pourfendeuse',
        'Akh Rhai': 'Akh Rhai',
        'Akh Morn': 'Akh Morn',
        'Absolute Zero': 'Zéro absolu',
        'Reflected Frost \\(G\\)': 'Givre réfléchi (G)',
        'Reflected Frost \\(R\\)': 'Givre réfléchi (R)',
        'Reflected Kick \\(G\\)': 'Jambe réfléchie (G)',
        'Reflected Wings \\(B\\)': 'Ailes réfléchies (B)',
        'Reflected Wings \\(G\\)': 'Ailes réfléchies (G)',
        'Reflected Wings \\(R\\)': 'Ailes réfléchies (R)',
        'Reflected Armor \\(B\\)': 'Armure réfléchie (B)',
        'Reflected Armor \\(G\\)': 'Armure réfléchie (G)',
        'Reflected Armor \\(R\\)': 'Armure réfléchie (R)',
        'Spiteful/Embittered Dance': 'Dance de la froideur/amertume',
        'Reflected Drachen': 'Dragon réfléchi',
        'Inescapable Illumination': 'Illumination incontournable',
        'Twin Silence/Stillness': 'Entaille de la tranquilité/de la quiétude',
      },
      '~effectNames': {
        'Wyrmfang': 'Crocs du Dragon divin',
        'Wyrmclaw': 'Griffes du Dragon divin',
        'Thin Ice': 'Verglas',
        'Refulgent Fate': 'Lien de Lumière',
        'Refulgent Chain': 'Chaînes de Lumière',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Lightsteeped': 'Lumière excédentaire',
        'Light Resistance Down': 'Résistance à la Lumière réduite',
        'Heavy': 'Pesanteur',
        'Hated of the Wyrm': 'Malédiction du Dragon divin',
        'Hated of Frost': 'Malédiction de la Furie des neiges',
        'Freezing': 'Congélation graduelle',
        'Down for the Count': 'Au tapis',
        'Deep Freeze': 'Congélation',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'luminous Aether': 'ライト・エーテル',
        'holy light': '聖なる光',
        'great wyrm': '聖竜',
        'frozen mirror': '氷面鏡',
        'electric Aether': 'ライトニング・エーテル',
        'earthen Aether': 'アース・エーテル',
        'aqueous Aether': 'ウォーター・エーテル',
        'Shiva': 'シヴァ',
        'Mothercrystal': 'マザークリスタル',
      },
      'replaceText': {
        'the Path of Light': '光の波動',
        'the House of Light': '光の津波',
        'attack': '攻撃',
        'Wyrm\'s Lament': '聖竜の咆哮',
        'Twin Stillness': '静寂の双剣技',
        'Stoneskin': 'ストンスキン',
        'Spiteful Dance': '冷厳の舞踏技',
        'Skyfall': '世界消滅',
        'Shock Spikes': 'ショックスパイク',
        'Shining Armor': 'ブライトアーマー',
        'Shattered World': 'シャッタード・ワールド',
        'Scythe Kick': 'サイスキック',
        'Rush': 'ラッシュ',
        'Reflected Shining Armor': 'ミラーリング・ブライトアーマー',
        'Reflected Scythe Kick': 'ミラーリング・サイスキック',
        'Reflected Hallowed Wings': 'ミラーリング・ホーリーウィング',
        'Reflected Frost Armor': 'ミラーリング・フロストアーマー',
        'Reflected Drachen Armor': 'ミラーリング・ドラゴンアーマー',
        'Reflected Biting Frost': 'ミラーリング・フロストスラッシュ',
        'Morn Afah': 'モーン・アファー',
        'Mirror, Mirror': '鏡の国',
        'Longing of the Lost': '聖竜気',
        'Light Rampant': '光の暴走',
        'Icicle Impact': 'アイシクルインパクト',
        'Icelit Dragonsong': '氷と光の竜詩',
        'Holy': 'ホーリー',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Heart Asunder': 'ハートアサンダー',
        'Hallowed Wings': 'ホーリーウィング',
        'Frost Armor(?! )': 'フロストアーマー',
        'Frigid Water': 'アイスフロスト',
        'Frigid Stone': 'アイスストーン',
        'Frigid Needle': 'アイスニードル',
        'Frigid Eruption': 'アイスエラプション',
        'Driving Frost': 'フロストスラスト',
        'Draconic Strike': 'ドラコニックストライク',
        'Drachen Armor': 'ドラゴンアーマー',
        'Double Slap': 'ダブルスラップ',
        'Diamond Frost': 'ダイヤモンドダスト',
        'Bright Pulse': '閃光',
        'Bright Hunger': '浸食光',
        'Biting Frost': 'フロストスラッシュ',
        'Banish III Divided': 'ディバイデッド・バニシュガ',
        'Banish III': 'バニシュガ',
        'Banish Divided': 'ディバイデッド・バニシュ',
        'Banish(?! )': 'バニシュ',
        'Axe Kick': 'アクスキック',
        'Akh Rhai': 'アク・ラーイ',
        'Akh Morn': 'アク・モーン',
        'Absolute Zero': '絶対零度',

        // FIXME
        'Reflected Frost \\(G\\)': 'Reflected Frost (G)',
        'Reflected Frost \\(R\\)': 'Reflected Frost (R)',
        'Reflected Kick \\(G\\)': 'Reflected Kick (G)',
        'Reflected Wings \\(B\\)': 'Reflected Wings (B)',
        'Reflected Wings \\(G\\)': 'Reflected Wings (G)',
        'Reflected Wings \\(R\\)': 'Reflected Wings (R)',
        'Twin Silence/Stillness': 'Twin Silence/Stillness',
        'Reflected Armor \\(B\\)': 'Reflected Armor (B)',
        'Reflected Armor \\(G\\)': 'Reflected Armor (G)',
        'Reflected Armor \\(R\\)': 'Reflected Armor (R)',
        'Spiteful/Embittered Dance': 'Spiteful/Embittered Dance',
        'Reflected Drachen': 'Reflected Drachen',
        'Inescapable Illumination': 'Inescapable Illumination',
      },
      '~effectNames': {
        'Wyrmfang': '聖竜の牙',
        'Wyrmclaw': '聖竜の爪',
        'Thin Ice': '氷床',
        'Refulgent Fate': '光の呪縛',
        'Refulgent Chain': '光の鎖',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Lightsteeped': '過剰光',
        'Light Resistance Down': '光属性耐性低下',
        'Heavy': 'ヘヴィ',
        'Hated of the Wyrm': '聖竜の呪い',
        'Hated of Frost': '氷神の呪い',
        'Freezing': '徐々に氷結',
        'Down for the Count': 'ノックダウン',
        'Deep Freeze': '氷結',
        'Damage Down': 'ダメージ低下',
      },
    },
  ],
}];

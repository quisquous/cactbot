'use strict';

const Regexes = require('../../resources/regexes.js');
const NetRegexes = require('../../resources/netregexes.js');
const { regexCaptureTest } = require('../util/regex_util.js');
const { assert } = require('chai');

let tests = {
  startsUsing: () => {
    let lines = [
      '20|2020-03-18T09:39:40.5230000-07:00|106E0DB3|Potato Chippy|1D3F|Midare Setsugekka|40000284|Green Dragon|1.53||ff0eb93ae3714f3e520b871c3d72cfee',
      '20|2018-09-18T20:40:06.9110000-07:00|400069FE|The Manipulator|F5C|Mortal Revolution|400069FE|The Manipulator|5.70||a1e83a963cea8bb7f1dff1bbae7d6fd6',
      '20|2020-03-18T09:35:50.6220000-07:00|103D4280|Tini Poutini|8B|Holy|103D4280|Tini Poutini|2.28||a0117bf7bdb350d53ad3dfae117caca9',
    ];

    regexCaptureTest(NetRegexes.startsUsing, lines);

    let matches = lines[0].match(NetRegexes.startsUsing()).groups;
    assert.equal(matches.sourceId, '106E0DB3');
    assert.equal(matches.source, 'Potato Chippy');
    assert.equal(matches.id, '1D3F');
    assert.equal(matches.ability, 'Midare Setsugekka');
    assert.equal(matches.targetId, '40000284');
    assert.equal(matches.target, 'Green Dragon');
    assert.equal(matches.castTime, '1.53');
  },
  ability: () => {
    let lines = [
      '21|2020-02-25T01:47:57.4860000-08:00|105D4D8B|Potato Chippy|4095|Glare|4000DA74|Shiva|750003|50960000|1B|40958000|0|0|0|0|0|0|0|0|0|0|0|0|28583118|72360160|10000|0|0|1000|98.83264|99.83972|0|2.967196|101344|103650|5788|0|0|1000|99.19885|104.4785|0|-3.057414|0001073F|5b77b8e553b0ee5797caa1ab87b5a910',
      '22|2020-02-25T01:48:08.2910000-08:00|1067CDB0|Tiny Poutini|3F40|Double Standard Finish|1067CDB0|Tiny Poutini|50E|71D0000|E|7370000|0|0|0|0|0|0|0|0|0|0|0|0|111584|111584|6400|0|0|1000|99.59558|93.36987|0|0.005704641|111584|111584|6400|0|0|1000|99.59558|93.36987|0|0.005704641|000107FF|008aa08c35da1e426c6a06b366f40eb6',
      '21|2020-02-25T01:48:16.8170000-08:00|4000DA82|Shiva|4D9A|Akh Rhai|E0000000||0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|||||||||||44|44|0|0|0|1000|100.6942|95.20997|0|0.01299095|00010877|1ea68a0cb73843c7bb51808eeb8e80f8',
    ];

    regexCaptureTest(NetRegexes.ability, lines);
    regexCaptureTest(NetRegexes.abilityFull, lines);

    let matches = lines[0].match(NetRegexes.ability()).groups;
    assert.equal(matches.sourceId, '105D4D8B');
    assert.equal(matches.source, 'Potato Chippy');
    assert.equal(matches.id, '4095');
    assert.equal(matches.ability, 'Glare');
    assert.equal(matches.targetId, '4000DA74');
    assert.equal(matches.target, 'Shiva');

    matches = lines[0].match(NetRegexes.abilityFull()).groups;
    assert.equal(matches.sourceId, '105D4D8B');
    assert.equal(matches.source, 'Potato Chippy');
    assert.equal(matches.id, '4095');
    assert.equal(matches.ability, 'Glare');
    assert.equal(matches.targetId, '4000DA74');
    assert.equal(matches.target, 'Shiva');
    assert.equal(matches.flags, '750003');
    assert.equal(matches.x, '99.19885');
    assert.equal(matches.y, '104.4785');
    assert.equal(matches.z, '0');
    assert.equal(matches.heading, '-3.057414');
  },
  headMarker: () => {
    let lines = [
      '27|2020-02-24T21:51:06.0270000-08:00|107C73B8|Aloo Gobi|0000|5DC3|00C0|0000|0000|0000||fc68ff4de5f5779534fa44927c0c124f',
      '27|2020-02-25T12:14:44.0480000-08:00|10595B8B|Baked Potato|0000|0000|0017|0000|0000|0000||2cf15f84ff6e9050b97e40660eefe35f',
      '27|2020-02-25T12:14:44.0480000-08:00|102D9908|Au Gratin|0000|0000|0005|0000|0000|0000||2cf15f84ff6e9050b97e40660eefe35f',
    ];
    regexCaptureTest(NetRegexes.headMarker, lines);

    let matches = lines[0].match(NetRegexes.headMarker()).groups;
    assert.equal(matches.targetId, '107C73B8');
    assert.equal(matches.target, 'Aloo Gobi');
    assert.equal(matches.id, '00C0');
  },
  addedCombatant: () => {
    // NOTE: these lines don't capitalize hex, like other lines??
    let lines = [
      '03|2020-02-25T01:49:03.2240000-08:00|1059c805|Potato Chippy|1b|50|0|49|Balmung|0|0|91234|98567|10000|0|0|0|-103.6335|13.72225|18.00033|2.118315||7341f2b67a2032c70483078501ec8dc5',
      '03|2020-02-24T10:01:07.4190000-08:00|400264f6|Earthen Aether|0|50|0|0||9321|11632|148000|148000|10000|0|0|0|90.73911|97.41268|7.152557E-07|-4.792213E-05||9460a4497276aeab140b6c36de87ebbd',
      '03|2020-02-25T00:56:34.2610000-08:00|4000d2dc|Eos|0|50|10696f5f|0||1398|1008|96534|96534|10000|0|0|0|101.266|114.659|0|-4.792213E-05||b7fe3042f22622325af486c0f9c7438b',
    ];
    regexCaptureTest(NetRegexes.addedCombatant, lines);
    regexCaptureTest(NetRegexes.addedCombatantFull, lines);

    let matches = lines[0].match(NetRegexes.addedCombatant()).groups;
    assert.equal(matches.id, '1059c805');
    assert.equal(matches.name, 'Potato Chippy');

    matches = lines[0].match(NetRegexes.addedCombatantFull()).groups;
    assert.equal(matches.id, '1059c805');
    assert.equal(matches.name, 'Potato Chippy');
    assert.equal(matches.job, '1b');
    assert.equal(matches.level, '50');
    assert.equal(matches.world, 'Balmung');
    assert.equal(matches.npcNameId, '0');
    assert.equal(matches.npcBaseId, '0');
    assert.equal(matches.hp, '98567');
    assert.equal(matches.x, '-103.6335');
    assert.equal(matches.y, '13.72225');
    assert.equal(matches.z, '18.00033');
    assert.equal(matches.heading, '2.118315');

    matches = lines[1].match(NetRegexes.addedCombatantFull()).groups;
    assert.equal(matches.name, 'Earthen Aether');
    assert.equal(matches.npcNameId, '9321');
    assert.equal(matches.npcBaseId, '11632');
  },
  removingCombatant: () => {
    // NOTE: these lines don't capitalize hex, like other lines??
    let lines = [
      '04|2020-02-24T17:43:13.2330000-08:00|106da5c0|Tini Poutini|16|50|0|49|Balmung|0|0|81234|85349|10000|0|0|0|-47.33836|30.6029|84.19505|-0.4369516||2bf363ca9ba965e27326e4d7a19dd496', '04|2020-02-24T09:54:18.4450000-08:00|400263e6|Eos|0|50|10696f5f|0||1398|1008|0|0|0|0|0|0|99.71765|100.2975|0|2.712743||1adce9f3da74fab90640fde2184b6d21',
      '04|2020-02-24T17:49:24.6160000-08:00|e0000000|Shiva|0|0|0|0||9353|11627|0|0|0|0|0|0|99.99231|99.6261|-2.384186E-07|-0.009347916||46581fd9755c874575841f46b746a1c2',
    ];
    regexCaptureTest(NetRegexes.removingCombatant, lines);

    let matches = lines[0].match(NetRegexes.removingCombatant()).groups;
    assert.equal(matches.id, '106da5c0');
    assert.equal(matches.name, 'Tini Poutini');
    assert.equal(matches.hp, '85349');
  },
  gainsEffect: () => {
    let lines = [
      '26|2020-02-24T10:07:55.6600000-08:00|312|Battle Litany|20.00|10679611|Papas Fritas|105D3F8B|Potato Casserole|00|103650|110101||9b404456c822ce3ce25e61ea838a9c4c',
      '26|2020-04-24T10:00:03.1370000-08:00|8d1|Lightsteeped|39.95|E0000000||105C4F8B|Tini Poutini|01|103650|||ba7a8b1ffce9f0f57974de250e9da307',
      '26|2019-09-12T13:00:25.1660000-08:00|130|Aetherflow|9999.00|10697A5F|Potato Chippy|10697A5F|Potato Chippy|02|101484|101484||5fe5a884cb777a95b14f5faf713d3e28',
    ];
    regexCaptureTest(NetRegexes.gainsEffect, lines);

    let matches = lines[0].match(NetRegexes.gainsEffect()).groups;
    assert.equal(matches.effectId, '312');
    assert.equal(matches.effect, 'Battle Litany');
    assert.equal(matches.duration, '20.00');
    assert.equal(matches.sourceId, '10679611');
    assert.equal(matches.source, 'Papas Fritas');
    assert.equal(matches.targetId, '105D3F8B');
    assert.equal(matches.target, 'Potato Casserole');
    assert.equal(matches.count, '00');

    matches = lines[1].match(NetRegexes.gainsEffect()).groups;
    assert.equal(matches.effectId, '8d1');
    assert.equal(matches.effect, 'Lightsteeped');
    assert.equal(matches.count, '01');
  },
  statusEffectExplicit: () => {
    let lines = [
      '38|2020-02-24T10:07:55.6600000-08:00|1065DD71|Potato Chippy|50505025|151776|158307|10000|10000|0|0|100.0197|97.94747|-0.002214196|3.082437|1|2|3|0A016D|41F00000|E0000000|0729|0|1064DE71|28C30030|449440B2|1064DE71|0312|419E9168|1065DD71|9E|412C24DE|105D4D8B|0778|409D26E9|105D4D8B||f99cf2ffd5dcb87b8506fad2e878eb41',
      '38|2020-02-24T10:07:55.9290000-08:00|40026539|Emerald Carbuncle|00505000|96490|96490|10000|10000|0|0|100.0839|102.2507|2.384186E-07|3.141401|10|0|0|28E50030|44C150A0|1059B805|02D7|41868504|10636895|0312|419FA3D7|10668611||ce23c777d53cf84e18bedda4aaa062f3',
      '38|2020-02-24T10:07:56.7780000-08:00|40026521|Shiva|00505000|72017170|72360160|10000|10000|0|0|100.0839|99.25989|0|-3.12817|0|0|0|04BE|41D41EB1|1059B806|04BF|41D41EB1|1059B806|074F|41DB9DAC|105C4E8B|0767|41E26A7A|10696F5F|F6|41837CE9|105C4E8B||8d5c910018f649981eda9a256fc5f028',
    ];
    regexCaptureTest(NetRegexes.statusEffectExplicit, lines);

    let matches = lines[0].match(NetRegexes.statusEffectExplicit()).groups;
    assert.equal(matches.targetId, '1065DD71');
    assert.equal(matches.target, 'Potato Chippy');
    assert.equal(matches.hp, '151776');
    assert.equal(matches.maxHp, '158307');
    assert.equal(matches.x, '100.0197');
    assert.equal(matches.y, '97.94747');
    assert.equal(matches.z, '-0.002214196');
    assert.equal(matches.heading, '3.082437');
    assert.equal(matches.data0, '1');
    assert.equal(matches.data1, '2');
    assert.equal(matches.data2, '3');
    assert.equal(matches.data3, '0A016D');
    assert.equal(matches.data4, '41F00000');
  },
  losesEffect: () => {
    let lines = [
      '30|2020-02-24T10:08:00.8850000-08:00|323|Enhanced Wheeling Thrust|0.00|106AF611|Tini Poutini|106AF611|Tini Poutini|00|110101|110101||881aea4c3b845c7441536958ea92c421',
      '30|2020-02-24T10:21:51.8200000-08:00|8d1|Lightsteeped|0.00|E0000000||106AF612|Potato Chippy|01|101418|||6cac396c3ac1e144d5d2b1270dd5198e',
      '30|2020-02-24T10:23:40.2610000-08:00|49e|Meditative Brotherhood|0.00|106AF612|Potato Chippy|106AF611|Tini Poutini|00|110191|113284||f8668b58ee7442746a5d131eff6df27f',
      '30|2020-02-24T10:11:47.6170000-08:00|8d7|Shock Spikes|0.00|4002666E|Electric Aether|4002666E|Electric Aether|64|81400|81400||3e66ff368998f3a3f365fc85ff9e449a',
    ];
    regexCaptureTest(NetRegexes.losesEffect, lines);

    let matches = lines[0].match(NetRegexes.losesEffect()).groups;
    assert.equal(matches.effectId, '323');
    assert.equal(matches.effect, 'Enhanced Wheeling Thrust');
    assert.equal(matches.sourceId, '106AF611');
    assert.equal(matches.source, 'Tini Poutini');
    assert.equal(matches.targetId, '106AF611');
    assert.equal(matches.target, 'Tini Poutini');
    assert.equal(matches.count, '00');

    matches = lines[1].match(NetRegexes.losesEffect()).groups;
    assert.equal(matches.effectId, '8d1');
    assert.equal(matches.effect, 'Lightsteeped');
    assert.equal(matches.count, '01');

    matches = lines[2].match(NetRegexes.losesEffect()).groups;
    assert.equal(matches.effectId, '49e');
    assert.equal(matches.effect, 'Meditative Brotherhood');
    assert.equal(matches.sourceId, '106AF612');
    assert.equal(matches.source, 'Potato Chippy');
    assert.equal(matches.targetId, '106AF611');
    assert.equal(matches.target, 'Tini Poutini');
  },
  tether: () => {
    let lines = [
      '35|2020-02-24T10:23:44.5060000-08:00|40026738|Luminous Aether|400266A5|Mothercrystal|0000|0000|0054|400266A5|000F|7F20||da2cc1778e3fe34deeec4d5f681fd7cd',
      '35|2020-02-24T10:28:12.7280000-08:00|106AF612|Potato Chippy|106AF611|Tini Poutini|0000|0000|006E|10657611|000F|0000||28cffed1da761d34d8a5436784cbf49b',
      '35|2020-03-18T09:41:49.8700000-07:00|400002A9|Clockwork Wright|101BC93E|Potato Casserole|70DF|0000|0016|101B283E|000F|7FE4||6a73d966fcbee31cd3afcec426de25a6',
    ];
    regexCaptureTest(NetRegexes.tether, lines);

    let matches = lines[0].match(NetRegexes.tether()).groups;
    assert.equal(matches.sourceId, '40026738');
    assert.equal(matches.source, 'Luminous Aether');
    assert.equal(matches.targetId, '400266A5');
    assert.equal(matches.target, 'Mothercrystal');
    assert.equal(matches.id, '0054');
  },
  wasDefeated: () => {
    let lines = [
      '25|2020-03-18T09:42:40.8350000-07:00|400002AB|Ovni|106AF612|Potato Chippy||15ea472b709b0f25b15a58f1bd36b990',
      '25|2020-03-18T09:45:03.4590000-07:00|400002D9|Ice Cage|E0000000|||1d1f7f83506abb48dd70fbcee8886b4e',
      '25|2020-03-18T20:40:15.6840000-07:00|106AF611|Tini Poutini|400069FE|The Manipulator||5b29fc75e96e9778bf74fdd4470e2a0c',
    ];
    regexCaptureTest(NetRegexes.wasDefeated, lines);

    let matches = lines[0].match(NetRegexes.wasDefeated()).groups;
    assert.equal(matches.targetId, '400002AB');
    assert.equal(matches.target, 'Ovni');
    assert.equal(matches.sourceId, '106AF612');
    assert.equal(matches.source, 'Potato Chippy');
  },
  gameLog: () => {
    let echoLines = [
      '00|2020-02-26T18:59:23.0000000-08:00|0038||cactbot wipe|77364412c17033eb8c87dafe7ce3c665',
      '00|2019-03-25T19:04:42.0000000-07:00|0038||end|8180b401b5e83eac9b8a29ed3c97068c',
      '00|2020-10-03T07:44:26.0000000-08:00|0038||<se.1>|edc9e1601137eee35ca158620fd3271a',
    ];
    regexCaptureTest(NetRegexes.echo, echoLines);

    let matches = echoLines[0].match(NetRegexes.echo()).groups;
    assert.equal(matches.line, 'cactbot wipe');

    let dialogLines = [
      '00|2020-04-10T21:23:23.0000000-07:00|0044|Rhitahtyn sas Arvina|My shields are impregnable! Join the countless challengers who have dashed themselves against them!|a3db6d5ca3dac3d2eb06bced34c9f587',
      '00|2020-03-18T19:32:22.0000000-07:00|0044|2P|It\'s too quiet.|a21773420eb4d16ad73f0f56f8b24b7c',
      '00|2020-03-29T15:44:53.0000000-07:00|0044|Lamebrix Strikebocks|Pssshkoh... Lamebrix will flatten uplanders like crawlybug!|bf9a20b3704b1bf29543735ace02fbd',
    ];
    regexCaptureTest(NetRegexes.dialog, dialogLines);

    matches = dialogLines[0].match(NetRegexes.dialog()).groups;
    assert.equal(matches.name, 'Rhitahtyn sas Arvina');
    assert.equal(matches.line, 'My shields are impregnable! Join the countless challengers who have dashed themselves against them!');

    let namedLines = [
      '00|2020-03-10T18:29:02.0000000-07:00|001d|Tini Poutini|Tini Poutini straightens her spectacles for you.|05ca458b4d400d1f878d3c420f962b99',
    ];
    regexCaptureTest(NetRegexes.gameNameLog, namedLines);
    regexCaptureTest(NetRegexes.gameNameLog, dialogLines);

    matches = namedLines[0].match(NetRegexes.gameNameLog()).groups;
    assert.equal(matches.code, '001d');
    assert.equal(matches.name, 'Tini Poutini');
    assert.equal(matches.line, 'Tini Poutini straightens her spectacles for you.');

    let messageLines = [
      '00|2020-03-27T18:50:50.0000000-07:00|0839||The Cranial Plate is no longer sealed!|66d37b7d4a64272e607993ba33bfbe10',
      '00|2020-04-10T18:47:10.0000000-07:00|0839||One or more party members completed this duty for the first time. A bonus has been awarded to all members.|d3f328d72cbd12a78b631f886acfb1bf',
      '00|2020-03-27T17:25:30.0000000-07:00|0839||The rook autoturret withdraws from the battlefield.|be06a6321601981c48c7299bcf6029a7',
    ];
    regexCaptureTest(NetRegexes.message, messageLines);

    matches = messageLines[0].match(NetRegexes.message()).groups;
    assert.equal(matches.line, 'The Cranial Plate is no longer sealed!');

    let allLines = [];
    allLines.push(...echoLines);
    allLines.push(...dialogLines);
    allLines.push(...messageLines);
    allLines.push(...namedLines);
    regexCaptureTest(NetRegexes.gameLog, allLines);
  },
  statchange: () => {
    let lines = [
      '12|2020-03-18T20:40:30.0380000-07:00|19|3888|324|4292|207|343|340|3888|1600|3158|206|341|1868|902|380|0|853|45c4bb87c4e26bb1f1e85c0df980fca6',
      '12|2020-02-25T01:43:47.6620000-08:00|27|321|360|4720|5108|284|340|321|2832|3556|5108|284|1158|380|1990|0|380|9da93db71ca9bf64c28c912d112e7907',

    ];
    regexCaptureTest(NetRegexes.statChange, lines);

    let matches = lines[0].match(NetRegexes.statChange()).groups;
    assert.equal(matches.job, '19');
    assert.equal(matches.strength, '3888');
    assert.equal(matches.dexterity, '324');
    assert.equal(matches.vitality, '4292');
    assert.equal(matches.intelligence, '207');
    assert.equal(matches.mind, '343');
    assert.equal(matches.piety, '340');
    assert.equal(matches.attackPower, '3888');
    assert.equal(matches.directHit, '1600');
    assert.equal(matches.criticalHit, '3158');
    assert.equal(matches.attackMagicPotency, '206');
    assert.equal(matches.healMagicPotency, '341');
    assert.equal(matches.determination, '1868');
    assert.equal(matches.skillSpeed, '902');
    assert.equal(matches.spellSpeed, '380');
    assert.equal(matches.tenacity, '853');
  },
  changeZone: () => {
    let lines = [
      '01|2020-03-18T09:34:12.6510000-07:00|174|Syrcus Tower|083c096742072c6d958763461f9d7e56',
      '01|2020-03-18T10:58:29.5420000-07:00|153|Mist|63f727bd97d0a7e75ad169e570b34cf8',
    ];
    regexCaptureTest(NetRegexes.changeZone, lines);

    let matches = lines[0].match(NetRegexes.changeZone()).groups;
    assert.equal(matches.id, '174');
    assert.equal(matches.name, 'Syrcus Tower');
  },
  network6D: () => {
    let lines = [
      '33|2020-05-13T19:57:07.1320000-07:00|80034E37|40000010|A91|01|02|03|2f54812b15aac21ba1c2f22b477023a9',
      '33|2020-03-10T18:19:59.4560000-07:00|80030049|80000001|2EC|00|00|00|1d4cd6ed286bc0a563c2508d4488dc75',
      '33|2020-03-10T23:57:06.1520000-04:00|8003758C|40000001|1518|00|00|00|b0a350a0c04f38c03cb040655e901705',
    ];

    regexCaptureTest(NetRegexes.network6d, lines);

    let matches = lines[0].match(NetRegexes.network6d()).groups;
    assert.equal(matches.instance, '80034E37');
    assert.equal(matches.command, '40000010');
    assert.equal(matches.data0, 'A91');
    assert.equal(matches.data1, '01');
    assert.equal(matches.data2, '02');
    assert.equal(matches.data3, '03');
  },
};

let keys = Object.keys(tests);
let exitCode = 0;
for (let i = 0; i < keys.length; ++i) {
  try {
    tests[keys[i]]();
  } catch (e) {
    console.log(e);
    exitCode = 1;
  }
}
process.exit(exitCode);

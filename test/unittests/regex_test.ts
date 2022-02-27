import chai from 'chai';

import Regexes from '../../resources/regexes';
import regexCaptureTest, { RegexUtilParams } from '../helper/regex_util';

const { assert } = chai;

describe('regex tests', () => {
  it('startsUsing', () => {
    const lines = [
      '[09:39:40.523] StartsCasting 14:106E0DB3:Potato Chippy:1D3F:Midare Setsugekka:40000284:Green Dragon:1.53:-389.807:224.858:238.695:-3.132169',
      '[20:40:06.911] StartsCasting 14:400069FE:The Manipulator:F5C:Mortal Revolution:400069FE:The Manipulator:5.70:120.789:-90.37:0:1.872',
      '[09:35:50.622] StartsCasting 14:103D4280:Tini Poutini:8B:Holy:103D4280:Tini Poutini:2.28:-80:92.3:0.01:-2.7113',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.startsUsing(params), lines);
    const matches = lines[0].match(Regexes.startsUsing())?.groups;
    assert.equal(matches?.sourceId, '106E0DB3');
    assert.equal(matches?.source, 'Potato Chippy');
    assert.equal(matches?.id, '1D3F');
    assert.equal(matches?.ability, 'Midare Setsugekka');
    assert.equal(matches?.targetId, '40000284');
    assert.equal(matches?.target, 'Green Dragon');
    assert.equal(matches?.castTime, '1.53');
    assert.equal(matches?.x, '-389.807');
    assert.equal(matches?.y, '224.858');
    assert.equal(matches?.z, '238.695');
    assert.equal(matches?.heading, '-3.132169');
  });
  it('ability', () => {
    const lines = [
      '[11:48:11.476] AOEActionEffect 16:10683258:Okonomi Yaki:3F40:Double Standard Finish:10683258:Okonomi Yaki:50F:71D0000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:783:783:10000:10000:0:1000:-265.2183:-77.28939:4.323432:1.70142:783:783:10000:10000:0:1000:-265.2183:-77.28939:4.323432:1.70142:0000AC32:0',
      '[12:05:12.479] ActionEffect 15:4007CA96:Graffias:366:Attack:106E8400:Tako Yaki:710003:3F0000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:967:1107:10000:10000:0:1000:223.4988:-147.7532:-39.29175:-3.109571:1604:10948:0:0:0:1000:225.452:-145.6169:-39.29175:-3.013695:0000B2D4:0',
      '[12:48:31.881] AOEActionEffect 16:4004D36E:Necropsyche:46A8:Neuro Squama:4004D3F1:Lefse:750003:74E0000:1C:46A88000:0:0:0:0:0:0:0:0:0:0:0:0:46373:48662:7000:7000:0:1000:-528.4657:387.2892:45.88464:0.6611078:2074788:4874688:10000:10000:0:1000:-525.4445:391.1954:46.67033:-1.60059:005286B5:0',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.ability(params), lines);

    const testBadMatch = [
      '[20:29:39.392] ActionEffect 15:107B9AC8:Tako Yaki:07:Attack:40017D58:Daxio:710003:DC0000:1E:50000:1C:1B60000:550003:2CA000:0:0:0:0:0:0:0:0:8207:24837:7230:7230:0:1000:527.5806:-362.7833:-19.61513:2.898741:8998:8998:10000:10000:0:1000:528.6487:-365.8656:-22.08109:-0.3377206:000AD7BF:0',
    ] as const;
    // Bad match is an ability line too.
    regexCaptureTest((params?: RegexUtilParams) => Regexes.ability(params), testBadMatch);

    // Tests a bug where a :1E: later in the line would be caught by overzealous
    // matchers on source names.
    const abilityHallowed = Regexes.ability({ id: '1E' });
    assert.isNull(testBadMatch[0].match(abilityHallowed));

    const matches = lines[1].match(Regexes.ability())?.groups;
    assert.equal(matches?.sourceId, '4007CA96');
    assert.equal(matches?.source, 'Graffias');
    assert.equal(matches?.id, '366');
    assert.equal(matches?.ability, 'Attack');
    assert.equal(matches?.targetId, '106E8400');
    assert.equal(matches?.target, 'Tako Yaki');
    assert.equal(matches?.flags, '710003');
    assert.equal(matches?.x, '225.452');
    assert.equal(matches?.y, '-145.6169');
    assert.equal(matches?.z, '-39.29175');
    assert.equal(matches?.heading, '-3.013695');
    assert.equal(matches?.sequence, '0000B2D4');

    assert.equal(Regexes.ability().source, Regexes.abilityFull().source);
  });
  it('headMarker', () => {
    const lines = [
      '[21:51:06.027] TargetIcon 1B:107C73B8:Aloo Gobi:0000:5DC3:00C0:0000:0000:0000:',
      '[20:23:38.707] TargetIcon 1B:10595B8B:Baked Potato:0000:0000:0017:0000:0000:0000:',
      '[12:14:44.048] TargetIcon 1B:102D9908:Au Gratin:0000:0000:0005:0000:0000:0000:',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.headMarker(params), lines);
    const matches = lines[0].match(Regexes.headMarker())?.groups;
    if (!matches) {
      assert.fail('no match');
      return;
    }

    assert.equal(matches?.targetId, '107C73B8');
    assert.equal(matches?.target, 'Aloo Gobi');
    assert.equal(matches?.id, '00C0');
  });
  it('addedCombatant', () => {
    const lines = [
      '[10:23:45.841] AddCombatant 03:1059C805:Potato Chippy:1B:50:0:49:Balmung:0:0:91234:98567:10000:0:0:0:-103.6335:13.72225:18.00033:2.118315',
      '[10:23:45.841] AddCombatant 03:400264F6:Earthen Aether:0:50:0:0::9321:11632:148000:148000:10000:0:0:0:90.73911:97.41268:7.152557E-07:-4.792213E-05',
      '[10:23:45.841] AddCombatant 03:4000D2DC:Eos:0:50:10696f5f:0::1398:1008:96534:96534:10000:0:0:0:101.266:114.659:0:-4.792213E-05',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.addedCombatant(params), lines);
    regexCaptureTest((params?: RegexUtilParams) => Regexes.addedCombatantFull(params), lines);

    let matches = lines[0].match(Regexes.addedCombatant())?.groups;
    assert.equal(matches?.name, 'Potato Chippy');

    matches = lines[0].match(Regexes.addedCombatantFull())?.groups;
    assert.equal(matches?.id, '1059C805');
    assert.equal(matches?.name, 'Potato Chippy');
    assert.equal(matches?.job, '1B');
    assert.equal(matches?.level, '50');
    assert.equal(matches?.world, 'Balmung');
    assert.equal(matches?.npcNameId, '0');
    assert.equal(matches?.npcBaseId, '0');
    assert.equal(matches?.hp, '98567');
    assert.equal(matches?.x, '-103.6335');
    assert.equal(matches?.y, '13.72225');
    assert.equal(matches?.z, '18.00033');
    assert.equal(matches?.heading, '2.118315');

    matches = lines[1].match(Regexes.addedCombatantFull())?.groups;
    assert.equal(matches?.id, '400264F6');
    assert.equal(matches?.name, 'Earthen Aether');
    assert.equal(matches?.npcNameId, '9321');
    assert.equal(matches?.npcBaseId, '11632');
  });
  it('removingCombatant', () => {
    const lines = [
      '[10:23:57.257] RemoveCombatant 04:401926AE:Sun Leech:00:3B:0000:00::3611:4021:0:15299:0:10000:::-402.98:348.53:136.83:2.27',
      '[22:41:50.890] RemoveCombatant 04:10FFFFFF:Potato Chippy:1F:4E:0000:28:Jenova:0:0:70547:70547:10000:10000:::-717.19:-838.59:20.00:-2.84',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.removingCombatant(params), lines);

    const matches = lines[0].match(Regexes.removingCombatant())?.groups;
    assert.equal(matches?.id, '401926AE');
    assert.equal(matches?.name, 'Sun Leech');
    assert.equal(matches?.job, '00');
    assert.equal(matches?.level, '3B');
    assert.equal(matches?.world, '');
    assert.equal(matches?.npcNameId, '3611');
    assert.equal(matches?.npcBaseId, '4021');
    assert.equal(matches?.hp, '15299');
    assert.equal(matches?.x, '-402.98');
    assert.equal(matches?.y, '348.53');
    assert.equal(matches?.z, '136.83');
    assert.equal(matches?.heading, '2.27');
  });
  it('gainsEffect', () => {
    const lines = [
      '[10:07:55.660] StatusAdd 1A:312:Battle Litany:20.00:10679611:Papas Fritas:105D3F8B:Potato Casserole:00:103650:110101',
      '[10:00:03.137] StatusAdd 1A:8D1:Lightsteeped:39.95:E0000000::105C4F8B:Tini Poutini:01:103650:',
      '[13:00:25.166] StatusAdd 1A:130:Aetherflow:9999.00:10697A5F:Potato Chippy:10697A5F:Potato Chippy:02:101484:101484',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.gainsEffect(params), lines);

    let matches = lines[0].match(Regexes.gainsEffect())?.groups;
    assert.equal(matches?.effectId, '312');
    assert.equal(matches?.effect, 'Battle Litany');
    assert.equal(matches?.duration, '20.00');
    assert.equal(matches?.sourceId, '10679611');
    assert.equal(matches?.source, 'Papas Fritas');
    assert.equal(matches?.targetId, '105D3F8B');
    assert.equal(matches?.target, 'Potato Casserole');
    assert.equal(matches?.count, '00');

    matches = lines[1].match(Regexes.gainsEffect())?.groups;
    assert.equal(matches?.effectId, '8D1');
    assert.equal(matches?.effect, 'Lightsteeped');
    assert.equal(matches?.count, '01');
  });
  it('statusEffectExplicit', () => {
    const lines = [
      '[23:24:13.184] StatusList 26:4000D3EB::00505015:148000:148000:0:0:0:0:117.5402:107.2556:2.384186E-07:-1.963573:03E8:0:0:840893:40800000:E0000000:',
      '[23:24:15.679] StatusList 26:4000D3E6::0050501C:0:148000:0:0:0:0:84.83353:101.1907:-1.105378E-08:2.79271:0:A5:0:',
      '[23:24:17.192] StatusList 26:4000D3E9::0050501B:148000:148000:0:0:0:0:110.3157:104.1553:2.384186E-07:1.182765:03E8:A5:0:',
      '[23:10:07.264] StatusList 26:1067348B:Tini Poutini:50505014:103516:103516:10000:10000:8:0:97.62768:98.15999:-0.0007705679:0.7312062:03E8:88:0:0A0168:41F00000:E0000000:0F016B:41F00000:E0000000:28C20030:4512F71C:1067DE8B:67:0:1067DE8B:6E:411E978E:1067DE8B:0:0:0:0129:41BA4792:106EBC57:04E2:40910E52:1067DE8B:',
      '[23:10:48.791] StatusList 26:4000D27B::00505000:89020:89020:10000:10000:0:0:::::03E8:20:0:08A9:40706245:106D56CD:28C30030:456F9FC0:10683CEE:',
      '[23:24:15.679] StatusList 26:4000D3E6::0050501C:0:148000:0:0:0:0:84.83353:101.1907:-1.105378E-08:2.79271:0:A5:0:',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.statusEffectExplicit(params), lines);

    const matches = lines[3].match(Regexes.statusEffectExplicit())?.groups;
    assert.equal(matches?.targetId, '1067348B');
    assert.equal(matches?.target, 'Tini Poutini');
    assert.equal(matches?.x, '97.62768');
    assert.equal(matches?.y, '98.15999');
    assert.equal(matches?.z, '-0.0007705679');
    assert.equal(matches?.heading, '0.7312062');
    assert.equal(matches?.data0, '03E8');
    assert.equal(matches?.data1, '88');
    assert.equal(matches?.data2, '0');
  });
  it('losesEffect', () => {
    const lines = [
      '[10:08:00.885] StatusRemove 1E:323:Enhanced Wheeling Thrust:0.00:106AF611:Tini Poutini:106AF611:Tini Poutini:00:110101:110101',
      '[10:21:51.820] StatusRemove 1E:8D1:Lightsteeped:0.00:E0000000::106AF612:Potato Chippy:01:101418:',
      '[10:23:40.261] StatusRemove 1E:49E:Meditative Brotherhood:0.00:106AF612:Potato Chippy:106AF611:Tini Poutini:00:110191:113284',
      '[10:11:47.617] StatusRemove 1E:8D7:Shock Spikes:0.00:4002666E:Electric Aether:4002666E:Electric Aether:64:81400:81400',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.losesEffect(params), lines);

    let matches = lines[0].match(Regexes.losesEffect())?.groups;
    assert.equal(matches?.effectId, '323');
    assert.equal(matches?.effect, 'Enhanced Wheeling Thrust');
    assert.equal(matches?.sourceId, '106AF611');
    assert.equal(matches?.source, 'Tini Poutini');
    assert.equal(matches?.targetId, '106AF611');
    assert.equal(matches?.target, 'Tini Poutini');
    assert.equal(matches?.count, '00');

    matches = lines[1].match(Regexes.losesEffect())?.groups;
    assert.equal(matches?.effectId, '8D1');
    assert.equal(matches?.effect, 'Lightsteeped');
    assert.equal(matches?.count, '01');

    matches = lines[2].match(Regexes.losesEffect())?.groups;
    assert.equal(matches?.effectId, '49E');
    assert.equal(matches?.effect, 'Meditative Brotherhood');
    assert.equal(matches?.sourceId, '106AF612');
    assert.equal(matches?.source, 'Potato Chippy');
    assert.equal(matches?.targetId, '106AF611');
    assert.equal(matches?.target, 'Tini Poutini');
  });
  it('nameToggle', () => {
    const lines = [
      '[17:08:58.834] NameToggle 22:40003C60:Elemental Converter:40003C60:Elemental Converter:01',
      '[17:09:05.371] NameToggle 22:40003CC6:Leviathan:40003CC6:Leviathan:00',
      '[17:29:34.771] NameToggle 22:106AF611:Tini Poutini:106AF611:Tini Poutini:00',
    ] as const;

    regexCaptureTest((params?: RegexUtilParams) => Regexes.nameToggle(params), lines);

    const matches = lines[0].match(Regexes.nameToggle())?.groups;
    assert.equal(matches?.id, '40003C60');
    assert.equal(matches?.name, 'Elemental Converter');
    assert.equal(matches?.toggle, '01');
  });
  it('tether', () => {
    const lines = [
      '[21:49:14.345] Tether 23:4000804B:Shadow of the Ancients:106CAF53:Dum Aloo:3CDF:0000:0011:106CAF53:000F:7F10:',
      '[19:39:36.673] Tether 23:40005B1A:Voidwalker:40005C4E:The Hand of Erebos:D1A8:0000:005C:40005C4E:000F:7F1E:',
      '[12:17:54.515] Tether 23:1032A977:French Fry:4000229C:Magic Pot:03AC:0000:0003:4000229C:000F:7FF1:',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.tether(params), lines);

    const matches = lines[0].match(Regexes.tether())?.groups;
    assert.equal(matches?.sourceId, '4000804B');
    assert.equal(matches?.source, 'Shadow of the Ancients');
    assert.equal(matches?.targetId, '106CAF53');
    assert.equal(matches?.target, 'Dum Aloo');
    assert.equal(matches?.id, '0011');
  });
  it('wasDefeated', () => {
    const lines = [
      '[09:42:40.835] Death 19:400002AB:Ovni:106AF612:Potato Chippy',
      '[09:45:03.459] Death 19:400002D9:Ice Cage:E0000000:',
      '[20:40:15.684] Death 19:106AF611:Tini Poutini:400069FE:The Manipulator',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.wasDefeated(params), lines);

    const matches = lines[0].match(Regexes.wasDefeated())?.groups;
    assert.equal(matches?.targetId, '400002AB');
    assert.equal(matches?.target, 'Ovni');
    assert.equal(matches?.sourceId, '106AF612');
    assert.equal(matches?.source, 'Potato Chippy');
  });
  it('gameLog', () => {
    const echoLines = [
      '[12:18:38.000] ChatLog 00:0038::cactbot wipe',
      '[03:12:18.000] ChatLog 00:0038::end',
      '[03:12:18.000] ChatLog 00:0038::hello world',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.echo(params), echoLines);

    let matches = echoLines[0].match(Regexes.echo())?.groups;
    assert.equal(matches?.line, 'cactbot wipe');

    const dialogLines = [
      '[18:44:08.000] ChatLog 00:0044:Rhitahtyn sas Arvina:My shields are impregnable! Join the countless challengers who have dashed themselves against them!',
      '[21:47:25.000] ChatLog 00:0044:Hades:You are no match for my mastery of the arcane!',
      '[13:52:19.000] ChatLog 00:0044:Byakko:There is no turning back!',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.dialog(params), dialogLines);

    matches = dialogLines[2].match(Regexes.dialog())?.groups;
    assert.equal(matches?.line, 'There is no turning back!');

    matches = dialogLines[2].match(Regexes.gameLog())?.groups;
    assert.equal(matches?.line, 'There is no turning back!');
    assert.equal(matches?.name, 'Byakko');

    const namedLines = [
      '[17:56:54.000] ChatLog 00:001d:Potato Chippy:You clap for the striking dummy.',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.gameNameLog(params), namedLines);
    regexCaptureTest((params?: RegexUtilParams) => Regexes.gameNameLog(params), dialogLines);

    matches = dialogLines[2].match(Regexes.gameNameLog())?.groups;
    assert.equal(matches?.code, '0044');
    assert.equal(matches?.name, 'Byakko');
    assert.equal(matches?.line, 'There is no turning back!');

    const messageLines = [
      '[23:12:47.000] ChatLog 00:0839::An avatar of Absolute Virtue has manifested somewhere in Hydatos!',
      '[19:39:13.000] ChatLog 00:0839::The Hand of Erebos manifests!',
      '[12:10:44.000] ChatLog 00:0839::The Pools of Folly will be sealed off in 15 seconds!',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.message(params), messageLines);

    matches = messageLines[0].match(Regexes.message())?.groups;
    assert.equal(
      matches?.line,
      'An avatar of Absolute Virtue has manifested somewhere in Hydatos!',
    );

    const allLines = [
      ...echoLines,
      ...dialogLines,
      ...messageLines,
      ...namedLines,
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.gameLog(params), allLines);
  });
  it('statchange', () => {
    const lines = [
      '[20:29:29.752] PlayerStats 0C:23:311:4093:4245:295:280:340:4094:2496:2675:295:282:2334:578:380:0:382:400023BCF31276',
      '[12:50:15.438] PlayerStats 0C:17:311:348:1010:347:315:340:311:380:380:347:315:340:380:380:0:380:400023BCF31276',
      '[01:11:57.108] PlayerStats 0C:23:305:844:793:290:275:340:844:780:755:290:275:340:380:380:0:380:400023BCF31276',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.statChange(params), lines);

    const matches = lines[0].match(Regexes.statChange())?.groups;
    assert.equal(matches?.job, '23');
    assert.equal(matches?.strength, '311');
    assert.equal(matches?.dexterity, '4093');
    assert.equal(matches?.vitality, '4245');
    assert.equal(matches?.intelligence, '295');
    assert.equal(matches?.mind, '280');
    assert.equal(matches?.piety, '340');
    assert.equal(matches?.attackPower, '4094');
    assert.equal(matches?.directHit, '2496');
    assert.equal(matches?.criticalHit, '2675');
    assert.equal(matches?.attackMagicPotency, '295');
    assert.equal(matches?.healMagicPotency, '282');
    assert.equal(matches?.determination, '2334');
    assert.equal(matches?.skillSpeed, '578');
    assert.equal(matches?.spellSpeed, '380');
    assert.equal(matches?.tenacity, '382');
    assert.equal(matches?.localContentId, '400023BCF31276');
  });
  it('changeZone', () => {
    const lines = [
      '[20:29:29.752] Territory 01:123:The Lavender Beds',
      '[12:50:15.438] Territory 01:456:The Unending Coil Of Bahamut (Ultimate)',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.changeZone(params), lines);

    const matches = lines[0].match(Regexes.changeZone())?.groups;
    assert.equal(matches?.id, '123');
    assert.equal(matches?.name, 'The Lavender Beds');
  });
  it('network6D', () => {
    const lines = [
      '[23:12:47.000] Director 21:8003757D:80000004:1AF3:01:02:03',
      '[19:39:13.000] Director 21:8003753A:8000000C:1C:19F:00:00',
      '[12:10:44.000] Director 21:80037543:40000007:01:00:00:00',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.network6d(params), lines);

    const matches = lines[0].match(Regexes.network6d())?.groups;
    assert.equal(matches?.instance, '8003757D');
    assert.equal(matches?.command, '80000004');
    assert.equal(matches?.data0, '1AF3');
    assert.equal(matches?.data1, '01');
    assert.equal(matches?.data2, '02');
    assert.equal(matches?.data3, '03');
  });
  it('map', () => {
    const lines = [
      '[19:43:08.627] ChangeMap 28:578:Norvrandt:The Copied Factory:Upper Stratum',
      '[19:46:49.383] ChangeMap 28:575:Norvrandt:Excavation Tunnels:',
      '[19:49:19.818] ChangeMap 28:192:La Noscea:Mist:Mist Subdivision',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.map(params), lines);

    const matches = lines[0].match(Regexes.map())?.groups;
    assert.equal(matches?.id, '578');
    assert.equal(matches?.regionName, 'Norvrandt');
    assert.equal(matches?.placeName, 'The Copied Factory');
    assert.equal(matches?.placeNameSub, 'Upper Stratum');
  });
  it('systemLogMessage', () => {
    const lines = [
      '[10:38:40.066] SystemLogMessage 29:00:901:619A9200:00:3C',
      '[10:50:13.565] SystemLogMessage 29:8004001E:7DD:FF5FDA02:E1B:00',
      '[10:55:06.707] SystemLogMessage 29:8004001E:B3A:00:00:E0000000',
    ] as const;
    regexCaptureTest((params?: RegexUtilParams) => Regexes.systemLogMessage(params), lines);

    const matches = lines[0].match(Regexes.systemLogMessage())?.groups;
    assert.equal(matches?.id, '901');
    assert.equal(matches?.param0, '619A9200');
    assert.equal(matches?.param1, '00');
    assert.equal(matches?.param2, '3C');
  });
});

'use strict';

// Notes:
// Ignoring Gobsway Rumblerocks (1AA0) aoe trigger, as it is small and frequent.

[{
  zoneRegex: {
    en: /^Alexander - The Breath Of The Creator \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(天动之章2\)$/,
  },
  timelineFile: 'a10s.txt',
  timelineTriggers: [
    {
      id: 'A10S Goblin Rush',
      regex: /Goblin Rush/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 1,
      response: Responses.miniBuster(),
    },
    {
      id: 'A10S Gobbie Adds',
      regex: /Gobbie Adds/,
      beforeSeconds: 0,
      suppressSeconds: 1,
      infoText: {
        en: 'Hit Adds With Spike Trap',
        cn: '使用铁锤陷阱击中小怪',
      },
    },
  ],
  triggers: [
    {
      id: 'A10S Floor Spike Trap',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB2', capture: false }),
      infoText: {
        en: 'Floor Spikes',
        cn: '地刺陷阱',
      },
    },
    {
      id: 'A10S Frost Laser Trap',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB1', capture: false }),
      infoText: {
        en: 'Frost Lasers',
        cn: '冰晶陷阱',
      },
    },
    {
      id: 'A10S Ceiling Weight Trap',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB0', capture: false }),
      infoText: {
        en: 'Ceiling Weight',
        cn: '铁球陷阱',
      },
    },
    {
      id: 'A10S Charge Marker',
      // This also handles the "single charge" call.
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB[89AB]' }),
      preRun: function(data, matches) {
        data.charges = data.charges || [];
        data.charges.push({
          '1AB8': Responses.getIn,
          '1AB9': Responses.getOut,
          '1ABA': Responses.spread,
          '1ABB': Responses.stack,
        }[matches.id]);
      },
      response: function(data) {
        // Call the first one out with alert, the other two with info.
        let severity = data.charges.length > 1 ? 'info' : 'alert';
        return data.charges[data.charges.length - 1](severity);
      },
    },
    {
      id: 'A10S Charge 1',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1A9[789]', capture: false }),
      run: function(data) {
        if (data.charges)
          data.charges.shift();
      },
    },
    {
      id: 'A10S Charge Double Triple',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1A9[ABCE]', capture: false }),
      suppressSeconds: 0.5,
      response: function(data) {
        if (!data.charges || !data.charges.length)
          return;

        return data.charges.shift()('alert');
      },
    },
    {
      id: 'A10S Charge Clear',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1A9[789]', capture: false }),
      delaySeconds: 10,
      run: function(data) {
        // Cleanup just in case.
        delete data.charges;
      },
    },
    {
      id: 'A10S Gobrush Rushgob',
      regex: Regexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1A9F' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'A10S Slicetops Tether',
      regex: Regexes.tether({ source: 'Lamebrix Strikebocks', id: '0039' }),
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Tank Swap, Get Away',
          cn: '换T并且远离',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
            ja: 'タンクスイッチ',
            cn: '换T！',
            ko: '탱 교대',
          };
        }
        if (data.role == 'healer' || data.job == 'blu') {
          return {
            en: 'Shield ' + data.ShortName(matches.target),
            cn: '单盾' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A10S Gobsnick Leghops',
      regex: Regexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1AA4', capture: false }),
      response: Responses.stopEverything(),
    },
    {
      id: 'A10S Brighteyes Tracker',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AA9', capture: false }),
      run: function(data) {
        // This comes out 0.1s before every '0029' prey marker.
        data.seenBrighteyes = true;
      },
    },
    {
      id: 'A10S Brighteyes Cleanup',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1AA9', capture: false }),
      delaySeconds: 20,
      suppressSeconds: 20,
      run: function(data) {
        delete data.seenBrighteyes;
      },
    },
    {
      id: 'A10S Brighteyes Prey Marker',
      regex: Regexes.headMarker({ id: '0029' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Prey on YOU',
        cn: '火圈点名',
      },
    },
    {
      id: 'A10S Brighteyes Prey Marker Pass',
      regex: Regexes.headMarker({ id: '0029' }),
      condition: function(data, matches) {
        // Only need to pass on the first one.
        return data.me == matches.target && !data.seenBrighteyes;
      },
      delaySeconds: 5,
      infoText: {
        en: 'Pass Prey',
        cn: '传递点名',
      },
    },
    {
      id: 'A10S Gobslice Mooncrops',
      regex: Regexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1A92', capture: false }),
      infoText: {
        en: 'Hit Floor Trap',
        cn: '踩地刺陷阱',
      },
    },
    {
      id: 'A10S Gobslice Mooncrops Cast',
      regex: Regexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1A8F', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'A10S Gobspin Zoomdrops',
      regex: Regexes.ability({ source: 'Lamebrix Strikebocks', id: '1A8F', capture: false }),
      infoText: {
        en: 'Hit Boss With Ice',
        cn: '踩冰晶陷阱',
      },
    },
  ],
}];

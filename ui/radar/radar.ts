import HuntData, { HuntEntry, HuntMap, Rank } from '../../resources/hunt';
import { Lang } from '../../resources/languages';
import NetRegexes from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';
import { BaseOptions } from '../../types/data';
import { EventMap } from '../../types/event';
import { NetMatches } from '../../types/net_matches';
import { CactbotBaseRegExp } from '../../types/net_trigger';

import arrowImage from './arrow.png';

import './radar_config';

import '../../resources/defaults.css';
import './radar.css';

type RadarType = 'mob' | 'any';

// TODO: how to avoid copying these from ./radar_config?
// One option could be for X_config to export its default values.
// We could make a helper function to extract them from the template option.

// Options that come radar_config and can be configured in the UI.
const defaultRadarConfigOptions = {
  BRankEnabled: true,
  DetectionRange: 0,
  TTS: false,
  PopSoundAlert: true,
  PopVolume: 0,
  Puller: true,
  Position: true,
} as const;
type RadarConfigOptions = typeof defaultRadarConfigOptions;

// Additional options that can be configured via the user file.
interface RadarOptions extends BaseOptions, RadarConfigOptions {
  PopSound: string;
  RankOptions: {
    [rank in Rank]?: {
      Type?: RadarType;
      Enabled?: boolean;
      PopSoundAlert?: boolean;
    };
  };
  CustomMonsters: HuntMap;
}

// "Monster" is the live version of the static "HuntEntry" data.
type Monster = {
  id: string;
  name: string;
  rank?: Rank;
  hp: number;
  currentHp: number;
  battleTime: number;
  pos: Point2D;
  posZ: number;
  addTime: number;
  dom: HTMLElement;
  puller?: string;
  // already pulled before being detected
  skipPuller: boolean;
}

const defaultOptions: RadarOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultRadarConfigOptions,
  PopSound: '../../resources/sounds/freesound/sonar.ogg',
  RankOptions: {
    'S': {
      Type: 'mob',
      Enabled: true,
    },
    'SS+': {
      Type: 'mob',
      Enabled: true,
    },
    'SS-': {
      Type: 'mob',
      Enabled: true,
    },
    'A': {
      Type: 'mob',
      Enabled: true,
    },
    'B': {
      Type: 'mob',
      Enabled: true,
      PopSoundAlert: false,
    },
  },
  CustomMonsters: {},
};

// Minimum distance a mob with the same name needs to be away from the old
// location before a sound is played and it is treated as a new mob.
// TODO: probably all mobs should be tracked with ids to avoid this.
// TODO: this would also let us handle mobs with the same name better.
const kMinDistanceBeforeSound = 100;

const instanceChangedRegexes = {
  en: NetRegexes.gameLog({ code: '0039', line: 'You are now in the instanced area.*?' }),
  de: NetRegexes.gameLog({ code: '0039', line: 'Du bist nun in dem instanziierten Areal.*?' }),
  fr: NetRegexes.gameLog({ code: '0039', line: 'Vous êtes maintenant dans la zone instanciée.*?' }),
  ja: NetRegexes.gameLog({ code: '0039', line: 'インスタンスエリア.*?' }),
  cn: NetRegexes.gameLog({ code: '0039', line: '当前所在副本区为.*?' }),
  ko: NetRegexes.gameLog({ code: '0039', line: '인스턴스 지역.*?' }),
};

class Point2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Calculates vector length (magnitude)
  length() {
    return Math.sqrt((this.x) * (this.x) + (this.y) * (this.y));
  }

  // Calculate delta vector
  delta(target: Point2D) {
    return new Point2D(target.x - this.x, target.y - this.y);
  }

  // Calculate distance between 2 points
  distance(target: Point2D) {
    return this.delta(target).length();
  }
}

class Point2DWithZ extends Point2D {
  public z: number;

  constructor(x: number, y: number, z: number) {
    super(x, y);
    this.z = z;
  }
}

const posToMap = (h: number) => {
  const offset = 21.5;
  const pitch = 0.02;
  return h * pitch + offset;
};


const PlaySound = (monster: Monster, options: RadarOptions) => {
  if (options.TTS) {
    void callOverlayHandler({
      call: 'cactbotSay',
      text: `${monster.rank ?? ''} ${monster.name}`,
    });
  } else if (options.PopSoundAlert && options.PopSound && options.PopVolume) {
    const audio = new Audio(options.PopSound);
    audio.volume = options.PopVolume;
    void audio.play();
  }
};

class Radar {
  private targetMonsters: { [mobKey: string]: Monster };
  private playerPos: Point2DWithZ | null;
  private playerRotation: number;
  private hunts: HuntMap;
  private lang: Lang;
  private nameToHuntEntry: HuntMap;
  private regexes: {
    abilityFull: CactbotBaseRegExp<'Ability'>;
    addedCombatantFull: CactbotBaseRegExp<'AddedCombatant'>;
    instanceChanged: CactbotBaseRegExp<'GameLog'>;
    wasDefeated: CactbotBaseRegExp<'WasDefeated'>;
  };

  constructor(private options: RadarOptions, private table: HTMLElement) {
    this.targetMonsters = {};
    this.playerPos = null;
    this.playerRotation = 0;
    this.hunts = Object.assign({}, HuntData, this.options.CustomMonsters);
    this.lang = this.options.ParserLanguage ?? 'en';
    this.nameToHuntEntry = {};
    this.regexes = {
      abilityFull: NetRegexes.abilityFull(),
      addedCombatantFull: NetRegexes.addedCombatantFull(),
      instanceChanged: instanceChangedRegexes[this.options.ParserLanguage] || instanceChangedRegexes['en'],
      wasDefeated: NetRegexes.wasDefeated(),
    };

    for (const hunt of Object.values(this.hunts)) {
      let name = hunt.name;
      if (typeof name === 'object' && !Array.isArray(name))
        name = name[this.lang] ?? name['en'];

      if (typeof name === 'string') {
        this.nameToHuntEntry[name.toLowerCase()] = hunt;
      } else {
        for (const nameItem of name)
          this.nameToHuntEntry[nameItem.toLowerCase()] = hunt;
      }
    }
  }

  AddMonster(log: string, hunt: HuntEntry,
      matches: NetMatches['AddedCombatant']) {
    if (!this.playerPos)
      return;
    if (!matches)
      return;
    if (matches.id === undefined ||
        matches.name === undefined ||
        matches.npcNameId === undefined ||
        matches.hp === undefined ||
        matches.currentHp === undefined ||
        matches.x === undefined ||
        matches.y === undefined ||
        matches.z === undefined)
      throw new UnreachableCode();


    if (hunt.id && matches.npcNameId !== hunt.id)
      return;
    if (hunt.regex && !hunt.regex.test(log))
      return;
    if (hunt.hp && parseFloat(matches.hp) < hunt.hp)
      return;
    if (matches.currentHp === '0') // hunt is already dead
      return;

    let options = this.options;
    // option overwrite
    if (hunt.rank && hunt.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[hunt.rank]);
    // Check if monster rank enabled or not in config
    if (hunt.rank === 'B' && !options.BRankEnabled)
      return;
    if (options.Enabled === false)
      return;
    if (options.Type === 'mob') {
      if (!matches.id.startsWith('4'))
        return;
      if (!matches.npcNameId || matches.npcNameId === '0')
        return;
    }

    const mobKey = matches.name.toLowerCase();
    if (!mobKey)
      return;
    const targetMob = this.targetMonsters[mobKey];
    if (targetMob) {
      // Get positions
      const playerPos = new Point2D(this.playerPos.x, this.playerPos.y);
      const oldPos = targetMob.pos;
      const newPos =
        new Point2D(parseFloat(matches.x), parseFloat(matches.y));

      // Calculate distances
      const oldDistance = playerPos.distance(oldPos);
      const newDistance = playerPos.distance(newPos);

      // Update position only if its closer than the current one
      if (newDistance < oldDistance) {
        targetMob.pos = newPos;
        targetMob.posZ = parseFloat(matches.z ?? '0');

        // Update DOM
        this.UpdateMonsterDom(targetMob);

        // Play sound only if its far enough
        if (oldPos.distance(newPos) >= kMinDistanceBeforeSound)
          PlaySound(targetMob, options);
      }
    } else {
      // Add DOM
      const arrowId = `arrow-${matches.id}`;
      const tr = document.createElement('tr');
      let th = document.createElement('th');
      const img = document.createElement('img');
      img.setAttribute('id', arrowId);
      img.setAttribute('src', arrowImage);
      img.setAttribute('class', 'radar-image-40');
      th.appendChild(img);
      th.setAttribute('style', 'max-width: 100px');
      tr.appendChild(th);
      th = document.createElement('th');
      th.setAttribute('align', 'left');
      th.appendChild(document.createElement('div'));
      tr.appendChild(th);
      const node = this.table.childNodes[0];
      if (node)
        this.table.insertBefore(tr, node);

      const m = {
        'id': matches.id,
        'name': matches.name,
        'rank': hunt.rank,
        'hp': parseFloat(matches.hp),
        'currentHp': parseFloat(matches.hp),
        'battleTime': 0,
        'pos': new Point2D(parseFloat(matches.x), parseFloat(matches.y)),
        'posZ': parseFloat(matches.z),
        'addTime': Date.now().valueOf(),
        'dom': tr,
        'puller': undefined,
        'skipPuller': matches.hp !== matches.currentHp, // already pulled before being detected
      };
      this.targetMonsters[mobKey] = m;
      this.UpdateMonsterDom(m);

      const mapX = posToMap(m.pos.x).toFixed(1);
      const mapY = posToMap(m.pos.y).toFixed(1);
      console.log(`Found: ${m.name} (${mapX}, ${mapY})`);

      PlaySound(m, options);
    }
  }

  UpdateMonsterPuller(monster: Monster, puller: string) {
    if (!this.options.Puller)
      return;
    if (monster.puller || monster.skipPuller)
      return;
    monster.puller = puller;
    this.UpdateMonsterDom(monster);
    console.log(`Pulled: ${puller} => ${monster.name}`);
  }

  UpdateMonsterDom(monster: Monster) {
    // Wait for OnPlayerChange.
    if (!this.playerPos)
      return;

    let options = this.options;
    if (monster.rank && monster.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[monster.rank]);
    const tr = monster.dom;
    // calculate rotation based on facing
    const playerVector = new Point2D(this.playerPos.x, this.playerPos.y);
    const targetVector = monster.pos;
    const deltaVector = new Point2D(
        targetVector.x - playerVector.x,
        targetVector.y - playerVector.y,
    );
    if (tr) {
      const node = tr.childNodes[1];
      if (node && node instanceof HTMLElement) {
        node.innerHTML = `${monster.rank ?? ''}&nbsp;&nbsp;&nbsp;&nbsp;${monster.name}`;
        if (Math.abs(this.playerPos.z - monster.posZ) > 5)
          node.innerHTML += '&nbsp;&nbsp;' + (this.playerPos.z < monster.posZ ? '↑' : '↓');
        node.innerHTML += '<br>' + deltaVector.length().toFixed(2) + 'm';
        if (Date.now().valueOf() / 1000 <= monster.battleTime + 60) {
          node.innerHTML += ' ' + (monster.currentHp * 100 /
            monster.hp).toFixed(2) + '%';
        }
        if (monster.puller)
          node.innerHTML += '&nbsp;&nbsp;' + monster.puller;
        // Z position is relative to the map so it's omitted.
        if (options.Position) {
          node.innerHTML += '<br>X: ' +
            posToMap(monster.pos.x).toFixed(1) + '&nbsp;&nbsp;Y:' +
            posToMap(monster.pos.y).toFixed(1);
        }
      }
    }
    if (options.DetectionRange > 0 && deltaVector.length() > options.DetectionRange)
      monster.dom.classList.add('hide');
    else
      monster.dom.classList.remove('hide');

    let deltaTheta = Math.atan2(deltaVector.y, deltaVector.x);
    deltaTheta -= Math.PI - this.playerRotation;
    const angle = deltaTheta * 180 / Math.PI;
    const arrowId = `arrow-${monster.id}`;
    const arrow = document.getElementById(arrowId);
    if (arrow)
      arrow.style.transform = `rotate(${angle}deg)`;
  }

  RemoveMonster(mobKey: string) {
    const monster = this.targetMonsters[mobKey];
    if (!monster)
      return;
    console.log(`Killed: ${monster.name}`);
    monster.dom.remove();
    delete this.targetMonsters[mobKey];
  }

  OnNetLog(e: { line: string[]; rawLine: string }) {
    const type = e.line[0];
    const log = e.rawLine;

    // added new combatant
    if (type === '03') {
      const m = this.regexes.addedCombatantFull.exec(log);
      const matches = m?.groups;
      if (!matches)
        return;
      const name = matches.name?.toLowerCase();
      if (!name)
        return;
      const hunt = this.nameToHuntEntry[name];
      if (!hunt)
        return;
      this.AddMonster(log, hunt, matches);
    }

    // network ability
    if (type === '21' || type === '22') {
      const m = this.regexes.abilityFull.exec(log);
      const matches = m?.groups;
      if (!matches)
        return;
      const name = matches.target?.toLowerCase();
      if (!name)
        return;
      const monster = this.targetMonsters[name];
      if (!monster)
        return;

      // provoke doesn't work on hunt mobs
      const isProvoke = matches?.id === '1D6D';
      if (!isProvoke) {
        const source = matches?.source;
        if (source)
          this.UpdateMonsterPuller(monster, source);
      }
    }

    // change instance
    if (type === '00') {
      if (this.regexes.instanceChanged.test(log)) {
        // don't remove mobs lasting less than 10 seconds
        this.ClearTargetMonsters(10);
      }
      return;
    }

    // removing combatant
    if (type === '25') {
      const m = this.regexes.wasDefeated.exec(log);
      const matches = m?.groups;
      if (!matches)
        return;
      const name = matches.target?.toLowerCase();
      if (name)
        this.RemoveMonster(name);
    }
  }

  OnPlayerChange(e: Parameters<EventMap['onPlayerChangedEvent']>[0]) {
    if (!this.playerPos) {
      this.playerPos = new Point2DWithZ(e.detail.pos.x, e.detail.pos.y, e.detail.pos.z);
    } else {
      this.playerPos.x = e.detail.pos.x;
      this.playerPos.y = e.detail.pos.y;
      this.playerPos.z = e.detail.pos.z;
    }

    this.playerRotation = e.detail.rotation;
    for (const monster of Object.values(this.targetMonsters))
      this.UpdateMonsterDom(monster);
  }

  OnChangeZone() {
    this.ClearTargetMonsters();
  }

  ClearTargetMonsters(deltaTime?: number) {
    const deltaTimeThreshold = deltaTime ?? 0;
    for (const [mobKey, monster] of Object.entries(this.targetMonsters)) {
      if ((Date.now() - monster.addTime) / 1000 > deltaTimeThreshold) {
        monster.dom.remove();
        delete this.targetMonsters[mobKey];
      }
    }
  }
}

UserConfig.getUserConfigLocation('radar', defaultOptions, () => {
  const options = { ...defaultOptions };
  const elem = document.getElementById('radar-table');
  if (!elem)
    throw new Error('missing radar element');
  const radar = new Radar(options, elem);

  addOverlayListener('LogLine', (e) => {
    radar.OnNetLog(e);
  });

  addOverlayListener('onPlayerChangedEvent', (e) => {
    radar.OnPlayerChange(e);
  });

  addOverlayListener('ChangeZone', () => {
    radar.OnChangeZone();
  });
});

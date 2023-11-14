import { Party } from '../types/event';
import { Job, Role } from '../types/job';
import { PartyMemberParamObject, PartyTrackerOptions } from '../types/party';
import Options from '../ui/raidboss/raidboss_options';

import { Lang } from './languages';
import Util from './util';

const emptyRoleToPartyNames = () => {
  return {
    tank: [],
    healer: [],
    dps: [],
    crafter: [],
    gatherer: [],
    none: [],
  };
};

// TODO: de fr ko
const roleLocalized: Record<Role, Partial<Record<Lang, string>>> = {
  tank: { ja: 'タンク', cn: '坦克' },
  healer: { ja: 'ヒーラー', cn: '治疗' },
  dps: { ja: 'DPS', cn: '输出' },
  crafter: { ja: 'クラフター', cn: '能工巧匠' },
  gatherer: { ja: 'ギャザラー', cn: '大地使者' },
  none: { ja: 'すっぴん士', cn: '冒险者' },
};

// TODO: ja de fr ko
const jobLocalized: Record<Job, Record<'abbr' | 'full', Partial<Record<Lang, string>>>> = {
  NONE: {
    abbr: { cn: '冒险' },
    full: { en: 'Adventurer', ja: 'すっぴん士', cn: '冒险者' },
  },
  GLA: {
    abbr: { cn: '剑术' },
    full: { en: 'Gladiator', ja: '剣術士', cn: '剑术师' },
  },
  PGL: {
    abbr: { cn: '格斗' },
    full: { en: 'Pugilist', ja: '格闘士', cn: '格斗家' },
  },
  MRD: {
    abbr: { cn: '斧术' },
    full: { en: 'Marauder', ja: '斧術士', cn: '斧术师' },
  },
  LNC: {
    abbr: { cn: '枪术' },
    full: { en: 'Lancer', ja: '槍術士', cn: '枪术师' },
  },
  ARC: {
    abbr: { cn: '弓箭' },
    full: { en: 'Archer', ja: '弓術士', cn: '弓箭手' },
  },
  CNJ: {
    abbr: { cn: '幻术' },
    full: { en: 'Conjurer', ja: '幻術士', cn: '幻术师' },
  },
  THM: {
    abbr: { cn: '咒术' },
    full: { en: 'Thaumaturge', ja: '呪術士', cn: '咒术师' },
  },
  CRP: {
    abbr: { cn: '刻木' },
    full: { en: 'Carpenter', ja: '木工師', cn: '刻木匠' },
  },
  BSM: {
    abbr: { cn: '锻铁' },
    full: { en: 'Blacksmith', ja: '鍛冶師', cn: '锻铁匠' },
  },
  ARM: {
    abbr: { cn: '铸甲' },
    full: { en: 'Armorer', ja: '甲冑師', cn: '铸甲匠' },
  },
  GSM: {
    abbr: { cn: '雕金' },
    full: { en: 'Goldsmith', ja: '彫金師', cn: '雕金匠' },
  },
  LTW: {
    abbr: { cn: '制革' },
    full: { en: 'Leatherworker', ja: '革細工師', cn: '制革匠' },
  },
  WVR: {
    abbr: { cn: '裁衣' },
    full: { en: 'Weaver', ja: '裁縫師', cn: '裁衣匠' },
  },
  ALC: {
    abbr: { cn: '炼金' },
    full: { en: 'Alchemist', ja: '錬金術師', cn: '炼金术士' },
  },
  CUL: {
    abbr: { cn: '烹调' },
    full: { en: 'Culinarian', ja: '調理師', cn: '烹调师' },
  },
  MIN: {
    abbr: { cn: '采矿' },
    full: { en: 'Miner', ja: '採掘師', cn: '采矿工' },
  },
  BTN: {
    abbr: { cn: '园艺' },
    full: { en: 'Botanist', ja: '園芸師', cn: '园艺工' },
  },
  FSH: {
    abbr: { cn: '捕鱼' },
    full: { en: 'Fisher', ja: '漁師', cn: '捕鱼人' },
  },
  PLD: {
    abbr: { cn: '骑士' },
    full: { en: 'Paladin', ja: 'ナイト', cn: '骑士' },
  },
  MNK: {
    abbr: { cn: '武僧' },
    full: { en: 'Monk', ja: 'モンク', cn: '武僧' },
  },
  WAR: {
    abbr: { cn: '战士' },
    full: { en: 'Warrior', ja: '戦士', cn: '战士' },
  },
  DRG: {
    abbr: { cn: '龙骑' },
    full: { en: 'Dragoon', ja: '竜騎士', cn: '龙骑士' },
  },
  BRD: {
    abbr: { cn: '诗人' },
    full: { en: 'Bard', ja: '吟遊詩人', cn: '吟游诗人' },
  },
  WHM: {
    abbr: { cn: '白魔' },
    full: { en: 'White Mage', ja: '白魔道士', cn: '白魔法师' },
  },
  BLM: {
    abbr: { cn: '黑魔' },
    full: { en: 'Black Mage', ja: '黒魔道士', cn: '黑魔法师' },
  },
  ACN: {
    abbr: { cn: '秘术' },
    full: { en: 'Arcanist', ja: '巴術士', cn: '秘术师' },
  },
  SMN: {
    abbr: { cn: '召唤' },
    full: { en: 'Summoner', ja: '召喚士', cn: '召唤师' },
  },
  SCH: {
    abbr: { cn: '学者' },
    full: { en: 'Scholar', ja: '学者', cn: '学者' },
  },
  ROG: {
    abbr: { cn: '双剑' },
    full: { en: 'Rogue', ja: '双剣士', cn: '双剑师' },
  },
  NIN: {
    abbr: { cn: '忍者' },
    full: { en: 'Ninja', ja: '忍者', cn: '忍者' },
  },
  MCH: {
    abbr: { cn: '机工' },
    full: { en: 'Machinist', ja: '機工士', cn: '机工士' },
  },
  DRK: {
    abbr: { cn: '暗骑' },
    full: { en: 'Dark Knight', ja: '暗黒騎士', cn: '暗黑骑士' },
  },
  AST: {
    abbr: { cn: '占星' },
    full: { en: 'Astrologian', ja: '占星術師', cn: '占星术士' },
  },
  SAM: {
    abbr: { cn: '武士' },
    full: { en: 'Samurai', ja: '侍', cn: '武士' },
  },
  RDM: {
    abbr: { cn: '赤魔' },
    full: { en: 'Red Mage', ja: '赤魔道士', cn: '赤魔法师' },
  },
  BLU: {
    abbr: { cn: '青魔' },
    full: { en: 'Blue Mage', ja: '青魔道士', cn: '青魔法师' },
  },
  GNB: {
    abbr: { cn: '绝枪' },
    full: { en: 'Gunbreaker', ja: 'ガンブレイカー', cn: '绝枪战士' },
  },
  DNC: {
    abbr: { cn: '舞者' },
    full: { en: 'Dancer', ja: '踊り子', cn: '舞者' },
  },
  RPR: {
    abbr: { cn: '钐镰' },
    full: { en: 'Reaper', ja: 'リーパー', cn: '钐镰客' },
  },
  SGE: {
    abbr: { cn: '贤者' },
    full: { en: 'Sage', ja: '賢者', cn: '贤者' },
  },
};

export default class PartyTracker {
  details: Party[] = [];
  partyNames_: string[] = [];
  partyIds_: string[] = [];
  allianceNames_: string[] = [];
  allianceIds_: string[] = [];
  nameToRole_: { [name: string]: Role } = {};
  idToName_: { [id: string]: string } = {};
  roleToPartyNames_: Record<Role, string[]> = emptyRoleToPartyNames();

  constructor(private options: PartyTrackerOptions) {}

  // Bind this to PartyChanged events.
  onPartyChanged(e: { party: Party[] }): void {
    this.reset();
    this.details = e.party;

    for (const p of e.party) {
      this.allianceIds_.push(p.id);
      this.allianceNames_.push(p.name);
      const jobName = Util.jobEnumToJob(p.job);
      const role = Util.jobToRole(jobName);
      this.idToName_[p.id] = p.name;
      this.nameToRole_[p.name] = role;
      if (p.inParty) {
        this.partyIds_.push(p.id);
        this.partyNames_.push(p.name);
        this.roleToPartyNames_[role].push(p.name);
      }
    }
  }

  reset(): void {
    // original event data
    this.details = [];
    this.partyNames_ = [];
    this.partyIds_ = [];
    this.allianceNames_ = [];
    this.allianceIds_ = [];
    this.nameToRole_ = {};
    this.idToName_ = {};

    // role -> [names] but only for party
    this.roleToPartyNames_ = emptyRoleToPartyNames();
  }

  // returns an array of the names of players in your immediate party
  get partyNames(): readonly string[] {
    return this.partyNames_;
  }

  get partyIds(): readonly string[] {
    return this.partyIds_;
  }

  // returns an array of the names of players in your alliance
  get allianceNames(): readonly string[] {
    return this.allianceNames_;
  }

  // returns an array of the names of tanks in your immediate party
  get tankNames(): readonly string[] {
    return this.roleToPartyNames_['tank'];
  }

  // returns an array of the names of healers in your immediate party
  get healerNames(): readonly string[] {
    return this.roleToPartyNames_['healer'];
  }

  // returns an array of the names of dps players in your immediate party
  get dpsNames(): readonly string[] {
    return this.roleToPartyNames_['dps'];
  }

  // returns true if the named player in your alliance is a particular role
  isRole(name: string, role: string): boolean {
    return this.nameToRole_[name] === role;
  }

  // returns true if the named player in your alliance is a tank
  isTank(name: string): boolean {
    return this.isRole(name, 'tank');
  }

  // returns true if the named player in your alliance is a healer
  isHealer(name: string): boolean {
    return this.isRole(name, 'healer');
  }

  // returns true if the named player in your alliance is a dps
  isDPS(name: string): boolean {
    return this.isRole(name, 'dps');
  }

  // returns true if the named player is in your immediate party
  inParty(name: string): boolean {
    return this.partyNames.includes(name);
  }

  // returns true if the named player is in your alliance
  inAlliance(name: string): boolean {
    return this.allianceNames.includes(name);
  }

  // for a named player, returns the other tank in your immediate party
  // if named player is not a tank, or there's not exactly two tanks
  // in your immediate party, returns null.
  otherTank(name: string): string | undefined {
    const names = this.tankNames;
    if (names.length !== 2)
      return;
    if (names[0] === name)
      return names[1];
    if (names[1] === name)
      return names[0];
  }

  // see: otherTank, but for healers.
  otherHealer(name: string): string | undefined {
    const names = this.healerNames;
    if (names.length !== 2)
      return;
    if (names[0] === name)
      return names[1];
    if (names[1] === name)
      return names[0];
  }

  // returns the job name of the specified party member
  jobName(name: string): Job | undefined {
    const partyIndex = this.partyNames.indexOf(name);
    if (partyIndex < 0)
      return;
    const job = this.details[partyIndex]?.job;
    if (job === undefined)
      return;
    return Util.jobEnumToJob(job);
  }

  nameFromId(id: string): string | undefined {
    return this.idToName_[id];
  }

  member(name?: string): PartyMemberParamObject {
    // For boilerplate convenience in triggers, handle undefined names.
    if (name === undefined) {
      const unknown = '???';
      return {
        name: unknown,
        nick: unknown,
        toString: () => unknown,
      };
    }

    const partyMember = this.details.find((member) => member.name === name);
    let ret: PartyMemberParamObject;
    const nick = Util.shortName(name, this.options.PlayerNicks);

    if (!partyMember) {
      // If we can't find this party member for some reason, use some sort of default.
      ret = {
        name: name,
        nick: nick,
      };
    } else {
      const job = Util.jobEnumToJob(partyMember.job);
      const jobAbbr = jobLocalized[job]?.abbr?.[Options.AlertsLanguage ?? 'en'] ?? job;
      const jobFull = jobLocalized[job]?.full?.[Options.AlertsLanguage ?? 'en'] ?? job;
      const role = Util.jobToRole(job);
      const roleName = roleLocalized[role]?.[Options.AlertsLanguage ?? 'en'] ?? role;
      ret = {
        id: partyMember.id,
        job: job,
        jobAbbr: jobAbbr,
        jobFull: jobFull,
        role: roleName,
        name: name,
        nick: nick,
      };
    }

    // Need to assign this afterwards so it can reference `ret`.
    ret.toString = () => {
      const retVal = ret[this.options.DefaultPlayerLabel];
      if (typeof retVal === 'string')
        return retVal;
      return ret.nick;
    };

    return ret;
  }
}

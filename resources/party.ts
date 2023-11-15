import { Party } from '../types/event';
import { Job, Role } from '../types/job';
import { PartyMemberParamObject, PartyTrackerOptions } from '../types/party';
import { LocaleText } from '../types/trigger';

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

const roleLocalized: Record<Role, LocaleText> = {
  tank: {
    en: 'tank',
    ja: 'タンク',
    cn: '坦克',
    ko: '탱커',
  },
  healer: {
    en: 'healer',
    ja: 'ヒーラー',
    cn: '治疗',
    ko: '힐러',
  },
  dps: {
    en: 'dps',
    ja: 'DPS',
    cn: '输出',
    ko: '딜러',
  },
  crafter: {
    en: 'crafter',
    ja: 'クラフター',
    cn: '能工巧匠',
    ko: '제작가',
  },
  gatherer: {
    en: 'gatherer',
    ja: 'ギャザラー',
    cn: '大地使者',
    ko: '채집가',
  },
  none: {
    en: 'none',
    ja: '冒険者',
    cn: '冒险者',
    ko: '모험가',
  },
};

const jobLocalizedAbbr: Record<Job, LocaleText> = {
  NONE: {
    en: 'NONE',
    ja: '冒険者',
    cn: '冒险',
    ko: '모험가',
  },
  GLA: {
    en: 'GLA',
    ja: '剣術士',
    cn: '剑术',
    ko: '검술',
  },
  PGL: {
    en: 'PGL',
    ja: '格闘士',
    cn: '格斗',
    ko: '격투',
  },
  MRD: {
    en: 'MRD',
    ja: '斧術士',
    cn: '斧术',
    ko: '도끼술',
  },
  LNC: {
    en: 'LNC',
    ja: '槍術士',
    cn: '枪术',
    ko: '창술',
  },
  ARC: {
    en: 'ARC',
    ja: '弓術士',
    cn: '弓箭',
    ko: '궁술',
  },
  CNJ: {
    en: 'CNJ',
    ja: '幻術士',
    cn: '幻术',
    ko: '환술',
  },
  THM: {
    en: 'THM',
    ja: '呪術士',
    cn: '咒术',
    ko: '주술',
  },
  CRP: {
    en: 'CRP',
    ja: '木工',
    cn: '刻木',
    ko: '목수',
  },
  BSM: {
    en: 'BSM',
    ja: '鍛冶',
    cn: '锻铁',
    ko: '대장',
  },
  ARM: {
    en: 'ARM',
    ja: '甲冑',
    cn: '铸甲',
    ko: '갑주',
  },
  GSM: {
    en: 'GSM',
    ja: '彫金',
    cn: '雕金',
    ko: '보석',
  },
  LTW: {
    en: 'LTW',
    ja: '革細',
    cn: '制革',
    ko: '가죽',
  },
  WVR: {
    en: 'WVR',
    ja: '裁縫',
    cn: '裁衣',
    ko: '재봉',
  },
  ALC: {
    en: 'ALC',
    ja: '錬金',
    cn: '炼金',
    ko: '연금',
  },
  CUL: {
    en: 'CUL',
    ja: '調理',
    cn: '烹调',
    ko: '요리',
  },
  MIN: {
    en: 'MIN',
    ja: '採掘',
    cn: '采矿',
    ko: '광부',
  },
  BTN: {
    en: 'BTN',
    ja: '園芸',
    cn: '园艺',
    ko: '원예',
  },
  FSH: {
    en: 'FSH',
    ja: '漁師',
    cn: '捕鱼',
    ko: '어부',
  },
  PLD: {
    en: 'PLD',
    ja: 'ナイト',
    cn: '骑士',
    ko: '나이트',
  },
  MNK: {
    en: 'MNK',
    ja: 'モンク',
    cn: '武僧',
    ko: '몽크',
  },
  WAR: {
    en: 'WAR',
    ja: '戦士',
    cn: '战士',
    ko: '전사',
  },
  DRG: {
    en: 'DRG',
    ja: '竜騎士',
    cn: '龙骑',
    ko: '용기사',
  },
  BRD: {
    en: 'BRD',
    ja: '詩人',
    cn: '诗人',
    ko: '음유',
  },
  WHM: {
    en: 'WHM',
    ja: '白魔',
    cn: '白魔',
    ko: '백마',
  },
  BLM: {
    en: 'BLM',
    ja: '黒魔',
    cn: '黑魔',
    ko: '흑마',
  },
  ACN: {
    en: 'ACN',
    ja: '巴術士',
    cn: '秘术',
    ko: '비술',
  },
  SMN: {
    en: 'SMN',
    ja: '召喚',
    cn: '召唤',
    ko: '소환',
  },
  SCH: {
    en: 'SCH',
    ja: '学者',
    cn: '学者',
    ko: '학자',
  },
  ROG: {
    en: 'ROG',
    ja: '双剣士',
    cn: '双剑',
    ko: '쌍검',
  },
  NIN: {
    en: 'NIN',
    ja: '忍者',
    cn: '忍者',
    ko: '닌자',
  },
  MCH: {
    en: 'MCH',
    ja: '機工',
    cn: '机工',
    ko: '기공',
  },
  DRK: {
    en: 'DRK',
    ja: '暗黒',
    cn: '暗骑',
    ko: '암기',
  },
  AST: {
    en: 'AST',
    ja: '占星',
    cn: '占星',
    ko: '점성',
  },
  SAM: {
    en: 'SAM',
    ja: '侍',
    cn: '武士',
    ko: '사무',
  },
  RDM: {
    en: 'RDM',
    ja: '赤魔',
    cn: '赤魔',
    ko: '적마',
  },
  BLU: {
    en: 'BLU',
    ja: '青魔',
    cn: '青魔',
    ko: '청마',
  },
  GNB: {
    en: 'GNB',
    ja: 'ガンブレ',
    cn: '绝枪',
    ko: '건브',
  },
  DNC: {
    en: 'DNC',
    ja: '踊り子',
    cn: '舞者',
    ko: '무도',
  },
  RPR: {
    en: 'RPR',
    ja: 'リーパー',
    cn: '钐镰',
    ko: '리퍼',
  },
  SGE: {
    en: 'SGE',
    ja: '賢者',
    cn: '贤者',
    ko: '현자',
  },
};

const jobLocalizedFull: Record<Job, LocaleText> = {
  NONE: {
    en: 'Adventurer',
    ja: '冒険者',
    cn: '冒险者',
    ko: '모험가',
  },
  GLA: {
    en: 'Gladiator',
    ja: '剣術士',
    cn: '剑术师',
    ko: '검술사',
  },
  PGL: {
    en: 'Pugilist',
    ja: '格闘士',
    cn: '格斗家',
    ko: '격투가',
  },
  MRD: {
    en: 'Marauder',
    ja: '斧術士',
    cn: '斧术师',
    ko: '도끼술사',
  },
  LNC: {
    en: 'Lancer',
    ja: '槍術士',
    cn: '枪术师',
    ko: '창술사',
  },
  ARC: {
    en: 'Archer',
    ja: '弓術士',
    cn: '弓箭手',
    ko: '궁술사',
  },
  CNJ: {
    en: 'Conjurer',
    ja: '幻術士',
    cn: '幻术师',
    ko: '환술사',
  },
  THM: {
    en: 'Thaumaturge',
    ja: '呪術士',
    cn: '咒术师',
    ko: '주술사',
  },
  CRP: {
    en: 'Carpenter',
    ja: '木工師',
    cn: '刻木匠',
    ko: '목수',
  },
  BSM: {
    en: 'Blacksmith',
    ja: '鍛冶師',
    cn: '锻铁匠',
    ko: '대장장이',
  },
  ARM: {
    en: 'Armorer',
    ja: '甲冑師',
    cn: '铸甲匠',
    ko: '갑주제작사',
  },
  GSM: {
    en: 'Goldsmith',
    ja: '彫金師',
    cn: '雕金匠',
    ko: '보석공예가',
  },
  LTW: {
    en: 'Leatherworker',
    ja: '革細工師',
    cn: '制革匠',
    ko: '가죽공예가',
  },
  WVR: {
    en: 'Weaver',
    ja: '裁縫師',
    cn: '裁衣匠',
    ko: '재봉사',
  },
  ALC: {
    en: 'Alchemist',
    ja: '錬金術師',
    cn: '炼金术士',
    ko: '연금술사',
  },
  CUL: {
    en: 'Culinarian',
    ja: '調理師',
    cn: '烹调师',
    ko: '요리사',
  },
  MIN: {
    en: 'Miner',
    ja: '採掘師',
    cn: '采矿工',
    ko: '광부',
  },
  BTN: {
    en: 'Botanist',
    ja: '園芸師',
    cn: '园艺工',
    ko: '원예가',
  },
  FSH: {
    en: 'Fisher',
    ja: '漁師',
    cn: '捕鱼人',
    ko: '어부',
  },
  PLD: {
    en: 'Paladin',
    ja: 'ナイト',
    cn: '骑士',
    ko: '나이트',
  },
  MNK: {
    en: 'Monk',
    ja: 'モンク',
    cn: '武僧',
    ko: '몽크',
  },
  WAR: {
    en: 'Warrior',
    ja: '戦士',
    cn: '战士',
    ko: '전사',
  },
  DRG: {
    en: 'Dragoon',
    ja: '竜騎士',
    cn: '龙骑士',
    ko: '용기사',
  },
  BRD: {
    en: 'Bard',
    ja: '吟遊詩人',
    cn: '吟游诗人',
    ko: '음유시인',
  },
  WHM: {
    en: 'White Mage',
    ja: '白魔道士',
    cn: '白魔法师',
    ko: '백마도사',
  },
  BLM: {
    en: 'Black Mage',
    ja: '黒魔道士',
    cn: '黑魔法师',
    ko: '흑마도사',
  },
  ACN: {
    en: 'Arcanist',
    ja: '巴術士',
    cn: '秘术师',
    ko: '비슬사',
  },
  SMN: {
    en: 'Summoner',
    ja: '召喚士',
    cn: '召唤师',
    ko: '소환사',
  },
  SCH: {
    en: 'Scholar',
    ja: '学者',
    cn: '学者',
    ko: '학자',
  },
  ROG: {
    en: 'Rogue',
    ja: '双剣士',
    cn: '双剑师',
    ko: '쌍검사',
  },
  NIN: {
    en: 'Ninja',
    ja: '忍者',
    cn: '忍者',
    ko: '닌자',
  },
  MCH: {
    en: 'Machinist',
    ja: '機工士',
    cn: '机工士',
    ko: '기공사',
  },
  DRK: {
    en: 'Dark Knight',
    ja: '暗黒騎士',
    cn: '暗黑骑士',
    ko: '암흑기사',
  },
  AST: {
    en: 'Astrologian',
    ja: '占星術師',
    cn: '占星术士',
    ko: '점성술사',
  },
  SAM: {
    en: 'Samurai',
    ja: '侍',
    cn: '武士',
    ko: '사무라이',
  },
  RDM: {
    en: 'Red Mage',
    ja: '赤魔道士',
    cn: '赤魔法师',
    ko: '적마도사',
  },
  BLU: {
    en: 'Blue Mage',
    ja: '青魔道士',
    cn: '青魔法师',
    ko: '청마도사',
  },
  GNB: {
    en: 'Gunbreaker',
    ja: 'ガンブレイカー',
    cn: '绝枪战士',
    ko: '건브레이커',
  },
  DNC: {
    en: 'Dancer',
    ja: '踊り子',
    cn: '舞者',
    ko: '무도가',
  },
  RPR: {
    en: 'Reaper',
    ja: 'リーパー',
    cn: '钐镰客',
    ko: '리퍼',
  },
  SGE: {
    en: 'Sage',
    ja: '賢者',
    cn: '贤者',
    ko: '현자',
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
      const lang = this.options.DisplayLanguage;
      const job = Util.jobEnumToJob(partyMember.job);
      const jobAbbr = jobLocalizedAbbr[job]?.[lang] ?? job;
      const jobFull = jobLocalizedFull[job]?.[lang] ?? job;
      const role = Util.jobToRole(job);
      const roleName = roleLocalized[role]?.[lang] ?? role;
      ret = {
        id: partyMember.id,
        job: jobAbbr,
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

import ContentType from '../../resources/content_type';
import { Job } from '../../types/job';

export const kMeleeWithMpJobs: Job[] = ['PLD', 'DRK'];

export const kMPNormalRate = 0.06;
export const kMPCombatRate = 0.02;
export const kMPUI1Rate = 0.30;
export const kMPUI2Rate = 0.45;
export const kMPUI3Rate = 0.60;
export const kMPTickInterval = 3.0;

/**
 * DoT ticks on every "Eorzea minute",
 * and it is known that 1 "Eorzea day" equals to 70 "Earth minutes",
 * so 1 "Eorzea minute" is equal to `70 * 60 / (1 * 24 * 60)` = `2.9166667`
 */
export const kDoTTickInterval = 70 * 60 / (1 * 24 * 60);

export const kComboDelay = 30;
export const kComboDelay5x = 15;

export const kWellFedContentTypes: number[] = [
  ContentType.Dungeons,
  ContentType.Trials,
  ContentType.Raids,
  ContentType.UltimateRaids,
];

// this object holds effect id that is different from the patch 6.x
// or removed in patch 6.x. In order to support CN/KR that is still
// in patch 5.x, we move them here.
export const patch5xEffectId = {
  FurtherRuin5x: '4BC',
};

export const kAbility = {
  // LB
  ShieldWall: 'C5', // T LB1
  Stronghold: 'C6', // T LB2
  LastBastion: 'C7', // PLD LB3
  LandWaker: '1090', // WAR LB3
  DarkForce: '1091', // DRK LB3
  GunmetalSoul: '42D1', // GNB LB3
  HealingWind: 'CE', // H LB1
  BreathoftheEarth: 'CF', // H LB2
  PulseofLife: 'D0', // WHM LB3
  AngelFeathers: '1097', // SCH LB3
  AstralStasis: '1098', // AST LB3
  Braver: 'C8', // meleeDPS LB1
  Bladedance: 'C9', // meleeDPS LB2
  FinalHeaven: 'CA', // MNK LB3
  Chimatsuri: '1093', // NIN LB3
  DragonsongDive: '1092', // DRG LB3
  DoomoftheLiving: '1EB5', // SAM LB3
  BigShot: '108E', // rangeDPS LB1
  Desperado: '108F', // rangeDPS LB2
  SagittariusArrow: '1094', // BRD LB3
  SatelliteBeam: '1095', // MCH LB3
  CrimsonLotus: '42D2', // DNC LB3
  Skyshard: 'CB', // magicDPS LB1
  Starstorm: 'CC', // magicDPS LB2
  Meteor: 'CD', // BLM LB3
  Teraflare: '1096', // SMN LB3
  VermilionScourge: '1EB6', // RDM LB3
  // PLD
  FastBlade: '09',
  RiotBlade: '0F',
  GoringBlade: 'DD2',
  RoyalAuthority: 'DD3',
  RageOfHalone: '15',
  TotalEclipse: '1CD5',
  Prominence: '4049',
  ShieldLob: '18',
  ShieldBash: '10',
  Requiescat: '1CD7',
  HolySpirit: '1CD8',
  HolyCircle: '404A',
  Confiteor: '404B',
  Clemency: 'DD5',
  FightOrFlight: '14',
  BladeOfValor: '6496',
  // WAR
  HeavySwing: '1F',
  Maim: '25',
  StormsEye: '2D',
  StormsPath: '2A',
  Overpower: '29',
  MythrilTempest: '404E',
  Tomahawk: '2E',
  InnerRelease: '1CDD',
  // DRK
  HardSlash: 'E21',
  SyphonStrike: 'E27',
  Souleater: 'E30',
  Unleash: 'E25',
  StalwartSoul: '4054',
  Unmend: 'E28',
  CarveAndSpit: 'E3B',
  Plunge: 'E38',
  AbyssalDrain: 'E39',
  TheBlackestNight: '1CE1',
  BloodWeapon: 'E29',
  Delirium: '1CDE',
  LivingShadow: '4058',
  // GNB
  KeenEdge: '3F09',
  BrutalShell: '3F0B',
  SolidBarrel: '3F11',
  GnashingFang: '3F12',
  SavageClaw: '3F13',
  WickedTalon: '3F16',
  DemonSlice: '3F0D',
  DemonSlaughter: '3F15',
  LightningShot: '3F0F',
  Bloodfest: '3F24',
  NoMercy: '3F0A',
  // WHM
  Aero: '79',
  Aero2: '84',
  Dia: '4094',
  Assize: 'DF3',
  // SCH
  Bio: '45C8',
  Bio2: '45C9',
  Biolysis: '409C',
  Adloquium: 'B9',
  ChainStratagem: '1D0C',
  Aetherflow: 'A6',
  // AST
  Combust: 'E0F',
  Combust2: 'E18',
  Combust3: '40AA',
  AspectedBenefic: 'E0B',
  AspectedHelios: 'E11',
  Draw: 'E06',
  Divination: '40A8',
  // SGE
  Rhizomata: '5EF5',
  // MNK
  DragonKick: '4A',
  TwinSnakes: '3D',
  Demolish: '42',
  Bootshine: '35',
  FourPointFury: '4059',
  Brotherhood: '1CE4',
  // DRG
  TrueThrust: '4B',
  RaidenThrust: '405F',
  VorpalThrust: '4E',
  FullThrust: '54',
  Disembowel: '57',
  ChaosThrust: '58',
  FangAndClaw: 'DE2',
  WheelingThrust: 'DE4',
  DoomSpike: '56',
  SonicThrust: '1CE5',
  CoerthanTorment: '405D',
  PiercingTalon: '5A',
  HighJump: '405E',
  Jump: '5C',
  LanceCharge: '55',
  DragonSight: '1CE6',
  BattleLitany: 'DE5',
  DraconianFury: '64AA',
  // NIN
  SpinningEdge: '8C0',
  GustSlash: '8C2',
  AeolianEdge: '8CF',
  ArmorCrush: 'DEB',
  DeathBlossom: '8CE',
  HakkeMujinsatsu: '4068',
  ThrowingDagger: '8C7',
  TrickAttack: '8D2',
  RabbitMedium: '8E0',
  Bunshin: '406D',
  Hide: '8C5',
  // SAM
  Hakaze: '1D35',
  Jinpu: '1D36',
  Shifu: '1D37',
  Gekko: '1D39',
  Kasha: '1D3A',
  Yukikaze: '1D38',
  Fuga: '1D3B',
  Mangetsu: '1D3C',
  Oka: '1D3D',
  Enpi: '1D3E',
  MeikyoShisui: '1D4B',
  KaeshiHiganbana: '4064',
  KaeshiGoken: '4065',
  KaeshiSetsugekka: '4066',
  HissatsuGuren: '1D48',
  HissatsuSenei: '4061',
  Fuko: '64B4',
  // RPR
  ArcaneCircle: '5F55',
  // BRD
  BattleVoice: '76',
  MagesBallad: '72',
  ArmysPaeon: '74',
  theWanderersMinuet: 'DE7',
  // MCH
  SplitShot: 'B32',
  SlugShot: 'B34',
  CleanShot: 'B39',
  HeatedSplitShot: '1CF3',
  HeatedSlugShot: '1CF4',
  HeatedCleanShot: '1CF5',
  SpreadShot: 'B36',
  Drill: '4072',
  Bioblaster: '4073',
  HotShot: 'B38',
  AirAnchor: '4074',
  WildFire: 'B3E',
  HeatBlast: '1CF2',
  AutoCrossbow: '4071',
  ChainSaw: '64BC',
  // DNC
  Cascade: '3E75',
  Fountain: '3E76',
  Windmill: '3E79',
  Bladeshower: '3E7A',
  QuadrupleTechnicalFinish: '3F44',
  TripleTechnicalFinish: '3F43',
  DoubleTechnicalFinish: '3F42',
  SingleTechnicalFinish: '3F41',
  TechnicalFinish: '3E84',
  StandardStep: '3E7D',
  TechnicalStep: '3E7E',
  Flourish: '3E8D',
  // BLM
  Thunder1: '90',
  Thunder2: '1D17',
  Thunder3: '99',
  Thunder4: '1CFC',
  // SMN
  EnergyDrain: '407C',
  EnergySiphon: '407E',
  SearingLight: '64F2',
  Aethercharge: '64C8',
  DreadwyrmTrance: 'DFD',
  SummonBahamut: '1D03',
  SummonPhoenix: '64E7',
  // 5.x
  Miasma: 'A8',
  Miasma3: '1D01',
  BioSmn: 'A4',
  BioSmn2: 'B2',
  Bio3: '1D00',
  Tridisaster: 'DFC',
  FirebirdTrance: '40A5',
  Devotion: '1D1A',
  // RDM
  Verstone: '1D57',
  Verfire: '1D56',
  Veraero: '1D53',
  Verthunder: '1D51',
  Verholy: '1D66',
  Verflare: '1D65',
  Jolt2: '1D64',
  Jolt: '1D4F',
  Impact: '1D62',
  Scatter: '1D55',
  Verthunder2: '408C',
  Veraero2: '408D',
  Vercure: '1D5A',
  Verraise: '1D63',
  Riposte: '1D50',
  Zwerchhau: '1D58',
  Redoublement: '1D5C',
  Moulinet: '1D59',
  Reprise: '4091',
  EnchantedRiposte: '1D67',
  EnchantedZwerchhau: '1D68',
  EnchantedRedoublement: '1D69',
  EnchantedMoulinet: '1D6A',
  EnchantedReprise: '4090',
  Embolden: '1D60',
  Manafication: '1D61',
  Fleche: '1D5D',
  ContreSixte: '1D5F',
  // BLU
  SongOfTorment: '2C7A',
  OffGuard: '2C93',
  PeculiarLight: '2C9D',
  AetherialSpark: '5AF1',
  Nightbloom: '5AFA',
  // Role Action
  LucidDreaming: '1D8A',
} as const;

// Combo actions for every jobs, this would apply to ComboTracker when
// it is initialized, for determining whether the current action is in combo.
export const kComboActions: string[][] = [
  // PLD
  [
    kAbility.FastBlade,
    kAbility.RiotBlade,
    kAbility.GoringBlade,
  ],
  // WAR
  [
    kAbility.HeavySwing,
    kAbility.Maim,
    kAbility.StormsEye,
  ],
  [
    kAbility.HeavySwing,
    kAbility.Maim,
    kAbility.StormsPath,
  ],
  [
    kAbility.Overpower,
    kAbility.MythrilTempest,
  ],
  // DRK
  [
    kAbility.HardSlash,
    kAbility.SyphonStrike,
    kAbility.Souleater,
  ],
  [
    kAbility.Unleash,
    kAbility.StalwartSoul,
  ],
  // GNB
  [
    kAbility.KeenEdge,
    kAbility.BrutalShell,
    kAbility.SolidBarrel,
  ],
  [
    kAbility.DemonSlice,
    kAbility.DemonSlaughter,
  ],
  // DRG
  [
    kAbility.TrueThrust,
    kAbility.Disembowel,
    kAbility.ChaosThrust,
  ],
  [
    kAbility.RaidenThrust,
    kAbility.Disembowel,
    kAbility.ChaosThrust,
  ],
  [
    kAbility.DoomSpike,
    kAbility.SonicThrust,
    kAbility.CoerthanTorment,
  ],
  [
    kAbility.DraconianFury,
    kAbility.SonicThrust,
    kAbility.CoerthanTorment,
  ],
  // NIN
  [
    kAbility.SpinningEdge,
    kAbility.GustSlash,
    kAbility.AeolianEdge,
  ],
  [
    kAbility.SpinningEdge,
    kAbility.GustSlash,
    kAbility.ArmorCrush,
  ],
  [
    kAbility.DeathBlossom,
    kAbility.HakkeMujinsatsu,
  ],
  // SAM
  [
    kAbility.Hakaze,
    kAbility.Jinpu,
    kAbility.Gekko,
  ],
  [
    kAbility.Hakaze,
    kAbility.Shifu,
    kAbility.Kasha,
  ],
  [
    kAbility.Hakaze,
    kAbility.Yukikaze,
  ],
  [
    kAbility.Fuga,
    kAbility.Mangetsu,
  ],
  [
    kAbility.Fuga,
    kAbility.Oka,
  ],
  [
    kAbility.Fuko,
    kAbility.Mangetsu,
  ],
  [
    kAbility.Fuko,
    kAbility.Oka,
  ],
  // MCH
  [
    kAbility.SplitShot,
    kAbility.SlugShot,
    kAbility.CleanShot,
  ],
  [
    kAbility.HeatedSplitShot,
    kAbility.SlugShot,
    kAbility.CleanShot,
  ],
  [
    kAbility.HeatedSplitShot,
    kAbility.HeatedSlugShot,
    kAbility.CleanShot,
  ],
  [
    kAbility.HeatedSplitShot,
    kAbility.HeatedSlugShot,
    kAbility.HeatedCleanShot,
  ],
  // DNC
  [
    kAbility.Cascade,
    kAbility.Fountain,
  ],
  [
    kAbility.Windmill,
    kAbility.Bladeshower,
  ],
];

// Full skill names of abilities that break combos.
// TODO: it's sad to have to duplicate combo abilities here to catch out-of-order usage.
export const kComboBreakers = [
  // PLD
  kAbility.FastBlade,
  kAbility.RiotBlade,
  kAbility.RageOfHalone,
  kAbility.RoyalAuthority,
  kAbility.GoringBlade,
  kAbility.TotalEclipse,
  kAbility.Prominence,
  kAbility.HolySpirit,
  kAbility.HolyCircle,
  kAbility.Clemency,
  kAbility.Confiteor,
  kAbility.ShieldBash,
  // WAR
  kAbility.HeavySwing,
  kAbility.Maim,
  kAbility.StormsEye,
  kAbility.StormsPath,
  kAbility.Overpower,
  kAbility.MythrilTempest,
  // DRK
  kAbility.HardSlash,
  kAbility.SyphonStrike,
  kAbility.Souleater,
  kAbility.Unleash,
  kAbility.StalwartSoul,
  // GNB
  kAbility.KeenEdge,
  kAbility.BrutalShell,
  kAbility.SolidBarrel,
  kAbility.DemonSlice,
  kAbility.DemonSlaughter,
  // DRG
  kAbility.TrueThrust,
  kAbility.VorpalThrust,
  kAbility.FullThrust,
  kAbility.Disembowel,
  kAbility.ChaosThrust,
  kAbility.DoomSpike,
  kAbility.SonicThrust,
  kAbility.CoerthanTorment,
  // NIN
  kAbility.SpinningEdge,
  kAbility.GustSlash,
  kAbility.AeolianEdge,
  kAbility.ArmorCrush,
  kAbility.DeathBlossom,
  kAbility.HakkeMujinsatsu,
  // SAM
  kAbility.Hakaze,
  kAbility.Jinpu,
  kAbility.Gekko,
  kAbility.Shifu,
  kAbility.Kasha,
  kAbility.Yukikaze,
  kAbility.Fuga,
  kAbility.Mangetsu,
  kAbility.Oka,
  kAbility.MeikyoShisui,
  kAbility.Fuko,
  // MCH
  kAbility.SplitShot,
  kAbility.SlugShot,
  kAbility.CleanShot,
  kAbility.HeatedSplitShot,
  kAbility.HeatedSlugShot,
  kAbility.HeatedCleanShot,
  kAbility.SpreadShot,
  // DNC
  kAbility.Cascade,
  kAbility.Fountain,
  kAbility.Windmill,
  kAbility.Bladeshower,
];

export const kComboBreakers5x = [
  ...kComboBreakers,
  // LB
  kAbility.ShieldWall,
  kAbility.Stronghold,
  kAbility.LastBastion,
  kAbility.LandWaker,
  kAbility.DarkForce,
  kAbility.GunmetalSoul,
  kAbility.HealingWind,
  kAbility.BreathoftheEarth,
  kAbility.PulseofLife,
  kAbility.AngelFeathers,
  kAbility.AstralStasis,
  kAbility.Braver,
  kAbility.Bladedance,
  kAbility.FinalHeaven,
  kAbility.Chimatsuri,
  kAbility.DragonsongDive,
  kAbility.DoomoftheLiving,
  kAbility.BigShot,
  kAbility.Desperado,
  kAbility.SagittariusArrow,
  kAbility.SatelliteBeam,
  kAbility.CrimsonLotus,
  kAbility.Skyshard,
  kAbility.Starstorm,
  kAbility.Meteor,
  kAbility.Teraflare,
  kAbility.VermilionScourge,
  // Ranged
  kAbility.ShieldLob,
  kAbility.Tomahawk,
  kAbility.Unmend,
  kAbility.LightningShot,
  kAbility.PiercingTalon,
  kAbility.ThrowingDagger,
  kAbility.Enpi,
];

// [level][Sub][Div]
// FIXME: Due to 6.0 data downscale, seems all parameter between lv50-80 has been changed
// 70 80 90 has been determined, between them still lack
export const kLevelMod = [
  [0, 0],
  [56, 56],
  [57, 57],
  [60, 60],
  [62, 62],
  [65, 65],
  [68, 68],
  [70, 70],
  [73, 73],
  [76, 76],
  [78, 78],
  [82, 82],
  [85, 85],
  [89, 89],
  [93, 93],
  [96, 96],
  [100, 100],
  [104, 104],
  [109, 109],
  [113, 113],
  [116, 116],
  [122, 122],
  [127, 127],
  [133, 133],
  [138, 138],
  [144, 144],
  [150, 150],
  [155, 155],
  [162, 162],
  [168, 168],
  [173, 173],
  [181, 181],
  [188, 188],
  [194, 194],
  [202, 202],
  [209, 209],
  [215, 215],
  [223, 223],
  [229, 229],
  [236, 236],
  [244, 244],
  [253, 253],
  [263, 263],
  [272, 272],
  [283, 283],
  [292, 292],
  [302, 302],
  [311, 311],
  [322, 322],
  [331, 331],
  [341, 341], // lv50
  [342, 900],
  [344, 900],
  [345, 900],
  [346, 900],
  [347, 900],
  [349, 900],
  [350, 900],
  [351, 900],
  [352, 900],
  [354, 900],
  [355, 900],
  [356, 900],
  [357, 900],
  [358, 900],
  [369, 900],
  [360, 900],
  [361, 900],
  [362, 900],
  [363, 900],
  [364, 900], // lv70, determined
  [365, 1300],
  [366, 1300],
  [367, 1300],
  [368, 1300],
  [370, 1300],
  [372, 1300],
  [374, 1300],
  [376, 1300],
  [378, 1300],
  [380, 1300], // lv80, determined
  [382, 1900],
  [384, 1900],
  [386, 1900],
  [388, 1900],
  [390, 1900],
  [392, 1900],
  [394, 1900],
  [396, 1900],
  [398, 1900],
  [400, 1900], // lv90, determined
] as const;

import { Job } from '../../types/job';
import ContentType from '../../resources/content_type';


export const kMeleeWithMpJobs: Job[] = ['PLD', 'DRK'];

export const kMPNormalRate = 0.06;
export const kMPCombatRate = 0.02;
export const kMPUI1Rate = 0.30;
export const kMPUI2Rate = 0.45;
export const kMPUI3Rate = 0.60;
export const kMPTickInterval = 3.0;

export const kWellFedContentTypes: number[] = [
  ContentType.Dungeons,
  ContentType.Trials,
  ContentType.Raids,
  ContentType.UltimateRaids,
];

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
  // MNK
  DragonKick: '4A',
  TwinSnakes: '3D',
  Demolish: '42',
  Bootshine: '35',
  FourPointFury: '4059',
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
  // BRD
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
  // DNC
  Cascade: '3E75',
  Fountain: '3E76',
  Windmill: '3E79',
  Bladeshower: '3E7A',
  QuadrupleTechnicalFinish: '3F44',
  TripleTechnicalFinish: '3F43',
  DoubleTechnicalFinish: '3F42',
  SingleTechnicalFinish: '3F41',
  StandardStep: '3E7D',
  TechnicalStep: '3E7E',
  Flourish: '3E8D',
  // BLM
  Thunder1: '90',
  Thunder2: '94',
  Thunder3: '99',
  Thunder4: '1CFC',
  // SMN
  Miasma: 'A8',
  Miasma3: '1D01',
  BioSmn: 'A4',
  BioSmn2: 'B2',
  Bio3: '1D00',
  Tridisaster: 'DFC',
  EnergyDrain: '407C',
  EnergySiphon: '407E',
  DreadwyrmTrance: 'DFD',
  FirebirdTrance: '40A5',
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
  // BLU
  SongOfTorment: '2C7A',
  OffGuard: '2C93',
  PeculiarLight: '2C9D',
  AetherialSpark: '5AF1',
  Nightbloom: '5AFA',
  // Role Action
  LucidDreaming: '1D8A',
} as const;

// Full skill names of abilities that break combos.
// TODO: it's sad to have to duplicate combo abilities here to catch out-of-order usage.
export const kComboBreakers = Object.freeze([
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
  kAbility.ShieldLob,
  kAbility.ShieldBash,
  // WAR
  kAbility.HeavySwing,
  kAbility.Maim,
  kAbility.StormsEye,
  kAbility.StormsPath,
  kAbility.Overpower,
  kAbility.MythrilTempest,
  kAbility.Tomahawk,
  // DRK
  kAbility.HardSlash,
  kAbility.SyphonStrike,
  kAbility.Souleater,
  kAbility.Unleash,
  kAbility.StalwartSoul,
  kAbility.Unmend,
  // GNB
  kAbility.KeenEdge,
  kAbility.BrutalShell,
  kAbility.SolidBarrel,
  kAbility.DemonSlice,
  kAbility.DemonSlaughter,
  kAbility.LightningShot,
  // DRG
  kAbility.TrueThrust,
  kAbility.VorpalThrust,
  kAbility.FullThrust,
  kAbility.Disembowel,
  kAbility.ChaosThrust,
  kAbility.PiercingTalon,
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
  kAbility.ThrowingDagger,
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
  kAbility.Enpi,
  kAbility.MeikyoShisui,
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
]);

// [level][Sub][Div]
// Source: http://theoryjerks.akhmorning.com/resources/levelmods/
export const kLevelMod: [number, number][] = [[0, 0],
  [56, 56], [57, 57], [60, 60], [62, 62], [65, 65],
  [68, 68], [70, 70], [73, 73], [76, 76], [78, 78],
  [82, 82], [85, 85], [89, 89], [93, 93], [96, 96],
  [100, 100], [104, 104], [109, 109], [113, 113], [116, 116],
  [122, 122], [127, 127], [133, 133], [138, 138], [144, 144],
  [150, 150], [155, 155], [162, 162], [168, 168], [173, 173],
  [181, 181], [188, 188], [194, 194], [202, 202], [209, 209],
  [215, 215], [223, 223], [229, 229], [236, 236], [244, 244],
  [253, 253], [263, 263], [272, 272], [283, 283], [292, 292],
  [302, 302], [311, 311], [322, 322], [331, 331], [341, 341],
  [342, 393], [344, 444], [345, 496], [346, 548], [347, 600],
  [349, 651], [350, 703], [351, 755], [352, 806], [354, 858],
  [355, 941], [356, 1032], [357, 1133], [358, 1243], [369, 1364],
  [360, 1497], [361, 1643], [362, 1802], [363, 1978], [364, 2170],
  [365, 2263], [366, 2360], [367, 2461], [368, 2566], [370, 2676],
  [372, 2790], [374, 2910], [376, 3034], [378, 3164], [380, 3300]];

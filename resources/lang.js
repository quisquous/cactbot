'use strict';

let gLang = null;

class CactbotLanguage {
  constructor(lang) {
    this.InitStrings();

    this.lang = lang;
    this.playerName = null;
    this.kAbility = Object.freeze({
      // Player abilities
      DragonKick: '4A',
      TwinSnakes: '3D',
      Demolish: '42',
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
      Vercure: '1D5A',
      Verraise: '1D63',
      Riposte: '1D50',
      Zwerchhau: '1D58',
      Redoublement: '1D5C',
      Moulinet: '1D59',
      EnchantedRiposte: '1D67',
      EnchantedZwerchhau: '1D68',
      EnchantedRedoublement: '1D69',
      EnchantedMoulinet: '1D6A',
      Tomahawk: '2E',
      Overpower: '29',
      HeavySwing: '1F',
      SkullSunder: '23',
      ButchersBlock: '2F',
      Maim: '25',
      StormsEye: '2D',
      StormsPath: '2A',
      TrickAttack: '8D2',
      Embolden: '1D60',
      Aetherflow: 'A6',
      ChainStratagem: '1D0C',
      Hypercharge: 'B45',
      Adloquium: 'B9',
      RabbitMedium: '8E0',
      OneIlmPunch: '48',
      Bootshine: '35',
      FastBlade: '09',
      RiotBlade: '0F',
      GoringBlade: 'DD2',
      RoyalAuthority: 'DD3',
      RageOfHalone: '15',
      SavageBlade: '0B',
      ShieldLob: '18',
      Requiescat: '1CD7',
      HolySpirit: '1CD8',
      TotalEclipse: '1CD5',
      Clemency: 'DD5',
      ShieldBash: '10',
      ShieldSwipe: '19',
      FightOrFlight: '14',
      BloodWeapon: 'E29',
      Souleater: 'E30',
      SyphonStrike: 'E27',
      HardSlash: 'E21',
      CarveAndSpit: 'E3B',
      Plunge: 'E38',
      Unmend: 'E28',
      AbyssalDrain: 'E39',
      PowerSlash: 'E2B',
      SpinningSlash: 'E23',
      BloodPrice: 'E2F',
      TheBlackestNight: '1CE1',
      Delirium: '1CDE',
      Combust2: 'E18',
      AspectedBenefic: 'E0B',
      AspectedHelios: 'E11',
      Contagion: '31B',
      OffGuard: '2C93',
      SongOfTorment: '2C7A',
      PeculiarLight: '2C9D',
      MythrilTempest: '404E',
      Prominence: '4049',
      HolyCircle: '404A',
      Confiteor: '404B',
      FourPointFury: '4059',
      TechnicalFinish: '3F44',
      Thunder1: '90',
      Thunder2: '94',
      Thunder3: '99',
      Thunder4: '1CFC',
      Divination: '40A8',

      // Susano Ex
      ChurningDeep: '203F',
      RasenKaikyo: '202E',

      // o4s
      DecisiveBattle: '2408',
      VacuumWave: '23FE',
      Almagest: '2417',
      NeoVacuumWave: '241D',
      BlizzardIII: '23F8', // both floor aoe and after decisive battle
      ThunderIII: '23FD', // after decisive battle, not the tankbuster
      DeathBomb: '2431',
      DeathBolt: '242E',
      DoubleAttack: '241C',
      Emptiness: '2422', // 2420 is cast, 2421 (???), 2422 seems to be damage.
      EdgeOfDeath: '2415',

      // Unending Coil
      Twister: '26AB', // 26AA is cast
      LunarDynamo: '26BC',
      IronChariot: '26BB',
      WingsOfSalvation: '26CA',
      ChainLightning: '26C8',
      ThermionicBurst: '26B9',
      Exaflare: '26EF',

      // Byakko Ex
      ByaSweepTheLeg: '27DB',
      ByaFireAndLightning: '27DE',
      ByaDistantClap: '27DD',
      ByaAratama: '27F6', // Popping Unrelenting Anguish bubbles
      ByaVacuumClaw: '27E9', // Stepping in growing orb
      ByaImperialGuard: '27F1', // Midphase line attack
      ByaOminousWind: '27EC', // Pink bubble collision
      ByaHundredfoldHavoc1: '27E5', // Lightning Puddles
      ByaHundredfoldHavoc2: '27E6', // Lightning Puddles

      // o7s
      MissileExplosion: '2782',
      UltrosStoneskin: '2AB5',
      TheHeat: '2777',
      ChainCannon: '278F',

      // uwu
      GreatWhirlwind: '2B41',
      SearingWind: '2B5C',
      Slipstream: '2B53',
      WickedWheel: '2B4E',
      WickedTornado: '2B4F',
      Eruption: '2B5A',
      WeightOfTheLand: '2B65',
      Landslide1: '2B70',
      Landslide2: '2B71',
    });

    this.kZone = Object.freeze({
      O1S: /Deltascape V1\.0 \(Savage\)/,
      O2S: /Deltascape V2\.0 \(Savage\)/,
      O3S: /Deltascape V3\.0 \(Savage\)/,
      O4S: /Deltascape V4\.0 \(Savage\)/,
      UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
      O5S: /Sigmascape V1\.0 \(Savage\)/,
      O6S: /Sigmascape V2\.0 \(Savage\)/,
      O7S: /Sigmascape V3\.0 \(Savage\)/,
      O8S: /Sigmascape V4\.0 \(Savage\)/,
      UWU: /The Weapon's Refrain \(Ultimate\)/,
      O9S: /Alphascape V1\.0 \(Savage\)/,
      O10S: /Alphascape V2\.0 \(Savage\)/,
      O11S: /Alphascape V3\.0 \(Savage\)/,
      O12S: /Alphascape V4\.0 \(Savage\)/,
      E1S: /Eden's Gate: Resurrection \(Savage\)/,
      E2S: /Eden's Gate: Descent \(Savage\)/,
      E3S: /Eden's Gate: Inundation \(Savage\)/,
      E4S: /Eden's Gate: Sepulture \(Savage\)/,
      E5S: /Eden's Verse: Fulmination \(Savage\)/,
      E6S: /Eden's Verse: Furor \(Savage\)/,
      E7S: /Eden's Verse: Iconoclasm \(Savage\)/,
      E8S: /Eden's Verse: Refulgence \(Savage\)/,
      PvpSeize: /Seal Rock \(Seize\)/,
      PvpSecure: /The Borderland Ruins \(Secure\)/,
      PvpShatter: /The Fields Of Glory \(Shatter\)/,
      EurekaAnemos: /Eureka Anemos/,
      EurekaPagos: /(Eureka Pagos|Unknown Zone \(2Fb\))/,
      EurekaPyros: /(Eureka Pyros|Unknown Zone \(31B\))/,
      EurekaHydatos: /(Eureka Hydatos|Unknown Zone \(33B\))/,
    });
  }

  InitStrings() {
    console.error('Derived language class must implement InitStrings');
  }
}

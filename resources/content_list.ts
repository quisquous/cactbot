import { ZoneIdType } from '../types/trigger';

import ZoneId from './zone_id';

// Ordered as per duty finder.  This is intended to be used as ordering for
// any ui that is dealing with multiple zones / triggers.
//
// These are not things that cactbot necessarily supports, but things that it
// theoretically could be supporting in the future with raidboss and oopsy.

const contentList: (ZoneIdType)[] = [
  // General (cactbot custom zone id)
  ZoneId.MatchAll,

  // Dungeons (A Realm Reborn)
  ZoneId.Sastasha,
  ZoneId.TheTamTaraDeepcroft,
  ZoneId.CopperbellMines,
  ZoneId.Halatali,
  ZoneId.TheThousandMawsOfTotoRak,
  ZoneId.HaukkeManor,
  ZoneId.BrayfloxsLongstop,
  ZoneId.TheSunkenTempleOfQarn,
  ZoneId.CuttersCry,
  ZoneId.TheStoneVigil,
  ZoneId.DzemaelDarkhold,
  ZoneId.TheAurumVale,
  ZoneId.TheWanderersPalace,
  ZoneId.CastrumMeridianum,
  ZoneId.ThePraetorium,
  ZoneId.AmdaporKeep,
  ZoneId.PharosSirius,
  ZoneId.CopperbellMinesHard,
  ZoneId.HaukkeManorHard,
  ZoneId.TheLostCityOfAmdapor,
  ZoneId.HalataliHard,
  ZoneId.BrayfloxsLongstopHard,
  ZoneId.HullbreakerIsle,
  ZoneId.TheTamTaraDeepcroftHard,
  ZoneId.TheStoneVigilHard,
  ZoneId.Snowcloak,
  ZoneId.SastashaHard,
  ZoneId.TheSunkenTempleOfQarnHard,
  ZoneId.TheKeeperOfTheLake,
  ZoneId.TheWanderersPalaceHard,
  ZoneId.AmdaporKeepHard,

  // Dungeons (Heavensward)
  ZoneId.TheDuskVigil,
  ZoneId.SohmAl,
  ZoneId.TheAery,
  ZoneId.TheVault,
  ZoneId.TheGreatGubalLibrary,
  ZoneId.TheAetherochemicalResearchFacility,
  ZoneId.Neverreap,
  ZoneId.TheFractalContinuum,
  ZoneId.SaintMociannesArboretum,
  ZoneId.PharosSiriusHard,
  ZoneId.TheAntitower,
  ZoneId.TheLostCityOfAmdaporHard,
  ZoneId.SohrKhai,
  ZoneId.HullbreakerIsleHard,
  ZoneId.Xelphatol,
  ZoneId.TheGreatGubalLibraryHard,
  ZoneId.BaelsarsWall,
  ZoneId.SohmAlHard,

  // Dungeons (Stormblood)
  ZoneId.TheSirensongSea,
  ZoneId.ShisuiOfTheVioletTides,
  ZoneId.BardamsMettle,
  ZoneId.DomaCastle,
  ZoneId.CastrumAbania,
  ZoneId.AlaMhigo,
  ZoneId.KuganeCastle,
  ZoneId.TheTempleOfTheFist,
  ZoneId.TheDrownedCityOfSkalla,
  ZoneId.HellsLid,
  ZoneId.TheFractalContinuumHard,
  ZoneId.TheSwallowsCompass,
  ZoneId.TheBurn,
  ZoneId.SaintMociannesArboretumHard,
  ZoneId.TheGhimlytDark,

  // Dungeons (Shadowbringers)
  ZoneId.HolminsterSwitch,
  ZoneId.DohnMheg,
  ZoneId.TheQitanaRavel,
  ZoneId.MalikahsWell,
  ZoneId.MtGulg,
  ZoneId.Amaurot,
  ZoneId.TheTwinning,
  ZoneId.AkadaemiaAnyder,
  ZoneId.TheGrandCosmos,
  ZoneId.AnamnesisAnyder,
  ZoneId.TheHeroesGauntlet,
  ZoneId.MatoyasRelict,
  ZoneId.Paglthan,

  // Dungeons (Endwalker)
  ZoneId.TheTowerOfZot,
  ZoneId.TheTowerOfBabil,
  ZoneId.Vanaspati,
  ZoneId.KtisisHyperboreia,
  ZoneId.TheAitiascope,
  ZoneId.TheDeadEnds,
  ZoneId.Smileton,
  ZoneId.TheStigmaDreamscape,

  // Guildhests
  ZoneId.BasicTrainingEnemyParties,
  ZoneId.UnderTheArmor,
  ZoneId.BasicTrainingEnemyStrongholds,
  ZoneId.HeroOnTheHalfShell,
  ZoneId.PullingPoisonPosies,
  ZoneId.StingingBack,
  ZoneId.AllsWellThatEndsInTheWell,
  ZoneId.FlickingSticksAndTakingNames,
  ZoneId.MoreThanAFeeler,
  ZoneId.AnnoyTheVoid,
  ZoneId.ShadowAndClaw,
  ZoneId.LongLiveTheQueen,
  ZoneId.WardUp,
  ZoneId.SolemnTrinity,

  // Trials (A Realm Reborn)
  ZoneId.TheBowlOfEmbers,
  ZoneId.TheNavel,
  ZoneId.TheHowlingEye,
  ZoneId.CapeWestwind,
  ZoneId.TheChrysalis,
  ZoneId.TheStepsOfFaith,
  ZoneId.ARelicRebornTheChimera,
  ZoneId.ARelicRebornTheHydra,
  ZoneId.BattleOnTheBigBridge,
  ZoneId.TheDragonsNeck,
  ZoneId.BattleInTheBigKeep,
  ZoneId.TheBowlOfEmbersHard,
  ZoneId.TheHowlingEyeHard,
  ZoneId.TheNavelHard,
  ZoneId.ThornmarchHard,
  ZoneId.TheWhorleaterHard,
  ZoneId.TheStrikingTreeHard,
  ZoneId.TheAkhAfahAmphitheatreHard,
  ZoneId.UrthsFount,

  // High-end Trials (A Realm Reborn)
  ZoneId.TheMinstrelsBalladUltimasBane,
  ZoneId.TheHowlingEyeExtreme,
  ZoneId.TheNavelExtreme,
  ZoneId.TheBowlOfEmbersExtreme,
  ZoneId.ThornmarchExtreme,
  ZoneId.TheWhorleaterExtreme,
  ZoneId.TheStrikingTreeExtreme,
  ZoneId.TheAkhAfahAmphitheatreExtreme,

  // Trials (Heavensward)
  ZoneId.ThokAstThokHard,
  ZoneId.TheLimitlessBlueHard,
  ZoneId.TheSingularityReactor,
  ZoneId.TheFinalStepsOfFaith,
  ZoneId.ContainmentBayS1T7,
  ZoneId.ContainmentBayP1T6,
  ZoneId.ContainmentBayZ1T9,

  // High-end Trials (Heavensward)
  ZoneId.TheLimitlessBlueExtreme,
  ZoneId.ThokAstThokExtreme,
  ZoneId.TheMinstrelsBalladThordansReign,
  ZoneId.TheMinstrelsBalladNidhoggsRage,
  ZoneId.ContainmentBayS1T7Extreme,
  ZoneId.ContainmentBayP1T6Extreme,
  ZoneId.ContainmentBayZ1T9Extreme,

  // Trials (Stormblood)
  ZoneId.ThePoolOfTribute,
  ZoneId.Emanation,
  ZoneId.TheRoyalMenagerie,
  ZoneId.CastrumFluminis,
  ZoneId.KuganeOhashi,
  ZoneId.TheGreatHunt,
  ZoneId.TheJadeStoa,
  ZoneId.HellsKier,
  ZoneId.TheWreathOfSnakes,

  // High-end Trials (Stormblood)
  ZoneId.ThePoolOfTributeExtreme,
  ZoneId.EmanationExtreme,
  ZoneId.TheMinstrelsBalladShinryusDomain,
  ZoneId.TheMinstrelsBalladTsukuyomisPain,
  ZoneId.TheGreatHuntExtreme,
  ZoneId.TheJadeStoaExtreme,
  ZoneId.HellsKierExtreme,
  ZoneId.TheWreathOfSnakesExtreme,

  // Trials (Shadowbringers)
  ZoneId.TheDancingPlague,
  ZoneId.TheCrownOfTheImmaculate,
  ZoneId.TheDyingGasp,
  ZoneId.CinderDrift,
  ZoneId.TheSeatOfSacrifice,
  ZoneId.CastrumMarinum,
  ZoneId.TheCloudDeck,

  // High-end Trials (Shadowbringers)
  ZoneId.TheDancingPlagueExtreme,
  ZoneId.TheCrownOfTheImmaculateExtreme,
  ZoneId.TheMinstrelsBalladHadessElegy,
  ZoneId.CinderDriftExtreme,
  ZoneId.MemoriaMiseraExtreme,
  ZoneId.TheSeatOfSacrificeExtreme,
  ZoneId.CastrumMarinumExtreme,
  ZoneId.TheCloudDeckExtreme,
  ZoneId.TheAkhAfahAmphitheatreUnreal,
  ZoneId.TheNavelUnreal,
  ZoneId.TheWhorleaterUnreal,

  // Trials (Endwalker)
  ZoneId.TheDarkInside,
  ZoneId.TheMothercrystal,
  ZoneId.TheFinalDay,

  // High-end Trials (Endwalker)
  ZoneId.TheMinstrelsBalladZodiarksFall,
  ZoneId.TheMinstrelsBalladHydaelynsCall,

  // Alliance Raids (A Realm Reborn)
  ZoneId.TheLabyrinthOfTheAncients,
  ZoneId.SyrcusTower,
  ZoneId.TheWorldOfDarkness,

  // Raids (A Realm Reborn)
  ZoneId.TheBindingCoilOfBahamutTurn1,
  ZoneId.TheBindingCoilOfBahamutTurn2,
  ZoneId.TheBindingCoilOfBahamutTurn3,
  ZoneId.TheBindingCoilOfBahamutTurn4,
  ZoneId.TheBindingCoilOfBahamutTurn5,
  ZoneId.TheSecondCoilOfBahamutTurn1,
  ZoneId.TheSecondCoilOfBahamutTurn2,
  ZoneId.TheSecondCoilOfBahamutTurn3,
  ZoneId.TheSecondCoilOfBahamutTurn4,
  ZoneId.TheFinalCoilOfBahamutTurn1,
  ZoneId.TheFinalCoilOfBahamutTurn2,
  ZoneId.TheFinalCoilOfBahamutTurn3,
  ZoneId.TheFinalCoilOfBahamutTurn4,

  // Savage Raids (A Realm Reborn)
  ZoneId.TheSecondCoilOfBahamutSavageTurn1,
  ZoneId.TheSecondCoilOfBahamutSavageTurn2,
  ZoneId.TheSecondCoilOfBahamutSavageTurn3,
  ZoneId.TheSecondCoilOfBahamutSavageTurn4,

  // Alliance Raids (Heavensward)
  ZoneId.TheVoidArk,
  ZoneId.TheWeepingCityOfMhach,
  ZoneId.DunScaith,

  // Normal Raids (Heavensward)
  ZoneId.AlexanderTheFistOfTheFather,
  ZoneId.AlexanderTheCuffOfTheFather,
  ZoneId.AlexanderTheArmOfTheFather,
  ZoneId.AlexanderTheBurdenOfTheFather,
  ZoneId.AlexanderTheFistOfTheSon,
  ZoneId.AlexanderTheCuffOfTheSon,
  ZoneId.AlexanderTheArmOfTheSon,
  ZoneId.AlexanderTheBurdenOfTheSon,
  ZoneId.AlexanderTheEyesOfTheCreator,
  ZoneId.AlexanderTheBreathOfTheCreator,
  ZoneId.AlexanderTheHeartOfTheCreator,
  ZoneId.AlexanderTheSoulOfTheCreator,

  // Savage Raids (Heavensward)
  ZoneId.AlexanderTheFistOfTheFatherSavage,
  ZoneId.AlexanderTheCuffOfTheFatherSavage,
  ZoneId.AlexanderTheArmOfTheFatherSavage,
  ZoneId.AlexanderTheBurdenOfTheFatherSavage,
  ZoneId.AlexanderTheFistOfTheSonSavage,
  ZoneId.AlexanderTheCuffOfTheSonSavage,
  ZoneId.AlexanderTheArmOfTheSonSavage,
  ZoneId.AlexanderTheBurdenOfTheSonSavage,
  ZoneId.AlexanderTheEyesOfTheCreatorSavage,
  ZoneId.AlexanderTheBreathOfTheCreatorSavage,
  ZoneId.AlexanderTheHeartOfTheCreatorSavage,
  ZoneId.AlexanderTheSoulOfTheCreatorSavage,

  // Alliance Raids (Stormblood)
  ZoneId.TheRoyalCityOfRabanastre,
  ZoneId.TheRidoranaLighthouse,
  ZoneId.TheOrbonneMonastery,

  // Normal Raids (Stormblood)
  ZoneId.DeltascapeV10,
  ZoneId.DeltascapeV20,
  ZoneId.DeltascapeV30,
  ZoneId.DeltascapeV40,
  ZoneId.SigmascapeV10,
  ZoneId.SigmascapeV20,
  ZoneId.SigmascapeV30,
  ZoneId.SigmascapeV40,
  ZoneId.AlphascapeV10,
  ZoneId.AlphascapeV20,
  ZoneId.AlphascapeV30,
  ZoneId.AlphascapeV40,

  // Savage Raids (Stormblood)
  ZoneId.DeltascapeV10Savage,
  ZoneId.DeltascapeV20Savage,
  ZoneId.DeltascapeV30Savage,
  ZoneId.DeltascapeV40Savage,
  ZoneId.SigmascapeV10Savage,
  ZoneId.SigmascapeV20Savage,
  ZoneId.SigmascapeV30Savage,
  ZoneId.SigmascapeV40Savage,
  ZoneId.AlphascapeV10Savage,
  ZoneId.AlphascapeV20Savage,
  ZoneId.AlphascapeV30Savage,
  ZoneId.AlphascapeV40Savage,

  // Alliance Raids (Shadowbringers)
  ZoneId.TheCopiedFactory,
  ZoneId.ThePuppetsBunker,
  ZoneId.TheTowerAtParadigmsBreach,

  // Normal Raids (Shadowbringers)
  ZoneId.EdensGateResurrection,
  ZoneId.EdensGateDescent,
  ZoneId.EdensGateInundation,
  ZoneId.EdensGateSepulture,
  ZoneId.EdensVerseFulmination,
  ZoneId.EdensVerseFuror,
  ZoneId.EdensVerseIconoclasm,
  ZoneId.EdensVerseRefulgence,
  ZoneId.EdensPromiseUmbra,
  ZoneId.EdensPromiseLitany,
  ZoneId.EdensPromiseAnamorphosis,
  ZoneId.EdensPromiseEternity,

  // Savage Raids (Shadowbringers)
  ZoneId.EdensGateResurrectionSavage,
  ZoneId.EdensGateDescentSavage,
  ZoneId.EdensGateInundationSavage,
  ZoneId.EdensGateSepultureSavage,
  ZoneId.EdensVerseFulminationSavage,
  ZoneId.EdensVerseFurorSavage,
  ZoneId.EdensVerseIconoclasmSavage,
  ZoneId.EdensVerseRefulgenceSavage,
  ZoneId.EdensPromiseUmbraSavage,
  ZoneId.EdensPromiseLitanySavage,
  ZoneId.EdensPromiseAnamorphosisSavage,
  ZoneId.EdensPromiseEternitySavage,

  // Normal Raids (Endwalker)
  ZoneId.AsphodelosTheFirstCircle,
  ZoneId.AsphodelosTheSecondCircle,
  ZoneId.AsphodelosTheThirdCircle,
  ZoneId.AsphodelosTheFourthCircle,

  // Savage Raids (Endwalker)
  ZoneId.AsphodelosTheFirstCircleSavage,
  ZoneId.AsphodelosTheSecondCircleSavage,
  ZoneId.AsphodelosTheThirdCircleSavage,
  ZoneId.AsphodelosTheFourthCircleSavage,

  // Ultimate Raids
  ZoneId.TheUnendingCoilOfBahamutUltimate,
  ZoneId.TheWeaponsRefrainUltimate,
  ZoneId.TheEpicOfAlexanderUltimate,
];

export default contentList;

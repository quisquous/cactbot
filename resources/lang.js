'use strict';

let gLang = null;

class CactbotLanguage {
  constructor(lang) {
    this.InitStrings();

    this.lang = lang;
    this.playerName = null;

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

    this.kLanguages = Object.freeze([
      'ja',
      'en',
      'de',
      'fr',
      'cn',
      'ko',
    ]);
  }

  InitStrings() {
    console.error('Derived language class must implement InitStrings');
  }
}

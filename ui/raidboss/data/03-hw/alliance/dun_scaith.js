'use strict';

[{
  zoneRegex: /^Dun Scaith$/,
  timelineFile: 'dun_scaith.txt',
  triggers: [
    // Basic stack occurs across all encounters except Deathgaze.
    {
      id: 'Dun Scaith Generic Stack-up',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
    },
    // DEATHGAZE
    {
      id: 'Dun Scaith Void Death',
      regex: / 14:(?:1C7F|1C90):Deathgaze Hollow starts using Void Death/,
      regexDe: / 14:(?:1C7F|1C90):Nihil-Thanatos starts using Nichts-Tod/,
      regexFr: / 14:(?:1C7F|1C90):Mortalis Nihil starts using Mort Du Néant/,
      regexJa: / 14:(?:1C7F|1C90):デスゲイズ・ホロー starts using ヴォイド・デス/,
      suppressSeconds: 5,
      alertText: {
        en: 'Out of death circle',
      },
    },
    {
      // Currently set up to just notify the healers/Bard to cleanse.
      // Or use / 16:\y{ObjectId}:Deathgaze Hollow:1C85:Doomsay:\y{ObjectId}:(\y{Name})
      // This would allow for notifying who needs cleansing directly, but might be spammy
      id: 'Dun Scaith Doom',
      regex: / 14:1C8[45]:Deathgaze Hollow starts using Doomsay/,
      regexDe: / 14:1C8[45]:Nihil-Thanatos starts using Todesfluch/,
      regexFr: / 14:1C8[45]:Mortalis Nihil starts using Malédiction Funeste/,
      regexJa: / 14:1C8[45]:デスゲイズ・ホロー starts using 死の呪い/,
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon!',
      },
    },
    {
      // There's another Void Blizzard IV with ID 1C77, but it's not the timing we want
      // The actual knockback cast is Void Aero IV, but it gives only 2-3s warning.
      id: 'Dun Scaith Blizzard Pillars',
      regex: / 14:1C8B:Deathgaze Hollow starts using Void Blizzard IV/,
      regexDe: / 14:1C8B:Nihil-Thanatos starts using Nichts-Eiska/,
      regexFr: / 14:1C8B:Mortalis Nihil starts using Giga Glace Du Néant/,
      regexJa: / 14:1C8B:デスゲイズ・ホロー starts using ヴォイド・ブリザジャ/,
      suppressSeconds: 5,
      alertText: {
        en: 'Knockback soon--Get in front of ice pillar',
      },
    },
    {
      id: 'Dun Scaith Void Sprite',
      regex: / 03:\y{ObjectId}:Added new combatant Void Sprite/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Nichts-Exergon/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Élémentaire Du Vide/,
      regexJa: / 03:\y{ObjectId}:Added new combatant ヴォイド・スプライト/,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill sprites',
      },
    },
    {
      id: 'Dun Scaith Aero 2',
      regex: Regexes.headMarker({ id: '0046' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Drop Tornado outside',
      },
    },
    {
      // Deathgaze has two separate casts for this
      // Which one appears to depend on whether it's used alongside Bolt of Darkness
      // Mechanically the handling is the same
      id: 'Dun Scaith Aero 3',
      regex: / 14:(?:1C7B|1C8D):Deathgaze Hollow starts using Void Aero III/,
      regexDe: / 14:(?:1C7B|1C8D):Nihil-Thanatos starts using Nichts-Windga/,
      regexFr: / 14:(?:1C7B|1C8D):Mortalis Nihil starts using Méga Vent Du Néant/,
      regexJa: / 14:(?:1C7B|1C8D):デスゲイズ・ホロー starts using ヴォイド・エアロガ/,
      suppressSeconds: 5,
      alertText: {
        en: 'Knockback from center',
      },
    },
    {
      id: 'Dun Scaith Void Death',
      regex: / 14:1C82:Deathgaze Hollow starts using Void Death IV/,
      regexDe: / 14:1C82:Nihil-Thanatos starts using Nichts-Todka/,
      regexFr: / 14:1C82:Mortalis Nihil starts using Giga Mort Du Néant/,
      regexJa: / 14:1C82:デスゲイズ・ホロー starts using ヴォイド・デスジャ/,
      suppressSeconds: 5,
      alertText: {
        en: 'Avoid death squares',
      },
    },
    // FERDIAD
    {
      id: 'Dun Scaith Scythe Drop',
      regex: Regexes.headMarker({ id: '0017' }),
      suppressSeconds: 5,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Drop scythe outside',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Jongleur\'s X',
      regex: / 14:1C98:Ferdiad Hollow starts using Jongleur's X on (\y{Name})/,
      regexDe: / 14:1C98:Nihil-Ferdiad starts using Jonglage on (\y{Name})/,
      regexFr: / 14:1C98:Ferdiad Nihil starts using Jongleur Fou on (\y{Name})/,
      regexJa: / 14:1C98:フェルディア・ホロー starts using ダークジャグリング on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // Wailing Atomos is blue, Cursed Atomos is yellow.
      // 1C9F:Aether is the circle AoE, 1CA0:Aetherial Chakram is the donut AoE
      id: 'Dun Scaith Blue Atomos',
      regex: / 14:1C(9F|A0):\y{Name} starts using Juggling Sphere on Wailing Atomos/,
      regexDe: / 14:1C(9F|A0):\y{Name} starts using Jonglierball on Heul-Atomos/,
      regexFr: / 14:1C(9F|A0):\y{Name} starts using Sphère Jongleuse on Gueule Gémissante/,
      regexJa: / 14:1C(9F|A0):\y{Name} starts using ジャグリング・スフィア on 虚声のアトモス/,
      alertText: function(data, matches) {
        if (matches[1] == '9F') {
          return {
            en: 'Avoid Untethered Blue',
          };
        }
        if (matches[1] == 'A0') {
          return {
            en: 'Go to Untethered Blue',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Yellow Atomos',
      regex: / 14:1C(9F|A0):\y{Name} starts using Juggling Sphere on Cursing Atomos/,
      regexDe: / 14:1C(9F|A0):\y{Name} starts using Jonglierball on Fluch-Atomos/,
      regexFr: / 14:1C(9F|A0):\y{Name} starts using Sphère Jongleuse on Gueule Maudissante/,
      regexJa: / 14:1C(9F|A0):\y{Name} starts using ジャグリング・スフィア on 怨声のアトモス/,
      alertText: function(data, matches) {
        if (matches[1] == '9F') {
          return {
            en: 'Avoid Untethered Yellow',
          };
        }
        if (matches[1] == 'A0') {
          return {
            en: 'Go to Untethered Yellow',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Blackfire',
      regex: / 14:1CAA:Ferdiad Hollow starts using Blackfire/,
      regexDe: / 14:1CAA:Nihil-Ferdiad starts using Schwarzfeuer/,
      regexFr: / 14:1CAA:Ferdiad Nihil starts using Feu Noir/,
      regexJa: / 14:1CAA:フェルディア・ホロー starts using ブラックファイア/,
      infoText: {
        en: 'Avoid puddles',
      },
    },
    {
      // https://xivapi.com/Status/1137
      id: 'Dun Scaith Debilitator Fire',
      regex: Regexes.gainsEffect({ effect: 'Fire Resistance Down Ii', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Feuerresistenz - \\(Stark\\)', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Résistance Au Feu Réduite+', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '火属性耐性低下[強]', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '火属性耐性大幅降低', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '불속성 저항 감소[강]', capture: false }),
      suppressSeconds: 10,
      alertText: {
        en: 'Change puddles to water',
      },
    },
    {
      // https://xivapi.com/Status/1157
      id: 'Dun Scaith Debilitator Water',
      regex: Regexes.gainsEffect({ effect: 'Water Resistance Down Ii', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserresistenz - \\(Stark\\)', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Résistance À L\'Eau Réduite+', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '水属性耐性低下［強］', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '水属性耐性大幅降低', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 저항 감소[강]', capture: false }),
      suppressSeconds: 10,
      alertText: {
        en: 'Change puddles to fire',
      },
    },
    // PROTO-ULTIMA
    {
      // The trident laser is a series of three separate casts
      // Each has an incremental ID: 1D96, 1D97, 1D98
      id: 'Dun Scaith Aetherochemical Laser',
      regex: / 14:1D96:Proto Ultima starts using Aetherochemical Laser/,
      regexDe: / 14:1D96:Proto-Ultima starts using Ätherochemischer Laser/,
      regexFr: / 14:1D96:Proto-Ultima starts using Laser Magismologique/,
      regexJa: / 14:1D96:プロトアルテマ starts using 魔科学レーザー/,
      infoText: {
        en: 'Dodge trident laser',
      },
    },
    {
      // Handles both 1E52 Aetherochemical Flare and 1D9D Supernova
      id: 'Dun Scaith Proto-Ultima Raid Damage',
      regex: / 14:(?:1E52|1D9D):Proto Ultima starts using Aetherochemical Flare/,
      regexDe: / 14:(?:1E52|1D9D):Proto-Ultima starts using Ätherochemisches Flare/,
      regexFr: / 14:(?:1E52|1D9D):Proto-Ultima starts using Brasier Magismologique/,
      regexJa: / 14:(?:1E52|1D9D):プロトアルテマ starts using 魔科学フレア/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid Damage',
      },
    },
    {
      id: 'Dun Scaith Prey Markers',
      regex: Regexes.gainsEffect({ effect: 'Prey' }),
      regexDe: Regexes.gainsEffect({ effect: 'Markiert' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marquage' }),
      regexJa: Regexes.gainsEffect({ effect: 'マーキング' }),
      regexCn: Regexes.gainsEffect({ effect: '猎物' }),
      regexKo: Regexes.gainsEffect({ effect: '표식' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Prey--Avoid party and keep moving',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Flare Star',
      regex: / 14:1DA4:Proto Ultima starts using Flare Star/,
      regexDe: / 14:1DA4:Proto-Ultima starts using Flare-Stern/,
      regexFr: / 14:1DA4:Proto-Ultima starts using Astre Flamboyant/,
      regexJa: / 14:1DA4:プロトアルテマ starts using フレアスター/,
      suppressSeconds: 1,
      preRun: function(data) {
        data.flareStarCount = (data.flareStarCount || 0) + 1;
      },
      alertText: function(data) {
        if (data.flareStarCount == 1) {
          return {
            en: 'Out of center--Wait for outer ring then keep going',
          };
        }
        return {
          en: 'Avoid flares--Wait for outer ring then keep going',
        };
      },
    },
    {
      id: 'Dun Scaith Citadel Buster',
      regex: / 14:1DAB:Proto Ultima starts using Citadel Buster/,
      regexDe: / 14:1DAB:Proto-Ultima starts using Zitadellensprenger/,
      regexFr: / 14:1DAB:Proto-Ultima starts using Casse-Citadelle/,
      regexJa: / 14:1DAB:プロトアルテマ starts using シタデルバスター/,
      alertText: {
        en: 'Avoid line AoE',
      },
    },
    {
      // Triggering off the Bit appearance
      // The cast time on Aetheromodulator is under 3 seconds
      id: 'Dun Scaith Bit Circles',
      regex: / 03:\y{ObjectId}:Added new combatant Proto Bit/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Proto-Drohne/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Proto-Foret/,
      regexJa: / 03:\y{ObjectId}:Added new combatant プロトビット/,
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid Bit AoEs',
      },
    },
    {
      id: 'Dun Scaith Aether Collectors',
      regex: / 03:\y{ObjectId}:Added new combatant Aether Collector/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Ätherakkumulator/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Accumulateur D'Éther/,
      regexJa: / 03:\y{ObjectId}:Added new combatant エーテル集積器/,
      suppressSeconds: 5,
      alertText: {
        en: 'Kill collectors',
      },
    },
    // SCATHACH
    {
      // The actual attack is 1D20, but the castbar windup is 1D1F
      id: 'Dun Scaith Shadespin',
      regex: / 14:1D1[EF]:Scathach starts using Shadespin/,
      regexDe: / 14:1D1[EF]:Scathach starts using Dunkeldrehung/,
      regexFr: / 14:1D1[EF]:Scáthach starts using Tourbillon Ombral/,
      regexJa: / 14:1D1[EF]:スカアハ starts using シェードスピン/,
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid arm slaps',
      },
    },
    {
      id: 'Dun Scaith Thirty Thorns',
      regex: / 1[56]:\y{ObjectId}:Scathach:1D[12]B:(?:Soar|Thirty Thorns):/,
      regexDe: / 1[56]:\y{ObjectId}:Scathach:1D[12]B:(?:Auffliegen|Dreißig Dornen):/,
      regexFr: / 1[56]:\y{ObjectId}:Scáthach:1D[12]B:(?:Ascension|Trente Èpines):/,
      regexJa: / 1[56]:\y{ObjectId}:スカアハ:1D[12]B:(?:飛翔|サーティー・ソーンズ):/,
      suppressSeconds: 5,
      alertText: {
        en: 'Out of melee',
      },
    },
    {
      id: 'Dun Scaith Thirty Arrows',
      regex: / 14:1D2F:Scathach starts using Thirty Arrows/,
      regexDe: / 14:1D2F:Scathach starts using Dreißig Pfeile/,
      regexFr: / 14:1D2F:Scáthach starts using Trente Flèches/,
      regexJa: / 14:1D2F:スカアハ starts using サーティー・アローズ/,
      infoText: {
        en: 'Avoid line AoEs',
      },
    },
    {
      id: 'Dun Scaith Thirty Souls',
      regex: / 14:1D32:Scathach starts using Thirty Souls/,
      regexDe: / 14:1D32:Scathach starts using Dreißig Seelen/,
      regexFr: / 14:1D32:Scáthach starts using Trente Âmes/,
      regexJa: / 14:1D32:スカアハ starts using サーティー・ソウルズ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid damage',
      },
    },
    {
      // Ordinarily we wouldn't use a game log line for this.
      // However, the RP text seems to be the only indicator.
      id: 'Dun Scaith Shadow Links',
      regex: / 00:0839:Shadows gather on the floor\./,
      regexDe: / 00:0839:Schatten sammeln sich auf dem Boden/,
      regexFr: / 00:0839:Le pouvoir des ombres se concentre sur le sol.../,
      regexJa: / 00:0839:床に影の力が集束していく/,
      suppressSeconds: 5,
      infoText: {
        en: 'Stop moving',
        de: 'Nicht bewegen!',
      },
    },
    {
      id: 'Dun Scaith Shadow Limb Spawn',
      regex: / 03:\y{ObjectId}:Added new combatant Shadow Limb/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Schattenhand/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Main Ombrale/,
      regexJa: / 03:\y{ObjectId}:Added new combatant 影の手/,
      suppressSeconds: 5,
      alertText: {
        en: 'Kill the hands',
      },
    },
    {
      id: 'Dun Scaith Connla Spawn',
      regex: / 14:1CD1:Connla starts using Pitfall/,
      regexDe: / 14:1CD1:Connla starts using Berstender Boden/,
      regexFr: / 14:1CD1:Connla starts using Embûche/,
      regexJa: / 14:1CD1:コンラ starts using 強襲/,
      alertText: {
        en: 'Avoid AoE, Kill Connla',
      },
    },
    // These triggers are common to both Scathach and Diabolos
    {
      id: 'Dun Scaith Nox Orbs',
      regex: Regexes.headMarker({ id: '005C' }),
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Take orb outside',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Shadethrust',
      regex: / 14:(?:1D23|1C1A):(?:Scathach|Diabolos Hollow) starts using Shadethrust/,
      regexDe: / 14:(?:1D23|1C1A):(?:Scathach|Diabolos Hollow) starts using Schattenschub/,
      regexFr: / 14:(?:1D23|1C1A):(?:Scathach|Diabolos Hollow) starts using Transpercement Ombral/,
      regexJa: / 14:(?:1D23|1C1A):(?:Scathach|Diabolos Hollow) starts using シェードスラスト/,
      infoText: {
        en: 'Away from front',
      },
    },
    // DIABOLOS
    {
      id: 'Dun Scaith Ultimate Terror',
      regex: / 14:1C12:Diabolos starts using Ultimate Terror/,
      regexDe: / 14:1C12:Diabolos starts using Ultimativer Terror/,
      regexFr: / 14:1C12:Diabolos starts using Terreur Ultime/,
      regexJa: / 14:1C12:ディアボロス starts using アルティメットテラー/,
      infoText: {
        en: 'Get in',
      },
    },
    {
      id: 'Dun Scaith Nightmare',
      regex: / 14:(?:1C0E|1C20):\y{Name} starts using (?:Nightmare|Hollow Nightmare)/,
      regexDe: / 14:(?:1C0E|1C20):\y{Name} starts using (?:Albtraum|Hohler Albtraum)/,
      regexFr: / 14:(?:1C0E|1C20):\y{Name} starts using (?:Cauchemar|Cauchemar Nihil)/,
      regexJa: / 14:(?:1C0E|1C20):\y{Name} starts using (?:ナイトメア|ホローナイトメア)/,
      alertText: {
        en: 'Look away',
      },
    },
    {
      id: 'Dun Scaith Noctoshield',
      regex: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Noctoshield', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Nachtschild', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Nocto-Bouclier', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ディアボロス', effect: 'ノクトシールド', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '迪亚波罗斯', effect: '夜障', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '디아볼로스', effect: '밤의 방패', capture: false }),
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Boss hitting hard--Shield/Mitigate',
      },
    },
    {
      id: 'Dun Scaith Ruinous Omen',
      regex: / 14:1C1[01]:Diabolos starts using Ruinous Omen/,
      regexDe: / 14:1C1[01]:Diabolos starts using Ruinöses Omen/,
      regexFr: / 14:1C1[01]:Diabolos starts using Mauvais Présage/,
      regexJa: / 14:1C1[01]:ディアボロス starts using ルイナスオーメン/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid damage incoming',
      },
    },
    {
      id: 'Dun Scaith Deathgates',
      regex: / 03:\y{ObjectId}:Added new combatant Deathgate/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Tor Des Todes/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Porte De Mort/,
      regexJa: / 03:\y{ObjectId}:Added new combatant 召喚の扉/,
      suppressSeconds: 5,
      infoText: {
        en: 'Kill the deathgates',
      },
    },
    {
      id: 'Dun Scaith Camisado',
      regex: / 14:1C19:Diabolos Hollow starts using Hollow Camisado on (\y{Name})/,
      regexDe: / 14:1C19:Nihil-Diabolos starts using Hohles Camisado on (\y{Name})/,
      regexFr: / 14:1C19:Diabolos Nihil starts using Camisado Nihil on (\y{Name})/,
      regexJa: / 14:1C19:ディアボロス・ホロー starts using ホローカミサドー on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Dun Scaith Hollow Night',
      regex: Regexes.headMarker({ id: '005B' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Gaze stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target) + ' and look away',
        };
      },
    },
    {
      id: 'Dun Scaith Hollow Omen',
      regex: / 14:1C2[23]:Diabolos Hollow starts using Hollow Omen/,
      regexDe: / 14:1C2[23]:Nihil-Diabolos starts using Hohles Omen/,
      regexFr: / 14:1C2[23]:Diabolos Nihil starts using Présage Nihil/,
      regexJa: / 14:1C2[23]:ディアボロス・ホロー starts using ホローオーメン/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Extreme raid damage!',
      },
    },
    {
      // This is the tank version of the stack marker. It has minimal circular bordering
      id: 'Dun Scaith Blindside',
      regex: Regexes.headMarker({ id: '005D' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'Dun Scaith Earth Shaker',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Earth Shaker on YOU',
      },
    },
  ],
},
];

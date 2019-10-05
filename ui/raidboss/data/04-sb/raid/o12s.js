'use strict';

// O12S - Alphascape 4.0 Savage

[{
  zoneRegex: /^(Alphascape V4.0 \(Savage\)|欧米茄零式时空狭缝 \(阿尔法幻境4\))$/,
  timelineFile: 'o12s.txt',
  triggers: [
    {
      // Track Omega MF vs Final Omega phase.
      regex: / 14:3357:Omega starts using (?:Ion Efflux|Unknown_3357)/,
      regexCn: / 14:3357:欧米茄 starts using (?:离子流出|Unknown_3357)/,
      regexDe: / 14:3357:Omega starts using (?:Ionenstrom|Unknown_3357)/,
      regexFr: / 14:3357:Oméga starts using (?:Fuite D\'ions|Unknown_3357)/,
      regexJa: / 14:3357:オメガ starts using (?:イオンエフラクス|Unknown_3357)/,
      run: function(data) {
        data.isFinalOmega = true;

        data.dpsShortStack = true;
        data.helloDebuffs = {};
        data.archiveMarkers = {};
        data.armValue = 0;
        data.numArms = 0;
      },
    },
    {
      id: 'O12S Beyond Defense',
      regex: / 1[56]:\y{ObjectId}:Omega-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexCn: / 1[56]:\y{ObjectId}:欧米茄-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Omega-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Oméga-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:オメガM:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Don\'t Stack!',
        de: 'Nicht stacken!',
        fr: 'Ne vous packez pas !',
        ja: 'スタックするな！',
        cn: '分散站位！',
      },
    },
    {
      id: 'O12S Local Resonance',
      regex: / 1A:\y{ObjectId}:Omega gains the effect of (?:Local Resonance|Unknown_67E) from/,
      regexCn: / 1A:欧米茄 gains the effect of (?:共鸣程序：近|Unknown_67E) from/,
      regexDe: / 1A:\y{ObjectId}:Omega gains the effect of (?:Resonanzprogramm: Nah|Unknown_67E) from/,
      regexFr: / 1A:\y{ObjectId}:Oméga gains the effect of (?:Programme de résonance : proximité|Programme De Résonance : Proximité|Unknown_67E) from/,
      regexJa: / 1A:\y{ObjectId}:オメガ gains the effect of (?:レゾナンスプログラム：ニアー|Unknown_67E) from/,
      infoText: {
        en: 'Keep Bosses Apart',
        de: 'Bosse auseinander ziehen',
        fr: 'Séparez les boss',
        ja: 'ボス離して',
        cn: '拉开Boss',
      },
    },
    {
      id: 'O12S Remote Resonance',
      regex: / 1A:\y{ObjectId}:Omega gains the effect of (?:Remote Resonance|Unknown_67F) from/,
      regexCn: / 1A:\y{ObjectId}:欧米茄 gains the effect of (?:共鸣程序：远|Unknown_67F) from/,
      regexDe: / 1A:\y{ObjectId}:Omega gains the effect of (?:Resonanzprogramm: Fern|Unknown_67F) from/,
      regexFr: / 1A:\y{ObjectId}:Oméga gains the effect of (?:Programme de résonance : distance|Programme De Résonance : Distance|Unknown_67F) from/,
      regexJa: / 1A:\y{ObjectId}:オメガ gains the effect of (?:レゾナンスプログラム：ファー|Unknown_67F) from/,
      alertText: {
        en: 'Move Bosses Together',
        de: 'Bosse zusammenziehen',
        fr: 'Packez les boss',
        ja: 'ボス重ねて',
        cn: '拉近Boss',
      },
    },
    {
      id: 'O12S Solar Ray',
      regex: / 14:(?:3350|3351):(?:Omega|Omega-M) starts using (?:Unknown_3350|Unknown_3351|Solar Ray) on (\y{Name})/,
      regexCn: / 14:(?:3350|3351):(?:欧米茄|欧米茄-M) starts using (?:Unknown_3350|Unknown_3351|太阳射线) on (\y{Name})/,
      regexDe: / 14:(?:3350|3351):(?:Omega|Omega-M) starts using (?:Unknown_3350|Unknown_3351|Sonnenstrahl) on (\y{Name})/,
      regexFr: / 14:(?:3350|3351):(?:Oméga|Oméga-M) starts using (?:Unknown_3350|Unknown_3351|Rayon solaire|Rayon Solaire) on (\y{Name})/,
      regexJa: / 14:(?:3350|3351):(?:オメガ|オメガM) starts using (?:Unknown_3350|Unknown_3351|ソーラレイ) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: 'タンクバスター on YOU',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'O12S Optimized Blade Dance',
      regex: / 14:(?:334B|334C):(?:Omega|Omega-M) starts using (?:Unknown_334B|Unknown_334C|Optimized Blade Dance) on (\y{Name})/,
      regexCn: / 14:(?:334B|334C):(?:欧米茄|欧米茄-M) starts using (?:Unknown_334B|Unknown_334C|欧米茄刀光剑舞) on (\y{Name})/,
      regexDe: / 14:(?:334B|334C):(?:Omega|Omega-M) starts using (?:Unknown_334B|Unknown_334C|Omega-Schwertertanz) on (\y{Name})/,
      regexFr: / 14:(?:334B|334C):(?:Oméga|Oméga-M) starts using (?:Unknown_334B|Unknown_334C|Danse de la lame Oméga|Danse De La Lame Oméga) on (\y{Name})/,
      regexJa: / 14:(?:334B|334C):(?:オメガ|オメガM) starts using (?:Unknown_334B|Unknown_334C|ブレードダンス・オメガ) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: 'タンクバスター on YOU',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'O12S Electric Slide Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:(009[12345678]):0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let num = parseInt(matches[2]);
        let isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        let squareName = {
          en: 'Square',
          de: 'Viereck',
          fr: 'Carré',
          ja: '四角',
          cn: '四角',
        }[data.lang];
        let triangleName = {
          en: 'Triangle',
          de: 'Dreieck',
          fr: 'Triangle',
          ja: '三角',
          cn: '三角',
        }[data.lang];
        return '#' + num + ' ' + (isTriangle ? triangleName : squareName);
      },
    },
    {
      id: 'O12S MF Stack Marker',
      regex: /1B:\y{ObjectId}:\y{Name}:....:....:003E:0000:0000:0000:/,
      condition: function(data) {
        return !data.isFinalOmega;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
        ja: 'スタック',
        cn: '集合',
      },
    },
    {
      id: 'O12S Optimized Meteor',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        fr: 'Météore sur VOUS',
        ja: 'メテオ on YOU',
        cn: '陨石点名',
      },
    },
    {
      id: 'O12S Packet Filter F',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67D|Packet Filter F) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67D|防护程序F) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67D|Sicherungssystem F) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67D|Programme protecteur F|Programme Protecteur F) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67D|ガードプログラムF) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-M',
        de: 'Omega-M angreifen',
        fr: 'Attaquez Oméga-M',
        ja: 'Mを攻撃',
        cn: '攻击欧米茄-M',
      },
    },
    {
      id: 'O12S Packet Filter M',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67C|Packet Filter M) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67C|防护程序M) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67C|Sicherungssystem M) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67C|Programme protecteur M|Programme Protecteur M) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_67C|ガードプログラムM) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-F',
        de: 'Omega-W angreifen',
        fr: 'Attaquez Oméga-F',
        ja: 'Fを攻撃',
        cn: '攻击欧米茄-F',
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Sides',
      regex: / 14:3367:Omega starts using (?:Diffuse Wave Cannon|Unknown_3367)/,
      regexCn: / 14:3367:欧米茄 starts using (?:扩散波动炮|Unknown_3367)/,
      regexDe: / 14:3367:Omega starts using (?:Streuende Wellenkanone|Unknown_3367)/,
      regexFr: / 14:3367:Oméga starts using (?:Canon plasma diffuseur|Canon Plasma Diffuseur|Unknown_3367)/,
      regexJa: / 14:3367:オメガ starts using (?:拡散波動砲|Unknown_3367)/,
      infoText: {
        en: 'Sides',
        de: 'Seiten',
        fr: 'Cotés',
        ja: '横',
        cn: '横',
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Front/Back',
      regex: / 14:3368:Omega starts using (?:Diffuse Wave Cannon|Unknown_3368)/,
      regexCn: / 14:3368:欧米茄 starts using (?:扩散波动炮|Unknown_3368)/,
      regexDe: / 14:3368:Omega starts using (?:Streuende Wellenkanone|Unknown_3368)/,
      regexFr: / 14:3368:Oméga starts using (?:Canon plasma diffuseur|Canon Plasma Diffuseur|Unknown_3368)/,
      regexJa: / 14:3368:オメガ starts using (?:拡散波動砲|Unknown_3368)/,
      infoText: {
        en: 'Front or Back',
        de: 'Vorn oder Hinten',
        fr: 'Devant ou derrière',
        ja: '縦',
        cn: '竖',
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Right',
      regex: / 14:3364:Omega starts using (?:Oversampled Wave Cannon|Unknown_3364)/,
      regexCn: / 14:3364:欧米茄 starts using (?:探测式波动炮|Unknown_3364)/,
      regexDe: / 14:3364:Omega starts using (?:Fokussierte Wellenkanone|Unknown_3364)/,
      regexFr: / 14:3364:Oméga starts using (?:Canon plasma chercheur|Canon Plasma Chercheur|Unknown_3364)/,
      regexJa: / 14:3364:オメガ starts using (?:検知式波動砲|Unknown_3364)/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Left',
            de: 'Monitore Links',
            fr: 'Moniteur Gauche',
            cn: '探测左边',
          };
        }
        return {
          en: 'Dodge Left',
          de: 'Links ausweichen',
          fr: 'Evitez à gauche',
          cn: '左侧躲闪',
        };
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Left',
      regex: / 14:3365:Omega starts using (?:Oversampled Wave Cannon|Unknown_3365)/,
      regexCn: / 14:3365:欧米茄 starts using (?:探测式波动炮|Unknown_3365)/,
      regexDe: / 14:3365:Omega starts using (?:Fokussierte Wellenkanone|Unknown_3365)/,
      regexFr: / 14:3365:Oméga starts using (?:Canon plasma chercheur|Canon Plasma Chercheur|Unknown_3365)/,
      regexJa: / 14:3365:オメガ starts using (?:検知式波動砲|Unknown_3365)/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Right',
            de: 'Monitore Rechts',
            fr: 'Moniteur Droite',
            cn: '探测右边',
          };
        }
        return {
          en: 'Dodge Right',
          de: 'Rechts ausweichen',
          fr: 'Evitez à droite',
          cn: '右侧躲闪',
        };
      },
    },
    {
      id: 'O12S Target Analysis Target',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Vuln on YOU',
            de: 'Verwundbarkeit auf DIR',
            fr: 'Vulnérabilité sur VOUS',
            ja: '標的 on YOU',
            cn: '目标识别',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1] || data.role != 'tank')
          return;
        return {
          en: 'Vuln on ' + data.ShortName(matches[1]),
          de: 'Verwundbarkeit auf ' + data.ShortName(matches[1]),
          fr: 'Vulnérabilité sur ' + data.ShortName(matches[1]),
          ja: '標的 on ' + data.ShortName(matches[1]),
          cn: '目标识别->' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'O12S Local Tethers',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_688|Local Regression) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_688|回归方程：近) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_688|Regression: Nah) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_688|Bogue intentionnel : proximité|Bogue Intentionnel : Proximité) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_688|エンバグ：ニアー) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
      },
    },
    {
      id: 'O12S Far Tethers',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_689|Remote Regression) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_689|回归方程：远) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_689|Regression: Fern) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_689|Bogue intentionnel : distance|Bogue Intentionnel : Distance) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_689|エンバグ：ファー) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
      },
    },
    {
      id: 'O12S Defamation',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Critical Overflow Bug) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|严重错误：上溢) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Kritischer Bug: Überlauf) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Bogue critique : boucle|Bogue Critique : Boucle) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|クリティカルバグ：サークル) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Defamation on YOU',
        de: 'Urteil auf DIR',
        fr: '#Médisance sur VOUS',
        ja: 'サークルついた',
        cn: '严重错误：上溢',
      },
    },
    {
      id: 'O12S Latent Defect',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_686|Latent Defect) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_686|潜在错误) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_686|Latenter Defekt) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_686|Bogue latent|Bogue Latent) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_686|レイテントバグ) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Blue Marker',
        de: 'Blauer Marker',
        fr: 'Marqueur bleu',
        ja: 'レイテントついた',
        cn: '蓝点名',
      },
    },
    {
      id: 'O12S Rot',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_682|Critical Underflow Bug) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_682|严重错误：下溢) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_682|Kritischer Bug: Unterlauf) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_682|Bogue critique : dégradation|Bogue Critique : Dégradation) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_682|クリティカルバグ：デグレード) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Rot',
        de: 'Fäulnis',
        fr: 'Pourriture',
        ja: 'デグレードついた',
        cn: '红点名',
      },
    },
    {
      id: 'O12S Hello World Stack',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_680|Critical Synchronization Bug) from (?:.*) for (.*) Seconds/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_680|严重错误：同步) from (?:.*) for (.*) Seconds/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_680|Kritischer Bug: Synchronisierung) from (?:.*) for (.*) Seconds/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_680|Bogue critique : partage|Bogue Critique : Partage) from (?:.*) for (.*) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_680|クリティカルバグ：シェア) from (?:.*) for (.*) Seconds/,
      delaySeconds: function(data, matches) {
        return matches[1] == data.me ? 0 : 1;
      },
      alertText: function(data, matches) {
        let t = parseFloat(matches[2]);
        if (data.me != matches[1])
          return;
        if (!(t > 0))
          return;
        if (t <= 8) {
          return {
            en: 'Short Stack on YOU',
            de: 'Kurzer Stack auf YOU',
            fr: 'Marque courte sur VOUS',
            ja: '早シェア on YOU',
            cn: '短D',
          };
        }
        return {
          en: 'Long Stack on YOU',
          de: 'Langer Stack auf YOU',
          fr: 'Marque longue sur VOUS',
          ja: '遅シェア on YOU',
          cn: '长D',
        };
      },
      infoText: function(data, matches) {
        let t = parseFloat(matches[2]);
        if (data.me == matches[1])
          return;
        if (!data.dpsShortStack)
          return;
        if (!(t > 0))
          return;
        if (t <= 8) {
          data.dpsShortStack = false;
          return {
            en: 'Short Stack on ' + data.ShortName(matches[1]),
            de: 'Kurzer Stack auf ' + data.ShortName(matches[1]),
            fr: 'Marque courte sur ' + data.ShortName(matches[1]),
            ja: '早シェア on ' + data.ShortName(matches[1]),
            cn: '短D->' + data.ShortName(matches[1]),
          };
        }
        return;
      },
    },
    {
      id: 'O12S Hello World No Marker',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Critical Overflow Bug|Unknown_686|Latent Defect|Unknown_680|Critical Synchronization Bug) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|严重错误：上溢|Unknown_686|潜在错误|Unknown_680|严重错误：同步) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Kritischer Bug: Überlauf|Unknown_686|Latenter Bug|Unknown_680|Kritischer Bug: Synchronisierung) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|Bogue critique : boucle|Bogue Critique : Boucle|Unknown_686|Bogue latent|Bogue Latent|Unknown_680|Bogue critique : partage|Bogue Critique : Partage) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_681|クリティカルバグ：サークル|Unknown_686|レイテントバグ|Unknown_680|クリティカルバグ：シェア) from/,
      preRun: function(data, matches) {
        data.helloDebuffs[matches[1]] = true;
      },
      alertText: function(data) {
        // 1 Defamation (T), 3 Blue Markers (T/H/D), 2 Stack Markers (D/D) = 6
        // Ignore rot here to be consistent.
        if (Object.keys(data.helloDebuffs).length != 6)
          return;
        if (data.me in data.helloDebuffs)
          return;
        data.helloDebuffs[data.me] = true;
        return {
          en: 'No Marker',
          de: 'Kein Marker',
          fr: 'Aucun marqueur',
          ja: '無職',
          cn: '闲D',
        };
      },
    },
    {
      id: 'O12S Hello World Tower Complete',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_687|Cascading Latent Defect) from/,
      regexCn: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_687|潜在错误：下溢) from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_687|Latenter Bug: Unterlauf) from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_687|Bogue latent : dégradation|Bogue Latent : Dégradation) from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_687|レイテントバグ：デグレード) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Move out for Defamation',
        de: 'Rausgehen für Urteil',
        fr: 'Ecartez-vous pour #médisance',
        ja: 'サークル捨てる',
        cn: '离开人群传毒',
      },
    },
    {
      // Archive All Marker Tracking
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:(003E|0060):0000:0000:0000:/,
      condition: function(data) {
        return data.isFinalOmega;
      },
      run: function(data, matches) {
        data.archiveMarkers[matches[1]] = matches[2];
      },
    },
    {
      id: 'O12S Archive All No Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:(?:003E|0060):0000:0000:0000:/,
      condition: function(data) {
        // 4 fire markers, 1 stack marker.
        return data.isFinalOmega && Object.keys(data.archiveMarkers).length == 5;
      },
      infoText: function(data, matches) {
        if (data.me in data.archiveMarkers)
          return;
        for (let player in data.archiveMarkers) {
          if (data.archiveMarkers[player] != '003E')
            continue;
          return {
            en: 'Stack on ' + data.ShortName(player),
            de: 'Stacken auf ' + data.ShortName(player),
            fr: 'Packez-vous sur ' + data.ShortName(player),
            ja: data.ShortName(player) + 'とスタック',
            cn: '与' + data.ShortName(player) + '集合',
          };
        }
      },
    },
    {
      id: 'O12S Archive All Stack Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:003E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.isFinalOmega && matches[1] == data.me;
      },
      infoText: {
        en: 'Stack on YOU',
        de: 'Stacken auf DIR',
        fr: 'Package sur VOUS',
        ja: 'スタック on YOU',
        cn: '等待队友集合',
      },
    },
    {
      id: 'O12S Archive All Spread Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:0060:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.isFinalOmega && matches[1] == data.me;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
        ja: '散開',
        cn: '散开',
      },
    },
    {
      id: 'O12S Archive All Blue Arrow',
      regex: / 1B:\y{ObjectId}:Rear Power Unit:....:....:009D:0000:0000:0000:/,
      regexCn: / 1B:\y{ObjectId}:尾部组:....:....:009D:0000:0000:0000:/,
      alertText: {
        en: 'Back Left',
        de: 'Hinten Links',
        fr: 'Arrière gauche',
        ja: '左後ろ',
        cn: '左后',
      },
    },
    {
      id: 'O12S Archive All Red Arrow',
      regex: / 1B:\y{ObjectId}:Rear Power Unit:....:....:009C:0000:0000:0000:/,
      regexCn: / 1B:\y{ObjectId}:尾部组:....:....:009C:0000:0000:0000:/,
      alertText: {
        en: 'Back Right',
        de: 'Hinten Rechts',
        fr: 'Arrière droite',
        ja: '右後ろ',
        cn: '右后',
      },
    },
    {
      // Archive Peripheral Tracking.
      regex: / 1B:\y{ObjectId}:Right Arm Unit:....:....:009(C|D):0000:0000:0000:/,
      regexDe: / 1B:\y{ObjectId}:Rechter Arm:....:....:009(C|D):0000:0000:0000:/,
      regexFr: / 1B:\y{ObjectId}:Unité Bras Droit:....:....:009(C|D):0000:0000:0000:/,
      regexJa: / 1B:\y{ObjectId}:ライトアームユニット:....:....:009(C|D):0000:0000:0000:/,
      regexCn: / 1B:\y{ObjectId}:右臂组:....:....:009(C|D):0000:0000:0000:/,
      run: function(data, matches) {
        // Create a 3 digit binary value, R = 0, B = 1.
        // e.g. BBR = 110 = 6
        data.armValue *= 2;
        if (matches[1] == 'D')
          data.armValue += 1;
        data.numArms++;
      },
    },
    {
      id: 'O12S Archive Peripheral',
      regex: / 1B:\y{ObjectId}:Right Arm Unit:....:....:009(?:C|D):0000:0000:0000:/,
      regexDe: / 1B:\y{ObjectId}:Rechter Arm:....:....:009(?:C|D):0000:0000:0000:/,
      regexFr: / 1B:\y{ObjectId}:Unité Bras Droit:....:....:009(?:C|D):0000:0000:0000:/,
      regexJa: / 1B:\y{ObjectId}:ライトアームユニット:....:....:009(?:C|D):0000:0000:0000:/,
      regexCn: / 1B:\y{ObjectId}:右臂组:....:....:009(?:C|D):0000:0000:0000:/,
      condition: function(data) {
        return data.numArms == 3;
      },
      alertText: function(data) {
        let v = parseInt(data.armValue);
        if (!(v >= 0) || v > 7)
          return;
        return {
          en: {
            0b000: 'East',
            0b001: 'Northeast',
            0b010: undefined,
            0b011: 'Northwest',
            0b100: 'Southeast',
            0b101: undefined,
            0b110: 'Southwest',
            0b111: 'West',
          },
          ja: {
            0b000: '東',
            0b001: '北東',
            0b010: undefined,
            0b011: '北西',
            0b100: '南東',
            0b101: undefined,
            0b110: '南西',
            0b111: '西',
          },
          cn: {
            0b000: '东',
            0b001: '东北',
            0b010: undefined,
            0b011: '西北',
            0b100: '东南',
            0b101: undefined,
            0b110: '西南',
            0b111: '西',
          },
        }[data.lang][v];
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Omega': 'Omega',
        'Omega-F': 'Omega-W',
        'Omega-M': 'Omega-M',
        'Optical Unit': 'Optikmodul',

        'Left Arm Unit': 'Linker Arm',
        'Right Arm Unit': 'Rechter Arm',
        'Rear Power Unit': 'Hintere Antriebseinheit',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Advanced Optical Laser': 'Optischer Laser S',
        'Advanced Suppression': 'Hilfsprogramm S',
        'Beyond Defense': 'Schildkombo S',
        'Beyond Strength': 'Schildkombo G',
        'Cosmo Memory': 'Kosmospeicher',
        'Discharger': 'Entlader',
        'Efficient Bladework': 'Effiziente Klingenführung',
        'Electric Slide': 'Elektrosturz',
        'Enrage': 'Finalangriff',
        'Firewall': 'Sicherungssystem',
        'Fundamental Synergy': 'Synergieprogramm C',
        'Laser Shower': 'Laserschauer',
        'Operational Synergy': 'Synergieprogramm W',
        'Optical Laser': 'Optischer Laser F',
        'Optimized Blade Dance': 'Omega-Schwertertanz',
        'Optimized Blizzard III': 'Omega-Eisga',
        'Optimized Fire III': 'Omega-Feuga',
        'Optimized Meteor': 'Omega-Meteor',
        'Optimized Sagittarius Arrow': 'Omega-Choral der Pfeile',
        'Pile Pitch': 'Neigungsstoß',
        'Resonance': 'Resonanz',
        'Solar Ray': 'Sonnenstrahl',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Transformation M',
        'Superliminal Motion': 'Klingenkombo F',
        'Superliminal Steel': 'Klingenkombo B',
        'Suppression': 'Hilfsprogramm F',
        'Synthetic Blades': 'Synthetische Klinge',
        'Synthetic Shield': 'Synthetischer Schild',

        'Archive All': 'Alles archivieren',
        'Archive Peripheral': 'Archiv-Peripherie',
        'Cascading Latent Defect': 'Latenter Defekt: Zersetzung',
        'Colossal Blow': 'Kolossaler Hieb',
        'Critical Error': 'Schwerer Ausnahmefehler',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Delta Attack': 'Delta-Attacke',
        'Diffuse Wave Cannon': 'Streuende Wellenkanone',
        'Floodlight': 'Flutlicht',
        'Hello, World': 'Hallo, Welt!',
        'Hyper Pulse': 'Hyper-Impuls',
        'Index and Archive Peripheral': 'Archiv-Peripherie X',
        'Ion Efflux': 'Ionenstrom',
        'Oversampled Wave Cannon': 'Fokussierte Wellenkanone',
        'Patch': 'Regression',
        'Program Omega': 'Programm Omega',
        'Rear Lasers': 'Hintere Laser',
        'Savage Wave Cannon': 'Grausame Wellenkanone',
        'Spotlight': 'Scheinwerfer',
        'Target Analysis': 'Wellenkanone',
        'Wave Cannon': 'Wellenkanone',
      },
      '~effectNames': {
        'Infinite Limit': 'Grenzüberschreitung',
        'Local Resonance': 'Resonanzprogramm: Nah',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Packet Filter F': 'Sicherungssystem F',
        'Packet Filter M': 'Sicherungssystem M',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Prey': 'Markiert',
        'Remote Resonance': 'Resonanzprogramm: Fern',

        'Cascading Latent Defect': 'Latenter Bug: Unterlauf',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Latent Defect': 'Latenter Bug',
        'Local Regression': 'Regression: Nah',
        'Overflow Debugger': 'Bug-Korrektur: Überlauf',
        'Remote Regression': 'Regression: Fern',
        'Synchronization Debugger': 'Bug-Korrektur: Synchronisierung',
        'Underflow Debugger': 'Bug-Korrektur: Unterlauf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Omega': 'Oméga',
        'Omega-F': 'Oméga-F',
        'Omega-M': 'Oméga-M',
        'Optical Unit': 'Unité Optique',

        'Left Arm Unit': 'Unité Bras Gauche',
        'Right Arm Unit': 'Unité Bras Droit',

        // FIXME
        'Rear Power Unit': 'Rear Power Unit',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Advanced Optical Laser': 'Laser optique S',
        'Advanced Suppression': 'Programme d\'assistance S',
        'Beyond Defense': 'Combo bouclier S',
        'Beyond Strength': 'Combo bouclier G',
        'Cosmo Memory': 'Cosmomémoire',
        'Discharger': 'Déchargeur',
        'Efficient Bladework': 'Lame active',
        'Electric Slide': 'Glissement Oméga',
        'Enrage': 'Enrage',
        'Firewall': 'Programme protecteur',
        'Fundamental Synergy': 'Programme synergique C',
        'Laser Shower': 'Pluie de lasers',
        'Operational Synergy': 'Programme synergique W',
        'Optical Laser': 'Laser optique F',
        'Optimized Blade Dance': 'Danse de la lame Oméga',
        'Optimized Blizzard III': 'Méga Glace Oméga',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Optimized Meteor': 'Météore Oméga',
        'Optimized Sagittarius Arrow': 'Flèche du sagittaire Oméga',
        'Pile Pitch': 'Lancement de pieu',
        'Resonance': 'Résonance',
        'Solar Ray': 'Rayon solaire',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Simulation de sujet M',
        'Superliminal Motion': 'Combo lame F',
        'Superliminal Steel': 'Combo lame B',
        'Suppression': 'Programme d\'assistance F',
        'Synthetic Blades': 'Lame optionnelle',
        'Synthetic Shield': 'Bouclier optionnel',

        'Archive All': 'Archivage intégral',
        'Archive Peripheral': 'Périphérique d\'archivage',
        'Cascading Latent Defect': 'Bogue latent : dégradation',
        'Colossal Blow': 'Coup colossal',
        'Critical Error': 'Erreur critique',
        'Critical Overflow Bug': 'Bogue critique : boucle',
        'Critical Synchronization Bug': 'Bogue critique : partage',
        'Critical Underflow Bug': 'Bogue critique : dégradation',
        'Delta Attack': 'Attaque Delta',
        'Diffuse Wave Cannon': 'Canon plasma diffuseur',
        'Floodlight': 'Projecteur',
        'Hello, World': 'Bonjour, le monde',
        'Hyper Pulse': 'Hyperpulsion',
        'Index and Archive Peripheral': 'Périphérique d\'archivage X',
        'Ion Efflux': 'Fuite d\'ions',
        'Oversampled Wave Cannon': 'Canon plasma chercheur',
        'Patch': 'Bogue intentionnel',
        'Program Omega': 'Programme Oméga',
        'Rear Lasers': 'Lasers arrière',
        'Savage Wave Cannon': 'Canon plasma absolu',
        'Spotlight': 'Phare',
        'Target Analysis': 'Analyse de cible',
        'Wave Cannon': 'Canon plasma',
      },
      '~effectNames': {
        'Infinite Limit': 'Dépassement de limites',
        'Local Resonance': 'Programme de résonance : proximité',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Packet Filter F': 'Programme protecteur F',
        'Packet Filter M': 'Programme protecteur M',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Prey': 'Marquage',
        'Remote Resonance': 'Programme de résonance : distance',

        'Cascading Latent Defect': 'Bogue latent : dégradation',
        'Critical Overflow Bug': 'Bogue critique : boucle',
        'Critical Synchronization Bug': 'Bogue critique : partage',
        'Critical Underflow Bug': 'Bogue critique : dégradation',
        'Latent Defect': 'Bogue latent',
        'Local Regression': 'Bogue intentionnel: proximité',
        'Overflow Debugger': 'Déboguage : boucle',
        'Remote Regression': 'Bogue intentionnel : distance',
        'Synchronization Debugger': 'Déboguage : partage',
        'Underflow Debugger': 'Déboguage : dégradation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'I am the Omega': 'ワタシはオメガであり',
        'Engage!': '戦闘開始！',
        'Omega': 'オメガ',
        'Omega-F': 'オメガf',
        'Omega-M': 'オメガm',
        'Optical Unit': 'オプチカルユニット',

        'Left Arm Unit': 'レフトアームユニット',
        'Right Arm Unit': 'ライトアームユニット',

        'Rear Power Unit': 'リアユニット',
      },
      'replaceText': {
        'Advanced Optical Laser': 'オプチカルレーザーS',
        'Advanced Suppression': '援護プログラムS',
        'Beyond Defense': 'シールドコンボS',
        'Beyond Strength': 'シールドコンボG',
        'Cosmo Memory': 'コスモメモリー',
        'Discharger': 'ディスチャージャー',
        'Efficient Bladework': 'ソードアクション',
        'Electric Slide': 'オメガスライド',
        'Firewall': 'ガードプログラム',
        'Fundamental Synergy': '連携プログラムC',
        'Laser Shower': 'レーザーシャワー',
        'Operational Synergy': '連携プログラムW',
        'Optical Laser': 'オプチカルレーザーF',
        'Optimized Blade Dance': 'ブレードダンス・オメガ',
        'Optimized Blizzard III': 'ブリザガ・オメガ',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Optimized Meteor': 'メテオ・オメガ',
        'Optimized Sagittarius Arrow': 'サジタリウスアロー・オメガ',
        'Pile Pitch': 'パイルピッチ',
        'Resonance': 'レゾナンス',
        'Solar Ray': 'ソーラレイ',
        'Subject Simulation F': 'トランスフォームF',
        'Subject Simulation M': 'トランスフォームM',
        'Superliminal Motion': 'ブレードコンボF',
        'Superliminal Steel': 'ブレードコンボB',
        'Suppression': '援護プログラムF',
        'Synthetic Blades': 'ブレードオプション',
        'Synthetic Shield': 'シールドオプション',

        'Archive All': 'アーカイブオール',
        'Archive Peripheral': 'アーカイブアーム',
        'Cascading Latent Defect': 'レイテンドバグ：デグレード',
        'Colossal Blow': 'コロッサスブロー',
        'Critical Error': 'クリティカルエラー',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Delta Attack': 'デルタアタック',
        'Diffuse Wave Cannon': '拡散波動砲',
        'Floodlight': 'フラッドライト',
        'Hello, World': 'ハロー・ワールド',
        'Hyper Pulse': 'ハイパーパルス',
        'Index and Archive Peripheral': 'アーカイブアームX',
        'Ion Efflux': 'イオンエフラクス',
        'Oversampled Wave Cannon': '検知式波動砲',
        'Patch': 'エンバグ',
        'Program Omega': 'プログラム・オメガ',
        'Rear Lasers': 'リアレーザー',
        'Savage Wave Cannon': '零式波動砲',
        'Spotlight': 'スポットライト',
        'Target Analysis': '標的識別',
        'Wave Cannon': '波動砲',
      },
      '~effectNames': {
        'Infinite Limit': '限界超越',
        'Local Resonance': 'レゾナンスプログラム：ニアー',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Packet Filter F': 'ガードプログラムF',
        'Packet Filter M': 'ガードプログラムM',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Prey': 'マーキング',
        'Remote Resonance': 'レゾナンスプログラム：ファー',

        'Cascading Latent Defect': 'レイテントバグ：デグレード',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Latent Defect': 'レイテントバグ',
        'Local Regression': 'エンバグ：ニアー',
        'Overflow Debugger': 'バグフィックス：サークル',
        'Remote Regression': 'エンバグ：ファー',
        'Synchronization Debugger': 'バグフィックス：シェア',
        'Underflow Debugger': 'バグフィックス：デグレード',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Engage!': '战斗开始！',
        'Omega-F': '欧米茄F',
        'Omega-M': '欧米茄M',
        'Omega': '欧米茄',
        'optical unit': '视觉组',
        'left arm unit': '左臂组',
        'right arm unit': '右臂组',
        'Optical Unit': '视觉组',
        'Left Arm Unit': '左臂组',
        'Right Arm Unit': '右臂组',
        'Rear Power Unit': '尾部组',
      },
      'replaceText': {
        'Advanced Optical Laser': '光学射线S',
        'Advanced Suppression': '援护程序S',
        'Beyond Defense': '盾连击S',
        'Beyond Strength': '盾连击G',
        'Cosmo Memory': '宇宙记忆',
        'Discharger': '能量放出',
        'Efficient Bladework': '剑击',
        'Electric Slide': '欧米茄滑跃',
        'Firewall': '防御程序',
        'Fundamental Synergy': '协作程序C',
        'Laser Shower': '激光骤雨',
        'Operational Synergy': '协作程序W',
        'Optical Laser': '光学射线F',
        'Optimized Blade Dance': '欧米茄刀光剑舞',
        'Optimized Blizzard III': '欧米茄冰封',
        'Optimized Fire III': '欧米茄烈炎',
        'Optimized Meteor': '欧米茄陨石流星',
        'Optimized Sagittarius Arrow': '欧米茄射手天箭',
        'Pile Pitch': '能量投射',
        'Resonance': '共鸣',
        'Solar Ray': '太阳射线',
        'Subject Simulation F': '变形F',
        'Subject Simulation M': '变形M',
        'Superliminal Motion': '剑连击F',
        'Superliminal Steel': '剑连击B',
        'Suppression': '援护程序F',
        'Synthetic Blades': '合成剑',
        'Synthetic Shield': '合成盾',
        'Archive All': '全归档',
        'Archive Peripheral': '手臂归档',
        'Cascading Latent Defect': '潜在错误：下溢',
        'Colossal Blow': '巨能爆散',
        'Critical Error': '严重错误',
        'Critical Overflow Bug': '严重错误：上溢',
        'Critical Synchronization Bug': '严重错误：同步',
        'Critical Underflow Bug': '严重错误：下溢',
        'Delta Attack': '三角攻击',
        'Diffuse Wave Cannon': '扩散波动炮',
        'Floodlight': '泛光灯',
        'Hello, World': '你好，世界',
        'Hyper Pulse': '超能脉冲',
        'Index and Archive Peripheral': '手臂归档X',
        'Ion Efflux': '离子流出',
        'Oversampled Wave Cannon': '探测式波动炮',
        'Patch': '补丁',
        'Program Omega': '程序·欧米茄',
        'Rear Lasers': '背环激光',
        'Savage Wave Cannon': '零式波动炮',
        'Spotlight': '聚光灯',
        'Target Analysis': '目标识别',
        'Wave Cannon': '波动炮',
        'Wind Blade': '烈风刃',
        'attack': '攻击',
      },
      '~effectNames': {
        'Infinite Limit': '超越界限',
        'Local Resonance': '共鸣程序：近',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Packet Filter F': '防护程序F',
        'Packet Filter M': '防护程序M',
        'Physical Vulnerability Up': '物理受伤加重',
        'Prey': '猎物',
        'Remote Resonance': '共鸣程序：远',
        'Cascading Latent Defect': '潜在错误：下溢',
        'Critical Overflow Bug': '严重错误：上溢',
        'Critical Synchronization Bug': '严重错误：同步',
        'Critical Underflow Bug': '严重错误：下溢',
        'Damage Down': '伤害降低',
        'Healing Magic Down': '治疗魔法效果降低',
        'Latent Defect': '潜在错误',
        'Local Regression': '回归方程：近',
        'Overflow Debugger': '修复错误：上溢',
        'Remote Regression': '回归方程：远',
        'Synchronization Debugger': '修复错误：同步',
        'Underflow Debugger': '修复错误：下溢',
      },
    },
  ],
}];

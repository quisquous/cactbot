'use strict';

// TODO: grand cross "plummet" attacks have locations,
// so it should be possible to tell people where to go.
// This is not true for Mustadio's Maintenance.

[{
  zoneRegex: /^The Orbonne Monastery$/,
  timelineFile: 'orbonne_monastery.txt',
  timelineTriggers: [
    {
      // I know, I know, there's two warnings for this.
      // But like seriously you've got like at least thirty years,
      // and if you do it wrong it wipes the raid.  So... /shrug??
      id: 'Orbonne Agrias Duskblade',
      regex: /Duskblade/,
      beforeSeconds: 15,
      infoText: {
        en: 'Get to your pads',
        de: 'Geh auf Dein Feld',
        fr: 'Allez sur votre tour',
      },
    },
    {
      id: 'Orbonne Ultima Dominion Tether',
      regex: /Demi-Virgo.*Tether/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Pick up tether',
        de: 'Verbindung abnehmen',
        fr: 'Prenez le lien',
      },
    },
  ],
  triggers: [
    {
      id: 'Orbonne Harpy Devitalize',
      regex: / 14:3778:Harpy starts using Devitalize/,
      regexDe: / 14:3778:Harpyie starts using Schwächung/,
      regexFr: / 14:3778:Harpie starts using Dévitalisation/,
      suppressSeconds: 10,
      alertText: {
        en: 'Look Away',
        de: 'Wegschauen',
        fr: 'Regardez ailleurs',
      },
    },
    {
      id: 'Orbonne Mustadio Right Handgonne',
      regex: / 14:373E:Mustadio starts using Right Handgonne/,
      regexDe: / 14:373E:Mustadio starts using Rechte Donnerbüchse/,
      regexFr: / 14:373E:Mustadio starts using Mitraillage Droite/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'A gauche',
      },
    },
    {
      id: 'Orbonne Mustadio Left Handgonne',
      regex: / 14:373F:Mustadio starts using Left Handgonne/,
      regexDe: / 14:373F:Mustadio starts using Linke Donnerbüchse/,
      regexFr: / 14:373F:Mustadio starts using Mitraillage Gauche/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'A droite',
      },
    },
    {
      id: 'Orbonne Mustadio Last Testament',
      regex: / 14:3737:Mustadio starts using Last Testament/,
      regexFr: / 14:3737:Mustadio starts using Dernier Testament/,
      alertText: {
        en: 'Point opening at Mustadio',
        fr: 'Orientez l\'ouverture vers le boss',
      },
    },
    {
      id: 'Orbonne Mustadio Arm Shot',
      regex: / 14:3739:Mustadio starts using Arm Shot on (\y{Name})/,
      regexDe: / 14:3739:Mustadio starts using Armschuss on (\y{Name})/,
      regexFr: / 14:3739:Mustadio starts using Visée Des Bras on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Orbonne Mustadio Searchlight',
      regex: / 1B:........:(\y{Name}):....:....:00A4:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Searchlight on YOU',
        de: 'Suchscheinwerfer auf DIR',
        fr: 'Repérage sur VOUS',
      },
    },
    {
      id: 'Orbonne Spread Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread Marker',
        de: 'Verteilen-Marker',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Orbonne Agrias Thunder Slash',
      regex: / 14:3866:Agrias starts using Thunder Slash on (\y{Name})/,
      regexDe: / 14:3866:Agrias starts using Donnerhieb on (\y{Name})/,
      regexFr: / 14:3866:Agrias starts using Foudrolle on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave',
            de: 'Tank Cleave',
            fr: 'Tank Cleave',
          };
        }
      },
    },
    {
      id: 'Orbonne Agrias Cleansing Strike',
      regex: / 14:3854:Agrias starts using Cleansing Strike/,
      regexDe: / 14:3854:Agrias starts using Säuberungsschlag/,
      regexFr: / 14:3854:Agrias starts using Impact Purifiant/,
      preRun: function(data) {
        data.halidom = [];
      },
      delaySeconds: 50,
      run: function(data) {
        delete data.agriasGhostCleanse;
      },
    },
    {
      id: 'Orbonne Agrias Vacuum',
      regex: / 1B:........:(\y{Name}):....:....:00A5:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.agriasGhostCleanse = true;
      },
    },
    {
      id: 'Orbonne Agrias Consecration',
      regex: / 14:3850:Agrias starts using Consecration/,
      regexDe: / 14:3850:Agrias starts using Konsekration/,
      regexFr: / 14:3850:Agrias starts using Joug Sanctifié/,
      condition: function(data) {
        return !data.agriasGhostCleanse;
      },
      infoText: {
        en: 'Pick up swords',
        de: 'Schwerter aufnehmen',
        fr: 'Prenez les épées',
      },
    },
    {
      id: 'Orbonne Agrias Halidom Inside',
      regex: / 15:\y{ObjectId}:Halidom:3851:[^:]*:\y{ObjectId}:(\y{Name})/,
      regexDe: / 15:\y{ObjectId}:Falsches Heiligtum:3851:[^:]*:\y{ObjectId}:(\y{Name})/,
      regexFr: / 15:\y{ObjectId}:Faux Sanctuaire:3851:[^:]*:\y{ObjectId}:(\y{Name})/,
      run: function(data, matches) {
        data.halidom.push(matches[1]);
      },
    },
    {
      id: 'Orbonne Agrias Halidom Outside',
      regex: / 15:\y{ObjectId}:Halidom:3851:/,
      regexDe: / 15:\y{ObjectId}:Falsches Heiligtum:3851:/,
      regexFr: / 15:\y{ObjectId}:Faux Sanctuaire:3851:/,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      alertText: function(data) {
        if (data.agriasGhostCleanse || data.halidom.indexOf(data.me) >= 0)
          return;
        return {
          en: 'Use Swords On Jails',
          de: 'Kristalle mit Schwert zerschlagen',
          fr: 'Libérez les prisonniers avec les épées',
        };
      },
    },
    {
      id: 'Orbonne Agrias Hallowed Bolt',
      regex: / 1B:........:(\y{Name}):....:....:00A6:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Go To Center',
        de: 'In die Mitte gehen',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'Orbonne Agrias Adds Phase',
      regex: / 15:\y{ObjectId}:Agrias:385D:/,
      regexDe: / 15:\y{ObjectId}:Agrias:385D:/,
      regexFr: / 15:\y{ObjectId}:Agrias:385D:/,
      alertText: {
        en: 'Get Shield',
        de: 'Schild nehmen',
        fr: 'Prenez un bouclier',
      },
    },
    {
      id: 'Orbonne Agrias Mortal Blow',
      regex: / 14:385E:Sword Knight starts using Mortal Blow/,
      regexDe: / 14:385E:Schwertritter starts using Tödlicher Hieb/,
      regexFr: / 14:385E:Chevalier à l'épée starts using Frappe Brutale/,
      suppressSeconds: 5,
      alertText: {
        en: 'Use Shield, Face Knights',
        de: 'Schild benutzen, Ritter anschauen',
        fr: 'Bouclier, face au chevaliers',
      },
    },
    {
      id: 'Orbonne Agrias Extra Adds',
      regex: / 03:Added new combatant Emblazoned Shield/,
      regexDe: / 03:Added new combatant Geschmückter Schild/,
      regexFr: / 03:Added new combatant Pavois Miroitant/,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill shields with sword',
        de: 'Schilde mit Schwert zerstören',
        fr: 'Détruisez les boucliers avec les épées',
      },
    },
    {
      id: 'Orbonne Agrias Judgment Blade',
      regex: / 14:3857:Agrias starts using Judgment Blade/,
      regexDe: / 14:3857:Agrias starts using Klinge des Urteils/,
      regexFr: / 14:3857:Agrias starts using Lame Du Jugement/,
      infoText: {
        en: 'Use shield, face boss',
        de: 'Schild benutzen, Boss anschauen',
        fr: 'Bouclier, face au boss',
      },
    },
    {
      id: 'Orbonne Agrias Divine Ruination',
      regex: / 14:3858:Agrias starts using Divine Ruination/,
      regexDe: / 14:3858:Agrias starts using Göttliche Zerstörung/,
      regexFr: / 14:3858:Agrias starts using Ire Céleste/,
      infoText: {
        en: 'Use shield if tethered',
        de: 'Schild benutzen, wenn verbunden',
        fr: 'Bouclier si lié',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Healer',
      regex: / 14:3752:The Thunder God starts using Crush Helm/,
      regexDe: / 14:3752:Cidolfus starts using Zenitspaltung/,
      regexFr: / 14:3752:Cid Le Dieu De La Foudre starts using Bombardement Céleste/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Feint',
      regex: / 14:3752:The Thunder God starts using Crush Helm/,
      regexDe: / 14:3752:Cidolfus starts using Zenitspaltung/,
      regexFr: / 14:3752:Cid Le Dieu De La Foudre starts using Bombardement Céleste/,
      condition: function(data) {
        return data.role == 'dps-melee';
      },
      infoText: {
        en: 'Feint Tank Buster',
        de: 'Tankbuster Zermürben',
        fr: 'Evitez Tank Buster',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Tank',
      regex: / 15:\y{ObjectId}:The Thunder God:3753:Crush Helm:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Cidolfus:3753:Zenitspaltung:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Cid Le Dieu De La Foudre:3753:Bombardement Céleste:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'Orbonne Cid Crush Armor Tank',
      regex: / 14:3758:The Thunder God starts using Crush Armor/,
      regexDe: / 14:3758:Cidolfus starts using Helmspalter/,
      regexFr: / 14:3758:Cid Le Dieu De La Foudre starts using Brèche Insidieuse/,
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Give Tether Away',
        de: 'Verbindung abgeben',
        fr: 'Donnez le lien',
      },
    },
    {
      id: 'Orbonne Cid Crush Armor',
      regex: / 15:\y{ObjectId}:The Thunder God:3759:Crush Armor:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Cidolfus:3759:Helmspalter:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Cid Le Dieu De La Foudre:3759:Brèche Insidieuse:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Give Tether Away',
        de: 'Verbindung abgeben',
        fr: 'Donnez le lien',
      },
    },
    {
      id: 'Orbonne Cid Crush Accessory',
      regex: / 14:375A:The Thunder God starts using Crush Accessory/,
      regexDe: / 14:375A:Cidolfus starts using Hagelkörner/,
      regexFr: / 14:375A:Cid Le Dieu De La Foudre starts using Grêlons Fracassants/,
      alertText: {
        en: 'Kill Icewolf Adds',
        fr: 'Tuez les Grêlons de glace',
      },
    },
    {
      id: 'Orbonne Cid Cleansing Strike',
      regex: / 16:\y{ObjectId}:The Thunder God:3751:Cleansing Strike:/,
      regexDe: / 16:\y{ObjectId}:Cidolfus:3751:Säuberungsschlag:/,
      regexFr: / 16:\y{ObjectId}:Cid Le Dieu De La Foudre:3751:Impact Purifiant:/,
      suppressSeconds: 10,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal To Full',
        de: 'Vollheilen',
        fr: 'Full life',
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Bubble',
      regex: / 14:3761:The Thunder God starts using Duskblade/,
      regexDe: / 14:3761:Cidolfus starts using Dämmerklinge/,
      regexFr: / 14:3761:Cid Le Dieu De La Foudre starts using Lame sombre/,
      alertText: {
        en: 'Stand on Pads',
        de: 'Auf Felder stellen',
        fr: 'Restez sur le pad',
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Bubble',
      regex: / 1B:........:(\y{Name}):....:....:00AA:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Drop Bubble In Back',
        de: 'Blase hinten ablegen',
        fr: 'Déposez bulles derrière',
      },
    },
    {
      id: 'Orbonne Cid Hallowed Bolt',
      regex: / 1B:........:(\y{Name}):....:....:0017:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Bolt on YOU',
        de: 'Blitz auf DIR',
        fr: 'Eclair sur VOUS',
      },
    },
    {
      id: 'Orbonne Cid Crush Weapon',
      regex: / 1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'GTFO',
        de: 'VERZIEH DICH',
        fr: 'Sortez',
      },
    },
    {
      id: 'Orbonne Cid Hallowed Bolt Stack',
      regex: / 1B:........:\y{Name}:....:....:003E:/,
      suppressSeconds: 10,
      infoText: {
        en: 'Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Orbonne Cid Divine Ruination',
      regex: / 1B:........:(\y{Name}):....:....:006E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Point Line Outside',
        de: 'Linie nach Außen',
        fr: 'Ligne vers l\'extérieur',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword In',
      regex: / 14:3750:The Thunder God starts using/,
      regexDe: / 14:3750:Cidolfus starts using/,
      regexFr: / 14:3750:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        en: 'Get In',
        de: 'Rein da',
        fr: 'Près du boss',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Out',
      regex: / 14:374F:The Thunder God starts using/,
      regexDe: / 14:374F:Cidolfus starts using/,
      regexFr: / 14:374F:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Loin du boss',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Left',
      regex: / 14:3749:The Thunder God starts using/,
      regexDe: / 14:3749:Cidolfus starts using/,
      regexFr: / 14:3749:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Right',
      regex: / 14:374A:The Thunder God starts using/,
      regexDe: / 14:374A:Cidolfus starts using/,
      regexFr: / 14:374A:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Three 1',
      regex: / 14:374C:The Thunder God starts using/,
      regexDe: / 14:374C:Cidolfus starts using/,
      regexFr: / 14:374C:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        // e.g. E / NE / NW platforms
        en: 'Rotate right',
        de: 'Im Uhrzeigersinn ausweichen',
        fr: 'Evitez les épées dans le sens anti-horaire',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Three 2',
      regex: / 14:374D:The Thunder God starts using/,
      regexDe: / 14:374D:Cidolfus starts using/,
      regexFr: / 14:374D:Cid Le Dieu De La Foudre starts using/,
      alertText: {
        // NW / NE / E platforms
        en: 'Rotate left',
        de: 'Schwertern im Uhrzeigersinn ausweichen',
        fr: 'Evitez les épées dans le sens horaire',
      },
    },
    {
      id: 'Orbonne Ultima Redemption',
      regex: / 14:38AA:Ultima, The High Seraph starts using Redemption on (\y{Name})/,
      regexDe: / 14:38AA:Cherub Ultima starts using Zerstörung on (\y{Name})/,
      regexFr: / 14:38AA:Ultima La Grande Séraphine starts using Destruction on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Orbonne Ultima Dark Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:0037:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Orbonne Ultima Eruption',
      regex: / 1B:........:(\y{Name}):....:....:0066:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Eruption on YOU',
        de: 'Eruption auf DIR',
        fr: 'Éruption sur vous',
      },
    },
    {
      id: 'Orbonne Ultima Flare IV',
      regex: / 1B:........:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'GTFO',
        de: 'VERZIEH DICH',
        fr: 'Sortez',
      },
    },
    {
      id: 'Orbonne Ultima Time Eruption',
      regex: / 14:38CF:Demi-Belias starts using Time Eruption/,
      regexDe: / 14:38CF:Demi-Belias starts using Zeiteruption/,
      regexFr: / 14:38CF:Demi-Belias starts using Éruption/,
      infoText: {
        en: 'Stand on Slow Clock',
        de: 'In der langsamen Uhr stehen',
        fr: 'Placez-vous sur une horloge lente',
      },
    },
    {
      id: 'Orbonne Ultima Extreme Edge',
      regex: / 14:38DA:Demi-Hashmal starts using Extreme Edge/,
      regexDe: / 14:38DA:Demi-Hashmal starts using Extremkante/,
      regexFr: / 14:38DA:Demi-Hashmal starts using Taille Suprême/,
      alertText: {
        en: 'Look for Hashmal dash',
        de: 'Nach Hashmal-Dash ausschau halten',
        fr: 'Attention au dash',
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion Healer',
      regex: /14:3895:Ultima, The High Seraph starts using Ultimate Illusion/,
      regexDe: /14:3895:Cherub Ultima starts using Ultimative Illusion/,
      regexFr: /14:3895:Ultima La Grande Séraphine starts using Fantaisie Finale/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal Like Whoa',
        de: 'Heilen was das Zeug hält',
        fr: 'Mass heal',
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion',
      // Yes, this is lower case "the High Seraph".
      regex: / 15:\y{ObjectId}:Ultima, the High Seraph:3895:Ultimate Illusion:/,
      regexDe: / 15:\y{ObjectId}:Cherub Ultima:3895:Ultimative Illusion:/,
      regexFr: / 15:\y{ObjectId}:Ultima La Grande Séraphine:3895:Fantaisie Finale:/,
      condition: function(data) {
        return data.role != 'healer';
      },
      // zzz
      delaySeconds: 23.5,
      alertText: {
        en: 'Kill Ruination!',
        de: 'Zerstörung vernichten',
        fr: 'Tuez la Marque des déchus',
      },
    },
    {
      id: 'Orbonne Ultima Acceleration Bomb',
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Beschleunigungsbombe from .*? for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of Bombe à Accélération from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 1;
      },
      alertText: {
        en: 'stop',
        de: 'Stopp',
        fr: 'Stop',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Mustadio': 'Mustadio',
        'Early Turret': 'alter Gefechtsturm',
        'Iron Construct': 'Eisenkonstrukt',
        'Halidom': 'Falsches Heiligtum',
        'Emblazoned Shield': 'geschmückter Schild',
        'Ephemeral Knight': 'vergänglicher Ritter',
        'Shield Knight': 'Schildritter',
        'Sword Knight': 'Schwertritter',
        'Icewolf': 'Eiswolf',
        'The Thunder God': 'Cidolfus',
        'Demi-Belias': 'Demi-Belias',
        'Demi-Hashmal': 'Demi-Hashmallim',
        'Ultima, the High Seraph': 'Cherub Ultima',
        'Aspersory': 'Aspersorium',
        'Auracite Shard': 'Auracitenscherbe',
        'Ruination': 'Zeichen des gefallenen Engels',

        'Harpy': 'Harpyie',
        'Agrias': 'Agrias',
        'Dark Crusader': 'Düsterritter',
        'Ramza': 'Ramza',
        'Dominion': 'Dominion',
        'Demi-Famfrit': 'Demi-Famfrit',
        '..is no longer sealed': '.*öffnet sich wieder',
        'The Realm of the Templars will be sealed off': '.*Reich der Tempelritter schließt',
        'The Realm of the Machinists will be sealed off': '.*Reich der Maschinisten schließt',
        'The lifeless alley will be sealed off': '.*Leblosen Pfad schließt',
        'The Realm of the Thunder God will be sealed off': '.*Reich des Donnergottes schließt',
        'The Crystalline Gaol will be sealed off': '.*Kristallkerker schließt',
        'I see it now': 'Ich sehe ihn in dir!',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Analysis': 'Analyse',
        'Arm Shot': 'Armschuss',
        'Ballistic Impact': 'Ballistischer Einschlag',
        'Ballistic Missile': 'Ballistische Rakete ',
        'Compress': 'Zerdrücken',
        'Energy Burst': 'Energiestoß',
        'Enrage': 'Finalangriff',
        'Left Handgonne': 'Linke Donnerbüchse',
        'Leg Shot': 'Beinschuss',
        'Maintenance': 'Wartung',
        'Right Handgonne': 'Rechte Donnerbüchse',
        'Satellite Beam': 'Satellit',
        'Searchlight': 'Suchscheinwerfer',
        'Cleansing Flame': 'Flamme der Läuterung',
        'Cleansing Strike': 'Säuberungsschlag',
        'Consecration': 'Konsekration',
        'Divine Light': 'Göttliches Licht',
        'Enrage': 'Finalangriff',
        'Hallowed Bolt': 'Geheiligter Blitz',
        'Heavenly Judgment': 'Urteil des Himmels',
        'Judgment Blade': 'Klinge des Urteils',
        'Mortal Blow': 'Tödlicher Hieb',
        'Northswain\'s Strike': 'Schlag des Polarsterns',
        'Thunder Slash': 'Donnerhieb',
        'Crush Accessory': 'Hagelkörner',
        'Colosseum': 'Kolosseum',
        'Crush Armor': 'Helmspalter',
        'Crush Helm': 'Himmelsbombardement',
        'Crush Weapon': 'Jenseitsschrei',
        'Divine Ruination': 'Göttliche Zerstörung',
        'Duskblade': 'Dämmerklinge',
        'Enrage': 'Finalangriff',
        'Hallowed Bolt': 'Geheiligter Blitz',
        'Judgment Blade': 'Klinge des Urteils',
        'Northswain\'s Strike': 'Schlag des Polarsterns',
        'Shadowblade': 'Schattenklinge',
        'T.G. Holy Sword': 'Heiliges Schwert des Donnergottes',
        'Auralight': 'Aurastrahl',
        'Control Tower': 'Turmkontrolle',
        'Cataclysm': 'Kosmischer Kataklysmus',
        'Dark Cannonade': 'Dunkler Blitz',
        'Dark Ewer': 'Dunkler Wasserkrug',
        'Demi-Aquarius': 'Demi-Aquarius',
        'Demi-Aries': 'Demi-Aries',
        'Demi-Leo': 'Demi-Leo',
        'Eastward March': 'Marsch nach Osten',
        'Embrace': 'Umschließen',
        'Enrage': 'Finalangriff',
        'Extreme Edge': 'Extremkante',
        'Flare IV': 'Giga-Flare',
        'Grand Cross': 'Supernova',
        'Hammerfall': 'Hammerschlag',
        'Holy IV': 'Giga-Sanctus',
        'Life Drain': 'Vitalabsorption',
        'Penultima': 'Penultima',
        'Plummet': 'Abfallen',
        'Materialize': 'Trugbild',
        'Plummet': 'Abfallen',
        'Prevailing Current': 'Strahl',
        'Ray of Light': 'Lichtstrahl',
        'Redemption': 'Zerstörung',
        'Shockwave': 'Schockwelle',
        'Sanction': 'Sanktion',
        'Time Eruption': 'Zeiteruption',
        'Towerfall': 'Turmsturz',
        'Ultimate Illusion': 'Ultimative Illusion',
        'attack': 'Attacke',
        'Devitalize': 'Schwächung',
        'L/R Handgonne': 'L/R Donnerbüchse',
        'Last Testament': 'Letztes Testament',
        'Dark Rite': 'Dunkler Ritus',
        'Noahionto': 'Noahionto',
        'Infernal Wave': 'Infernowelle',
        'Sword L/R': 'Sword L/R',
        'Sword In/Out': 'Schwert Rein/Raus',
        'Sword Out/In': 'Schwert Raus/Rein',
        'Stack': 'Stack',
        'Balance Asunder': 'Bruch des Gleichgewichts',
        'Sword Three In A Row': 'Schwertreihenschlag',
        'Earth Hammer': 'Erdhammer',
        'Eruption': 'Eruption',
        'East/West March': 'Ost-/West-Marsch',
        'Ray Of Light': 'Lichtstrahl',
        'Demi-Virgo Line': 'Demi-Virgo Linie',
        'Demi-Virgo Feet': 'Demi-Virgo Füße',
        'Demi-Virgo Tether': 'Demi-Virgo Verbindung',
        'Demi-Virgo Line/Tether': 'Demi-Virgo Linie/Verbindung',
        'Demi-Virgo Tether/Feet': 'Demi-Virgo Verbindung/Füße',

        // FIXME
        'ghost stun': 'ghost stun',
        'crystal stun': 'crystal stun',
      },
      '~effectNames': {
        'Down For The Count': 'Am Boden',
        'Paralysis': 'Paralyse',
        'Damage Up': 'Schaden +',
        'Doom': 'Verhängnis',
        'Fetters': 'Gefesselt',
        'Invincibility': 'Unverwundbar',
        'Shieldbearer': 'Schildträger',
        'Stun': 'Betäubung',
        'Swordbearer': 'Schwertträger',
        'Bleeding': 'Blutung',
        'Electrocution': 'Stromschlag',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Guardians\' Aegis': 'Wächter-Aegis',
        'Bind': 'Fessel',
        'Clashing': 'Gekreuzte Klingen',
        'Fearless': 'Furchtlos',
        'Out Of The Action': 'Außer Gefecht',
        'Acceleration Bomb': 'Beschleunigungsbombe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Early Turret': 'Tourelle archaïque',
        'Mustadio': 'Mustadio',
        'Iron Construct': 'Bâtisseur De Fer',
        'Halidom': 'Faux Sanctuaire',
        'Emblazoned Shield': 'Pavois Miroitant',
        'Ephemeral Knight': 'Chevalière Sacrée Évanescente',
        'Shield Knight': 'Chevalier Au Bouclier',
        'Sword Knight': 'Chevalier À l\'Épée',
        'icewolf': 'Grêlon De Glace',
        'The Thunder God': 'Cid Le Dieu De La Foudre',
        'Demi-Belias': 'Demi-Belias',
        'Demi-Hashmal': 'Demi-Hashmal',
        'Demi-Leo': 'Demi-Lion',
        'Demi-Virgo': 'Demi-Vierge',
        'Ultima, the High Seraph': 'Ultima La Grande Séraphine',
        'Aspersory': 'Aiguière Bénie',
        'Auracite Shard': 'Concrétion d\'Auralithe',
        'Ruination': 'Marque Des Déchus',
        'Harpy': 'Harpie',
        'Agrias': 'Agrias',
        'Demi-Famfrit': 'Demi-Famfrit',
        'Ramza': 'Ramza',
        'Dark Crusader': 'Conquérant sombre',
        'Dominion': 'Dominion',
        '..is no longer sealed': 'Ouverture du',
        'The Realm of the Templars will be sealed off': 'Fermeture du cloître de la chevalière sacrée',
        'The Realm of the Machinists will be sealed off': 'Fermeture du cloître de l\'ingénieur',
        'The lifeless alley will be sealed off': 'Fermeture des corridors silencieux',
        'The Realm of the Thunder God will be sealed off': 'Fermeture du cloître du Dieu de la Foudre',
        'The Crystalline Gaol will be sealed off': 'Fermeture de la Geôle cristalline',
        'I see it now': 'À vous, maintenant',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Analysis': 'Analyse',
        'Arm Shot': 'Visée des bras',
        'Ballistic Impact': 'Impact de missile',
        'Ballistic Missile': 'Missiles balistiques',
        'Compress': 'Écraser',
        'Energy Burst': 'Éruption d\'énergie',
        'Enrage': 'Enrage',
        'Left Handgonne': 'Mitraillage gauche',
        'Leg Shot': 'Visée des jambes',
        'Maintenance': 'Maintenance',
        'Right Handgonne': 'Mitraillage droite',
        'Satellite Beam': 'Rayon satellite',
        'Searchlight': 'Repérage lumineux',
        'Cleansing Flame': 'Irradiation divine',
        'Cleansing Strike': 'Impact purifiant',
        'Consecration': 'Joug sanctifié',
        'Divine Light': 'Onde de lumière évanescente',
        'Enrage': 'Enrage',
        'Hallowed Bolt': 'Éclair sacré',
        'Heavenly Judgment': 'Jugement céleste',
        'Judgment Blade': 'Lame du jugement',
        'Mortal Blow': 'Frappe brutale',
        'Northswain\'s Strike': 'Frappe de l\'Étoile Polaire',
        'Thunder Slash': 'Foudrolle',
        'Colosseum': 'Arène des Braves',
        'Crush Accessory': 'Grêlons fracassants',
        'Crush Armor': 'Brèche insidieuse',
        'Crush Helm': 'Bombardement céleste',
        'Crush Weapon': 'Cri de l\'au-delà',
        'Divine Ruination': 'Ire céleste',
        'Duskblade': 'Lame sombre',
        'Enrage': 'Enrage',
        'Hallowed Bolt': 'Éclair sacré',
        'Judgment Blade': 'Lame du jugement',
        'Northswain\'s Strike': 'Frappe de l\'Étoile Polaire',
        'Shadowblade': 'Lame des ténèbres',
        'T.G. Holy Sword': 'Épée sacrée du Dieu de la Foudre',
        'Auralight': 'Rayon auralithe',
        'Control Tower': 'Tour de contrôle',
        'Cataclysm': 'Cataclysme cosmique',
        'Dark Cannonade': 'Bombardement ténébreux',
        'Dark Ewer': 'Aiguières ténèbreuses',
        'Demi-Aquarius': 'Demi-Verseau',
        'Demi-Aries': 'Demi-Bélier',
        'Demi-Leo': 'Demi-Lion',
        'Demi-Virgo': 'Demi-Vierge',
        'Eastward March': 'Marche vers l\'est',
        'Embrace': 'Étreinte',
        'Enrage': 'Enrage',
        'Eruption': 'Éruption',
        'Extreme Edge': 'Taille suprême',
        'Flare IV': 'Giga Brasier',
        'Grand Cross': 'Croix suprême',
        'Hammerfall': 'Aplatissoir',
        'Holy': 'Miracle',
        'Holy IV': 'Giga Miracle',
        'Life Drain': 'Absorption vitale',
        'Penultima': 'Petite ultima',
        'Plummet': 'Chute de roche',
        'Materialize': 'Apparition',
        'Plummet': 'Chute de roche',
        'Prevailing Current': 'Torrent',
        'Ray of Light': 'Onde de lumière',
        'Redemption': 'Destruction',
        'Sanction': 'Sanction',
        'Shockwave': 'Onde de choc',
        'Time Eruption': 'Éruption à retardement',
        'Towerfall': 'Écroulement',
        'Ultimate Illusion': 'Fantaisie finale',
        'Ultimate Flare': 'Explosion ultima',
        'Westward March': 'Marche vers l\'ouest',
        'attack': 'Attaque',
        'Devitalize': 'Dévitalisation',
        'L/R Handgonne': 'Mitraillage G/D',
        'Last Testament': 'Dernier testament',
        'Dark Rite': 'Dark Rite',
        'Noahionto': 'Noahionto',
        'Infernal Wave': 'Onde infernale',
        'Sword L/R': 'Epée G/D',
        'Sword In/Out': 'Epée Dedans/Dehors',
        'Sword Out/In': 'Epée Dehors/Dedans',
        'Stack': 'Packez-vous',
        'Balance Asunder': 'Bouleversement de l\'équilibre',
        'Sword Three In A Row': '3 coups d\'épée à la suite',
        'Earth Hammer': 'Marteau tellurique',
        'East/West March': 'Marche Est/Ouest',
        'Demi-Virgo Line': 'Demi-Virge Ligne',
        'Demi-Virgo Feet': 'Demi-Virge Pieds',
        'Demi-Virgo Tether': 'Demi-Vierge Liens',
        'Demi-Virgo Line/Tether': 'Demi-Vierge Ligne/Lien',
        'Demi-Virgo Tether/Feet': 'Demi-Vierge Lien/Pieds',

        // FIXME
        'ghost stun': 'ghost stun',
        'crystal stun': 'crystal stun',
      },
      '~effectNames': {
        'Down For The Count': 'Au Tapis',
        'Paralysis': 'Paralysie',
        'Doom': 'Glas',
        'Fetters': 'Attache',
        'Invincibility': 'Invulnérable',
        'Shieldbearer': 'Porteur du bouclier sacré',
        'Stun': 'Étourdissement',
        'Swordbearer': 'Porteur de l\'épée sacrée',
        'Bleeding': 'Saignant',
        'Electrocution': 'Électrocution',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Guardians\' Aegis': 'Barrière protectrice',
        'Acceleration Bomb': 'Bombe à Accélération',
        'Bind': 'Entrave',
        'Clashing': 'Duel D\'armes',
        'Fearless': 'Brave',
        'Out Of The Action': 'Actions Bloquées',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Mustadio': '機工士ムスタディオ',
        'Iron Construct': '労働型鉄巨人',
        'Emblazoned Shield': '光輝の大盾',
        'Ephemeral Knight': '幻影の聖騎士',
        'Shield Knight': '盾の騎士',
        'Sword Knight': '剣の騎士',
        'icewolf': '氷狼',
        'The Thunder God': '雷神シド',
        'Demi-Belias': 'デミ・ベリアス',
        'Demi-Hashmal': 'デミ・ハシュマリム',
        'Ultima, the High Seraph': '聖天使アルテマ',
        'Aspersory': '聖雲の水瓶',
        'Auracite Shard': '聖石塊',
        'Ruination': '堕天の証',

        // FIXME:
        'Harpy': 'Harpy',
        'Agrias': 'Agrias',
        'Dark Crusader': 'Dark Crusader',
        'Ramza': 'Ramza',
        'Dominion': 'Dominion',
        'Demi-Famfrit': 'Demi-Famfrit',
        '..is no longer sealed': '.*is no longer sealed',
        'The Realm of the Templars will be sealed off': 'The Realm of the Templars will be sealed off',
        'The Realm of the Machinists will be sealed off': 'The Realm of the Machinists will be sealed off',
        'The lifeless alley will be sealed off': 'The lifeless alley will be sealed off',
        'The Realm of the Thunder God will be sealed off': 'The Realm of the Thunder God will be sealed off',
        'The Crystalline Gaol will be sealed off': 'The Crystalline Gaol will be sealed off',
        'I see it now': 'I see it now',
      },
      'replaceText': {
        'Analysis': 'アナライズ',
        'Arm Shot': '腕を狙う',
        'Compress': '圧縮する',
        'Energy Burst': 'エネルギーバースト',
        'Left Handgonne': '左舷掃射',
        'Maintenance': 'メンテナンス',
        'Right Handgonne': '右舷掃射',
        'Searchlight': 'サーチライト',
        'Cleansing Flame': '聖光焼却撃',
        'Cleansing Strike': '乱命割殺打',
        'Consecration': '聖域束縛式',
        'Divine Light': '幻光波',
        'Hallowed Bolt': '無双稲妻突き',
        'Heavenly Judgment': 'ヘヴンリージャッジメント',
        'Judgment Blade': '不動無明剣',
        'Mortal Blow': '強打',
        'Northswain\'s Strike': '北斗骨砕打',
        'Thunder Slash': '雷鳴剣',
        'Crush Accessory': '咬撃氷狼破',
        'Colosseum': '剣闘技場',
        'Crush Armor': '強甲破点突き',
        'Crush Helm': '星天爆撃打',
        'Crush Weapon': '冥界恐叫打',
        'Divine Ruination': '聖光爆裂破',
        'Duskblade': '暗の剣',
        'Hallowed Bolt': '無双稲妻突き',
        'Judgment Blade': '不動無明剣',
        'Northswain\'s Strike': '北斗骨砕打',
        'Shadowblade': '闇の剣',
        'T.G. Holy Sword': '雷神式聖剣技',
        'Auralight': '聖石光',
        'Control Tower': '統制の塔',
        'Dark Cannonade': '闇の砲撃',
        'Dark Ewer': '暗雲の水瓶',
        'Demi-Aquarius': 'デミ・アクエリアス',
        'Demi-Aries': 'デミ・アリエス',
        'Demi-Leo': 'デミ・レオ',
        'Demi-Virgo': 'デミ・ヴァルゴ',
        'Eastward March': 'イーストワード・マーチ',
        'Embrace': '抱締',
        'Eruption': 'エラプション',
        'Extreme Edge': 'ブーストエッジ',
        'Flare IV': 'フレアジャ',
        'Grand Cross': 'グランドクロス',
        'Holy IV': 'ホーリジャ',
        'Hammerfall': 'ハンマークラッシュ',
        'Life Drain': '生命吸収',
        'Penultima': 'プチアルテマ',
        'Plummet': '落下',
        'Materialize': '幻出',
        'Plummet': '落下',
        'Prevailing Current': '激流',
        'Sanction': '制裁の刃',
        'Time Eruption': 'タイムエラプション',
        'Towerfall': '倒壊',
        'Ultimate Illusion': '究極幻想',
        'attack': '攻撃',

        // FIXME
        'Devitalize': 'Devitalize',
        'L/R Handgonne': 'L/R Donnerbüchse',
        'Last Testament': 'Last Testament',
        'Dark Rite': 'Dark Rite',
        'Noahionto': 'Noahionto',
        'Infernal Wave': 'Infernal Wave',
        'Sword L/R': 'Sword L/R',
        'Sword In/Out': 'Sword In/Out',
        'Sword Out/In': 'Sword Out/In',
        'Stack': 'Stack',
        'Balance Asunder': 'Balance Asunder',
        'Sword Three In A Row': 'Sword Three In A Row',

        'Earth Hammer': 'Earth Hammer',
        'East/West March': 'East/West March',
        'Ray Of Light': 'Ray Of Light',
        'Demi-Virgo Line': 'Demi-Virgo Line',
        'Demi-Virgo Feet': 'Demi-Virgo Feet',
        'Demi-Virgo Tether': 'Demi-Virgo Tether',
        'Demi-Virgo Line/Tether': 'Demi-Virgo Line/Tether',
        'Demi-Virgo Tether/Feet': 'Demi-Virgo Tether/Feet',
        'ghost stun': 'ghost stun',
        'crystal stun': 'crystal stun',
      },
      '~effectNames': {
        'Down For The Count': 'ノックダウン',
        'Paralysis': '麻痺',
        'Damage Up': 'ダメージ上昇',
        'Doom': '死の宣告',
        'Fetters': '拘束',
        'Invincibility': '無敵',
        'Shieldbearer': '聖盾所持',
        'Stun': 'スタン',
        'Swordbearer': '聖剣所持',
        'Bleeding': 'ペイン',
        'Electrocution': '感電',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Guardians\' Aegis': '守護結界',
        'Bind': 'バインド',
        'Clashing': '鍔迫り合い',
        'Fearless': '勇気',
        'Out Of The Action': 'アクション実行不可',

        // FIXME
        'Acceleration Bomb': 'Acceleration Bomb',
      },
    },
  ],
}];

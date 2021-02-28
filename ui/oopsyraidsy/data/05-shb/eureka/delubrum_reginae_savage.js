import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.DelubrumReginaeSavage,
  damageWarn: {
    'DelubrumSav Seeker Mercy Fourfold': '5B94', // Four glowing sword half room cleaves
    // 5AB9 5ABA 5ABB 5ABC these are also Mercy Fourfold??
    'DelubrumSav Seeker Baleful Swathe': '5AD1', // Ground aoe to either side of boss
    'DelubrumSav Seeker Baleful Blade': '5B2A', // Hide behind pillars attack
    'DelubrumSav Seeker Scorching Shackle': '5ACB', // Chains

    'DelubrumSav Lord Whack': '57D0', // cleave
    'DelubrumSav Lord Devastating Bolt 1': '57C5', // lightning rings
    'DelubrumSav Lord Devastating Bolt 2': '57C6', // lightning rings
  },
  damageFail: {

  },
  shareFail: {

  },
  gainsEffectWarn: {

  },
  triggers: [
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Right-Sided Shockwave/Left-Sided Shockwave': 'Right/Left Shockwave',
        'Left-Sided Shockwave/Right-Sided Shockwave': 'Left/Right Shockwave',
        'Sword Omen/Shield Omen': 'Sword/Shield Omen',
        'Shield Omen/Sword Omen': 'Shield/Sword Omen',
        'Flashvane/Fury Of Bozja/Infernal Slash': 'Random Arsenal',
        'Icy Portent/Fiery Portent': 'Icy/Fiery Portent',
        'Fiery Portent/Icy Portent': 'Fiery/Icy Portent',
      },
    },
  ],
};

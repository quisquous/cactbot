'use strict';

// FIXME: behave like raidboss here and allow for disabling mistakes by id.
UserConfig.registerOptions('oopsyraidsy', {
  options: [
    {
      id: 'Debug',
      name: {
        en: 'Enable debug mode',
      },
      type: 'checkbox',
      debugOnly: true,
    },
    {
      id: 'NumLiveListItemsInCombat',
      name: {
        en: 'Number of mistakes to show in combat',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'MinimumTimeForPullMistake',
      name: {
        en: 'Minimum time to show early pull (seconds)',
      },
      type: 'float',
      default: 0.4,
    },
  ],
});

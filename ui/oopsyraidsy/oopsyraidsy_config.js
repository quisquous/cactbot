'use strict';

// FIXME: behave like raidboss here and allow for disabling mistakes by id.
UserConfig.registerOptions('oopsyraidsy', {
  options: [
    {
      id: 'Debug',
      name: {
        en: 'Enable debug mode',
        fr: 'Activer le mode debug',
        cn: '启用调试模式',
        ko: '디버그 모드 활성화',
      },
      type: 'checkbox',
      debugOnly: true,
    },
    {
      id: 'NumLiveListItemsInCombat',
      name: {
        en: 'Number of mistakes to show in combat',
        fr: 'Nombre de fautes à afficher en combat',
        cn: '战斗中显示的错误数量',
        ko: '전투 중 표시할 실수들의 개수',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'MinimumTimeForPullMistake',
      name: {
        en: 'Minimum time to show early pull (seconds)',
        fr: 'Durée minimale pour afficher l\'early pull (secondes)',
        cn: '显示提前开怪最小时间（秒）',
        ko: '풀링이 빠르다고 표시 할 최소 시간 (초)',
      },
      type: 'float',
      default: 0.4,
    },
  ],
});

'use strict';

// FIXME: behave like raidboss here and allow for disabling mistakes by id.
UserConfig.registerOptions('oopsyraidsy', {
  options: [
    {
      id: 'Debug',
      name: {
        en: 'Enable debug mode',
        de: 'Aktiviere Debugmodus',
        fr: 'Activer le mode debug',
        ja: 'デバッグモードを有効にする',
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
        de: 'Anzahl der Fehler, die während des Kampfes angezeigt werden',
        fr: 'Nombre de fautes à afficher en combat',
        ja: '戦闘中に表示するミスをした回数',
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
        de: 'Minimum Zeit in der Early-Pulls angezeigt werden (in Sekunden)',
        fr: 'Durée minimale pour afficher l\'early pull (secondes)',
        ja: 'タゲ取るのが早かったら、ミスとして表示する、カウントダウンとの最短時間 (秒)',
        cn: '显示提前开怪最小时间 (秒)',
        ko: '풀링이 빠르다고 표시 할 최소 시간 (초)',
      },
      type: 'float',
      default: 0.4,
    },
  ],
});

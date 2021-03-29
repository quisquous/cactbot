import UserConfig from '../../resources/user_config';
import oopsyFileData from './data/manifest.txt';
import CactbotConfigurator from '../config/config';
import { Matches } from '../../types/trigger';
import { Data } from '../../types/data';

const oopsyHelpers = [
  'damageWarn',
  'damageFail',
  'shareWarn',
  'shareFail',
  'gainsEffectWarn',
  'gainsEffectFail',
] as const;


type _K = typeof oopsyHelpers[number]

type OopsyTriggerSet = {
  [key in _K]: Record<string, string> | undefined;
} & {
  // damageFail: Record<string, string>;
  // damageWarn: Record<string, string>;
  // gainsEffectFail: Record<string, string>;
  // shareFail: Record<string, string>;
  // shareWarn: Record<string, string>;
  triggers: OopsyTrigger[];
  zoneId: number;
};

interface OopsyEvent {
  damage: number;
  type: string;
  targetName: string;
  abilityName: string;
}

interface OopsyTrigger {
  id: string;
  mistake: (e: OopsyEvent, data: Data, matches: Matches<RegExp>) => { type: 'warn' | 'fail'; blame: string; text: string };
}


// This could be a checkbox, but it's possible we could add more things here,
// like changing fail->warning or who knows what.
const kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défauts',
      ja: '✔ 初期設定',
      cn: '✔ 默认设置',
      ko: '✔ 기본',
    },
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      ja: '❌ 無効',
      cn: '❌ 禁用',
      ko: '❌ 비활성화',
    },
  },
};

class OopsyConfigurator {
  private base: CactbotConfigurator;
  private optionKey: 'oopsyraidsy';

  constructor(cactbotConfigurator: CactbotConfigurator) {
    this.base = cactbotConfigurator;
    this.optionKey = 'oopsyraidsy';
  }

  buildUI(container: HTMLElement, files: Record<string, OopsyTriggerSet>) {
    const fileMap = this.processOopsyFiles(files);

    const expansionDivs: Record<string, HTMLDivElement> = {};

    for (const info of Object.values(fileMap)) {
      const expansion = info.prefix;

      if (info.triggers.length === 0)
        continue;

      if (!expansionDivs[expansion]) {
        const expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);

        const expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');
        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };
        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);

        expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion]?.appendChild(triggerContainer);

      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');
      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, expansion];
      parts.forEach((item) => {
        if (!(item))
          return;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = (item);
        headerDiv.appendChild(partDiv);
      });

      triggerContainer.appendChild(headerDiv);

      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const trigger of info.triggers) {
        // Build the trigger label.
        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trigger.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv);

        // Container for the right side ui (select boxes, all of the info).
        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);

        triggerDetails.appendChild(this.buildTriggerOptions(trigger.id, triggerDiv));
      }
    }
  }

  buildTriggerOptions(id: string, labelDiv: HTMLDivElement) {
    const kField = 'Output';
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = (input: HTMLSelectElement) => {
      if (input.value === 'hidden' || input.value === 'disabled')
        labelDiv.classList.add('disabled');
      else
        labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);

    const selectValue = this.base.getOption(this.optionKey, 'triggers', id, kField, 'default') as string;

    for (const [key, triggerOptions] of Object.entries(kTriggerOptions)) {
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(triggerOptions.label) as string;
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);

      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default'))
          value = 'default';
        this.base.setOption(this.optionKey, 'triggers', id, kField, input.value);
      };
    }

    return div;
  }

  processOopsyFiles(files: Record<string, OopsyTriggerSet>) {
    const map = this.base.processFiles(files) as Record<string, {
      triggerSet: OopsyTriggerSet;
      prefix: string;
      title: string;
      type: string;
      triggers: { id: string }[];
    }>;

    for (const item of Object.values(map)) {
      item.triggers = [];
      const triggerSet = item.triggerSet;
      for (const prop of oopsyHelpers) {
        if (!triggerSet[prop])
          continue;
        console.log(triggerSet);

        for (const id of Object.keys(triggerSet[prop] ?? {}))
          item.triggers.push({ id: id });
      }

      if (!triggerSet.triggers)
        continue;

      for (const trigger of triggerSet.triggers) {
        if (!trigger.id)
          continue;
        // Skip triggers that just set data.
        if (!trigger.mistake)
          continue;
        item.triggers.push(trigger);
      }
    }
    return map;
  }
}


UserConfig.registerOptions('oopsyraidsy', {
  buildExtraUI: (base, container) => {
    const builder = new OopsyConfigurator(base);
    builder.buildUI(container, oopsyFileData);
  },
  processExtraOptions: (options, savedConfig) => {
    options['PerTriggerAutoConfig'] = options['PerTriggerAutoConfig'] || {};
    const triggers = savedConfig.triggers;
    if (!triggers)
      return;

    for (const [id, trigger] of Object.entries(triggers)) {
      const output = trigger['Output'];
      if (!output)
        continue;

      options['PerTriggerAutoConfig'][id] = {
        enabled: output !== 'disabled',
      };
    }
  },
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

import { UnreachableCode } from '../../resources/not_reached';
import UserConfig, { OptionsTemplate, UserFileCallback } from '../../resources/user_config';
import { BaseOptions } from '../../types/data';
import { LooseOopsyTriggerSet, OopsyFileData } from '../../types/oopsy';
import {
  CactbotConfigurator,
  ConfigLooseOopsyTriggerSet,
  ConfigProcessedFile,
  ConfigProcessedFileMap,
} from '../config/config';

import { generateBuffTriggerIds } from './buff_map';
import oopsyFileData from './data/oopsy_manifest.txt';
import { OopsyOptions } from './oopsy_options';

const oopsyHelpers: (keyof LooseOopsyTriggerSet)[] = [
  'damageWarn',
  'damageFail',
  'shareWarn',
  'shareFail',
  'gainsEffectWarn',
  'gainsEffectFail',
];

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
  private readonly optionKey = 'oopsyraidsy';

  constructor(cactbotConfigurator: CactbotConfigurator) {
    this.base = cactbotConfigurator;
  }

  buildUI(container: HTMLElement, files: OopsyFileData) {
    const fileMap = this.processOopsyFiles(files);

    const expansionDivs: { [expansion: string]: HTMLElement } = {};

    for (const info of Object.values(fileMap)) {
      const expansion = info.prefix;

      if (!info.triggers || Object.keys(info.triggers).length === 0)
        continue;

      let expansionDiv = expansionDivs[expansion];
      if (!expansionDiv) {
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

        expansionDiv = expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDiv.appendChild(triggerContainer);

      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');
      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, expansion];
      for (const part of parts) {
        if (!part)
          continue;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = part;
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);

      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const id of Object.keys(info.triggers ?? {})) {
        // Build the trigger label.
        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv);

        // Container for the right side ui (select boxes, all of the info).
        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);

        triggerDetails.appendChild(this.buildTriggerOptions(id, triggerDiv));
      }
    }
  }

  buildTriggerOptions(id: string, labelDiv: HTMLElement): HTMLElement {
    const kField = 'Output';
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = (input: HTMLOptionElement | HTMLSelectElement) => {
      if (input.value === 'hidden' || input.value === 'disabled')
        labelDiv.classList.add('disabled');
      else
        labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);

    const selectValue = this.base.getOption(this.optionKey, ['triggers', id, kField], 'default');

    for (const [key, value] of Object.entries(kTriggerOptions)) {
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(value.label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);

      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default'))
          value = 'default';
        this.base.setOption(this.optionKey, ['triggers', id, kField], input.value);
      };
    }

    return div;
  }

  processOopsyFiles(files: OopsyFileData): ConfigProcessedFileMap<LooseOopsyTriggerSet> {
    const map = this.base.processFiles(files);

    // Hackily insert "missed buffs" into the list of triggers.
    const generalEntry = map['00-misc-general'];
    if (!generalEntry)
      throw new UnreachableCode();
    const fakeBuffs: ConfigProcessedFile<LooseOopsyTriggerSet> = {
      ...generalEntry,
      fileKey: '00-misc-buffs',
      filename: 'buff_map.ts',
      title: this.base.translate({
        en: 'Missed Buffs',
        de: 'Verfehlte Buffs',
        fr: 'Buffs manqués',
        ja: '欠けバフ',
        cn: '遗漏Buff',
        ko: '놓친 버프 알림',
      }),
      triggerSet: {
        triggers: generateBuffTriggerIds().map((id) => {
          return { id: id };
        }),
      },
    };
    map[fakeBuffs.fileKey] = fakeBuffs;

    for (const item of Object.values(map)) {
      item.triggers = {};
      const triggerSet = item.triggerSet;
      for (const prop of oopsyHelpers) {
        const obj = triggerSet[prop];
        if (obj === undefined || obj === null)
          continue;
        if (typeof obj === 'object') {
          for (const id in obj)
            item.triggers[id] = { id: id };
        }
      }

      if (!triggerSet.triggers)
        continue;

      for (const trigger of triggerSet.triggers) {
        if (!trigger.id)
          continue;
        // Skip triggers that just set data, but include triggers that are just ids.
        if (trigger.run && !trigger.mistake)
          continue;
        item.triggers[trigger.id] = trigger;
      }
    }
    return map;
  }
}

const templateOptions: OptionsTemplate = {
  buildExtraUI: (base, container) => {
    const builder = new OopsyConfigurator(base);
    builder.buildUI(container, oopsyFileData);
  },
  processExtraOptions: (baseOptions, savedConfig) => {
    // TODO: Rewrite user_config to be templated on option type so that this function knows
    // what type of options it is using.  Without this, perTriggerAutoConfig is unknown.
    const options = baseOptions as OopsyOptions;

    const perTriggerAutoConfig = options['PerTriggerAutoConfig'] ??= {};
    if (typeof savedConfig !== 'object' || Array.isArray(savedConfig))
      return;
    const triggers = savedConfig['triggers'];

    if (typeof triggers !== 'object' || Array.isArray(triggers))
      return;

    for (const [id, entry] of Object.entries(triggers)) {
      if (typeof entry !== 'object' || Array.isArray(entry))
        continue;
      const output = entry['Output'];
      if (output === undefined)
        continue;

      perTriggerAutoConfig[id] = {
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
      default: false,
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
    {
      id: 'TimeToShowDeathReportSeconds',
      name: {
        en: 'Seconds to show death report on death (0=none)',
        de: 'Sekunden um den Todesreport beim Tot anzuzeigen (0=niemals)',
        fr: 'Durée d’affichage (en secondes) du rapport de mort (0 = aucun)',
        ja: '倒れた時にデスレポートを表示 (0=非表示)',
        cn: '死亡时显示死亡报告的秒数 (0=不显示)',
        ko: '죽었을 때 사망 보고서를 보여주는 시간(초) (0=비활성화)',
      },
      type: 'float',
      default: 4,
      setterFunc: (options, value) => {
        let seconds;
        if (typeof value === 'string')
          seconds = parseFloat(value);
        else if (typeof value === 'number')
          seconds = value;
        else
          return;
        options['TimeToShowDeathReportMs'] = seconds * 1000;
      },
    },
    {
      id: 'DeathReportSide',
      name: {
        en: 'How to show the death report',
        de: 'Wie zeige ich den Todesreport an',
        fr: 'Où afficher le rapport de mort',
        ja: 'デスレポートの表示方法',
        cn: '死亡报告的显示方式',
        ko: '사망 보고서 표시 위치',
      },
      type: 'select',
      options: {
        en: {
          'Left Side': 'left',
          'Right Side': 'right',
          '❌ Disabled': 'disabled',
        },
        de: {
          'Left Side': 'links',
          'Right Side': 'rechts',
          '❌ Disabled': 'deaktiviert',
        },
        fr: {
          'Côté gauche': 'gauche',
          'Côté droit': 'droite',
          '❌ Disabled': 'désactivé',
        },
        ja: {
          '左側': 'left',
          '右側': 'right',
          '❌ 無効': 'disabled',
        },
        cn: {
          '左侧': 'left',
          '右侧': 'right',
          '❌ 禁用': 'disabled',
        },
        ko: {
          '왼쪽': 'left',
          '오른쪽': 'right',
          '❌ 비활성화': 'disabled',
        },
      },
      default: 'left',
    },
  ],
};

const userFileHandler: UserFileCallback = (
  name: string,
  _files: { [filename: string]: string },
  baseOptions: BaseOptions & Partial<OopsyOptions>,
  basePath: string,
) => {
  // TODO: Rewrite user_config to be templated on option type so that this function knows
  // what type of options it is using.
  if (!baseOptions.Triggers)
    return;

  for (const baseTriggerSet of baseOptions.Triggers) {
    const set: ConfigLooseOopsyTriggerSet = baseTriggerSet;

    // Annotate triggers with where they came from.  Note, options is passed in repeatedly
    // as multiple sets of user files add triggers, so only process each file once.
    if (set.isUserTriggerSet)
      continue;

    // `filename` here is just cosmetic for better debug printing to make it more clear
    // where a trigger or an override is coming from.
    set.filename = `${basePath}${name}`;
    set.isUserTriggerSet = true;
  }
};

UserConfig.registerOptions('oopsyraidsy', templateOptions, userFileHandler);

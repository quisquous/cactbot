'use strict';

const oopsyHelpers = [
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
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator;
    this.lang = this.base.lang;
    this.optionKey = 'oopsyraidsy';
  }

  buildUI(container, files) {
    const fileMap = this.processOopsyFiles(files);

    let expansionDivs = {};

    for (const [key, info] of Object.entries(fileMap)) {
      const expansion = info.prefix;

      if (info.triggers.length === 0)
        continue;

      if (!expansionDivs[expansion]) {
        let expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);

        let expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');
        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };
        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);

        expansionDivs[expansion] = expansionContainer;
      }

      let triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion].appendChild(triggerContainer);

      let headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');
      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      let parts = [info.title, info.type, expansion];
      for (let i = 0; i < parts.length; ++i) {
        if (!parts[i])
          continue;
        let partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = parts[i];
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);

      let triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const trigger of info.triggers) {
        // Build the trigger label.
        let triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trigger.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv);

        // Container for the right side ui (select boxes, all of the info).
        let triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);

        triggerDetails.appendChild(this.buildTriggerOptions(trigger.id, triggerDiv));
      }
    }
  }

  buildTriggerOptions(id, labelDiv) {
    let kField = 'Output';
    let div = document.createElement('div');
    div.classList.add('trigger-options');

    let updateLabel = (input) => {
      if (input.value === 'hidden' || input.value === 'disabled')
        labelDiv.classList.add('disabled');
      else
        labelDiv.classList.remove('disabled');
    };

    let input = document.createElement('select');
    div.appendChild(input);

    let selectValue = this.base.getOption(this.optionKey, 'triggers', id, kField, 'default');

    for (const key in kTriggerOptions) {
      let elem = document.createElement('option');
      elem.innerHTML = this.base.translate(kTriggerOptions[key].label);
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

  processOopsyFiles(files) {
    let map = this.base.processFiles(files);

    for (let [key, item] of Object.entries(map)) {
      item.triggers = [];
      for (const triggerSet of item.json) {
        for (const prop of oopsyHelpers) {
          if (!triggerSet[prop])
            continue;
          for (const id in triggerSet[prop])
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
    }
    return map;
  }
}

UserConfig.registerOptions('oopsyraidsy', {
  buildExtraUI: (base, container) => {
    let oopsyUrl = new URL('../oopsyraidsy/oopsyraidsy.html', location.href);
    callOverlayHandler({
      call: 'cactbotReadDataFiles',
      source: oopsyUrl,
    }).then((e) => {
      let files = e.detail.files;

      let builder = new OopsyConfigurator(base);
      builder.buildUI(container, files);
    });
  },
  processExtraOptions: (options, savedConfig) => {
    options['PerTriggerAutoConfig'] = options['PerTriggerAutoConfig'] || {};
    let triggers = savedConfig.triggers;
    if (!triggers)
      return;

    for (const id in triggers) {
      let output = triggers[id]['Output'];
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

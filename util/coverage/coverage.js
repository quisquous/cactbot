import contentList from '../../resources/content_list';
import { coverage, coverageTotals } from './coverage_report';
import ZoneInfo from '../../resources/zone_info';
import ContentType from '../../resources/content_type';

import './coverage.css';

// TODO: these tables are pretty wide, add some sort of alternating highlight?
// TODO: make it possible to click on a zone row and highlight/link to it.

// TODO: borrowed from ui/config/config.js
// Probably this should live somewhere else.
const exVersionToName = {
  '0': {
    en: 'A Realm Reborn (ARR 2.x)',
    de: 'A Realm Reborn (ARR 2.x)',
    fr: 'A Realm Reborn (ARR 2.x)',
    ja: '新生エオルゼア (2.x)',
    cn: '重生之境 (2.x)',
    ko: '신생 에오르제아 (2.x)',
  },
  '1': {
    en: 'Heavensward (HW 3.x)',
    de: 'Heavensward (HW 3.x)',
    fr: 'Heavensward (HW 3.x)',
    ja: '蒼天のイシュガルド (3.x)',
    cn: '苍穹之禁城 (3.x)',
    ko: '창천의 이슈가르드 (3.x)',
  },
  '2': {
    en: 'Stormblood (SB 4.x)',
    de: 'Stormblood (SB 4.x)',
    fr: 'Stormblood (SB 4.x)',
    ja: '紅蓮のリベレーター (4.x)',
    cn: '红莲之狂潮 (4.x)',
    ko: '홍련의 해방자 (4.x)',
  },
  '3': {
    en: 'Shadowbringers (ShB 5.x)',
    de: 'Shadowbringers (ShB 5.x)',
    fr: 'Shadowbringers (ShB 5.x)',
    ja: '漆黒のヴィランズ (5.x)',
    cn: '暗影之逆焰 (5.x)',
    ko: '칠흑의 반역자 (5.x)',
  },
};

const exVersionToShortName = {
  '0': {
    en: 'ARR',
    de: 'ARR',
    fr: 'ARR',
    ja: '新生',
    cn: '2.X',
    ko: '신생',
  },
  '1': {
    en: 'HW',
    de: 'HW',
    fr: 'HW',
    ja: '蒼天',
    cn: '3.X',
    ko: '창천',
  },
  '2': {
    en: 'SB',
    de: 'SB',
    fr: 'SB',
    ja: '紅蓮',
    cn: '4.X',
    ko: '홍련',
  },
  '3': {
    en: 'ShB',
    de: 'ShB',
    fr: 'ShB',
    ja: '漆黒',
    cn: '5.X',
    ko: '칠흑',
  },
};

const contentTypeToLabel = {
  [ContentType.Raids]: {
    en: 'Raid',
    de: 'Raid',
    fr: 'Raid',
    ja: 'レイド',
    cn: '大型任务',
    ko: '레이드',
  },
  [ContentType.Trials]: {
    en: 'Trial',
    de: 'Prfng',
    fr: 'Défi',
    ja: '討伐戦',
    cn: '讨伐战',
    ko: '토벌전',
  },
  [ContentType.UltimateRaids]: {
    en: 'Ult',
    de: 'Ult',
    fr: 'Fatal',
    ja: '絶',
    cn: '绝境战',
    ko: '절',
  },
  [ContentType.Dungeons]: {
    en: 'Dgn',
    de: 'Dgn',
    fr: 'Djn',
    ja: 'ID',
    cn: '迷宫挑战',
    ko: '던전',
  },
  [ContentType.Guildhests]: {
    en: 'Hest',
    de: 'Gldgh',
    fr: 'Op. Guilde',
    ja: 'ギルド',
    cn: '行会令',
    ko: '길드작전',
  },
};

const contentTypeLabelOrder = [
  ContentType.UltimateRaids,
  ContentType.Raids,
  ContentType.Trials,
  ContentType.Dungeons,
  ContentType.Guildhests,
];

// This is also the order of the table columns.
const zoneGridHeaders = {
  expansion: {
    en: 'Ex',
    de: 'Ex',
    fr: 'Ext',
    ja: 'パッチ',
    cn: '资料片',
    ko: '확장팩',
  },
  type: {
    en: 'Type',
    de: 'Art',
    fr: 'Type',
    ja: 'タイプ',
    cn: '类型',
    ko: '분류',
  },
  name: {
    en: 'Name',
    de: 'Name',
    fr: 'Nom',
    ja: '名前',
    cn: '名称',
    ko: '이름',
  },
  triggers: {
    en: 'Triggers',
    de: 'Triggers',
    fr: 'Triggers',
    ja: 'トリガー',
    cn: '触发器',
    ko: '트리거',
  },
  timeline: {
    en: 'Timeline',
    de: 'Timeline',
    fr: 'Timeline',
    ja: 'タイムライン',
    cn: '时间轴',
    ko: '타임라인',
  },
  oopsy: {
    en: 'Oopsy',
    de: 'Oopsy',
    fr: 'Oopsy',
    ja: 'Oopsy',
    cn: '犯错监控',
    ko: 'Oopsy',
  },
  // TODO: missing translation items
};

const miscStrings = {
  // Title at the top of the page.
  title: {
    en: 'Cactbot Content Coverage',
    de: 'Cactbot Inhaltsabdeckung',
    fr: 'Contenus présents dans Cactbot',
    ja: 'Cactbot コンテンツ完成度',
    cn: 'Cactbot 内容覆盖率',
    ko: 'Cactbot 컨텐츠 커버리지',
  },
  // Overall label for the expansion table.
  overall: {
    en: 'Overall',
    de: 'Insgesamt',
    fr: 'Total',
    ja: '概要',
    cn: '总览',
    ko: '전체',
  },
  // Oopsy label for the expansion table.
  oopsy: {
    ...zoneGridHeaders.oopsy,
  },
  // Description about release and latest version differences.
  description: {
    en: 'This list may contain content that is in development and is not yet included in the latest cactbot release. Anything that is listed as covered here will be included in the next release of cactbot.  If you are using the <a href="https://github.com/quisquous/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">quisquous.github.io version</a> as the url for your overlays, this list will be up to date.',
    ja: 'このリストは開発中機能や最新リリースバージョンに公開されていないコンテンツを含まれています。リストに含まれているコンテンツは次バージョンに公開される予定があります。また、OverlayPluginのURL欄に<a href="https://github.com/quisquous/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">「quisquous.github.io」のページのURL</a>を入力している場合はこのリストに含まれているコンテンツと一致し、すべてのコンテンツを使えるになります。',
    cn: '该列表中可能存在正在开发中的功能及未发布在cactbot最新发行版中的更新内容。该列表中显示的更新将会在下一个版本的cactbot发行版中发布。若您在OverlayPlugin中使用的是<a href="https://github.com/quisquous/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">「quisquous.github.io」开头的URL</a>，则更新进度与该列表一致，即该列表中的所有内容均可用。',
    ko: '이 목록에는 아직 개발 중인 컨텐츠가 포함되어 있을 수 있고 최신 cactbot 릴리즈에 포함되어 있지 않을 수 있습니다. 여기에 나열된 컨텐츠 목록은 최소한 다음 릴리즈에는 포함되게 됩니다. 만약 <a href="https://github.com/quisquous/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">quisquous.github.io 버전</a>을 오버레이 url로 연결해서 사용하고 계시다면, 이 목록이 오버레이의 컨텐츠 커버리지와 일치합니다.',
  },
  // Warning when generator hasn't been run.
  runGenerator: {
    en: 'Error: Run npm run coverage-report to generate data.',
    de: 'Error: Führe npm run coverage-report aus um die Daten zu generieren.',
    fr: 'Erreur : Lancez npm run coverage-report pour générer des données.',
    ja: 'エラー：npm run coverage-report を実行し、データを生成しよう。',
    cn: '错误：请先运行 npm run coverage-report 以生成数据。',
    ko: '에러: 데이터를 생성하려면 node npm run coverage-report를 실행하세요.',
  },
};

const translate = (obj, lang) => obj[lang] || obj['en'];

const addDiv = (container, cls, text) => {
  const div = document.createElement('div');
  div.classList.add(cls);
  if (text)
    div.innerHTML = text;
  container.appendChild(div);
};

const buildExpansionGrid = (container, lang, totals) => {
  // Labels.
  addDiv(container, 'label');
  addDiv(container, 'label', translate(miscStrings.overall, lang));
  for (const contentType of contentTypeLabelOrder) {
    const text = translate(contentTypeToLabel[contentType], lang);
    addDiv(container, 'label', text);
  }
  addDiv(container, 'label', translate(miscStrings.oopsy, lang));

  // By expansion.
  for (const exVersion in exVersionToName) {
    const expansionName = translate(exVersionToName[exVersion], lang);
    addDiv(container, 'header', expansionName);

    const versionInfo = totals.byExpansion[exVersion];
    const overall = versionInfo.overall;
    addDiv(container, 'data', `${overall.raidboss} / ${overall.total}`);

    for (const contentType of contentTypeLabelOrder) {
      const accum = versionInfo.byContentType[contentType];
      const text = accum.total ? `${accum.raidboss} / ${accum.total}` : undefined;
      addDiv(container, 'data', text);
    }

    addDiv(container, 'data', `${overall.oopsy} / ${overall.total}`);
  }

  // Totals.
  addDiv(container, 'label');
  addDiv(container, 'data', `${totals.overall.raidboss} / ${totals.overall.total}`);
  for (const contentType of contentTypeLabelOrder) {
    const accum = totals.byContentType[contentType];
    const text = accum.total ? `${accum.raidboss} / ${accum.total}` : undefined;
    addDiv(container, 'data', text);
  }
  addDiv(container, 'data', `${totals.overall.oopsy} / ${totals.overall.total}`);
};

const buildZoneGrid = (container, lang, coverage) => {
  for (const key in zoneGridHeaders)
    addDiv(container, 'label', translate(zoneGridHeaders[key], lang));

  // By expansion, then content list.
  for (const exVersion in exVersionToName) {
    for (const zoneId of contentList) {
      const zone = ZoneInfo[zoneId];
      if (!zone)
        continue;
      if (zone.exVersion.toString() !== exVersion)
        continue;

      const zoneCoverage = coverage[zoneId] ? coverage[zoneId] : {
        oopsy: {},
        triggers: {},
        timeline: {},
      };

      // Build in order of zone grid headers, so the headers can be rearranged
      // and the data will follow.
      const headerFuncs = {
        expansion: () => {
          addDiv(container, 'text', translate(exVersionToShortName[zone.exVersion], lang));
        },
        type: () => {
          addDiv(container, 'text', translate(contentTypeToLabel[zone.contentType], lang));
        },
        name: () => {
          let name = translate(zone.name, lang);
          name = name.replace('<Emphasis>', '<i>');
          name = name.replace('</Emphasis>', '</i>');
          addDiv(container, 'text', name);
        },
        triggers: () => {
          const emoji = zoneCoverage.triggers && zoneCoverage.triggers.num > 0 ? '✔️' : undefined;
          addDiv(container, 'emoji', emoji);
        },
        timeline: () => {
          let emoji = undefined;
          if (zoneCoverage.timeline) {
            if (zoneCoverage.timeline.timelineNeedsFixing)
              emoji = '⚠️';
            else if (zoneCoverage.timeline.hasFile)
              emoji = '✔️';
          }

          addDiv(container, 'emoji', emoji);
        },
        oopsy: () => {
          const emoji = zoneCoverage.oopsy && zoneCoverage.oopsy.num > 0 ? '✔️' : undefined;
          addDiv(container, 'emoji', emoji);
        },
      };

      for (const key in zoneGridHeaders)
        headerFuncs[key]();
    }
  }
};

const buildLanguageSelect = (container, lang) => {
  const langMap = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    ja: '日本語',
    cn: '中文',
    ko: '한국어',
  };
  for (const key in langMap) {
    let html = '';
    if (lang === key)
      html = `[${langMap[key]}]`;
    else
      html = `[<a href="?lang=${key}">${langMap[key]}</a>]`;

    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Allow for `coverage.html?lang=de` style constructions.
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') ? params.get('lang') : 'en';
  document.body.classList.add(`lang-${lang}`);

  const title = document.getElementById('title');
  title.innerText = translate(miscStrings.title, lang);

  const languageSelect = document.getElementById('language-select');
  buildLanguageSelect(languageSelect, lang);

  const description = document.getElementById('description-text');
  description.innerHTML = translate(miscStrings.description, lang);

  if (Object.keys(coverageTotals).length === 0) {
    const warning = document.getElementById('warning');
    warning.innerText = translate(miscStrings.runGenerator, lang);
    return;
  }

  const expansionGrid = document.getElementById('expansion-grid');
  buildExpansionGrid(expansionGrid, lang, coverageTotals);

  const zoneGrid = document.getElementById('zone-grid');
  buildZoneGrid(zoneGrid, lang, coverage);
});

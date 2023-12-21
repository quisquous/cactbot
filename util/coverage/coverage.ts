import contentList from '../../resources/content_list';
import ContentType from '../../resources/content_type';
import { isLang, Lang, langMap, langToLocale, languages } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import ZoneInfo from '../../resources/zone_info';
import { LocaleObject, LocaleText } from '../../types/trigger';

import {
  Coverage,
  CoverageEntry,
  CoverageTotalEntry,
  CoverageTotals,
  TranslationTotals,
} from './coverage.d';
import { coverage, coverageTotals, translationTotals } from './coverage_report';

import './coverage.css';

const emptyTotal: CoverageTotalEntry = {
  raidboss: 0,
  oopsy: 0,
  total: 0,
};

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
  '4': {
    en: 'Endwalker (EW 6.x)',
    de: 'Endwalker (EW 6.x)',
    fr: 'Endwalker (EW 6.x)',
    ja: '暁月のフィナーレ (6.x)',
    cn: '晓月之终途 (6.x)',
    ko: '효월의 종언 (6.x)',
  },
} as const;

const exVersionToShortName: { [exVersion: string]: LocaleText } = {
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
  '4': {
    en: 'EW',
    de: 'EW',
    fr: 'EW',
    ja: '暁月',
    cn: '6.X',
    ko: '효월',
  },
};

const contentTypeToLabel: { [contentType: number]: LocaleText } = {
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
  [ContentType.VCDungeonFinder]: {
    en: 'V&C',
    de: 'Gewölbesuche',
    fr: 'Donjon V&C',
    ja: 'ヴァリアント&アナザーダンジョン',
    cn: '多变&异闻迷宫',
    ko: '변형&파생던전',
  },
} as const;

const contentTypeLabelOrder = [
  ContentType.UltimateRaids,
  ContentType.Raids,
  ContentType.Trials,
  ContentType.Dungeons,
] as const;

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
  translated: {
    en: 'Translated',
    de: 'Übersetzt',
    fr: 'Traduit',
    ja: '翻訳済',
    cn: '已翻译',
    ko: '번역됨',
  },
} as const;

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
    en:
      'This list may contain content that is in development and is not yet included in the latest cactbot release. Anything that is listed as covered here will be included in the next release of cactbot.  If you are using the <a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">overlayplugin.github.io version</a> as the url for your overlays, this list will be up to date.',
    de:
      'Diese Liste kann Inhalte enthalten, welche momentan in Entwicklung sind uns sich noch nicht im aktuellstem Cactbot Release befinden. Alles was hier aufgelistet ist, wird sich im nächsten Release von Cactbot befinden. Wenn du <a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">overlayplugin.github.io version</a> als URL für dein Overlay benutzt, sind die Inhalte in dieser Liste bereits für dich verfügbar.',
    fr:
      'Cette liste peut contenir du contenu en cours de développement et qui n\'est pas encore inclus dans la dernière version de cactbot. Tout ce qui est répertorié comme couvert ici, sera inclus dans la prochaine version de cactbot. Si vous utilisez la <a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">version overlayplugin.github.io</a > comme url pour vos overlays, cette liste sera à jour.',
    ja:
      'このリストは開発中機能や最新リリースバージョンに公開されていないコンテンツを含まれています。リストに含まれているコンテンツは次バージョンに公開される予定があります。また、OverlayPluginのURL欄に<a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">「overlayplugin.github.io」のページのURL</a>を入力している場合はこのリストに含まれているコンテンツと一致し、すべてのコンテンツを使えるようになります。',
    cn:
      '该列表中可能存在正在开发中的功能及未发布在cactbot最新发行版中的更新内容。该列表中显示的更新将会在下一个版本的cactbot发行版中发布。若您在OverlayPlugin中使用的是<a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">「overlayplugin.github.io」开头的URL</a>，则更新进度与该列表一致，即该列表中的所有内容均可用。',
    ko:
      '이 목록에는 아직 개발 중인 컨텐츠가 포함되어 있을 수 있고 최신 cactbot 릴리즈에 포함되어 있지 않을 수 있습니다. 여기에 나열된 컨텐츠 목록은 최소한 다음 릴리즈에는 포함되게 됩니다. 만약 <a href="https://github.com/OverlayPlugin/cactbot/blob/main/CONTRIBUTING.md#validating-changes-via-remote-urls">overlayplugin.github.io 버전</a>을 오버레이 url로 연결해서 사용하고 계시다면, 이 목록이 오버레이의 컨텐츠 커버리지와 일치합니다.',
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
} as const;

const translationGridHeaders = {
  language: {
    en: 'Translations',
    de: 'Übersetzungen',
    fr: 'Traductions',
    ja: '翻訳',
    cn: '翻译',
    ko: '번역',
  },
  coverage: {
    en: 'Coverage',
    de: 'Abdeckung',
    fr: 'Couvert',
    ja: '適用範囲',
    cn: '覆盖率',
    ko: '커버리지',
  },
  errors: {
    en: 'Errors',
    de: 'Fehler',
    fr: 'Erreurs',
    ja: 'エラー',
    cn: '错误',
    ko: '오류',
  },
  missingFiles: {
    en: 'Missing',
    de: 'Fehlend',
    ja: '欠落',
    cn: '缺失',
    ko: '누락됨',
  },
  url: {
    en: 'Link to Missing Translation List',
    de: 'Link zur Liste mit den fehlenden Übersetzungen',
    fr: 'Lien vers la liste des traductions manquantes',
    ja: '欠落している翻訳のリストへのリンク',
    cn: '缺失翻译表链接',
    ko: '번역 누락 리스트 링크',
  },
} as const;

const translate = <T>(object: LocaleObject<T>, lang: Lang): T => {
  return object[lang] ?? object.en;
};

const addDiv = (container: HTMLElement, cls: string, text?: string) => {
  const div = document.createElement('div');
  div.classList.add(cls);
  if (text !== undefined)
    div.innerHTML = text;
  container.appendChild(div);
};

const buildExpansionGrid = (container: HTMLElement, lang: Lang, totals: CoverageTotals) => {
  // Labels.
  addDiv(container, 'label');
  addDiv(container, 'label', translate(miscStrings.overall, lang));
  for (const contentType of contentTypeLabelOrder) {
    const label = contentTypeToLabel[contentType];
    const text = label !== undefined ? translate(label, lang) : undefined;
    addDiv(container, 'label', text);
  }
  addDiv(container, 'label', translate(miscStrings.oopsy, lang));

  // By expansion.
  for (const [exVersion, name] of Object.entries(exVersionToName)) {
    const expansionName = translate(name, lang);
    addDiv(container, 'header', expansionName);

    const versionInfo = totals.byExpansion[exVersion];
    const overall = versionInfo?.overall ?? emptyTotal;
    addDiv(container, 'data', `${overall.raidboss} / ${overall.total}`);

    for (const contentType of contentTypeLabelOrder) {
      const accum: CoverageTotalEntry = versionInfo?.byContentType[contentType] ?? emptyTotal;
      const text = accum.total ? `${accum.raidboss} / ${accum.total}` : undefined;
      addDiv(container, 'data', text);
    }

    addDiv(container, 'data', `${overall.oopsy} / ${overall.total}`);
  }

  // Totals.
  addDiv(container, 'label');
  addDiv(container, 'data', `${totals.overall.raidboss} / ${totals.overall.total}`);
  for (const contentType of contentTypeLabelOrder) {
    const accum = totals.byContentType[contentType] ?? emptyTotal;
    const text = accum.total ? `${accum.raidboss} / ${accum.total}` : undefined;
    addDiv(container, 'data', text);
  }
  addDiv(container, 'data', `${totals.overall.oopsy} / ${totals.overall.total}`);
};

const buildTranslationGrid = (
  container: HTMLElement,
  thisLang: Lang,
  translationTotals: TranslationTotals,
) => {
  for (const header of Object.values(translationGridHeaders))
    addDiv(container, 'label', translate(header, thisLang));

  for (const lang of languages) {
    if (lang === 'en')
      continue;

    const url = `missing_translations_${lang}.html`;
    const aHref = `<a href="${url}">${url}</a>`;

    const langTotals = translationTotals[lang];

    addDiv(container, 'text', translate(langMap, thisLang)[lang]);
    addDiv(container, 'data', `${langTotals.translatedFiles} / ${langTotals.totalFiles}`);
    addDiv(container, 'data', `${langTotals.errors}`);
    addDiv(container, 'data', `${langTotals.missingFiles === 0 ? '' : langTotals.missingFiles}`);
    addDiv(container, 'text', aHref);
  }
};

const buildZoneGrid = (container: HTMLElement, lang: Lang, coverage: Coverage) => {
  for (const [key, header] of Object.entries(zoneGridHeaders)) {
    // English is already "translated" so we skip it.
    if (key === 'translated' && lang === 'en')
      addDiv(container, 'label', '');
    else
      addDiv(container, 'label', translate(header, lang));
  }

  // By expansion, then content list.
  for (const exVersion in exVersionToName) {
    for (const zoneId of contentList) {
      if (zoneId === null)
        continue;
      const zone = ZoneInfo[zoneId];
      if (!zone)
        continue;
      if (zone.exVersion.toString() !== exVersion)
        continue;

      const zoneCoverage: CoverageEntry = coverage[zoneId] ?? {
        oopsy: { num: 0 },
        triggers: { num: 0 },
        timeline: {},
      };

      // Build in order of zone grid headers, so the headers can be rearranged
      // and the data will follow.
      const headerFuncs: Record<keyof typeof zoneGridHeaders, () => void> = {
        expansion: () => {
          const shortName = exVersionToShortName[zone.exVersion.toString()];
          const text = shortName !== undefined ? translate(shortName, lang) : undefined;
          addDiv(container, 'text', text);
        },
        type: () => {
          const label = zone.contentType !== undefined
            ? contentTypeToLabel[zone.contentType]
            : undefined;
          const text = label !== undefined ? translate(label, lang) : undefined;
          addDiv(container, 'text', text);
        },
        name: () => {
          let name = translate(zone.name, lang);
          name = name.replace('<Emphasis>', '<i>');
          name = name.replace('</Emphasis>', '</i>');
          addDiv(container, 'text', name);
        },
        triggers: () => {
          const emoji = zoneCoverage.triggers.num > 0 ? '✔️' : undefined;
          addDiv(container, 'emoji', emoji);
        },
        timeline: () => {
          let emoji = undefined;
          if (zoneCoverage.timeline.hasNoTimeline)
            emoji = '➖';
          else if (zoneCoverage.timeline.timelineNeedsFixing)
            emoji = '⚠️';
          else if (zoneCoverage.timeline.hasFile)
            emoji = '✔️';

          addDiv(container, 'emoji', emoji);
        },
        oopsy: () => {
          const emoji = zoneCoverage.oopsy && zoneCoverage.oopsy.num > 0 ? '✔️' : undefined;
          addDiv(container, 'emoji', emoji);
        },
        translated: () => {
          let emoji = undefined;

          const translations = zoneCoverage.translations?.[lang];

          if (lang === 'en') {
            emoji = undefined;
          } else if (translations === undefined) {
            emoji = '✔️';
          } else {
            const isMissingSync = translations.sync !== undefined && translations.sync > 0;

            let totalMissing = 0;
            for (const value of Object.values(translations))
              totalMissing += value;

            // Missing a sync translation means that triggers or timelines won't work properly
            // and so count as "not being translated at all". If all syncs are translated but
            // there are missing timeline texts or output strings, that's a "partial" translation
            // given the warning sign.
            if (totalMissing === 0)
              emoji = '✔️';
            else if (!isMissingSync)
              emoji = '⚠️';
          }

          addDiv(container, 'emoji', emoji);
        },
      };

      for (const func of Object.values(headerFuncs))
        func();
    }
  }
};

const buildLanguageSelect = (container: HTMLElement, lang: Lang) => {
  const langMap = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    ja: '日本語',
    cn: '中文',
    ko: '한국어',
  };
  for (const [key, langStr] of Object.entries(langMap)) {
    let html = '';
    if (lang === key)
      html = `[${langStr}]`;
    else
      html = `[<a href="?lang=${key}">${langStr}</a>]`;

    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Allow for `coverage.html?lang=de` style constructions.
  const params = new URLSearchParams(window.location.search);
  const langStr = params.get('lang') ?? 'en';
  // TODO: left for now as backwards compatibility with user css.  Remove this later??
  document.body.classList.add(`lang-${langStr}`);
  const lang = langStr !== null && isLang(langStr) ? langStr : 'en';

  document.documentElement.lang = langToLocale(lang);

  const title = document.getElementById('title');
  if (!title)
    throw new UnreachableCode();
  title.innerText = translate(miscStrings.title, lang);

  const languageSelect = document.getElementById('language-select');
  if (!languageSelect)
    throw new UnreachableCode();
  buildLanguageSelect(languageSelect, lang);

  const description = document.getElementById('description-text');
  if (!description)
    throw new UnreachableCode();
  description.innerHTML = translate(miscStrings.description, lang);

  if (coverageTotals.overall.total === 0) {
    const warning = document.getElementById('warning');
    if (!warning)
      throw new UnreachableCode();
    warning.innerText = translate(miscStrings.runGenerator, lang);
    return;
  }

  const expansionGrid = document.getElementById('expansion-grid');
  if (!expansionGrid)
    throw new UnreachableCode();
  buildExpansionGrid(expansionGrid, lang, coverageTotals);

  const translationGrid = document.getElementById('translation-grid');
  if (!translationGrid)
    throw new UnreachableCode();
  buildTranslationGrid(translationGrid, lang, translationTotals);

  const zoneGrid = document.getElementById('zone-grid');
  if (!zoneGrid)
    throw new UnreachableCode();
  buildZoneGrid(zoneGrid, lang, coverage);
});

'use strict';

UserConfig.registerOptions('general', {
  options: [
    {
      id: 'CactbotUserDirectory',
      name: {
        en: 'Cactbot user directory',
        de: 'Cactbot Benutzerverzeichnis',
        fr: 'Répertoire utilisateur de Cactbot',
        ja: 'Cactbot ユーザーディレクトリ',
        cn: 'Cactbot user目录',
        ko: 'Cactbot 사용자 디렉터리',
      },
      type: 'directory',
      default: '',
    },
    {
      id: 'ShowDeveloperOptions',
      name: {
        en: 'Show developer options',
        de: 'Zeige Entwickleroptionen',
        fr: 'Afficher les options développeur',
        ja: '開発者向けオプション',
        cn: '显示开发者选项',
        ko: '개발자 옵션 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'ReloadOnFileChange',
      name: {
        en: 'Reload overlay on file change',
        de: 'Aktualisiere Overlay bei Dateiänderung',
        fr: 'Recharger l\'overlay après une modification de fichier',
        ja: 'ファイルが変更されたらオーバーレイを再読み込みます',
        cn: '文件更改时重新加载悬浮窗',
        ko: '파일 변경시 오버레이 새로고침',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'DisplayLanguage',
      name: {
        en: 'Display language',
        de: 'Displaysprache',
        fr: 'Langue d\'affichage',
        ja: '表示言語',
        cn: '显示语言',
        ko: '주 사용 언어',
      },
      type: 'select',
      options: {
        en: {
          'Use FFXIV Plugin Language': 'default',
          'English (en)': 'en',
          'Chinese (cn)': 'cn',
          'German (de)': 'de',
          'French (fr)': 'fr',
          'Japanese (ja)': 'ja',
          'Korean (ko)': 'ko',
        },
        de: {
          'Benutze FFXIV Plugin Sprache': 'default',
          'Englisch (en)': 'en',
          'Chinesisch (cn)': 'cn',
          'Deutsch (de)': 'de',
          'Französisch (fr)': 'fr',
          'Japanisch (ja)': 'ja',
          'Koreanisch (ko)': 'ko',
        },
        fr: {
          'Utiliser la langue du Plugin FFXIV': 'default',
          'Anglais (en)': 'en',
          'Chinois (cn)': 'cn',
          'Allemand (de)': 'de',
          'Français (fr)': 'fr',
          'Japonais (ja)': 'ja',
          'Coréen (ko)': 'ko',
        },
        ja: {
          'FFXIV Pluginの言語設定': 'default',
          '英語 (en)': 'en',
          '中国語 (cn)': 'cn',
          'ドイツ語 (de)': 'de',
          'フランス語 (fr)': 'fr',
          '日本語 (ja)': 'ja',
          '韓国語 (ko)': 'ko',
        },
        cn: {
          '使用最终幻想XIV解析插件设置的语言': 'default',
          '英语 (en)': 'en',
          '汉语 (cn)': 'cn',
          '德语 (de)': 'de',
          '法语 (fr)': 'fr',
          '日语 (ja)': 'ja',
          '朝鲜语 (ko)': 'ko',
        },
        ko: {
          'FFXIV Plugin 언어 사용': 'default',
          '영어 (en)': 'en',
          '중국어 (cn)': 'cn',
          '독일어 (de)': 'de',
          '프랑스어 (fr)': 'fr',
          '일본어 (ja)': 'ja',
          '한국어 (ko)': 'ko',
        },
      },
      default: 'default',
      debug: true,
      setterFunc: (options, value) => {
        if (value === 'default')
          return;
        options['DisplayLanguage'] = value;
      },
    },
  ],
});

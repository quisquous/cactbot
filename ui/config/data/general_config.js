'use strict';

UserConfig.registerOptions('general', {
  options: [
    {
      id: 'CactbotUserDirectory',
      name: {
        en: 'Cactbot user directory',
        de: 'Cactbot Benutzerverzeichnis',
        fr: 'Répertoire utilisateur Cacbot',
        cn: 'Cactbot user目录',
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
        cn: '显示开发者选项',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'ReloadOnFileChange',
      name: {
        en: 'Reload overlay on file change',
        de: 'Aktualisiere Overlay bei Dateiänderung',
        fr: 'Recharge l\'overlay si modification de fichier',
        cn: '文件更改时重新加载悬浮窗',
      },
      type: 'checkbox',
      default: false,
    },
  ],
});

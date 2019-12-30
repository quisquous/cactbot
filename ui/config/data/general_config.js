'use strict';

UserConfig.registerOptions('general', {
  options: [
    {
      id: 'CactbotUserDirectory',
      name: {
        en: 'Cactbot user directory',
        fr: 'Répertoire utilisateur Cacbot',
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
        fr: 'Afficher les options développeur',
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
        fr: 'Recharge l\'overlay si modification de fichier',
        cn: '文件更改时重新加载悬浮窗',
        ko: '파일 변경시 오버레이 새로고침',
      },
      type: 'checkbox',
      default: false,
    },
  ],
});

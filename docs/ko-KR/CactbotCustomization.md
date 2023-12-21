# Cactbot 사용자 설정

🌎 [[English](../CactbotCustomization.md)] [[简体中文](../zh-CN/CactbotCustomization.md)] [[繁體中文](./zh-TW/CactbotCustomization.md)] [**한국어**]

- [Cactbot UI를 사용하는 방법](#Cactbot-UI를-사용하는-방법)
- [User 디렉토리 개요](#User-디렉토리-개요)
- [cactbot UI로 트리거 문자열 수정하기](#cactbot-UI로-트리거-문자열-수정하기)
- [User 디렉토리 설정하기](#User-디렉토리-설정하기)
- [디자인 수정하기](#디자인-수정하기)
- [Raidboss 트리거 덮어쓰기](#Raidboss-트리거-덮어쓰기)
  - [예시 1: 출력 문자열 변경하기](#예시-1-출력-문자열-변경하기)
  - [예시 2: 도발 알림이 모든 직업에 뜨게 하기](#예시-2-도발-알림이-모든-직업에-뜨게-하기)
  - [예시 3: 커스텀 트리거 추가하기](#예시-3-커스텀-트리거-추가하기)
- [Raidboss 타임라인 덮어쓰기](#Raidboss-타임라인-덮어쓰기)
- [초보를 위한 무작정 따라하기](#초보를-위한-무작정-따라하기)
  - [Raidboss 트리거 수정하기](#Raidboss-트리거-수정하기)
  - [Raidboss 타임라인 수정하기](#Raidboss-타임라인-수정하기)
  - [간단한 메모 추가하는 법](#간단한-메모-추가하는-법)
- [기능 사용자 설정하기](#기능-사용자-설정하기)
- [User 파일 디버깅](#User-파일-디버깅)
  - [오버레이 플러그인 로그에 에러가 나오는지 확인하세요](#오버레이-플러그인-로그에-에러가-나오는지-확인하세요)
  - [User 파일이 로드되는지 확인하세요](#User-파일이-로드되는지-확인하세요)
  - [User 파일에 에러가 있는지 확인하세요](#User-파일에-에러가-있는지-확인하세요)

## cactbot UI를 사용하는 방법

cactbot을 사용자 설정하실 때 cactbot의 설정 UI를 이용하는 것을 권장합니다.
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot 에서 찾을 수 있습니다.

이 방법으로는 다음과 같은 설정이 가능합니다:

- 트리거에 TTS 설정하기
- 트리거 비활성화하기
- cactbot 언어 변경하기
- 볼륨 설정
- 음식을 먹으라는 치즈 아이콘 없애기

cactbot 설정 UI에서 원하는 모든 것들을 설정할 수는 없을지도 모르지만,
이 방법이 설정하기에 가장 쉬운 방법입니다.
또한, 업데이트를 진행함에 따라 더 많은 옵션이 추가될 것입니다.

이 옵션들은
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
파일에 저장됩니다.
저 파일을 직접 수정하지 않도록 하세요.

## cactbot UI로 트리거 문자열 수정하기

ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Raidboss에 있는
cactbot 설정 UI에는 개별적인 트리거 목록이 나열되어 있습니다.
이 목록 내용을 수정해서 트리거별로 다양한 설정을 수정할 수 있습니다.

이름 앞에 종 모양(🔔)이 있는 설정값은 트리거에서 출력하는 메시지이며, 이 설정란을 이용해 수정할 수 있습니다.
예를 들어, `"${player}" 탱버`라는 내용이 들어있는 🔔onTarget 입력란이 있다고 칩시다.
이것이 어떤 플레이어에게 탱크 버스터가 오고 있을 때 화면에(또는 TTS로) 출력할 문자열입니다.
그 중 `${player}`는 트리거에 의해 동적으로 설정되는 매개변수입니다.
`${변수명}` 같은 모습의 문자열은 그런 동적 매개변수입니다.

원래 출력 문자열 대신 `${player}가 죽으려고 해요!`를 출력하도록 바꿀 수 있겠죠.
아니면, 누가 맞을지 신경쓰지 않는다면, `탱버`로 짧게 수정할 수도 있습니다.
만약 덮어쓴 것을 되돌리고 싶다면, 그냥 입력한 텍스트를 비우면 됩니다.

이 덮어쓰기 기능에는 약간의 제한 사항이 있습니다.
트리거 작동 논리를 변경할 수는 없어요.
또, 대부분의 경우에 `alarmText`와 다른 `TTS`가 출력되도록 할 수 없어요.
매개변수를 새로 추가할 수도 없습니다.
만약 이런 식의 더 복잡한 수정을 하고 싶다면,
[Raidboss 트리거 덮어쓰기](#Raidboss-트리거-덮어쓰기) 문단을 확인하세요.

## User 디렉토리 개요

만약 cactbot UI가 원하는 옵션을 제공하지 않는다면,
User 파일 덮어쓰기(override)를 고려해야 합니다.
이 방법은 JavaScript와 CSS를 작성하는 것이기 때문에,
약간의 프로그래밍 지식이 필요할 수 있습니다.

cactbot은 "모든 사용자 설정은 User 디렉토리 파일에만 들어가야 한다"는 전제로 설계되어 있습니다.
때문에 cactbot이 업데이트될 때 사용자의 변경 사항이 덮어쓰이지 않게 됩니다.
또한, 추후 cactbot release 파일을 직접 수정하게되면 추가 빌드 작업을 하지 않고는 제대로 작동하지 않을것입니다.

모든 cactbot UI 모듈은 사용자 설정을 [user/](../../user/) 디렉토리에서 불러옵니다.
`raidboss` 모듈은 `user/raidboss.js`와 `user/raidboss.css`를 불러옵니다.
`oopsyraidsy`모듈은 `user/oopsyraidsy.js`와 `user/oopsyraidsy.css`를 불러옵니다.
다른 모듈들도 마찬가지입니다.
이 파일들은 cactbot의 기본 파일들과 함께 불러오며, 기본 설정들을 덮어씌울 수 있습니다.

`user/` 디렉토리는 이미 몇몇 예시 설정 파일들을 포함하고 있습니다.
이름을 바꿔서 사용할 수도 있고요.
예를 들어, [user/raidboss-example.js](../../user/raidboss-example.js) 파일은
`user/raidboss.js`로 이름 바꿀 수 있고
`raidboss` 모듈의 기능을 바꾸도록 수정할 수 있습니다.

이 파일들을 수정한 다음
ACT 오버레이 플러그인 설정 창에
해당하는 오버레이의 "새로고침" 버튼을 클릭하면
변경 사항이 적용됩니다.

## User 디렉토리 설정하기

cactbot user 경로는 cactbot 설정 UI에서 설정할 수 있습니다.
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Cactbot 사용자 디렉토리 에서
`디렉토리 선택` 버튼을 클릭하고 원하는 경로를 선택하세요.

따로 설정하지 않는다면,
cactbot이 설치된 경로가 기본값으로 설정됩니다.

가능하면 cactbot이 설치된 `cactbot/user`를 사용하는 것이 좋습니다.
보통은 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`
(해루봇을 사용한다면, `ACT 설치 경로\Plugins\cactbot\user`)입니다.

하지만 해루봇을 사용하신다면, cactbot 업데이트시 cactbot 폴더 내 내용이
전부 초기화되므로 외부에 다른 user 폴더를 만들고 그곳을 경로로 설정하기를 권장합니다.

[이 폴더](../../user)에는 예시 설정 파일들이 있습니다.

## 디자인 수정하기

`user/<name>.css` 파일은 각 오버레이 요소들의 위치, 크기, 색깔 등을 수정할 수 있습니다.
`ui/<name>/<name>.css`를 보고 수정할 수 있는 셀렉터(selector)를 확인하세요.

[ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css)의 예시를 보자면,
`#popup-text-container`와 `#timeline-container`를 확인할 수 있습니다.
이들의 위치를 `user/raidboss.css`에서 원하는 다른 위치로 바꿀 수 있습니다.
`user/raidboss.css`로 다른 추가적인 스타일링도 가능합니다.

`.info-text` 클래스에 CSS 규칙을 추가하여 Info 텍스트 알람의 크기와 색깔도 바꿀 수 있습니다.

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

User 디렉토리의 CSS는 cactbot의 기본 CSS 아래에 추가하는 것입니다.
따라서, [CSS 명시도 규칙](https://developer.mozilla.org/ko/docs/Web/CSS/Specificity)에 따라,
`!important`를 추가해서 설정한 규칙을 강제로 덮어쓰도록 할 수 있습니다.
또한, 기본 설정 값을 해제하려면 해당 값을 `auto`로 설정해야 합니다.

CSS 문제를 디버그하기 가장 좋은 방법은 [Chrome 개발자 도구](https://developers.google.com/web/tools/chrome-devtools)를 사용하는 것입니다.
ACT -> Plugins -> OverlayPlugin.dll -> 원하는 오버레이 -> 개발자 도구 열기 를 클릭해서 개발자 도구를 열 수 있습니다.

**참고**: 일부분은 수정하기 어렵거나 불가능합니다. 타임라인 막대 같은 것들이 그 예시입니다.
일부분은 사용자 요소(custom element)를 사용하고,
사용자 요소는 별도로 튜닝하는 방법을 제공하지 않기 때문입니다.
만약 수정이 불가능한 타임라인 막대에 대해 원하는 수정 사항이 있다면,
얼마든지 [Github Issue](https://github.com/OverlayPlugin/cactbot/issues/new/choose)에 글을 작성해주세요.

**경고**: cactbot은 CSS 하위 호환 유지를 보장하지 않습니다.
나중에 cactbot에서 요소들을 재배열 할 수도 있고,
요소 이름과 클래스를 변경할 수도 있고.
스타일링 전체를 바꿀 수도 있습니다.
일반적으로, cactbot의 CSS를 수정하는 것은 스스로 관리해야 합니다.

## Raidboss 트리거 덮어쓰기

`cactbot/user/raidboss.js`를 이용해서 트리거가 작동하는 방식을 덮어씌울 수 있습니다.
출력하는 문자열을 수정하거나,
어떤 직업을 대상으로 발동하는지,
그리고 얼마나 오래 화면에 떠있는지,
이외에 다른 것들을 수정할 수 있습니다.

`cactbot/user/raidboss.js` 안에
`Options.Triggers` 리스트를 이용해 새 트리거를 작성하거나
이미 존재하는 트리거를 수정하는데 사용할 수 있습니다.
만약 User 파일이 이미 있는 트리거(cactbot에 내장된 트리거 포함)와
같은 id를 사용하는 트리거가 있다면, 기존 트리거를 덮어쓰게 됩니다.

트리거를 수정하기 전에
각 트리거에 있는 다양한 설정값이 어떤 것을 의미하는지 이해하기 위해서
[트리거 가이드](../RaidbossGuide.md)를 읽는 것이 좋습니다.

일반적으론 다음과 같은 형식의 코드 블록을
`cactbot/user/raidboss.js`에 추가하면 됩니다.

```javascript
Options.Triggers.push({
  // 파일 최상단에 있는 ZoneId를 찾으세요
  // 예시) ZoneId.MatchAll (모든 지역) 또는 ZoneId.TheBozjanSouthernFront.
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 이 곳이 트리거 객체를 넣는 곳입니다.
      // 예시) id / netRegex / infoText
    },
  ],
});
```

트리거를 수정할 때 가장 쉬운 방법은
위에 있는 코드 블록을 각 트리거에 붙여넣는 것입니다.
`zoneId`에 이 트리거가 작동할 지역 ID를 입력하세요.
보통 cactbot 트리거 파일 최상단에 적혀있습니다.
그리고 [이 파일](../../resources/zone_id.ts)은 모든 지역 ID 리스트를 저장하고 있습니다.
만약 올바른 지역 ID를 입력하지 않는다면, 오버레이 플러그인 로그 창에 warning이 나오게 됩니다.
그 다음, 트리거 텍스트를 블록 안에 복사하여 필요한 만큼 수정하세요.
이 과정을 수정하고 싶은 모든 트리거에 대해 반복하면 됩니다.
변경 사항을 적용하려면, raidboss 오버레이를 새로고침하세요.

**참고**: 이 방식은 기존 트리거의 동작을 완전히 제거하게 됩니다.
따라서 수정할 때 동작 로직 부분은 제거하지 마세요.
또한, 이건 JavaScript이기 때문에 유효한 JavaScript 코드여야 합니다.
프로그래머가 아니라면, 무엇을 어떻게 수정하고 있는지 더더욱 조심하세요.

### 예시 1: 출력 문자열 변경하기

당신이 절바하를 하려고 한다고 칩시다.
당신의 공대는 처음 불장판때 cactbot이 기본으로 불러주는 "불 같이맞기" 대신에
"불 대상자 밖으로"를 먼저 하기로 조율했습니다.

이를 해결하는 방법으로는 트리거의 출력을 수정하여 조정하는 것이 있습니다.
fireball #1 원본 트리거는
[ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/04-sb/ultimate/unending_coil_ultimate.js#:~:text=UCU%20Nael%20Fireball%201)에서 찾을 수 있습니다.

이 코드들을 `cactbot/user/raidboss.js` 파일 아래 부분에 붙여넣습니다.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      // infoText는 화면에 초록색으로 표시되는 문구입니다.
      infoText: {
        ko: '불 대상자 밖으로',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

이 수정본은 `tts` 부분을 제거하고 한국어 이외에 다른 언어도 제거합니다.

### 예시 2: 도발 알림이 모든 직업에 뜨게 하기

지금은 도발 알림이 같은 파티나 연합 파티에 있는 경우에만 작동하고, 일부 직업에 대해서만 작동하고 있습니다.
이 예시는 어떻게 모든 플레이어에 대해 알림을 보여주도록 만들 수 있는지 보여줍니다.
도발 트리거는
[ui/raidboss/data/00-misc/general.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/00-misc/general.js#:~:text=General%20Provoke)에서 찾을 수 있습니다.

다음 예시는 `condition` 함수(function)가 수정된 버전입니다.
이 트리거는 cactbot에 내장된 트리거인 `General Provoke`와 id가 동일하기 때문에
이 트리거가 기본 트리거를 덮어쓸 것 입니다.

이 코드들을 `cactbot/user/raidboss.js` 파일 아래 부분에 붙여넣습니다.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // 같은 파티가 아닌 사람들까지도 도발 알림을 받고 싶거나
        // 내가 탱커가 아닌 경우
        return true;
      },
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.source) });
      },
      outputStrings: {
        text: {
          en: 'Provoke: ${player}',
          de: 'Herausforderung: ${player}',
          fr: 'Provocation: ${player}',
          ja: '挑発: ${player}',
          cn: '挑衅: ${player}',
          ko: '도발: ${player}',
        },
      },
    },
  ],
});
```

이 경우에는 그냥 `condition` 함수를 완전히 지워버리는 방법도 있습니다.
condition이 없는 트리거는 정규식이 맞을 때마다 항상 작동하기 때문이죠.

### 예시 3: 커스텀 트리거 추가하기

이와 똑같은 방법으로 커스텀 트리거를 만들 수도 있습니다.

아래 예시는 "갈래 번개" 디버프를 받은 1초 후에
"Get out!!!" 문구를 출력해주는 커스텀 트리거입니다.

```javascript
Options.Triggers.push([
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        // 이 id는 새로 만든 것이기 때문에 cactbot 트리거를 덮어쓰지 않습니다.
        id: 'Personal Forked Lightning',
        regex: Regexes.gainsEffect({ effect: '갈래 번개' }),
        condition: (data, matches) => { return matches.target === data.me; },
        delaySeconds: 1,
        alertText: 'Get out!!!',
      },

      // ... 원한다면 다른 트리거를 추가하세요
    ],
  },

  // ... 원한다면 다른 지역을 추가하세요
]);
```

cactbot 트리거 작성하는 방법을 더 자세히 배우려면
[트리거 가이드](../RaidbossGuide.md)와
[ui/raidboss/data](../../ui/raidboss/data)에 이미 존재하는 트리거를 읽어보세요.

## Raidboss 타임라인 덮어쓰기

Raidboss 타임라인을 덮어쓰는 것은 [Raidboss 트리거 덮어쓰기](#Raidboss-트리거-덮어쓰기)와 비슷합니다.

타임라인을 덮어쓰기 위한 과정:

1) 타임라인 텍스트 파일을 cactbot에서 user 폴더로 복사합니다.

    예를 들어,
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)를
    `user/the_epic_of_alexander.txt`로 복사할 수 있겠죠.

1) user/raidboss.js 파일에 이 타임라인 파일을 덮어쓰기 위한 부분을 추가하세요.

    트리거를 추가하는 것과 같이, `zoneId`에 구획(section)을 추가합니다.
    `overrideTimelineFile: true`를 zoneId 아래에 추가하고,
    `timelineFile`에 타임라인 텍스트 파일의 이름을 추가하세요.

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```

    당신이 첫번째 과정을 따라서
    `user/the_epic_of_alexander.txt` 파일을 생성했다면,

    `overrideTimelineFile: true`을 설정함으로써
    cactbot이 기본적으로 포함된 타임라인 대신
    새로 추가한 타임라인을 사용하게 됩니다.

1) 필요한 만큼 user 폴더에 있는 새 타임라인 파일을 수정하세요.

    타임라인 구성 방법에 대해 더 알고 싶다면 [타임라인 가이드](../TimelineGuide.md)를 참고하세요.

**참고**: 타임라인을 수정하는 것은 약간의 위험 요소가 있습니다.
타임라인 텍스트를 참고하여 작동하는 타임라인 트리거가 있을 수도 있기 때문이죠.
예를 들어, 절알렉에는 `Fluid Swing`와 `Propeller Wind` 등을 이용하는 타임라인 트리거가 있습니다.
만약 이 이름들이 바뀌거나 지워진다면, 타임라인 트리거가 작동하지 않게 됩니다.
특히, 한국어 스킬명으로 바꾸는 경우, 타임라인 트리거는 영어 타임라인을 기반으로 작동하기 때문에
같은 스킬명을 표시한다 하더라도 타임라인 트리거가 작동하지 않습니다.
(타임라인은 각 언어마다 번역 과정을 거쳐 화면에 표시되며, 타임라인 트리거는 영어 타임라인 기반으로 작동합니다.)

## 기능 사용자 설정하기

이 문단은 cactbot 모듈에 사용자 지정할 수 있는 다른 요소들에 대해 다룹니다.
몇몇 변수들은 설정 UI에 있지도 않고 트리거도 아닌 것들이 있습니다.

각각의 cactbot 모듈은 다양한 옵션을 제어하는 `Options` 변수를 가지고 있습니다.
수정할 수 있는 옵션은 각 `ui/<name>/<name>.js` 파일 최상단 `Options` 부분에 나열되어 있습니다.

예를 들어 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js)에는
`PlayerNicks` 옵션을 찾아볼 수 있는데, 플레이어 닉네임을 따로 설정하는 옵션이 있습니다.

```javascript
Options.PlayerNicks = {
  // '이름 성': '닉네임',
  'Banana Nana': 'Nana',
  'The Great\'one': 'Joe', // The Great'one와 같이 이름에 작은 따옴표가 포함된 경우 그 앞에 역슬래시를 추가해야 합니다.
  'Viewing Cutscene': 'Cut',
  // 기타 더 많은 닉네임을 추가할 수 있습니다.
};
```

**주의**: user 디렉토리에 있는 파일들은 cactbot 설정 UI에서 설정한 값들을
조용히 덮어씌울 것입니다.
이 부분이 헷갈릴 수 있는데,
따라서 일반적으로 기본으로 제공되는 설정 기능으로 최대한 설정해보고,
그 설정 기능으로는 수정할 수 없는 것들만 user 파일들로 수정하는 것이 좋습니다.

## 초보를 위한 무작정 따라하기

위 설명이 전혀 이해되지 않는 분들을 위해 그냥 무작정 따라하면 되는 설명을 추가했습니다. 지금까지의 내용을 이해하신 분이라면 읽지 않아도 됩니다.

User 폴더의 위치를 모른다면, [User 디렉토리 설정하기](#User-디렉토리-설정하기)를 확인하세요. 특히, 해루봇 사용자의 경우 User 폴더 경로를 새로 지정하기를 권장합니다.

### Raidboss 트리거 수정하기

1) `user` 폴더의 `raidboss.js` 파일을 편집 프로그램으로 엽니다. (메모장으로도 가능하며, 추가 프로그램을 설치할 의향이 있다면, [notepad++](https://notepad-plus-plus.org/downloads/)를 추천합니다.) 해당 파일이 없다면, 새로 만듭니다. 확장자가 js로 생성됐는지 반드시 확인하세요.

1) 다음 코드 블록을 `raidboss.js` 파일 가장 아래에 붙여넣습니다.

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.SomeId,
      triggers: [
        {

        },
      ],
    });
    ```

1) [데이터 목록](https://github.com/OverlayPlugin/cactbot/tree/triggers)에서 지금 수정하고 싶은 레이드나 던전의 `.js` 파일을 찾아서 여세요. 해당하는 던전의 영문명은 직접 알아내야 합니다.

1) `raidboss.js` 파일에 붙여넣은 내용 중, `ZoneId.SomeId`를 지우고 그 위치에 방금 찾아서 연 `.js` 파일에 나와있는 `zoneId`를 붙여넣습니다.
예시) `e8s.js`에는 `ZoneId.EdensVerseRefulgenceSavage`가 `zoneId`로 적혀있으므로, `ZoneId.SomeId`를 지우고 `ZoneId.EdensVerseRefulgenceSavage`를 붙여넣습니다.

1) trigger 내부 중괄호와 쉼표를 지우고, `.js` 파일 내에서 수정하길 원하는 트리거를 그대로 붙여넣습니다. (id 바로 위에 있는 중괄호부터 복사해야 합니다.)

    전:

    ```javascript
    triggers: [
      {

      },
    ],
    ```

    후:

    ```javascript
    triggers: [
      { // <- id 바로 위의 여는 중괄호가 하나의 트리거의 시작점입니다.
        id: 'E8S Reflected Frost 1',
        netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
        suppressSeconds: 5,
        infoText: {
          en: 'Swap Sides',
          de: 'Seiten wechseln',
          fr: 'Changez de côté',
          cn: '换边',
          ko: '반대로 이동',
        },
      }, // <- 시작한 중괄호의 닫는 쌍이 하나의 트리거의 끝점입니다. 쉼표도 포함한다고 생각하는게 복잡하지 않습니다.
    ],
    ```

1) 수정하고 싶은 부분을 수정합니다. 아래 예시에서는 한국어 출력 문구를 "피하기"로 바꿔보겠습니다.

    ```javascript
    triggers: [
      {
        id: 'E8S Reflected Frost 1',
        netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
        suppressSeconds: 5,
        infoText: {
          en: 'Swap Sides',
          de: 'Seiten wechseln',
          fr: 'Changez de côté',
          cn: '换边',
          ko: '피하기', // <- 여기를 바꿨습니다.
        },
      },
    ],
    ```

1) 더 수정하고 싶은 트리거가 있다면, 이 과정의 맨 처음으로 돌아가 반복합니다.

**주의**: 과정 도중 쉼표를 지우거나 각 괄호의 쌍이 서로 맞지 않는 등 문법 오류가 발생하지 않도록 주의하세요.

트리거를 더 자유자재로 수정하고 싶다면, 이 문서의 다른 문단들을 참고하세요. 이 문단은 최소한의 지식으로 수정할 수 있도록 **최대한** 간단히 설명했습니다.

### Raidboss 타임라인 수정하기

1) `user` 폴더의 `raidboss.js` 파일을 편집 프로그램으로 엽니다. (메모장으로도 가능하며, 추가 프로그램을 설치할 의향이 있다면, [notepad++](https://notepad-plus-plus.org/downloads/)를 추천합니다.) 해당 파일이 없다면, 새로 만듭니다. 확장자가 js로 생성됐는지 반드시 확인하세요.

1) 수정하고 싶은 타임라인을 [데이터 목록](https://github.com/OverlayPlugin/cactbot/tree/triggers)에서 다운로드하세요.
    1) 목록에서 해당 파일을 찾습니다.
    1) `Raw` 버튼을 클릭합니다.
    1) 화면 우클릭 후, `다른 이름으로 저장`을 클릭하면 다운로드할 수 있습니다.
    1) 해당 파일을 User 폴더 안에 넣습니다.

    해당하는 던전의 영문명은 직접 알아내야 합니다.

1) 다음 코드 블록을 `raidboss.js` 파일 가장 아래에 붙여넣습니다.

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.SomeId,
      overrideTimelineFile: true,
      timelineFile: 'some_timeline.txt',
    });
    ```

1) 수정하고 싶은 타임라인의 던전에 해당하는 `.js` 파일을 [데이터 목록](https://github.com/OverlayPlugin/cactbot/tree/triggers)에서 열고, 그 파일 상단에 있는 `zoneId` 값을 `ZoneId.SomeId` 대신 집어 넣습니다. 예를 들어, 절알렉 타임라인을 수정하고 있다면, `the_epic_of_alexander.js`을 열어서 그 곳에 적힌 `ZoneId.TheEpicOfAlexanderUltimate`를 `ZoneId.SomeId`를 대신해 붙여넣습니다.

1) `timelineFile` 뒤의 `txt` 파일명을 방금 다운로드한 타임라인 `txt` 파일명으로 수정합니다.

1) 다운로드 한 타임라인을 편집기로 열어 원하는 대로 수정합니다.

1) 더 수정하고 싶은 타임라인이 있다면, 이 과정의 맨 처음으로 돌아가 반복합니다.

### 간단한 메모 추가하는 법

엔터를 입력해도 딱히 기능은 없으므로 엔터는 마음껏 해도 됩니다.(이어져야 하는 문구 도중에 줄바꿈을 해도 된다는 뜻이 아닙니다.) `js` 파일 내에 "//"를 입력하면, 뒤의 모든 글자는 모두 무시됩니다. (줄바꿈시 무시하지 않음.) 이 방법으로 메모를 추가할 수 있습니다.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.EdensVerseRefulgenceSavage,
  // 뒤에 어떤 내용을 수정한건지 적을 수 있겠죠
  // 이렇게 메모를 줄바꿈하면 새로 //를 입력해야 합니다.
  triggers: [
    {
      id: 'E8S Reflected Frost 1', // 이렇게 어느 문장 뒤에도 메모를 추가할 수 있습니다.
      netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Swap Sides',
        de: 'Seiten wechseln',
        fr: 'Changez de côté',
        cn: '换边',
        ko: '피하기',
      },
    },
  ],
});
```

## Global 트리거 파일 Import

유저 파일들은 자바스크립트로 `eval` 됩니다,
따라서 기본으로 제공되는 트리거 파일들과 같은 방식으로 `import` 할 수 없습니다.
유저 자바스크립트 파일들은 다음 global들에 접근할 수 있습니다:

- [Conditions](../../resources/conditions.ts)
- [ContentType](../../resources/content_type.ts)
- [NetRegexes](../../resources/netregexes.ts)
- [Regexes](../../resources/regexes.ts)
- [Responses](../../resources/responses.ts)
- [Outputs](../../resources/outputs.ts)
- [Util](../../resources/util.ts)
- [ZoneId](../../resources/zone_id.ts)
- [ZoneInfo](../../resources/zone_info.ts)

## User 파일 디버깅

### 오버레이 플러그인 로그에 에러가 나오는지 확인하세요

오버레이 플러그인 로그는 스크롤 기능이 있는 텍스트 창인데,
ACT -> Plugins -> OverlayPlugin.dll로 이동해서
창의 하단을 보면 찾을 수 있습니다.

만약 에러가 있다면, 여기에 나올 겁니다.

### User 파일이 로드되는지 확인하세요

먼저, raidboss의 디버그 모드를 활성화하세요.
cactbot 설정 UI에서,
`개발자 옵션 표시`를 체크하고 페이지를 새로 고침 하세요.
다음, Raidboss 아래에 있는 `디버그 모드 활성화`를 체크하고 다시 새로 고침 하세요.

Raidboss 디버그 모드가 활성화되어 있으면,
오버레이 플러그인 로그에 더 많은 정보를 출력합니다.
불러오는 각각의 user 파일 리스트도 출력합니다:
`[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

User 파일이 로드되었는지 확인하세요.

### User 파일에 에러가 있는지 확인하세요

User 파일은 JavaScript로 작성하기 때문에 JavaScript 문법에 맞지 않게 작성하면,
에러가 발생할 것이고 user 파일은 생략되어 불러오지 않습니다.
로딩할 때 에러가 있는지 OverlayPlugin 로그를 확인하세요.

예시:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 96)
```

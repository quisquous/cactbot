# Cactbot 사용자 설정

- [Cactbot UI를 사용하는 방법](#Cactbot-UI를-사용하는-방법)
- [User 디렉토리 개요](#User-디렉토리-개요)
- [User 디렉토리 설정하기](#User-디렉토리-설정하기)
- [디자인 수정하기](#디자인-수정하기)
- [Raidboss 트리거 덮어쓰기](#Raidboss-트리거-덮어쓰기)
  - [예시 1: 출력 텍스트 변경하기](#예시-1:-출력-텍스트-변경하기)
  - [예시 2: 도발 알림이 모든 직업에 뜨게 하기](#예시-2:-도발-알림이-모든-직업에-뜨게-하기)
  - [예시 3: 사용자 지정 트리거 추가하기](#예시-3:-사용자-지정-트리거-추가하기)
- [Raidboss 타임라인 덮어쓰기](#Raidboss-타임라인-덮어쓰기)
- [기능 사용자 설정하기](#기능-사용자-설정하기)
- [User 파일 디버깅](#User-파일-디버깅)
  - [오버레이 플러그인 로그에 에러가 나오는지 확인하세요](#오버레이-플러그인-로그에-에러가-나오는지-확인하세요)
  - [User 파일이 로드되는지 확인하세요](#User-파일이-로드되는지-확인하세요)
  - [User 파일에 에러가 있는지 확인하세요](#User-파일에-에러가-있는지-확인하세요)

## cactbot UI를 사용하는 방법

cactbot을 사용자 설정하는 가장 좋은 방법은 cactbot의 설정 UI를 이용하는 것입니다.
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot 에서 찾을 수 있어요.

이 방법으로는 다음과 같은 설정이 가능합니다:

- 트리거에 TTS 설정하기
- 트리거 비활성화하기
- cactbot 언어 변경하기
- 볼륨 설정
- 음식을 먹으라는 치즈 아이콘 없애기

cactbot 설정 UI에서 원하는 모든 것들을 설정할 수는 없을지도 모르지만,
이 방법이 시작하기에 가장 쉬운 방법입니다.
또한, 업데이트를 진행함에 따라 더 많은 옵션이 추가될 것입니다.

이 옵션들은
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
파일에 저장됩니다.
저 파일을 직접 수정하지 않도록 하세요.

## User 디렉토리 개요

만약 cactbot UI가 원하는 옵션을 제공하지 않는다면,
User 파일 덮어쓰기를 고려해야 합니다.
이 방법은 JavaScript와 CSS를 작성하는 것이기 때문에,
약간의 프로그래밍 지식이 필요할 수도 있습니다.

cactbot은 "모든 사용자 설정은 User 디렉토리 파일에만 들어가야 한다"는 철학을 갖고 있습니다.
이렇게 하면 향후 cactbot 업데이트 시 변경 사항이 덮어쓰이지 않게 됩니다.
또한, 추후 cactbot release 파일을 직접 수정하는 것이 추가 빌드 작업을 하지 않고는 불가능해집니다.

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

이상적으로는, cactbot이 설치된 `cactbot/user`를 사용하는 것이 좋습니다.
보통은 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`
(해루봇을 사용한다면, `ACT 설치 경로\Plugins\cactbot\user`)입니다.
[이 폴더](../../docs)에는 예시 설정 파일들이 있습니다.

## 디자인 수정하기

`user/<name>.css` 파일은 각 오버레이의 위치, 크기, 색깔 등을 수정할 수 있습니다.
`ui/<name>/<name>.css`를 보고 수정할 수 있는 셀렉터(selector)를 확인하세요.

[ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css)의 예시를 보자면,
`#popup-text-container`와 `#timeline-container`를 확인할 수 있습니다.
이들의 위치를 `user/raidboss.css`에서 원하는 다른 위치로 바꿀 수 있습니다.
`user/raidboss.css`로 다른 추가적인 스타일링도 가능합니다.

Info 텍스트 알람의 크기와 색깔도 바꿀 수 있습니다.
`.info-text` 클래스에 CSS 규칙을 추가하는 방법으로:

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

User 디렉토리의 CSS는 cactbot의 기본 CSS 아래에 추가하는 것이라고 생각하면 됩니다.
따라서, [CSS 명시도 규칙](https://developer.mozilla.org/ko/docs/Web/CSS/Specificity)에 따라,
`!important`를 추가해서 설정한 규칙을 강제로 덮어쓰도록 할 수 있습니다.
또한, 기본 설정 값을 해제하려면 해당 값을 `auto`로 설정해야 합니다.

CSS 문제를 디버그하기 가장 좋은 방법은 [Chrome 개발자 도구](https://developers.google.com/web/tools/chrome-devtools)를 사용하는 것입니다.
ACT -> Plugins -> OverlayPlugin.dll -> 원하는 오버레이 -> 개발자 도구 열기 를 클릭해서 개발자 도구를 열 수 있습니다.

**참고**: 일부분은 수정하기 어렵거나 불가능합니다. 타임라인 막대 같은 것들이 그 예시입니다.
이게 왜 이러냐면, 그 일부분은 사용자 요소(custom element)를 사용하고,
사용자 요소는 튜닝하는 방법을 별로 제공하지 않기 때문입니다.
만약 수정이 불가능한 타임라인 막대에 대해 원하는 수정 사항이 있다면,
얼마든지 [Github Issue](https://github.com/quisquous/cactbot/issues/new/choose)에 글을 작성해주세요.

**경고**: cactbot은 CSS 하위 호환 유지를 보장하지 않습니다.
미래에 cactbot 수정으로 요소들을 재배열 할 수도 있고,
요소 이름과 클래스를 변경할 수도 있고.
스타일링 전체를 바꿀 수도 있습니다.
일반적으로, cactbot의 CSS를 수정하는 것은 스스로 관리해야 합니다.

## Raidboss 트리거 덮어쓰기

### 예시 1: 출력 텍스트 변경하기

### 예시 2: 도발 알림이 모든 직업에 뜨게 하기

### 예시 3: 사용자 지정 트리거 추가하기

## Raidboss 타임라인 덮어쓰기

## 기능 사용자 설정하기

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
오버레이 플러그인 로그에 더 많은 정보를 출력할 겁니다.
불러오는 각각의 user 파일 리스트도 출력합니다:
`[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

User 파일이 로드되었는지 확인하세요.

### User 파일에 에러가 있는지 확인하세요

User 파일은 JavaScript로 작성하기 때문에 JavaScript 문법에 맞지 않게 작성하면,
에러가 발생할 것이고 user 파일은 생략되어 불러오지 않습니다.
로딩할 때 에러가 있는지 OverlayPlugin 로그를 확인하세요.

예시:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```

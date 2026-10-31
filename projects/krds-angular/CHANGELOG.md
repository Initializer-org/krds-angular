# Changelog

## [0.1.2](https://github.com/Initializer-org/krds-angular/compare/v0.1.1...v0.1.2) (2026-10-31)


### Bug Fixes

* 달력의 이전·다음 달 날짜를 고를 수 없게 (공식 krds-react와 같게) ([#37](https://github.com/Initializer-org/krds-angular/issues/37)) ([f4a7296](https://github.com/Initializer-org/krds-angular/commit/f4a7296e01eea4d2ca795f8b84f6ebfbeaa18ffd))

## [0.1.1](https://github.com/Initializer-org/krds-angular/compare/v0.1.0...v0.1.1) (2026-10-29)


### Bug Fixes

* npm 0.1.0이 Angular 22만 허용하던 문제 - 릴리스 워크플로가 publish를 건너뛰어 [#32](https://github.com/Initializer-org/krds-angular/issues/32)의 peerDependencies가 빠졌음 ([#35](https://github.com/Initializer-org/krds-angular/issues/35)) ([162eef8](https://github.com/Initializer-org/krds-angular/commit/162eef830546c1e9b6e9550fe80e0c09fc51ca04))

## 0.1.0 (2026-10-29)

> npm의 0.1.0은 릴리스 워크플로보다 먼저 손으로 올린 빌드라 peerDependencies가 `^22.2.0`입니다. Angular 20·21 지원(#32)은 0.1.1부터 들어갑니다.


### Features

* KRDS Angular 라이브러리 초기 구성과 Button 추가 ([d92a5a9](https://github.com/Initializer-org/krds-angular/commit/d92a5a9677c2e4ae7f00ea9fdcfe8ea7598e1dcd))
* 액션 분류 완성 - 링크·플로팅 버튼 추가 ([#1](https://github.com/Initializer-org/krds-angular/issues/1)) ([054795d](https://github.com/Initializer-org/krds-angular/commit/054795d3ea541f24cf0b4b605989119cc96508e3))
* 선택 분류 추가 - 체크박스·라디오·셀렉트·태그·토글 스위치 ([#2](https://github.com/Initializer-org/krds-angular/issues/2)) ([fb16299](https://github.com/Initializer-org/krds-angular/commit/fb1629947aaf5b83810870b9f0560f6fda3190d0))
* 입력 분류 추가 - 텍스트 입력·텍스트 영역·날짜 입력·파일 업로드, 폼 그룹 ([#4](https://github.com/Initializer-org/krds-angular/issues/4))
* 피드백 분류 추가 - 단계 표시기·스피너, 폼 그룹 로딩 ([#5](https://github.com/Initializer-org/krds-angular/issues/5))
* 레이아웃 및 표현 분류 추가 - 모달·탭·표·캐러셀·아코디언 등 11종 ([#6](https://github.com/Initializer-org/krds-angular/issues/6))
* 탐색 분류 추가 - 메인 메뉴·사이드 메뉴·페이지네이션 등 6종 ([#7](https://github.com/Initializer-org/krds-angular/issues/7))
* 아이덴티티 분류 추가 - 공식 배너·운영기관 식별자·헤더·푸터 ([#8](https://github.com/Initializer-org/krds-angular/issues/8))
* 도움 분류 추가 - 도움 패널·맥락적 도움말·코치마크·툴팁·음성 지원 ([#9](https://github.com/Initializer-org/krds-angular/issues/9))
* 설정 분류 추가 - 언어 변경·화면 크기 조정, 드롭다운 ([#10](https://github.com/Initializer-org/krds-angular/issues/10))
* 콘텐츠 분류 추가 - 접근 가능한 미디어 ([#11](https://github.com/Initializer-org/krds-angular/issues/11))
* 모바일 분류 추가 - 범위슬라이드·수량 토글·토스트·스낵바·탭바 ([#12](https://github.com/Initializer-org/krds-angular/issues/12))
* 부가 컴포넌트 추가 - 레이아웃 ([#13](https://github.com/Initializer-org/krds-angular/issues/13))
* Angular 20·21 지원과 README 정리 ([#32](https://github.com/Initializer-org/krds-angular/issues/32)) ([75d87f2](https://github.com/Initializer-org/krds-angular/commit/75d87f2e4f74236637b500bcac73d2c294af0ffa))


### Bug Fixes

* 문서 예제 검사에서 찾은 라이브러리 문제 - 아코디언 제목 수준, 페이지네이션 비활성 링크, 컴포넌트 요소 border-box ([#17](https://github.com/Initializer-org/krds-angular/issues/17)) ([997d847](https://github.com/Initializer-org/krds-angular/commit/997d847137aa7774acd252f0d8ed75f8e7946d64))
* 문서 작업 중 찾은 라이브러리 문제 - 이벤트 순서·빈 제목·페이지 생략·타입·키보드·초점·이름 ([#29](https://github.com/Initializer-org/krds-angular/issues/29))


### Documentation

* 문서 사이트 추가 - VitePress에 Angular 예제를 붙이고 액션 분류 문서 ([#16](https://github.com/Initializer-org/krds-angular/issues/16)) ([9990d83](https://github.com/Initializer-org/krds-angular/commit/9990d83200b59402cc2c52957ec982c6274b08bd))
* 분류별 컴포넌트 문서와 예제, 홈 컴포넌트 미리보기 ([#18](https://github.com/Initializer-org/krds-angular/issues/18)) ([143d8db](https://github.com/Initializer-org/krds-angular/commit/143d8dba9740bf61783bd88fe61b92a1147dace0))

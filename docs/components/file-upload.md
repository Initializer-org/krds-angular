# 파일 업로드 File upload

파일 업로드는 하나 이상의 디바이스의 로컬 파일을 선택하고 첨부하는 데 사용하는 입력 컴포넌트이다.

## 기본

`[(files)]`에 파일 목록(`KrdsFileInfo[]`)을 바인딩합니다. 제목은 `heading`, 설명은 `description`으로 줍니다. 컴포넌트는 파일을 서버로 보내지 않습니다. 추가된 파일은 `pending` 상태로 목록에 들어가므로 실제 업로드와 상태 변경은 직접 처리합니다. 파일이 추가되면 `(fileAdded)`, 삭제되면 `(fileRemoved)`, 전체 삭제하면 `(cleared)`가 발생합니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/Basic" /></div>

<<< ./demos/file-upload/Basic.ts

## 파일 상태별 표시

`KrdsFileInfo`의 `status`에 따라 표시가 달라집니다. `uploading`은 스피너, `completed`는 완료 아이콘, `pending`은 삭제 버튼, `error`는 `errorMessage`를 표시합니다. `downloadUrl`이 있으면 다운로드·바로보기 버튼이 표시되고, 누르면 `(download)`·`(preview)`로 그 파일을 보냅니다. 다운로드·바로보기 동작은 직접 구현합니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/WithFiles" /></div>

<<< ./demos/file-upload/WithFiles.ts

## 파일 선택 동작

**파일선택** 버튼이나 업로드 영역으로 끌어다 놓아 파일을 추가합니다. `maxFileSize`(기본 20MB) 이상인 파일은 `error` 상태로 추가되고 개수에서 빠지며, `(fileError)`가 발생합니다. `maxFiles`(기본 10개)에 이르면 더 추가되지 않습니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/Interactive" /></div>

<<< ./demos/file-upload/Interactive.ts

## 단일 파일

`[multiple]="false"`로 지정하면 새로 선택한 파일이 기존 파일을 대신합니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/SingleFile" /></div>

<<< ./demos/file-upload/SingleFile.ts

## 이미지 파일만

`accept`에 허용할 확장자나 MIME 타입을 지정합니다. 끌어다 놓은 파일이 형식에 맞지 않으면 `error` 상태로 추가됩니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/ImageOnly" /></div>

<<< ./demos/file-upload/ImageOnly.ts

## 비활성화

파일 선택·끌어다 놓기·삭제가 모두 막힙니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/Disabled" /></div>

<<< ./demos/file-upload/Disabled.ts

## 읽기 전용

업로드 영역과 삭제 버튼 없이 파일 목록만 표시합니다.

<div class="demo vp-raw"><AngularDemo name="file-upload/ReadOnly" /></div>

<<< ./demos/file-upload/ReadOnly.ts

## API

## KrdsFileUpload

<ComponentApi name="KrdsFileUpload" />

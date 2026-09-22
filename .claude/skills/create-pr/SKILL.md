---
name: create-pr
description: |
  git diff/log를 분석해 PR 제목과 본문 초안을 작성하고, 저장소가 한국어권 프로젝트인지 영어권 오픈소스 프로젝트인지 판단해 그에 맞는 템플릿(한국어 기본 / 영어)을 골라 `gh pr create`로 GitHub PR을 생성하는 스킬.
  "PR 만들어줘", "PR 올려줘", "풀리퀘스트 생성해줘", "create a PR", "open a pull request" 같은 요청 시 활성화한다.
context: fork
---

# create-pr: GitHub PR 생성

현재 브랜치의 변경사항을 분석해 PR 제목/본문을 작성하고 `gh pr create`로 PR을 연다. PR 생성은 팀 전체에게 보이는 공개적 행동이므로, 실제로 PR을 여는 단계 전에는 **반드시 사용자 확인을 받는다** (이 점이 승인 없이 바로 실행하는 `commit` 스킬과 다른 부분이다).

## 워크플로우

### Step 1: 컨텍스트 수집

- `git status`로 uncommitted 변경사항이 있는지 확인한다. 있다면 PR에는 커밋된 내용만 올라간다는 점을 사용자에게 알리고, 커밋부터 할지 확인한다(자동으로 커밋하지 않는다).
- base 브랜치를 확인한다: `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` (실패하면 `git remote show origin`의 HEAD branch로 대체).
- 현재 브랜치가 base 브랜치와 같으면 PR을 만들 수 없으므로, 새 브랜치가 필요하다는 점을 알린다.
- `git log <base>..HEAD --oneline`으로 이 브랜치에 포함된 커밋 목록을, `git diff <base>...HEAD`로 실제 변경 내용을 확인한다.
- 현재 브랜치가 원격에 push 되어 있는지 확인한다(`git rev-parse --abbrev-ref --symbolic-full-name @{u}`가 실패하면 미push 상태).

### Step 2: 저장소 언어 판단 (템플릿 선택 기준)

기본값은 **한국어 템플릿**이다. 아래 신호를 근거로 이 저장소가 "영어 기반 오픈소스 프로젝트"라고 볼 만하면 영어 템플릿으로 전환한다:

- `README.md`(및 있다면 `CONTRIBUTING.md`) 본문이 대부분 영어이고 한글이 거의/전혀 없다.
- `LICENSE` 파일 존재, 영어로 된 기여 가이드, 영어로 된 최근 커밋 메시지/이슈 등 오픈소스 프로젝트임을 뒷받침하는 추가 신호가 있다.
- 이 저장소(`react-component-generator-main`)처럼 `AGENTS.md`/커밋 로그가 한국어인 프로젝트는 명백히 한국어 템플릿 대상이다 — 대부분의 사내/개인 프로젝트가 여기 해당한다.

신호가 부족하거나 언어가 섞여 있어 애매하면 **사용자에게 묻지 않고 한국어 기본값을 사용한다.** 어떤 근거로 어느 템플릿을 골랐는지 한 줄로 사용자에게 알려준다 (예: "README가 영어이고 LICENSE가 있어 영문 템플릿을 사용합니다").

### Step 3: 템플릿 로드 및 초안 작성

- 한국어: `references/template_ko.md`
- 영어: `references/template_en.md`

선택한 템플릿의 섹션 구조를 그대로 따라, Step 1에서 모은 diff/log를 근거로 내용을 채운다. 내용이 없는 섹션(예: 스크린샷)은 비워두지 말고 통째로 생략한다. 제목은 `git log`에 보이는 기존 커밋 메시지 스타일(타입 접두사, 언어 등)을 참고해 짧고 명확하게 작성한다.

### Step 4: 사용자 확인

작성한 제목/본문 초안과 `base ← head` 브랜치 정보를 사용자에게 보여주고 승인을 받는다. 이 단계 없이 바로 Step 5로 넘어가지 않는다.

### Step 5: PR 생성

승인을 받으면:

1. 브랜치가 원격에 없으면 push한다(`git push -u origin <branch>`).
2. `gh pr create --base <base> --title "..." --body "$(cat <<'EOF' ... EOF)"` 형태로 실행해 본문 포맷(줄바꿈, 체크박스)을 보존한다.
3. 대화 컨텍스트에 커밋/PR용 attribution 지침(예: `Generated with Claude Code` 푸터)이 있다면 본문 맨 끝에 그대로 포함한다.
4. 생성된 PR URL을 사용자에게 전달한다.

## 안전 규칙

- PR 생성 및 push 전 사용자 확인 없이 진행하지 않는다.
- `--no-verify` 등 훅 우회 옵션은 사용자가 명시적으로 요청하지 않는 한 사용하지 않는다.
- uncommitted 변경사항을 임의로 커밋하거나 PR 대상 브랜치를 임의로 바꾸지 않는다.

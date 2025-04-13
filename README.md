## dev 서버 실행

```bash
# 1번만
pnpm install
# 서버가 바뀔 때 마다
pnpm generate-api
# 웹서버 실행
pnpm dev
```

## build

```bash
# 1번만
pnpm install
# 서버가 바뀔 때 마다
pnpm generate-api
# 빌드 파일 생성
pnpm build
# 추가로 apache 또는 nginx로 서버를 연결해줘야 함
```

## OpenAPI Generator 사용 방법

### API 클라이언트 생성하기

프로젝트에서는 OpenAPI Generator를 사용하여 API 클라이언트 코드를 자동으로 생성합니다.

```bash
# API 클라이언트 코드 생성
pnpm run generate-api
```

위 명령어를 실행하면 `src/api/generated` 디렉토리에 API 클라이언트 코드가 생성됩니다.

### API 클라이언트 사용 방법

생성된 API 클라이언트를 사용하려면 `src/api/index.ts` 파일의 주석을 해제하고 다음과 같이 사용합니다:

```typescript
import { memberApi, postApi } from "@/api";

// API 호출 예시
const getPosts = async () => {
  try {
    const response = await postApi.getPosts();
    return response.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};
```

### 인증 토큰 설정

API 호출에 인증 토큰을 포함하려면 로그인 성공 시 토큰을 로컬 스토리지에 저장하세요:

```typescript
// 로그인 성공 시
localStorage.setItem("accessToken", "your-access-token");
```

API 클라이언트는 자동으로 로컬 스토리지에서 토큰을 가져와 요청 헤더에 포함합니다.

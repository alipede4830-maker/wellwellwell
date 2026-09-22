# Supabase 연동 및 설정 가이드 (Supabase Setup Guide)

FLW Institutional Orderflow 플랫폼은 **Supabase** 및 **PostgreSQL**과 완벽히 연동되도록 설계되어 있습니다.

---

## 1. Supabase 프로젝트 생성 (무료)
1. [supabase.com](https://supabase.com)에 로그인하거나 무료 계정을 생성합니다.
2. **New Project**를 클릭하고 프로젝트 이름(예: `flw-orderflow`)과 데이터베이스 비밀번호를 설정합니다.
3. 리전(Region)은 가까운 위치(예: `Northeast Asia (Tokyo)` 또는 `Central Europe`)를 선택합니다.

---

## 2. 데이터베이스 테이블 생성 (SQL 스크립트 실행)
1. 생성된 Supabase 대시보드 좌측 메뉴에서 **SQL Editor**를 클릭합니다.
2. **New query** 버튼을 누릅니다.
3. 프로젝트 루트에 있는 `supabase_schema.sql` 파일의 전체 내용을 복사하여 붙여넣고, **Run** 버튼을 클릭합니다.
4. `users`, `trades`, `checklist_items` 테이블 및 RLS(Row Level Security) 정책이 즉시 적용됩니다.

---

## 3. 환경 변수 설정 (.env)
1. Supabase 대시보드 좌측 하단 **Project Settings** (톱니바퀴) -> **API** 메뉴로 이동합니다.
2. 아래 2가지 환경 변수를 사용합니다:
   ```env
   # Supabase Project URL
   NEXT_PUBLIC_SUPABASE_URL="https://ympnoukwxgjtmhdtdihu.supabase.co"

   # Supabase Publishable Key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_v5UywPgt3VQthz-MQFk0Vg_1_MxBOIx"
   ```

### (선택 사항) Express 백엔드 직접 연결 (Connection Pooling)
Express 백엔드(`server.ts`)가 Supabase PostgreSQL 인스턴스에 직접 연결되도록 하려면:
1. Supabase 대시보드 -> **Project Settings** -> **Database** 메뉴로 이동합니다.
2. **Connection string** 섹션에서 **URI** 탭을 선택하고 `DATABASE_URL`을 복사합니다.
3. `.env` 파일에 추가합니다:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
   ```

---

## 4. 지원 기능 및 작동 방식
- **Supabase 직접 연동**: `VITE_SUPABASE_URL` 및 `VITE_SUPABASE_ANON_KEY`가 설정되면, 프론트엔드가 Supabase JS SDK를 통해 트레이딩 저널, 체크리스트, 프로필을 실시간으로 읽고 씁니다.
- **Express REST API 연동**: `DATABASE_URL`이 설정되면 `server.ts`의 `/api/trades`, `/api/checklist`, `/api/profile` 엔드포인트가 Supabase PostgreSQL 인스턴스와 직접 동기화됩니다.
- **오프라인 및 무중단 폴백**: Supabase 키가 아직 설정되지 않았거나 네트워크 통신이 불안정할 때는 내장된 고성능 `localStorage` 캐시로 매끄럽게 폴백하여 데이터 유실 없이 정상 작동합니다.

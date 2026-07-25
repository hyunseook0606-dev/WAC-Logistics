# WAC Origin Cost — 고정 / 변동 / 갱신 주기 정리

기준 자료
- `cost item_origin.xlsx` (시트 HK, 유효 2026-03-01 ~ 2026-03-31)
- `INV_AE260703101.pdf` (HKG→SIN, 84kg, 2026-07-20 청구)
- 현업 맥락: CargoAI만으로 끝나지 않는 HK 트럭·현장비

> 주의: “고정”은 **금액이 영원히 안 바뀐다**는 뜻이 아니라,  
> **견적 순간에 화주가 직접 안 넣고, 마스터/시스템에서 자동으로 붙는 항목**이라는 뜻입니다.  
> 단가 자체는 대부분 주기적으로 갱신됩니다.

---

## 1. 한눈에 보는 분류

| 구분 | 의미 | UI에서 |
|------|------|--------|
| A. 시스템 자동 (마스터/API) | 단가표·CargoAI로 계산 | 화주/파트너는 안 봄 or 결과만 봄 |
| B. 조건부 자동 | 화물 조건이면 자동, 아니면 0 | 체크박스/화물타입으로 on-off |
| C. 데스크 변동비 슬롯 | 건마다 금액이 달라 사람이 넣음 | **내부 견적 화면만** |
| D. 환율 | USD↔HKD 등 | 당일/고시 환율 테이블 |

---

## 2. 항목별 상세 (엑셀 + 인보이스 매핑)

### A. 항공 운임 · 항공사 서차지 (마스터 / CargoAI 영역)

| 항목 | 엑셀 | 인보이스 | 성격 | 갱신 주기 (실무 추정) |
|------|------|----------|------|----------------------|
| Air Freight (weight break) | 1:1~1:50, Min/Flat, per kg | `AIR FREIGHT FEE` (USD) | **기간 변동**. 라우트·항공사·시즌에 민감 | 보통 **월 단위** (엑셀 Expiry가 월말). Spot이면 주/일 단위도 가능 → CargoAI |
| Fuel Surcharge | Flat per kg | 이번 INV에는 별도 라인 없음 (운임에 포함됐을 수 있음) | **빈번 변동** | 항공사/인덱스 기준 **월~주** |
| Security Charge | Flat per kg | 별도 라인 없음 | **중간 변동** | 보통 **월** 또는 정책 변경 시 |

→ 화주 홈페이지: **Origin/Dest + 중량·부피만 입력 → 결과 표시**  
→ 데스크: 항공사 선택·Override 가능하면 좋음

### B. Origin Local — 표준 로컬 (마스터로 자동계산, 필요 시 Override)

| 항목 | 엑셀 (EXP) | 인보이스 | 성격 | 갱신 주기 |
|------|------------|----------|------|-----------|
| Terminal Charge | Min 60 / Flat 1.68 per kg | `TERMINAL CHARGE` 141.12 (=84×1.68) | **상대적으로 안정**. 터미널 고시 | **분기~반기**, 최소 **월 마스터 점검** |
| Airline Document / Document Fee | Min 15 / per job | `DOCUMENT FEE` 15 HKD | **안정** | **반기~연**, 변경 시 공지 |
| Agent Handling / Handling | Min 150 / per job | `HANDLING CHARGE` 312 HKD | **중간**. 고객·계약별 다를 수 있음 | **계약/고객 단가표** (월~분기). INV는 엑셀 Min과 다름 → **고객별 요율** 가능성 |
| CFS | Min 160 / Flat 1.2 per kg | `CFS CHARGE` 200 (MIN) | **중간** | **월~분기** |

계산식 (엑셀 로직): `amount = max(Min, Flat × qty)`  
- per kg → qty = Chargeable Weight  
- per job → qty = 1

### C. Origin Local — 조건부 (있으면 붙고 없으면 0)

| 항목 | 엑셀 | 성격 | 갱신 |
|------|------|------|------|
| X-ray Screening | Min/Flat 있음 (IMP는 0) | 스크리닝 필요 시 | 월~분기 |
| ULD Build up | Flat per kg (IMP 0) | ULD 빌드업 시 | 월~분기 |
| MAWB DG Charge | Min 500 | DG일 때만 | 정책/항공사 |
| Warehouse Registration | Min 450 / per job | 창고 등록 필요 시 | 계약/창고 |
| Custom Inspection (IMP) | Min 200 / per job | 검사 발생 시 | 건별 또는 고시 |

→ UI: “DG / X-ray / ULD” 체크 → 자동 가산. 금액은 마스터.

### D. 트럭 · 현장비 = 진짜 변동비 슬롯 (차장님 포인트)

| 항목 | 엑셀 | 인보이스 | 왜 변동인가 | 갱신 |
|------|------|----------|-------------|------|
| Airport Delivery | Min 400 / Flat 0.6 per kg | (이름 다름) | 픽업지·거리 근사치 마스터 | 마스터는 월, **실비는 건별** |
| **Cartage** | **없음** | **650 HKD (MIN)** | 실제 트럭비. 구간·차종·시간대 | **건마다 입력** (벤더 견적/내부 기준표) |
| **Tunnel Fee** | **없음** | **16 HKD** | 터널 통과 여부·노선 | **건마다** |
| **Parking Fee** | **없음** | **15 HKD** | 주차/대기 | **건마다** |
| (기타 예상) Waiting / OT / Special vehicle | 없음 | 이번 INV 없음 | 현장 돌발 | **건마다** |

→ 이게 엑셀 마스터만으로 안 끝나는 이유.  
→ **내부 견적 데스크 슬롯**에 넣을 항목 = Cartage, Tunnel, Parking, Other.

### E. 환율

| 항목 | 인보이스 | 성격 |
|------|----------|------|
| USD→HKD | Ex.Rate 7.800000 (AIR FREIGHT) | 매일/고시 환율. 견적일 기준 고정 후 인보이스 시 재적용 여부 정책 필요 |

---

## 3. “고정 vs 변동”을 실무 문장으로

| 말 | 실제 의미 (WAC 자료 기준) |
|----|---------------------------|
| 고정에 가깝다 | Document, (대체로) Terminal — 마스터로 자동 |
| 주기적으로 갈아끼운다 | Air freight, Fuel, Security, CFS, Handling — **월 마스터 / CargoAI** |
| 건마다 사람이 넣는다 | **Cartage, Tunnel, Parking (+ Other)** |
| 조건부로 켠다 | DG, X-ray, ULD, Warehouse Reg, Custom Inspection |

엑셀의 `effective ~ Expiry`가 이미 **“이 표는 한 달짜리”**라고 말하고 있습니다.  
즉 로컬도 “영구 고정”이 아니라 **갱신 주기가 긴 변동**입니다.

---

## 4. 권장 운영 캘린더 (WAC용 초안)

| 주기 | 할 일 |
|------|--------|
| **매일/견적 시** | 환율; Cartage·Tunnel·Parking 입력; Spot 항공이면 CargoAI 재조회 |
| **매주** (선택) | Fuel/Security 고시 확인 (항공사·인덱스) |
| **매월 1일** | `cost item_origin` 로컬 Min/Flat 롤오버 (엑셀과 동일 패턴) |
| **분기** | Handling·CFS·Terminal 벤더/터미널 계약 점검 |
| **건별** | DG/X-ray/검사/특수트럭 발생 시 슬롯·플래그 |

차장님이 말한 “변동비만 넣으면 값 나온다” =  
**A·B는 이미 채워진 상태 + C만 입력 → Total.**

---

## 5. UI 방향: 화주/노미 홈페이지에 입력칸을 넣어도 되나?

### 결론
**공개 홈페이지(화주·노미파트너)에 Cartage/Tunnel 같은 변동비 입력칸을 두는 것은 맞지 않습니다.**

| 화면 | 누가 쓰나 | 무엇을 입력 | 무엇을 보나 |
|------|-----------|-------------|-------------|
| **외부 포털** (지금 만든 홈페이지 성격) | 화주 / 노미 | Origin·Dest, 중량·치수, 출항일, 서비스 | **All-in 견적 또는 Range + Request Quote** |
| **내부 Freight Desk** | WAC 직원 | 위 + **변동비 슬롯** + Override | 원가 분해, 마진, 메일/인보이스 초안 |

이유
1. 화주는 터널비·주차비를 모름 → 입력 시키면 견적이 틀리거나 이탈함  
2. 노미파트너도 보통 “요청 → WAC가 산출”이지, WAC 원가 구조를 직접 채우지 않음  
3. 차장님 요청은 **데스크 생산성** 도구에 가깝고, 마케팅 홈페이지와 **역할이 다름**

추천 제품 구조
1. **Public**: Instant indicative quote (항공+표준로컬 자동) + “Request formal quote”  
2. **Login / Desk**: 변동비 슬롯 + 마진 + 확정 견적·메일  
3. (나중) 파트너 포털은 Desk의 **읽기/요청**만, 원가 슬롯은 WAC만

지금 UI를 버리지 말고, **같은 브랜드 사이트 안에 Desk 모드(또는 `/desk`)를 추가**하는 쪽이 설득력 있습니다.

---

## 6. DHL은 무게·치수 넣으면 뭐가 나오나? 그건 고정값인가?

DHL **Express** 온라인 견적(소비자/스몰비즈용) 기준:

입력
- From / To, 중량, 치수(부피중량), 서비스 속도 등

나오는 것 (개념적으로)
1. **Base rate** — 존 × 과금중량 × 서비스  
2. **Optional services** — 보험, 토요 배송 등 (선택)  
3. **Surcharges** — Fuel, Remote area, Oversize, Elevated risk 등  
4. **Total**

고정인가?
- **아니요.**  
  - Base rate: Rate Guide로 **연/시즌 단위** 공시, 계정 계약이면 별도  
  - **Fuel surcharge: 인덱스 연동, 월 또는 주 단위로 변동** (공시 테이블)  
  - Remote/Oversize 등은 규칙 기반이지만 단가는 가이드에서 갱신  
- 다만 DHL은 **자사 네트워크·표준 픽업/배송**이라 Cartage/Tunnel을 화주에게 따로 안 받는 구조에 가깝고,  
  그 비용은 **운임·서차지·존 요금 안에 흡수**되어 있습니다.

WAC(포워더)와의 차이
| | DHL Express | WAC Air Forwarding |
|--|-------------|-------------------|
| 트럭 | DHL 네트워크에 포함 | 외부 트럭/현장비 **분리 청구** 흔함 |
| 화주 입력 | 주소·무게·치수만 | 동일하게 두는 게 맞음 |
| 원가 분해 | 공개 견적에 세부 원가 거의 안 줌 | 내부 Desk에서 Cartage 등 분해 |

즉 DHL처럼 보이게 만들려면 **외부에는 Total(또는 큰 카테고리)만**,  
**내부에서만** 엑셀·INV 수준의 라인 아이템을 다루는 것이 맞습니다.

---

## 7. 대기업(예: LX Pantos)은 어떻게 하나?

공개적으로 알려진 패턴 (PantosNow 등):

1. **고객용 디지털 포워딩**  
   - 구간·화물 정보 입력 → **실시간/즉시 운임 조회·부킹**  
   - Sea / Air / Rail  
   - 화주에게 “터널비 칸”을 채우게 하지 않음

2. **내부는 별도 세계**  
   - 대량 계약운임(BSA/SA), 벤더 단가, TMS/정산  
   - Pantos View 등으로 트래킹·리스크·정산 연계  
   - 영업/오퍼레이션이 **예외·특수화물·커스텀 견적** 처리

3. **이중 구조가 정답에 가까움**  
   - Front: Instant quote (표준 상품)  
   - Back: Rate master + exception(변동·특수) + 사람 승인  
   - Custom quotation 메뉴로 “맞춤 견적 요청”도 제공

WAC에 대입
- 규모는 작지만 **같은 이원화**:  
  - 홈페이지 = PantosNow식 **요청/Indicative**  
  - Desk = 차장님식 **변동비 슬롯 산출기**  
- CargoAI = 항공 조각, Local master = 엑셀, Slot = Cartage/Tunnel/Parking

---

## 8. 정리 — 다음에 만들 것

1. **외부 Instant Quote**: 무게·치수·구간만 → Air + 표준 Local (마스터) = Indicative  
2. **내부 Desk**: + Cartage / Tunnel / Parking / Other 슬롯 → Formal cost  
3. **월간 Rate 롤오버**: 엑셀과 동일한 effective/expiry  
4. 포트폴리오 문구 예:  
   “화주 포털과 내부 원가 산출(변동비 슬롯)을 분리 설계. Origin cost 마스터·실청구 인보이스 분석 기반으로 Cartage 등 건별 비용을 분리.”

---

## 부록 — 인보이스 라인 ↔ 엑셀

| INV | Excel | 분류 |
|-----|-------|------|
| AIR FREIGHT FEE | Air Freight (+Fuel/Sec 포함 가능) | A |
| HANDLING CHARGE | Agent Handling | B (고객별 단가 가능) |
| CFS CHARGE | CFS | B |
| TERMINAL CHARGE | Terminal Charge | B |
| DOCUMENT FEE | Airline Document | B |
| CARTAGE | (Airport Delivery 근사) / 실비 | **C 변동 슬롯** |
| TUNNEL FEE | 없음 | **C** |
| PARKING FEE | 없음 | **C** |

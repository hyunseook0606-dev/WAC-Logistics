# Public Quote vs Desk Quote — 이해 정리 & 주간보고용

작성 기준 자료
- `cost item_origin.xlsx` (HK EXP/IMP 로컬 마스터)
- `INV_AE260703101.pdf` (실제 청구: Cartage / Tunnel / Parking 등)
- 차장님 말씀: CargoAI만으로 안 끝나고, **변동비만 넣으면 총액이 나오게**

---

## 1. 한 줄로

| | **Public Quote (화주/노미)** | **WAC Desk (내부)** |
|--|---------------------------|---------------------|
| 누구 | 화주, 노미 파트너 | WAC 직원(데스크) |
| 목적 | “대략 얼마인지” 빠른 감 + 정식 견적 요청 | “이 건 원가가 얼마인지” 확정 산출 |
| 입력 | 구간, 치수, 무게만 | 위 + **변동비 슬롯** + 조건부 체크 |
| 결과 | 항공 Indicative (USD) | Air + Local 마스터 + Cartage 등 = Formal (HKD/USD) |

화주 화면에 Cartage/Tunnel을 넣게 하지 않은 이유:  
화주는 터널비·주차비를 모름 → 틀리거나 이탈함.  
그 칸은 **데스크가 채우는 자리**.

---

## 2. Public Quote (화주가 쓰는 것)

### 하는 일
1. Origin / Destination (예: SIN → HKG)
2. L×W×H, Gross Weight
3. C.W. = Max(실중량, 부피중량 L×W×H/6000)
4. 항공사별 **Indicative air total** 표시 (지금은 mock, 나중 CargoAI)
5. **Request Quote** → WAC에 메일로 정식 요청

### 안 하는 일
- HK 트럭비, 터널, 주차, CFS/터미널 등 **원가 분해를 화주가 입력하지 않음**
- “확정 청구액”이 아님 → 화면에 *Indicative air only*라고 적어 둔 이유

### 주간보고에 쓸 문장 예시
> 화주/노미용 Instant Quote는 구간·과금중량 기반 **항공 Indicative**만 제공하고,  
> 로컬·트럭 등 변동 원가는 Desk에서 확정하는 이원화 구조로 설계함.

---

## 3. Desk Quote (내부가 쓰는 것)

### 하는 일
차장님이 말한 “변동비만 넣으면 값이 나온다”에 해당.

| 층 | 내용 | 누가/어떻게 |
|----|------|-------------|
| **A. Air** | 항공 운임(+MYC 등) | 항공사 선택 / (추후 CargoAI) |
| **B. Local master** | Terminal, Document, Handling, CFS 등 | 엑셀 Min/Flat로 **자동** `max(Min, Flat×C.W.)` |
| **C. Variable slots** | Cartage, Tunnel, Parking, Other | **데스크가 건마다 입력** |
| **D. 조건부** | X-ray, ULD, DG, WH Reg | 체크 시에만 가산 |
| **E. FX** | USD→HKD (기본 7.8, INV 기준) | 수정 가능 |

합계 = Air(HKD 환산) + Local + Variable

### 주간보고에 쓸 문장 예시
> 내부 Desk는 `cost item_origin` EXP 마스터로 표준 로컬을 자동 계산하고,  
> 실청구(INV)에만 있던 **Cartage / Tunnel / Parking**은 변동비 슬롯으로 분리해  
> 입력 즉시 Formal Origin Cost sheet가 나오도록 구현함.

---

## 4. 비용 항목 — 자료에서 온 것 vs 가정

### ✅ 자료에 명확히 있는 것

**엑셀 EXP Local (자동 계산 후보)**  
Terminal / Airline Document / Agent Handling / CFS / ULD / Airport Delivery / X-ray / MAWB DG / Warehouse Registration  
(+ IMP에 Custom Inspection)

**인보이스에 실제로 청구된 것 (HKG→SIN, 84kg)**  
| INV 항목 | 비고 |
|----------|------|
| AIR FREIGHT FEE | USD → HKD 환산 |
| HANDLING CHARGE | |
| CFS CHARGE | MIN 적용 |
| TERMINAL CHARGE | 84×1.68 = 엑셀 Flat과 일치 |
| DOCUMENT FEE | 엑셀 Document 15와 일치 |
| **CARTAGE** | 엑셀에 없음 → 트럭/운송 |
| **TUNNEL FEE** | 엑셀에 없음 |
| **PARKING FEE** | 엑셀에 없음 |

→ 그래서 슬롯 3개를 **Cartage / Tunnel / Parking**으로 잡음.

### ⚠️ 아직 “맞다”고 단정 못 하는 것 (차장님께 확인 필요)

1. **Handling**  
   - 엑셀 Min 150 vs INV 312 → 고객별/계약별 단가인지?
2. **Airport Delivery (엑셀)** vs **Cartage (INV)**  
   - 같은 트럭비의 다른 이름인지, 둘 다 쓰는지?
3. **Fuel / Security**  
   - 항공 운임에 포함? 별도 라인? CargoAI 조회 시 어떻게?
4. **로컬 통화**  
   - 엑셀 Air는 USD, Local 칸 currency 비어 있음 / INV Local은 HKD → Desk를 HKD 기준으로 둔 것이 맞는지?
5. **마스터 갱신 주기**  
   - 엑셀 Expiry가 월말 → 매월 롤오버가 맞는지?
6. **화주에게 보여주는 범위**  
   - Indicative air만? 아니면 표준 로컬까지 포함 All-in 감?
7. **Desk 접근**  
   - 지금은 탭으로 열어 둠. 나중에 로그인/내부망만?

---

## 5. 주간업무보고서 — 이렇게 쓰면 됨

### 이번 주 진행 (복붙용)

1. **제품 이원화**  
   - Public: 화주 Indicative air quote  
   - Desk: Origin cost (로컬 자동 + 변동비 슬롯)

2. **원가 분석**  
   - `cost item_origin.xlsx` → 표준 로컬 Min/Flat 구조 반영  
   - `INV_AE260703101` → Cartage/Tunnel/Parking을 변동비로 분리

3. **UI**  
   - 기존 홈페이지 유지, Desk 모드 추가  
   - Solutions/스크롤 모션·브랜드 일러스트 개선  
   - Vercel 배포 환경 유지

4. **한계 (솔직히)**  
   - 항공은 아직 mock (CargoAI 미연동)  
   - 변동비 항목·Handling 단가·All-in 범위는 **현업 확인 후 확정** 예정

## 차장님께 — 시스템 용어 없이 물어볼 말

> 1. 견적 낼 때 **매번 손으로 넣는 비용**이 트럭비·터널·주차 맞을까요? 더 넣을 거 있으면 알려주세요.  
> 2. 터미널비·서류비·CFS 같은 건 **평소 쓰는 단가표(엑셀) 숫자로 자동** 붙여도 될까요?  
> 3. 엑셀에 있는 Airport Delivery랑 청구서 Cartage가 **같은 트럭비**인가요?  
> 4. Handling이 엑셀 150인데 청구서는 312인데, **거래처마다 다른 건가요?**  
> 5. 손님(화주) 화면에는 **항공 대략 금액만** 보여주고, 자세한 원가는 저희만 보는 게 맞을까요?  
> 6. 단가표는 **한 달에 한 번** 갈아끼우면 될까요?  
> 7. 앞으로 단가 바꿀 때 엑셀 파일을 시스템에 연결하는 게 나을까요, 아니면 숫자만 알려주시면 저희가 바꿔도 될까요?


---

## 6. 내가 아직 헷갈릴 때 체크

| 헷갈림 | 답 |
|--------|-----|
| 엑셀이랑 Desk가 같은 거 아님? | 수식은 비슷함. 차이는 **한 화면·자동 로컬·변동만 입력·견적서/시트 출력·나중에 API** |
| 화주도 Desk 쓰나? | 아니요. 화주는 Public만 |
| CargoAI 붙이면 Desk 필요 없나? | 아니요. CargoAI는 주로 **항공**. 트럭/터널은 여전히 슬롯 |
| 지금 숫자가 “진짜 청구액”인가? | Public은 감. Desk는 마스터+입력 가정. **현업 확인 전엔 파일럿** |

---

## 7. 면접/성과용 한 줄 (나중에)

> 포워딩 Origin 원가를 ‘표준 마스터 + 건별 변동비 슬롯’으로 분리하고,  
> 화주 포털과 내부 Desk UI를 이원화해 견적 산출 워크플로 MVP를 배포함.

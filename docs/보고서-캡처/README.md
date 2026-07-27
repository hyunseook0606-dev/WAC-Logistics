# Instant Quote — screen pack (demo / report)

사이트: https://wac-logistics.vercel.app/#quote  
폴더: `docs/보고서-캡처/`  
수치·검증 표: [`../검증-메트릭.md`](../검증-메트릭.md)

코드 설명 없이 **화면만** 보여도 됩니다. Word/PPT에 아래 순서·캡션으로 붙여넣으세요.

---

## 보고서에 넣을 순서

### 그림 1. Public Quote (화주용)
**파일:** `01-public-quote.png`  
**캡션:** 구간·치수·중량만 입력 → C.W.와 항공사별 Indicative air(USD) 비교.  
트럭·터널·주차 등 로컬 변동비는 화주가 입력하지 않음.

### 그림 2. WAC Desk — 변동비 입력
**파일:** `02-desk-variable-slots.png`  
**캡션:** 내부 Desk. Cartage / Tunnel / Parking만 건마다 입력.  
로컬 마스터(Terminal, CFS 등)는 C.W. 기준으로 자동 계산.

### 그림 3. Formal Origin Cost + 항목표
**파일:** `03-desk-line-items.png`  
**캡션:** Air + Local master + Variable 합산 → Formal Origin Cost(HKD/USD).  
우측 표에 항목별 금액이 즉시 반영됨.

### 그림 4. Desk Copy Cost Sheet → 메일/문서 붙여넣기 결과
**파일:** `04-copy-paste-table.png`  
**캡션:** Desk에서 **Copy Cost Sheet** 클릭 후 Outlook·Word에 붙여넣으면  
위와 같이 **Formal Origin Cost 표**로 들어감. (총액 HKD/USD)

### 그림 5. Public Copy Email Draft → 메일 붙여넣기 결과 ★
**파일:** `05-public-email-paste.png`  
**캡션:** Public의 **Copy Email Draft** 후 메일에 붙여넣으면  
**항공사 weight-break 요율표 + Indicative air(USD)** 형식으로 들어감.  
예전에 보신 항공사 운임 메일과 같은 역할. (Cartage Formal 총액 아님)

시연 HTML: `05-public-email-paste.html`

---

## 나. 프로젝트 진행내용 (문장 + 그림 안내)

항공 수출 견적을 **화주용 Public Quote**와 **내부용 WAC Desk**로 나누어 웹으로 구현·배포했습니다.  
화주는 구간·치수·중량만 넣어 과금중량(C.W.)과 항공 Indicative를 확인하고(그림 1),  
내부 Desk는 엑셀 로컬 마스터로 표준 원가를 자동 계산한 뒤 Cartage·Tunnel·Parking 등 변동비만 입력하면 Formal Origin Cost가 산출됩니다(그림 2·3).  
산출 결과는 **Copy Cost Sheet**로 Outlook·Word에 표로 바로 붙여넣을 수 있습니다(그림 4).  

라이브: https://wac-logistics.vercel.app  

---

## 영상 시연이 필요할 때 (30초 스크립트)

1. 사이트 접속 → Instant Quote  
2. Calculate Quote → 항공사 카드 보이기 (그림 1)  
3. **WAC Desk** 전환 → Cartage 650 등 보이기 (그림 2)  
4. 우측 Formal Cost·항목표 가리키기 (그림 3)  
5. **Copy Cost Sheet** 클릭 → Outlook/Word에 Ctrl+V → 표 등장 (그림 4)  

Windows: `Win+G` 또는 PowerPoint 화면 녹화로 충분합니다.

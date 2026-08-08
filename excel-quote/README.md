# WAC Air Quotation Simulator (Excel)

**제출 파일:** `WAC_Air_Quotation_Simulator.xlsx`

CM팀 의뢰용 엑셀 가견적기. 웹 Instant Quote와는 **별도 산출물**이며, 회사 제출·클라우드는 이 파일을 기준으로 한다.

## 시트

| 시트 | 역할 |
|------|------|
| Master_DB | Backend — 요율·로컬 단가 (노란 칸만 갱신) |
| Quote | Frontend — 원페이지 입력·Breakdown·TOTAL |
| Guide | 사용·검증 CASE (제출용 안내) |

## 검증

의뢰서 CASE A/B/C (ICN-HKG)로 로직 확인. 상세는 Guide 시트.

재생성: `python build_workbook.py`

## 웹 연동 (포폴)

동일 xlsx가 `public/excel/`에 포함되어 있으며, 사이트 Desk에서 Master_DB import 가능.  
실무 공용 도구는 엑셀이며, 웹 연동은 포트폴리오 데모용이다.

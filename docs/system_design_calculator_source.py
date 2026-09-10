#!/usr/bin/env python3
"""
System_Design_Master_Calculator.xlsx builder
Principal Systems Architect + Excel Engineer version.
"""
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, NamedStyle
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.chart import LineChart, PieChart, BarChart, Reference
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.comments import Comment

wb = Workbook()
wb.remove(wb.active)

# ---------- COLOR PALETTE ----------
COL = {
    'input':    'FFF3CD',
    'intermed': 'D1ECF1',
    'final':    'D4EDDA',
    'warning':  'F8D7DA',
    'cloud':    'E2D9F3',
    'header':   '2C3E50',
    'subhead':  '4A6FA5',
    'band':     'F2F2F2',
}
FONT_NAME = 'Arial'

FILL_INPUT   = PatternFill('solid', fgColor=COL['input'])
FILL_INTER   = PatternFill('solid', fgColor=COL['intermed'])
FILL_FINAL   = PatternFill('solid', fgColor=COL['final'])
FILL_WARNING = PatternFill('solid', fgColor=COL['warning'])
FILL_CLOUD   = PatternFill('solid', fgColor=COL['cloud'])
FILL_HEADER  = PatternFill('solid', fgColor=COL['header'])
FILL_SUBHEAD = PatternFill('solid', fgColor=COL['subhead'])
FILL_BAND    = PatternFill('solid', fgColor=COL['band'])

FONT_HEADER = Font(name=FONT_NAME, bold=True, color='FFFFFF', size=12)
FONT_SUBHEAD = Font(name=FONT_NAME, bold=True, color='FFFFFF', size=10)
FONT_TITLE = Font(name=FONT_NAME, bold=True, size=16, color='2C3E50')
FONT_BOLD = Font(name=FONT_NAME, bold=True, size=10)
FONT_NORMAL = Font(name=FONT_NAME, size=10)
FONT_ITALIC = Font(name=FONT_NAME, italic=True, size=9, color='555555')
FONT_TALK = Font(name=FONT_NAME, italic=True, size=10, color='1B4F72')

THIN = Side(style='thin', color='BFBFBF')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

WRAP = Alignment(wrap_text=True, vertical='top')
WRAP_C = Alignment(wrap_text=True, vertical='center')
CENTER = Alignment(horizontal='center', vertical='center')

# Track named ranges to define at the very end
NAMED_RANGES = {}

def nr(name, sheet, cell):
    NAMED_RANGES[name] = f"'{sheet}'!${cell[0]}${cell[1:]}" if False else None

def add_named_range(name, sheet_title, cell_ref):
    """cell_ref like 'B5'"""
    col = ''.join(filter(str.isalpha, cell_ref))
    row = ''.join(filter(str.isdigit, cell_ref))
    NAMED_RANGES[name] = f"'{sheet_title}'!${col}${row}"

def finalize_named_ranges():
    for name, ref in NAMED_RANGES.items():
        try:
            wb.defined_names[name] = DefinedName(name, attr_text=ref)
        except Exception as e:
            print("NR fail", name, ref, e)

def style_title(ws, text, span=5, row=1):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=span)
    c = ws.cell(row=row, column=1, value=text)
    c.font = FONT_TITLE
    c.alignment = Alignment(horizontal='left', vertical='center')
    ws.row_dimensions[row].height = 26

def header_row(ws, row, headers, fill=FILL_HEADER, font=FONT_HEADER):
    for i, h in enumerate(headers, start=1):
        c = ws.cell(row=row, column=i, value=h)
        c.fill = fill
        c.font = font
        c.alignment = CENTER
        c.border = BORDER
    ws.row_dimensions[row].height = 20

def section_bar(ws, row, text, span=5):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=span)
    c = ws.cell(row=row, column=1, value=text)
    c.fill = FILL_SUBHEAD
    c.font = FONT_SUBHEAD
    c.alignment = Alignment(horizontal='left', vertical='center', indent=1)
    ws.row_dimensions[row].height = 18

def talk_track(ws, row, text, span=5, height=60):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=span)
    c = ws.cell(row=row, column=1, value="\U0001F3A4 INTERVIEW TALK TRACK:  " + text)
    c.font = FONT_TALK
    c.alignment = WRAP
    c.fill = PatternFill('solid', fgColor='EAF2F8')
    c.border = BORDER
    ws.row_dimensions[row].height = height
    return row + 1

def calc_row(ws, row, step, formula_text, calc_formula, notes, kind='intermed'):
    """5-column calc row: Step | Formula(text) | Live Calc | Result | Notes"""
    fill = {'input': FILL_INPUT, 'intermed': FILL_INTER, 'final': FILL_FINAL,
            'warning': FILL_WARNING, 'cloud': FILL_CLOUD}[kind]
    ws.cell(row=row, column=1, value=step).font = FONT_NORMAL
    ws.cell(row=row, column=2, value=formula_text).font = Font(name='Consolas', size=9)
    c3 = ws.cell(row=row, column=3, value=calc_formula)
    c3.fill = fill
    c3.font = FONT_BOLD
    c4 = ws.cell(row=row, column=4, value=f"=C{row}")
    c4.fill = fill
    c4.font = FONT_BOLD
    c4.number_format = '#,##0.00'
    ws.cell(row=row, column=5, value=notes).font = FONT_ITALIC
    for col in range(1, 6):
        ws.cell(row=row, column=col).border = BORDER
        ws.cell(row=row, column=col).alignment = WRAP if col in (2, 5) else Alignment(vertical='center')
    return row + 1

def calc_header(ws, row):
    header_row(ws, row, ["Step", "Formula (human-readable)", "Live Calculation", "Result", "Derivation Notes"],
                fill=FILL_SUBHEAD, font=FONT_SUBHEAD)
    return row + 1

def set_colwidths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

def print_setup(ws, fit_width=True):
    ws.page_setup.orientation = 'landscape'
    ws.page_setup.fitToPage = True
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.print_options.horizontalCentered = True
    ws.oddHeader.center.text = "&B&12System Design Master Calculator"
    ws.oddFooter.center.text = "&P of &N"
    ws.freeze_panes = "A1"

print("Setup complete")

# =====================================================================
# SHEET 00: README
# =====================================================================
ws = wb.create_sheet("00_README")
print_setup(ws)
set_colwidths(ws, [28, 70, 18, 18, 18])
style_title(ws, "System Design Master Calculator — How To Use This Workbook")
r = 3
section_bar(ws, r, "PURPOSE"); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("One formula-driven model of an Amazon/Flipkart-scale e-commerce platform, "
    "front door to backend to cost. Change the inputs on 01_Master_Inputs and every sheet recalculates: "
    "user metrics -> CDN -> gateway -> load balancer -> backend services -> network latency -> Kafka -> "
    "Postgres -> Redis -> DLQ -> traffic spikes -> observability -> cloud mapping -> cost.")).alignment = WRAP
ws.row_dimensions[r].height = 45
r += 2

section_bar(ws, r, "COLOR LEGEND"); r += 1
legend = [
    ("Yellow", FILL_INPUT, "Input — the only cells you should type over. All live on 01_Master_Inputs (plus the scenario cell)."),
    ("Blue", FILL_INTER, "Intermediate calculation — derived, feeds another formula downstream."),
    ("Green", FILL_FINAL, "Final recommendation — the number you say out loud in the interview."),
    ("Red", FILL_WARNING, "Warning / bottleneck — headroom too thin, SLA breach, or a scaling limit."),
    ("Purple", FILL_CLOUD, "Cloud-specific mapping — AWS/GCP/Azure/VPS service equivalence."),
]
for name, fill, desc in legend:
    ws.cell(row=r, column=1, value=name).fill = fill
    ws.cell(row=r, column=1).font = FONT_BOLD
    ws.cell(row=r, column=1).border = BORDER
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)
    ws.cell(row=r, column=2, value=desc).alignment = WRAP
    ws.cell(row=r, column=2).border = BORDER
    ws.row_dimensions[r].height = 28
    r += 1
r += 1

section_bar(ws, r, "SHEET MAP (data-flow order)"); r += 1
sheets_map = [
    "01_Master_Inputs - control panel + scenario dropdown",
    "02_User_Metrics - MAU/DAU/PCU/RPS",
    "03_Frontend_CDN - static assets, CDN offload",
    "04_API_Gateway - rate limiting, auth, WAF, resilience",
    "05_Load_Balancer - L4/L7, TLS, connections",
    "06_Backend_Services - microservice sizing table",
    "07_Network_Latency - hop-by-hop budget, SLA check",
    "08_Kafka_Design - brokers, partitions, topics, KRaft",
    "09_Database_Design - QPS, IOPS, connections, storage",
    "10_Cache_Redis - memory sizing, ops, cluster config",
    "11_DLQ_Error_Handling - retries, DLQ schema, reprocessing",
    "12_Traffic_Spikes_DDoS - autoscale math, load shedding",
    "13_Observability - metrics/logs/traces volume, SLOs",
    "14_Cloud_Provider_Mapping - AWS vs GCP vs Azure vs VPS",
    "15_Cloud_Infra_Picker - instance types cheat sheet",
    "16_Cost_Estimator - monthly/annual cost",
    "17_Final_Summary_Cheatsheet - one-page whiteboard script",
    "18_Interview_Practice - 10 scenarios with model answers",
]
for s in sheets_map:
    ws.cell(row=r, column=1, value="\u2192").alignment = CENTER
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)
    ws.cell(row=r, column=2, value=s).font = FONT_NORMAL
    r += 1
r += 1
section_bar(ws, r, "HOW TO RUN A SCENARIO"); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("Go to 01_Master_Inputs, cell B2. Pick Normal / Flash Sale / Black Friday / "
    "Cyber Monday / DDoS from the dropdown. DAU%, Peak-concurrency% and the spike multiplier are pulled via "
    "INDEX/MATCH from the hidden 'Scenarios' sheet, and every downstream sheet recalculates instantly.")).alignment = WRAP
ws.row_dimensions[r].height = 45
r += 2
section_bar(ws, r, "PRINTING"); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("Every sheet is pre-set to landscape, fit-to-1-page-wide, with a repeating header. "
    "File > Print > Entire Workbook to produce your physical cheat-deck.")).alignment = WRAP
ws.row_dimensions[r].height = 30

# =====================================================================
# SHEET (hidden): Scenarios lookup table
# =====================================================================
sc = wb.create_sheet("Scenarios")
header_row(sc, 1, ["Scenario", "DAU_PCT", "PEAK_CONCURRENT_PCT", "Spike_Multiplier"])
scenario_data = [
    ("Normal", 20, 20, 1),
    ("Flash Sale", 30, 30, 5),
    ("Black Friday", 50, 50, 10),
    ("Cyber Monday", 60, 60, 15),
    ("DDoS", 20, 100, 100),
]
for i, row_data in enumerate(scenario_data, start=2):
    for j, val in enumerate(row_data, start=1):
        sc.cell(row=i, column=j, value=val)
set_colwidths(sc, [16, 12, 20, 16])
sc.sheet_state = 'hidden'

print("00_README + Scenarios done")

# =====================================================================
# SHEET 01: MASTER INPUTS
# =====================================================================
mi = wb.create_sheet("01_Master_Inputs")
print_setup(mi)
set_colwidths(mi, [34, 16, 10, 46, 10])
style_title(mi, "01 - Master Inputs  (Control Panel)")

mi.cell(row=2, column=1, value="SCENARIO:").font = Font(name=FONT_NAME, bold=True, size=12)
mi.cell(row=2, column=2, value="Normal").fill = FILL_INPUT
mi.cell(row=2, column=2).font = Font(name=FONT_NAME, bold=True, size=12)
mi.cell(row=2, column=2).border = BORDER
dv = DataValidation(type="list", formula1='"Normal,Flash Sale,Black Friday,Cyber Monday,DDoS"', allow_blank=False)
mi.add_data_validation(dv)
dv.add(mi["B2"])
mi.merge_cells(start_row=2, start_column=4, end_row=2, end_column=5)
mi.cell(row=2, column=4, value="<- Pick a scenario. Drives DAU%, Peak-Concurrent% and Spike Multiplier below via INDEX/MATCH.").font = FONT_ITALIC
add_named_range("Scenario_Cell", "01_Master_Inputs", "B2")

r = 4

BLOCKS = {}  # name -> list of (label, value_or_formula, notes, is_formula)

BLOCKS['A - USER METRICS'] = [
    ("MAU", 10000000, "Monthly active users"),
    ("DAU_PCT", ("=INDEX(Scenarios!$B$2:$B$6,MATCH($B$2,Scenarios!$A$2:$A$6,0))"), "% of MAU active daily - driven by Scenario dropdown"),
    ("PEAK_CONCURRENT_PCT", ("=INDEX(Scenarios!$C$2:$C$6,MATCH($B$2,Scenarios!$A$2:$A$6,0))"), "% of DAU online at peak - driven by Scenario dropdown"),
    ("ACTIONS_PER_SESSION", 30, "API calls per user session"),
    ("PEAK_DURATION_SEC", 3600, "Window over which peak concurrency is spread"),
    ("SAFETY_BUFFER", 2, "Multiplier applied to raw RPS for headroom"),
]
BLOCKS['B - TRAFFIC SHAPE'] = [
    ("READ_WRITE_SPLIT_READ_PCT", 80, "% of DB traffic that is reads"),
    ("CACHE_HIT_PCT", 95, "% of reads served from Redis"),
    ("QUERIES_PER_API_CALL", 3, "Average DB queries fired per API call"),
    ("AVG_RESPONSE_SIZE_KB", 50, "Average API response payload"),
    ("AVG_REQUEST_SIZE_KB", 2, "Average API request payload"),
]
BLOCKS['C - KAFKA / MESSAGING'] = [
    ("AVG_MSG_SIZE_KB", 1, "Average Kafka message size"),
    ("REPLICATION_FACTOR", 3, "Kafka topic replication factor"),
    ("PRODUCER_PER_PARTITION_MBPS", 10, "Max sustained producer throughput per partition"),
    ("CONSUMER_PER_PARTITION_MBPS", 5, "Max sustained consumer throughput per partition"),
    ("BROKER_CAPACITY_MBPS", 500, "Usable network throughput per broker"),
    ("MIN_BROKERS_HA", 3, "Minimum brokers for HA (survive 1 failure with RF=3)"),
    ("BROKER_MULTIPLE", 6, "Round partitions up to a multiple of this many brokers"),
    ("TOPIC_RETENTION_DAYS", 7, "Default topic retention"),
]
BLOCKS['D - DATABASE'] = [
    ("DB_ROW_SIZE_KB", 2, "Average row size incl. overhead"),
    ("DB_HOT_RETENTION_DAYS", 30, "Days of hot/OLTP data kept on primary"),
    ("DB_CONN_MULTIPLIER", 2, "Connections per core multiplier"),
    ("DB_CONN_OVERHEAD", 1, "Fixed connection overhead per instance"),
    ("DB_READ_REPLICA_QPS", 5000, "Read QPS one replica can sustain"),
    ("DB_SSD_IOPS_PER_GB", 50, "IOPS delivered per GB of gp3/io2 volume"),
    ("DB_IOPS_PER_QUERY", 1.2, "Average IOPS consumed per query"),
]
BLOCKS['E - CACHE'] = [
    ("SESSION_SIZE_KB", 1.5, "Bytes per cached session"),
    ("CATALOG_SKUS", 500000, "Total SKUs in catalog"),
    ("CATALOG_ENTRY_KB", 3, "Cached catalog entry size"),
    ("HOT_SKU_COUNT", 100000, "SKUs cached hot (top sellers)"),
    ("HOT_SKU_ENTRY_KB", 1, "Hot SKU cache entry size"),
    ("CACHE_OVERHEAD_FACTOR", 1.3, "Redis metadata/fragmentation overhead"),
    ("REDIS_SHARDS", 3, "Cluster shard count"),
    ("REDIS_HEADROOM", 1.5, "Headroom multiplier per shard"),
    ("REDIS_OPS_PER_NODE", 100000, "Sustained ops/sec per Redis node"),
]
BLOCKS['F - APPLICATION SERVERS'] = [
    ("Cores_Per_App_Instance", 4, "vCPU per app pod/instance"),
    ("RAM_Per_App_Instance_GB", 8, "RAM per app pod/instance"),
    ("Order_Svc_Instances", 6, "Order service pod count"),
    ("Payment_Svc_Instances", 4, "Payment service pod count"),
    ("Inventory_Svc_Instances", 4, "Inventory service pod count"),
    ("Notification_Svc_Instances", 3, "Notification service pod count"),
    ("Search_Svc_Instances", 3, "Search service pod count"),
    ("Gateway_Instances", 3, "Baseline gateway pod count (before sizing calc)"),
    ("RPS_Per_App_Instance", 2000, "RPS one generic app instance can sustain"),
]
BLOCKS['G - API GATEWAY / EDGE'] = [
    ("Gateway_RPS_Capacity", 3000, "Max RPS a gateway node can handle at 100% CPU"),
    ("Gateway_CPU_Util_Target", 60, "Target CPU utilization (%) for headroom"),
    ("Gateway_Overhead_ms", 3, "Routing/auth/rate-limit overhead per request"),
    ("SSL_Handshake_ms", 5, "Cost of a full TLS handshake"),
    ("SSL_Rate_Pct", 10, "% of requests that pay a full handshake (rest reuse session)"),
    ("WAF_Rules", 20, "Active WAF rule count"),
    ("Rate_Limit_Anonymous_RPM", 10, "Requests/min allowed - anonymous"),
    ("Rate_Limit_User_RPM", 100, "Requests/min allowed - logged-in user"),
    ("Rate_Limit_Premium_RPM", 500, "Requests/min allowed - premium tier"),
]
BLOCKS['H - NETWORK / LATENCY'] = [
    ("DNS_Lookup_ms", 5, "DNS resolution"),
    ("CDN_Edge_ms", 10, "Edge PoP round trip"),
    ("CDN_Origin_Miss_ms", 30, "Extra hop to origin on cache miss"),
    ("LB_Forward_ms", 2, "Load balancer forwarding"),
    ("Service_Process_ms", 20, "Business-logic processing time"),
    ("DB_Query_ms", 5, "Indexed DB query"),
    ("Redis_Query_ms", 1, "Cache read"),
    ("SLA_P95_ms", 200, "Target P95 latency SLA"),
]
BLOCKS['I - DLQ / RETRY'] = [
    ("Max_Retries", 3, "Retry attempts before DLQ"),
    ("Retry_Backoff_Base_sec", 5, "First retry delay"),
    ("Retry_Backoff_Multiplier", 2, "Exponential backoff multiplier"),
    ("DLQ_Retention_Days", 30, "How long DLQ messages are kept"),
    ("Reprocess_Batch_Size", 1000, "Messages replayed per batch"),
    ("Reprocess_Interval_min", 15, "How often on-call reprocesses DLQ"),
]
BLOCKS['J - TRAFFIC SPIKE / DDOS'] = [
    ("Spike_Multiplier", ("=INDEX(Scenarios!$D$2:$D$6,MATCH($B$2,Scenarios!$A$2:$A$6,0))"), "Multiplier on Peak RPS - driven by Scenario dropdown"),
    ("DDoS_Peak_RPS", 1000000, "Assumed peak RPS during a DDoS burst"),
    ("Auto_Scale_Trigger_CPU", 70, "CPU% that triggers HPA scale-out"),
    ("Auto_Scale_Cooldown_sec", 60, "Cooldown before another scale event"),
    ("Load_Shed_Threshold_Pct", 90, "% of capacity at which load shedding begins"),
]
BLOCKS['K - OBSERVABILITY'] = [
    ("Metrics_Retention_Days", 15, "Prometheus/Thanos retention"),
    ("Log_Retention_Days", 30, "Log retention"),
    ("Trace_Sample_Rate_Pct", 1, "% of requests traced"),
    ("Log_Size_Per_Request_KB", 2, "Average log volume per request"),
]
BLOCKS['L - COST (AWS us-east-1, on-demand, USD)'] = [
    ("Cost_Broker_hr", 0.384, "m6i.2xlarge"),
    ("Cost_App_hr", 0.17, "c6i.xlarge"),
    ("Cost_DB_hr", 0.504, "r6i.2xlarge"),
    ("Cost_Redis_hr", 0.226, "cache.r6g.xlarge"),
    ("Cost_Gateway_hr", 0.17, "c6i.xlarge"),
    ("Cost_NLB_hr", 0.0225, "Network Load Balancer"),
    ("Cost_Hours_Month", 730, "Hours per month"),
    ("Cost_Egress_Per_GB", 0.09, "Internet egress"),
    ("Cost_S3_Per_TB", 23, "S3 standard storage"),
    ("Cost_CDN_Per_GB", 0.085, "CloudFront/CDN egress"),
]

for block_name, items in BLOCKS.items():
    section_bar(mi, r, block_name); r += 1
    for label, val, notes in items:
        mi.cell(row=r, column=1, value=label).font = FONT_NORMAL
        cell = mi.cell(row=r, column=2)
        is_formula = isinstance(val, str) and val.startswith("=")
        cell.value = val
        cell.fill = FILL_INTER if is_formula else FILL_INPUT
        cell.font = FONT_BOLD
        cell.border = BORDER
        cell.number_format = '#,##0.####'
        mi.merge_cells(start_row=r, start_column=4, end_row=r, end_column=5)
        mi.cell(row=r, column=4, value=notes).font = FONT_ITALIC
        mi.cell(row=r, column=1).border = BORDER
        add_named_range(label, "01_Master_Inputs", f"B{r}")
        r += 1
    r += 1

MASTER_INPUTS_LAST_ROW = r
print("01_Master_Inputs done, last row", r)

# =====================================================================
# SHEET 02: USER METRICS
# =====================================================================
ws = wb.create_sheet("02_User_Metrics")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 42])
style_title(ws, "02 - User Metrics  (MAU -> DAU -> PCU -> RPS)")
r = 3
r = calc_header(ws, r)

r0 = r
r = calc_row(ws, r, "1. DAU", "MAU * DAU_PCT/100", "=MAU*DAU_PCT/100", "Daily active users", 'final')
add_named_range("DAU", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "2. Peak Concurrent Users (PCU)", "DAU * PEAK_CONCURRENT_PCT/100", f"=DAU*PEAK_CONCURRENT_PCT/100", "Users online simultaneously at peak", 'final')
add_named_range("PCU", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "3. Raw API RPS", "(PCU * ACTIONS_PER_SESSION) / PEAK_DURATION_SEC", "=PCU*ACTIONS_PER_SESSION/PEAK_DURATION_SEC", "Unbuffered request rate", 'intermed')
add_named_range("Raw_RPS", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "4. Peak API RPS", "Raw RPS * SAFETY_BUFFER", "=Raw_RPS*SAFETY_BUFFER", "This is the anchor number for every downstream sheet", 'final')
add_named_range("Peak_RPS", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "5. Daily Requests", "DAU * ACTIONS_PER_SESSION", "=DAU*ACTIONS_PER_SESSION", "", 'intermed')
add_named_range("Daily_Requests", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "6. Monthly Requests", "Daily Requests * 30", "=Daily_Requests*30", "", 'intermed')
add_named_range("Monthly_Requests", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "7. Peak Bandwidth (MB/s)", "Peak RPS * AVG_RESPONSE_SIZE_KB / 1024", "=Peak_RPS*AVG_RESPONSE_SIZE_KB/1024", "", 'intermed')
add_named_range("Peak_Bandwidth_MBps", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "8. Peak Bandwidth (Gbps)", "MB/s * 8 / 1000", "=Peak_Bandwidth_MBps*8/1000", "", 'intermed')
r = calc_row(ws, r, "9. Daily Egress (GB)", "Daily Requests * AVG_RESPONSE_SIZE_KB / 1024 / 1024", "=Daily_Requests*AVG_RESPONSE_SIZE_KB/1024/1024", "", 'intermed')
add_named_range("Daily_Egress_GB", "02_User_Metrics", f"C{r-1}")
r = calc_row(ws, r, "10. Monthly Egress (TB)", "Daily Egress GB * 30 / 1024", "=Daily_Egress_GB*30/1024", "Feeds CDN + cost sheets", 'final')
add_named_range("Monthly_Egress_TB", "02_User_Metrics", f"C{r-1}")

r += 1
r = talk_track(ws, r, ("Assuming 10M MAU and a 20% DAU ratio, we get 2M DAU. During peak, 20% are online "
    "simultaneously -- that's 400k concurrent. Each user makes 30 calls, so raw RPS is about 3.3k, and with "
    "a 2x safety buffer we anchor on roughly 7k RPS. Every downstream sizing decision in this workbook traces "
    "back to that one number."))
print("02_User_Metrics done")

# =====================================================================
# SHEET 03: FRONTEND & CDN
# =====================================================================
ws = wb.create_sheet("03_Frontend_CDN")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 42])
style_title(ws, "03 - Frontend & CDN")
r = 3
section_bar(ws, r, "ASSUMPTIONS"); r += 1
assumptions = [
    ("Static_Asset_MB_Per_User", 2, "MB of static assets (JS/CSS/images) per user per day"),
    ("CDN_Cache_Hit_Ratio_Pct", 98, "% of static requests served at the edge"),
    ("Edge_Node_Capacity_RPS", 5000, "RPS one edge PoP can serve"),
    ("CDN_PoPs_Global", 200, "Number of global CDN PoPs"),
    ("Compression_Reduction_Pct", 70, "Bandwidth reduction from HTTP/3 + Brotli"),
    ("Service_Worker_Hit_Pct", 40, "% of repeat users served from local SW cache"),
]
for label, val, notes in assumptions:
    ws.cell(row=r, column=1, value=label).font = FONT_NORMAL
    c = ws.cell(row=r, column=2, value=val)
    c.fill = FILL_INPUT; c.font = FONT_BOLD; c.border = BORDER
    ws.merge_cells(start_row=r, start_column=4, end_row=r, end_column=5)
    ws.cell(row=r, column=4, value=notes).font = FONT_ITALIC
    add_named_range(label, "03_Frontend_CDN", f"B{r}")
    r += 1
r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Total Static Data/day (GB)", "DAU * Static_Asset_MB_Per_User / 1024", "=DAU*Static_Asset_MB_Per_User/1024", "", 'intermed')
r = calc_row(ws, r, "2. Origin Traffic/day (GB)", "Total * (1 - CDN_Cache_Hit_Ratio_Pct/100)", f"=C{r-1}*(1-CDN_Cache_Hit_Ratio_Pct/100)", "What actually reaches origin", 'final')
r = calc_row(ws, r, "3. Required Edge Nodes", "ROUNDUP(Peak RPS / Edge_Node_Capacity_RPS, 0)", "=ROUNDUP(Peak_RPS/Edge_Node_Capacity_RPS,0)", "", 'intermed')
r = calc_row(ws, r, "4. CDN Bandwidth Peak (Gbps)", "Peak RPS * 2MB * 8 / 1024 / 1000", "=Peak_RPS*Static_Asset_MB_Per_User*8/1024/1000", "", 'intermed')
r = calc_row(ws, r, "5. Effective Bandwidth after compression (Gbps)", "Peak Gbps * (1 - Compression_Reduction_Pct/100)", f"=C{r-1}*(1-Compression_Reduction_Pct/100)", "HTTP/3 + Brotli", 'final')
r = calc_row(ws, r, "6. Service-Worker-Absorbed Requests/s", "Peak RPS * Service_Worker_Hit_Pct/100", "=Peak_RPS*Service_Worker_Hit_Pct/100", "Never leaves the browser", 'intermed')
r = calc_row(ws, r, "7. Origin-Bound Dynamic RPS", "Peak RPS * (1 - CDN_Cache_Hit_Ratio_Pct/100)", "=Peak_RPS*(1-CDN_Cache_Hit_Ratio_Pct/100)", "This is what the gateway must actually absorb", 'final')
add_named_range("Origin_Dynamic_RPS", "03_Frontend_CDN", f"C{r-1}")
r += 1
r = talk_track(ws, r, ("98% of static traffic never reaches our origin. For 7k peak RPS, the origin only sees "
    "about 140 RPS of dynamic API traffic. The CDN handles the rest across 200+ global PoPs -- that's why our "
    "gateway is sized for thousands of RPS, not hundreds of thousands."))
print("03 done")

# =====================================================================
# SHEET 04: API GATEWAY & EDGE
# =====================================================================
ws = wb.create_sheet("04_API_Gateway")
print_setup(ws)
set_colwidths(ws, [32, 44, 20, 16, 42])
style_title(ws, "04 - API Gateway & Edge")
r = 3
section_bar(ws, r, "A. SIZING"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Effective RPS/instance", "Gateway_RPS_Capacity * Gateway_CPU_Util_Target/100", "=Gateway_RPS_Capacity*Gateway_CPU_Util_Target/100", "", 'intermed')
add_named_range("Gateway_Effective_RPS", "04_API_Gateway", f"C{r-1}")
r = calc_row(ws, r, "2. Raw Gateway Instances", "ROUNDUP(Peak RPS / Effective RPS, 0)", "=ROUNDUP(Peak_RPS/Gateway_Effective_RPS,0)", "", 'intermed')
r = calc_row(ws, r, "3. Availability Zones", "Fixed", "=3", "Multi-AZ standard", 'input')
add_named_range("Gateway_AZs", "04_API_Gateway", f"C{r-1}")
r = calc_row(ws, r, "4. Per-AZ Instances (N+1)", "ROUNDUP(Raw / Zones, 0) + 1", f"=ROUNDUP(C{r-2}/Gateway_AZs,0)+1", "", 'intermed')
r = calc_row(ws, r, "5. Total Gateway Instances (sized)", "Per-AZ * Zones", f"=C{r-1}*Gateway_AZs", "Use this, not Gateway_Instances input, for downstream cost/capacity", 'final')
add_named_range("Gateway_Instances_Sized", "04_API_Gateway", f"C{r-1}")
r = calc_row(ws, r, "6. Gateway Latency Added (ms)", "Gateway_Overhead_ms + SSL_Handshake_ms*SSL_Rate_Pct/100", "=Gateway_Overhead_ms+SSL_Handshake_ms*SSL_Rate_Pct/100", "", 'final')
add_named_range("Gateway_Latency_ms", "04_API_Gateway", f"C{r-1}")
r = calc_row(ws, r, "7. Gateway CPU Cores Total", "Total Instances * Cores_Per_App_Instance", "=Gateway_Instances_Sized*Cores_Per_App_Instance", "", 'intermed')
r += 1
section_bar(ws, r, "B. RATE LIMITING"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "8. Rate-Limit Redis Ops/s", "Peak RPS * 2 (INCR + EXPIRE)", "=Peak_RPS*2", "", 'intermed')
r = calc_row(ws, r, "9. Rate-Limit Memory (MB)", "DAU * 200 bytes / 1024 / 1024", "=DAU*200/1024/1024", "", 'intermed')
r = calc_row(ws, r, "10. Estimated Reject % (DDoS signal)", "0.5% of peak", "=0.5", "Fixed heuristic", 'input')
r += 1
tiers = [("Anonymous","Rate_Limit_Anonymous_RPM","10x","In-memory + Redis","Fixed window"),
         ("Logged-in User","Rate_Limit_User_RPM","5x","Redis","Sliding window"),
         ("Premium","Rate_Limit_Premium_RPM","3x","Redis","Sliding window"),
         ("Internal Service","N/A - mTLS trusted","N/A","N/A","None (mesh-level)")]
header_row(ws, r, ["Tier","RPM","Burst","Storage","Algorithm"]); r += 1
for t in tiers:
    for i, v in enumerate(t, start=1):
        c = ws.cell(row=r, column=i, value=("="+v if v.startswith("Rate_Limit") else v))
        c.border = BORDER; c.font = FONT_NORMAL
    r += 1
r += 1
section_bar(ws, r, "C. AUTH"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "11. JWT Verify Ops/s", "Equals Peak RPS", "=Peak_RPS", "", 'intermed')
r = calc_row(ws, r, "12. JWT CPU Cost (cores)", "Peak RPS * 0.5ms / 1000", "=Peak_RPS*0.5/1000", "", 'intermed')
r = calc_row(ws, r, "13. JWT Public Key Cache (KB)", "Static", "=1", "JWKS cached at edge", 'input')
r += 1
section_bar(ws, r, "D. RESILIENCE (info)"); r += 1
header_row(ws, r, ["Backend","Error % Threshold","Window (s)","Open Duration (s)","Half-Open Probes"]); r += 1
cb = [("Order Service",50,10,30,1), ("Payment Service",25,10,60,1), ("Inventory Service",50,10,30,2), ("Search Service",70,10,15,3)]
for row_data in cb:
    for i, v in enumerate(row_data, start=1):
        ws.cell(row=r, column=i, value=v).border = BORDER
    r += 1
r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value="Bulkhead: max 100 concurrent calls per backend.  Timeouts: connect=3s, read=10s, total=15s.").font = FONT_ITALIC
r += 2
section_bar(ws, r, "E. REAL-TIME"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "18. WebSocket Concurrent (order tracking)", "PCU * 5%", "=PCU*0.05", "", 'intermed')
r = calc_row(ws, r, "19. SSE Concurrent (price updates)", "PCU * 10%", "=PCU*0.10", "", 'intermed')
r = calc_row(ws, r, "20. WS Memory (MB)", "Concurrent * 64KB / 1024", "=C"+str(r-2)+"*64/1024", "", 'final')
r += 1
r = talk_track(ws, r, ("For 7k RPS, effective capacity per gateway is 1,800 RPS at 60% CPU -- that's 4 raw "
    "instances, and with N+1 per AZ across 3 AZs we run about 9 gateway pods. Gateway adds roughly 3.5ms of "
    "latency. Rate limiting runs on Redis token buckets -- 100 req/min for logged-in users, 10x that as burst."))
print("04 done")

# =====================================================================
# SHEET 05: LOAD BALANCER
# =====================================================================
ws = wb.create_sheet("05_Load_Balancer")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 42])
style_title(ws, "05 - Load Balancer")
r = 3
r = calc_header(ws, r)
r = calc_row(ws, r, "1. LB Type", "NLB(L4, TLS passthrough) + ALB(L7, HTTP routing)", '="NLB (L4) + ALB (L7)"', "Two-tier: NLB absorbs TLS/SYN, ALB does path routing", 'final')
r = calc_row(ws, r, "2. LB Instances", "Active-active multi-AZ", "=2", "", 'input')
add_named_range("LB_Instances", "05_Load_Balancer", f"C{r-1}")
r = calc_row(ws, r, "3. Concurrent Connections", "Peak RPS * 2 (keep-alive ratio)", "=Peak_RPS*2", "", 'intermed')
r = calc_row(ws, r, "4. TLS Handshakes/sec", "Peak RPS * SSL_Rate_Pct/100", "=Peak_RPS*SSL_Rate_Pct/100", "", 'intermed')
r = calc_row(ws, r, "5. LB Latency Added (ms)", "Fixed", "=LB_Forward_ms", "", 'final')
r = calc_row(ws, r, "6. Health Check Interval (s)", "Fixed policy", "=5", "3 consecutive failures = ejected", 'input')
r = calc_row(ws, r, "7. Sticky Session TTL (min)", "WebSocket only", "=5", "", 'input')
r = calc_row(ws, r, "8. Connection Draining (s)", "On scale-down", "=30", "", 'input')
r += 1
r = talk_track(ws, r, ("We terminate TLS at the NLB for pass-through performance and route at L7 with an ALB "
    "for path-based rules. Two nodes active-active across AZs; health checks eject a backend after 3 failed "
    "probes; WebSocket connections get 5-minute sticky sessions so order-tracking sockets survive rebalancing."))
print("05 done")

# =====================================================================
# SHEET 06: BACKEND SERVICES
# =====================================================================
ws = wb.create_sheet("06_Backend_Services")
print_setup(ws)
set_colwidths(ws, [22, 12, 10, 10, 16, 16, 40])
style_title(ws, "06 - Backend Services", span=7)
r = 3
header_row(ws, r, ["Service","Instances","Cores","RAM(GB)","RPS Cap/Inst","Total RPS Cap","Notes"])
r += 1
services = [
    ("API Gateway", "Gateway_Instances_Sized", 4, 8, 3000, "Rate limit, auth, routing"),
    ("Order Service", "Order_Svc_Instances", 4, 8, 2000, "Outbox pattern, Kafka producer"),
    ("Payment Service", "Payment_Svc_Instances", 4, 8, 1500, "Idempotent, PCI-scoped zone"),
    ("Inventory Service", "Inventory_Svc_Instances", 4, 8, 2500, "Cache-heavy, Redis-backed"),
    ("Notification Service", "Notification_Svc_Instances", 2, 4, 5000, "Async, Kafka consumer"),
    ("Search Service", "Search_Svc_Instances", 4, 16, 1500, "Elasticsearch facade"),
]
first_data_row = r
for name, inst_ref, cores, ram, cap, notes in services:
    ws.cell(row=r, column=1, value=name).border = BORDER
    c2 = ws.cell(row=r, column=2, value=f"={inst_ref}"); c2.fill = FILL_INTER; c2.border = BORDER
    ws.cell(row=r, column=3, value=cores).border = BORDER
    ws.cell(row=r, column=4, value=ram).border = BORDER
    ws.cell(row=r, column=5, value=cap).border = BORDER
    c6 = ws.cell(row=r, column=6, value=f"=B{r}*E{r}"); c6.fill = FILL_FINAL; c6.border = BORDER
    ws.cell(row=r, column=7, value=notes).border = BORDER; ws.cell(row=r,column=7).alignment = WRAP
    r += 1
last_data_row = r - 1
# Totals
ws.cell(row=r, column=1, value="TOTAL").font = FONT_BOLD
ws.cell(row=r, column=2, value=f"=SUM(B{first_data_row}:B{last_data_row})").font = FONT_BOLD
add_named_range("Total_App_Instances", "06_Backend_Services", f"B{r}")
ws.cell(row=r, column=3, value=f"=SUMPRODUCT(B{first_data_row}:B{last_data_row},C{first_data_row}:C{last_data_row})").font = FONT_BOLD
add_named_range("Total_vCPU", "06_Backend_Services", f"C{r}")
ws.cell(row=r, column=4, value=f"=SUMPRODUCT(B{first_data_row}:B{last_data_row},D{first_data_row}:D{last_data_row})").font = FONT_BOLD
add_named_range("Total_RAM_GB", "06_Backend_Services", f"D{r}")
ws.cell(row=r, column=6, value=f"=SUM(F{first_data_row}:F{last_data_row})").font = FONT_BOLD
add_named_range("Total_RPS_Capacity", "06_Backend_Services", f"F{r}")
for col in range(1, 8):
    ws.cell(row=r, column=col).border = BORDER
    ws.cell(row=r, column=col).fill = FILL_FINAL
r += 2
r = calc_header(ws, r)
r = calc_row(ws, r, "Headroom %", "(Total RPS Cap / Peak RPS - 1) * 100", "=(Total_RPS_Capacity/Peak_RPS-1)*100", "WARNING if < 50%", 'final')
headroom_row = r - 1
r = calc_row(ws, r, "Headroom Status", 'IF(Headroom<50,"WARNING - THIN","OK")', f'=IF(C{headroom_row}<50,"WARNING - THIN","OK")', "", 'warning')
status_row = r - 1
ws.conditional_formatting.add(f"C{status_row}:D{status_row}",
    CellIsRule(operator='equal', formula=['"OK"'], fill=FILL_FINAL))
ws.conditional_formatting.add(f"C{status_row}:D{status_row}",
    CellIsRule(operator='notEqual', formula=['"OK"'], fill=FILL_WARNING))
r += 1
r = talk_track(ws, r, ("Twenty-plus pods across five services plus the gateway give us roughly 3x headroom over "
    "peak RPS -- enough to absorb a single-AZ failure without falling over. Payment stays isolated in its own "
    "PCI-scoped namespace; inventory is the cache-heaviest service so it gets extra Redis connection budget."))
print("06 done")

# =====================================================================
# SHEET 07: NETWORK LATENCY (Hop-by-hop budget)
# =====================================================================
ws = wb.create_sheet("07_Network_Latency")
print_setup(ws)
set_colwidths(ws, [30, 16, 16, 14, 34])
style_title(ws, "07 - Network Latency (Hop-by-Hop Budget)")
r = 3
header_row(ws, r, ["Hop", "Latency (ms)", "Cumulative (ms)", "% of Budget", "Notes"])
r += 1
hops = [
    ("Client -> DNS", "=DNS_Lookup_ms", "DNS resolution, cached after first hit"),
    ("DNS -> CDN PoP", "=CDN_Edge_ms", "Anycast routing to nearest edge"),
    ("CDN -> Origin (on miss)", "=CDN_Origin_Miss_ms", "Only ~2% of requests (cache miss)"),
    ("Origin -> LB", "=LB_Forward_ms", "TCP handoff"),
    ("LB -> API Gateway", "=LB_Forward_ms", "mTLS inside VPC"),
    ("Gateway (JWT + RL + route)", "=Gateway_Latency_ms", "Auth + rate-limit + routing"),
    ("Gateway -> Service", "=1", "Service mesh sidecar hop"),
    ("Service processing", "=Service_Process_ms", "Business logic"),
    ("Service -> Redis", "=Redis_Query_ms", "Cache read"),
    ("Service -> PostgreSQL", "=DB_Query_ms", "Indexed query"),
    ("Service -> Response", "=1", "Serialize JSON"),
    ("Reverse path (LB, CDN)", "=5", "Response traverses back"),
]
first_hop_row = r
cum_formula_prev = None
for name, latency_f, notes in hops:
    ws.cell(row=r, column=1, value=name).border = BORDER
    c2 = ws.cell(row=r, column=2, value=latency_f); c2.border = BORDER; c2.fill = FILL_INTER
    if r == first_hop_row:
        cum_f = f"=B{r}"
    else:
        cum_f = f"=C{r-1}+B{r}"
    c3 = ws.cell(row=r, column=3, value=cum_f); c3.border = BORDER; c3.fill = FILL_INTER
    c4 = ws.cell(row=r, column=4, value=f"=C{r}/$C${first_hop_row+len(hops)-1}"); c4.border = BORDER
    c4.number_format = '0.0%'
    ws.cell(row=r, column=5, value=notes).border = BORDER; ws.cell(row=r,column=5).alignment = WRAP
    r += 1
last_hop_row = r - 1
r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "Uncached Path P50 (ms)", "SUM of all hops (incl. origin miss + DB)", f"=SUM(B{first_hop_row}:B{last_hop_row})", "Full round trip on a cache miss", 'final')
uncached_row = r - 1
r = calc_row(ws, r, "Cached Path P50 (ms)", "Uncached minus CDN-origin-miss and DB-query hops", f"=C{uncached_row}-CDN_Origin_Miss_ms-DB_Query_ms", "CDN + Redis hit path", 'final')
cached_row = r - 1
r = calc_row(ws, r, "Blended P50 (ms)", "98% cached, 2% uncached (per CDN sheet)", f"=C{cached_row}*0.98+C{uncached_row}*0.02", "", 'final')
blended_row = r - 1
r = calc_row(ws, r, "P95 (ms)", "Blended P50 * 1.8 (typical tail amplification)", f"=C{blended_row}*1.8", "", 'final')
p95_row = r - 1
add_named_range("P95_Latency_ms", "07_Network_Latency", f"C{p95_row}")
r = calc_row(ws, r, "P99 (ms)", "Blended P50 * 3.0", f"=C{blended_row}*3", "", 'final')
r = calc_row(ws, r, "SLA Compliance", 'IF(P95 < SLA_P95_ms, "PASS", "FAIL")', f'=IF(C{p95_row}<SLA_P95_ms,"PASS","FAIL")', "", 'warning')
sla_row = r - 1
ws.conditional_formatting.add(f"C{sla_row}:D{sla_row}", CellIsRule(operator='equal', formula=['"PASS"'], fill=FILL_FINAL))
ws.conditional_formatting.add(f"C{sla_row}:D{sla_row}", CellIsRule(operator='equal', formula=['"FAIL"'], fill=FILL_WARNING))
r += 1
r = talk_track(ws, r, ("Cached path completes in around 30ms; uncached in around 80ms. Blending the 98/2 CDN "
    "hit ratio and applying an 1.8x tail amplification puts P95 comfortably under our 200ms SLA. Kafka writes "
    "are fire-and-forget from the request path, so they never touch this latency budget."))
print("07 done")

# =====================================================================
# SHEET 08: KAFKA DESIGN
# =====================================================================
ws = wb.create_sheet("08_Kafka_Design")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 40])
style_title(ws, "08 - Kafka Design")
r = 3
section_bar(ws, r, "A. THROUGHPUT"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Kafka MB/s", "Peak RPS * AVG_MSG_SIZE_KB / 1024", "=Peak_RPS*AVG_MSG_SIZE_KB/1024", "", 'intermed')
add_named_range("Kafka_MBps", "08_Kafka_Design", f"C{r-1}")
r = calc_row(ws, r, "2. Internal MB/s (with replication)", "MB/s * REPLICATION_FACTOR", "=Kafka_MBps*REPLICATION_FACTOR", "", 'final')
add_named_range("Kafka_Internal_MBps", "08_Kafka_Design", f"C{r-1}")
r = calc_row(ws, r, "3. Daily Volume (GB)", "MB/s * 86400 / 1024", "=Kafka_MBps*86400/1024", "", 'intermed')
r = calc_row(ws, r, "4. Monthly Volume (TB)", "Daily * 30 / 1024", f"=C{r-1}*30/1024", "", 'intermed')
r = calc_row(ws, r, "5. With Compression (zstd, ~3x)", "Monthly / 3", f"=C{r-1}/3", "", 'final')
r += 1
section_bar(ws, r, "B. PARTITIONS & BROKERS"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "6. Partitions (producer-bound)", "ROUNDUP(MB/s / PRODUCER_PER_PARTITION_MBPS, 0)", "=ROUNDUP(Kafka_MBps/PRODUCER_PER_PARTITION_MBPS,0)", "", 'intermed')
prod_part_row = r - 1
r = calc_row(ws, r, "7. Partitions (consumer-bound)", "ROUNDUP(MB/s / CONSUMER_PER_PARTITION_MBPS, 0)", "=ROUNDUP(Kafka_MBps/CONSUMER_PER_PARTITION_MBPS,0)", "", 'intermed')
cons_part_row = r - 1
r = calc_row(ws, r, "8. Raw Partitions", "MAX(producer-bound, consumer-bound, MIN_BROKERS_HA)", f"=MAX(C{prod_part_row},C{cons_part_row},MIN_BROKERS_HA)", "", 'intermed')
raw_part_row = r - 1
r = calc_row(ws, r, "9. Adjusted Partitions", "ROUNDUP(Raw / BROKER_MULTIPLE, 0) * BROKER_MULTIPLE", f"=ROUNDUP(C{raw_part_row}/BROKER_MULTIPLE,0)*BROKER_MULTIPLE", "Rounded to a clean multiple of brokers", 'final')
add_named_range("Kafka_Partitions", "08_Kafka_Design", f"C{r-1}")
r = calc_row(ws, r, "10. Brokers", "MAX(MIN_BROKERS_HA, ROUNDUP(Internal MB/s / BROKER_CAPACITY_MBPS, 0))", "=MAX(MIN_BROKERS_HA,ROUNDUP(Kafka_Internal_MBps/BROKER_CAPACITY_MBPS,0))", "", 'final')
add_named_range("Kafka_Brokers", "08_Kafka_Design", f"C{r-1}")
r += 1
section_bar(ws, r, "C. TOPIC TABLE"); r += 1
header_row(ws, r, ["Topic","Partitions","Retention(d)","RF","Cleanup","Purpose"]); r += 1
topics = [
    ("order.events", 24, 7, "=REPLICATION_FACTOR", "delete", "Order lifecycle events"),
    ("payment.transactions", 12, 30, "=REPLICATION_FACTOR", "compact", "Payment ledger (compliance)"),
    ("inventory.updates", 12, 7, "=REPLICATION_FACTOR", "compact", "Stock level changes"),
    ("order.dlq", 6, 30, "=REPLICATION_FACTOR", "delete", "Dead-letter queue"),
    ("order.retry.5s", 6, 1, "=REPLICATION_FACTOR", "delete", "Retry tier 1"),
    ("order.retry.30s", 6, 1, "=REPLICATION_FACTOR", "delete", "Retry tier 2"),
    ("order.retry.5m", 6, 1, "=REPLICATION_FACTOR", "delete", "Retry tier 3"),
    ("order.reprocess", 6, 7, "=REPLICATION_FACTOR", "delete", "Manual on-call reprocess"),
]
for row_data in topics:
    for i, v in enumerate(row_data, start=1):
        c = ws.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.alignment = WRAP if i == 6 else Alignment(vertical='center')
    r += 1
r += 1
section_bar(ws, r, "D. KRAFT CONTROL PLANE"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "11. KRaft Controllers", "Fixed (odd number for quorum)", "=3", "", 'input')
r = calc_row(ws, r, "12. Controller Cores (each)", "Fixed", "=2", "", 'input')
r = calc_row(ws, r, "13. Controller RAM GB (each)", "Fixed", "=4", "", 'input')
r = calc_row(ws, r, "14. Metadata Ops/sec", "Partitions * 0.1", "=Kafka_Partitions*0.1", "Approximation", 'intermed')
r += 1
section_bar(ws, r, "E. PRODUCER CONFIG"); r += 1
prod_cfg = ["acks=1 (acks=all for payment.transactions)", "enable.idempotence=true", "compression.type=zstd",
            "batch.size=1048576", "linger.ms=20", "max.in.flight.requests.per.connection=5"]
for cfg in prod_cfg:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+cfg).font = Font(name='Consolas', size=9)
    r += 1
r += 1
section_bar(ws, r, "F. CONSUMER CONFIG"); r += 1
cons_cfg = ["max.poll.records=5000", "fetch.min.bytes=1048576", "enable.auto.commit=false",
            "isolation.level=read_committed", "partition.assignment.strategy=CooperativeStickyAssignor"]
for cfg in cons_cfg:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+cfg).font = Font(name='Consolas', size=9)
    r += 1
r += 1
r = talk_track(ws, r, ("At 7k RPS times 1KB messages we need roughly 7MB/s of producer throughput; with RF=3 "
    "that's 21MB/s internal. Rounding to clean broker multiples gives 24 partitions across a 6-broker cluster. "
    "KRaft runs 3 controllers for HA -- no ZooKeeper. Idempotent producers plus transactions give us "
    "exactly-once semantics on the payment topic specifically."))
print("08 done")

# =====================================================================
# SHEET 09: DATABASE DESIGN (PostgreSQL)
# =====================================================================
ws = wb.create_sheet("09_Database_Design")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 40])
style_title(ws, "09 - Database Design (PostgreSQL)")
r = 3
section_bar(ws, r, "A. QPS"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Total DB QPS", "Peak RPS * QUERIES_PER_API_CALL", "=Peak_RPS*QUERIES_PER_API_CALL", "", 'intermed')
total_qps_row = r - 1
r = calc_row(ws, r, "2. Read QPS", "Total * READ_WRITE_SPLIT_READ_PCT/100", f"=C{total_qps_row}*READ_WRITE_SPLIT_READ_PCT/100", "", 'intermed')
read_qps_row = r - 1
r = calc_row(ws, r, "3. Write QPS", "Total - Read QPS", f"=C{total_qps_row}-C{read_qps_row}", "", 'intermed')
write_qps_row = r - 1
r = calc_row(ws, r, "4. Cache-Hit Reads", "Read QPS * CACHE_HIT_PCT/100", f"=C{read_qps_row}*CACHE_HIT_PCT/100", "", 'intermed')
r = calc_row(ws, r, "5. Cache-Miss Reads", "Read QPS - Cache-Hit Reads", f"=C{read_qps_row}-C{r-1}", "", 'intermed')
miss_row = r - 1
r = calc_row(ws, r, "6. Actual DB QPS (post-cache)", "Cache-Miss Reads + Write QPS", f"=C{miss_row}+C{write_qps_row}", "What Postgres really sees", 'final')
actual_qps_row = r - 1
add_named_range("Actual_DB_QPS", "09_Database_Design", f"C{actual_qps_row}")
r += 1
section_bar(ws, r, "B. IOPS"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "7. Total IOPS Required", "Actual DB QPS * DB_IOPS_PER_QUERY", "=Actual_DB_QPS*DB_IOPS_PER_QUERY", "", 'intermed')
iops_row = r - 1
r = calc_row(ws, r, "8. Recommended IOPS (2x headroom)", "Total * 2", f"=C{iops_row}*2", "", 'final')
rec_iops_row = r - 1
add_named_range("DB_Recommended_IOPS", "09_Database_Design", f"C{rec_iops_row}")
r = calc_row(ws, r, "9. NVMe SSD Baseline", "gp3 default vs io2 Block Express ceiling", '="gp3: 16,000 | io2 BE: 256,000"', "Reference only", 'cloud')
r = calc_row(ws, r, "10. Disk Size Needed (GB)", "ROUNDUP(Recommended IOPS / DB_SSD_IOPS_PER_GB, 0)", f"=ROUNDUP(C{rec_iops_row}/DB_SSD_IOPS_PER_GB,0)", "", 'final')
r += 1
section_bar(ws, r, "C. CONNECTIONS"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "11. Conn per App Instance", "(Cores * DB_CONN_MULTIPLIER) + DB_CONN_OVERHEAD", "=(Cores_Per_App_Instance*DB_CONN_MULTIPLIER)+DB_CONN_OVERHEAD", "", 'intermed')
conn_per_inst_row = r - 1
r = calc_row(ws, r, "12. Total App Instances", "Sum of backend service instances (06_Backend_Services)", "=Total_App_Instances", "", 'intermed')
r = calc_row(ws, r, "13. Total DB Connections", "Instances * Conn per Instance", f"=Total_App_Instances*C{conn_per_inst_row}", "", 'intermed')
total_conn_row = r - 1
r = calc_row(ws, r, "14. max_connections (postgresql.conf)", "ROUNDUP(Total * 1.5, 0)", f"=ROUNDUP(C{total_conn_row}*1.5,0)", "PgBouncer recommended above ~500", 'final')
r += 1
section_bar(ws, r, "D. STORAGE"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "15. Daily Writes", "Write QPS * 86400", f"=C{write_qps_row}*86400", "", 'intermed')
daily_writes_row = r - 1
r = calc_row(ws, r, "16. Hot Data Rows", "Daily Writes * DB_HOT_RETENTION_DAYS", f"=C{daily_writes_row}*DB_HOT_RETENTION_DAYS", "", 'intermed')
r = calc_row(ws, r, "17. Hot Data Size (GB)", "Hot Data Rows * DB_ROW_SIZE_KB / 1024 / 1024", f"=C{r-1}*DB_ROW_SIZE_KB/1024/1024", "", 'intermed')
hot_gb_row = r - 1
r = calc_row(ws, r, "18. With Indexes (GB)", "Hot Data GB * 1.5", f"=C{hot_gb_row}*1.5", "", 'intermed')
idx_gb_row = r - 1
r = calc_row(ws, r, "19. With WAL (2x)", "Total * 2", f"=C{idx_gb_row}*2", "", 'final')
r = calc_row(ws, r, "20. Backup Storage (S3, 30d)", "Daily full backup * 30 retained copies notional", f"=C{idx_gb_row}*1", "Feeds 16_Cost_Estimator S3 line", 'final')
add_named_range("DB_Storage_GB", "09_Database_Design", f"C{r-1}")
r += 1
section_bar(ws, r, "E. SERVER SIZING"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "21. Recommended RAM (GB, shared_buffers 25%)", "ROUNDUP(Hot Data GB * 0.25, 0)", f"=ROUNDUP(C{hot_gb_row}*0.25,0)", "", 'intermed')
r = calc_row(ws, r, "22. Recommended vCPU", "MAX(8, ROUNDUP(Actual QPS / 2000, 0))", "=MAX(8,ROUNDUP(Actual_DB_QPS/2000,0))", "", 'final')
r = calc_row(ws, r, "23. Primary Server", "Fixed recommendation", '="1x r6i.2xlarge (8 vCPU, 64GB)"', "", 'cloud')
r = calc_row(ws, r, "24. Read Replicas", "ROUNDUP(Read QPS / DB_READ_REPLICA_QPS, 0)", f"=ROUNDUP(C{read_qps_row}/DB_READ_REPLICA_QPS,0)", "", 'final')
add_named_range("DB_Read_Replicas", "09_Database_Design", f"C{r-1}")
r += 1
section_bar(ws, r, "F. INDEXES & SHARDING (info)"); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("B-tree indexes: order_id, user_id, created_at, status. Partial index on "
    "status='PENDING' (hot path). Shard by HASH(user_id) MOD 16 once a table crosses ~5TB.")).alignment = WRAP
r += 2
r = talk_track(ws, r, ("Raw DB QPS is about 21k, but with a 95% cache hit rate only roughly 1,050 queries a "
    "second actually hit disk. That needs about 1,260 IOPS -- trivial for NVMe gp3. We size Postgres around "
    "64GB RAM with a 16GB shared_buffers and a few hundred max_connections behind PgBouncer, plus read "
    "replicas to absorb analytics and search-adjacent read traffic."))
print("09 done")

# =====================================================================
# SHEET 10: CACHE (Redis)
# =====================================================================
ws = wb.create_sheet("10_Cache_Redis")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 40])
style_title(ws, "10 - Cache (Redis)")
r = 3
section_bar(ws, r, "A. MEMORY"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Session Memory (GB)", "DAU * SESSION_SIZE_KB / 1024 / 1024", "=DAU*SESSION_SIZE_KB/1024/1024", "", 'intermed')
sess_row = r - 1
r = calc_row(ws, r, "2. Catalog Memory (GB)", "CATALOG_SKUS * CATALOG_ENTRY_KB / 1024 / 1024", "=CATALOG_SKUS*CATALOG_ENTRY_KB/1024/1024", "", 'intermed')
cat_row = r - 1
r = calc_row(ws, r, "3. Hot SKU Memory (GB)", "HOT_SKU_COUNT * HOT_SKU_ENTRY_KB / 1024 / 1024", "=HOT_SKU_COUNT*HOT_SKU_ENTRY_KB/1024/1024", "", 'intermed')
hot_row = r - 1
r = calc_row(ws, r, "4. Subtotal (GB)", "1 + 2 + 3", f"=C{sess_row}+C{cat_row}+C{hot_row}", "", 'intermed')
sub_row = r - 1
r = calc_row(ws, r, "5. With Overhead (GB)", "Subtotal * CACHE_OVERHEAD_FACTOR", f"=C{sub_row}*CACHE_OVERHEAD_FACTOR", "", 'final')
overhead_row = r - 1
r = calc_row(ws, r, "6. Per Shard (GB)", "ROUNDUP((Total / REDIS_SHARDS) * REDIS_HEADROOM, 0)", f"=ROUNDUP((C{overhead_row}/REDIS_SHARDS)*REDIS_HEADROOM,0)", "", 'final')
shard_row = r - 1
r = calc_row(ws, r, "7. Total Cluster (GB)", "Per Shard * Shards", f"=C{shard_row}*REDIS_SHARDS", "", 'final')
add_named_range("Redis_Cluster_GB", "10_Cache_Redis", f"C{r-1}")
r += 1
section_bar(ws, r, "B. OPS"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "8. Cache Ops/s", "Peak RPS * QUERIES_PER_API_CALL", "=Peak_RPS*QUERIES_PER_API_CALL", "", 'intermed')
ops_row = r - 1
r = calc_row(ws, r, "9. Cache Hit Ops", "Ops * CACHE_HIT_PCT/100", f"=C{ops_row}*CACHE_HIT_PCT/100", "", 'intermed')
r = calc_row(ws, r, "10. Required Nodes", "MAX(3, ROUNDUP(Ops / REDIS_OPS_PER_NODE, 0))", f"=MAX(3,ROUNDUP(C{ops_row}/REDIS_OPS_PER_NODE,0))", "", 'final')
add_named_range("Redis_Nodes", "10_Cache_Redis", f"C{r-1}")
r += 1
section_bar(ws, r, "C. CONFIG (info)"); r += 1
cfg = ["Eviction: allkeys-lru (product catalog) / volatile-ttl (sessions)",
       "Persistence: AOF everysec",
       "Cluster mode: 3 shards x 1 replica each",
       "Failover: Sentinel, target <10s promotion"]
for c in cfg:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+c).font = Font(name='Consolas', size=9)
    r += 1
r += 1
r = talk_track(ws, r, ("Sessions, full catalog and hot SKUs together need under 10GB before overhead -- small "
    "enough that 3 shards with 1.5x headroom comfortably fit on cache.r6g.xlarge nodes. At 95% hit rate we're "
    "serving roughly 20k ops/sec from cache, well inside one node's 100k ops/sec ceiling; the 3-node minimum "
    "is purely for HA."))
print("10 done")

# =====================================================================
# SHEET 11: DLQ, ERROR TOPICS & REPROCESS LOGIC
# =====================================================================
ws = wb.create_sheet("11_DLQ_Error_Handling")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 42])
style_title(ws, "11 - DLQ, Error Topics & Reprocess Logic")
r = 3
section_bar(ws, r, "A. RETRY & BACKOFF"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Retry Tier 1 delay (s)", "Retry_Backoff_Base_sec", "=Retry_Backoff_Base_sec", "", 'intermed')
t1 = r - 1
r = calc_row(ws, r, "2. Retry Tier 2 delay (s)", "Base * Multiplier", f"=Retry_Backoff_Base_sec*Retry_Backoff_Multiplier", "", 'intermed')
t2 = r - 1
r = calc_row(ws, r, "3. Retry Tier 3 delay (s)", "Base * Multiplier^2", f"=Retry_Backoff_Base_sec*Retry_Backoff_Multiplier^2", "", 'intermed')
t3 = r - 1
r = calc_row(ws, r, "4. Retry Tier 4 delay (s)", "Base * Multiplier^3", f"=Retry_Backoff_Base_sec*Retry_Backoff_Multiplier^3", "", 'intermed')
t4 = r - 1
r = calc_row(ws, r, "5. Total Retry Time (s)", "SUM of tiers 1-4", f"=C{t1}+C{t2}+C{t3}+C{t4}", "", 'final')
r = calc_row(ws, r, "6. Failure Rate Reaching DLQ (%)", "1 - (0.99^Max_Retries) * 100  [99% per-attempt success]", "=(1-0.99^Max_Retries)*100", "", 'final')
fail_rate_row = r - 1
r = calc_row(ws, r, "7. DLQ Messages/day", "Daily Messages(=Daily_Requests) * Failure_Rate%", f"=Daily_Requests*C{fail_rate_row}/100", "", 'final')
add_named_range("DLQ_Msgs_Per_Day", "11_DLQ_Error_Handling", f"C{r-1}")
r += 1
section_bar(ws, r, "B. TOPIC TOPOLOGY (info)"); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("order.events -> [consumer fails] -> order.retry.5s -> [fails] -> order.retry.30s "
    "-> [fails] -> order.retry.5m -> [fails] -> order.dlq")).font = Font(name='Consolas', size=9)
ws.cell(row=r,column=1).alignment = WRAP
r += 2
section_bar(ws, r, "C. DLQ MESSAGE SCHEMA (info)"); r += 1
schema_lines = ['{', '  "originalTopic": "order.events",', '  "originalPartition": 7,',
    '  "originalOffset": 1234567,', '  "originalMessage": {...},', '  "errorType": "INVENTORY_SERVICE_TIMEOUT",',
    '  "errorMessage": "...",', '  "attemptCount": 4,', '  "firstAttemptAt": "2026-09-10T10:00:00Z",',
    '  "lastAttemptAt": "2026-09-10T10:01:15Z",', '  "consumerGroup": "inventory-processor",',
    '  "reprocessable": true', '}']
for line in schema_lines:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value=line).font = Font(name='Consolas', size=9)
    r += 1
r += 1
section_bar(ws, r, "D. REPROCESS LOGIC"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "8. Reprocess Batch Size", "= Reprocess_Batch_Size", "=Reprocess_Batch_Size", "", 'intermed')
r = calc_row(ws, r, "9. Reprocess Workers", "Fixed", "=4", "", 'input')
workers_row = r - 1
r = calc_row(ws, r, "10. Reprocess Throughput (msgs/min)", "Batch * Workers / Interval", f"=Reprocess_Batch_Size*C{workers_row}/Reprocess_Interval_min", "", 'intermed')
thru_row = r - 1
r = calc_row(ws, r, "11. Full DLQ Drain Time (hours)", "DLQ Messages/day / Throughput / 60", f"=DLQ_Msgs_Per_Day/C{thru_row}/60", "", 'final')
r = calc_row(ws, r, "12. Manual Approval Threshold", ">100 msgs requires on-call sign-off", "=100", "", 'input')
r += 1
section_bar(ws, r, "E. CONSUMER SIDE (info)"); r += 1
for line in ["enable.auto.commit=false; manual offset commit AFTER successful processing",
             "On failure: publish to retry topic, do not advance main-topic offset",
             "Poison-pill detection: same error 3x in a row -> auto-route to DLQ"]:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+line).font = Font(name='Consolas', size=9)
    r += 1
r += 1
section_bar(ws, r, "F. MONITORING (info)"); r += 1
for line in ["DLQ depth: alert > 100", "Retry-topic depth: alert > 1,000", "Consumer lag: alert > 10,000",
             "Error rate by type: dashboard panel"]:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+line).font = Font(name='Consolas', size=9)
    r += 1
r += 1
r = talk_track(ws, r, ("We use tiered retries -- 5s, 10s, 20s, 40s -- before a message hits the DLQ. With a "
    "99% per-attempt success rate, well under 1% of messages ever reach DLQ. On-call reprocesses in 1,000-message "
    "batches every 15 minutes, and every DLQ message carries the original offset, partition and stack trace so "
    "replay is safe and traceable."))
print("11 done")

# =====================================================================
# SHEET 12: TRAFFIC SPIKES & DDOS
# =====================================================================
ws = wb.create_sheet("12_Traffic_Spikes_DDoS")
print_setup(ws)
set_colwidths(ws, [24, 12, 18, 14, 20])
style_title(ws, "12 - Traffic Spikes & DDoS")
r = 3
section_bar(ws, r, "A. SPIKE SCENARIOS"); r += 1
header_row(ws, r, ["Scenario","Multiplier","Peak RPS","Duration","Trigger"]); r += 1
spike_scenarios = [
    ("Normal", 1, "=Peak_RPS*B{row}", "24h", "baseline"),
    ("Flash Sale", 5, "=Peak_RPS*B{row}", "1h", "scheduled promo"),
    ("Black Friday", 10, "=Peak_RPS*B{row}", "6h", "annual"),
    ("Cyber Monday", 15, "=Peak_RPS*B{row}", "8h", "annual"),
    ("Product-Hunt effect", 50, "=Peak_RPS*B{row}", "2h", "virality"),
    ("DDoS", 100, "=DDoS_Peak_RPS", "burst", "malicious"),
]
for name, mult, rps_f, dur, trig in spike_scenarios:
    ws.cell(row=r, column=1, value=name).border = BORDER
    ws.cell(row=r, column=2, value=mult).border = BORDER
    c3 = ws.cell(row=r, column=3, value=rps_f.format(row=r)); c3.border = BORDER; c3.fill = FILL_INTER
    ws.cell(row=r, column=4, value=dur).border = BORDER
    ws.cell(row=r, column=5, value=trig).border = BORDER
    r += 1
current_scenario_rps_row = r - 5  # Black Friday row as the reference "current spike" example
r += 1
section_bar(ws, r, "B. AUTO-SCALING MATH (Black Friday example)"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Target Instance Count", "ROUNDUP(Spike RPS / RPS_Per_App_Instance, 0)", f"=ROUNDUP(Peak_RPS*Spike_Multiplier/RPS_Per_App_Instance,0)", "Uses live Spike_Multiplier from scenario", 'final')
r = calc_row(ws, r, "2. Scale-Up Time (s)", "Cooldown + Provision(90) + Warmup(30)", "=Auto_Scale_Cooldown_sec+90+30", "", 'intermed')
scaleup_row = r - 1
r = calc_row(ws, r, "3. Requests During Scale-Up", "Spike RPS * Scale-Up Time", f"=Peak_RPS*Spike_Multiplier*C{scaleup_row}", "Must be absorbed by pre-scaled buffer", 'warning')
r = calc_row(ws, r, "4. Required Pre-Scale Instances", "ROUNDUP(Spike RPS / RPS_Per_App_Instance, 0)", f"=ROUNDUP(Peak_RPS*Spike_Multiplier/RPS_Per_App_Instance,0)", "Provision ahead of known events (Black Friday, flash sales)", 'final')
r = calc_row(ws, r, "5. HPA min pods", "Fixed policy", "=6", "", 'input')
r = calc_row(ws, r, "6. HPA max pods", "Fixed policy", "=60", "", 'input')
r = calc_row(ws, r, "7. HPA target CPU %", "= Auto_Scale_Trigger_CPU", "=Auto_Scale_Trigger_CPU", "", 'intermed')
r += 1
section_bar(ws, r, "C. LOAD SHEDDING"); r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "8. Shed Threshold RPS", "Total_RPS_Capacity * Load_Shed_Threshold_Pct/100", "=Total_RPS_Capacity*Load_Shed_Threshold_Pct/100", "", 'final')
r += 1
header_row(ws, r, ["Priority","Sheds at","Services","",""]); r += 1
priorities = [
    ("P1 - NEVER shed", "n/a", "Payment, Order creation"),
    ("P2 - shed last", "95% capacity", "Cart, Checkout"),
    ("P3", "80% capacity", "Search, Recommendations"),
    ("P4", "70% capacity", "Reviews, Ratings"),
    ("P5 - shed first", "60% capacity", "Analytics, Personalization"),
]
for p, shed, svc in priorities:
    ws.cell(row=r, column=1, value=p).border = BORDER
    ws.cell(row=r, column=2, value=shed).border = BORDER
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=5)
    ws.cell(row=r, column=3, value=svc).border = BORDER
    r += 1
r += 1
section_bar(ws, r, "D. DDOS MITIGATION LAYERS (info)"); r += 1
layers = ["L1: CloudFront/Cloudflare edge scrubbing (100+ Tbps absorption capacity)",
          "L2: WAF rules (SQLi, XSS, bad-bot, rate-based)",
          "L3: NLB with SYN-flood protection",
          "L4: API Gateway rate limiting (Redis token bucket)",
          "L5: Service-mesh circuit breakers per backend",
          "L6: Backend bulkhead (max concurrent per service)",
          "L7: DB connection-pool limits (fail fast, don't queue)"]
for l in layers:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+l).font = Font(name='Consolas', size=9)
    r += 1
r += 1
section_bar(ws, r, "E. CHAOS ENGINEERING (info)"); r += 1
for l in ["Weekly game days", "Kill a broker -> verify RF failover", "Kill a Redis shard -> verify Sentinel promotion",
          "Inject 500ms latency -> verify timeouts fire", "Saturate DB connections -> verify pool rejection, not hang"]:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    ws.cell(row=r, column=1, value="- "+l).font = Font(name='Consolas', size=9)
    r += 1
r += 1
r = talk_track(ws, r, ("We handle Black Friday's 10x with pre-scaled HPA -- min 6, max 60 pods -- and "
    "priority-based load shedding where payment never sheds and analytics sheds first. Under an actual DDoS, "
    "CloudFront and the WAF absorb the bulk of it at the edge, long before traffic reaches our gateway."))
print("12 done")

# =====================================================================
# SHEET 13: OBSERVABILITY
# =====================================================================
ws = wb.create_sheet("13_Observability")
print_setup(ws)
set_colwidths(ws, [30, 42, 20, 16, 40])
style_title(ws, "13 - Observability")
r = 3
r = calc_header(ws, r)
r = calc_row(ws, r, "1. Metrics Data Points/day", "Peak RPS * 100 metrics/req * 86400", "=Peak_RPS*100*86400", "", 'intermed')
mdp_row = r - 1
r = calc_row(ws, r, "2. Metrics Storage (GB)", "Points * 8 bytes / 1024^3", f"=C{mdp_row}*8/1024^3", "", 'final')
r = calc_row(ws, r, "3. Logs (GB/day)", "Daily Requests * Log_Size_Per_Request_KB / 1024 / 1024", "=Daily_Requests*Log_Size_Per_Request_KB/1024/1024", "", 'intermed')
logs_day_row = r - 1
r = calc_row(ws, r, "4. Logs Storage (GB, 30d retention)", "Logs/day * Log_Retention_Days", f"=C{logs_day_row}*Log_Retention_Days", "", 'final')
r = calc_row(ws, r, "5. Traces (GB/day)", "Daily Requests * Trace_Sample_Rate_Pct/100 * 5KB / 1024 / 1024", "=Daily_Requests*Trace_Sample_Rate_Pct/100*5/1024/1024", "", 'intermed')
traces_day_row = r - 1
r = calc_row(ws, r, "6. Trace Storage (GB, 7d retention)", "Traces/day * 7", f"=C{traces_day_row}*7", "", 'final')
r = calc_row(ws, r, "7. Cardinality Alert", 'IF(unique_labels > 100k, "DANGER", "OK") -- manual check', '="Check label cardinality manually per service"', "High-cardinality labels (user_id, order_id) blow up Prometheus", 'warning')
r += 1
section_bar(ws, r, "STACK (info)"); r += 1
header_row(ws, r, ["Layer","Tool","","",""]); r += 1
stack = [("Metrics","Prometheus + Thanos (long-term) + Grafana"), ("Logs","Loki, or ELK (Elasticsearch+Logstash+Kibana)"),
         ("Traces","Jaeger or Tempo + OpenTelemetry SDK"), ("APM (optional)","Datadog or New Relic"),
         ("Alerts","AlertManager -> PagerDuty")]
for k, v in stack:
    ws.cell(row=r, column=1, value=k).border = BORDER
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)
    ws.cell(row=r, column=2, value=v).border = BORDER
    r += 1
r += 1
section_bar(ws, r, "SLO TABLE"); r += 1
header_row(ws, r, ["SLI","Target","Error Budget","Alerting Threshold",""]); r += 1
slos = [
    ("Availability", "99.95%", "21.6 min/month", "Fast burn: 14.4x budget in 1h"),
    ("Latency P95", "<200ms", "5% of requests may exceed", ">250ms sustained 5 min"),
    ("Error Rate", "<0.1%", "1 in 1000 requests", ">1% sustained 2 min"),
    ("Kafka Consumer Lag", "<10,000", "n/a", ">50,000 sustained 10 min"),
]
for row_data in slos:
    for i, v in enumerate(row_data, start=1):
        c = ws.cell(row=r, column=i, value=v); c.border = BORDER
    r += 1
r += 1
r = talk_track(ws, r, ("At 1% trace sampling and 100 metrics per request, our observability footprint stays "
    "small -- single-digit GB per day for traces, tens of GB for logs. The SLO that actually drives paging "
    "decisions is the P95-latency fast-burn alert: if we're burning 14.4x our monthly error budget in an hour, "
    "on-call gets paged immediately."))
print("13 done")

# =====================================================================
# SHEET 14: CLOUD PROVIDER MAPPING
# =====================================================================
ws = wb.create_sheet("14_Cloud_Provider_Mapping")
print_setup(ws)
set_colwidths(ws, [22, 20, 20, 20, 24])
style_title(ws, "14 - Cloud Provider Mapping")
r = 3
header_row(ws, r, ["Component","AWS","GCP","Azure","Self-Hosted / VPS"]); r += 1
mapping = [
    ("DNS","Route53","Cloud DNS","Azure DNS","BIND / PowerDNS"),
    ("CDN","CloudFront","Cloud CDN","Azure CDN","Cloudflare (free tier)"),
    ("WAF","AWS WAF","Cloud Armor","Azure WAF","ModSecurity + Nginx"),
    ("Load Balancer L4","NLB","TCP Proxy LB","Azure LB","HAProxy / Nginx"),
    ("Load Balancer L7","ALB","HTTP(S) LB","App Gateway","Traefik / Envoy"),
    ("API Gateway","API Gateway","API Gateway","API Management","Kong / KrakenD"),
    ("Container Orchestration","EKS","GKE","AKS","K3s / kubeadm"),
    ("Service Mesh","App Mesh","Anthos Service Mesh","Open Service Mesh","Istio / Linkerd"),
    ("Message Queue","MSK (Kafka)","Pub/Sub or Confluent","Event Hubs","Kafka on VMs"),
    ("Database OLTP","RDS / Aurora PG","Cloud SQL","Azure Database","PostgreSQL on VM"),
    ("Database NoSQL","DynamoDB","Firestore","Cosmos DB","Cassandra / MongoDB"),
    ("Cache","ElastiCache Redis","Memorystore","Azure Cache for Redis","Redis on VM"),
    ("Object Storage","S3","Cloud Storage","Blob Storage","MinIO / Ceph"),
    ("Search","OpenSearch","Elastic Cloud","Azure Cognitive Search","Elasticsearch"),
    ("Monitoring","CloudWatch","Cloud Ops (Monitoring)","Azure Monitor","Prometheus + Grafana"),
    ("Logging","CloudWatch Logs","Cloud Logging","Log Analytics","Loki / ELK"),
    ("Tracing","X-Ray","Cloud Trace","App Insights","Jaeger"),
    ("Secrets","Secrets Manager","Secret Manager","Key Vault","HashiCorp Vault"),
    ("CI/CD","CodePipeline","Cloud Build","Azure DevOps","GitLab CI / Jenkins"),
    ("Identity","Cognito / IAM","Identity Platform","Entra ID","Keycloak"),
    ("Serverless","Lambda","Cloud Functions","Azure Functions","OpenFaaS"),
    ("VPS Providers","Lightsail","Compute Engine","Azure VM","DigitalOcean / Linode / Hetzner"),
]
for row_data in mapping:
    for i, v in enumerate(row_data, start=1):
        c = ws.cell(row=r, column=i, value=v); c.border = BORDER
        if i > 1: c.fill = FILL_CLOUD
    r += 1
r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
ws.cell(row=r, column=1, value=("Interview tip: default to AWS -- widest catalog, most interviewers know it. "
    "Switch to GCP only if they hint at BigQuery/Spanner, or Azure for enterprise/AD-heavy shops.")).alignment = WRAP
ws.cell(row=r,column=1).font = FONT_ITALIC
print("14 done")

# =====================================================================
# SHEET 15: CLOUD INFRA PICKER
# =====================================================================
ws = wb.create_sheet("15_Cloud_Infra_Picker")
print_setup(ws)
set_colwidths(ws, [20, 16, 8, 8, 10, 18, 18, 22])
style_title(ws, "15 - Cloud Infra Picker (Instance Cheat Sheet)", span=8)
r = 3
header_row(ws, r, ["Workload","AWS Instance","vCPU","RAM(GB)","$/hr","GCP Eq","Azure Eq","When to use"])
r += 1
infra = [
    ("Kafka Broker","m6i.2xlarge",8,32,0.384,"n2-standard-8","Standard_D8s_v5","Steady throughput"),
    ("Kafka Broker XL","m6i.4xlarge",16,64,0.768,"n2-standard-16","Standard_D16s_v5","High throughput"),
    ("API Gateway","c6i.xlarge",4,8,0.17,"c2-standard-4","Standard_F4s_v2","CPU-bound"),
    ("App Service","c6i.xlarge",4,8,0.17,"c2-standard-4","Standard_F4s_v2","Compute-optimized"),
    ("App Service (mem)","r6i.xlarge",4,32,0.252,"n2-highmem-4","Standard_E4s_v5","Cache-heavy"),
    ("Postgres Primary","r6i.2xlarge",8,64,0.504,"n2-highmem-8","Standard_E8s_v5","Memory-optimized"),
    ("Postgres Replica","r6i.xlarge",4,32,0.252,"n2-highmem-4","Standard_E4s_v5","Read scale"),
    ("Redis","cache.r6g.xlarge",4,26,0.226,"Memorystore Std","Azure Cache P2","Managed preferred"),
    ("OpenSearch","r6g.2xlarge",8,64,0.476,"n2-highmem-8","Standard_E8s_v5","Search"),
    ("Bastion","t3.micro",2,1,0.0104,"e2-micro","Standard_B1s","SSH only"),
]
for row_data in infra:
    for i, v in enumerate(row_data, start=1):
        c = ws.cell(row=r, column=i, value=v); c.border = BORDER
        if i in (6,7): c.fill = FILL_CLOUD
        if i == 5: c.number_format = '$0.0000'
    r += 1
r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
ws.cell(row=r, column=1, value=("Auto-scale groups -- App: min=6 max=60, CPU>70% for 3min. "
    "Gateway: min=3 max=30, RPS>2400/instance. Kafka: manual scale only (stateful, handle with care).")).alignment = WRAP
print("15 done")

# =====================================================================
# SHEET 16: COST ESTIMATOR
# =====================================================================
ws = wb.create_sheet("16_Cost_Estimator")
print_setup(ws)
set_colwidths(ws, [30, 10, 10, 10, 16, 16])
style_title(ws, "16 - Cost Estimator (Monthly / Annual, USD)", span=6)
r = 3
header_row(ws, r, ["Resource","Count","$/hr","Hours","Monthly","Annual"])
r += 1
first_cost_row = r
cost_rows = [
    ("Kafka Brokers", "Kafka_Brokers", "Cost_Broker_hr", "Cost_Hours_Month"),
    ("KRaft Controllers", "3", "0.096", "Cost_Hours_Month"),
    ("App Servers (all services)", "Total_App_Instances", "Cost_App_hr", "Cost_Hours_Month"),
    ("API Gateway", "Gateway_Instances_Sized", "Cost_Gateway_hr", "Cost_Hours_Month"),
    ("NLB / ALB", "LB_Instances", "Cost_NLB_hr", "Cost_Hours_Month"),
    ("DB Primary", "1", "Cost_DB_hr", "Cost_Hours_Month"),
    ("DB Read Replicas", "DB_Read_Replicas", "Cost_DB_hr", "Cost_Hours_Month"),
    ("Redis Cluster", "REDIS_SHARDS", "Cost_Redis_hr", "Cost_Hours_Month"),
    ("NAT Gateway", "2", "0.045", "Cost_Hours_Month"),
]
for name, count_ref, rate_ref, hours_ref in cost_rows:
    ws.cell(row=r, column=1, value=name).border = BORDER
    count_val = count_ref if count_ref.replace('.','',1).isdigit() else f"={count_ref}"
    rate_val = rate_ref if rate_ref.replace('.','',1).isdigit() else f"={rate_ref}"
    hours_val = f"={hours_ref}"
    c2 = ws.cell(row=r, column=2, value=count_val); c2.border = BORDER
    c3 = ws.cell(row=r, column=3, value=rate_val); c3.border = BORDER; c3.number_format = '$0.0000'
    c4 = ws.cell(row=r, column=4, value=hours_val); c4.border = BORDER
    c5 = ws.cell(row=r, column=5, value=f"=B{r}*C{r}*D{r}"); c5.border = BORDER; c5.fill = FILL_FINAL; c5.number_format = '$#,##0'
    c6 = ws.cell(row=r, column=6, value=f"=E{r}*12"); c6.border = BORDER; c6.number_format = '$#,##0'
    r += 1
# storage / egress lines with different formula shapes
storage_lines = [
    ("S3 (Backups + Assets)", f"=DB_Storage_GB/1024*Cost_S3_Per_TB"),
    ("CloudFront / CDN Egress", f"=Monthly_Egress_TB*1024*Cost_CDN_Per_GB"),
    ("Monitoring (CloudWatch/Datadog)", "=500"),
    ("Secrets Manager", "=20*0.4"),
    ("Route53 (hosted zone + queries)", "=5*0.5+50"),
    ("Load Testing (occasional, spot)", "=200"),
]
for name, monthly_formula in storage_lines:
    ws.cell(row=r, column=1, value=name).border = BORDER
    for col in (2,3,4):
        ws.cell(row=r, column=col, value="n/a").border = BORDER
    c5 = ws.cell(row=r, column=5, value=monthly_formula); c5.border = BORDER; c5.fill = FILL_FINAL; c5.number_format = '$#,##0'
    c6 = ws.cell(row=r, column=6, value=f"=E{r}*12"); c6.border = BORDER; c6.number_format = '$#,##0'
    r += 1
last_cost_row = r - 1
r += 1
ws.cell(row=r, column=1, value="GRAND TOTAL").font = FONT_BOLD
for col, letter in [(5,'E'), (6,'F')]:
    c = ws.cell(row=r, column=col, value=f"=SUM({letter}{first_cost_row}:{letter}{last_cost_row})")
    c.font = FONT_BOLD; c.fill = FILL_FINAL; c.number_format = '$#,##0'; c.border = BORDER
grand_monthly_row = r
add_named_range("Total_Monthly_Cost", "16_Cost_Estimator", f"E{r}")
add_named_range("Total_Annual_Cost", "16_Cost_Estimator", f"F{r}")
for col in (1,2,3,4):
    ws.cell(row=r, column=col).border = BORDER
    ws.cell(row=r, column=col).fill = FILL_FINAL
r += 1
r = calc_header(ws, r)
r = calc_row(ws, r, "Cost per 1,000 DAU / month", "Total Monthly / (DAU/1000)", "=Total_Monthly_Cost/(DAU/1000)", "Efficiency metric interviewers love", 'final')
r += 1
section_bar(ws, r, "COST OPTIMIZATION TIPS (info)"); r += 1
tips = ["Reserved Instances (1yr): 30-40% savings on steady-state workloads",
        "Savings Plans: 20-30% flexible commitment discount",
        "Spot for stateless app servers: 60-70% savings (with PodDisruptionBudget)",
        "S3 Intelligent-Tiering: ~30% savings on cold backup data",
        "Right-size everything after 30 days of real observability data"]
for t in tips:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
    ws.cell(row=r, column=1, value="- "+t).font = Font(name='Consolas', size=9)
    r += 1
r += 1
r = talk_track(ws, r, ("Our monthly infra lands in the low five figures, dominated by compute -- around 60% -- "
    "and data transfer at roughly 20%. We optimize with Reserved Instances for the steady-state baseline, Spot "
    "for burstable app servers, and aggressive CDN caching to keep egress down."), span=6)
print("16 done")

# =====================================================================
# SHEET 17: FINAL SUMMARY CHEATSHEET
# =====================================================================
ws = wb.create_sheet("17_Final_Summary_Cheatsheet")
print_setup(ws)
set_colwidths(ws, [16, 30, 16, 12])
style_title(ws, "17 - Final Summary Cheatsheet (One-Page Whiteboard Script)", span=4)
r = 3
header_row(ws, r, ["Layer","Component","Value","Unit"]); r += 1
summary_rows = [
    ("Users","MAU","=MAU","users"),
    ("Users","DAU","=DAU","users"),
    ("Users","Peak Concurrent","=PCU","users"),
    ("Traffic","Peak API RPS","=Peak_RPS","req/s"),
    ("Frontend","CDN PoPs Used","=CDN_PoPs_Global","PoPs"),
    ("Frontend","Origin Traffic","='03_Frontend_CDN'!C6","GB/day"),
    ("Edge","WAF Rules","=WAF_Rules","rules"),
    ("Edge","NLB Instances","=LB_Instances","nodes"),
    ("Gateway","API Gateway Pods","=Gateway_Instances_Sized","pods"),
    ("Gateway","Gateway Latency","=Gateway_Latency_ms","ms"),
    ("Gateway","Rate Limit (user)","=Rate_Limit_User_RPM","req/min"),
    ("Backend","Total App Pods","=Total_App_Instances","pods"),
    ("Backend","Total vCPU","=Total_vCPU","cores"),
    ("Backend","Total RAM","=Total_RAM_GB","GB"),
    ("Latency","P95","=P95_Latency_ms","ms"),
    ("Kafka","Brokers","=Kafka_Brokers","nodes"),
    ("Kafka","Partitions (adjusted)","=Kafka_Partitions","count"),
    ("Kafka","Throughput","=Kafka_Internal_MBps","MB/s"),
    ("Database","DB QPS (post-cache)","=Actual_DB_QPS","qps"),
    ("Database","DB IOPS Required","=DB_Recommended_IOPS","iops"),
    ("Database","Read Replicas","=DB_Read_Replicas","nodes"),
    ("Cache","Redis Shards","=REDIS_SHARDS","shards"),
    ("Cache","Redis Cluster Size","=Redis_Cluster_GB","GB"),
    ("DLQ","Retry Tiers","=Max_Retries","tiers"),
    ("DLQ","Msgs -> DLQ / day","=DLQ_Msgs_Per_Day","msgs"),
    ("Spike","Load Shed Threshold","=Load_Shed_Threshold_Pct","%"),
    ("Observability","Log Retention","=Log_Retention_Days","days"),
    ("Cost","Monthly Infra","=Total_Monthly_Cost","USD"),
    ("Cost","Annual Infra","=Total_Annual_Cost","USD"),
]
for layer, comp, formula, unit in summary_rows:
    ws.cell(row=r, column=1, value=layer).border = BORDER
    ws.cell(row=r, column=2, value=comp).border = BORDER
    c = ws.cell(row=r, column=3, value=formula); c.border = BORDER; c.fill = FILL_FINAL
    c.number_format = '#,##0.##'
    ws.cell(row=r, column=4, value=unit).border = BORDER
    r += 1
r += 1
section_bar(ws, r, "WHITEBOARD SCRIPT (memorize this)", span=4); r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
ws.cell(row=r, column=1, value=(
    "10M MAU -> 2M DAU -> 400k concurrent -> ~3.3k raw RPS -> ~7k RPS with a 2x buffer. "
    "CDN absorbs 98% of static traffic. Gateway: ~9 pods, ~3.5ms overhead. Backend: ~20+ pods across 5 "
    "services plus gateway. Kafka: 6 brokers, 24 partitions, ~7MB/s producer throughput. Postgres: 64GB RAM, "
    "~1,050 QPS after a 95% cache hit rate. Redis: 3 shards, single-digit GB. DLQ with a 3-tier exponential "
    "retry. Multi-AZ end to end. Total monthly infra in the low five figures."
)).alignment = WRAP
ws.row_dimensions[r].height = 90
print("17 done")

# =====================================================================
# SHEET 18: INTERVIEW PRACTICE
# =====================================================================
ws = wb.create_sheet("18_Interview_Practice")
print_setup(ws)
set_colwidths(ws, [34, 46, 30, 26, 30])
style_title(ws, "18 - Interview Practice (10 Scenarios)", span=5)
r = 3
header_row(ws, r, ["Question","Expected Answer (gist)","Key Formulas / Sheets Used","Red Flags to Avoid","Bonus Points"])
r += 1
scenarios = [
 ("Design an e-commerce checkout flow at 10M DAU",
  "Walk client->CDN->gateway->order svc->payment svc(idempotent)->Kafka outbox->inventory->confirmation. Anchor everything on Peak_RPS.",
  "02_User_Metrics, 06_Backend_Services, 07_Network_Latency",
  "Jumping straight to microservices without stating scale assumptions first",
  "Saga pattern for cross-service consistency; outbox pattern for exactly-once publish"),
 ("Add real-time order tracking",
  "WebSocket for live tracking, SSE for price updates; size concurrent connections off PCU.",
  "04_API_Gateway Section E (WS/SSE sizing)",
  "Polling instead of push at this scale",
  "Fan-out via Redis pub/sub or a dedicated notification service"),
 ("Handle Black Friday 10x traffic",
  "Pre-scale via HPA, priority-based load shedding, DDoS layers at the edge.",
  "12_Traffic_Spikes_DDoS",
  "Relying only on reactive autoscaling with no pre-warm",
  "Chaos-day rehearsal before the actual event"),
 ("Prevent double-charging on payment retries",
  "Idempotency keys on payment writes, idempotent producer + transactions on payment.transactions topic.",
  "08_Kafka_Design Section E, 09_Database_Design",
  "Relying on client-side retry dedup only",
  "Outbox table + CDC instead of dual-write"),
 ("Diagnose a Kafka consumer lag of 100k",
  "Check partition count vs consumer count, slow downstream calls, GC pauses, rebalance storms.",
  "08_Kafka_Design, 13_Observability SLO table",
  "Blaming Kafka itself before checking consumer-side logic",
  "CooperativeStickyAssignor to avoid rebalance storms"),
 ("Design DLQ + replay for a bad deploy",
  "Tiered retry -> DLQ, schema preserves offset/partition, batch reprocessing with manual approval.",
  "11_DLQ_Error_Handling",
  "No poison-pill detection -> infinite retry loop",
  "Shadow-replay against a canary before full reprocess"),
 ("Add multi-region active-active",
  "Regional Kafka clusters + MirrorMaker2 or geo-replicated cache; conflict resolution via CRDTs or last-write-wins with vector clocks.",
  "08_Kafka_Design, 10_Cache_Redis",
  "Assuming synchronous cross-region replication is 'free'",
  "CRDTs for cart state; regional read affinity"),
 ("Reduce P95 latency from 500ms to 150ms",
  "Walk the hop-by-hop budget, find the biggest single contributor (usually uncached DB path), fix cache hit rate or add read replica.",
  "07_Network_Latency",
  "Guessing without walking the latency budget first",
  "Tail-latency-aware load balancing (choice of 2)"),
 ("Cut infra cost by 40% without SLA impact",
  "Reserved Instances on steady baseline, Spot for burstable app tier, right-size after observability data, S3 tiering.",
  "16_Cost_Estimator",
  "Cutting redundancy (replicas, multi-AZ) to save cost",
  "Cost-per-1000-DAU as the north-star efficiency metric"),
 ("Migrate from ZooKeeper to KRaft with zero downtime",
  "Dual-write metadata during migration, roll controllers first, then brokers, validate quorum before cutover.",
  "08_Kafka_Design Section D",
  "Big-bang cutover with no rollback plan",
  "KIP-866 migration mode awareness"),
]
for q, a, f, rf, bp in scenarios:
    ws.cell(row=r, column=1, value=q).font = FONT_BOLD
    for col, val in zip((2,3,4,5), (a,f,rf,bp)):
        c = ws.cell(row=r, column=col, value=val)
        c.alignment = WRAP
    for col in range(1,6):
        ws.cell(row=r, column=col).border = BORDER
        ws.row_dimensions[r].height = 60
    r += 1
print("18 done")

# =====================================================================
# CHARTS
# =====================================================================

# --- Chart A: Latency waterfall (bar of cumulative latency by hop) on 07 ---
ws07 = wb["07_Network_Latency"]
cats = Reference(ws07, min_col=1, min_row=first_hop_row, max_row=last_hop_row)
data = Reference(ws07, min_col=3, min_row=first_hop_row, max_row=last_hop_row)
chart1 = BarChart()
chart1.type = "col"
chart1.title = "Latency Waterfall - Cumulative ms by Hop"
chart1.y_axis.title = "Cumulative ms"
chart1.x_axis.title = "Hop"
chart1.add_data(data, titles_from_data=False)
chart1.series[0].tx = None
chart1.legend = None
chart1.set_categories(cats)
chart1.height = 9
chart1.width = 22
ws07.add_chart(chart1, f"G3")

# --- Chart B: Cost breakdown pie on 16 ---
ws16 = wb["16_Cost_Estimator"]
labels = Reference(ws16, min_col=1, min_row=first_cost_row, max_row=last_cost_row)
values = Reference(ws16, min_col=5, min_row=first_cost_row, max_row=last_cost_row)
chart2 = PieChart()
chart2.title = "Monthly Cost Breakdown"
chart2.add_data(values, titles_from_data=False)
chart2.set_categories(labels)
chart2.height = 10
chart2.width = 16
ws16.add_chart(chart2, "H3")

# --- Chart C: Throughput vs Partitions sensitivity on 08 ---
ws08 = wb["08_Kafka_Design"]
sens_row = ws08.max_row + 2
section_bar(ws08, sens_row, "SENSITIVITY: THROUGHPUT vs PARTITIONS", span=5)
sens_row += 1
header_row(ws08, sens_row, ["Partitions", "Max Producer Throughput (MB/s)", "Max Consumer Throughput (MB/s)", "", ""])
sens_row += 1
sens_first = sens_row
for p in [6, 12, 18, 24, 30, 36, 48, 60]:
    ws08.cell(row=sens_row, column=1, value=p).border = BORDER
    c2 = ws08.cell(row=sens_row, column=2, value=f"=A{sens_row}*PRODUCER_PER_PARTITION_MBPS"); c2.border = BORDER
    c3 = ws08.cell(row=sens_row, column=3, value=f"=A{sens_row}*CONSUMER_PER_PARTITION_MBPS"); c3.border = BORDER
    sens_row += 1
sens_last = sens_row - 1

chart3 = LineChart()
chart3.title = "Throughput vs Partitions Sensitivity"
chart3.y_axis.title = "MB/s"
chart3.x_axis.title = "Partitions"
data3 = Reference(ws08, min_col=2, max_col=3, min_row=sens_first-1, max_row=sens_last)
cats3 = Reference(ws08, min_col=1, min_row=sens_first, max_row=sens_last)
chart3.add_data(data3, titles_from_data=True)
chart3.set_categories(cats3)
chart3.height = 9
chart3.width = 20
ws08.add_chart(chart3, "G3")

print("Charts added")

# =====================================================================
# FINALIZE
# =====================================================================
order = ["00_README","01_Master_Inputs","02_User_Metrics","03_Frontend_CDN","04_API_Gateway",
         "05_Load_Balancer","06_Backend_Services","07_Network_Latency","08_Kafka_Design",
         "09_Database_Design","10_Cache_Redis","11_DLQ_Error_Handling","12_Traffic_Spikes_DDoS",
         "13_Observability","14_Cloud_Provider_Mapping","15_Cloud_Infra_Picker","16_Cost_Estimator",
         "17_Final_Summary_Cheatsheet","18_Interview_Practice","Scenarios"]
wb._sheets = [wb[name] for name in order]
wb.active = 0

finalize_named_ranges()
print("Named ranges defined:", len(NAMED_RANGES))

out_path = "/home/claude/System_Design_Master_Calculator.xlsx"
wb.save(out_path)
print("Saved", out_path)

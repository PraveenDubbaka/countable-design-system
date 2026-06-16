import React, { useState, useEffect, useCallback, useRef } from 'react';
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from '@/lib/safeJson';

export type FSPageType = 'cover' | 'toc' | 'bs' | 'is' | 'cf' | 'eq' | 'notes';

// ─── Data types ────────────────────────────────────────────────────────────

interface FSData {
  entityName: string;
  yearEnd: string;
  priorYearEnd: string;
  periodLabel: string;
  priorPeriodLabel: string;
  bs: Record<string, number>;
  is: Record<string, number>;
  cf: Record<string, number>;
  eq: Record<string, number>;
  notes: Record<string, string>;
}

// ─── Default CA data (Shipping Line Inc., March 31, 2024) ─────────────────

const CA_DEFAULT: FSData = {
  entityName: 'Shipping Line Inc.',
  yearEnd: 'March 31, 2024',
  priorYearEnd: 'March 31, 2023',
  periodLabel: 'Year ended March 31, 2024',
  priorPeriodLabel: 'Year ended March 31, 2023',
  bs: {
    cash: 1062277,           cashPY: 892441,
    receivables: 2890123,    receivablesPY: 2340567,
    inventory: 456234,       inventoryPY: 523891,
    prepaid: 125678,         prepaidPY: 98345,
    ppe: 8456789,            ppePY: 9123456,
    rou: 2345678,            rouPY: 2890234,
    intangibles: 234567,     intangiblesPY: 312789,
    ap: 1890456,             apPY: 1670234,
    currentLtd: 456789,      currentLtdPY: 435678,
    currentLease: 345678,    currentLeasePY: 378456,
    taxPayable: 123456,      taxPayablePY: 89234,
    ltDebt: 4567890,         ltDebtPY: 5023456,
    ltLease: 2123456,        ltLeasePY: 2468789,
    deferredTax: 456789,     deferredTaxPY: 423456,
    shareCapital: 1000000,   shareCapitalPY: 1000000,
    retainedEarnings: 4606832, retainedEarningsPY: 4692420,
  },
  is: {
    revenue: 18450234,       revenuePY: 16820456,
    cogs: 12340567,          cogsPY: 11234789,
    admin: 2890456,          adminPY: 2670234,
    da: 1234567,             daPY: 1123456,
    interest: 456789,        interestPY: 489234,
    tax: 430353,             taxPY: 312066,
    reBeg: 4692420,          reBegPY: 3701743,
    dividends: 1183090,      dividendsPY: 0,
  },
  cf: {
    netIncome: 1097502,      netIncomePY: 990677,
    da: 1234567,             daPY: 1123456,
    rouAmort: 344556,        rouAmortPY: 378456,
    deferredTax: 33333,      deferredTaxPY: 45678,
    receivables: -549556,    receivablesPY: -289345,
    inventory: 67657,        inventoryPY: 45678,
    prepaid: -27333,         prepaidPY: 12456,
    payables: 220222,        payablesPY: 189345,
    taxPayable: 34222,       taxPayablePY: -12066,
    capex: -478900,          capexPY: -456789,
    ltdRepay: -434555,       ltdRepayPY: -423456,
    leaseRepay: -373001,     leaseRepayPY: -389234,
    dividendsPaid: -998878,  dividendsPaidPY: -892415,
    cashBeg: 892441,         cashBegPY: 570000,
  },
  eq: {
    scBeg: 1000000,    scBegPY: 1000000,
    reBeg: 4692420,    reBegPY: 3701743,
    netIncome: 1097502,netIncomePY: 990677,
    dividends: 1183090,dividendsPY: 0,
    scEnd: 1000000,    scEndPY: 1000000,
    reEnd: 4606832,    reEndPY: 4692420,
  },
  notes: {
    '1': 'Shipping Line Inc. (the "Company") is incorporated under the laws of Ontario, Canada. The Company provides marine transportation, logistics, and freight forwarding services primarily in the Great Lakes and St. Lawrence Seaway region.',
    '2': 'These financial statements have been prepared in accordance with Canadian generally accepted accounting principles (GAAP) as set out in Part II of the CPA Canada Handbook – Accounting.\n\nRevenue Recognition: Revenue from services is recognized when the performance obligation to the customer is satisfied, at the point in time when services are rendered and the customer can benefit from them.\n\nProperty, Plant and Equipment: Assets are recorded at cost less accumulated depreciation. Depreciation is calculated using the straight-line method over the estimated useful lives of the assets ranging from 3 to 30 years.\n\nLeases: The Company recognizes a right-of-use asset and lease liability at the commencement date of a lease. Lease liabilities are measured at the present value of remaining lease payments discounted at the incremental borrowing rate.',
    '3': 'Income taxes are accounted for using the asset and liability method. Deferred income taxes are recognized for the expected future tax consequences of temporary differences between the carrying amounts and tax bases of assets and liabilities using enacted or substantively enacted tax rates.',
    '4': 'Trade and other receivables are recorded at amortized cost using the effective interest method, net of an allowance for expected credit losses. The allowance is estimated based on historical collection experience and current conditions.',
    '5': 'Property, plant and equipment consist of vessels, terminal equipment, vehicles, and office equipment. Vessels are depreciated over 20–30 years; terminal equipment over 10–15 years; vehicles over 5–8 years; office equipment over 3–5 years.',
    '6': 'Long-term debt consists of a secured term loan bearing interest at the bank prime rate plus 1.25% per annum, repayable in equal quarterly instalments with the final payment due September 2028. The loan is secured by a general security agreement over all assets of the Company.',
    '7': 'The Company has a $2,000,000 revolving operating line of credit bearing interest at prime plus 0.50%, secured by trade receivables. As at March 31, 2024, no amount was drawn on the operating line.',
  },
};

// ─── Default US data (Harbor Freight Logistics LLC, Dec 31, 2024) ─────────

const US_DEFAULT: FSData = {
  entityName: 'Harbor Freight Logistics LLC',
  yearEnd: 'December 31, 2024',
  priorYearEnd: 'December 31, 2023',
  periodLabel: 'Year ended December 31, 2024',
  priorPeriodLabel: 'Year ended December 31, 2023',
  bs: {
    cash: 1456789,           cashPY: 1123456,
    receivables: 2890234,    receivablesPY: 2456789,
    inventory: 567890,       inventoryPY: 534567,
    prepaid: 145678,         prepaidPY: 123456,
    ppe: 9234567,            ppePY: 10123456,
    rou: 2345678,            rouPY: 2890234,
    intangibles: 234567,     intangiblesPY: 312345,
    ap: 1789012,             apPY: 1567890,
    currentLtd: 456789,      currentLtdPY: 423456,
    currentLease: 345678,    currentLeasePY: 378901,
    taxPayable: 189234,      taxPayablePY: 156789,
    ltDebt: 4567890,         ltDebtPY: 5023456,
    ltLease: 2012345,        ltLeasePY: 2356789,
    deferredTax: 456789,     deferredTaxPY: 412345,
    shareCapital: 1000000,   shareCapitalPY: 1000000,
    retainedEarnings: 6057666, retainedEarningsPY: 6244677,
  },
  is: {
    revenue: 24567890,       revenuePY: 21890123,
    cogs: 16234567,          cogsPY: 14567890,
    admin: 2890456,          adminPY: 2634567,
    da: 1456789,             daPY: 1312345,
    interest: 567890,        interestPY: 612345,
    tax: 876543,             taxPY: 712345,
    reBeg: 6244677,          reBegPY: 6244046,
    dividends: 2728656,      dividendsPY: 2050000,
  },
  cf: {
    netIncome: 2541645,      netIncomePY: 2050631,
    da: 1456789,             daPY: 1312345,
    rouAmort: 345678,        rouAmortPY: 378901,
    deferredTax: 44444,      deferredTaxPY: 38901,
    receivables: -433445,    receivablesPY: -234567,
    inventory: -33323,       inventoryPY: -34567,
    prepaid: -22222,         prepaidPY: -12345,
    payables: 221122,        payablesPY: 167890,
    taxPayable: 32445,       taxPayablePY: -23456,
    capex: -678900,          capexPY: -534567,
    ltdRepay: -455566,       ltdRepayPY: -423456,
    leaseRepay: -356678,     leaseRepayPY: -389234,
    dividendsPaid: -2328656, dividendsPaidPY: -1962032,
    cashBeg: 1123456,        cashBegPY: 789012,
  },
  eq: {
    scBeg: 1000000,    scBegPY: 1000000,
    reBeg: 6244677,    reBegPY: 6244046,
    netIncome: 2541645,netIncomePY: 2050631,
    dividends: 2728656,dividendsPY: 2050000,
    scEnd: 1000000,    scEndPY: 1000000,
    reEnd: 6057666,    reEndPY: 6244677,
  },
  notes: {
    '1': 'Harbor Freight Logistics LLC (the "Company") is organized under the laws of Delaware, United States. The Company provides freight brokerage, transportation management, and third-party logistics services throughout North America.',
    '2': 'These financial statements have been prepared in accordance with accounting principles generally accepted in the United States of America (U.S. GAAP).\n\nRevenue Recognition: Revenue is recognized in accordance with ASC 606, Revenue from Contracts with Customers, when control of the promised services is transferred to the customer, in an amount reflecting the consideration expected in exchange for those services.\n\nProperty and Equipment: Property and equipment are stated at cost less accumulated depreciation. Depreciation is computed using the straight-line method over the estimated useful lives of the assets, ranging from 3 to 20 years.\n\nLeases: The Company accounts for leases in accordance with ASC 842. Operating lease right-of-use assets and liabilities are recognized at the commencement date.',
    '3': 'The Company accounts for income taxes under the asset and liability method in accordance with ASC 740. Deferred tax assets and liabilities are recognized for the expected future tax consequences of temporary differences between the financial statement carrying amounts and the tax bases of assets and liabilities.',
    '4': 'Trade receivables are recorded at the invoiced amount and do not bear interest. An allowance for doubtful accounts is established when there is objective evidence that the Company will not be able to collect amounts due.',
    '5': 'Property and equipment consist of trucks and trailers, warehouse equipment, technology infrastructure, and office furniture. Trucks and trailers are depreciated over 5–10 years; warehouse equipment over 7–15 years; technology over 3–5 years.',
    '6': 'Long-term debt consists of a revolving credit facility bearing interest at SOFR plus 1.50% and a term loan bearing interest at SOFR plus 1.75%. Both facilities are secured by substantially all assets of the Company.',
    '7': 'Member distributions declared during the year ended December 31, 2024 totaled $2,728,656 (2023 – $2,050,000). Distributions are made in accordance with the Company\'s operating agreement.',
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtN(n: number): string {
  if (n === 0) return '—';
  const abs = Math.abs(n);
  const s = abs.toLocaleString('en-CA');
  return n < 0 ? `(${s})` : s;
}

function computedBS(d: FSData['bs']) {
  const totCurrentAssets = d.cash + d.receivables + d.inventory + d.prepaid;
  const totCurrentAssetsPY = d.cashPY + d.receivablesPY + d.inventoryPY + d.prepaidPY;
  const totNonCurrentAssets = d.ppe + d.rou + d.intangibles;
  const totNonCurrentAssetsPY = d.ppePY + d.rouPY + d.intangiblesPY;
  const totalAssets = totCurrentAssets + totNonCurrentAssets;
  const totalAssetsPY = totCurrentAssetsPY + totNonCurrentAssetsPY;
  const totCurrentLiab = d.ap + d.currentLtd + d.currentLease + d.taxPayable;
  const totCurrentLiabPY = d.apPY + d.currentLtdPY + d.currentLeasePY + d.taxPayablePY;
  const totNonCurrentLiab = d.ltDebt + d.ltLease + d.deferredTax;
  const totNonCurrentLiabPY = d.ltDebtPY + d.ltLeasePY + d.deferredTaxPY;
  const totalLiab = totCurrentLiab + totNonCurrentLiab;
  const totalLiabPY = totCurrentLiabPY + totNonCurrentLiabPY;
  const totalEquity = d.shareCapital + d.retainedEarnings;
  const totalEquityPY = d.shareCapitalPY + d.retainedEarningsPY;
  return { totCurrentAssets, totCurrentAssetsPY, totNonCurrentAssets, totNonCurrentAssetsPY, totalAssets, totalAssetsPY, totCurrentLiab, totCurrentLiabPY, totNonCurrentLiab, totNonCurrentLiabPY, totalLiab, totalLiabPY, totalEquity, totalEquityPY };
}

function computedIS(d: FSData['is']) {
  const grossProfit = d.revenue - d.cogs;
  const grossProfitPY = d.revenuePY - d.cogsPY;
  const totalExpenses = d.admin + d.da + d.interest;
  const totalExpensesPY = d.adminPY + d.daPY + d.interestPY;
  const incomeBeforeTax = grossProfit - totalExpenses;
  const incomeBeforeTaxPY = grossProfitPY - totalExpensesPY;
  const netIncome = incomeBeforeTax - d.tax;
  const netIncomePY = incomeBeforeTaxPY - d.taxPY;
  const reEnd = d.reBeg + netIncome - d.dividends;
  const reEndPY = d.reBegPY + netIncomePY - d.dividendsPY;
  return { grossProfit, grossProfitPY, totalExpenses, totalExpensesPY, incomeBeforeTax, incomeBeforeTaxPY, netIncome, netIncomePY, reEnd, reEndPY };
}

function computedCF(d: FSData['cf']) {
  const operating = d.netIncome + d.da + d.rouAmort + d.deferredTax + d.receivables + d.inventory + d.prepaid + d.payables + d.taxPayable;
  const operatingPY = d.netIncomePY + d.daPY + d.rouAmortPY + d.deferredTaxPY + d.receivablesPY + d.inventoryPY + d.prepaidPY + d.payablesPY + d.taxPayablePY;
  const investing = d.capex;
  const investingPY = d.capexPY;
  const financing = d.ltdRepay + d.leaseRepay + d.dividendsPaid;
  const financingPY = d.ltdRepayPY + d.leaseRepayPY + d.dividendsPaidPY;
  const netChange = operating + investing + financing;
  const netChangePY = operatingPY + investingPY + financingPY;
  const cashEnd = d.cashBeg + netChange;
  const cashEndPY = d.cashBegPY + netChangePY;
  return { operating, operatingPY, investing, investingPY, financing, financingPY, netChange, netChangePY, cashEnd, cashEndPY };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface NumCellProps {
  value: number;
  fieldKey: string;
  section: 'bs' | 'is' | 'cf' | 'eq';
  isEditing: boolean;
  onUpdate: (section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => void;
  bold?: boolean;
  className?: string;
}

function NumCell({ value, fieldKey, section, isEditing, onUpdate, bold, className }: NumCellProps) {
  const [raw, setRaw] = useState('');
  useEffect(() => { if (isEditing) setRaw(value < 0 ? `-${Math.abs(value)}` : String(value)); }, [isEditing, value]);

  if (isEditing) {
    return (
      <td className={`py-0.5 px-1 w-36 ${className ?? ''}`}>
        <input
          type="text"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          onBlur={() => {
            const parsed = parseFloat(raw.replace(/,/g, '')) || 0;
            onUpdate(section, fieldKey, parsed);
          }}
          className="w-full text-right bg-blue-50 border border-blue-200 rounded px-1 py-0 text-sm focus:outline-none focus:border-blue-400"
          style={{ fontFamily: 'monospace' }}
        />
      </td>
    );
  }
  return (
    <td className={`py-0.5 px-2 text-right tabular-nums w-36 ${bold ? 'font-semibold' : ''} ${className ?? ''}`}
        style={{ fontFamily: "'Courier New', monospace", fontSize: '13px' }}>
      {fmtN(value)}
    </td>
  );
}

interface TotalCellProps {
  value: number;
  borderTop?: boolean;
  doubleUnderline?: boolean;
  className?: string;
}

function TotalCell({ value, borderTop, doubleUnderline, className }: TotalCellProps) {
  return (
    <td
      className={`py-0.5 px-2 text-right tabular-nums w-36 font-semibold ${className ?? ''}`}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '13px',
        borderTop: borderTop ? '1px solid #333' : undefined,
        borderBottom: doubleUnderline ? '3px double #333' : undefined,
      }}
    >
      {fmtN(value)}
    </td>
  );
}

// ─── Page: Cover ─────────────────────────────────────────────────────────────

function CoverPage({ data, isEditing, onUpdateText }: {
  data: FSData; isEditing: boolean; onUpdateText: (field: keyof FSData, val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[700px] text-center gap-8">
      <div className="space-y-2">
        {isEditing ? (
          <input className="text-3xl font-bold text-center border-b border-blue-300 bg-blue-50 focus:outline-none w-full"
            value={data.entityName} onChange={e => onUpdateText('entityName', e.target.value)} />
        ) : (
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.01em' }}>{data.entityName}</h1>
        )}
      </div>
      <div style={{ width: '120px', borderTop: '2px solid #333' }} />
      <div className="space-y-3">
        <p style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Financial Statements
        </p>
        {isEditing ? (
          <input className="text-base text-center border-b border-blue-300 bg-blue-50 focus:outline-none w-full"
            value={data.yearEnd} onChange={e => onUpdateText('yearEnd', e.target.value)} />
        ) : (
          <p style={{ fontSize: '15px' }}>For the Year Ended {data.yearEnd}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page: Table of Contents ──────────────────────────────────────────────────

function TocPage({ data }: { data: FSData }) {
  const items = [
    { label: "Independent Auditor's Report", page: '1–2' },
    { label: 'Balance Sheet', page: '3' },
    { label: 'Statement of Income (Loss) and Retained Earnings (Deficit)', page: '4' },
    { label: 'Statement of Cash Flows', page: '5' },
    { label: 'Statement of Changes in Equity', page: '6' },
    { label: 'Notes to Financial Statements', page: '7–20' },
  ];
  return (
    <div>
      <p style={{ fontSize: '13px', marginBottom: '8px', color: '#555' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Table of Contents</h2>
      <p style={{ fontSize: '13px', marginBottom: '28px', color: '#555' }}>{data.yearEnd}</p>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 600, paddingBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Statement</th>
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, paddingBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e5e5' }}>
              <td style={{ fontSize: '13px', padding: '10px 0' }}>{item.label}</td>
              <td style={{ fontSize: '13px', padding: '10px 0', textAlign: 'right', fontFamily: 'monospace' }}>{item.page}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page: Balance Sheet ──────────────────────────────────────────────────────

function BSPage({ data, isEditing, onUpdate }: {
  data: FSData; isEditing: boolean;
  onUpdate: (section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => void;
}) {
  const c = computedBS(data.bs);
  const bs = data.bs;
  type LabelRowProps = { label: string; indent?: number; note?: string };
  function LabelRow({ label, indent = 0, note }: LabelRowProps) {
    return (
      <tr>
        <td style={{ paddingLeft: `${12 + indent * 20}px`, fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>
          {label}{note && <em style={{ color: '#555', fontSize: '12px' }}> (Note {note})</em>}
        </td>
        <td /><td />
      </tr>
    );
  }
  function DataRow({ label, cy, cyKey, py, pyKey, indent = 0, note }: {
    label: string; cy: number; cyKey: string; py: number; pyKey: string; indent?: number; note?: string;
  }) {
    return (
      <tr>
        <td style={{ paddingLeft: `${28 + indent * 16}px`, fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>
          {label}{note && <em style={{ color: '#555', fontSize: '12px' }}> (Note {note})</em>}
        </td>
        <NumCell value={cy} fieldKey={cyKey} section="bs" isEditing={isEditing} onUpdate={onUpdate} />
        <NumCell value={py} fieldKey={pyKey} section="bs" isEditing={isEditing} onUpdate={onUpdate} />
      </tr>
    );
  }
  function SubtotalRow({ label, cy, py }: { label: string; cy: number; py: number }) {
    return (
      <tr>
        <td style={{ paddingLeft: '28px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 600 }}>{label}</td>
        <TotalCell value={cy} borderTop />
        <TotalCell value={py} borderTop />
      </tr>
    );
  }
  function TotalRow({ label, cy, py, double }: { label: string; cy: number; py: number; double?: boolean }) {
    return (
      <tr>
        <td style={{ paddingLeft: '12px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</td>
        <TotalCell value={cy} borderTop doubleUnderline={double} />
        <TotalCell value={py} borderTop doubleUnderline={double} />
      </tr>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Balance Sheet</h2>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>As at {data.yearEnd}</p>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', fontWeight: 'normal', paddingBottom: '6px', width: '60%' }} />
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.yearEnd.split(' ').slice(-2).join(' ')}</th>
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.priorYearEnd.split(' ').slice(-2).join(' ')}</th>
          </tr>
        </thead>
        <tbody>
          {/* Assets */}
          <tr><td colSpan={3} style={{ paddingTop: '14px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assets</td></tr>
          <LabelRow label="Current assets" />
          <DataRow label="Cash and cash equivalents" cy={bs.cash} cyKey="cash" py={bs.cashPY} pyKey="cashPY" indent={1} />
          <DataRow label="Trade and other receivables" cy={bs.receivables} cyKey="receivables" py={bs.receivablesPY} pyKey="receivablesPY" indent={1} note="5" />
          <DataRow label="Inventories" cy={bs.inventory} cyKey="inventory" py={bs.inventoryPY} pyKey="inventoryPY" indent={1} />
          <DataRow label="Prepaid expenses and deposits" cy={bs.prepaid} cyKey="prepaid" py={bs.prepaidPY} pyKey="prepaidPY" indent={1} />
          <SubtotalRow label="Total current assets" cy={c.totCurrentAssets} py={c.totCurrentAssetsPY} />
          <tr><td style={{ paddingTop: '12px' }} /></tr>
          <LabelRow label="Non-current assets" />
          <DataRow label="Property, plant and equipment" cy={bs.ppe} cyKey="ppe" py={bs.ppePY} pyKey="ppePY" indent={1} note="6" />
          <DataRow label="Right-of-use assets" cy={bs.rou} cyKey="rou" py={bs.rouPY} pyKey="rouPY" indent={1} />
          <DataRow label="Intangible assets" cy={bs.intangibles} cyKey="intangibles" py={bs.intangiblesPY} pyKey="intangiblesPY" indent={1} />
          <SubtotalRow label="Total non-current assets" cy={c.totNonCurrentAssets} py={c.totNonCurrentAssetsPY} />
          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <TotalRow label="Total Assets" cy={c.totalAssets} py={c.totalAssetsPY} double />

          {/* Liabilities */}
          <tr><td colSpan={3} style={{ paddingTop: '20px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Liabilities</td></tr>
          <LabelRow label="Current liabilities" />
          <DataRow label="Accounts payable and accrued liabilities" cy={bs.ap} cyKey="ap" py={bs.apPY} pyKey="apPY" indent={1} />
          <DataRow label="Current portion of long-term debt" cy={bs.currentLtd} cyKey="currentLtd" py={bs.currentLtdPY} pyKey="currentLtdPY" indent={1} note="7" />
          <DataRow label="Current portion of lease liabilities" cy={bs.currentLease} cyKey="currentLease" py={bs.currentLeasePY} pyKey="currentLeasePY" indent={1} />
          <DataRow label="Income taxes payable" cy={bs.taxPayable} cyKey="taxPayable" py={bs.taxPayablePY} pyKey="taxPayablePY" indent={1} />
          <SubtotalRow label="Total current liabilities" cy={c.totCurrentLiab} py={c.totCurrentLiabPY} />
          <tr><td style={{ paddingTop: '12px' }} /></tr>
          <LabelRow label="Non-current liabilities" />
          <DataRow label="Long-term debt" cy={bs.ltDebt} cyKey="ltDebt" py={bs.ltDebtPY} pyKey="ltDebtPY" indent={1} note="7" />
          <DataRow label="Lease liabilities" cy={bs.ltLease} cyKey="ltLease" py={bs.ltLeasePY} pyKey="ltLeasePY" indent={1} />
          <DataRow label="Deferred income taxes" cy={bs.deferredTax} cyKey="deferredTax" py={bs.deferredTaxPY} pyKey="deferredTaxPY" indent={1} />
          <SubtotalRow label="Total non-current liabilities" cy={c.totNonCurrentLiab} py={c.totNonCurrentLiabPY} />
          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <TotalRow label="Total Liabilities" cy={c.totalLiab} py={c.totalLiabPY} />

          {/* Equity */}
          <tr><td colSpan={3} style={{ paddingTop: '20px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shareholders' Equity</td></tr>
          <DataRow label="Share capital" cy={bs.shareCapital} cyKey="shareCapital" py={bs.shareCapitalPY} pyKey="shareCapitalPY" />
          <DataRow label="Retained earnings" cy={bs.retainedEarnings} cyKey="retainedEarnings" py={bs.retainedEarningsPY} pyKey="retainedEarningsPY" />
          <SubtotalRow label="Total shareholders' equity" cy={c.totalEquity} py={c.totalEquityPY} />
          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <TotalRow label="Total Liabilities and Shareholders' Equity" cy={c.totalAssets} py={c.totalAssetsPY} double />
        </tbody>
      </table>
      <p style={{ fontSize: '11px', color: '#666', marginTop: '24px', fontStyle: 'italic' }}>
        See accompanying notes to financial statements
      </p>
    </div>
  );
}

// ─── Page: Income Statement ────────────────────────────────────────────────────

function ISPage({ data, isEditing, onUpdate }: {
  data: FSData; isEditing: boolean;
  onUpdate: (section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => void;
}) {
  const c = computedIS(data.is);
  const is = data.is;
  function DataRow({ label, cy, cyKey, py, pyKey, indent = 0 }: {
    label: string; cy: number; cyKey: string; py: number; pyKey: string; indent?: number;
  }) {
    return (
      <tr>
        <td style={{ paddingLeft: `${28 + indent * 16}px`, fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>{label}</td>
        <NumCell value={cy} fieldKey={cyKey} section="is" isEditing={isEditing} onUpdate={onUpdate} />
        <NumCell value={py} fieldKey={pyKey} section="is" isEditing={isEditing} onUpdate={onUpdate} />
      </tr>
    );
  }
  function SubtotalRow({ label, cy, py, indent = 0 }: { label: string; cy: number; py: number; indent?: number }) {
    return (
      <tr>
        <td style={{ paddingLeft: `${28 + indent * 16}px`, fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 600 }}>{label}</td>
        <TotalCell value={cy} borderTop />
        <TotalCell value={py} borderTop />
      </tr>
    );
  }

  const dividendLabel = data.entityName.includes('LLC') ? 'Member distributions' : 'Dividends declared';

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>
        Statement of Income (Loss) and Retained Earnings (Deficit)
      </h2>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>{data.periodLabel}</p>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', fontWeight: 'normal', paddingBottom: '6px', width: '60%' }} />
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.yearEnd.split(' ').slice(-2).join(' ')}</th>
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.priorYearEnd.split(' ').slice(-2).join(' ')}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={3} style={{ paddingTop: '14px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Revenue</td></tr>
          <DataRow label="Revenue from services" cy={is.revenue} cyKey="revenue" py={is.revenuePY} pyKey="revenuePY" indent={1} />

          <tr><td colSpan={3} style={{ paddingTop: '14px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cost of Services</td></tr>
          <DataRow label="Direct service costs" cy={is.cogs} cyKey="cogs" py={is.cogsPY} pyKey="cogsPY" indent={1} />

          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <SubtotalRow label="Gross Profit" cy={c.grossProfit} py={c.grossProfitPY} />

          <tr><td colSpan={3} style={{ paddingTop: '14px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operating Expenses</td></tr>
          <DataRow label="Administrative expenses" cy={is.admin} cyKey="admin" py={is.adminPY} pyKey="adminPY" indent={1} />
          <DataRow label="Depreciation and amortization" cy={is.da} cyKey="da" py={is.daPY} pyKey="daPY" indent={1} />
          <DataRow label="Interest expense" cy={is.interest} cyKey="interest" py={is.interestPY} pyKey="interestPY" indent={1} />
          <SubtotalRow label="Total expenses" cy={c.totalExpenses} py={c.totalExpensesPY} />

          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <SubtotalRow label="Income before income taxes" cy={c.incomeBeforeTax} py={c.incomeBeforeTaxPY} />
          <DataRow label="Income tax expense" cy={is.tax} cyKey="tax" py={is.taxPY} pyKey="taxPY" indent={1} />

          <tr><td style={{ paddingTop: '4px' }} /></tr>
          <tr>
            <td style={{ paddingLeft: '28px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Net Income</td>
            <TotalCell value={c.netIncome} borderTop />
            <TotalCell value={c.netIncomePY} borderTop />
          </tr>

          <tr><td colSpan={3} style={{ paddingTop: '20px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Retained Earnings</td></tr>
          <DataRow label="Retained earnings, beginning of year" cy={is.reBeg} cyKey="reBeg" py={is.reBegPY} pyKey="reBegPY" indent={1} />
          <tr>
            <td style={{ paddingLeft: '28px', fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>Net income for the year</td>
            <td style={{ textAlign: 'right', fontSize: '13px', paddingRight: '8px', fontFamily: 'monospace' }}>{fmtN(c.netIncome)}</td>
            <td style={{ textAlign: 'right', fontSize: '13px', paddingRight: '8px', fontFamily: 'monospace' }}>{fmtN(c.netIncomePY)}</td>
          </tr>
          <DataRow label={dividendLabel} cy={-is.dividends} cyKey="dividends" py={-is.dividendsPY} pyKey="dividendsPY" indent={1} />
          <tr>
            <td style={{ paddingLeft: '28px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Retained Earnings, End of Year</td>
            <TotalCell value={c.reEnd} borderTop doubleUnderline />
            <TotalCell value={c.reEndPY} borderTop doubleUnderline />
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: '11px', color: '#666', marginTop: '24px', fontStyle: 'italic' }}>
        See accompanying notes to financial statements
      </p>
    </div>
  );
}

// ─── Page: Cash Flows ─────────────────────────────────────────────────────────

function CFPage({ data, isEditing, onUpdate }: {
  data: FSData; isEditing: boolean;
  onUpdate: (section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => void;
}) {
  const c = computedCF(data.cf);
  const cf = data.cf;
  function DataRow({ label, cy, cyKey, py, pyKey, indent = 0 }: {
    label: string; cy: number; cyKey: string; py: number; pyKey: string; indent?: number;
  }) {
    return (
      <tr>
        <td style={{ paddingLeft: `${28 + indent * 16}px`, fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>{label}</td>
        <NumCell value={cy} fieldKey={cyKey} section="cf" isEditing={isEditing} onUpdate={onUpdate} />
        <NumCell value={py} fieldKey={pyKey} section="cf" isEditing={isEditing} onUpdate={onUpdate} />
      </tr>
    );
  }
  function SectionTotal({ label, cy, py }: { label: string; cy: number; py: number }) {
    return (
      <tr>
        <td style={{ paddingLeft: '28px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 600 }}>{label}</td>
        <TotalCell value={cy} borderTop />
        <TotalCell value={py} borderTop />
      </tr>
    );
  }

  const distLabel = data.entityName.includes('LLC') ? 'Member distributions paid' : 'Dividends paid';

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Statement of Cash Flows</h2>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>{data.periodLabel}</p>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', fontWeight: 'normal', paddingBottom: '6px', width: '60%' }} />
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.yearEnd.split(' ').slice(-2).join(' ')}</th>
            <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, paddingBottom: '6px', width: '20%', paddingRight: '8px' }}>{data.priorYearEnd.split(' ').slice(-2).join(' ')}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={3} style={{ paddingTop: '14px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operating Activities</td></tr>
          <DataRow label="Net income" cy={cf.netIncome} cyKey="netIncome" py={cf.netIncomePY} pyKey="netIncomePY" indent={1} />
          <tr><td style={{ paddingLeft: '28px', fontSize: '12px', fontStyle: 'italic', color: '#555', paddingTop: '6px', paddingBottom: '2px' }} colSpan={3}>Adjustments:</td></tr>
          <DataRow label="Depreciation and amortization" cy={cf.da} cyKey="da" py={cf.daPY} pyKey="daPY" indent={2} />
          <DataRow label="Amortization of right-of-use assets" cy={cf.rouAmort} cyKey="rouAmort" py={cf.rouAmortPY} pyKey="rouAmortPY" indent={2} />
          <DataRow label="Deferred income taxes" cy={cf.deferredTax} cyKey="deferredTax" py={cf.deferredTaxPY} pyKey="deferredTaxPY" indent={2} />
          <tr><td style={{ paddingLeft: '28px', fontSize: '12px', fontStyle: 'italic', color: '#555', paddingTop: '6px', paddingBottom: '2px' }} colSpan={3}>Changes in working capital:</td></tr>
          <DataRow label="Trade and other receivables" cy={cf.receivables} cyKey="receivables" py={cf.receivablesPY} pyKey="receivablesPY" indent={2} />
          <DataRow label="Inventories" cy={cf.inventory} cyKey="inventory" py={cf.inventoryPY} pyKey="inventoryPY" indent={2} />
          <DataRow label="Prepaid expenses and deposits" cy={cf.prepaid} cyKey="prepaid" py={cf.prepaidPY} pyKey="prepaidPY" indent={2} />
          <DataRow label="Accounts payable and accrued liabilities" cy={cf.payables} cyKey="payables" py={cf.payablesPY} pyKey="payablesPY" indent={2} />
          <DataRow label="Income taxes payable" cy={cf.taxPayable} cyKey="taxPayable" py={cf.taxPayablePY} pyKey="taxPayablePY" indent={2} />
          <SectionTotal label="Net cash provided by operating activities" cy={c.operating} py={c.operatingPY} />

          <tr><td colSpan={3} style={{ paddingTop: '16px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Investing Activities</td></tr>
          <DataRow label="Purchase of property, plant and equipment" cy={cf.capex} cyKey="capex" py={cf.capexPY} pyKey="capexPY" indent={1} />
          <SectionTotal label="Net cash used in investing activities" cy={c.investing} py={c.investingPY} />

          <tr><td colSpan={3} style={{ paddingTop: '16px', paddingBottom: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financing Activities</td></tr>
          <DataRow label="Repayment of long-term debt" cy={cf.ltdRepay} cyKey="ltdRepay" py={cf.ltdRepayPY} pyKey="ltdRepayPY" indent={1} />
          <DataRow label="Repayment of lease liabilities" cy={cf.leaseRepay} cyKey="leaseRepay" py={cf.leaseRepayPY} pyKey="leaseRepayPY" indent={1} />
          <DataRow label={distLabel} cy={cf.dividendsPaid} cyKey="dividendsPaid" py={cf.dividendsPaidPY} pyKey="dividendsPaidPY" indent={1} />
          <SectionTotal label="Net cash used in financing activities" cy={c.financing} py={c.financingPY} />

          <tr><td style={{ paddingTop: '8px' }} /></tr>
          <tr>
            <td style={{ paddingLeft: '12px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 600 }}>Net increase (decrease) in cash and cash equivalents</td>
            <TotalCell value={c.netChange} borderTop />
            <TotalCell value={c.netChangePY} borderTop />
          </tr>
          <DataRow label="Cash and cash equivalents, beginning of year" cy={cf.cashBeg} cyKey="cashBeg" py={cf.cashBegPY} pyKey="cashBegPY" />
          <tr>
            <td style={{ paddingLeft: '12px', fontSize: '13px', paddingTop: '4px', paddingBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cash and cash equivalents, end of year</td>
            <TotalCell value={c.cashEnd} borderTop doubleUnderline />
            <TotalCell value={c.cashEndPY} borderTop doubleUnderline />
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: '11px', color: '#666', marginTop: '24px', fontStyle: 'italic' }}>
        See accompanying notes to financial statements
      </p>
    </div>
  );
}

// ─── Page: Changes in Equity ──────────────────────────────────────────────────

function EQPage({ data, isEditing, onUpdate }: {
  data: FSData; isEditing: boolean;
  onUpdate: (section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => void;
}) {
  const eq = data.eq;
  function DataCell({ cy, cyKey, py, pyKey, bold }: { cy: number; cyKey: string; py: number; pyKey: string; bold?: boolean }) {
    return (
      <>
        <NumCell value={cy} fieldKey={cyKey} section="eq" isEditing={isEditing} onUpdate={onUpdate} bold={bold} />
        <NumCell value={py} fieldKey={pyKey} section="eq" isEditing={isEditing} onUpdate={onUpdate} bold={bold} />
      </>
    );
  }

  const totalBeg = eq.scBeg + eq.reBeg;
  const totalBegPY = eq.scBegPY + eq.reBegPY;
  const totalEnd = eq.scEnd + eq.reEnd;
  const totalEndPY = eq.scEndPY + eq.reEndPY;
  const shareCapLabel = data.entityName.includes('LLC') ? "Members' Capital" : 'Share Capital';
  const distLabel = data.entityName.includes('LLC') ? 'Member distributions' : 'Dividends declared';

  const colHeader: React.CSSProperties = { textAlign: 'right', fontSize: '11px', fontWeight: 700, paddingBottom: '6px', width: '15%', paddingRight: '8px' };

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Statement of Changes in Equity</h2>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>{data.periodLabel}</p>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', fontWeight: 'normal', paddingBottom: '6px' }} />
            <th style={colHeader}>{shareCapLabel}</th>
            <th style={colHeader}>Retained Earnings</th>
            <th style={colHeader}>{shareCapLabel} PY</th>
            <th style={colHeader}>RE PY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontSize: '13px', paddingTop: '12px', paddingBottom: '4px', fontWeight: 600 }}>Balance, beginning of year</td>
            <DataCell cy={eq.scBeg} cyKey="scBeg" py={eq.scBegPY} pyKey="scBegPY" />
          </tr>
          <tr>
            <td style={{ paddingLeft: '24px', fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>Net income</td>
            <NumCell value={0} fieldKey="scNet" section="eq" isEditing={false} onUpdate={onUpdate} />
            <NumCell value={eq.netIncome} fieldKey="netIncome" section="eq" isEditing={isEditing} onUpdate={onUpdate} />
            <NumCell value={0} fieldKey="scNetPY" section="eq" isEditing={false} onUpdate={onUpdate} />
            <NumCell value={eq.netIncomePY} fieldKey="netIncomePY" section="eq" isEditing={isEditing} onUpdate={onUpdate} />
          </tr>
          <tr>
            <td style={{ paddingLeft: '24px', fontSize: '13px', paddingTop: '2px', paddingBottom: '2px' }}>{distLabel}</td>
            <NumCell value={0} fieldKey="scDiv" section="eq" isEditing={false} onUpdate={onUpdate} />
            <NumCell value={-eq.dividends} fieldKey="dividends" section="eq" isEditing={isEditing} onUpdate={onUpdate} />
            <NumCell value={0} fieldKey="scDivPY" section="eq" isEditing={false} onUpdate={onUpdate} />
            <NumCell value={-eq.dividendsPY} fieldKey="dividendsPY" section="eq" isEditing={isEditing} onUpdate={onUpdate} />
          </tr>
          <tr>
            <td style={{ fontSize: '13px', paddingTop: '6px', paddingBottom: '6px', fontWeight: 700 }}>Balance, end of year</td>
            <TotalCell value={eq.scEnd} borderTop doubleUnderline />
            <TotalCell value={eq.reEnd} borderTop doubleUnderline />
            <TotalCell value={eq.scEndPY} borderTop doubleUnderline />
            <TotalCell value={eq.reEndPY} borderTop doubleUnderline />
          </tr>
          <tr>
            <td style={{ fontSize: '13px', paddingTop: '6px', paddingBottom: '2px', fontWeight: 600 }}>Total equity</td>
            <td colSpan={2} style={{ textAlign: 'right', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, paddingRight: '8px', borderTop: '1px solid #333' }}>
              {fmtN(totalEnd)}
            </td>
            <td colSpan={2} style={{ textAlign: 'right', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, paddingRight: '8px', borderTop: '1px solid #333' }}>
              {fmtN(totalEndPY)}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: '11px', color: '#666', marginTop: '24px', fontStyle: 'italic' }}>
        See accompanying notes to financial statements
      </p>
    </div>
  );
}

// ─── Page: Notes ──────────────────────────────────────────────────────────────

function NotesPage({ data, isEditing, onUpdateNote }: {
  data: FSData; isEditing: boolean;
  onUpdateNote: (key: string, val: string) => void;
}) {
  const noteKeys = Object.keys(data.notes).sort((a, b) => Number(a) - Number(b));
  const noteTitles: Record<string, string> = {
    '1': 'Nature of Operations',
    '2': 'Significant Accounting Policies',
    '3': 'Income Taxes',
    '4': 'Trade and Other Receivables',
    '5': 'Property, Plant and Equipment',
    '6': 'Long-term Debt',
    '7': 'Commitments and Contingencies',
  };
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{data.entityName}</p>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Notes to Financial Statements</h2>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '28px' }}>{data.yearEnd}</p>
      <div className="space-y-6">
        {noteKeys.map(key => (
          <div key={key}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Note {key} — {noteTitles[key] ?? 'Additional Disclosure'}
            </h3>
            {isEditing ? (
              <textarea
                value={data.notes[key]}
                onChange={e => onUpdateNote(key, e.target.value)}
                rows={Math.max(3, data.notes[key].split('\n').length + 1)}
                className="w-full text-sm border border-blue-200 bg-blue-50 rounded p-2 focus:outline-none resize-y"
                style={{ fontSize: '13px', lineHeight: '1.6', fontFamily: 'inherit' }}
              />
            ) : (
              <div style={{ fontSize: '13px', lineHeight: '1.65', color: '#222' }}>
                {data.notes[key].split('\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: para ? '8px' : '0' }}>{para}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AuditFSViewerProps {
  pageType: FSPageType;
  engagementId: string;
  isUS?: boolean;
  isEditing: boolean;
  saveRef?: React.MutableRefObject<(() => void) | null>;
}

export function AuditFSViewer({ pageType, engagementId, isUS, isEditing, saveRef }: AuditFSViewerProps) {
  const storageKey = `audit-fs-data-${engagementId}${isUS ? '-us' : ''}`;
  const defaultData = isUS ? US_DEFAULT : CA_DEFAULT;

  const [data, setData] = useState<FSData>(() =>
    readJsonFromLocalStorage<FSData>(storageKey, defaultData)
  );

  // Reload from storage when engagement changes
  useEffect(() => {
    setData(readJsonFromLocalStorage<FSData>(storageKey, isUS ? US_DEFAULT : CA_DEFAULT));
  }, [engagementId, isUS, storageKey]);

  // Expose save function via ref
  useEffect(() => {
    if (saveRef) {
      saveRef.current = () => writeJsonToLocalStorage(storageKey, data);
    }
  }, [data, saveRef, storageKey]);

  // Auto-save when editing
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isEditing) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data, isEditing, storageKey]);

  const onUpdate = useCallback((section: 'bs' | 'is' | 'cf' | 'eq', key: string, val: number) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
  }, []);

  const onUpdateNote = useCallback((key: string, val: string) => {
    setData(prev => ({ ...prev, notes: { ...prev.notes, [key]: val } }));
  }, []);

  const onUpdateText = useCallback((field: keyof FSData, val: string) => {
    setData(prev => ({ ...prev, [field]: val }));
  }, []);

  const paperStyle: React.CSSProperties = {
    background: '#ffffff',
    color: '#111111',
    fontFamily: "'Times New Roman', 'Georgia', serif",
    minHeight: '960px',
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: 'hsl(var(--card))', padding: '32px 24px' }}>
      <div
        className="max-w-3xl mx-auto shadow-[0_4px_32px_rgba(0,0,0,0.18)] rounded-sm relative overflow-hidden"
        style={paperStyle}
      >
        {/* DRAFT watermark */}
        {!isEditing && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
            style={{ zIndex: 0, overflow: 'hidden' }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#bbb',
                opacity: 0.18,
                transform: 'rotate(-35deg)',
                letterSpacing: '0.12em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              DRAFT UNDER DISCUSSION
            </span>
          </div>
        )}

        {/* Page content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '64px' }}>
          {pageType === 'cover' && (
            <CoverPage data={data} isEditing={isEditing} onUpdateText={onUpdateText} />
          )}
          {pageType === 'toc' && <TocPage data={data} />}
          {pageType === 'bs' && (
            <BSPage data={data} isEditing={isEditing} onUpdate={onUpdate} />
          )}
          {pageType === 'is' && (
            <ISPage data={data} isEditing={isEditing} onUpdate={onUpdate} />
          )}
          {pageType === 'cf' && (
            <CFPage data={data} isEditing={isEditing} onUpdate={onUpdate} />
          )}
          {pageType === 'eq' && (
            <EQPage data={data} isEditing={isEditing} onUpdate={onUpdate} />
          )}
          {pageType === 'notes' && (
            <NotesPage data={data} isEditing={isEditing} onUpdateNote={onUpdateNote} />
          )}
        </div>
      </div>
    </div>
  );
}

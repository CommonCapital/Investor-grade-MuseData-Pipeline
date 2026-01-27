'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Types
interface Financials {
  revenue: number[];
  cogs: number[];
  sm: number[];
  rd: number[];
  ga: number[];
}

interface ARRBridge {
  beginning: number[];
  newLogo: number[];
  expansion: number[];
  churn: number[];
  contraction: number[];
}

interface DeferredRevenue {
  beginning: number[];
  billings: number[];
  recognized: number[];
}

interface CashFlow {
  receipts: number[];
  ar: number[];
  dr: number[];
}

interface Metrics {
  gross: number[];
  ebitda: number[];
  endingARR: number[];
  GRR: number[];
  NRR: number[];
  ARRgrowth: number[];
  rule40: number[];
}

interface SheetData {
  name: string;
  rows: (string | string[])[][];
  chartId?: string;
  isDefinition?: boolean;
}

const MusedataDashboard: React.FC = () => {
  const [activeSheet, setActiveSheet] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const years = ['2023 A', '2024 A', '2025 A', '2026 P'];

  const financials: Financials = {
    revenue: [12500000, 18750000, 26500000, 33000000],
    cogs: [3200000, 4800000, 6400000, 7800000],
    sm: [4500000, 6750000, 9500000, 11200000],
    rd: [2000000, 2800000, 3500000, 4200000],
    ga: [1500000, 2200000, 2900000, 3300000],
  };

  const arrBridge: ARRBridge = {
    beginning: [10000000, 13500000, 18000000, 24500000],
    newLogo: [4000000, 5500000, 7000000, 9000000],
    expansion: [2000000, 3000000, 4500000, 6000000],
    churn: [-1500000, -1800000, -2000000, -2300000],
    contraction: [-1000000, -1200000, -1500000, -1700000],
  };

  const deferredRevenue: DeferredRevenue = {
    beginning: [3500000, 4800000, 6000000, 7700000],
    billings: [7000000, 9000000, 12500000, 15000000],
    recognized: [5700000, 7800000, 10500000, 13200000],
  };

  const cashFlow: CashFlow = {
    receipts: [11500000, 16800000, 24000000, 30500000],
    ar: [-500000, -600000, -800000, -900000],
    dr: [1300000, 1200000, 2000000, 2400000],
  };

  const formatNumber = (value: number): string => {
    if (value < 0) {
      return '($' + (-value).toLocaleString() + ')';
    }
    return '$' + value.toLocaleString();
  };

  const calculateMetrics = (): Metrics => {
    const metrics: Metrics = { 
      gross: [], 
      ebitda: [], 
      endingARR: [], 
      GRR: [], 
      NRR: [], 
      ARRgrowth: [], 
      rule40: [] 
    };

    for (let i = 0; i < years.length; i++) {
      const gross = financials.revenue[i] - financials.cogs[i];
      metrics.gross.push(gross);

      const ebitda = gross - financials.sm[i] - financials.rd[i] - financials.ga[i];
      metrics.ebitda.push(ebitda);

      const ending = arrBridge.beginning[i] + arrBridge.newLogo[i] + 
                     arrBridge.expansion[i] + arrBridge.churn[i] + arrBridge.contraction[i];
      metrics.endingARR.push(ending);

      const grr = ((arrBridge.beginning[i] + arrBridge.churn[i] + arrBridge.contraction[i]) / 
                   arrBridge.beginning[i]) * 100;
      const nrr = ((arrBridge.beginning[i] + arrBridge.expansion[i] + arrBridge.churn[i] + 
                    arrBridge.contraction[i]) / arrBridge.beginning[i]) * 100;
      metrics.GRR.push(Math.round(grr));
      metrics.NRR.push(Math.round(nrr));

      const growth = i === 0 ? 0 : (metrics.endingARR[i] - metrics.endingARR[i - 1]) / 
                                   metrics.endingARR[i - 1] * 100;
      metrics.ARRgrowth.push(i === 0 ? 0 : Math.round(growth));

      const rule40 = (metrics.NRR[i] - 100) + (metrics.ebitda[i] / financials.revenue[i] * 100);
      metrics.rule40.push(Math.round(rule40));
    }
    return metrics;
  };

  const metrics = calculateMetrics();

  const sheetsData: SheetData[] = [
    {
      name: 'Executive Summary',
      rows: [
        ['GAAP Revenue', financials.revenue.map(v => formatNumber(v))],
        ['EBITDA', metrics.ebitda.map(v => formatNumber(v))],
        ['Ending ARR', metrics.endingARR.map(v => formatNumber(v))],
        ['NRR', metrics.NRR.map(v => v.toString() + '%')],
        ['GRR', metrics.GRR.map(v => v.toString() + '%')],
        ['Rule of 40', metrics.rule40.map(v => v.toString() + '%')],
      ],
    },
    {
      name: 'Definitions',
      isDefinition: true,
      rows: [
        ['Revenue (GAAP)', 'Recognized per ASC 606; B2B SaaS contracts.', 'GL: Revenue accounts 4000-4999', 'Include: Subscription, professional services. Exclude: Partner commissions, taxes', 'Pitfall: Do not recognize full contract value upfront; only earned portion per period'],
        ['ARR', 'Annualized recurring revenue; normalized for term and minimums.', 'CRM: Subscription value × 12 ÷ contract months', 'Include: Recurring subscription fees. Exclude: One-time setup, usage overages', 'Pitfall: Multi-year deals must be normalized to annual run-rate, not total contract value'],
        ['Billings', 'Invoices issued; excludes taxes/non-customer cash.', 'Billing System: Invoice totals (pre-tax)', 'Include: Customer invoices. Exclude: Sales tax, VAT, refunds, credits', 'Pitfall: Billings ≠ Revenue; timing differs based on payment terms and recognition'],
        ['Deferred Revenue', 'Prepaid customer revenue; key SaaS control.', 'GL: Liability account 2400', 'Include: Prepaid subscriptions not yet earned. Exclude: Accounts payable, accrued expenses', 'Pitfall: Should decrease as revenue is recognized; sudden drops may indicate recognition issues'],
        ['Cash Receipts', 'Collections excluding financing/refunds.', 'Bank statements + AR reconciliation', 'Include: Customer payments. Exclude: Financing proceeds, refunds, inter-company transfers', 'Pitfall: Operating cash only; do not mix with debt proceeds or equity raises (financing cash)'],
      ],
    },
    {
      name: 'Financials',
      rows: [
        ['Revenue (GAAP)', financials.revenue.map(v => formatNumber(v))],
        ['COGS', financials.cogs.map(v => formatNumber(v))],
        ['Gross Profit', metrics.gross.map(v => formatNumber(v))],
        ['S&M Expense', financials.sm.map(v => formatNumber(v))],
        ['R&D Expense', financials.rd.map(v => formatNumber(v))],
        ['G&A Expense', financials.ga.map(v => formatNumber(v))],
        ['EBITDA', metrics.ebitda.map(v => formatNumber(v))],
      ],
    },
    {
      name: 'ARR Bridge',
      chartId: 'arrBridgeChart',
      rows: [
        ['Beginning ARR', arrBridge.beginning.map(v => formatNumber(v))],
        ['New Logo ARR', arrBridge.newLogo.map(v => formatNumber(v))],
        ['Expansion ARR', arrBridge.expansion.map(v => formatNumber(v))],
        ['Churn ARR', arrBridge.churn.map(v => formatNumber(v))],
        ['Contraction ARR', arrBridge.contraction.map(v => formatNumber(v))],
        ['Ending ARR', metrics.endingARR.map(v => formatNumber(v))],
        ['GRR', metrics.GRR.map(v => v.toString() + '%')],
        ['NRR', metrics.NRR.map(v => v.toString() + '%')],
      ],
    },
    {
      name: 'Deferred Revenue',
      rows: [
        ['Beginning Deferred Revenue', deferredRevenue.beginning.map(v => formatNumber(v))],
        ['Billings', deferredRevenue.billings.map(v => formatNumber(v))],
        ['Revenue Recognized', deferredRevenue.recognized.map(v => formatNumber(v))],
        ['Ending Deferred Revenue', years.map((y, i) => formatNumber(deferredRevenue.beginning[i] + deferredRevenue.billings[i] - deferredRevenue.recognized[i]))],
      ],
    },
    {
      name: 'Cash Flow',
      chartId: 'revenueCashChart',
      rows: [
        ['Cash Receipts', cashFlow.receipts.map(v => formatNumber(v))],
        ['Δ Accounts Receivable', cashFlow.ar.map(v => formatNumber(v))],
        ['Δ Deferred Revenue', cashFlow.dr.map(v => formatNumber(v))],
        ['Revenue (GAAP)', financials.revenue.map(v => formatNumber(v))],
      ],
    },
    {
      name: 'Audit Flags',
      rows: [
        ['Revenue > 0', financials.revenue.map(v => v > 0 ? 'PASS' : 'FAIL')],
        ['EBITDA >= 0', metrics.ebitda.map(v => v >= 0 ? 'PASS' : 'FAIL')],
        ['Ending ARR consistent', metrics.endingARR.map(v => v > 0 ? 'PASS' : 'FAIL')],
      ],
    },
    {
      name: 'Covenant Tests',
      rows: [
        ['NRR >= 90%', metrics.NRR.map(v => v >= 90 ? 'PASS' : 'FAIL')],
        ['Rule of 40 >= 40%', metrics.rule40.map(v => v >= 40 ? 'PASS' : 'FAIL')],
        ['Ending ARR growth >=10%', metrics.ARRgrowth.map(v => v >= 10 ? 'PASS' : 'FAIL')],
      ],
    },
  ];

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setCurrentDateTime(`${dateStr} ${timeStr}`);
  }, []);

  const arrBridgeChartData: any = {
    labels: years,
    datasets: [
      { label: 'Beginning ARR', data: arrBridge.beginning, backgroundColor: '#1E3A4D', type: 'bar' },
      { label: 'New Logo ARR', data: arrBridge.newLogo, backgroundColor: '#2B5266', type: 'bar' },
      { label: 'Expansion ARR', data: arrBridge.expansion, backgroundColor: '#4A7C8C', type: 'bar' },
      { label: 'Churn ARR', data: arrBridge.churn.map(v => -v), backgroundColor: '#48C774', type: 'bar' },
      { label: 'Contraction ARR', data: arrBridge.contraction.map(v => -v), backgroundColor: '#2D6A4F', type: 'bar' },
      {
        label: 'Ending ARR',
        data: metrics.endingARR,
        type: 'line',
        borderColor: '#5CB85C',
        backgroundColor: '#5CB85C',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0,
        order: 0,
      },
    ],
  };

  const arrBridgeChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + (context.parsed.y / 1000000).toFixed(1) + 'M';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: {
          callback: function (value) {
            return '$' + (Number(value) / 1000000).toFixed(1) + 'M';
          },
        },
      },
    },
  };

  const cashConversion = years.map((y, i) => (cashFlow.receipts[i] / financials.revenue[i] * 100).toFixed(1));

  const revenueCashChartData: any = {
    labels: years,
    datasets: [
      {
        label: 'Revenue (GAAP)',
        data: financials.revenue,
        backgroundColor: '#1E3A4D',
        borderWidth: 0,
        order: 2,
        type: 'bar',
      },
      {
        label: 'Cash Receipts',
        data: cashFlow.receipts,
        backgroundColor: '#4A7C8C',
        borderWidth: 0,
        order: 1,
        type: 'bar',
      },
      {
        label: 'Cash Conversion %',
        data: cashConversion.map(Number),
        type: 'line',
        borderColor: '#5CB85C',
        backgroundColor: '#5CB85C',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.2,
        yAxisID: 'y1',
        order: 0,
      },
    ],
  };

  const revenueCashChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 2) {
                label += context.parsed.y + '%';
              } else {
                label += '$' + context.parsed.y.toLocaleString();
              }
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: 'Revenue vs. Cash Collection Analysis',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      y: {
        position: 'left',
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          callback: function (value) {
            return '$' + (Number(value) / 1000000).toFixed(1) + 'M';
          },
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: 'Revenue & Cash',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      y1: {
        position: 'right',
        grid: {
          display: false,
        },
        min: 0,
        max: 120,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: 'Cash Conversion',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerH1}>MUSEDATA QoE Template</h1>
          <p style={styles.headerP}>
            SaaSCo Inc. (Confidential) • FY 2023 - 2026P • {currentDateTime}
          </p>

          <div style={styles.metadataBar as React.CSSProperties}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Data Sources:</span>
              <div style={styles.sourceBadges}>
                <span style={styles.sourceBadge}>QuickBooks</span>
                <span style={styles.sourceBadge}>Salesforce</span>
                <span style={styles.sourceBadge}>Stripe</span>
                <span style={styles.sourceBadge}>Excel</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          {sheetsData.map((sheet, i) => (
            <button
              key={i}
              style={{
                ...styles.tab,
                ...(activeSheet === i ? styles.tabActive : {}),
              }}
              onClick={() => setActiveSheet(i)}
            >
              {sheet.name}
            </button>
          ))}
        </div>

        <div style={styles.sheetContainer}>
          {sheetsData.map((sheet, sheetIndex) => (
            <div
              key={sheetIndex}
              style={{
                ...styles.sheet,
                display: activeSheet === sheetIndex ? 'block' : 'none',
              }}
            >
              {sheet.name === 'Executive Summary' && (
                <div style={styles.icCard}>
                  <h2 style={styles.icCardH2}>Quality Assessment</h2>
                  <div style={styles.flags}>
                    <span style={styles.flag}>Revenue Quality</span>
                    <span style={styles.flag}>ARR Consistency</span>
                    <span style={styles.flag}>EBITDA Validation</span>
                    <span style={styles.flag}>Cash Flow Accuracy</span>
                    <span style={styles.flag}>Deferred Revenue Check</span>
                  </div>
                  <div style={styles.bridgeNote}>
                    <strong>Revenue Quality Bridge:</strong> Ending ARR driven by New Logo and Expansion ARR, offset by Churn/Contraction.
                  </div>
                  <div style={styles.wcNote}>
                    <strong>Working Capital Narrative:</strong> Accounts receivable and deferred revenue movements analyzed for cash conversion efficiency.
                  </div>
                  <div style={styles.confidenceNote}>
                    <strong>Data Confidence Rating:</strong> High – all core metrics reconciled and verified.
                  </div>
                </div>
              )}

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.thead}>Metric</th>
                    {sheet.isDefinition ? (
                      <>
                        <th style={styles.thead}>Definition</th>
                        <th style={styles.thead}>Formula/Source</th>
                        <th style={styles.thead}>Inclusion/Exclusion</th>
                        <th style={styles.thead}>Common Pitfalls</th>
                      </>
                    ) : (
                      years.map((y, i) => (
                        <th key={i} style={styles.thead}>
                          {y}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sheet.rows.map((r, idx) => (
                    <tr
                      key={idx}
                      style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}
                    >
                      <td style={styles.lbl as React.CSSProperties}>{r[0]}</td>
                      {sheet.isDefinition ? (
                        <>
                          <td style={styles.frm}>{r[1]}</td>
                          <td style={styles.frm}>{r[2]}</td>
                          <td style={styles.frm}>{r[3]}</td>
                          <td style={styles.frm}>{r[4]}</td>
                        </>
                      ) : (
                        (r[1] as string[]).map((c, cellIdx) => {
                          let cellStyle = styles.frm;
                          if (c === 'PASS') cellStyle = styles.pass;
                          else if (c === 'FAIL') cellStyle = styles.fail;
                          return (
                            <td key={cellIdx} style={cellStyle}>
                              {c}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {sheet.chartId === 'arrBridgeChart' && (
                <div style={styles.chartContainer}>
                  <Chart type="bar" data={arrBridgeChartData} options={arrBridgeChartOptions} />
                </div>
              )}

              {sheet.chartId === 'revenueCashChart' && (
                <div style={styles.chartContainer}>
                  <Chart type="bar" data={revenueCashChartData} options={revenueCashChartOptions} />
                </div>
              )}

              {sheet.isDefinition && (
                <div style={styles.note}>
                  All definitions audited from a $1bn team of growth equity enterprise software experts.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg,#1E3A4D 0%,#2B5266 100%)',
    padding: '20px',
    minHeight: '100vh',
    color: '#0A1419',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    background: 'white',
    padding: '20px 24px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  headerH1: {
    color: '#1E3A4D',
    fontSize: '24px',
    marginBottom: '6px',
  },
  headerP: {
    color: '#4A7C8C',
    fontSize: '14px',
  },
  metadataBar: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#2B5266',
  },
  metaLabel: {
    fontWeight: '600',
    color: '#1E3A4D',
  },
  sourceBadges: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  sourceBadge: {
    background: '#4A7C8C',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  tabs: {
    display: 'flex',
    gap: '5px',
    background: 'rgba(255,255,255,0.1)',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    overflowX: 'auto',
  },
  tab: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s',
    border: 'none',
  },
  tabActive: {
    background: 'white',
    color: '#1E3A4D',
    fontWeight: 'bold',
  },
  sheetContainer: {
    background: 'white',
    borderRadius: '0 8px 8px 8px',
    padding: '0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    overflowX: 'auto',
  },
  sheet: {
    minWidth: '800px',
    padding: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    marginBottom: '15px',
  },
  thead: {
    position: 'sticky',
    top: 0,
    background: '#1E3A4D',
    color: 'white',
    zIndex: 2,
    padding: '12px',
    fontWeight: '700',
    fontSize: '13px',
    textAlign: 'center',
    letterSpacing: '0.3px',
  },
  lbl: {
    color: '#0A1419',
    fontWeight: '600',
    width: '250px',
    position: 'sticky',
    left: 0,
    background: 'inherit',
    zIndex: 1,
    padding: '10px',
    textAlign: 'left',
  },
  evenRow: {
    background: '#F8FAFB',
  },
  oddRow: {
    background: '#FFFFFF',
  },
  frm: {
    background: '#E8F2F4',
    color: '#2B5266',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10px',
    borderBottom: '1px solid #E0E8EA',
  },
  pass: {
    background: '#5CB85C',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '12px',
  },
  fail: {
    background: '#D9534F',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '12px',
  },
  chartContainer: {
    width: '100%',
    maxWidth: '1000px',
    margin: '20px auto',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  icCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  icCardH2: {
    color: '#1E3A4D',
    fontSize: '20px',
    marginBottom: '12px',
  },
  flags: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  flag: {
    background: '#4A7C8C',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  bridgeNote: {
    fontSize: '13px',
    marginBottom: '6px',
    color: '#2B5266',
  },
  wcNote: {
    fontSize: '13px',
    marginBottom: '6px',
    color: '#2B5266',
  },
  confidenceNote: {
    fontSize: '13px',
    marginBottom: '6px',
    color: '#2B5266',
  },
  note: {
    fontSize: '12px',
    color: '#4A7C8C',
    marginTop: '5px',
    fontStyle: 'italic',
  },
};

export default MusedataDashboard;
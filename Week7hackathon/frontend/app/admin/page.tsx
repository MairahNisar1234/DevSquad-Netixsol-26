"use client";
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  DollarSign, Bookmark, Users, ShoppingCart, 
  SlidersHorizontal, ChevronDown, TrendingUp, TrendingDown 
} from 'lucide-react';

// ─── Donut Chart Component ──────────────────────────────────────────────────
function DonutChart({ orders }: { orders: any[] }) {
  const chartData = useMemo(() => {
    const dineIn = orders.filter(o => o.orderType === 'Dine In').length || 0;
    const toGo = orders.filter(o => o.orderType === 'To Go').length || 0;
    const delivery = orders.filter(o => o.orderType === 'Delivery').length || 0;

    return [
      { label: 'Dine In',  value: dineIn, color: '#FF6B9D' },
      { label: 'To Go',    value: toGo, color: '#F0A500' },
      { label: 'Delivery', value: delivery, color: '#4DA6FF' },
    ];
  }, [orders]);

  const total = chartData.reduce((a, b) => a + b.value, 0) || 1;
  const size = 160;
  const strokeWidth = 22;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = chartData.map((d) => {
    const dash = (d.value / total) * circumference;
    const gap = circumference - dash;
    const seg = { ...d, dash, gap, offset };
    offset += dash + 3; // 3px gap between segments
    return seg;
  });

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2A2840" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => (
          seg.value > 0 && (
            <circle
              key={i}
              cx={size/2} cy={size/2} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${Math.max(0, seg.dash - 3)} ${circumference - Math.max(0, seg.dash - 3)}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
            />
          )
        ))}
      </svg>
      <div className="donut-legend">
        {chartData.map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <div>
              <p className="legend-label">{d.label}</p>
              <p className="legend-count">{d.value} customers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card Component ────────────────────────────────────────────────────
function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  const isPositive = trend.startsWith('+');
  const isNeutral = !trend.startsWith('+') && !trend.startsWith('-');
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className={`stat-trend ${isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'}`}>
          {!isNeutral && (isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />)}
          {trend}
        </span>
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-title">{title}</p>
    </div>
  );
}

// ─── Main Admin Dashboard ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/orders');
        const rawData = Array.isArray(res.data) ? res.data : (res.data.orders || []);
        setOrders(rawData);
      } catch (err) {
        console.error("❌ API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = useMemo(() =>
    orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)
  , [orders]);

  const totalCustomers = useMemo(() => {
    const ids = orders.map(o => o.userId?.$oid || o._id?.$oid || o._id).filter(Boolean);
    return new Set(ids).size;
  }, [orders]);

  const mostOrdered = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    orders.forEach(o => {
      (o.items || []).forEach((item: any) => {
        const key = item.name || 'Unknown';
        if (!map[key]) map[key] = { name: key, count: 0 };
        map[key].count += (item.quantity || 1);
      });
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [orders]);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #252836;
          padding: clamp(12px, 3vw, 32px);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          overflow-x: hidden;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1100px) {
          .dash-grid { grid-template-columns: 1fr 340px; }
          .dash-header, .stat-row, .order-panel { grid-column: 1; }
          .dash-sidebar { grid-column: 2; grid-row: 1 / 4; }
        }

        .dash-header h1 { font-size: clamp(20px, 4vw, 32px); font-weight: 800; letter-spacing: -0.5px; }
        .dash-header p { color: #8b8fa8; font-size: 13px; margin-top: 4px; }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: #1F1D2B;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .stat-icon {
          width: 40px; height: 40px;
          background: #252836;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-trend {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 700;
          padding: 4px 8px; border-radius: 20px;
        }
        .stat-trend.positive { color: #4ade80; background: rgba(74,222,128,0.1); }
        .stat-trend.negative { color: #f87171; background: rgba(248,113,113,0.1); }
        .stat-trend.neutral { color: #8b8fa8; background: rgba(139,143,168,0.1); }
        .stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .stat-title { color: #8b8fa8; font-size: 13px; margin-top: 4px; }

        .order-panel {
          background: #1F1D2B;
          border-radius: 20px;
          padding: clamp(16px, 3vw, 24px);
          border: 1px solid rgba(255,255,255,0.05);
          width: 100%;
        }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; }
        .panel-header h2 { font-size: 18px; font-weight: 800; }
        .filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: #ccc; padding: 8px 16px; border-radius: 10px; font-size: 13px; cursor: pointer;
        }

        .table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead th { padding: 12px; text-align: left; font-size: 11px; color: #8b8fa8; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.07); }
        tbody td { padding: 16px 12px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); }

        .customer-cell { display: flex; align-items: center; gap: 10px; }
        .avatar { width: 34px; height: 34px; border-radius: 50%; background: #EA7C69; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }

        .dash-sidebar { display: flex; flex-direction: column; gap: 24px; }
        @media (max-width: 1099px) {
          .dash-sidebar { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        }

        .side-panel { background: #1F1D2B; border-radius: 20px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .side-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .side-panel-header h3 { font-size: 16px; font-weight: 800; }

        .ordered-list { display: flex; flex-direction: column; gap: 14px; }
        .ordered-item { display: flex; align-items: center; gap: 12px; }
        .food-img { width: 48px; height: 48px; border-radius: 12px; background: #252836; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }

        .donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        @media (min-width: 380px) { .donut-wrap { flex-direction: row; justify-content: center; } }
        .donut-legend { display: flex; flex-direction: column; gap: 10px; }
        .legend-item { display: flex; align-items: center; gap: 10px; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        .badge { padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .badge-completed { background: rgba(74,222,128,0.1); color: #4ade80; }
        .badge-pending { background: rgba(251,146,60,0.1); color: #fb923c; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #3a3850; border-radius: 10px; }
      `}</style>

      <div className="dash-root">
        <div className="dash-grid">
          
          <header className="dash-header">
            <h1>Admin Dashboard</h1>
            <p>{new Date().toDateString()}</p>
          </header>

          <aside className="dash-sidebar">
            <div className="side-panel">
              <div className="side-panel-header">
                <h3>Most Ordered</h3>
                <button className="filter-btn">Today <ChevronDown size={14} /></button>
              </div>
              <div className="ordered-list">
                {mostOrdered.map((item, i) => (
                  <div key={i} className="ordered-item">
                    <div className="food-img">{['🍜','🍝','🥟'][i] || '🍽️'}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</p>
                      <p style={{ color: '#8b8fa8', fontSize: 11 }}>{item.count} portions sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-panel">
              <div className="side-panel-header">
                <h3>Order Statistics</h3>
              </div>
              <DonutChart orders={orders} />
            </div>
          </aside>

          <div className="stat-row">
            <StatCard 
              title="Total Revenue" 
              value={`$${totalRevenue.toFixed(2)}`} 
              icon={<DollarSign size={20} color="#EA7C69" />} 
              trend="+32.40%" 
            />
            <StatCard 
              title="Total Orders" 
              value={orders.length} 
              icon={<Bookmark size={20} color="#f59e0b" />} 
              trend={orders.length > 0 ? "Live" : "0.0%"} 
            />
            <StatCard 
              title="Total Customers" 
              value={totalCustomers} 
              icon={<Users size={20} color="#60a5fa" />} 
              trend="+2.40%" 
            />
          </div>

          <div className="order-panel">
            <div className="panel-header">
              <h2>Order Report</h2>
              <button className="filter-btn"><SlidersHorizontal size={14} /> Filter</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Menu</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    const id = (order._id?.$oid || order._id).toString();
                    return (
                      <tr key={id}>
                        <td>
                          <div className="customer-cell">
                            <div className="avatar">{(order.customerName || 'U')[0]}</div>
                            <div>
                              <p style={{ fontWeight: 600 }}>{order.customerName || "Walk-in"}</p>
                              <p style={{ color: '#8b8fa8', fontSize: 11 }}>#{id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ color: '#c4c9d8' }}>{order.items?.map((i: any) => i.name).join(', ')}</span></td>
                        <td><span style={{ color: '#EA7C69', fontWeight: 700 }}>${Number(order.totalAmount).toFixed(2)}</span></td>
                        <td>
                          <span className={`badge ${order.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
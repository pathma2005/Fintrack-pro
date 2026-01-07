import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Row, Col, Button } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";

const COLORS = ["#4f46e5", "#22c55e", "#f97316", "#ef4444"];

function Dashboard2() {
  const [transactions, setTransactions] = useState([]);

  // 🔹 Load transactions from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  }, []);

  // 🔹 Prepare graph data (income vs expense by date)
  const graphData = transactions.map((t) => ({
    date: t.date,
    amount: t.amount,
    type: t.type,
  }));

  // 🔹 Prepare pie chart data (group by tag)
  const pieData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.tag] = acc[t.tag] || { name: t.tag, value: 0 };
        acc[t.tag].value += t.amount;
      }
      return acc;
    }, {})
  );

  // 🔹 Export CSV
  const exportCSV = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  // 🔹 Import CSV
  const importCSV = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (result) => {
        localStorage.setItem("transactions", JSON.stringify(result.data));
        setTransactions(result.data);
      },
    });
  };

  return (
    <>
      <Header />

      <div style={{ padding: "2rem" }}>
        <Row gutter={24}>
          {/* 📈 LINE GRAPH */}
          <Col span={16}>
            <div className="chart-card">
              <h3>Financial Statistics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#4f46e5"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>

          {/* 🥧 PIE CHART */}
          <Col span={8}>
            <div className="chart-card">
              <h3>Total Spending</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {/* ⬇ CSV BUTTONS */}
        <Row style={{ marginTop: "2rem", gap: "1rem" }}>
          <Button type="primary" onClick={exportCSV}>
            Export to CSV
          </Button>

          <label>
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={importCSV}
            />
            <Button>Import from CSV</Button>
          </label>
        </Row>
      </div>
    </>
  );
}

export default Dashboard2;






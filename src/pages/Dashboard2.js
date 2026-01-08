import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import Header from "../Components/Header";
import AddExpenseModal from "../Components/AddExpenseModal";
import AddIncomeModal from "../Components/AddIncomeModal";
import TransactionSearch from "../Components/TransactionSearch";

function Dashboard2() {
  const [transactions, setTransactions] = useState([]);
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);

  /* 🔹 Load data */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  }, []);

  /* 🔹 Save data */
  const saveTransactions = (data) => {
    localStorage.setItem("transactions", JSON.stringify(data));
    setTransactions(data);
  };

  /* 🔹 Add Income */
  const addIncome = (values) => {
    const newData = [
      ...transactions,
      {
        ...values,
        type: "income",
        date: values.date.format("YYYY-MM-DD"),
      },
    ];
    saveTransactions(newData);
    setOpenIncome(false);
  };

  /* 🔹 Add Expense */
  const addExpense = (values) => {
    const newData = [
      ...transactions,
      {
        ...values,
        type: "expense",
        date: values.date.format("YYYY-MM-DD"),
      },
    ];
    saveTransactions(newData);
    setOpenExpense(false);
  };

  /* 🔹 Reset */
  const resetBalance = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
  };

  /* 🔹 Totals */
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expenses;

  /* ================= LINE GRAPH ================= */
  let runningBalance = 0;
  const lineData = transactions.map((t) => {
    runningBalance += t.type === "income"
      ? Number(t.amount)
      : -Number(t.amount);
    return {
      month: moment(t.date).format("MMM YYYY"),
      balance: runningBalance,
    };
  });

  const lineConfig = {
    data: lineData,
    xField: "month",
    yField: "balance",
    smooth: true,
    height: 280,
    point: { size: 4 },
  };

  /* ================= PIE CHART ================= */
  const pieData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const found = acc.find((i) => i.category === curr.tag);
      if (found) found.value += Number(curr.amount);
      else acc.push({ category: curr.tag, value: Number(curr.amount) });
      return acc;
    }, []);

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "category",
    radius: 0.7, // smaller size
    height: 280, // match line chart
  };

  /* ================= CSV Export ================= */
  const exportToCsv = () => {
    const csvContent = [
      ["Name", "Type", "Date", "Amount", "Tag"],
      ...transactions.map((t) => [t.name, t.type, t.date, t.amount, t.tag]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  /* ================= Add Transaction from CSV ================= */
  const addTransaction = (transaction, skipSave = false) => {
    const newData = [...transactions, transaction];
    if (!skipSave) {
      saveTransactions(newData);
    } else {
      setTransactions(newData);
    }
  };

  /* ================= Fetch Transactions (refresh) ================= */
  const fetchTransactions = () => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        {/* ================= 3 CARDS ================= */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <h3>Balance</h3>
              <h1>₹ {balance}</h1>
              <Button
                onClick={resetBalance}
                style={{ backgroundColor: "rgba(69, 59, 180, 0.911)", color: "#fff",width:"400px" }}
              >
                Reset Balance
              </Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <h3>Total Income</h3>
              <h1>₹ {income}</h1>
              <Button
                type="primary"
                onClick={() => setOpenIncome(true)}
                style={{ backgroundColor: "rgba(69, 59, 180, 0.911)", color: "#fff",width:"400px" }}
              >
                Add Income
              </Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <h3>Total Expenses</h3>
              <h1>₹ {expenses}</h1>
              <Button
                type="primary"
                danger
                onClick={() => setOpenExpense(true)}
                style={{ backgroundColor: "rgba(69, 59, 180, 0.911)", color: "#fff", border: "none",width:"400px"}}
              >
                Add Expense
              </Button>
            </Card>
          </Col>
        </Row>

      
        {transactions.length > 0 && (
          <Row gutter={16} style={{ marginTop: "2rem" }}>
            <Col span={16}>
              <Card>
                <h2>Balance Over Time</h2>
                <Line {...lineConfig} />
              </Card>
            </Col>

            <Col span={8}>
              <Card>
                <h2>Expense Distribution</h2>
                <Pie {...pieConfig} />
              </Card>
            </Col>
          </Row>
        )}

    
        <AddIncomeModal
          open={openIncome}
          onCancel={() => setOpenIncome(false)}
          onFinish={addIncome}
          onDelete={resetBalance}
        />

        <AddExpenseModal
          open={openExpense}
          onCancel={() => setOpenExpense(false)}
          onFinish={addExpense}
          onDelete={resetBalance}
        />

        <TransactionSearch
          transactions={transactions}
          exportToCsv={exportToCsv}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
        />
      </div>
    </>
  );
}

export default Dashboard2;

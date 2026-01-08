import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import Header from "../Components/Header";
import AddExpenseModal from "../Components/AddExpenseModal";
import AddIncomeModal from "../Components/AddIncomeModal";
import TransactionSearch from "../Components/TransactionSearch";
import "./Dashboard2.css";

function Dashboard2() {
  const [transactions, setTransactions] = useState([]);
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  }, []);


  const saveTransactions = (data) => {
    localStorage.setItem("transactions", JSON.stringify(data));
    setTransactions(data);
  };


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

  const resetBalance = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
  };


  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expenses;


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
    radius: 0.7,
    height: 280,
  };

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

  const addTransaction = (transaction, skipSave = false) => {
    const newData = [...transactions, transaction];
    if (!skipSave) {
      saveTransactions(newData);
    } else {
      setTransactions(newData);
    }
  };


  const fetchTransactions = () => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="balance-section">
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Card className="balance-card">
                <h3>Balance</h3>
                <h1>₹ {balance}</h1>
                <Button
                  onClick={resetBalance}
                  className="reset-btn"
                >
                  Reset Balance
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card className="income-card">
                <h3>Total Income</h3>
                <h1>₹ {income}</h1>
                <Button
                  type="primary"
                  onClick={() => setOpenIncome(true)}
                  className="add-income-btn"
                >
                  Add Income
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card className="expense-card">
                <h3>Total Expenses</h3>
                <h1>₹ {expenses}</h1>
                <Button
                  type="primary"
                 
                  onClick={() => setOpenExpense(true)}
                  className="add-expense-btn"
                >
                  Add Expense
                </Button>
              </Card>
            </Col>
          </Row>
        </div>

        {transactions.length > 0 && (
          <div className="charts-section">
            <Row gutter={16}>
              <Col xs={24} lg={16}>
                <Card className="chart-card">
                  <h2>Balance Over Time</h2>
                  <Line {...lineConfig} />
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card className="chart-card">
                  <h2>Expense Distribution</h2>
                  <Pie {...pieConfig} />
                </Card>
              </Col>
            </Row>
          </div>
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

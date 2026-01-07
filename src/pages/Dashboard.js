import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Cards from "../Components/Cards";
import AddExpenseModal from "../Components/AddExpenseModal";
import AddIncomeModal from "../Components/AddIncomeModal";
import AddSavingsModal from "../Components/AddSavingsModal";
import TransactionModal from "../Components/TransactionModal";
import { Card, Row } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import NoTransactions from "../Components/NoTransactions";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(0);

  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showSavings, setShowSavings] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);

  const balance = income - expenses;

  // 🔹 Load from localStorage
  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem("transactions")) || []);
    setIncome(JSON.parse(localStorage.getItem("income")) || 0);
    setExpenses(JSON.parse(localStorage.getItem("expenses")) || 0);
    setSavings(JSON.parse(localStorage.getItem("savings")) || 0);
  }, []);

  // 🔹 Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("savings", JSON.stringify(savings));
  }, [transactions, income, expenses, savings]);

  // 🔹 Add Income / Expense
  const onAddTransaction = (values, type) => {
    const transaction = {
      name: values.name,
      amount: Number(values.amount),
      date: values.date.format("YYYY-MM-DD"),
      tag: values.tag,
      type,
    };

    setTransactions((prev) => [...prev, transaction]);

    if (type === "income") setIncome((p) => p + transaction.amount);
    if (type === "expense") setExpenses((p) => p + transaction.amount);

    setShowIncome(false);
    setShowExpenses(false);
  };

  // 🔹 Edit Transaction
  const onEditTransaction = (index, updatedTransaction) => {
    setTransactions((prev) => {
      const list = [...prev];
      list[index] = updatedTransaction;

      let totalIncome = 0;
      let totalExpense = 0;

      list.forEach((t) => {
        if (t.type === "income") totalIncome += t.amount;
        if (t.type === "expense") totalExpense += t.amount;
      });

      setIncome(totalIncome);
      setExpenses(totalExpense);

      return list;
    });
  };

  // 🔹 Reset All
  const resetAll = () => {
    setIncome(0);
    setExpenses(0);
    setSavings(0);
    setTransactions([]);
    localStorage.clear();
  };

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  return (
    <>
      <Header showArrow={true} showLogout={false} />

      <Cards
        balance={balance}
        income={income}
        expenses={expenses}
        savings={savings}
        transactionsCount={transactions.length}
        openIncome={() => setShowIncome(true)}
        openExpense={() => setShowExpenses(true)}
        openSavings={() => setShowSavings(true)}
        openTransactions={() => setShowTransaction(true)}
        reset={resetAll}
      />

      {/* Income Modal */}
      <AddIncomeModal
        open={showIncome}
        onCancel={() => setShowIncome(false)}
        onFinish={(v) => onAddTransaction(v, "income")}
        onDelete={() => {
          setTransactions((prev) =>
            prev.filter((t) => t.type !== "income")
          );
          setIncome(0);
          setShowIncome(false);
        }}
      />

      {/* Expense Modal */}
      <AddExpenseModal
        open={showExpenses}
        onCancel={() => setShowExpenses(false)}
        onFinish={(v) => onAddTransaction(v, "expense")}
        onDelete={() => {
          setTransactions((prev) =>
            prev.filter((t) => t.type !== "expense")
          );
          setExpenses(0);
          setShowExpenses(false);
        }}
      />

      {/* Savings Modal */}
      <AddSavingsModal
        open={showSavings}
        onCancel={() => setShowSavings(false)}
        onSave={({ amount, tag }) => {
          setSavings(amount);
          setTransactions((prev) => [
            ...prev,
            {
              name: "Monthly Savings",
              amount: Number(amount),
              date: new Date().toISOString().slice(0, 10),
              tag,
              type: "savings",
            },
          ]);
          setShowSavings(false);
        }}
        onDelete={() => {
          setSavings(0);
          setTransactions((prev) =>
            prev.filter((t) => t.type !== "savings")
          );
          setShowSavings(false);
        }}
      />

      {/* Transactions Modal */}
      <TransactionModal
        open={showTransaction}
        onCancel={() => setShowTransaction(false)}
        transactions={transactions}
        onEdit={onEditTransaction}
      />
      {transactions.length === 0 ? (
        <NoTransactions />
      ) : (
        <>
          <Row gutter={16}>
            <Card bordered={true} style={cardStyle}>
              <h2>Financial Statistics</h2>
              <Line {...{ ...balanceConfig, data: balanceData }} />
            </Card>

            <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
              <h2>Total Spending</h2>
              {spendingDataArray.length == 0 ? (
                <p>Seems like you haven't spent anything till now...</p>
              ) : (
                <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
              )}
            </Card>
          </Row>
        </>
      )}
    </>
  );
}

export default Dashboard;

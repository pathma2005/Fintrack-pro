import React from "react";
import "./style.css";
import { Card, Row, Button } from "antd";

function Cards({
  balance,
  income,
  expenses,
  savings,
  transactionsCount,
  openIncome,
  openExpense,
  openSavings,
  openTransactions,
  reset,
}){
  return (
    <div>
      <Row style={{ gap: "32px", justifyContent: "center" }}>
        <Card className="my-card" title="Current Balance">
          <p>₹{balance}</p>
          <Button className="btn" type="primary" onClick={reset}>
            Reset Balance
          </Button>
        </Card>

        <Card className="my-card" title="Total Income">
          <p>₹{income}</p>
          <Button className="btn" type="primary" onClick={openIncome}>
            Add Income
          </Button>
        </Card>

        <Card className="my-card" title="Add Expenses">
          <p>₹{expenses}</p>
          <Button className="btn" type="primary" onClick={openExpense}>
            Total Expenses
          </Button>
        </Card>

        <Card className="my-card" title="Monthly Savings">
          <p>₹{savings}</p>
          <Button className="btn" type="primary" onClick={openSavings}>
            Update Savings
          </Button>
        </Card>

        <Card className="my-card" title="Recent Transactions">
          <p>₹{transactionsCount}</p>
          <Button className="btn" type="primary" onClick={openTransactions}>
            View Transactions
          </Button>
        </Card>

        <Card className="my-card" title="Budget Overview">
          <p>{balance >= 0 ? "Good" : "Alert"}</p>
          <Button className="btn" type="primary">
            Manage Overview
          </Button>
        </Card>
      </Row>
    </div>
  );

}
export default Cards;


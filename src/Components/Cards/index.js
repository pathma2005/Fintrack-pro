import React from "react";
import "./style.css";
import { Card, Row, Button } from "antd";

function Cards() {
  return (
    <div>
      <Row style={{ gap: "32px", justifyContent: "center" }}>
        <Card className="my-card" title="Current Balance">
          <p>₹0</p>
          <Button className="btn" type="primary">
            Reset Balance
          </Button>
        </Card>

        <Card className="my-card" title="Total Income">
          <p>₹0</p>
          <Button className="btn" type="primary">
            Add Income
          </Button>
        </Card>

        <Card className="my-card" title="Total Expenses">
          <p>₹0</p>
          <Button className="btn" type="primary">
            Total Expenses
          </Button>
        </Card>

        <Card className="my-card" title="Monthly Savings">
          <p>₹0</p>
          <Button className="btn" type="primary">
            Update Savings
          </Button>
        </Card>

        <Card className="my-card" title="Recent Transactions">
          <p>₹0</p>
          <Button className="btn" type="primary">
            View Transactions
          </Button>
        </Card>

        <Card className="my-card" title="Budget Overview">
          <p>₹0</p>
          <Button className="btn" type="primary">
            Manage Overview
          </Button>
        </Card>
      </Row>
    </div>
  );
}

export default Cards;



import React, { useMemo, useRef, useState } from "react";
import { Table, Select, Radio } from "antd";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import searchIcon from "../../assets/search.svg";

const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const fileInput = useRef(null);

  // ================= IMPORT CSV =================
  const importFromCsv = (event) => {
    try {
      parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          for (const t of results.data) {
            await addTransaction(
              {
                ...t,
                amount: Number(t.amount),
              },
              true
            );
          }
          toast.success("CSV imported successfully");
          fetchTransactions();
        },
      });
      event.target.value = null;
    } catch (err) {
      toast.error("CSV import failed");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
  ];

  // ================= FILTER =================
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const nameMatch = searchTerm
        ? t.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const typeMatch = typeFilter ? t.type === typeFilter : true;

      return nameMatch && typeMatch;
    });
  }, [transactions, searchTerm, typeFilter]);

  // ================= SORT (FIXED 🔥) =================
  const sortedTransactions = useMemo(() => {
    // NO SORT → return original filtered order
    if (!sortKey) return filteredTransactions;

    const copy = [...filteredTransactions];

    if (sortKey === "date") {
      return copy.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    }

    if (sortKey === "amount") {
      return copy.sort((a, b) => a.amount - b.amount);
    }

    return copy;
  }, [filteredTransactions, sortKey]);

  const dataSource = sortedTransactions.map((t, index) => ({
    key: index,
    ...t,
  }));

  // ================= UI =================
  return (
    <div style={{ width: "100%", padding: "0 2rem" }}>
      {/* HEADER BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>My Transactions</h2>

        <Radio.Group
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={exportToCsv}
            style={{
              background: "#fff",
              border: "1px solid #4f46e5",
              color: "#4f46e5",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Export to CSV
          </button>

          <label
            htmlFor="file-csv"
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Import from CSV
          </label>

          <input
            ref={fileInput}
            type="file"
            accept=".csv"
            id="file-csv"
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            minWidth: "220px",
          }}
        >
          <img src={searchIcon} width="16" alt="search" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              marginLeft: "0.5rem",
              flex: 1,
            }}
          />
        </div>

        <Select
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
          style={{ width: 140 }}
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TransactionSearch;



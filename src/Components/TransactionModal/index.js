import React, { useState } from "react";
import { Modal, Table, Button, Form, Input, InputNumber, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

function TransactionModal({ open, onCancel, transactions, onEdit }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (record, index) => {
    setEditingIndex(index);
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      date: dayjs(record.date),
      tag: record.tag,
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const updated = {
        ...transactions[editingIndex],
        name: values.name,
        amount: Number(values.amount),
        date: values.date.format("YYYY-MM-DD"),
        tag: values.tag,
      };
      onEdit(editingIndex, updated);
      setEditingIndex(null);
      form.resetFields();
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record, index) => (
        <Button onClick={() => handleEdit(record, index)}>Edit</Button>
      ),
    },
  ];

  return (
    <Modal
      title="Transactions"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey={(record, index) => index}
      />
      {editingIndex !== null && (
        <div style={{ marginTop: 20 }}>
          <h3>Edit Transaction</h3>
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="tag"
              label="Tag"
              rules={[{ required: true, message: "Please select tag" }]}
            >
              <Select>
                <Option value="Food">Food</Option>
                <Option value="Entertainment">Entertainment</Option>
                <Option value="Education">Education</Option>
                <Option value="Loan">Loan</Option>
                <Option value="EMI">EMI</Option>
                <Option value="Salary">Salary</Option>
                <Option value="Freelance">Freelance</Option>
                <Option value="Investment">Investment</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </Form>
        </div>
      )}
    </Modal>
  );
}

export default TransactionModal;

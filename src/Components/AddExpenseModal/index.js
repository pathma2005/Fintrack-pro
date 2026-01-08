import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button } from "antd";

const { Option } = Select;

function AddExpenseModal({ open, onCancel, onFinish, onDelete }) {
  const [form] = Form.useForm();
  const [selectedTag, setSelectedTag] = useState("");
  const [otherTag, setOtherTag] = useState("");

  const handleFinish = (values) => {
    const finalTag = values.tag === "Other" ? otherTag : values.tag;

    onFinish({
      ...values,
      tag: finalTag,
    });

    form.resetFields();
    setSelectedTag("");
    setOtherTag("");
  };

  return (
    <Modal
      title="Add Expenses"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button danger key="delete" onClick={onDelete}>
          Delete Expenses
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button type="primary" key="save" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
    <Form.Item
          name="name"
          label="Expense Name"
          rules={[{ required: true, message: "Please enter expense name" }]}
        >
          <Input placeholder="e.g., Grocery" />
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
          rules={[{ required: true, message: "Please select a tag" }]}
        >
          <Select
            placeholder="Select a tag"
            onChange={(value) => setSelectedTag(value)}
          >
            <Option value="Food">Food</Option>
            <Option value="Entertainment">Entertainment</Option>
            <Option value="Education">Education</Option>
            <Option value="Loan">Loan</Option>
            <Option value="EMI">EMI</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

       
        {selectedTag === "Other" && (
          <Form.Item
            name="otherTag"
            label="Other Type"
            rules={[{ required: true, message: "Please enter type" }]}
          >
            <Input
              placeholder="Enter custom expense type"
              value={otherTag}
              onChange={(e) => setOtherTag(e.target.value)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;






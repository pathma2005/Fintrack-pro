import React from "react";
import { Modal, Form, InputNumber, Select, Button } from "antd";

const { Option } = Select;

function AddSavingsModal({ open, onCancel, onSave, onDelete }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSave(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Monthly Savings"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button danger key="delete" onClick={onDelete}>
          Delete Savings
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
          name="amount"
          label="Savings Amount"
          rules={[{ required: true, message: "Enter savings amount" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="tag"
          label="Savings Type"
          rules={[{ required: true, message: "Select savings type" }]}
        >
          <Select placeholder="Select type">
            <Option value="Fixed">Fixed</Option>
            <Option value="Emergency">Emergency</Option>
            <Option value="Investment">Investment</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddSavingsModal;



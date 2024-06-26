import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface ResourceModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  isEditing: boolean;
  handleAddResource: () => void;
  form: any;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ isModalVisible, setIsModalVisible, isEditing, handleAddResource, form }) => (
  <Modal
    title={isEditing ? "Edit Resource" : "Add a new resource"}
    visible={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={[
      <Button key="back" onClick={() => setIsModalVisible(false)}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleAddResource}>
        {isEditing ? "Update Resource" : "Add Resource"}
      </Button>,
    ]}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please input the title of the resource!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="link"
        label="Link"
        rules={[{ required: true, message: "Please input the link of the resource!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="coverImage"
        label="Cover Image URL"
        rules={[{ required: true, message: "Please input the cover image URL!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description of the resource!" }]}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  </Modal>
);

export default ResourceModal;

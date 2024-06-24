import React, { ChangeEvent, useState } from "react";
import { Card, Button, Modal, Form, Input, Tooltip, Pagination } from "antd";
import "tailwindcss/tailwind.css";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import ImageWithFallback from "../components/ImageWithFallback";

interface Resource {
  title: string;
  link: string;
  coverImage: string;
  description: string;
  postedBy: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      title: "Understanding React Hooks",
      link: "https://reactjs.org/docs/hooks-intro.html",
      coverImage: "https://youtu.be/dpw9EHDh2bM",
      description: "An introduction to React Hooks and how to use them.",
      postedBy: "Jane Smith",
    },
    {
      title: "JavaScript ES6 Features",
      link: "https://www.javascripttutorial.net/es6/",
      coverImage: "https://via.placeholder.com/150",
      description: "Learn about the new features introduced in JavaScript ES6.",
      postedBy: "Mike Johnson",
    },
    {
      title: "CSS Flexbox Guide",
      link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      coverImage: "https://via.placeholder.com/150",
      description: "A complete guide to CSS Flexbox layout.",
      postedBy: "Emily Davis",
    },
    {
      title: "Understanding TypeScript",
      link: "https://www.typescriptlang.org/docs/",
      coverImage: "https://via.placeholder.com/150",
      description: "Documentation and guides for understanding TypeScript.",
      postedBy: "John Doe",
    },
    {
      title: "Learn Python",
      link: "https://www.learnpython.org/",
      coverImage: "https://via.placeholder.com/150",
      description: "A comprehensive guide to learning Python programming.",
      postedBy: "Anna Lee",
    },
    {
      title: "Introduction to Node.js",
      link: "https://nodejs.dev/learn",
      coverImage: "https://via.placeholder.com/150",
      description: "Learn about Node.js and how to get started.",
      postedBy: "David Brown",
    },
    {
      title: "Vue.js Guide",
      link: "https://vuejs.org/v2/guide/",
      coverImage: "https://via.placeholder.com/150",
      description: "A guide to understanding and using Vue.js framework.",
      postedBy: "Sarah Wilson",
    },
    {
      title: "Django for Beginners",
      link: "https://djangoforbeginners.com/",
      coverImage: "https://via.placeholder.com/150",
      description:
        "A guide to getting started with Django for web development.",
      postedBy: "Chris Martin",
    },
    {
      title: "SQL Tutorial",
      link: "https://www.w3schools.com/sql/",
      coverImage: "https://via.placeholder.com/150",
      description:
        "A tutorial on SQL and how to use it for database management.",
      postedBy: "Laura White",
    },
    {
      title: "GraphQL Basics",
      link: "https://graphql.org/learn/",
      coverImage: "https://via.placeholder.com/150",
      description: "Learn the basics of GraphQL and how to use it.",
      postedBy: "James King",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddResource = () => {
    form
      .validateFields()
      .then((values) => {
        setResources([...resources, values]);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedResources = resources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card title="Resources" className="w-full mx-auto p-2 m-4">
      <div className="mb-4 flex items-right space-x-4">
        <Input
          className="w-48 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={search}
          onChange={handleSearch}
        />
        <button
          onClick={() => setIsModalVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className="flex items-center">
            <PlusOutlined className="text-xl mr-2" />
            <span className="hidden md:inline">Add Resource</span>
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {paginatedResources.map((resource, index) => (
          <Card
            key={index}
            hoverable
            cover={
              <ImageWithFallback
                src={resource.coverImage}
                fallbackSrc="https://via.placeholder.com/150"
                alt={resource.title}
                className="h-36 object-cover"
              />
            }
            className="rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
          >
            <Tooltip title={resource.title}>
              <Card.Meta
                title={<span className="block truncate">{resource.title}</span>}
                description={
                  <>
                    <Tooltip title={resource.description}>
                      <span className="block truncate">
                        {resource.description}
                      </span>
                    </Tooltip>
                    <p className="mt-2 text-sm text-gray-500">
                      Posted by: {resource.postedBy}
                    </p>
                  </>
                }
              />
            </Tooltip>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-500 hover:text-blue-700"
            >
              Read more
            </a>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={resources.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
      <Modal
        title="Add a new resource"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddResource}>
            Add Resource
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please input the title of the resource!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[
              {
                required: true,
                message: "Please input the link of the resource!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="coverImage"
            label="Cover Image URL"
            rules={[
              { required: true, message: "Please input the cover image URL!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the description of the resource!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Resources;

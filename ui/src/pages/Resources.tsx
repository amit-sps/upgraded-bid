import React, { ChangeEvent, useState, useEffect, useCallback } from "react";
import { Card, Button, Pagination, Tabs, notification, Form } from "antd";
import "tailwindcss/tailwind.css";
import { PlusOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import {
  Resource,
  useGetMyAllResourceListQuery,
  useGetResourceListQuery,
} from "../redux/apis/resource-apis-slice";
import axios from "../axios";
import Confirmation from "../components/Dialog/Confirmation";
import SearchBar from "../components/SearchBar";
import ResourceCard from "../components/ResourceCard";
import ResourceModal from "../components/Modal/ResourceModal";
import { roleGuard } from "../HOC/RoleGuard";
import { Roles } from "../assets";
import { useAppSelector } from "../redux/hooks";

const Resources: React.FC = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const { data: resourceData, refetch: refetchResourceData } =
    useGetResourceListQuery();
  const { data: myResourceData, refetch: refetchMyResourceData } =
    useGetMyAllResourceListQuery();

  const [resources, setResources] = useState<Resource[]>(
    resourceData?.data || []
  );
  const [myResources, setMyResources] = useState<Resource[]>(
    myResourceData?.data || []
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [search, setSearch] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState<any>(null);

  useEffect(() => {
    if (resourceData) {
      setResources(resourceData.data);
    }
  }, [resourceData]);

  useEffect(() => {
    if (myResourceData) {
      setMyResources(myResourceData.data);
    }
  }, [myResourceData]);

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      const filteredResources = resourceData?.data.filter(
        (resource: Resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.postedBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setResources(filteredResources || []);

      const filteredMyResources = myResourceData?.data.filter(
        (resource: Resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.postedBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setMyResources(filteredMyResources || []);
    }, 300),
    [resourceData, myResourceData]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    handleSearch(searchTerm);
  };

  const handleAddResource = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const endpoint = isEditing
            ? `/resource/${currentResource._id}`
            : "/resource/add-resource";
          const method = isEditing ? "put" : "post";
          await axios[method](endpoint, values, {
            headers: {
              "x-access-token": `${localStorage.getItem(
                "softprodigy-bidding-token"
              )}`,
            },
          });
          notification.success({
            message: `Resource ${
              isEditing ? "updated" : "added"
            } successfully.`,
            duration: 5,
          });
          refetchResourceData();
          refetchMyResourceData();
          form.resetFields();
          setIsModalVisible(false);
          setIsEditing(false);
          setCurrentResource(null);
        } catch (error: any) {
          if (error?.response?.data?.errors?.length) {
            return error?.response?.data?.errors?.forEach((err: any) =>
              notification.error({
                message: `${err?.msg} for ${err?.param}`,
                duration: 5,
              })
            );
          }
          notification.error({
            message: error?.response?.data?.message || "Something went wrong.",
            duration: 5,
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditResource = (resource: any) => {
    setCurrentResource(resource);
    form.setFieldsValue(resource);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDeleteResource = async (resourceId: string) => {
    Confirmation(
      {
        onConfirmation: () => deleteResource(resourceId),
        message: "Resource deleted successfully.",
      },
      () => {}
    );
  };

  const deleteResource = async (resourceId: string) => {
    try {
      await axios.delete(`/resource/${resourceId}`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      refetchResourceData();
      refetchMyResourceData();
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message || "Something went wrong.",
        duration: 5,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedResources = resources?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedMyResources = myResources?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card title="Resources" className="w-full mx-auto p-2 m-4">
      <div className="mb-4 flex items-right space-x-4">
        <SearchBar search={search} handleSearch={handleSearchChange} />
        {isLoggedIn && user && roleGuard([Roles.ForAll], user.role) && (
          <Button
            onClick={() => {
              setIsEditing(false);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-2 flex items-center rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <PlusOutlined className="text-xl mr-2" />
            <span className="hidden md:inline">Add Resource</span>
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="All Resources" key="1">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {paginatedResources?.map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                handleEditResource={handleEditResource}
                handleDeleteResource={handleDeleteResource}
              />
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={resources?.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Resources" key="2">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {paginatedMyResources?.map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                handleEditResource={handleEditResource}
                handleDeleteResource={handleDeleteResource}
                myResource={true}
              />
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={myResources?.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <ResourceModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        isEditing={isEditing}
        handleAddResource={handleAddResource}
        form={form}
      />
    </Card>
  );
};

export default Resources;

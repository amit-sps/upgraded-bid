import React from "react";
import { Card, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageWithFallback from "../ImageWithFallback";

interface ResourceCardProps {
  resource: any;
  myResource?: boolean;
  handleEditResource: (resource: any) => void;
  handleDeleteResource: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  myResource,
  handleEditResource,
  handleDeleteResource,
}) => {
  return (
    <Card
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
                <span className="block truncate">{resource.description}</span>
              </Tooltip>
              <p className="mt-2 text-sm text-gray-500">
                Posted by:{" "}
                <span className="bg-yellow-200 px-2 py-1 rounded-lg">
                  {resource?.postedBy?.name}
                </span>
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
      {myResource && (
        <div className="flex space-x-2 mt-2">
          <button
            className="px-3 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={() => handleEditResource(resource)}
          >
            <EditOutlined className="text-white" />
          </button>
          <button
            className="px-3 py-2 bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
            onClick={() => handleDeleteResource(resource._id)}
          >
            <DeleteOutlined className="text-white" />
          </button>
        </div>
      )}
    </Card>
  );
};

export default ResourceCard;

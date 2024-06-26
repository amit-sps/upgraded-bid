import React, { ChangeEvent } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  search: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, handleSearch }) => (
  <Input
    className="w-48 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:border-blue-500"
    placeholder="Search"
    prefix={<SearchOutlined />}
    value={search}
    onChange={handleSearch}
  />
);

export default SearchBar;

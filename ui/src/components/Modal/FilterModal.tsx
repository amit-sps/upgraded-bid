import React, { useState } from "react";
import { DateRangePicker } from "react-date-range"; // Import DateRangePicker component from react-date-range
import "react-date-range/dist/styles.css"; // Styles for the date range picker
import "react-date-range/dist/theme/default.css"; // Default theme for the date range picker
import { FilterInterface } from "../../interfaces";
import { format } from "date-fns";

interface FilterModalPropsInterface {
  setFilter: React.Dispatch<React.SetStateAction<FilterInterface | undefined>>;
  filter: FilterInterface | undefined;
  setSelectedFilters?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFilters?: string[];
  resetFilter: () => void;
  setModal: React.Dispatch<boolean>;
}

const FilterModal: React.FC<FilterModalPropsInterface> = ({
  setFilter,
  filter,
  selectedFilters,
  setSelectedFilters,
  resetFilter,
  setModal,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: filter?.startDate ? new Date(filter?.startDate) : new Date(),
    endDate: filter?.endDate ? new Date(filter?.endDate) : new Date(),
    key: "selection",
  });

  const [statusValue, setStatusValue] = useState<string | undefined>(
    filter?.status
  );
  const [bidTypeValue, setBidTypeValue] = useState<string | undefined>(
    filter?.bidType
  );

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFilters &&
        selectedFilters &&
        setSelectedFilters([...selectedFilters, value]);
    } else {
      setSelectedFilters &&
        selectedFilters &&
        setSelectedFilters(
          selectedFilters.filter((filter) => filter !== value)
        );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (ranges: any) => {
    setDateRange(ranges.selection);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusValue(event.target.value);
  };

  const handleBidTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBidTypeValue(event.target.value);
  };

  const handleApplyFilter = () => {
    const startDate = format(dateRange.startDate, "yyyy-MM-dd");
    const endDate = format(dateRange.endDate, "yyyy-MM-dd");

    const timeDifference =
      dateRange.endDate.getTime() - dateRange.startDate.getTime();

    const rangeGreaterThanOneDay = timeDifference > 86400000;

    const filter = {
      status: statusValue,
      bidType: bidTypeValue,
      startDate: rangeGreaterThanOneDay ? startDate : undefined,
      endDate: rangeGreaterThanOneDay ? endDate : undefined,
    };

    setFilter(filter);
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const reset = () => {
    resetFilter();
    setModal(false);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox text-blue-500"
            value="date"
            checked={selectedFilters && selectedFilters.includes("date")}
            onChange={handleFilterChange}
          />
          <span className="ml-2">Date</span>
        </label>
        <label className="inline-flex items-center ml-4">
          <input
            type="checkbox"
            className="form-checkbox text-blue-500"
            value="status"
            checked={selectedFilters && selectedFilters.includes("status")}
            onChange={handleFilterChange}
          />
          <span className="ml-2">Status</span>
        </label>
        <label className="inline-flex items-center ml-4">
          <input
            type="checkbox"
            className="form-checkbox text-blue-500"
            value="bidType"
            checked={selectedFilters && selectedFilters.includes("bidType")}
            onChange={handleFilterChange}
          />
          <span className="ml-2">Bid Type</span>
        </label>
      </div>

      {selectedFilters && selectedFilters.includes("bidType") && (
        <select
          value={bidTypeValue}
          onChange={handleBidTypeChange}
          className="w-full mx-1 my-4  px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Bid Type</option>
          <option value="Bid">Bid</option>
          <option value="Invite">Invite</option>
          <option value="Email Marketing">Email Marketing</option>
        </select>
      )}

      {selectedFilters && selectedFilters.includes("status") && (
        <select
          value={statusValue}
          onChange={handleStatusChange}
          required
          className="w-full mx-1 my-4  px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value="Job Submitted">Job Submitted</option>
          <option value="Response Received">Response Received</option>
          <option value="Scrapped">Scrapped</option>
          <option value="Converted">Converted</option>
        </select>
      )}

      {selectedFilters && selectedFilters.includes("date") && (
        <div className="mb-4 my-4">
          <DateRangePicker
            onChange={handleDateChange}
            months={1}
            ranges={[dateRange]}
            direction="horizontal"
            showDateDisplay={false}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleApplyFilter}
        >
          Apply Filter
        </button>
        <button
          className="px-4 py-2 mr-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-blue-600"
          onClick={reset}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FilterModal;

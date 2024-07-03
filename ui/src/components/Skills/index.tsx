import React, { useEffect, useState } from "react";
import { Select, Button, Spin } from "antd";
import { SelectProps } from "antd/lib/select";
import axios from "../../axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetSkillListsQuery } from "../../redux/apis/bid-apis-slice";
import { getProfile } from "../../Auth/Login";
import { toast } from "react-toastify";

const { Option } = Select;

const Skills: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const { data: skillsData, isLoading } = useGetSkillListsQuery();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const handleSelectChange: SelectProps<string[]>["onChange"] = (value) => {
    setSelectedSkills(value);
    setHasChanges(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        "/auth/skills",
        { skills: selectedSkills },
        {
          headers: {
            "x-access-token": `${localStorage.getItem(
              "softprodigy-bidding-token"
            )}`,
          },
        }
      );
      setHasChanges(false);
      setLoading(false);
      getProfile(dispatch);
      toast.success("Skills updated successfully!", { autoClose: 1000 });
    } catch (error) {
      setLoading(false);
      console.error("Failed to update skills", error);
      toast.error("Failed to update skills. Please try again.", {
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    setSelectedSkills(user?.skills || []);
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Your Skills</h2>
      {isLoading || loading ? (
        <Spin />
      ) : (
        <Select
          mode="multiple"
          placeholder="Select skills"
          value={selectedSkills}
          onChange={handleSelectChange}
          className="w-full mb-4"
        >
          {skillsData?.data.map((skill, _id) => (
            <Option key={_id} value={skill}>
              {skill}
            </Option>
          ))}
        </Select>
      )}
      <Button type="primary" onClick={handleUpdate} disabled={!hasChanges}>
        Update
      </Button>
    </div>
  );
};

export default Skills;

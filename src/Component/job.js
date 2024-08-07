import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Component/css/Applicant.css";
import { Input, Button, Select, Form, Row, Col, notification } from "antd";

const API_BASE_URL = "https://recruitmentapi.iykons.com";

const { Option } = Select;

const Job = ({ handleNext, handleBack, currentStep }) => {
  const [form] = Form.useForm(); //
  const [softSkill, setSoftSkill] = useState([]);
  const [hardSkill, setHardSkill] = useState([]);
  const [additionalKnownLanguages, setLanguage] = useState([]);
  const [ExperienceData, setExperienceData] = useState({
    motherLanguage: "",
    additionalQualification: "",
  });
  const [formState, setFormState] = useState({
    educationDTO: {
      currentStatus: "",
      qualification: "",
      instituteName: "",
      yearAttained: "",
    },
    departmentUserDTO: { departmentID: 0 },
    softSkill: [],
    hardSkill: [],
    language: [],
  });
  const [educationDTO, setEducationDTO] = useState({
    currentStatus: "",
    qualification: "",
    instituteName: "",
    yearAttained: "",
  });
  const [errors, setErrors] = useState({
    experienceData: null,
    educationDTO: null,
    departmentUserDTO: null,
  });

  const [departmentUserDTO, setDepartmentUserDTO] = useState({
    departmentID: 0,
  });

  const handleChangeExperienceData = (fieldName, value) => {
    setExperienceData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleChangeEducationDTO = (fieldName, value) => {
    setEducationDTO((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleChangeSoftSkills = (value) => {
    setSoftSkill(value);
  };

  const handleChangeHardSkills = (value) => {
    setHardSkill(value);
  };

  const handleChangeAdditionalKnownLanguages = (value) => {
    setLanguage(value);
  };

  const handleChangeDepartment = (value) => {
    setDepartmentUserDTO({
      departmentID: value,
    });
  };

  const location = useLocation();
  const jwtToken = location.state ? location.state.token : null;
  const handleSubmit2 = async () => {
    try {
      const values = await form.validateFields();
      await axios.post(
        `${API_BASE_URL}/api/Education/app`,
        {
          skillUserDTO: {
            softSkill,
            hardSkill,
            language: additionalKnownLanguages,
          },
          educationDTO,
          departmentUserDTO,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      handleNext();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        notification.error({
          description: `Server Error: ${error.response.status} - ${
            error.response.data.message || error.response.statusText
          }`,
        });
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const stepTitles = [
    "Personal Details",
    "Experience Details",
    "Application Questions",
    "Acknowledgement",
    "Reviews",
  ];

  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Department/GetDepartments`
        );

        const departmentData = response.data.$values;

        if (Array.isArray(departmentData)) {
          setDepartmentOptions(departmentData);
        } else {
          console.error(
            "Error fetching departments: Response data is not an array",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const [additionalLanguageOptions, setAdditionalLanguageOptions] = useState(
    []
  );
  const [softSkillOptions, setSoftSkillOptions] = useState([]);
  const [hardSkillOptions, setHardSkillOptions] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Skill/GetSkills`);
        console.log("API Response:", response.data);

        const skillData = response.data.$values;

        if (Array.isArray(skillData)) {
          const additionalLanguages = skillData.filter(
            (skill) => skill.skillType === 0
          );
          const softSkills = skillData.filter((skill) => skill.skillType === 1);
          const hardSkills = skillData.filter((skill) => skill.skillType === 2);

          setAdditionalLanguageOptions(additionalLanguages);
          setSoftSkillOptions(softSkills);
          setHardSkillOptions(hardSkills);
        } else {
          console.error(
            "Error fetching skills: Response data is not an array",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  console.log(departmentUserDTO);

  return (
    <div className="container" style={{ marginTop: "60px" }}>
      <Row gutter={[24]}>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Current Status
                <span className="required-asterisk">*</span>
              </span>
            }
            name="currentstatus"
            rules={[
              {
                required: true,
                message: "Please select the current status.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="currentstatus"
              name="currentstatus"
              value={educationDTO.currentStatus}
              onChange={(value) =>
                handleChangeEducationDTO("currentStatus", value)
              }
              placeholder="Current Status"
            >
              <Option value="Student">Student</Option>
              <Option value="Employed">Employed</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Qualification
                <span className="required-asterisk">*</span>
              </span>
            }
            name="qulification"
            rules={[
              {
                required: true,
                message: "Please select the qualification.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="qulification"
              name="qulification"
              value={educationDTO.qualification}
              onChange={(value) =>
                handleChangeEducationDTO("qualification", value)
              }
              placeholder="Qualification"
            >
              <Option value="Undergraduate">Undergraduate</Option>
              <Option value="Master">Master</Option>
              <Option value="PHD">PHD</Option>
              <Option value="A/L">A/L</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Field Of Study
                <span className="required-asterisk">*</span>
              </span>
            }
            name="fieldOfStudy"
            rules={[
              {
                required: true,
                message: "Please select the field of study.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="fieldOfStudy"
              name="fieldOfStudy"
              value={departmentUserDTO.departmentID}
              onChange={(value) => handleChangeDepartment(value)}
              placeholder="Field of Study"
            >
              {departmentOptions.map((department) => (
                // <div key={department.departmentID}>
                //   <label>{department.departmentName}</label>
                // </div>
                <Option
                  key={department.departmentID}
                  value={department.departmentID}
                >
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={
              <span>
                Insitute Name
                <span className="required-asterisk">*</span>
              </span>
            }
            name="insituteName"
            rules={[
              {
                required: true,
                message: "Please enter the institute name.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              type="text"
              id="insituteName"
              name="insituteName"
              value={educationDTO.instituteName}
              onChange={(e) =>
                handleChangeEducationDTO("instituteName", e.target.value)
              }
              placeholder="University"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Year Attained
                <span className="required-asterisk">*</span>
              </span>
            }
            name="yearAttained"
            rules={[
              {
                required: true,
                message: "Please enter year of attained.",
              },
              {
                pattern: /^[0-9]+$/,
                message: "Phone number must contain only digits.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              type="text"
              id="yearAttained"
              name="yearAttained"
              value={educationDTO.yearAttained}
              onChange={(e) =>
                handleChangeEducationDTO("yearAttained", e.target.value)
              }
              placeholder="Year Attained"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Additional Qualification
                <span className="required-asterisk">*</span>
              </span>
            }
            name="additionalQualification"
            rules={[
              {
                required: true,
                message: "Please enter the additional qualification.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              type="additionalQualification"
              id="additionalQualification"
              name="additionalQualification"
              value={ExperienceData.additionalQualification}
              onChange={(e) =>
                handleChangeExperienceData(
                  "additionalQualification",
                  e.target.value
                )
              }
              placeholder="additional Qualification"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Mother Language
                <span className="required-asterisk">*</span>
              </span>
            }
            name="motherLanguage"
            rules={[
              { required: true, message: "Please enter the mother language." },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              type="text"
              id="motherLanguage"
              name="motherLanguage"
              value={ExperienceData.motherLanguage}
              onChange={(e) =>
                handleChangeExperienceData("motherLanguage", e.target.value)
              }
              placeholder="Mother Language"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                Additional Known Languages
                <span className="required-asterisk">*</span>
              </span>
            }
            name="additionalKnownLanguages"
            rules={[
              {
                required: true,
                message: "Please select the additional languages.",
              },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="additionalKnownLanguages"
              name="additionalKnownLanguages"
              mode="multiple"
              value={additionalKnownLanguages.additionalKnownLanguages}
              onChange={(value) => handleChangeAdditionalKnownLanguages(value)}
              placeholder="additional Languages"
              showSearch
              optionFilterProp="children"
            >
              {additionalLanguageOptions.map((skill) => (
                <Option key={skill.skillid} value={skill.skillid}>
                  {skill.skillName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={
              <span>
                Soft Skills
                <span className="required-asterisk">*</span>
              </span>
            }
            name="softSkills"
            rules={[
              { required: true, message: "Please select the soft skills." },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="softSkills"
              name="softSkills"
              mode="multiple"
              value={softSkill.softSkills}
              onChange={(value) => handleChangeSoftSkills(value)}
              placeholder="SoftSkills"
              showSearch
              optionFilterProp="children"
            >
              {softSkillOptions.map((skill) => (
                <Option key={skill.skillid} value={skill.skillid}>
                  {skill.skillName}
                </Option>
              ))}
            </Select>

            {/* Similar structure as Additional Known Languages */}
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={
              <span>
                Hard Skills
                <span className="required-asterisk">*</span>
              </span>
            }
            name="hardSkills"
            rules={[
              { required: true, message: "Please select the hard skills." },
            ]}
            required={false}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              id="hardSkills"
              name="hardSkills"
              mode="multiple"
              value={hardSkill.hardSkills}
              onChange={(value) => handleChangeHardSkills(value)}
              placeholder="Select hard skills"
              showSearch
              optionFilterProp="children"
            >
              {hardSkillOptions.map((skill) => (
                <Option key={skill.skillid} value={skill.skillid}>
                  {skill.skillName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <div
          className="col-md-12"
          style={{ textAlign: "right", marginTop: "20px" }}
        >
          {currentStep > 0 && (
            <Button
              type="button"
              onClick={handleBack}
              className="btn btn-primary"
              style={{ marginRight: "10px" }}
            >
              Back
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && (
            <Button
              type="button"
              onClick={handleSubmit2}
              className="btn btn-primary"
            >
              Next
            </Button>
          )}
        </div>
      </Row>
    </div>
  );
};

export default Job;

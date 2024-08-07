import React, { useState, useEffect } from "react";
import axios from "axios";
import S3Upload from "./S3Upload";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Component/css/Applicant.css";
import {
  Input,
  Button,
  Radio,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  notification,
} from "antd";
import moment from "moment";

const API_BASE_URL = "https://recruitmentapi.iykons.com";

const { Option } = Select;

const AppQues = ({ handleNext, handleBack, currentStep }) => {
  const [formData, setFormData] = useState({
    uploadedFile: "",
  });
  const dynamicPath = `users/files`;

  const [appqueData, setappQudata] = useState({
    desiredLocation: "",
    isFullTimePosition: true,
    startDate: "22/09/2023",
    source: "",
    preferredContactMethod: "",
  });
  const [positionUserDTO, setDepartmentUserDTO] = useState({
    id: "",
  });

  const [app1queData, setappQudata1] = useState({
    refereename: "",
    refereephoneNo: "",
    refereeAddress: "",
  });

  const location = useLocation();
  const jwtToken = location.state ? location.state.token : null;

  const [selectedDate1, setSelectedDate1] = useState(null);

  const handleDateChange1 = (date1) => {
    setSelectedDate1(date1);
  };
  const handleAppqueDataChange = (field, value) => {
    setappQudata({
      ...appqueData,
      [field]: value,
    });
  };

  const handleApp1queDataChange = (field, value) => {
    setappQudata1({
      ...app1queData,
      [field]: value,
    });
  };

  const handleChangeDepartment = (value) => {
    // Find the selected position by its name
    const selectedPosition = departmentOptions.find(
      (position) => position.positionName === value
    );

    // If a position is found, set its id in the state
    if (selectedPosition) {
      setDepartmentUserDTO({
        id: selectedPosition.id,
      });
    }
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Position`);
        const positionData = response.data.$values;
        console.log(positionData);
        if (Array.isArray(positionData)) {
          setDepartmentOptions(positionData);
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

  const handleSubmit4 = async (e) => {
    e.preventDefault();
    const errors = {};
    // const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    // if (!phoneRegex.test(app1queData.refereephoneNo)) {
    //   errors.phoneNo =
    //     "Please enter a valid phone number in international format.";
    // }
    if (!formData.uploadedFile) {
      errors.cvFile = "Please upload your CV file.";
    }
    if (!Object.values(appqueData).every((value) => value)) {
      errors.common = "Please fill the all fields.";
    }
    if (!Object.values(app1queData).every((value) => value)) {
      errors.common = "Please fill the all fields";
    }

    if (Object.keys(errors).length > 0) {
      notification.error({
        description: errors.common,
      });
      return;
    }

    try { console.log("Submitting form with data:", {
      ...appqueData,
      startDate: selectedDate1,
    });

    console.log("Uploaded CV file:", formData.uploadedFile);

      await axios.post(
        `${API_BASE_URL}/api/JobApplication/Job`,
        {
          ...appqueData,
          startDate: selectedDate1,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const fileData = {
        fileName: formData.uploadedFile.name,
        filePath: formData.uploadedFile,
        fileSize: 0,
        contentType: formData.uploadedFile.type,
        status: true,
        positionId: positionUserDTO.id,
      };

      await axios.post(
        `${API_BASE_URL}/api/FileUploadResponse/upload`,

        fileData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      handleNext();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stepTitles = [
    "Personal Details",
    "Experience Details",
    "Application Questions",
    "Acknowledgement",
    "Reviews",
  ];

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  return (
    <Form>
      <div className="container" style={{ marginTop: "90px" }}>
        <Row gutter={[24]}>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Name
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="refereename"
              rules={[
                {
                  required: true,
                  message: "Please enter the referee name.",
                },
                {
                  pattern: "^[a-zA-Z]+$",
                  message: "Only letters (a-z, A-Z) are allowed.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="text"
                id="refereename"
                name="refereename"
                value={app1queData.refereename}
                onChange={(e) =>
                  handleApp1queDataChange("refereename", e.target.value)
                }
                
                placeholder="Referee name"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Phone No
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="refereephoneNo"
              rules={[
                {
                  required: true,
                  message: "Please enter the referee phone no.",
                },
                {
                  pattern: /^\+[0-9]+$/,
                  message: "Phone number must contain only digits.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="tel"
                id="referee phone No"
                name="refereephoneNo"
                value={app1queData.refereephoneNo}
                onChange={(e) =>
                  handleApp1queDataChange("refereephoneNo", e.target.value)
                }
                
                style={{ flex: 2 }}
                placeholder="E.g. +94771473328"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Address
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="refereeAddress"
              rules={[
                {
                  required: true,
                  message: "Please enter the referee address.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="text"
                id="refereeAddress"
                name="refereeAddress"
                value={app1queData.refereeAddress}
                onChange={(e) =>
                  handleApp1queDataChange("refereeAddress", e.target.value)
                }
                placeholder="Referee Address"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Desired Location
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="desiredLocation"
              rules={[
                {
                  required: true,
                  message: "Please select the desired location.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                id="desiredLocation"
                name="desiredLocation"
                value={appqueData.desiredLocation}
                onChange={(value) =>
                  handleAppqueDataChange("desiredLocation", value)
                }
                placeholder="Desired Location"
              >
                <Option value="OnSite">OnSite</Option>
                <Option value="Remote">Remote</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Where did you hear this opporunity?
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="source"
              rules={[
                {
                  required: true,
                  message: "Please select a option.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                id="source"
                name="source"
                value={appqueData.source}
                onChange={(value) => handleAppqueDataChange("source", value)}
                placeholder="source"
              >
                <Option value="LinkedIn">LinkedIn</Option>
                <Option value="Facebook">Facebook</Option>
                <Option value="Friends">Friends</Option>
                <Option value="Newspaper">Newspaper</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  When are you ready to start?
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Please select the start date.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <DatePicker
                id="startDate"
                name="startDate"
                selected={selectedDate1}
                disabledDate={disabledDate}
                onChange={handleDateChange1}
                dateFormat="MM/dd/yyyy"
                placeholderText="startDate"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Preferred Contact Method
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="preferredContactMethod"
              rules={[
                {
                  required: true,
                  message: "Please select a contact method.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                id="preferredContactMethod"
                name="preferredContactMethod"
                value={appqueData.preferredContactMethod}
                onChange={(value) =>
                  handleAppqueDataChange("preferredContactMethod", value)
                }         
                placeholder="ContactMethod"
              >
                <Option value="Email">Email</Option>
                <Option value="SMS">SMS</Option>
                <Option value="OnSite">Facebook</Option>
                <Option value="Remote">LinkedIn</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Are you looking for a full-time permanent position?
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="isFullTimePosition"
              rules={[
                {
                  required: true,
                  message: "Please select a option.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Radio.Group
                id="isFullTimePosition"
                name="isFullTimePosition"
                checked={appqueData.isFullTimePosition}
                onChange={(e) =>
                  handleAppqueDataChange("isFullTimePosition", e.target.checked)
                }
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Category
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="positionName"
              rules={[
                {
                  required: true,
                  message: "Please select a category.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                id="positionName"
                name="positionName"
                value={positionUserDTO.id} // Assuming positionName is the field representing the selected position
                onChange={(value) => handleChangeDepartment(value)}
                placeholder="Category"
              >
                {departmentOptions.map((position) => (
                  <Option key={position.id} value={position.positionName}>
                    {position.positionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Upload CV
                  <span className="required-asterisk">*</span>
                </span>
              }
              name="uploadedFile"
              rules={[
                {
                  required: true,
                  message: "Please select a file.",
                },
              ]}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
                name="uploadedFile"
                rules={[
                  {
                    required: true,
                    message: "Please upload a file",
                  },
                ]}
              >
                <S3Upload
                  name="uploadedFile"
                  setFormData={(name, value) =>
                    setFormData({ ...formData, [name]: value })
                  }
                  dynamicPath={dynamicPath}
                />
              </Form.Item>
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
                type="submit"
                onClick={handleSubmit4}
                className="btn btn-primary"
              >
                Next
              </Button>
            )}
          </div>
        </Row>
      </div>
    </Form>
  );
};
export default AppQues;

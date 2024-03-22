import React, { useCallback, useEffect, useState } from "react";
import "./DashBoardDetails.css";
import { Box, Button, Input, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../helpers/axios";
import { toast } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaExternalLinkAlt } from "react-icons/fa";

const DashBoardDetails = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [companyDetails, setCompanyDetails] = useState();
  const [isEdit, setIsEdit] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    companyName: "",
    contactNo: "",
    companyEmail: "",
    socialLinks: [],
    companyLogo: "",
    address: "",
  });
  const [isActiveToGoBack,setActiveToGoBack] = useState(false)
  const [logo, setLogo] = useState("");

  // console.log(dummyArray);

  // console.log(dummyArray);

  //HANDLE INPUTS OF dashboardData
  const handleInputs = (e) => {
    setDashboardData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //UPLOAD LOGO
  const handleUploadLogo = async () => {
    // navigate('/watermaker-setup')
    // return navigate('/home-page')
    const logoImg = new FormData();
    logoImg.append("file", logo);
    logoImg.append("upload_preset", "adiya_projects");

    await axios
      .post(
        "https://api.cloudinary.com/v1_1/adiyaprojects/image/upload",
        logoImg
      )
      .then((response) => {
        console.log(response);
        setDashboardData({
          ...dashboardData,
          companyLogo: response.data.secure_url,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //HANDLE SAVE
  const handleSave = async () => {
    const response = await axios.put(`/admin/dashboard`, dashboardData, {
      headers: {
        authorization: token,
      },
    });
    if (response.data.success) {
      toast.success("company dashboard updated successfully");
      navigate('/all-events-list')
    } else {
      console.log(response);
    }
    // navigate("/home-page");
  };
  console.log(token);

  const getCompanyInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/admin/dashboard`, {
        headers: {
          authorization: token,
        },
      });
      if (response.data.success) {
        setDashboardData({ ...response.data.data[0] });
        setActiveToGoBack(!!response.data.data[0].companyName.trim())

      }
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  console.log(dashboardData);

  // useEffect(() => {
  //   if (dashboardData.companyLogo) {
  //     handleSave();
  //   }
  //   // eslint-disable-next-line
  // }, [dashboardData.companyLogo]);

  useEffect(() => {
    getCompanyInfo();
  }, [getCompanyInfo]);

  const handleChange = (id, field, value) => {
    setDashboardData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) => {
        if (link.id === id) {
          return { ...link, [field]: value };
        }
        return link;
      }),
    }));
  };

  const handleAddLink = () => {
    const newId = dashboardData.socialLinks.length + 1;
    if (newId > 5) {
      return;
    }
    setDashboardData((prev) => ({
      ...prev,
      socialLink: [
        ...prev.socialLinks,
        { id: newId, ...{ linkType: "", link: "" } },
      ],
    }));
  };

  const deleteLink = (id) => {
    setDashboardData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }));
  };

  return (
    <div className="dashboard-details-wrappper">
  
      <h2 style={{position:'relative'}}>Dashboard Settings
       {(isActiveToGoBack)&&<Button style={{position:'absolute',left:'0px'}} onClick={()=>{navigate('/all-events-list')}}>Go Back</Button>}
      </h2>
      <h6>Update your account details, profile and more</h6>
      <form
        className="container"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <TextField
          type="text"
          className="form-control"
          label="Company Name"
          name="companyName"
          value={dashboardData.companyName}
          onChange={handleInputs}
          required
        />

        <Box className="company-logo">
          <label>Company Logo</label>
          <input
            className="file-btn"
            id="upload-file"
            type="file"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </Box>

        <TextField
          type="number"
          className="form-control"
          label="Contact Number"
          name="contactNo"
          value={dashboardData.contactNo}
          onChange={handleInputs}
          required

        />

        <TextField
          className="form-control"
          label="Office/ Home Address"
          name="companyAddress"
          type="text"
          value={dashboardData.companyAddress}
          onChange={handleInputs}
          focused={dashboardData?.companyAddress?.trim()}
          required
        />

        {/* <Box className='watermark-wrapper'>
                    <div>Watermark</div>
                </Box> */}

        <TextField
          type="email"
          className="form-control"
          label="Company Email"
          name="companyEmail"
          value={dashboardData.companyEmail}
          onChange={handleInputs}
          required
        />
        {/* <TextField
          type="text"
          className="form-control"
          label="Social Link"
          name="socialLink"
          alue={dashboardData.socialLink}
          onChange={handleInputs}
        /> */}
        {/* <label style={{margin:'10px'}}>Social Link</label> */}

        <Box
          sx={{
            display: "flex",
            padding: "10px ",
            border: "1px solid",
            borderRadius: "5px",
            justifyContent: "start",
            position: "relative",
            marginTop: "40px",
          }}
        >
          {isEdit
            ? dashboardData.socialLinks.map((el) => (
                <a
                  target="blank"
                  style={{
                    padding: "10px",
                    margin: "0px 10px",
                    textDecoration: "none",
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center'
                  }}
                  href={el.link}
                >
                  <FaExternalLinkAlt />
                  {el.linkType}
                </a>
              ))
            : dashboardData.socialLinks.map((el) => (
                <div key={el.id} style={{ padding: "10px", width: "200px" }}>
                  <TextField
                    value={el.linkType}
                    onChange={(e) =>
                      handleChange(el.id, "linkType", e.target.value)
                    }
                    label="Link Type"
                    name="linkType"
                  />
                  <TextField
                    value={el.link}
                    onChange={(e) =>
                      handleChange(el.id, "link", e.target.value)
                    }
                    label="Link"
                    name="link"
                    sx={{ margin: "15px 0px 0px 0px" }}
                  />
                  <Button
                    variant="outlined"
                    style={{ color: "red", marginTop: "15px" }}
                    onClick={() => deleteLink(el.id)}
                  >
                    {<MdDelete />}
                  </Button>
                </div>
              ))}
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {dashboardData.socialLinks.length < 5 && !isEdit && (
              <Button
                onClick={() => {
                  handleAddLink();
                }}
              >
                Add New Link
              </Button>
            )}
          </div>
          <Button
            onClick={() => {
              setIsEdit((prev) => !prev);
            }}
            sx={{
              position: "absolute",
              top: "-30px",
              right: "0px",
              height: "fit-content",
              width: "fit-content",
              color: "blue",
            }}
            variant="outlined"
          >
            {isEdit ? <CiEdit /> : <GrView />}
          </Button>
        </Box>

        <Box className="savebtn-wrapper">
          <Button variant="contained" className="btn" type="submit">
            SAVE
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default DashBoardDetails;

import { useEffect, useState } from "react";
import { Container, Card, Typography, Button } from "@mui/material";
import { FaFolder } from "react-icons/fa6";
import axios from "../../helpers/axios";
import AllImagesContainer from "../event-details-page/all-images-container/all-images-container";
import { useParams } from "react-router-dom";

const FavouritsDashboard = ({
  setCategroyId,
  setOpenImagesCorousalModal,
  setSelectedImage,
}) => {
  const [data, setData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const resp = await axios.get(`/fetch-favourite-album/${eventId}`, {
          headers: {
            authorization: token,
          },
        });
        setData(resp.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchData();
  }, [eventId]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setImagesData(folder.images || []);
    setCategroyId(folder._id);
  };

  return (
    <Container>
      {selectedFolder ? (
        <>
          <Button variant="contained" onClick={() => setSelectedFolder(null)}>
            Go Back
          </Button>
          <AllImagesContainer
            eventData={imagesData}
            setCategroyId={setCategroyId}
            setSelectedImage={setSelectedImage}
            setOpenImagesCorousalModal={setOpenImagesCorousalModal}
          />
        </>
      ) : (
        <div className="bg-zinc-200 p-3 rounded-lg">
          {data.map((folder, index) => (
            <Card
              className="p-3"
              key={index}
              onClick={() => handleFolderClick(folder)}
              style={{
                marginTop: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0px 10px",
                cursor: "pointer",
              }}
            >
              <FaFolder style={{ marginRight: "15px" }} />
              <Typography sx={{ fontWeight: "500", fontSize: "15px" }}>
                {folder.email}
              </Typography>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default FavouritsDashboard;

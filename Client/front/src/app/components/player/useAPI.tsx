// useAPI.tsx
import axios from "axios";
import { useState } from "react";
import { MusicDataItem } from "../main/MusicList";
import { headers } from "next/headers";

const useAPI = () => {
  const [playlist, setPlaylist] = useState<MusicDataItem[]>([]);

  const fetchPlaylist = async () => {
    console.log("fetchPlaylist호출!!");
    try {
      const response = await axios.get("http://localhost:8080/playlist/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      console.log("서버로부터 온 데이터", data);

      setPlaylist(data.data || []);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  const addTrackToPlaylist = async (songIds: number[]) => {
    console.log("addTrackToPlaylist 호출!!");
    try {
      await axios.put(
        "http://localhost:8080/playlist/add",
        {
          addList: songIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  const fetchStreamingUrl = async (songId: number) => {
    console.log("fetchStreamingUrl 호출!!");
    try {
      const response = await axios.get(
        `http://localhost:8080/streaming/${songId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);

      return audioUrl;
    } catch (error) {
      console.error("Error fetching streaming URL:", error);
      throw error;
    }
  };

  return {
    playlist,
    fetchPlaylist,
    addTrackToPlaylist,
    fetchStreamingUrl,
    setPlaylist,
  };
};

export default useAPI;

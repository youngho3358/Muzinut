// hooks/useMusicPlayer.ts
import { useState } from "react";
import { Howl } from "howler";
import useAPI from "@/app/components/player/useAPI";
import { MusicDataItem } from "@/app/components/main/MusicList";

const useMusicPlayer = () => {
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicDataItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playlist, setPlaylist, addTrackToPlaylist, fetchStreamingUrl } = useAPI();

  const handlePlayButtonClick = async (songId: number, listItems: MusicDataItem[]) => {
    try {
      const audioUrl = await fetchStreamingUrl(songId);

      if (currentSound) {
        currentSound.stop();
      }

      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false),
        onloaderror: (id, error) => console.error(`Error loading sound: ${error}`),
        onplayerror: (id, error) => console.error(`Error playing sound: ${error}`),
      });

      const track = listItems.find((track) => track.songId === songId) || null;
      if (track) {
        // track의 audio 속성에 Howl 객체를 설정
        track.audio = sound;
        setCurrentTrack(track);
        setPlaylist((prev) => [...prev, track]);
        await addTrackToPlaylist([...playlist.map((item) => item.songId, songId)]);
      }
        sound.play();

   

      setCurrentSound(sound);
    } catch (error) {
      console.error("Error fetching or playing music:", error);
    }
  };

  const handlePlayPause = () => {
    if (currentSound) {
      if (isPlaying) {
        currentSound.pause();
        setIsPlaying(false);
      } else {
        currentSound.play();
        setIsPlaying(true);
      }
    }
  };

  return {
    currentTrack,
    isPlaying,
    playlist,
    setPlaylist,
    handlePlayButtonClick,
    handlePlayPause,
  };
};

export default useMusicPlayer;

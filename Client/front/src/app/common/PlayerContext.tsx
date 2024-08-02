
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { Howl } from 'howler';
// import { MusicDataItem } from '../components/main/MusicList';
// import useAPI from '../components/player/useAPI';

// interface PlayerContextType {
//   currentSound: Howl | null;
//   setCurrentSound: (sound: Howl | null) => void;
//   currentTrack: MusicDataItem | null;
//   setCurrentTrack: (track: MusicDataItem | null) => void;
//   isPlaying: boolean;
//   setIsPlaying: (playing: boolean) => void;
//   playlist: MusicDataItem[];
//   setPlaylist: React.Dispatch<React.SetStateAction<MusicDataItem[]>>;
//   handlePlayButtonClick: (songId: number) => void;
//   handlePlayPause: () => void;
// }

// const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const { fetchStreamingUrl, addTrackToPlaylist, playlist, setPlaylist } = useAPI();
//   const [currentSound, setCurrentSound] = useState<Howl | null>(null);
//   const [currentTrack, setCurrentTrack] = useState<MusicDataItem | null>(null);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);


//   // 재생 버튼 눌렀을 때 
//   const handlePlayButtonClick = async (songId: number) => {
//     try {
//       //음악 스트리밍 URL 가져오기(by UseAPI 훅)
//       const audioUrl = await fetchStreamingUrl(songId);

//       // 기존 재생 중인 음악은 중지
//       if (currentSound) {
//         currentSound.stop();
//       }

//       //트랙의 오디오 URL을 가져와 Howler 객체로 재생
//       const sound = new Howl({
//         // src: [audioUrl, `${audioUrl}.mp3`, `${audioUrl}.ogg`, `${audioUrl}.wav`, `${audioUrl}.aac`], // 지원하는 형식 모두 추가
//         src: [audioUrl],
//         html5: true,
//         onplay: () => setIsPlaying(true),
//         onend: () => setIsPlaying(false),
//         onloaderror: (id, error) => console.error(`Error loading sound: ${error}`),
//         onplayerror: (id, error) => console.error(`Error playing sound: ${error}`),
//       });

//       // 현재 재생 중인 곡 정보 업데이트
//       const track = playlist.find((track) => track.songId === songId) || null;
//       setCurrentTrack(track);
//       console.log("현재 재생 중인 곡 정보 업데이트", currentTrack);
//       // 재생
//       sound.play();
//       console.log('음악 재생 완료');
      
//       console.log("track 있음?", track, "있으면 플레이리스트에 추가할거임")
//             // 현재 곡을 플레이리스트에 추가 (중복 허용)
//       if (track) {
//         const updatedPlaylist = [...playlist, track]; // 플레이리스트의 끝에 추가
//         setPlaylist(updatedPlaylist); // 상태 업데이트
//         await addTrackToPlaylist(updatedPlaylist.map((item) => item.songId)); // 서버에 업데이트
//       }

//       // 새로 생성된 Howl 인스턴스를 상태에 저장
//       setCurrentSound(sound);
//     } catch (error) {
//       console.error("Error fetching or playing music:", error);
//     }
//   };

//   const handlePlayPause = () => {
//     if (currentSound) {
//       if (isPlaying) {
//         currentSound.pause();
//         setIsPlaying(false);
//       } else {
//         currentSound.play();
//         setIsPlaying(true);
//       }
//     }
//   };

//   return (
//     <PlayerContext.Provider
//       value={{ currentSound, setCurrentSound, currentTrack, setCurrentTrack, isPlaying, setIsPlaying, playlist, setPlaylist, handlePlayButtonClick, handlePlayPause }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// };

// export const usePlayerContext = () => {
//   const context = useContext(PlayerContext);
//   if (!context) {
//     throw new Error('usePlayerContext must be used within a PlayerProvider');
//   }
//   return context;
// };


// contexts/PlayerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MusicDataItem } from '../components/main/MusicList';

interface PlayerContextProps {
  currentTrack: MusicDataItem | null;
  isPlaying: boolean;
  playlist: MusicDataItem[];
  setPlaylist: React.Dispatch<React.SetStateAction<MusicDataItem[]>>;
  playTrack: (track: MusicDataItem) => void;
  togglePlayPause: () => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicDataItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<MusicDataItem[]>([]);

  const playTrack = (track: MusicDataItem) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        setPlaylist,
        playTrack,
        togglePlayPause,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

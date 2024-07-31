package nuts.muzinut.controller.music;

import lombok.RequiredArgsConstructor;
import nuts.muzinut.domain.music.PlayNut;
import nuts.muzinut.dto.music.playlist.PlaylistAddDto;
import nuts.muzinut.dto.music.playlist.PlaylistChangeDto;
import nuts.muzinut.dto.music.playlist.PlaylistDeleteDto;
import nuts.muzinut.dto.music.playlist.PlaylistMusicsDto;
import nuts.muzinut.service.music.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/playlist")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/get")
    public ResponseEntity<Map<String, List<PlaylistMusicsDto>>> getPlaylist() throws IOException {
        Long userId = playlistService.getCurrentUserId();
        List<PlaylistMusicsDto> playlistMusics = playlistService.getPlaylistMusics(userId);
        Map<String, List<PlaylistMusicsDto>> body = new HashMap<>();
        body.put("data", playlistMusics);

        return ResponseEntity.ok()
                .body(body);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/add")
    public ResponseEntity<String> addPlaylistMusic(@RequestBody PlaylistAddDto addListBody) {
        List<Long> addList = addListBody.getAddList();
        Long userId = playlistService.getCurrentUserId();
        // 해당 음원 Entity 가 존재하는지 확인 -> 음원이 존재하지 않으면 exception 발생
        playlistService.addSongIsExist(addList);
        // 플레이리스트의 수 > 1000 이면 exception
        playlistService.checkPlaylistMaxSize(addList.size(), userId);
        playlistService.addPlaylistMusics(addList, userId); // 음원 추가

        return ResponseEntity.ok()
                .body("add success");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePlaylistMusic(@RequestBody PlaylistDeleteDto deleteListBody) {
        List<Long> deleteList = deleteListBody.getDeleteList();
        Long userId = playlistService.getCurrentUserId();
        // 삭제하려는 PlaylistMusic Entity 가 존재하는지 Id 값으로 확인 -> 해당 Entity 가 존재하지 않으면 exception 발생
        playlistService.deleteSongIsExist(deleteList);
        playlistService.deletePlaylistMusics(deleteList); // 플레이리스트에서 음원 삭제

        return ResponseEntity.ok()
                .body("delete success");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllPlaylistMusic() {
        playlistService.deleteAllPlaylistMusics();

        return ResponseEntity.ok()
                .body("delete all success");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/change")
    public ResponseEntity<String> playlistChange(@RequestBody PlaylistChangeDto playnutIdBody) {
        Long changePlaynutId = playnutIdBody.getPlaynutId();
        Long userId = playlistService.getCurrentUserId();
        PlayNut playnut = playlistService.findPlaynut(changePlaynutId, userId);
        List<Long> playnutMusicList = playlistService.findAllPlaynutMusics(playnut);
        playlistService.deleteAllPlaylistMusics();
        playlistService.addPlaylistMusics(playnutMusicList, userId);

        return ResponseEntity.ok()
                .body("플레이리스트가 {" + playnut.getTitle() + "}로 변경되었습니다.");
    }
}

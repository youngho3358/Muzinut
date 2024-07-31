package nuts.muzinut.dto.member.profile.Board;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkTitle {

    private Long id;
    private String bookmarkTitle;
    private String boardType;   // 보드 타입 추가

}

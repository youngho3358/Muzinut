package nuts.muzinut.dto.board.event;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class EventBoardsDto {
    private List<EventBoardsForm> freeBoardsForms = new ArrayList<>();
    private int currentPage;
    private int totalPage;
    private Long totalContent; //조회된 총 데이터 수

    public void setPaging(int currentPage, int totalPage, Long totalContent) {
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.totalContent = totalContent;
    }
}

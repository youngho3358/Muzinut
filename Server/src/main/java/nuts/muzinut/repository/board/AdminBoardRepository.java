package nuts.muzinut.repository.board;

import nuts.muzinut.domain.board.AdminBoard;
import nuts.muzinut.domain.board.AdminUploadFile;
import nuts.muzinut.domain.board.RecruitBoard;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdminBoardRepository extends JpaRepository<AdminBoard, Long> {
    void deleteById(Long id);

    @Query("select a from AdminBoard a join fetch a.user where a.id = :id")
    Optional<AdminBoard> findAdminBoardWithUser(@Param("id") Long boardId);

    @Query("select a from AdminBoard a join fetch a.adminUploadFiles where a.id = :id")
    Optional<AdminBoard> findAdminBoardWithUploadFiles(@Param("id") Long id);

    Slice<AdminBoard> findByTitleContaining(String title, Pageable pageable);
}

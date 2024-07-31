package nuts.muzinut.domain.chat;

import jakarta.persistence.*;
import lombok.Getter;
import nuts.muzinut.domain.member.User;

@Entity
@Getter
@Table(name = "read_message")
public class ReadMessage {

    @Id @GeneratedValue
    @Column(name = "read_message_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private Message message;

    @Column(name = "member_id")
    private Long memberId;

    //연관 관계 메서드
    public void read(User user, Message message) {
        this.message = message;
        this.memberId = user.getId();
        message.getReadMessages().add(this);
    }
}

package nuts.muzinut.domain.member;

import lombok.*;
import jakarta.persistence.*;
import lombok.extern.slf4j.Slf4j;
import nuts.muzinut.domain.board.*;
import nuts.muzinut.domain.chat.ChatMember;
import nuts.muzinut.domain.chat.ChatRequest;
import nuts.muzinut.domain.chat.Message;
import nuts.muzinut.domain.music.PlayNut;
import nuts.muzinut.domain.music.Playlist;
import nuts.muzinut.domain.music.Song;
import nuts.muzinut.domain.mypick.MypickComment;
import nuts.muzinut.domain.nuts.NutsUsageHistory;
import nuts.muzinut.domain.nuts.PaymentHistory;
import nuts.muzinut.domain.nuts.SupportMsg;
import org.springframework.security.core.parameters.P;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
//@Table(name = "`user`")
@Table(name = "users")
@Getter
@Setter
@Slf4j
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id @Column(name = "user_id")
    @GeneratedValue
    private Long id;

    @Column(name = "username", length = 50, unique = true)
    private String username; //email

    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "nickname", length = 50, unique = true)
    private String nickname;

    @Column(name = "activated")
    private boolean activated;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "profile_img_filename")
    private String profileImgFilename;

    @Column(name = "profile_banner_img_filename")
    private String profileBannerImgFilename;

    @Column(name = "account_number")
    private int accountNumber; //계좌 번호

    private String intro; //자기 소개
    private int nuts; //보유 너츠
    private int vote; //투표권
    private int declaration; //신고 횟수~
    private int receiveVote;

    @Lob
    private byte[] base64Data;

    @ManyToMany
    @JoinTable(
            name = "user_authority",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "authority_name", referencedColumnName = "authority_name")})
    private Set<Authority> authorities;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id")
    private Playlist playlist = new Playlist();

    public User(String username, String password, String nickname) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.followings = new ArrayList<>(); // 필드 초기화 추가
        this.comments = new ArrayList<>(); // 필드 초기화 추가
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.nickname = username;
        this.followings = new ArrayList<>(); // 필드 초기화 추가
        this.comments = new ArrayList<>(); // 필드 초기화 추가
    }

    //비지니스 메서드
    public String setNickname(String nickname) {
        this.nickname = nickname;
        return nickname;
    }

    public void updatePassword(String newPassword) {
        log.info("change password!");
        this.password = newPassword;
    }

    public void updateMyself(String nickname, String intro) {
        this.nickname = nickname;
        this.intro = intro;
    }
    public void updateNicknameAndIntro(String nickname, String intro) {
        this.nickname = nickname;
        this.intro = intro;
    }


    //회원 관련
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Mailbox> mailboxes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Follow> followings = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Block> blocks = new ArrayList<>();

    //음악 관련
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Song> songList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PlayNut> playNutList = new ArrayList<>();

    //게시판 관련
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<RecruitBoard> recruitBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<FreeBoard> freeBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Lounge> lounges = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Reply> replies = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Bookmark> bookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Like> likeList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<AdminBoard> adminBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<CommentLike> commentLikes = new ArrayList<>();

    //후원 관련
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PaymentHistory> paymentHistories = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SupportMsg> supportMsgs = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<NutsUsageHistory> nutsUsageHistories = new ArrayList<>();

    //채팅 관련
    @OneToMany(mappedBy = "user")
    private List<ChatMember> chatMembers = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Message> messages = new ArrayList<>();

/*
    @OneToMany(mappedBy = "requestUser", cascade = CascadeType.ALL)
    private List<ChatRequest> requestUsers = new ArrayList<>();

    @OneToMany(mappedBy = "receiveUser", cascade = CascadeType.ALL)
    private List<ChatRequest> receiveUsers = new ArrayList<>();
*/
}

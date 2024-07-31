package nuts.muzinut.controller.member;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nuts.muzinut.controller.board.FileType;
import nuts.muzinut.domain.board.RecruitBoard;
import nuts.muzinut.domain.member.User;
import nuts.muzinut.dto.MessageDto;
import nuts.muzinut.dto.member.*;
import nuts.muzinut.dto.member.follow.ProfileUpdateDto;
import nuts.muzinut.dto.member.login.LoginSuccessDto;
import nuts.muzinut.dto.member.profile.ProfileDto;
import nuts.muzinut.dto.security.RefreshTokenDto;
import nuts.muzinut.dto.security.TokenDto;
import nuts.muzinut.exception.DuplicateMemberException;
import nuts.muzinut.exception.EmailVertFailException;
import nuts.muzinut.exception.NotFoundMemberException;
import nuts.muzinut.jwt.JwtFilter;
import nuts.muzinut.jwt.TokenProvider;
import nuts.muzinut.service.board.FileStore;
import nuts.muzinut.service.member.MailSendService;
import nuts.muzinut.service.member.ProfileService;
import nuts.muzinut.service.member.UserService;
import nuts.muzinut.service.security.AuthService;
import org.springframework.http.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;

import static nuts.muzinut.controller.board.FileType.*;

@Slf4j
@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStore fileStore;
    private final MailSendService mailService;
    private final ProfileService profileService;
    private final TokenProvider tokenProvider;
    private final AuthService authService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final ObjectMapper objectMapper;

    @GetMapping("/join")
    public String joinForm() {
        return "/user/join";
    }

    /**
     * @param joinDto
     * @throws: 이메일 인증 실패시 404 error
     * @return: 회원가입 성공 메시지 전송
     */
    @ResponseBody
    @PostMapping("/join")
    public MessageDto join(@Validated @RequestBody JoinDto joinDto) {
        Boolean Checked = mailService.CheckAuthNum(joinDto.getUsername(), joinDto.getAuthNum());
        if (Checked) {
            userService.signup(new UserDto(joinDto.getUsername(), joinDto.getPassword(), joinDto.getNickname()));
            return new MessageDto("회원 가입 성공");
        } else {

            throw new EmailVertFailException("인증 번호가 일치하지 않습니다");
        }
    }

    @ResponseBody
    @PostMapping("/nickname-check")
    public MessageDto checkNicknameDuplicate(@RequestBody @Validated NicknameCheckDupForm form) {
        log.info("들어온 이름: {}", form.getNickname());
        boolean isDuplicate = userService.checkDuplicateNickname(form.getNickname());
        if (isDuplicate) {
            throw new DuplicateMemberException("이미 사용중인 닉네임입니다.");
        }
        return new MessageDto("사용 가능한 닉네임입니다");
    }

    /**
     * 사실상 로그인 하는 로직
     * @param loginDto: username (email) & password 전송 필요
     * @return:
     */
    @ResponseBody
    @PostMapping("/authenticate")
    public ResponseEntity<LoginSuccessDto> login(@Validated @RequestBody LoginDto loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.createToken(authentication);
        String refreshToken = tokenProvider.createRefreshToken(authentication);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JwtFilter.AUTHORIZATION_HEADER, "Bearer " + token);

        User findUser = userService.findByUsername(loginDto.getUsername());

        return new ResponseEntity<>(new LoginSuccessDto(token, refreshToken,
                userService.findProfileImage(findUser.getProfileImgFilename()),
                findUser.getNickname()), httpHeaders, HttpStatus.OK);
    }

    @ResponseBody
    @PostMapping("/simple-authenticate")
    public MessageDto simpleLogin() {

        return new MessageDto("간편 로그인");
    }

    //리프레시 토큰 발급
    @ResponseBody
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/re-authenticate")
    public TokenDto reLogin(@RequestHeader("Authorization") String bearerToken) {
        return authService.reissueToken(bearerToken.substring(7)); //bearer 제외한 실제 토큰 값만 반환
    }

    /**
     * 사용자의 프로필을 설정하는 메서드
     * @param profileImg: 사용자가 설정하고 싶은 프로필 이미지
     * @throws IOException
     */
    @ResponseBody
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping(value = "/set-profile")
    public ResponseEntity<MessageDto> setProfile(@RequestPart("profileImg") MultipartFile profileImg) throws IOException {
        User user = userService.getUserWithUsername()
                .orElseThrow(() -> new NotFoundMemberException("회원이 아닙니다."));

        if (StringUtils.hasText(user.getProfileImgFilename())) {
            //프로필 바꾸기
            String changeImgName = fileStore.updateFile(profileImg, user.getProfileImgFilename());
            userService.setProfileName(changeImgName, user);
        } else {
            //프로필 처음 설정
            Map<FileType, String> filenames = fileStore.storeFile(profileImg);
            userService.setProfileName(filenames.get(STORE_FILENAME), user);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("/profile?userId=" + user.getId()));
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                .headers(headers)
                .body(new MessageDto("파일 저장 성공"));
    }

    //프로필 닉네임, 자기소개 설정
    @ResponseBody
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PatchMapping("/set-profile-nickname-intro")
    public ResponseEntity<MessageDto>  setProfileNicknameIntro(@Validated @RequestBody ProfileUpdateDto profileUpdateDto) {
        User user = userService.getUserWithUsername()
                .orElseThrow(() -> new NotFoundMemberException("회원이 아닙니다."));

        // 기존 닉네임과 동일한 경우
        if (user.getNickname().equals(profileUpdateDto.getNickname())) {
            userService.updateNicknameAndIntro(user.getId(), profileUpdateDto.getNickname(), profileUpdateDto.getIntro());
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("/profile?userId=" + user.getId()));
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                    .headers(headers)
                    .body(new MessageDto("프로필 업데이트가 성공되었습니다."));
        }
        // 기존 닉네임과 다른 경우
        else {
            // 중복 닉네임 확인
            if (userService.isDuplicateNickname(profileUpdateDto.getNickname())) {
                throw new DuplicateMemberException("이미 사용중인 닉네임입니다.");
            }
            userService.updateNicknameAndIntro(user.getId(), profileUpdateDto.getNickname(), profileUpdateDto.getIntro());
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("/profile?userId=" + user.getId()));
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                    .headers(headers)
                    .body(new MessageDto("프로필 업데이트가 성공되었습니다."));
        }
    }

    // 프로필 배너 이미지 설정
    @ResponseBody //Todo 리다이렉트 설정 필요
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping(value = "/set-profile-bannerImage")
    public ResponseEntity<MessageDto>  setProfileBannerImage(@RequestParam("bannerImg") MultipartFile bannerImg) throws IOException {
        User user = userService.getUserWithUsername()
                .orElseThrow(() -> new NotFoundMemberException("회원이 아닙니다."));

        if (StringUtils.hasText(user.getProfileBannerImgFilename())) {
            //프로필 배너 바꾸기
            String changeImgName = fileStore.updateFile(bannerImg, user.getProfileBannerImgFilename());
            userService.setProfileBannerName(changeImgName, user);
        } else {
            //프로필 배너 처음 설정
            Map<FileType, String> filenames = fileStore.storeFile(bannerImg);
            userService.setProfileBannerName(filenames.get(STORE_FILENAME), user);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("/profile?userId=" + user.getId()));
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                .headers(headers)
                .body(new MessageDto("파일 저장 성공"));
    }

    //비밀번호 수정
    @ResponseBody
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/change-password")
    public MessageDto changePassword(@Validated @RequestBody PasswordChangeForm form) {
        User user = userService.getUserWithUsername()
                .orElseThrow(() -> new NotFoundMemberException("회원이 아닙니다."));

        userService.updatePassword(user, form.getCurrentPassword(), form.getNewPassword());
        return new MessageDto("비밀번호가 수정되었습니다");
    }

    //비밀번호 찾기
    @ResponseBody
    @PostMapping("/find-password")
    public MessageDto findPassword(@RequestBody @Validated @NotNull PasswordFindForm form) {
        if (userService.isUser(form.getUsername())) {
            mailService.findPassword(form.getUsername());
            return new MessageDto("이메일이 전송되었습니다");
        }
        throw new NotFoundMemberException("가입된 회원이 아닙니다. 회원가입을 해주세요");
    }

    //비밀번호 새롭게 설정하기
    @ResponseBody
    @PutMapping("/find-password")
    public MessageDto setNewPassword(@RequestBody @Validated SetNewPasswordForm form) {
        Boolean checked = mailService.CheckAuthNum(form.getUsername(), form.getAuthNum());
        if (checked) {
            User findUser = userService.findByEmail(form.getUsername());
            userService.updatePassword(findUser, form.getPassword());
            return new MessageDto("비밀번호가 수정되었습니다");
        }
        throw new EmailVertFailException("인증 번호가 일치하지 않습니다");
    }

    // 닉네임, 자기소개 수정 폼을 보여주는 메소드
    @GetMapping("/profile/{id}/modify")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public String editProfileForm(@PathVariable Long id, Model model) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NotFoundMemberException("회원이 아닙니다.");
        }
        // 사용자 정보를 로그로 출력하여 확인
        log.info("User ID: {}", user.getId());
        log.info("Nickname: {}", user.getNickname());
        log.info("Intro: {}", user.getIntro());
        model.addAttribute("user", user);
        return "user/profile-nickname-intro-form";
    }
}

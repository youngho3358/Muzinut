package nuts.muzinut.exception;

//이메일 인증 실패한 경우 ex) 인증번호를 잘못 입력했을 때
public class EmailVertFailException extends RuntimeException{

    public EmailVertFailException() {
        super();
    }

    public EmailVertFailException(String message) {
        super(message);
    }

    public EmailVertFailException(String message, Throwable cause) {
        super(message, cause);
    }

    public EmailVertFailException(Throwable cause) {
        super(cause);
    }

    protected EmailVertFailException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}

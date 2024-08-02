import Link from "next/link";
import styles from "./AuthForm.module.css"
import { ReactNode } from "react";

interface AuthFormProps {
  title: string;
  actionLink: string;
  actionText: string;
  children: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  actionLink,
  actionText,
  children,
}) => {
  return (
    <div className={styles.authform__container}>
      <div className={styles.title__container}>
        <h2>{title}</h2>
        <p>
          내 안의 모든 음악생활, <Link href="/">MuziNut</Link>
        </p>
      </div>
      <form className={styles.form__container}>{children}</form>
      <div className={styles.footer__container}>
        <p>
          <Link href={actionLink}>{actionText} 하러 가기 → </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

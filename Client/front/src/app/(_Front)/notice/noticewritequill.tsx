"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import styled, { keyframes, css } from "styled-components";
import QuillToolbar from "../profile/lounge/EditorOption";
import Quill from "quill";
import AxiosURL from "@/app/axios/url";
import { getToken, getRefreshToken } from "@/app/common/common";

const Font = Quill.import("formats/font");
Font.whitelist = ["esamanruLight", "esamanruMedium", "esamanruBold"];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["13px", "16px", "18px", "24px", "28px", "32px"];
Quill.register(Size, true);

const NoticeWriteQuill: React.FC<{
  onPublish: (content: string) => void;
  onClose: () => void;
  initialContent?: string;
}> = ({ onPublish, onClose, initialContent }) => {
  const quillRef = useRef<ReactQuill>(null);
  const [content, setContent] = useState<string>(initialContent || "");
  const [title, setTitle] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    []
  );

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.format("font", "esamanruLight");
      quill.format("size", "13px");
    }
  }, []);

  const handleChange = (content: string) => {
    setContent(content);
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64Data = e.target?.result as string;
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              // 이미지를 Base64 형태로 Quill 에디터에 삽입
              quill.clipboard.dangerouslyPasteHTML(
                range.index,
                `<img src="${base64Data}" />`
              );
            }
          }
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleSubmit = async () => {
    if ((title.trim() === "" || null) && (content.trim() === "" || null)) {
      alert("작성하고 싶은 글을 작성해 주세요");
      return;
    }

    if (title.trim() === "") {
      alert("제목을 입력해주세요");
      return;
    }

    if (content.trim() === "") {
      alert("내용을 입력해주세요");
      return;
    }

    const authToken = getToken();

    if (!authToken) {
      try {
        getRefreshToken();
      } catch (error) {
        console.error("새로운 토큰을 가져오는 데 실패했습니다:", error);
        return;
      }
    }

    // 새로 갱신된 토큰을 다시 가져옴
    const newAuthToken = getToken();

    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify({ title })], { type: "application/json" })
    );

    const contentBlob = new Blob([content], { type: "text/html" });
    formData.append("quillFile", contentBlob);

    try {
      const response = await fetch(`${AxiosURL}/community/admin-boards`, {
        method: "POST",
        headers: {
          Authorization: `${newAuthToken}`,
        },
        body: formData,
      });

      console.log("인증토큰", newAuthToken);
      if (response.ok) {
        console.log("글이 성공적으로 등록되었습니다.");

        // 글 등록 또는 수정 후에 최신 상태 반영
        if (initialContent !== null && initialContent !== undefined) {
          const updatedContent = content;
          onPublish(updatedContent);
        } else {
          onPublish(content);
        }

        // 에디터 닫기
        setVisible(false);
        onClose();

        // 페이지 새로 고침
        window.location.reload();
      } else {
        console.error("글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("글 등록 중 오류 발생:", error);
    }
  };

  return (
    <>
      <Overlay visible={visible} />
      <EditorContainer visible={visible}>
        <Title>글쓰기</Title>
        <MainTitle>
          <MainTitleInput
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </MainTitle>
        <QuillToolbar />
        <CustomReactQuill
          placeholder="이벤트 및 공지사항"
          theme="snow"
          ref={quillRef}
          value={content}
          onChange={handleChange}
          modules={modules}
        />
        <ButtonContainer>
          <CancelButton
            onClick={() => {
              setVisible(false);
              onClose();
            }}
          >
            취소
          </CancelButton>
          <StyledButton onClick={() => handleSubmit()}>
            {initialContent ? "글 수정" : "글 등록"}
          </StyledButton>
        </ButtonContainer>
      </EditorContainer>
    </>
  );
};

export default NoticeWriteQuill;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Overlay = ({ visible }: { visible: boolean }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 동작 막기
  };

  return <OverlayStyled visible={visible} onClick={handleOverlayClick} />;
};

const OverlayStyled = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
  animation: ${({ visible }) =>
    visible
      ? ""
      : css`
          ${fadeOut} 0.5s forwards
        `};
`;

const EditorContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 695px;
  padding: 15px 40px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 4;
  animation: ${({ visible }) =>
    visible
      ? ""
      : css`
          ${fadeOut} 0.5s forwards
        `};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: black;
`;

const MainTitle = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 10px;
`;

const MainTitleInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: "esamanru Medium";

  &::placeholder {
    color: #999;
  }
`;

const CustomReactQuill = styled(ReactQuill)`
  border-radius: 30px;
  height: 450px;
  margin-bottom: 20px;
  color: black;

  .ql-container {
    font-family: "esamanru Light", sans-serif;
  }

  .ql-toolbar {
    font-family: "esamanru Light", sans-serif;
  }

  .ql-editor {
    font-family: "esamanru Light", sans-serif;
  }

  .ql-font-esamanruLight {
    font-family: "esamanru Light";
  }

  .ql-font-esamanruMedium {
    font-family: "esamanru Medium";
  }

  .ql-font-esamanruBold {
    font-family: "esamanru Bold";
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 13px 0;
`;

const StyledButton = styled.button`
  background-color: #16be78;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #13a86a;
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: black;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #bbb;
  }
`;

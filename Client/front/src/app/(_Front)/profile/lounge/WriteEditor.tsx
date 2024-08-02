import React, { useRef, useState, useEffect, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import styled, { keyframes, css } from "styled-components";
import QuillToolbar from "./EditorOption";
import Quill from "quill";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";

const WriteQuill: React.FC<{
  onPublish: (content: string) => void;
  onClose: () => void;
  initialContent?: string;
}> = ({ onPublish, onClose, initialContent }) => {
  const quillRef = useRef<ReactQuill>(null);
  const [content, setContent] = useState<string>(initialContent || "");
  const [visible, setVisible] = useState<boolean>(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setId(hash.replace("#", ""));
    }
  }, []);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

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

  const authToken = getToken();

  const handleSubmit = async () => {
    if (content.trim() === "") {
      alert("내용을 입력해주세요");
      return;
    }

    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify({})], { type: "application/json" })
    );

    const contentBlob = new Blob([content], { type: "text/html" });
    formData.append("quillFile", contentBlob);

    try {
      const url = id
        ? `${AxiosURL}/profile/lounge/${id}`
        : `${AxiosURL}/profile/lounge`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert(
          method === "POST"
            ? "글이 성공적으로 등록되었습니다."
            : "글이 성공적으로 수정되었습니다."
        );

        onPublish(content);
        setVisible(false);
        onClose();
        window.location.href = "/profile/lounge";
      } else {
        alert("글이 성공적으로 등록되었습니다.");
        console.error("요청에 실패했습니다.");
        const errorData = await response.json();
        console.error("Error details:", errorData);
        window.location.reload();
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
      alert("글 등록 또는 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Overlay visible={visible} />
      <EditorContainer visible={visible}>
        <Title>라운지 Talk</Title>
        <QuillToolbar />
        <CustomReactQuill
          placeholder="여러분의 소식을 공유해보세요."
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
          <StyledButton onClick={handleSubmit}>
            {id ? "글 수정" : "글 등록"}
          </StyledButton>
        </ButtonContainer>
      </EditorContainer>
    </>
  );
};

export default WriteQuill;

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
  height: 645px;
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

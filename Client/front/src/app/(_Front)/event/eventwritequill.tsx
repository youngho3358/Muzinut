"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import styled, { keyframes, css } from "styled-components";
import QuillToolbar from "../profile/lounge/EditorOption";
import Quill from "quill";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";

const Font = Quill.import("formats/font");
Font.whitelist = ["esamanruLight", "esamanruMedium", "esamanruBold"];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["13px", "16px", "18px", "24px", "28px", "32px"];
Quill.register(Size, true);

interface EventWriteQuillProps {
  onPublish: (content: string) => void;
  onClose: () => void;
  initialContent?: string;
  boardId?: string;
}

const EventWriteQuill = forwardRef(
  (
    { onPublish, onClose, initialContent, boardId }: EventWriteQuillProps,
    ref
  ) => {
    const quillRef = useRef<ReactQuill>(null);
    const [content, setContent] = useState<string>(initialContent || "");
    const [title, setTitle] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(true);

    useImperativeHandle(ref, () => ({
      handleEditSubmit,
    }));

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
      if (title.trim() === "" || content.trim() === "") {
        alert("제목과 내용을 입력해 주세요");
        return;
      }

      const formData = new FormData();
      formData.append(
        "EventForms",
        new Blob([JSON.stringify({ title })], { type: "application/json" })
      );

      const contentBlob = new Blob([content], { type: "text/html" });
      formData.append("quillFile", contentBlob);

      try {
        const url = boardId
          ? `${AxiosURL}/community/event-boards/${boardId}`
          : `${AxiosURL}/community/event-boards`;
        const method = boardId ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `${authToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          alert("글이 성공적으로 등록되었습니다.");

          const updatedContent = content;
          onPublish(updatedContent);

          setVisible(false);
          onClose();

          window.location.reload();
        } else {
          console.error("글 등록 또는 수정에 실패했습니다.");
        }
      } catch (error) {
        alert("글이 성공적으로 등록되었습니다.");
        window.location.reload();
      }
    };

    const handleEditSubmit = () => {
      handleSubmit();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setVisible(false);
        onClose();
      }
    };

    return (
      <>
        <Overlay visible={visible} onClick={handleOverlayClick} />
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
            placeholder="이벤트, 공지사항 작성해주세요."
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
                window.location.reload();
              }}
            >
              취소
            </CancelButton>
            <StyledButton onClick={() => handleEditSubmit()}>
              {boardId ? "글 수정" : "글 등록"}
            </StyledButton>
          </ButtonContainer>
        </EditorContainer>
      </>
    );
  }
);

EventWriteQuill.displayName = "EventWriteQuill";

export default EventWriteQuill;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Overlay = ({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => {
  return <OverlayStyled visible={visible} onClick={onClick} />;
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

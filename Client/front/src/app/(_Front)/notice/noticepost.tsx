import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import AxiosURL from "@/app/axios/url";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/common/common";

interface Post {
  id: number;
  title: string;
  writer: string;
  createdDt: string;
  view: number;
  like: number;
}

interface NoticePostProps {
  selected: string;
  searchQuery: string;
}

const NoticePost: React.FC<NoticePostProps> = ({ selected, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [adminBoardsForms, setAdminBoardsForms] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const authToken = getToken();

  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${AxiosURL}/community/admin-boards`, {
        headers: {
          Authorization: `${authToken}`,
        },
        params: {
          page: page - 1, // API가 0부터 시작하는 페이지 번호를 사용하는 경우
          size: postsPerPage,
        },
      });

      const { adminBoardsForms, totalPage } = res.data;

      setAdminBoardsForms(adminBoardsForms || []);
      setTotalPages(totalPage || 1);

      console.log("totalPage:", totalPage);
      console.log("adminBoardsForms:", adminBoardsForms);
      console.log("res.data:", res.data);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, selected]);

  const sortPosts = (criterion: string, posts: Post[] | undefined): Post[] => {
    if (!posts || !Array.isArray(posts)) {
      return [];
    }

    switch (criterion) {
      case "인기순":
        return posts.slice().sort((a, b) => b.view - a.view);
      case "최신순":
        return posts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdDt).getTime() - new Date(a.createdDt).getTime()
          );
      case "좋아요순":
        return posts.slice().sort((a, b) => b.like - a.like);
      default:
        return posts;
    }
  };

  const filterPostsBySearchQuery = (posts: Post[], query: string): Post[] => {
    if (!query) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const sortedPosts = sortPosts(selected, adminBoardsForms);
  const filteredPosts = filterPostsBySearchQuery(sortedPosts, searchQuery);

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Container>
      <DarkBackground />
      <Content>
        <Header>
          <HeaderItem>제목</HeaderItem>
          <HeaderItem>작성자</HeaderItem>
          <HeaderItem>작성일</HeaderItem>
          <HeaderItem>조회수</HeaderItem>
          <HeaderItem>좋아요</HeaderItem>
        </Header>

        {isLoading ? (
          <LoadingMessage>로딩 중...</LoadingMessage>
        ) : adminBoardsForms.length === 0 ? (
          <NoDataMessage>공지사항이 없습니다!</NoDataMessage>
        ) : filteredPosts.length === 0 ? (
          <NoDataMessage>검색 결과가 없습니다!</NoDataMessage>
        ) : (
          filteredPosts.map((post) => (
            <Post
              key={post.id}
              onClick={() => router.push(`/notice/${post.id}`)}
            >
              <PostItem>{post.title}</PostItem>
              <PostItem>{post.writer}</PostItem>
              <PostItem>{post.createdDt}</PostItem>
              <PostItem>{post.view}</PostItem>
              <PostItem>{post.like}</PostItem>
            </Post>
          ))
        )}
        <PageNation>
          <PageButton onClick={() => handlePageClick(1)}>{"<<"}</PageButton>
          <PageButton onClick={handlePrevPage}>{"<"}</PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <PageButton
              key={number}
              onClick={() => handlePageClick(number)}
              isActive={number === currentPage}
            >
              {number}
            </PageButton>
          ))}
          <PageButton onClick={handleNextPage}>{">"}</PageButton>
          <PageButton onClick={() => handlePageClick(totalPages)}>
            {">>"}
          </PageButton>
        </PageNation>
      </Content>
    </Container>
  );
};

export default NoticePost;

const Container = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 20px;
`;

const DarkBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 12px;
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  padding: 10px 20px;
  height: 30px;
  border-bottom: 2px solid #ccc;
`;

const HeaderItem = styled.div`
  flex: 1;
  text-align: center;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Post = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf3;
  color: black;
  cursor: pointer;
`;

const PostItem = styled.div`
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-family: "esamanru Medium";
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PageNation = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  padding: 18px 0;
  border-radius: 12px;
  background-color: #fff;
`;

const PageButton = styled.div<{ isActive?: boolean }>`
  font-size: 14px;
  font-family: "esamanru Medium";
  margin: 0 5px;
  cursor: pointer;
  width: 20px;
  text-align: center;
  padding: 8.5px 7px;
  border-radius: 5px;
  background-color: ${({ isActive }) => (isActive ? "#ddd" : "#f1f1f1")};
  &:hover {
    background-color: #ddd;
  }
  color: black;
`;

// 로딩 메시지
const LoadingMessage = styled.div`
  padding: 40px 0 5px 0;
  text-align: center;
  font-size: 20px;
  color: #16be78;
`;

// 데이터 없음 메시지
const NoDataMessage = styled.div`
  padding: 40px 0 5px 0;
  text-align: center;
  font-size: 20px;
  color: #16be78;
`;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  writer: string;
  createdDt: string;
  view: number;
  like: number;
}

interface RecruitBoardsPostProps {
  selected: string;
}

const RecruitBoardsPost: React.FC<RecruitBoardsPostProps> = ({ selected }) => {
  const posts: Post[] = [];

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [sortedPosts, setSortedPosts] = useState<Post[]>(posts); // 초기값으로 모든 게시물을 포함한 상태를 설정
  // 데이터를 저장할 상태를 useState를 이용해 초기화
  const [getData, setgetData] = useState<Post[]>([]);

  // PostData 함수를 useEffect 내에서 호출하여 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/community/recruit-boards");
        setgetData(res.data); // 받아온 데이터를 상태에 업데이트
      } catch (error) {
        console.error("데이터를 불러오지 못했습니다", error);
      }
    };

    fetchData(); // useEffect 내에서 fetchData 함수를 호출하여 데이터를 가져옴
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 호출되도록 설정

  // 정렬 함수
  const sortPosts = (criterion: string): Post[] => {
    switch (criterion) {
      case "인기순":
        return [...posts].sort((a, b) => b.view - a.view);
      case "최신순":
        return [...posts].sort(
          (a, b) =>
            new Date(b.createdDt).getTime() - new Date(a.createdDt).getTime()
        );
      case "좋아요순":
        return [...posts].sort((a, b) => b.like - a.like);
      default:
        return posts;
    }
  };

  useEffect(() => {
    // 선택된 정렬 기준에 따라 게시물을 정렬하여 상태 업데이트
    const sorted = sortPosts(selected);
    setSortedPosts(sorted);
    setCurrentPage(1); // 페이지를 첫 번째 페이지로 초기화
  }, [selected]); // selected 값이 변경될 때마다 호출

  // 현재 페이지에 해당하는 게시글을 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 번호를 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedPosts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        {currentPosts.map((post) => (
          <Post key={post.id}>
            <PostItem>{post.title}</PostItem>
            <PostItem>{post.writer}</PostItem>
            <PostItem>{post.createdDt}</PostItem>
            <PostItem>{post.view}</PostItem>
            <PostItem>{post.like}</PostItem>
          </Post>
        ))}
        <PageNation>
          <PageButton onClick={() => setCurrentPage(1)}>{"<<"}</PageButton>
          {pageNumbers.map((number) => (
            <PageButton
              key={number}
              onClick={() => handlePageClick(number)}
              isActive={number === currentPage}
            >
              {number}
            </PageButton>
          ))}
          <PageButton onClick={() => setCurrentPage(pageNumbers.length)}>
            {">>"}
          </PageButton>
        </PageNation>
      </Content>
    </Container>
  );
};

export default RecruitBoardsPost;

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
`;

const Post = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf3;
  color: black;
`;

const PostItem = styled.div`
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-family: "esamanru Medium";
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

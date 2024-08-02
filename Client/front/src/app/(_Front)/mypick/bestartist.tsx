export const bestArtists = [
  {
    id: 1,
    name: "마냥",
    profileImage:
      "https://nng-phinf.pstatic.net/MjAyMzEyMTFfMTM3/MDAxNzAyMjgyNjI1MDgw.Ozu1fi3gdfyooyBjO_SGXJBDqRWgDFLlmWAFZg6qYIUg.rlnppQX9tMgn2nvgjhXwqsJhfktN23Gdjj09CgJ--BYg.JPEG/104.%EB%A7%88%EC%9D%B8%ED%81%AC%EB%9E%98%ED%94%84%ED%8A%B8_%EC%99%84%EC%84%B1%EB%B3%B8_%EC%9D%B4%EB%8B%AC%EB%8B%98.jpg",
    music: "그래도 나 사랑하지",
    votes: 100,
    voterate: 55,
  },
  {
    id: 2,
    name: "얼그레",
    profileImage:
      "https://ssl.pstatic.net/static/nng/glive/icon/category_poster_talk.png",
    music: "Brand New",
    votes: 200,
    voterate: 35,
  },
  {
    id: 3,
    name: "움츠키",
    profileImage:
      "https://nng-phinf.pstatic.net/MjAyMzEyMTNfNjQg/MDAxNzAyNDMxMTEyNDEz.2lPNjTnR3k_6Y9R9pLpEdIDRK_N07MRHXAXumlUu0esg.JuvDTkCSnR8-AtRg8oWpoRdyr77kAZnUOVXY_B264x0g.JPEG/393.%EB%8D%B0%EB%93%9C_%EB%B0%94%EC%9D%B4_%EB%8D%B0%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8_%EC%99%84%EC%84%B1%EB%B3%B8_%EC%84%9D%EC%A7%80%EC%97%B0.jpg",
    music: "Heaven",
    votes: 300,
    voterate: 15,
  },
];

interface Comment {
  comment: number;
}

export const commentNumber: Comment = {
  comment: 10,
};

interface CommentProps {
  id: number;
  name: string;
  profile: string;
  time: string;
  bodytext: string;
  like: number;
}

export const commentData: CommentProps[] = [
  {
    id: 1,
    name: "마냥",
    profile:
      "https://nng-phinf.pstatic.net/MjAyMzEyMTFfMTM3/MDAxNzAyMjgyNjI1MDgw.Ozu1fi3gdfyooyBjO_SGXJBDqRWgDFLlmWAFZg6qYIUg.rlnppQX9tMgn2nvgjhXwqsJhfktN23Gdjj09CgJ--BYg.JPEG/104.%EB%A7%88%EC%9D%B8%ED%81%AC%EB%9E%98%ED%94%84%ED%8A%B8_%EC%99%84%EC%84%B1%EB%B3%B8_%EC%9D%B4%EB%8B%AC%EB%8B%98.jpg",
    time: "3시간",
    bodytext: "안녕하세요 마냥님이 1등이라니 믿을 수가 없어요..",
    like: 3,
  },
  {
    id: 1,
    name: "마냥",
    profile:
      "https://nng-phinf.pstatic.net/MjAyMzEyMTFfMTM3/MDAxNzAyMjgyNjI1MDgw.Ozu1fi3gdfyooyBjO_SGXJBDqRWgDFLlmWAFZg6qYIUg.rlnppQX9tMgn2nvgjhXwqsJhfktN23Gdjj09CgJ--BYg.JPEG/104.%EB%A7%88%EC%9D%B8%ED%81%AC%EB%9E%98%ED%94%84%ED%8A%B8_%EC%99%84%EC%84%B1%EB%B3%B8_%EC%9D%B4%EB%8B%AC%EB%8B%98.jpg",
    time: "3시간",
    bodytext: "안녕하세요 마냥님이 1등이라니 믿을 수가 없어요..",
    like: 3,
  },
];

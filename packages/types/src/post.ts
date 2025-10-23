export interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
}


//-------------------------------------------------- //
// 유저페이지의 postTab 에 들어갈 타입
export interface UserTapComment {
  id: number;
  createdAt: string;
  updatedAt: string;
  postId: number;
  authorId: number;
  text: string;
}
export interface UserTapLike {
  userId: number;
  postId: number;
}
/** user page tab post type (posts === likes === saved) */
export interface UserTabPost {
  id: number;
  title: string;
  content: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  likes: UserTapLike[];
  comments: UserTapComment[];
}

//-------------------------------------------------- //
/** 메인페이지에 필요한 각 포스트의 타입 */
export interface PostForMainPage {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    nickname: string;
    email: string;
  };
  likes: {
    userId: number;
    postId: number;
  }[];
  comments: {
    createdAt: string;
    updatedAt: string;
    id: number;
    authorId: number;
    text: string;
    postId: number;
  }[];
}

//-------------------------------------------------- //
/** search page에 필요한 각 포스트의 타입 */
export interface PostForSearchPage {
  id: number;
  title: string;
  content: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    email: string;
  }
  likes: {
    userId: number;
    postId: number;
  }[];
  comments: {
    createdAt: string;
    updatedAt: string;
    id: number;
    authorId: number;
    text: string;
    postId: number;
  }[];
}

//-------------------------------------------------- //
export interface GetPostReturnLike {
  userId: number;
  postId: number;
}
export interface GetPostReturnComment {
  id: number;
  text: string;
  postId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    email: string;
  };
}

/** 포스트 상세페이지에 필요한 타입 */
export interface GetPostReturn {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    nickname: string;
    email: string;
  };
  comments: GetPostReturnComment[];
  likes: GetPostReturnLike[];
}

//-------------------------------------------------- //

// cretae new post
export interface CreatePostData {
  title: string;
  content?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

//-------------------------------------------------- //

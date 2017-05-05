const config = {
  api: {
    successCode: 1,
    account: {
      signin: `/api/login`,
      register: `/api/register`,
      signout: `/api/signout`
    },
    articles: {
      lists: page => `/api/articles/${page}`,
      current: id => `/api/article/${id}`,
      types: `/api/types/articles`
    }
  }
};

export default config
const config = {
  api: {
    successCode: 1,
    account: {
      signin: `/api/login`,
      register: `/api/register`,
      signout: `/api/signout`,
      checkout: `/api/checkout`
    },
    articles: {
      lists: page => `/api/articles/${page}`,
      current: id => `/api/article/${id}`,
      types: `/api/types/articles`,
      searchByTitle: (title, page) => `/api/search/title/${title}/${page}`,
      searchByType: (type, page) => `/api/search/type/${type}/${page}`,
      inside: page => `/api/inside/articles/${page}`
    }
  }
};

export default config
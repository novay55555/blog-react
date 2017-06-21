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
      types: `/api/articles/types`,
      searchByTitle: (title, page) => `/api/articles/search/title/${title}/${page}`,
      searchByType: (type, page) => `/api/articles/search/type/${type}/${page}`,
      inside: page => `/api/inside/articles/${page}`,
      insideSearchByTitle: (title, page) => `/api/inside/articles/search/title/${title}/${page}`,
      delete: id => `/api/inside/article/delete/${id}`,
      add: `/api/inside/article/publish`,
      edit: `/api/inside/article/update`
    },
    users: {
      lists: page => `/api/inside/users/${page}`,
      searchByName: (name, page) => `/api/inside/users/search/${name}/${page}`,
      edit: `/api/inside/user/edit`,
      delete: id => `/api/inside/user/delete/${id}`
    },
    blog: `/api/inside/blog`,
    admin: `/api/inside/admin`
  },
  apiErrMsg: '服务器大姨妈, 请稍后再试 =. ='
};

export default config;

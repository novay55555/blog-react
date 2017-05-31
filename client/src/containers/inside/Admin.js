import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Form from '../../components/inside/AdminForm'
import {fetchArticleTypes} from '../../actions/articles'
import {fetchUpdateBlog} from '../../actions/inside'

class Admin extends Component{
  componentWillMount(){
    const {username, types, dispatch} = this.props;
    // if(!username) dispatch();
    if(types.length === 0) dispatch(fetchArticleTypes());
  }

  handleSubmit = (adminData, typesData) => this.props.dispatch(fetchUpdateBlog(adminData, typesData));

  render(){
    const {username, types, typesIsFetching} = this.props;
    return(
      <Form account={username} email={'blala'} types={types} isFetching={typesIsFetching} onSubmit={this.handleSubmit} />
    )
  }
}

const mapStateToProps = state => {
  const {username} = state.account;
  const {items: types, isFetching: typesIsFetching} = state.articles.types;
  return {
    username,
    types: types.map(type => type.text),
    typesIsFetching
  };
};

export default connect(mapStateToProps)(Admin)
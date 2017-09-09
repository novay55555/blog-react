import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from '../../components/common/Container';
import Author from '../../components/articles/Author';
import articlesCss from '../../components/articles/articles.css';
import { fetchAdmin } from '../../actions/account';

class Article extends Component {
  componentWillMount () {
    !this.props.name && this.props.dispatch(fetchAdmin());
  }

  render () {
    const { photo, name, job, intro, errMsg, isFetching } = this.props;
    return (
      <Container className={articlesCss.container} isFluid>
        <div className='col-lg-2 col-sm-3'>
          <Author
            photo={photo}
            name={name}
            job={job}
            intro={intro}
            isFetching={isFetching}
            errMsg={errMsg}
          />
        </div>
        <div className='col-lg-10 col-sm-9'>
          {this.props.children}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { photo, name, job, intro, errMsg, isFetching } = state.account.admin;
  return {
    photo,
    name,
    job,
    intro,
    isFetching,
    errMsg
  };
};

export default connect(mapStateToProps)(Article);

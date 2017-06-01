import React, { Component } from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import { dateFormatter, querySelectors } from '../../lib/common'
import insideCss from './inside.css'
import { loadMarkdownEditor } from '../../actions/inside'

export default class ArticleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: null,
      title: '',
      author: props.author || '',
      date: dateFormatter(Date.now()),
      articleType: '',
      description: '',
      content: '',
      titleValidator: null,
      authorValidator: null,
      dateValidator: null,
      descriptionValidator: null,
      contentValidator: null,
      currentTypeIndex: 0
    };
  }

  componentWillReceiveProps(nextState) {
    if (nextState.mode === 'edit') return this.setState(nextState.article);
    if (nextState.mode === 'add' && !this.props.author) return this.setState({ author: nextState.author })
  }

  componentDidMount() {
    loadMarkdownEditor().done(() => {
      $(this.state.element).find('#markdownEditor').removeAttr('readonly').attr('spellcheck', false).markdown({
        onPreview: function(e) {
          setTimeout(() => querySelectors('pre code').forEach(block => hljs.highlightBlock(block)), 50); // TODO: onPreview钩子是没插入到DOM的, hljs没办法高亮, 目前延迟解决该问题
          return marked(e.getContent() || 'You should write something to preiview, right?');
        }
      });
    })
  }

  handleSubmit = () => {
    const {
      title,
      author,
      date,
      description,
      articleType,
      content,
      titleValidator,
      authorValidator,
      dateValidator,
      descriptionValidator,
      contentValidator
    } = this.state;
    const titlePass = titleValidator.start();
    const authorPass = authorValidator.start();
    const datePass = dateValidator.start();
    const descriptionPass = descriptionValidator.start();
    const contentPass = contentValidator.start();
    if (titlePass && authorPass && datePass && descriptionPass && contentPass) {
      let submitData = {
        title,
        author,
        date,
        description,
        articleType,
        content
      };
      if (this.state.id) submitData.id = this.state.id;
      this.props.onSubmit(submitData);
    }
  };

  handleTypeChange = (articleType, currentTypeIndex) => this.setState({ articleType, currentTypeIndex });

  render() {
    const { title, author, date, description, content, currentTypeIndex, articleType } = this.state;
    const { onSubmit, articleTypes, isFetching, isUpdating, mode } = this.props;
    return (
      <form ref={ref => this.state.element = ref}
        className={`form ${insideCss.articleForm}`}
        onSubmit={e => e.preventDefault()}>
        {
          isFetching ? <div className="loading"></div> : ''
        }
        <Input
          label='文章标题'
          placeholder='请输入文章标题'
          validates={[{
            rule: 'isNotEmpty',
            errMsg: '文章标题不能为空'
          }]}
          value={title}
          getValidator={titleValidator => this.setState({ titleValidator })}
          onChange={title => this.setState({ title })} />
        <Input
          label='作者'
          placeholder='请输入作者'
          validates={[{
            rule: 'isNotEmpty',
            errMsg: '作者不能为空'
          }]}
          value={author}
          getValidator={authorValidator => this.setState({ authorValidator })}
          onChange={author => this.setState({ author })} />
        <Input
          label='时间'
          placeholder='请选择时间'
          validates={[{
            rule: 'isNotEmpty',
            errMsg: '时间不能为空'
          }]}
          value={date}
          getValidator={dateValidator => this.setState({ dateValidator })}
          onChange={date => this.setState({ date })} />
        <Input
          label='文章描述'
          placeholder='请输入文章描述'
          validates={[{
            rule: 'isNotEmpty',
            errMsg: '文章描述不能为空'
          }]}
          value={description}
          getValidator={descriptionValidator => this.setState({ descriptionValidator })}
          onChange={description => this.setState({ description })} />
        <div className="form-group articles-type">
          <label htmlFor="">文章类型</label>
          <p>
            {
              articleTypes.length > 0 ?
                (mode === 'add' ?
                  articleTypes.map((type, i) => <button key={i}
                    className={`btn ${i === currentTypeIndex ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => this.handleTypeChange(type.text, i)}>{type.text}</button>) :
                  articleTypes.map((type, i) => <button key={i}
                    className={`btn ${articleType === type.text ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => this.handleTypeChange(type.text, i)}>{type.text}</button>))
                : ''
            }
          </p>
        </div>
        <Textarea
          id='markdownEditor'
          label='文章内容'
          placeholder='Write something...'
          readOnly='readonly'
          value={content}
          validates={[{
            rule: 'isNotEmpty',
            errMsg: '文章内容不能为空'
          }]}
          onChange={content => this.setState({ content })}
          getValidator={contentValidator => this.setState({ contentValidator })} />
        <div className="form-group">
          <button
            className='btn btn-info'
            onClick={this.handleSubmit}
            style={isUpdating ? { opacity: .5, pointerEvents: 'none' } : {}}>
            {isUpdating ? 'Submitting...' : 'Submit!'}</button>
        </div>
      </form>
    )
  }
}

ArticleForm.PropTypes = {
  articleTypes: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired
};
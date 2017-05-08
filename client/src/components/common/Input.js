import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: null,
      validator: {},
      status: '',
      errMsg: '',
      rules: {
        isNotEmpty: (value, errMsg) => {
          if (value.trim() === '') return errMsg;
        },
        minLength: (value, length, errMsg) => {
          if (value.length < length) return errMsg;
        },
        maxLength: (value, length, errMsg) => {
          if (value.length > length) return errMsg;
        },
        isEmail: (value, errMsg) => {
          if (!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) return errMsg;
        }
      }
    };
  }

  componentDidMount() {
    if (this.props.validates) {
      this.initValidator(this.props.validates);
      this.props.getValidator && this.props.getValidator.call(this.props.getValidator, this.state.validator);
    }
  }

  initValidator = validates => {
    const self = this;
    const { validator } = this.state;
    const _cache = [];
    validates.forEach(validate => {
      _cache.push(() => {
        let input = self.state.element,
          args = validate.rule.split(':'),
          validateRule = args.shift();
        args.push(validate.errMsg);
        args.unshift(input.value);
        return self.state.rules[validateRule].apply(input, args);
      });
    });
    validator.start = () => {
      for (let i = 0, validateFn; validateFn = _cache[i++];) {
        let errMsg = validateFn();
        if (errMsg) {
          self.setState({
            status: 'has-error',
            errMsg
          });
          return false;
        } else {
          self.setState({ status: '' });
        }
      }
      return true;
    };
  };

  change = e => this.props.onChange && this.props.onChange.call(this.props.onChange, e.target.value, this.state.validator.start());

  render() {
    const { status, errMsg } = this.state;
    const { className, label, name, validates, onChange, getValidator, ...props } = this.props;
    return (
      <div className={`form-group ${className || ''} ${status}`}>
        <label className="control-label" htmlFor={name}>{status === 'has-error' ? errMsg : label}</label>
        <input
          ref={input => this.state.element = input}
          className="form-control"
          name={name}
          onChange={this.change}
          {...props}
        />
      </div>
    )
  }
}

Input.PropTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  validates: PropTypes.arrayOf({
    rule: PropTypes.string.isRequired,
    errMsg: PropTypes.string.isRequired
  }),
  getValidator: PropTypes.func
};
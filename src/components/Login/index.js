import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import {
  LoginBgContainer,
  FormContainer,
  InputContainer,
  LoginLogoImage,
  LabelInput,
  UserInput,
  CheckboxContainer,
  CheckboxInput,
  ShowPasswordLabel,
  LoginButton,
  SubmitError,
} from './styledComponents'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    showPassword: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expiry: 30})

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <LabelInput htmlFor="username">USERNAME</LabelInput>
        <UserInput
          type="text"
          id="username"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {showPassword, password} = this.state
    const passwordType = showPassword ? 'text' : 'password'
    return (
      <>
        <LabelInput htmlFor="password">PASSWORD</LabelInput>
        <UserInput
          type={passwordType}
          id="password"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
        <CheckboxContainer>
          <CheckboxInput
            type="checkbox"
            id="checkbox"
            onChange={this.onClickShowPassword}
          />
          <ShowPasswordLabel htmlFor="checkbox">
            Show Password
          </ShowPasswordLabel>
        </CheckboxContainer>
      </>
    )
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <LoginBgContainer>
        <FormContainer onSubmit={this.onSubmitForm}>
          <LoginLogoImage
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
          />
          <InputContainer>{this.renderUsernameField()}</InputContainer>
          <InputContainer>{this.renderPasswordField()}</InputContainer>
          <LoginButton type="submit">Login</LoginButton>
          {showErrorMsg && <SubmitError>*{errorMsg}</SubmitError>}
        </FormContainer>
      </LoginBgContainer>
    )
  }
}
export default Login

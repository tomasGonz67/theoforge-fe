import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthForm } from "../components/AuthForm";
import { AuthProvider } from '../App';
import axios, { AxiosError, AxiosResponse } from 'axios';
jest.mock('axios');
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));
interface AuthFormType {
  type: 'login' | 'register';
}
function renderAuthForm(authType: AuthFormType) {
  if (authType.type === 'login') render(<AuthForm type='login'></AuthForm>);
  else if (authType.type === 'register') render(<AuthForm type='register'></AuthForm>);
  else throw Error;
}
async function validateForm(authType: AuthFormType) {
  jest.clearAllMocks();
  render(<AuthProvider><AuthForm type={authType.type}></AuthForm></AuthProvider>);
  // MUI input element's text is in a separate label element, so query by placeholder
  const emailInput = screen.getByPlaceholderText('your@email.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  let submitButton;
  if (authType.type === 'login' ) submitButton = screen.getByRole('button', {name: 'Login'});
  if (authType.type === 'register') submitButton = screen.getByRole('button', {name: 'Register'});
  // input element of type email and password have a default error message
  // on default error message: does not submit form and sends no alert
  if(submitButton) {
    // all fields must be filled out by default
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // checks for @ in email by default
    fireEvent.change(emailInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    const firstNameInput = screen.queryByPlaceholderText('John');
    const lastNameInput = screen.queryByPlaceholderText('Doe');
    const nicknameInput = screen.queryByPlaceholderText('johndoe');
    if (authType.type === 'register' && firstNameInput && lastNameInput && nicknameInput) {
      fireEvent.change(firstNameInput, { target: { value: 'test' } });
      fireEvent.change(lastNameInput, { target: { value: 'test' } });
      fireEvent.change(nicknameInput, { target: { value: 'test' } });
    }
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // character must come before @ by default
    fireEvent.change(emailInput, { target: { value: '@test' } });
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // character must come after @ by default
    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // section between @ and . must be under 64 characters by default
    fireEvent.change(emailInput, { target: { value: 'test@'.concat('a'.repeat(64), '.com') } });
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // section after final . must be under 64 characters by default
    fireEvent.change(emailInput, { target: { value: 'test@'.concat('test', 'a'.repeat(64)) } });
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
    // part of email before @ must not contain ()[]\:;"<>, by default
    let chars = '()[]\\:;"<>,';
    for (let i = 0; i < chars.length; i++) {
      fireEvent.change(emailInput, { target: { value: chars[i].concat('@test.com') } });
      fireEvent.click(submitButton);
      expect(screen.queryByRole('alert')).toBeNull();
    }
    // part of email before @ must not contain #$%^&*()_+={}[]|\\:;"\'<,>?/~` by default
    chars = '#$%^&*()_+={}[]|\\:;"\'<,>?/~`';
    for (let i = 0; i < chars.length; i++) {
      fireEvent.change(emailInput, { target: { value: 'test'.concat('@test.', chars[i]) } });
      fireEvent.click(submitButton);
      expect(screen.queryByRole('alert')).toBeNull();
    }
    // email must contain a . followed by domain name
    fireEvent.change(emailInput, { target: { value: 'test@test' } });
    fireEvent.click(submitButton);
    expect(screen.queryByRole('alert')).not.toBeNull();
    expect(screen.queryByText('Invalid email')).not.toBeNull();
    // email does not contain special characters
    // change error message (to invalid password) each time to check if it changes back to invalid email instead of rerendering entire page
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(submitButton);
    fireEvent.change(emailInput, { target: { value: '!@a-a.com' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid email')).not.toBeNull();
    // email domain must be at least 2 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(submitButton);
    fireEvent.change(emailInput, { target: { value: 'test@test.c' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid email')).not.toBeNull();
    // email username section must not be over 64 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(submitButton);
    fireEvent.change(emailInput, { target: { value: 'a'.repeat(65).concat('@test.com') } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid email')).not.toBeNull();
    // password must be at least 8 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must be at least 8 characters')).not.toBeNull();
    // password must contain an uppercase letter
    fireEvent.change(passwordInput, { target: { value: 'test1234' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must contain at least 1 uppercase character')).not.toBeNull();
    // password must contain a special character
    fireEvent.change(passwordInput, { target: { value: 'Test1234' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must contain at least 1 special character')).not.toBeNull();
    // no invalid characters " or / for sql injection
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1"234!' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid character " or \\ used')).not.toBeNull();
    fireEvent.change(passwordInput, { target: { value: 't' } });
    fireEvent.click(submitButton); // reset error message
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test\\1234!' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid character " or \\ used')).not.toBeNull();
    // set valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
    if(authType.type === 'login') {
      // displays a message when using invalid credentials
      const response: AxiosResponse = {
        data: {detail: '400: Invalid username/password'},
        status: 500,
      } as AxiosResponse;
      const axiosError = {
        config: {},
        request: {},
        response: response} as AxiosError;
      (axios.post as jest.MockedFunction<typeof axios.get>).mockImplementationOnce(() => Promise.reject(axiosError));
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Invalid credentials')).toBeInTheDocument();
      });
      jest.clearAllMocks();
      // navigates to the dashboard when using valid credentials
      // mock from src/__mocks__/axios.js returns success
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
      });
    }
    if(authType.type === 'register') {
      // validate firstName, lastName, and nickname fields
      if (firstNameInput && lastNameInput && nicknameInput) {
        // nickname must be at least 3 characters
        fireEvent.change(nicknameInput, { target: { value: 't' } });
        fireEvent.click(submitButton);
        expect(screen.queryByText('Nickname must be at least 3 characters')).not.toBeNull();
        // nickname may not include special characters
        fireEvent.change(nicknameInput, { target: { value: 'test!' } });
        fireEvent.click(submitButton);
        expect(screen.queryByText('Nickname may not include special characters')).not.toBeNull();
        // first name must not be more than 100 characters
        fireEvent.change(nicknameInput, { target: { value: 'test' } });
        fireEvent.change(firstNameInput, {target: {value: 'a'.repeat(101)}});
        fireEvent.click(submitButton);
        expect(screen.queryByText('First name must not be more than 100 characters')).not.toBeNull();
        // last name must not be more than 100 characters
        fireEvent.change(firstNameInput, { target: { value: 'test' } });
        fireEvent.change(lastNameInput, {target: {value: 'a'.repeat(101)}});
        fireEvent.click(submitButton);
        expect(screen.queryByText('Last name must not be more than 100 characters')).not.toBeNull();
        // nickname must not be more than 50 characters
        fireEvent.change(lastNameInput, {target: {value: 'test'}});
        fireEvent.change(nicknameInput, { target: { value: 'a'.repeat(51) } });
        fireEvent.click(submitButton);
        expect(screen.queryByText('Nickname must not be more than 50 characters')).not.toBeNull();
        // set valid nickname for next tests
        fireEvent.change(nicknameInput, { target: { value: 'test' } });
      }
      // display a message if the email is already taken
      let axiosError = {
        config: {},
        request: {},
        response: {
          data: {detail: '400: Email already exists'},
          status: 500,
        } as AxiosResponse
      } as AxiosError;
      (axios.post as jest.MockedFunction<typeof axios.get>).mockImplementationOnce(() => Promise.reject(axiosError));
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Email already taken')).toBeInTheDocument();
      });
      jest.clearAllMocks();
      // display a message if the nickname is already taken
      axiosError = {
        config: {},
        request: {},
        response: {
          data: {detail: '(sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) \
            <class \'asyncpg.exceptions.UniqueViolationError\'>: duplicate \
            key value violates unique constraint "ix_users_nickname"\
            DETAIL:  Key (nickname)=(test) already exists.'},
            status: 500,
          } as AxiosResponse
      } as AxiosError;
      (axios.post as jest.MockedFunction<typeof axios.get>).mockImplementationOnce(() => Promise.reject(axiosError));
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Nickname already taken')).toBeInTheDocument();
      });
      jest.clearAllMocks();
      // navigates to the dashboard if a valid account is created
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
      });
    }
  } else fail('Invalid authentication form type');
}

describe('When rendering login page', () => {
  it('displays appropriate text', () => {
    renderAuthForm({type: 'login'});
    expect(screen.getByText('Back to home')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.queryByText('Create Account')).toBeNull();
    expect(screen.queryByText('Sign in to your account')).not.toBeNull();
    expect(screen.queryByText('Join Theoforge today')).toBeNull();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.queryByText("Already have an account?")).toBeNull();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
  it('renders the form properly', () => {
    renderAuthForm({type: 'login'});
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.queryByText('First Name')).toBeNull();
    expect(screen.queryByPlaceholderText('John')).toBeNull();
    expect(screen.queryByText('Last Name')).toBeNull();
    expect(screen.queryByPlaceholderText('Doe')).toBeNull();
    expect(screen.queryByText('Nickname')).toBeNull();
    expect(screen.queryByPlaceholderText('johndoe')).toBeNull();
    const registerButton = screen.queryByRole('button', {name: 'Register'});
    const loginButton = screen.queryByRole('button', {name: 'Login'});
    expect(registerButton).toBeNull();
    expect(loginButton).not.toBeNull();
  });
  it('contains links to the home page and registration page', () => {
    renderAuthForm({type: 'login'});
    mockUseNavigate.mockReset();
    // The first button should be the home page button
    const homePageButton = screen.getAllByRole('button');
    expect(homePageButton[0]).toBeDefined();
    expect(mockUseNavigate).not.toHaveBeenCalled();
    fireEvent.click(homePageButton[0]);
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
    // There should be a link to the registration page
    const signInButton = screen.queryByRole('button', {name: 'Sign In'});
    const signUpButton = screen.queryByRole('button', {name: 'Sign Up'});
    expect(signInButton).toBeNull();
    expect(signUpButton).not.toBeNull();
    if (signUpButton) {
      fireEvent.click(signUpButton);
      expect(mockUseNavigate).toHaveBeenCalledWith('/register');
    }
  });
  it('validates the email and password', async () => {
    await validateForm({type: 'login'});
  });
});

describe('When rendering registration page', () => {
  it('displays appropriate text', () => {
    renderAuthForm({type: 'register'});
    expect(screen.getByText('Back to home')).toBeInTheDocument();
    expect(screen.queryByText('Welcome Back')).toBeNull();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.queryByText('Sign in to your account')).toBeNull();
    expect(screen.queryByText('Join Theoforge today')).not.toBeNull();
    expect(screen.queryByText('Or continue with')).toBeNull();
    expect(screen.getByText("Already have an account?")).toBeDefined();
    expect(screen.queryByText("Don't have an account?")).toBeNull();
  });
  it('renders the form properly', () => {
    renderAuthForm({type: 'register'});
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.queryByText('First Name')).not.toBeNull();
    expect(screen.queryByPlaceholderText('John')).not.toBeNull();
    expect(screen.queryByText('Last Name')).not.toBeNull();
    expect(screen.queryByPlaceholderText('Doe')).not.toBeNull();
    expect(screen.queryByText('Nickname')).not.toBeNull();
    expect(screen.queryByPlaceholderText('johndoe')).not.toBeNull();
    const registerButton = screen.queryByRole('button', {name: 'Register'});
    const loginButton = screen.queryByRole('button', {name: 'Login'});
    expect(registerButton).not.toBeNull();
    expect(loginButton).toBeNull();
  });
  it('contains links to the home page and registration page', () => {
    renderAuthForm({type: 'register'})
    mockUseNavigate.mockReset();
    // The first button should be the home page button
    const homePageButton = screen.getAllByRole('button');
    expect(homePageButton[0]).toBeDefined();
    expect(mockUseNavigate).not.toHaveBeenCalled();
    fireEvent.click(homePageButton[0]);
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
    // There should be a link to the registration page
    const signInButton = screen.queryByRole('button', {name: 'Sign In'});
    const signUpButton = screen.queryByRole('button', {name: 'Sign Up'});
    expect(signInButton).not.toBeNull();
    expect(signUpButton).toBeNull();
    if (signInButton) {
      fireEvent.click(signInButton);
      expect(mockUseNavigate).toHaveBeenCalledWith('/login');
    }
  });
  it('validates the email and password', async () => {
    await validateForm({type: 'register'});
  });
});
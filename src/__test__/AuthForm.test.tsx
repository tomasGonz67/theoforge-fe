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
    fireEvent.click(submitButton);
    let errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    // checks for @ in email by default
    fireEvent.change(emailInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    // character must come before @ by default
    fireEvent.change(emailInput, { target: { value: '@test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    // character must come after @ by default
    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();
    // email must contain a . followed by domain name
    fireEvent.change(emailInput, { target: { value: 'test@test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Invalid email');
    expect(errorMessage).toBeInTheDocument();
    // email does not contain special characters
    fireEvent.change(emailInput, { target: { value: '!#@$%.^&' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Invalid email');
    expect(errorMessage).toBeInTheDocument();
    // email domain must be at least 2 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.c' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Invalid email');
    expect(errorMessage).toBeInTheDocument();
    // password must be at least 8 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    // password must contain an uppercase letter
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test1234' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Password must contain at least 1 uppercase character');
    // password must contain a special character
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Password must contain at least 1 special character');
    expect(errorMessage).toBeInTheDocument();
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
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test12345!' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Invalid credentials')).toBeInTheDocument();
      });
      jest.clearAllMocks();
      // navigates to the dashboard when using valid credentials
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
      });
    }
    if(authType.type === 'register') {
      // display a message if the email is already taken
      const response: AxiosResponse = {
        data: {detail: '400: Email already exists'},
        status: 500,
      } as AxiosResponse;
      const axiosError = {
        config: {},
        request: {},
        response: response} as AxiosError;
      (axios.post as jest.MockedFunction<typeof axios.get>).mockImplementationOnce(() => Promise.reject(axiosError));
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Email already taken')).toBeInTheDocument();
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
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.queryByText('Create Account')).toBeNull();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.queryByText("Already have an account?")).toBeNull();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
  it('renders the form properly', () => {
    renderAuthForm({type: 'login'});
    const emailInput = screen.getByText('Email Address');
    const passwordInput = screen.getByText('Password');
    const registerButton = screen.queryByRole('button', {name: 'Register'});
    const loginButton = screen.queryByRole('button', {name: 'Login'});
    const guestButton = screen.queryByRole('button', {name: 'Guest Account'});
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(registerButton).toBeNull();
    expect(loginButton).not.toBeNull();
    expect(guestButton).not.toBeNull();
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
    expect(screen.queryByText('Or continue with')).toBeNull();
    expect(screen.getByText("Already have an account?")).toBeDefined();
    expect(screen.queryByText("Don't have an account?")).toBeNull();
  });
  it('renders the form properly', () => {
    renderAuthForm({type: 'register'});
    const emailInput = screen.getByText('Email Address');
    const passwordInput = screen.getByText('Password');
    const registerButton = screen.queryByRole('button', {name: 'Register'});
    const loginButton = screen.queryByRole('button', {name: 'Login'});
    const guestButton = screen.queryByRole('button', {name: 'Guest Account'});
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(registerButton).not.toBeNull();
    expect(loginButton).toBeNull();
    expect(guestButton).toBeNull();
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
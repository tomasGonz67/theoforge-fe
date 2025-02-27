import '@testing-library/jest-dom'
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react"
import { AuthForm } from "../components/AuthForm"
const mockUseNavigate = jest.fn()
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));
interface AuthFormType {
  type: 'login' | 'register'
}
function renderAuthForm(authType: AuthFormType) {
  if (authType.type === 'login') render(<AuthForm type='login'></AuthForm>);
  else if (authType.type === 'register') render(<AuthForm type='register'></AuthForm>)
  else throw Error;
}
function validateForm(authType: AuthFormType) {
  renderAuthForm({type: authType.type})
  // MUI input element's text is in a separate label element, so query by placeholder
  const emailInput = screen.getByPlaceholderText('Enter your email');
  const passwordInput = screen.getByPlaceholderText('Enter your password');
  let submitButton;
  if (authType.type === 'login' ) submitButton = screen.getByRole('button', {name: /Sign In/});
  if (authType.type === 'register') submitButton = screen.getByRole('button', {name: /Sign Up/});
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
    fireEvent.change(emailInput, { target: { value: 'test@test.t' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Invalid email');
    expect(errorMessage).toBeInTheDocument();
    // password must be at least 8 characters
    fireEvent.change(emailInput, { target: { value: 'test@test.test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    errorMessage = screen.queryByText('Password must be at least 8 characters');
    expect(errorMessage).toBeInTheDocument();
    if(authType.type === 'login') {
      // remove this once backend is implemented
      // invalid credentials if not test account
      // email: test@test.com
      // password: test123
      fireEvent.change(emailInput, { target: { value: 'test@test.test' } });
      fireEvent.change(passwordInput, { target: { value: 'testtest' } });
      fireEvent.click(submitButton);
      errorMessage = screen.queryByText('Invalid credentials');
      expect(errorMessage).toBeInTheDocument();
    }
    if(authType.type === 'register') {
      // remove this once backend is implemented
      // invalid credentials if not test account
      // email: test@test.com
      // password: test123
      fireEvent.change(emailInput, { target: { value: 'test@test.test' } });
      fireEvent.change(passwordInput, { target: { value: 'testtest' } });
      fireEvent.click(submitButton);
      errorMessage = screen.queryByText('Registration is currently disabled. Please use test@test.com / test123');
      expect(errorMessage).toBeInTheDocument();
    }
  } else fail('Invalid authentication form type')
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
    const createAccountButton = screen.queryByRole('button', {name: /Sign Up/});
    const signInButton = screen.queryByRole('button', {name: /Sign In/});
    const guestButton = screen.queryByRole('button', {name: /Guest Account/});
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(createAccountButton).toBeNull();
    expect(signInButton).not.toBeNull();
    expect(guestButton).not.toBeNull();
  });
  it('contains links to the home page and registration page', () => {
    renderAuthForm({type: 'login'})
    mockUseNavigate.mockReset();
    // The first button should be the home page button
    const homePageButton = screen.getAllByRole('button');
    expect(homePageButton[0]).toBeDefined();
    expect(mockUseNavigate).not.toHaveBeenCalled();
    fireEvent.click(homePageButton[0]);
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
    // There should be a link to the registration page
    const signUpLink = screen.getByText('Sign Up');
    expect(signUpLink).toBeDefined();
    fireEvent.click(signUpLink);
    expect(mockUseNavigate).toHaveBeenCalledWith('/register');
  });
  it('validates the email and password', () => {
    validateForm({type: 'login'});
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
    const createAccountButton = screen.queryByRole('button', {name: /Sign Up/});
    const signInButton = screen.queryByRole('button', {name: /Sign In/});
    const guestButton = screen.queryByRole('button', {name: /Guest Account/});
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(createAccountButton).not.toBeNull();
    expect(signInButton).toBeNull();
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
    const signInLink = screen.getByText('Sign In');
    expect(signInLink).toBeDefined();
    fireEvent.click(signInLink);
    expect(mockUseNavigate).toHaveBeenCalledWith('/login');
  });
  it('validates the email and password', () => {
    validateForm({type: 'register'});
  });
});
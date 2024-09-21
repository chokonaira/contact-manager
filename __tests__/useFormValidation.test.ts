import { render, act } from '@testing-library/react';
import { useFormValidation, Contact } from '../hooks/useFormValidation';
import { Alert } from 'react-native';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useFormValidation', () => {
  const contact: Contact = {
    id: '123',
    name: 'John Doe',
    phone: '1234567890',
    email: 'johndoe@example.com',
    photo: 'photo.jpg',
  };

  const mockSubmit = vi.fn();
  const mockClose = vi.fn();

  beforeEach(() => {
    mockSubmit.mockReset();
    mockClose.mockReset();
  });

  it('should initialize form with contact when editing', () => {
    const { result } = render(() => useFormValidation(contact, true));

    expect(result.current.name).toBe(contact.name);
    expect(result.current.phone).toBe(contact.phone);
    expect(result.current.email).toBe(contact.email);
    expect(result.current.photo).toBe(contact.photo);
  });

  it('should reset form when not editing', () => {
    const { result } = render(() => useFormValidation(contact, false));

    expect(result.current.name).toBe('');
    expect(result.current.phone).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.photo).toBe(null);
  });

  it('should validate and set error for empty name', () => {
    const { result } = render(() => useFormValidation(null, false));

    act(() => {
      result.current.handleNameChange('');
    });

    expect(result.current.nameError).toBe('Name is required');
  });

  it('should clear name error for valid input', () => {
    const { result } = render(() => useFormValidation(null, false));

    act(() => {
      result.current.handleNameChange('John Doe');
    });

    expect(result.current.nameError).toBe('');
  });


  it('should validate and set error for invalid email', () => {
    const { result } = render(() => useFormValidation(null, false));

    act(() => {
      result.current.handleEmailChange('invalid-email');
    });

    expect(result.current.emailError).toBe('Invalid email format');
  });

  it('should clear email error for valid email', () => {
    const { result } = render(() => useFormValidation(null, false));

    act(() => {
      result.current.handleEmailChange('johndoe@example.com');
    });

    expect(result.current.emailError).toBe('');
  });

  it('should show alert and prevent submit if required fields are missing', () => {
    const alertSpy = vi.spyOn(Alert, 'alert');

    const { result } = render(() => useFormValidation(null, false));

    act(() => {
      result.current.handleSubmit(mockSubmit, mockClose);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Validation Error',
      'Name and phone number are required.'
    );
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should show alert if email is invalid during submission', () => {
    const alertSpy = vi.spyOn(Alert, 'alert');

    const { result } = render(() => useFormValidation({ ...contact, email: 'invalid-email' }, true));

    act(() => {
      result.current.handleSubmit(mockSubmit, mockClose);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Validation Error',
      'Please enter a valid email address.'
    );
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should submit form and close after submission', async () => {
    const { result } = render(() => useFormValidation(contact, true));

    act(() => {
      result.current.handleSubmit(mockSubmit, mockClose);
    });

    expect(result.current.isLoading).toBe(true);

    // Wait for the timeout in the submit function
    await new Promise((resolve) => setTimeout(resolve, 900));

    expect(result.current.isLoading).toBe(false);
    expect(mockSubmit).toHaveBeenCalledWith(contact);
    expect(mockClose).toHaveBeenCalled();
  });
});
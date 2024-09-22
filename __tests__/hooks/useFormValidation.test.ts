import { renderHook, act } from "@testing-library/react-native";
import { useFormValidation, Contact } from "../../hooks/useFormValidation";
import { Alert } from "react-native";

jest.spyOn(Alert, 'alert');

describe("useFormValidation hook", () => {
  const mockContact: Contact = {
    id: "1",
    name: "John Doe",
    phone: "123456789",
    email: "john@example.com",
    photo: "photo-url",
  };

  const onSubmitMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    onSubmitMock.mockClear();
    onCloseMock.mockClear();
  });

  it("should initialize with empty fields when not editing", () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    expect(result.current.name).toBe("");
    expect(result.current.phone).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.photo).toBe(undefined);
  });

  it("should initialize with contact values when editing", () => {
    const { result } = renderHook(() => useFormValidation(mockContact, true));

    expect(result.current.name).toBe(mockContact.name);
    expect(result.current.phone).toBe(mockContact.phone);
    expect(result.current.email).toBe(mockContact.email);
    expect(result.current.photo).toBe(mockContact.photo);
  });

  it("should update name and clear name error on valid input", () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    act(() => {
      result.current.handleNameChange("Alice");
    });

    expect(result.current.name).toBe("Alice");
    expect(result.current.nameError).toBe("");
  });

  it("should clean phone input and update state", () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    act(() => {
      result.current.handlePhoneChange("123-abc-456");
    });

    expect(result.current.phone).toBe("123456");
  });

  it("should update email and clear email error on valid email", () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    act(() => {
      result.current.handleEmailChange("alice@example.com");
    });

    expect(result.current.email).toBe("alice@example.com");
    expect(result.current.emailError).toBe("");
  });

  it("should display alert when submitting with empty name or phone", async () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    act(() => {
      result.current.handleSubmit(onSubmitMock, onCloseMock);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation Error",
      "Name and phone number are required."
    );
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("should display alert when submitting with invalid email", async () => {
    const { result } = renderHook(() => useFormValidation(null, false));

    act(() => {
      result.current.handleNameChange("Alice");
      result.current.handlePhoneChange("123456789");
      result.current.handleEmailChange("invalid-email");
    });

    act(() => {
      result.current.handleSubmit(onSubmitMock, onCloseMock);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation Error",
      "Please enter a valid email address."
    );
    expect(onSubmitMock).not.toHaveBeenCalled();
  });  
});

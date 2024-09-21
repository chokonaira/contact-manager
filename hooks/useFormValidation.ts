import { useState, useEffect } from "react";
import { Alert } from "react-native";

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

export const useFormValidation = (contact: Contact | null, isEditing: boolean) => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing && contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setEmail(contact.email || "");
      setPhoto(contact.photo || null);
    } else {
      resetForm();
    }
  }, [contact, isEditing]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPhoto(null);
    setNameError("");
    setPhoneError("");
    setEmailError("");
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (!text.trim()) {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleanedPhone = text.replace(/[^0-9]/g, "");
    setPhone(cleanedPhone);
    if (!cleanedPhone.trim()) {
      setPhoneError("Phone number is required");
    } else {
      setPhoneError("");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (
    onSubmit: (contact: Contact) => void,
    onClose: () => void
  ) => {
    if (!name || !phone) {
      Alert.alert("Validation Error", "Name and phone number are required.");
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onSubmit({ id: contact?.id, name, phone, email, photo });
      setIsLoading(false);
      onClose();
    }, 800);
  };

  return {
    name,
    phone,
    email,
    photo,
    nameError,
    phoneError,
    emailError,
    isLoading,
    setPhoto,
    handleNameChange,
    handlePhoneChange,
    handleEmailChange,
    handleSubmit,
    resetForm,
  };
};

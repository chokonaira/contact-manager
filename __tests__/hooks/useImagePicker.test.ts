import { renderHook, act } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { useImagePicker } from '../../hooks/useImagePicker';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

describe('useImagePicker hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the provided initial photo', () => {
    const initialPhoto = 'https://example.com/photo.jpg';
    const { result } = renderHook(() => useImagePicker(initialPhoto));

    expect(result.current.photo).toBe(initialPhoto);
  });

  it('should allow picking an image from the library', async () => {
    // Mock permission granted and image picker result
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'https://example.com/new-photo.jpg' }],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.pickImageFromLibrary();
    });

    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    expect(result.current.photo).toBe('https://example.com/new-photo.jpg');
  });

  it('should allow taking a photo with the camera', async () => {
    // Mock permission granted and camera result
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'https://example.com/camera-photo.jpg' }],
    };

    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.takePhotoWithCamera();
    });

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    expect(result.current.photo).toBe('https://example.com/camera-photo.jpg');
  });

  it('should not change photo if image picking is canceled', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    const mockResult = { canceled: true };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.pickImageFromLibrary();
    });

    expect(result.current.photo).toBeNull();
  });

  it('should reset the photo to null', () => {
    const initialPhoto = 'https://example.com/photo.jpg';
    const { result } = renderHook(() => useImagePicker(initialPhoto));

    act(() => {
      result.current.resetImage();
    });

    expect(result.current.photo).toBeNull();
  });

  it('should update the initial photo', () => {
    const initialPhoto = 'https://example.com/photo.jpg';
    const { result } = renderHook(() => useImagePicker());

    act(() => {
      result.current.setInitialPhoto(initialPhoto);
    });

    expect(result.current.photo).toBe(initialPhoto);
  });
});

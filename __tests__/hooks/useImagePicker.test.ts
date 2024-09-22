import { renderHook, act } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { useImagePicker } from '../../hooks/useImagePicker';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
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
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'https://example.com/new-photo.jpg' }],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.pickImage();
    });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    expect(result.current.photo).toBe('https://example.com/new-photo.jpg');
  });

  it('should not change photo if image picking is canceled', async () => {
    const mockResult = { canceled: true };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.pickImage();
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

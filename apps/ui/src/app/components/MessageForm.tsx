import {ChangeEvent, SyntheticEvent, useRef, useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  calculateFileSizeMb,
  FosterLengths,
  MAX_FILE_SIZE_MB,
} from '@fido-foster/common';

import {getUploadUrl, sendMessage, uploadImage} from '../../api';

const CATEGORIES = Object.values(FosterLengths);

export const MessageForm = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (calculateFileSizeMb(file) > MAX_FILE_SIZE_MB) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!message || !categories.length) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageKey: string | undefined;
      if (image) {
        if (calculateFileSizeMb(image) > MAX_FILE_SIZE_MB) {
          setError(`Image must be under ${MAX_FILE_SIZE_MB}MB`);
          setLoading(false);
          return;
        }
        const {uploadUrl, imageKey: key} = await getUploadUrl(image.type);
        await uploadImage(uploadUrl, image, setUploadProgress);
        imageKey = key;
      }

      await sendMessage(message, categories, imageKey);
      setSuccess('Message sent successfully');
      setMessage('');
      setCategories([]);
      clearImage();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 480,
        }}
      >
        <Typography variant="h5">Send Message</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <FormGroup>
          <FormLabel>Categories</FormLabel>
          {CATEGORIES.map(cat => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  disabled={loading}
                />
              }
              label={cat}
            />
          ))}
        </FormGroup>
        <TextField
          label="Message"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={loading}
        />
        <Box sx={{width: '100%'}}>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            style={{display: 'none'}}
            onChange={handleImageChange}
            disabled={loading}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              variant="outlined"
              fullWidth
              disabled={loading}
            >
              {image ? 'Change Image' : 'Attach Image (optional)'}
            </Button>
          </label>
        </Box>
        {imagePreview && (
          <Box sx={{width: '100%'}}>
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
            <Button
              size="small"
              onClick={clearImage}
              disabled={loading}
              sx={{mt: 1}}
            >
              Remove Image
            </Button>
          </Box>
        )}
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{width: '100%'}}>
            <Typography variant="caption">
              Uploading image... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !message || !categories.length}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </Box>
    </Box>
  );
};

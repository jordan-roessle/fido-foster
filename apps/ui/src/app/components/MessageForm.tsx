import {SyntheticEvent, useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {sendMessage} from '../../api';

const CATEGORIES = ['Day Trip', 'Short Term', 'Long Term'];

export const MessageForm = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!message || !categories.length) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await sendMessage(message, categories);
      setSuccess('Message sent successfully');
      setMessage('');
      setCategories([]);
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

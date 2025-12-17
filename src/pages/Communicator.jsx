import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";

// ---- TipTap imports ----
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import communicatorService from "../services/communicatorService";

export default function Communicator() {
  const [recipient, setRecipient] = useState("all");
  const [subject, setSubject] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [sendEmail, setSendEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Message history
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [viewDialog, setViewDialog] = useState({ open: false, message: null });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Type your message here...",
      }),
    ],
    content: "",
  });

  useEffect(() => {
    fetchMessageHistory();
  }, [pagination.current_page]);

  const fetchMessageHistory = async () => {
    setLoadingHistory(true);
    const result = await communicatorService.getMessageHistory({
      page: pagination.current_page,
      per_page: pagination.per_page,
    });

    if (result.success) {
      setMessages(result.data);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    }
    setLoadingHistory(false);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }

    const messageContent = editor?.getHTML() || "";
    if (!messageContent.trim() || messageContent === "<p></p>") {
      setError("Message content is required");
      return;
    }

    setSending(true);

    const messageData = {
      subject: subject.trim(),
      message: messageContent,
      recipient_type: recipient,
      notification_type: notificationType,
      send_email: sendEmail,
    };

    const result = await communicatorService.sendMessage(messageData);

    if (result.success) {
      setSuccess(`Message sent successfully to ${recipient === 'all' ? 'all users' : recipient}!`);
      
      // Reset form
      setSubject("");
      editor?.commands.setContent("");
      setRecipient("all");
      setNotificationType("info");
      setSendEmail(false);
      
      // Refresh history
      fetchMessageHistory();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError(result.message || "Failed to send message");
    }

    setSending(false);
  };

  const handleViewMessage = (message) => {
    setViewDialog({ open: true, message });
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    const result = await communicatorService.deleteMessage(id);
    
    if (result.success) {
      setSuccess("Message deleted successfully");
      fetchMessageHistory();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to delete message");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecipientLabel = (recipientType) => {
    const labels = {
      'all': 'All Users',
      'businesses': 'All Businesses',
      'business_users': 'Business Users',
      'specific': 'Specific Users'
    };
    return labels[recipientType] || recipientType;
  };

  const getTypeColor = (type) => {
    const colors = {
      'info': 'info',
      'warning': 'warning',
      'alert': 'error',
      'system': 'default'
    };
    return colors[type] || 'default';
  };

  return (
    <Box>
      {/* ---- PAGE HEADER ---- */}
      <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
        Communicator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Send messages and push notifications to users across SaaS Dashboard and VMS
      </Typography>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* =======================
          COMPOSE BOX
      ======================== */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          mb: 4,
        }}
      >
        {/* Title */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <MessageIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Compose Message
          </Typography>
        </Stack>

        {/* Recipients & Type Row */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel size="small">Recipients*</InputLabel>
            <Select
              size="small"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              label="Recipients*"
              disabled={sending}
            >
              <MenuItem value="all">All Users (SaaS + VMS)</MenuItem>
              {/* <MenuItem value="super_admins">Super Admins Only</MenuItem> */}
              <MenuItem value="businesses">All Business Admins</MenuItem>
              <MenuItem value="business_users">All Business Users (VMS)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel size="small">Notification Type</InputLabel>
            <Select
              size="small"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              label="Notification Type"
              disabled={sending}
            >
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Subject */}
        <TextField
          label="Subject*"
          fullWidth
          size="small"
          required
          sx={{ mb: 2 }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
          placeholder="Enter message subject"
        />

        {/* TipTap Editor */}
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
          Message Content*
        </Typography>
        <Box
          sx={{
            border: "1px solid #D0D7E2",
            borderRadius: "6px",
            minHeight: 200,
            p: 2,
            mb: 2,
            backgroundColor: sending ? "#f5f5f5" : "#fff",
            "& .tiptap": {
              minHeight: 180,
              outline: "none",
            },
            "& .tiptap p": { 
              margin: 0,
              marginBottom: "8px"
            },
            "& .tiptap p.is-editor-empty:first-child::before": {
              color: "#adb5bd",
              content: "attr(data-placeholder)",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>

        {/* Options */}
        <FormControlLabel
          control={
            <Checkbox
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              disabled={sending}
            />
          }
          label="Also send as email notification"
          sx={{ mb: 2 }}
        />

        {/* Send button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setSubject("");
              editor?.commands.setContent("");
              setRecipient("all");
              setNotificationType("info");
              setSendEmail(false);
              setError("");
            }}
            disabled={sending}
            sx={{ textTransform: "none" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            endIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            onClick={handleSubmit}
            disabled={sending}
            sx={{
              textTransform: "none",
              backgroundColor: "#0C2548",
              "&:hover": { backgroundColor: "#08182F" },
              minWidth: 120,
            }}
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </Box>
      </Paper>

      {/* =======================
          MESSAGE HISTORY
      ======================== */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Message History
        </Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={fetchMessageHistory} disabled={loadingHistory}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper 
        elevation={0}
        sx={{ 
          width: "100%", 
          p: 2, 
          borderRadius: 2,
          border: "1px solid #E0E0E0"
        }}
      >
        {loadingHistory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f0f0f0" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {msg.subject}
                      </Typography>
                      <Chip 
                        label={getRecipientLabel(msg.recipient_type)} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={msg.notification_type || 'info'} 
                        size="small" 
                        color={getTypeColor(msg.notification_type)}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Stack>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                    />
                    
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Sent: {formatDate(msg.created_at || msg.date)}
                      </Typography>
                      {msg.recipients_count && (
                        <Typography variant="caption" color="text.secondary">
                          Recipients: {msg.recipients_count}
                        </Typography>
                      )}
                      {msg.send_email && (
                        <Chip label="Email Sent" size="small" variant="outlined" />
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewMessage(msg)}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteMessage(msg.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Box>
            ))}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.last_page}
                  page={pagination.current_page}
                  onChange={(e, page) => setPagination({ ...pagination, current_page: page })}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <MessageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No messages sent yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Compose and send your first message above
            </Typography>
          </Box>
        )}
      </Paper>

      {/* View Message Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, message: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600">
              {viewDialog.message?.subject}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={getRecipientLabel(viewDialog.message?.recipient_type)} 
                size="small" 
                color="primary"
              />
              <Chip 
                label={viewDialog.message?.notification_type || 'info'} 
                size="small" 
                color={getTypeColor(viewDialog.message?.notification_type)}
              />
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Sent: {formatDate(viewDialog.message?.created_at)}
          </Typography>
          <Box 
            dangerouslySetInnerHTML={{ __html: viewDialog.message?.message || '' }}
            sx={{ 
              '& p': { mb: 1 },
              '& ul, & ol': { pl: 3 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, message: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

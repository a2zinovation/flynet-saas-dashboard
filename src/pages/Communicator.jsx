import React, { useState } from "react";
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
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";

// ---- TipTap imports ----
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

// ---- Mock message history ----
const mockHistory = [
  {
    id: 1,
    subject: "System Update Alert",
    message: "The platform will undergo maintenance…",
    date: "2025-10-28",
  },
  {
    id: 2,
    subject: "New Feature Announcement",
    message: "LPR functionality is now live.",
    date: "2025-10-25",
  },
];

export default function Communicator() {
  const [recipient, setRecipient] = useState("All");
  const [subject, setSubject] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Message*",
      }),
    ],
    content: "",
  });

  const handleSubmit = () => {
    alert("Message sent!");
  };

  return (
    <Box>
      {/* ---- PAGE HEADER ---- */}
      <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
        Communicator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Send messages and notifications across the platform
      </Typography>

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
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <MessageIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Compose Message
          </Typography>
        </Stack>

        {/* Recipients row */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body1">Recipients:</Typography>

          <Select
            size="small"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="All">All Users</MenuItem>
            <MenuItem value="Super">Super Admin</MenuItem>
            <MenuItem value="Tenants">All Tenants</MenuItem>
          </Select>

          <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
            Select All
          </Button>
          <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
            Deselect All
          </Button>
        </Stack>

        {/* Subject */}
        <TextField
          label="Subject*"
          fullWidth
          size="medium"
          required
          sx={{ mb: 2 }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* TipTap Editor */}
        <Box
          sx={{
            border: "1px solid #D0D7E2",
            borderRadius: "6px",
            minHeight: 160,
            p: 1.5,
            "& .tiptap p": { margin: 0 },
          }}
        >
          <EditorContent editor={editor} />
        </Box>

        {/* Send button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              backgroundColor: "#0C2548",
              "&:hover": { backgroundColor: "#08182F" },
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {/* =======================
          MESSAGE HISTORY
      ======================== */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Message History
      </Typography>

      <Paper sx={{ width: "100%", p: 2, borderRadius: 2 }}>
        {mockHistory.map((msg) => (
          <Box key={msg.id} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {msg.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {msg.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {msg.date}
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

import React, { useState } from "react";
import { TextField, Button, Container, Typography, Link, Box } from "@mui/material";

export default function Register({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    // Your API registration logic here
    // On success, optionally switch to login or call login callback
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Username"
          required
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Register
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="#" onClick={switchToLogin}>
          Login
        </Link>
      </Typography>
    </Container>
  );
}

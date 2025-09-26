import React, { useState } from "react";
import { TextField, Button, Container, Typography, Link, Box } from "@mui/material";
import { loginUser } from "../api/auth";

export default function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await loginUser({ username, password });
      if (data.access) {
        onLogin(data.access); // Pass the JWT access token to parent component
      } else {
        alert("Login failed: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      alert("Login error: " + error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
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
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link href="#" onClick={switchToRegister}>
          Register
        </Link>
      </Typography>
    </Container>
  );
}

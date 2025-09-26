import React, { useState } from "react";
import API, { setAuth } from "./api";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

import { AppBar, Toolbar, Button, Typography, Box, Container } from "@mui/material";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("Products"); // Products, Cart, Checkout

  function onLogin(token) {
    setToken(token);
    setAuth(token);
    localStorage.setItem("token", token);
  }

  function doLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuth(null);
  }

  function onAddToCart(productId) {
    API.post("orders/add_to_cart/", { product_id: productId, quantity: 1 })
      .then(() => alert("Added to cart!"))
      .catch(() => alert("Failed to add to cart"));
  }

  if (!token) {
    return <AuthSwitcher onLogin={onLogin} />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ALLCOM
          </Typography>
          <Button color="inherit" onClick={() => setPage("Products")}>
            Products
          </Button>
          <Button color="inherit" onClick={() => setPage("Cart")}>
            Cart
          </Button>
          <Button color="inherit" onClick={() => setPage("Checkout")}>
            Checkout
          </Button>
          <Button color="inherit" onClick={doLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Container sx={{ mt: 3 }}>
          {page === "Products" && <ProductList onAddToCart={onAddToCart} />}
          {page === "Cart" && <Cart />}
          {page === "Checkout" && <Checkout />}
        </Container>
      </Box>
    </>
  );
}

function AuthSwitcher({ onLogin }) {
  const [showRegister, setShowRegister] = React.useState(false);

  return showRegister ? (
    <Register switchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onLogin={onLogin} switchToRegister={() => setShowRegister(true)} />
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, TextField, Button, Box } from "@mui/material";
import API from "../api";

export default function Cart() {
  const [cart, setCart] = useState(null);

  const fetchCart = () => {
    API.get("orders/my_cart/")
      .then((res) => setCart(res.data))
      .catch(() => alert("Failed to fetch cart"));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (itemId, quantity) => {
    API.post("orders/update_cart_item/", { item_id: itemId, quantity })
      .then(() => fetchCart())
      .catch(() => alert("Failed to update cart item"));
  };

  if (!cart || !cart.items) return <Typography>Loading cart...</Typography>;

  if (cart.items.length === 0) return <Typography>Your cart is empty</Typography>;

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <Grid container spacing={3}>
        {cart.items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.product.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={item.product.image.startsWith("http") ? item.product.image : `${(process.env.REACT_APP_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "")}${item.product.image}`}
                  alt={item.product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  ₹{item.product.price}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    type="number"
                    label="Quantity"
                    size="small"
                    value={item.quantity}
                    inputProps={{ min: 0 }}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    sx={{ width: "80px" }}
                  />
                  <Button variant="outlined" color="error" onClick={() => updateQuantity(item.id, 0)}>
                    Remove
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

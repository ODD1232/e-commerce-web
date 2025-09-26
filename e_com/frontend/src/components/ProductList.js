import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container } from "@mui/material";
import API from "../api";

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("products/")
      .then(res => setProducts(res.data))
      .catch(() => alert("Failed to fetch products"));
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column' }}>
              {p.image && (
                <CardMedia
                  component="img"
                  image={p.image.startsWith("http") ? p.image : `http://localhost:8000${p.image}`}
                  alt={p.name}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    backgroundColor: "#fafbfc",
                    mb: 1,
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <Typography gutterBottom variant="h5" component="div">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
                    {p.description}
                  </Typography>
                  <Typography variant="h6">₹{p.price}</Typography>
                </div>
                <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={() => onAddToCart(p.id)}>
                  Add To Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

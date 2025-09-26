import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import API from "../api";

export default function Checkout() {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    API.get("orders/my_cart/")
      .then(res => {
        const total = res.data.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setAmount(total);
      })
      .catch(() => alert("Failed to fetch cart for checkout"));
  }, []);

  const handleCheckout = () => {
    API.post("checkout/")
      .then((res) => {
        const { razorpay_order_id, currency, key_id } = res.data;
        const options = {
          key: key_id,
          amount: amount * 100, // in paise
          currency,
          order_id: razorpay_order_id,
          handler: function (response) {
            API.post("payment-success/", response)
              .then(() => alert("Payment successful"))
              .catch(() => alert("Payment verification failed"));
          },
          modal: {
            ondismiss: function () {
              alert("Payment cancelled");
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch(() => alert("Checkout failed"));
  };

  return (
    <Container sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Total Amount: ₹{amount}
      </Typography>
      <Box>
        <Button variant="contained" size="large" onClick={handleCheckout} disabled={amount <= 0}>
          Pay Now
        </Button>
      </Box>
    </Container>
  );
}

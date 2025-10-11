// src/components/ConfirmationPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { format } from 'date-fns';
import QRCode from 'react-qr-code'; // <-- IMPORT THE NEW LIBRARY

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, salon, date, slot, customerName } = location.state || {};

  // If no state, redirect
  if (!bookingDetails || !salon) {
    navigate('/');
    return null;
  }

  const bookingId = bookingDetails.id || 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const qrData = `Salonique Booking: ${bookingId} | ${salon.name} | ${format(date, 'MMM dd, yyyy')} at ${slot.time} | ${customerName}`;

  const handleBookAnother = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', bgcolor: 'background.default', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', width: '100%', maxWidth: 500 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: -60,
              left: '40%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 120, color: 'success.main', bgcolor: 'background.default', borderRadius: '50%' }} />
          </motion.div>

          <Card sx={{ width: '100%', borderRadius: 5, boxShadow: 8, overflow: 'hidden', pt: 8 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'success.main', fontWeight: 300 }}>
                Booking Confirmed!
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
                Your appointment is all set. Show this confirmation at the salon.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Details:</Typography>
                <Box sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="body1"><strong>Salon:</strong> {salon.name}</Typography>
                  <Typography variant="body1"><strong>Date:</strong> {format(date, 'MMM dd, yyyy')}</Typography>
                  <Typography variant="body1"><strong>Time:</strong> {slot.time}</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {customerName}</Typography>
                  <Typography variant="body1"><strong>Booking ID:</strong> {bookingId}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <QrCodeIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main' }} />
                  Scannable QR Code
                </Typography>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, display: 'inline-block' }}>
                  {/* The new library's component works the same way */}
                  <QRCode value={qrData} size={128} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Scan at the salon or save this page.
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookAnother}
                sx={{ py: 1.5, borderRadius: 3, mt: 2 }}
                aria-label="Book another appointment"
              >
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ConfirmationPage;
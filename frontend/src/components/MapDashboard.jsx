// src/components/MapDashboard.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Box, Card, CardContent, CardActions, Button, Typography, 
  List, ListItem, InputBase, IconButton, Paper, useTheme,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import api from '../api/axios';

// Marker icons (custom for theme)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const salonIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

const MapDashboard = ({ onSelectSalon }) => {
  const theme = useTheme();
  const [salons, setSalons] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        try {
          const response = await api.get(`/api/salons/nearby/?latitude=${latitude}&longitude=${longitude}`);
          setSalons(response.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const filteredSalons = salons.filter(salon => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, m: 1, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={40} />
        </Paper>
        <Box sx={{ flex: 1, m: 1, borderRadius: 3, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
        <Box sx={{ height: 250, p: 1 }}>
          <Skeleton variant="rectangular" height={230} sx={{ borderRadius: 3 }} />
        </Box>
      </Box>
    );
  }

  return (
    // --- THIS IS THE FIX ---
    // Changed height from '100vh' to '100%' to fit within the parent layout
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Bar */}
      <Paper
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: 1, borderRadius: 12 }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search salons by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      {/* Map */}
      <Box sx={{ flex: 1, position: 'relative', m: 1, borderRadius: 3, overflow: 'hidden' }}>
        <MapContainer center={userLocation || [17.3850, 78.4867]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <Marker position={userLocation} icon={userIcon}><Popup>Your Location</Popup></Marker>}
          {filteredSalons.map(salon => (
            <Marker key={salon.id} position={[salon.latitude, salon.longitude]} icon={salonIcon}>
              <Popup>{salon.name}<br />{salon.distance.toFixed(2)} km</Popup>
            </Marker>
          ))}
          <ResizeMap />
        </MapContainer>
      </Box>

      {/* Salon List: Scrollable bottom sheet */}
      <Box sx={{ height: 250, overflowY: 'auto', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ pt: 2, pl: 2 }}>Nearby Salons</Typography>
        <List sx={{ p: 1, display: 'flex', overflowX: 'auto' }}>
          {filteredSalons.map((salon, index) => (
            <motion.div key={salon.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
              <ListItem disablePadding sx={{ minWidth: 280, p: 1 }}>
                <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" noWrap>{salon.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{salon.distance.toFixed(2)} km away</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<DirectionsIcon />}
                      onClick={() => onSelectSalon(salon)}
                    >
                      Select
                    </Button>
                  </CardActions>
                </Card>
              </ListItem>
            </motion.div>
          ))}
          {filteredSalons.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', p: 2, width: '100%' }}>
              No salons found matching your search.
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default MapDashboard;
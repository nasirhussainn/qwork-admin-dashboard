import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  CardMedia,
  Chip,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { fetchPortfolioById } from "../services/api";

const getStatusColor = (status) => {
  const colorMap = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    hold: "info",
  };
  return colorMap[status] || "default";
};

const PortfolioDetailModal = ({ portfolio, open, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && portfolio?.portfolio_id) {
      const loadDetails = async () => {
        try {
          setLoading(true);
          const data = await fetchPortfolioById(portfolio.portfolio_id);
          setDetails(data);
        } catch (err) {
          console.error("Failed to load portfolio details", err);
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [open, portfolio]);

  if (!portfolio) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {details?.title || portfolio.title}
        </Typography>
        <Chip
          label={details?.status || portfolio.status}
          color={getStatusColor(details?.status || portfolio.status)}
          size="small"
        />
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Metadata */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>ID:</strong>{" "}
                {details?.portfolio_id || portfolio.portfolio_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>User ID:</strong>{" "}
                {details?.user_id || portfolio.user_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong>{" "}
                {new Date(
                  details?.created_at || portfolio.created_at
                ).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Images */}
            {details?.portfolio_images?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <Grid container spacing={2}>
                  {details.portfolio_images.map((img, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={img.url}
                        alt={`${details.title} - ${idx + 1}`}
                        sx={{ borderRadius: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {details?.description || "No description available."}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Keywords */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Keywords
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {details?.portfolio_keywords?.length > 0 ? (
                  details.portfolio_keywords.map((kw) => (
                    <Chip key={kw.id} label={kw.keyword} variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No keywords provided.
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDetailModal;

import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";

interface FormSettings {
  GameAddress: string;
  BotAddress1: string;
  BotAddress2: string;
  BotAddress3: string;
}

const inter = Inter({ subsets: ["latin"] });

let initialFValues = {
  GameAddress: "/play",
  BotAddress1: "first bot address",
  BotAddress2: "second bot address",
  BotAddress3: "third bot address",
};

export default function Home() {
  const router = useRouter();

  const handleSaveSettings = () => {
    initialFValues = configurations;
  };

  const handlePlay = () => {
    router.push(configurations.GameAddress);
  };

  const handleSettingsChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfigurations({
      ...configurations,
      [name]: value,
    });
  };

  const handleResetSettings = () => {
    setConfigurations(initialFValues);
  };

  const [configurations, setConfigurations] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let currentErrors = { ...errors };
    setErrors({
      ...currentErrors,
    });
  };

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Settings
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Game Address"
                name="GameAddress"
                value={configurations.GameAddress}
                fullWidth
                placeholder="Enter game address..."
                autoComplete="off"
                onChange={handleSettingsChanged}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bot Address Slot 1"
                name="BotAddress1"
                value={configurations.BotAddress1}
                fullWidth
                placeholder="Enter bot address..."
                autoComplete="off"
                onChange={handleSettingsChanged}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bot Address Slot 2"
                name="BotAddress2"
                value={configurations.BotAddress2}
                fullWidth
                placeholder="Enter bot address..."
                autoComplete="off"
                onChange={handleSettingsChanged}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bot Address Slot 3"
                name="BotAddress3"
                value={configurations.BotAddress3}
                fullWidth
                placeholder="Enter bot address..."
                autoComplete="off"
                onChange={handleSettingsChanged}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSaveSettings}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                color="error"
                fullWidth
                size="large"
                variant="contained"
                onClick={handleResetSettings}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Get Started
            </Typography>
          </Box>
          <Button
            color="primary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handlePlay}
          >
            Play
          </Button>
        </Container>
      </Box>
    </>
  );
}

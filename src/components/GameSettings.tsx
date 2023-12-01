import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface FormSettings {
  BotAddress1: string;
  BotAddress2: string;
  BotAddress3: string;
  BotAddress4: string;
}

let initialFValues = {
  BotAddress1: "https://bots.lumigame.com/chinese-poker-bot-combine",
  BotAddress2: "https://bots.lumigame.com/chinese-poker-bot-combine",
  BotAddress3: "https://bots.lumigame.com/chinese-poker-bot-combine",
  BotAddress4: "https://bots.lumigame.com/chinese-poker-bot-probability",
};

export const GameSettings = () => {
  useEffect(() => {
    const item = localStorage.getItem("settings");
    if (item && item.length > 0) {
      setConfigurations(JSON.parse(item));
    } else {
      setConfigurations(initialFValues);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("settings", JSON.stringify(configurations));
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
    localStorage.setItem("settings", JSON.stringify(initialFValues));
  };

  const [configurations, setConfigurations] = useState({} as FormSettings);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 3 }}>
        <Typography color="textPrimary" variant="h4">
          Settings
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Bot Address Slot 1"
            name="BotAddress1"
            value={configurations.BotAddress1 ?? " "}
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
            value={configurations.BotAddress2 ?? " "}
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
            value={configurations.BotAddress3 ?? " "}
            fullWidth
            placeholder="Enter bot address..."
            autoComplete="off"
            onChange={handleSettingsChanged}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bot Address Suggestion"
            name="BotAddress4"
            value={configurations.BotAddress4 ?? " "}
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
    </Container>
  );
};

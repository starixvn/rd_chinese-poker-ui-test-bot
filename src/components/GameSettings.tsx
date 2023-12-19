import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export interface FormSettings {
  BotAddress1: string;
  BotAddress2: string;
  BotAddress3: string;
  BotAddress4: string;
  DelayTime: number;
  Version?: string;
}

interface FormSettingsErrors {
  BotAddress1Error: string;
  BotAddress2Error: string;
  BotAddress3Error: string;
  BotAddress4Error: string;
  DelayTimeError: string;
}

export const initialGameSettings = {
  BotAddress1: "https://bots.lumigame.com/chinese-poker-bot-probability",
  BotAddress2: "https://bots.lumigame.com/chinese-poker-bot-pick",
  BotAddress3: "https://bots.lumigame.com/chinese-poker-bot-probability",
  BotAddress4: "https://bots.lumigame.com/chinese-poker-bot-pick",
  DelayTime: 0,
  Version: "1.2",
};

const errorStates = {
  BotAddressError: "Invalid Address",
  DelayTimeError: "Invalid Delay Time",
};

interface GameSettingsProps {
  handleClosePopup: (isSaved: boolean) => void;
}

export const GameSettings = (props: GameSettingsProps) => {
  const [errors, setErrors] = useState({} as FormSettingsErrors);

  const initSettings = () => {
    setErrors({} as FormSettingsErrors);
    setConfigurations(initialGameSettings);
    localStorage.setItem("settings", JSON.stringify(initialGameSettings));
  };

  useEffect(() => {
    const item = localStorage.getItem("settings") || "";
    let settings = {} as FormSettings;

    try {
      settings = JSON.parse(item);
    } catch (e) {
      initSettings();
    }

    if (settings.Version !== initialGameSettings.Version) {
      initSettings();
    } else {
      setConfigurations(settings);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("settings", JSON.stringify(configurations));
    if (props.handleClosePopup) {
      props.handleClosePopup(true);
    }
  };

  const handleSettingsChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfigurations({
      ...configurations,
      [name]: value,
    });

    if (name === "DelayTime") {
      const num = Number(value);
      if (Number.isNaN(num) || num < 0) {
        errors.DelayTimeError = errorStates.DelayTimeError;
      } else {
        errors.DelayTimeError = "";
      }
    }
  };

  const handleResetSettings = () => {
    initSettings();
    if (props.handleClosePopup) {
      props.handleClosePopup(true);
    }
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
        <Grid item xs={12}>
          <TextField
            label="Delay Time"
            name="DelayTime"
            value={configurations.DelayTime ?? " "}
            fullWidth
            placeholder="Enter delay time..."
            autoComplete="off"
            onChange={handleSettingsChanged}
            error={errors.DelayTimeError === errorStates.DelayTimeError}
            helperText={errors.DelayTimeError}
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

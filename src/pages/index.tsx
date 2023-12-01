import { GameSettings } from "@/components/GameSettings";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  const handlePlay = () => {
    router.push("/play");
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
          <GameSettings />
          <Container maxWidth="sm">
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
        </Container>
      </Box>
    </>
  );
}

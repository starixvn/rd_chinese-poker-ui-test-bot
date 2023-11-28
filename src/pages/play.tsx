import Head from "next/head";
import { Box, Button, Container, Grid } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Slot } from "../components/Slot";

export default function Home() {
  const [player, setPlayer] = useState([] as number[]);
  const [playerSlot1, setPlayerSlot1] = useState([0, 1, 2, 3, 4]);
  const [playerSlot2, setPlayerSlot2] = useState([5, 6, 7, 8, 9]);
  const [playerSlot3, setPlayerSlot3] = useState([10, 11, 12]);
  const [activeSlot, setActiveSlot] = useState(1);

  const handleOnClickCard = (slot: string, card: number) => {
    if (slot != "Player Cards") {
      player.push(card);
      setPlayer([...player]);
      switch (slot) {
        case "Slot 1":
          setActiveSlot(1);
          removeCardFromSlot(playerSlot1, card, setPlayerSlot1);
          break;
        case "Slot 2":
          setActiveSlot(2);
          removeCardFromSlot(playerSlot2, card, setPlayerSlot2);
          break;
        case "Slot 3":
          setActiveSlot(3);
          removeCardFromSlot(playerSlot3, card, setPlayerSlot3);
          break;
      }
    } else {
      switch (activeSlot) {
        case 1:
          if (playerSlot1.length < 5) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot1, card, setPlayerSlot1);
          }
          break;
        case 2:
          if (playerSlot2.length < 5) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot2, card, setPlayerSlot2);
          }
          break;
        case 3:
          if (playerSlot3.length < 3) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot3, card, setPlayerSlot3);
          }
          break;
      }
    }
  };

  const removeCardFromSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    let index = data.indexOf(card);
    data.splice(index, 1);
    setSlot([...data]);
  };

  const addCardToSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    data.push(card);
    setSlot([...data]);
  };

  const handleOnClickSlot = (slot: string) => {
    switch (slot) {
      case "Slot 1":
        setActiveSlot(1);
        break;
      case "Slot 2":
        setActiveSlot(2);
        break;
      case "Slot 3":
        setActiveSlot(3);
        break;
    }
  };

  const handleSwitch = () => {
    let tmp = playerSlot1;
    setPlayerSlot1([...playerSlot2]);
    setPlayerSlot2([...tmp]);
  };

  return (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                Bot 1
              </Grid>
              <Grid item xs={4}>
                Bot 2
              </Grid>
              <Grid item xs={4}>
                Bot 3
              </Grid>
              <Grid item xs={12}>
                <Slot
                  name="Slot 1"
                  cards={playerSlot1}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 1}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Button onClick={handleSwitch}>switch</Button>
                <Slot
                  name="Slot 2"
                  cards={playerSlot2}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 2}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Slot
                  name="Slot 3"
                  cards={playerSlot3}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 3}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Slot
                  name="Player Cards"
                  cards={player}
                  handleOnClickCard={handleOnClickCard}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

import Head from "next/head";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Tooltip,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackHand, Slot, StaticHand } from "../components/Slot";
import { gameService } from "@/services/gameService";
import { CheckCircle, ImportExport, Settings, Help } from "@mui/icons-material";
import { initialMatchData, initialMatchResult } from "../interfaces";
import { SlotResultShow } from "@/components/GameResult";
import { GameSettingsPopup } from "@/components/GameSettingsPopup";
import { DragDropContext, Droppable } from "@/utils/react-beautiful-dnd";
import { DragUpdate, DropResult } from "react-beautiful-dnd";
import { SuggestData } from "@/interfaces/SuggestData";
import { SuggestPopup } from "@/components/SuggestPopup";
import { FormSettings, initialGameSettings } from "@/components/GameSettings";

const arrangement = {
  player: "player",
  bot1: "bot1",
  bot2: "bot2",
  bot3: "bot3",
};

export default function Home() {
  const [bot1, setBot1] = useState([] as number[]);
  const [bot2, setBot2] = useState([] as number[]);
  const [bot3, setBot3] = useState([] as number[]);
  const [suggestData, setSuggestData] = useState([] as SuggestData[]);
  const [playerData, setPlayerData] = useState([] as number[]);
  const [currentArrangement, setCurrentArrangement] = useState(
    arrangement.player
  );
  const [arrangeHand1, setArrangeHand1] = useState([] as number[]);
  const [arrangeHand2, setArrangeHand2] = useState([] as number[]);
  const [arrangeHand3, setArrangeHand3] = useState([] as number[]);
  const [gameData, setGameData] = useState(initialMatchData);
  const [gameResult, setGameResult] = useState(initialMatchResult);
  const [isLoadingBot1, setIsLoadingBot1] = useState(true);
  const [isLoadingBot2, setIsLoadingBot2] = useState(true);
  const [isLoadingBot3, setIsLoadingBot3] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettled, setIsSettled] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggested, setIsSuggested] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openArrangement, setOpenArrangement] = useState(true);
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const [startNewGame, setStartNewGame] = useState(0);
  const [dragOVerId, setDragOVerId] = useState<string | null>(null);
  const [countDown, setCountDown] = useState(5);
  const [gameSettings, setGameSettings] = useState({} as FormSettings);
  const botAddressList = [
    "https://bots.lumigame.com/chinese-poker-bot-pick",
    "https://bots.lumigame.com/chinese-poker-bot-probability",
  ];
  const defaultBot = "https://bots.lumigame.com/chinese-poker-bot-pick";

  async function getData() {
    const body = ["1", "2", "3", "4"];
    const data = await gameService.getHandCards(body);
    if (data) {
      let playerDataInitial = data.player_input["1"].input;
      setArrangeHand3(playerDataInitial.slice(0, 3));
      setArrangeHand2(playerDataInitial.slice(3, 8));
      setArrangeHand1(playerDataInitial.slice(8, 13));
      setPlayerData(playerDataInitial);
      setBot1(data.player_input["2"].input);
      setBot2(data.player_input["3"].input);
      setBot3(data.player_input["4"].input);
      gameData.matchId = data.match_id;
      gameData.slot1.hash = data.player_input["1"].hash;
      gameData.slot2.hash = data.player_input["2"].hash;
      gameData.slot3.hash = data.player_input["3"].hash;
      gameData.slot4.hash = data.player_input["4"].hash;

      setIsLoading(false);
    }
  }

  async function getBotAddress(bot: string) {
    let botArr = "";
    switch (bot) {
      case "bot1":
        botArr = gameSettings.BotAddress1;
        break;
      case "bot2":
        botArr = gameSettings.BotAddress2;
        break;
      case "bot3":
        botArr = gameSettings.BotAddress3;
        break;
      case "bot4":
        botArr = gameSettings.BotAddress4;
        break;
    }

    return botArr && botArr.length > 0 ? botArr : defaultBot;
  }

  async function getBotArrangement(bot: string, data: number[]) {
    const botArr = await getBotAddress(bot);
    if (data.length == 13) {
      let result = await gameService.getBotArrangement(data, botArr);
      if (result) {
        switch (bot) {
          case "bot1":
            gameData.slot2.hand1 = result.output.segment_1;
            gameData.slot2.hand2 = result.output.segment_2;
            gameData.slot2.hand3 = result.output.segment_3;
            setIsLoadingBot1(false);
            break;
          case "bot2":
            gameData.slot3.hand1 = result.output.segment_1;
            gameData.slot3.hand2 = result.output.segment_2;
            gameData.slot3.hand3 = result.output.segment_3;
            setIsLoadingBot2(false);
            break;
          case "bot3":
            gameData.slot4.hand1 = result.output.segment_1;
            gameData.slot4.hand2 = result.output.segment_2;
            gameData.slot4.hand3 = result.output.segment_3;
            setIsLoadingBot3(false);
            break;
        }
      }
    }
  }

  const updateGameSettings = () => {
    const item = localStorage.getItem("settings");
    if (item && item.length > 0) {
      setGameSettings(JSON.parse(item));
    } else {
      setGameSettings(initialGameSettings);
    }
  };

  useEffect(() => {
    if (isLoading) {
      updateGameSettings();
      setIsLoadingBot1(true);
      setIsLoadingBot2(true);
      setIsLoadingBot3(true);
      getData();
    }
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    } else {
      getBotArrangement("bot1", bot1);
      getBotArrangement("bot2", bot2);
      getBotArrangement("bot3", bot3);
    }
  }, [bot1, bot2, bot3, startNewGame, countDown]);

  const removeCardFromSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    let index = data.indexOf(card);
    data.splice(index, 1);
    setSlot([...data]);
  };

  const handleSwitch = () => {
    let tmp = arrangeHand1;
    setArrangeHand1([...arrangeHand2]);
    setArrangeHand2([...tmp]);
  };

  const handleSubmitHandCard = async () => {
    if (!isLoadingBot1 && !isLoadingBot2 && !isLoadingBot3) {
      if (isSettled) {
        if (currentArrangement === arrangement.player) {
          gameData.slot1.hand1 = [...arrangeHand1];
          gameData.slot1.hand2 = [...arrangeHand2];
          gameData.slot1.hand3 = [...arrangeHand3];
        }
      } else {
        gameData.slot1.hand1 = playerData.slice(8, 13);
        gameData.slot1.hand2 = playerData.slice(3, 8);
        gameData.slot1.hand3 = playerData.slice(0, 3);
      }
      let result = await gameService.getSettlement(gameData);
      setIsSettled(true);
      setGameResult({
        slot1: {
          hand1: result["1"].scores.segment_1,
          hand2: result["1"].scores.segment_2,
          hand3: result["1"].scores.segment_3,
          sum: result["1"].scores_sum,
        },
        slot2: {
          hand1: result["2"].scores.segment_1,
          hand2: result["2"].scores.segment_2,
          hand3: result["2"].scores.segment_3,
          sum: result["2"].scores_sum,
        },
        slot3: {
          hand1: result["3"].scores.segment_1,
          hand2: result["3"].scores.segment_2,
          hand3: result["3"].scores.segment_3,
          sum: result["3"].scores_sum,
        },
        slot4: {
          hand1: result["4"].scores.segment_1,
          hand2: result["4"].scores.segment_2,
          hand3: result["4"].scores.segment_3,
          sum: result["4"].scores_sum,
        },
      });
    }
  };

  const handleSuggestCards = async () => {
    if (isSuggested) {
      setOpenSuggestion(true);
    } else {
      setIsSuggesting(true);
      const data = [...arrangeHand3, ...arrangeHand2, ...arrangeHand1];
      const result = await gameService.getBotSuggestion(
        data,
        gameSettings.BotAddress4
      );

      setIsSuggesting(false);

      if (result) {
        setIsSuggested(true);
        setSuggestData(result.output);
        setOpenSuggestion(true);
      }
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, combine } = result;
    const card = Number(result.draggableId);
    setDragOVerId(null);
    if (destination) {
      if (destination.droppableId != source.droppableId) {
        let destinationCard = UpdateDestinationSlot(
          destination.index,
          card,
          destination.droppableId
        );

        UpdateSourceSlot(
          source.index,
          card,
          destinationCard,
          source.droppableId
        );
      } else {
        UpdateSameSlot(source.index, destination.index, source.droppableId);
      }
    } else if (combine) {
      let index = -1;
      switch (combine.droppableId) {
        case "DropSlot1":
          index = arrangeHand1.indexOf(Number(combine.draggableId));
          break;
        case "DropSlot2":
          index = arrangeHand2.indexOf(Number(combine.draggableId));
          break;
        case "DropSlot3":
          index = arrangeHand3.indexOf(Number(combine.draggableId));
          break;
      }

      if (index > -1) {
        let destinationCard = UpdateDestinationSlot(
          index,
          card,
          combine.droppableId
        );
        UpdateSourceSlot(
          source.index,
          card,
          destinationCard,
          source.droppableId
        );
      }
    }
  };

  const handleOnDragUpdate = (update: DragUpdate) => {
    setDragOVerId(update.combine ? update.combine.draggableId : null);
  };

  const UpdateDestinationSlot = (
    index: number,
    card: number,
    droppableId: string
  ): number => {
    let destinationCard = -1;

    switch (droppableId) {
      case "DropSlot1":
        destinationCard = arrangeHand1[index] ?? destinationCard;
        destinationCard = index == 5 ? arrangeHand1[4] : destinationCard;
        addDraggedCardToSlot(arrangeHand1, setArrangeHand1, 5, card, index);
        break;
      case "DropSlot2":
        destinationCard = arrangeHand2[index] ?? destinationCard;
        destinationCard = index == 5 ? arrangeHand2[4] : destinationCard;
        addDraggedCardToSlot(arrangeHand2, setArrangeHand2, 5, card, index);
        break;
      case "DropSlot3":
        destinationCard = arrangeHand3[index] ?? destinationCard;
        destinationCard = index == 3 ? arrangeHand3[2] : destinationCard;
        addDraggedCardToSlot(arrangeHand3, setArrangeHand3, 3, card, index);
        break;
    }

    return destinationCard;
  };

  const UpdateSourceSlot = (
    index: number,
    card: number,
    destinationCard: number,
    droppableId: string
  ) => {
    switch (droppableId) {
      case "DropSlot1":
        if (destinationCard > -1) {
          arrangeHand1[index] = destinationCard;
          setArrangeHand1([...arrangeHand1]);
        } else {
          removeCardFromSlot(arrangeHand1, card, setArrangeHand1);
        }
        break;
      case "DropSlot2":
        if (destinationCard > -1) {
          arrangeHand2[index] = destinationCard;
          setArrangeHand2([...arrangeHand2]);
        } else {
          removeCardFromSlot(arrangeHand2, card, setArrangeHand2);
        }
        break;
      case "DropSlot3":
        if (destinationCard > -1) {
          arrangeHand3[index] = destinationCard;
          setArrangeHand3([...arrangeHand3]);
        } else {
          removeCardFromSlot(arrangeHand3, card, setArrangeHand3);
        }
        break;
    }
  };

  const UpdateSameSlot = (
    sourceIndex: number,
    destinationIndex: number,
    droppableId: string
  ) => {
    let orderSlot = [] as number[];
    switch (droppableId) {
      case "DropSlot1":
        orderSlot = reorder(arrangeHand1, sourceIndex, destinationIndex);
        setArrangeHand1([...orderSlot]);
        break;
      case "DropSlot2":
        orderSlot = reorder(arrangeHand2, sourceIndex, destinationIndex);
        setArrangeHand2([...orderSlot]);
        break;
      case "DropSlot3":
        orderSlot = reorder(arrangeHand3, sourceIndex, destinationIndex);
        setArrangeHand3([...orderSlot]);
        break;
    }
  };

  const reorder = (
    arr: number[],
    startIndex: number,
    endIndex: number
  ): number[] => {
    const result = Array.from(arr);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const addDraggedCardToSlot = (
    slotData: number[],
    setSlot: Dispatch<SetStateAction<number[]>>,
    limit: number,
    card: number,
    index: number
  ) => {
    if (index < limit) {
      if (slotData.length > index) {
        slotData[index] = card;
      } else {
        slotData.push(card);
      }
    } else {
      slotData[limit - 1] = card;
    }
    setSlot([...slotData]);
  };

  const handleEditHandCard = () => {
    if (currentArrangement !== arrangement.player) {
      setIsSuggested(false);
      setCurrentArrangement(arrangement.player);
    }

    setOpenArrangement(true);
    if (isSettled) {
      setArrangeHand1([...gameData.slot1.hand1]);
      setArrangeHand2([...gameData.slot1.hand2]);
      setArrangeHand3([...gameData.slot1.hand3]);
    }
  };

  const handleStartNewGame = () => {
    setStartNewGame(startNewGame + 1);
    setIsLoading(true);
    setIsSettled(false);
    setIsSuggesting(false);
    setIsSuggested(false);
    setOpenArrangement(true);
  };

  const handleDoneArrange = () => {
    switch (currentArrangement) {
      case arrangement.player:
        setPlayerData([...arrangeHand3, ...arrangeHand2, ...arrangeHand1]);
        gameData.slot1.hand1 = [...arrangeHand1];
        gameData.slot1.hand2 = [...arrangeHand2];
        gameData.slot1.hand3 = [...arrangeHand3];
        break;
      case arrangement.bot1:
        gameData.slot2.hand1 = [...arrangeHand1];
        gameData.slot2.hand2 = [...arrangeHand2];
        gameData.slot2.hand3 = [...arrangeHand3];
        break;
      case arrangement.bot2:
        gameData.slot3.hand1 = [...arrangeHand1];
        gameData.slot3.hand2 = [...arrangeHand2];
        gameData.slot3.hand3 = [...arrangeHand3];
        break;
      case arrangement.bot3:
        gameData.slot4.hand1 = [...arrangeHand1];
        gameData.slot4.hand2 = [...arrangeHand2];
        gameData.slot4.hand3 = [...arrangeHand3];
        break;
    }

    if (isSettled) {
      handleSubmitHandCard();
    }

    setOpenArrangement(false);
  };

  const handleCloseSuggestion = (item: number) => {
    setArrangeHand1([...suggestData[item].segment_1]);
    setArrangeHand2([...suggestData[item].segment_2]);
    setArrangeHand3([...suggestData[item].segment_3]);
    setOpenSuggestion(false);
  };

  const handleCloseSettings = (isSaved: boolean) => {
    setOpenSettings(false);

    if (isSaved) {
      setIsSuggested(false);
      updateGameSettings();
    }
  };

  const handleReArrangeSlot = (slot: string) => {
    if (isSettled) {
      if (currentArrangement !== slot) {
        setIsSuggested(false);
      }
      switch (slot) {
        case arrangement.player:
          setCurrentArrangement(arrangement.player);
          setArrangeHand1([...gameData.slot1.hand1]);
          setArrangeHand2([...gameData.slot1.hand2]);
          setArrangeHand3([...gameData.slot1.hand3]);
          break;
        case arrangement.bot1:
          setCurrentArrangement(arrangement.bot1);
          setArrangeHand1([...gameData.slot2.hand1]);
          setArrangeHand2([...gameData.slot2.hand2]);
          setArrangeHand3([...gameData.slot2.hand3]);
          break;
        case arrangement.bot2:
          setCurrentArrangement(arrangement.bot2);
          setArrangeHand1([...gameData.slot3.hand1]);
          setArrangeHand2([...gameData.slot3.hand2]);
          setArrangeHand3([...gameData.slot3.hand3]);
          break;
        case arrangement.bot3:
          setCurrentArrangement(arrangement.bot3);
          setArrangeHand1([...gameData.slot4.hand1]);
          setArrangeHand2([...gameData.slot4.hand2]);
          setArrangeHand3([...gameData.slot4.hand3]);
          break;
      }

      setOpenArrangement(true);
    }
  };

  const handleChangeSuggestionBot = async (botAddr: string) => {
    setIsSuggesting(true);
    const data = [...arrangeHand3, ...arrangeHand2, ...arrangeHand1];
    let settings = { ...gameSettings };
    settings.BotAddress4 = botAddr;
    setGameSettings(settings);
    localStorage.setItem("settings", JSON.stringify(settings));
    const result = await gameService.getBotSuggestion(data, botAddr);
    setIsSuggesting(false);
    if (result) {
      setIsSuggested(true);
      setSuggestData(result.output);
      setOpenSuggestion(true);
    }
  };

  return countDown > 0 ? (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box alignSelf="center" height="100vh" alignItems="center" display="flex">
        <Typography variant="h3" color={"white"}>
          Start game in {countDown} second(s)
        </Typography>
      </Box>
    </>
  ) : (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p className="rotate">Please rotate your device to landscape</p>
      <div className="main-container">
        <div className="bot-container">
          <div
            className="bot-item bot-2"
            onClick={() => handleReArrangeSlot(arrangement.bot2)}
          >
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot3}
                slotResult={gameResult.slot3}
              />
            ) : (
              <BackHand />
            )}
            <Tooltip title={gameSettings.BotAddress2}>
              <div className="bot-info">
                <div className="bot-profile">
                  <img
                    className="bot-avatar"
                    src="/images/avatar-2.png"
                    alt="bot2"
                  />
                  <span className="bot-name">Bot 2</span>
                </div>

                {isLoadingBot2 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}
              </div>
            </Tooltip>
          </div>
          <div
            className="bot-item bot-1"
            onClick={() => handleReArrangeSlot(arrangement.bot1)}
          >
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot2}
                slotResult={gameResult.slot2}
              />
            ) : (
              <BackHand />
            )}
            <Tooltip title={gameSettings.BotAddress1}>
              <div className="bot-info">
                <div className="bot-profile">
                  <img
                    className="bot-avatar"
                    src="/images/avatar-1.png"
                    alt="bot1"
                  />
                  <span className="bot-name">Bot 1</span>
                </div>

                {isLoadingBot1 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}
              </div>
            </Tooltip>
          </div>
          <div
            className="bot-item bot-3"
            onClick={() => handleReArrangeSlot(arrangement.bot3)}
          >
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot4}
                slotResult={gameResult.slot4}
              />
            ) : (
              <BackHand />
            )}
            <Tooltip title={gameSettings.BotAddress3}>
              <div className="bot-info">
                <div className="bot-profile">
                  <img
                    className="bot-avatar"
                    src="/images/avatar-3.png"
                    alt="bot3"
                  />
                  <span className="bot-name">Bot 3</span>
                </div>

                {isLoadingBot3 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}
              </div>
            </Tooltip>
          </div>
        </div>
        <Dialog
          open={openArrangement}
          maxWidth={false}
          fullWidth
          className="popup-arrangement"
        >
          <DialogContent className="arrangement">
            <div className="drag-drop-container">
              <DragDropContext
                onDragEnd={handleOnDragEnd}
                onDragUpdate={handleOnDragUpdate}
              >
                <Droppable
                  droppableId="DropSlot3"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Front Hand"
                        cards={arrangeHand3}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>
                <Droppable
                  droppableId="DropSlot2"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Middle Hand"
                        cards={arrangeHand2}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>

                <Droppable
                  droppableId="DropSlot1"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Back Hand"
                        cards={arrangeHand1}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>
                <Button
                  style={{
                    display:
                      arrangeHand2.length + arrangeHand1.length > 0
                        ? ""
                        : "none",
                  }}
                  variant="contained"
                  size="small"
                  className="btn-switch"
                >
                  <ImportExport onClick={handleSwitch} fontSize="large" />
                </Button>
              </DragDropContext>
            </div>
            <div className="btn-container">
              <Button
                size="large"
                variant="contained"
                color={isSuggesting ? "warning" : "success"}
                onClick={handleSuggestCards}
              >
                {isSuggesting ? "Waiting..." : "Suggest"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDoneArrange}
                size="large"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <SuggestPopup
          data={suggestData}
          openPopup={openSuggestion}
          handleClosePopup={handleCloseSuggestion}
          handleChangeBot={handleChangeSuggestionBot}
          botAddressList={botAddressList}
          currentSuggestionBot={gameSettings.BotAddress4}
          isSuggesting={isSuggesting}
        />

        <div className="main-player">
          {isSettled ? (
            <SlotResultShow
              slotData={gameData.slot1}
              slotResult={gameResult.slot1}
            />
          ) : (
            <StaticHand cards={playerData} />
          )}
          <div
            className={`main-profile ${isSettled ? "settled" : ""}`}
            onClick={() => handleReArrangeSlot(arrangement.player)}
          >
            <img className="bot-avatar" src="/images/avatar-4.png" alt="bot1" />
            <span className="bot-name">Player</span>
          </div>
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitHandCard}
            >
              Ready
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditHandCard}
            >
              Rearrange
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleStartNewGame}
            >
              New Round
            </Button>
          </div>
        </div>

        <Button
          className="settings"
          color="primary"
          variant="contained"
          onClick={() => {
            setOpenSettings(true);
          }}
        >
          <Settings sx={{ marginRight: 1 }} /> Settings
        </Button>

        <div className="game-name">
          <a
            href="https://kami.com.ph/112525-how-play-pusoy-dos-win.html"
            target="_blank"
          >
            Pusoy (Chinese Poker)
            <Help />
          </a>{" "}
          <p>(Testing...)</p>
        </div>

        <GameSettingsPopup
          title="Settings"
          openPopup={openSettings}
          handleClosePopup={handleCloseSettings}
        />
      </div>
    </>
  );
}

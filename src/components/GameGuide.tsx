import {
    Container,
    Modal,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
} from "@mui/material";
import styles from "./GameGuide.module.scss";
import { Barlow } from "next/font/google";
import { showNatural } from "@/helpers";
import { useMemo, useState } from "react";
import { howToPlay, ranking, scoring } from "@/helpers/contents";
import Image from "next/image";
import { segmentTypeMap } from "@/helpers/cards";

export interface ScoreConfig {
    id: number;
    break_score: number;
    normal_score: number;
    natural_score: {
        three_flushes?: number;
        three_straight?: number;
        six_pairs?: number;
        three_straight_flushes?: number;
        dragon?: number;
        super_dragon?: number;
    };
    bonus_score: {
        [key: string]: number;
    };
    super_bonus_score: number;
}

interface RoyaltiesData {
    front: string;
    frontUnits: string;
    middle: string;
    middleUnits: string;
    back: string;
    backUnits: string;
}

interface NaturalsData {
    name: string;
    value: number;
}

const barlow = Barlow({ weight: "400", subsets: ["latin"] });

const GameGuide = ({
    open,
    handleClose,
    scoreConfig,
}: {
    open: boolean;
    handleClose: () => void;
    scoreConfig: ScoreConfig;
}) => {
    const [tab, setTab] = useState(1);
    const handleOnChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const royalties = useMemo(() => {
        let front: { segmentType: string | null; value: number }[] = [];
        let middle = [...front];
        let back = [...front];
        Object.entries(scoreConfig.bonus_score).forEach(([key, value]) => {
            const [segment, position] = key.split(".");
            console.log(position, segment);
            const segmentType = segmentTypeMap[Number.parseInt(segment || "0")];
            if (position === "front") {
                front.push({ segmentType, value });
            } else if (position === "middle") {
                middle.push({ segmentType, value });
            } else if (position === "back") {
                back.push({ segmentType, value });
            }
        });
        front.sort((a, b) => a.value - b.value);
        middle.sort((a, b) => a.value - b.value);
        back.sort((a, b) => a.value - b.value);
        const maxLength = Math.max(front.length, middle.length, back.length);
        const result: RoyaltiesData[] = [];
        for (let i = 0; i < maxLength; i++) {
            result.push({
                front: front[i]?.segmentType ?? "-",
                frontUnits: front[i]?.value ? `${front[i].value}` : "-",
                middle: middle[i]?.segmentType ?? "-",
                middleUnits: middle[i]?.value ? `${middle[i].value}` : "-",
                back: back[i]?.segmentType ?? "-",
                backUnits: back[i]?.value ? `${back[i].value}` : "-",
            });
        }

        console.log(result);
        return result;
    }, [scoreConfig.bonus_score]);

    const naturals = useMemo(() => {
        let result: NaturalsData[] = [];
        Object.entries(scoreConfig.natural_score).forEach(([key, value]) => {
            result.push({ name: showNatural[key], value });
        });
        result.sort((a, b) => a.value - b.value);
        return result;
    }, [scoreConfig.natural_score]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container>
                <div
                    className={`${styles["guide-container"]} ${barlow.className}`}
                >
                    <div className={styles["guide-tabs"]}>
                        <Tabs
                            value={tab}
                            onChange={handleOnChange}
                            centered={false}
                        >
                            <Tab label="How to play" value={1} />
                            <Tab label="Ranking" value={2} />
                            <Tab label="Winning & Scoring" value={3} />
                        </Tabs>
                    </div>
                    <div className={styles["guide-content"]}>
                        {tab === 1 && <HowToPlayBlock />}
                        {tab === 2 && <RankingBlock />}
                        {tab === 3 && (
                            <WinningScoringBlock
                                royalties={royalties}
                                naturals={naturals}
                            />
                        )}
                    </div>
                </div>
            </Container>
        </Modal>
    );
};

const HowToPlayBlock = () => {
    return (
        <>
            {howToPlay.p1}
            <br />
            {howToPlay.p2}
            <ul className={styles["guide-list"]}>
                <li>{howToPlay.p3}</li>
                <li>{howToPlay.p4}</li>
                <div>
                    <div className={styles["card-segment-container"]}>
                        <div className={styles["card-segment"]}>
                            {["2_spades", "2_clubs", "2_hearts"].map((card) => (
                                <div
                                    key={crypto.randomUUID()}
                                    className={styles["card"]}
                                >
                                    <Image
                                        src={`/images/${card}.png`}
                                        alt={card}
                                        fill
                                        objectFit="contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <hr style={{ width: "7.6rem" }} />
                        <span className={styles["highlight"]}>
                            {"The Front"}
                        </span>
                    </div>
                    <div className={styles["card-segment-container"]}>
                        <div className={styles["card-segment"]}>
                            {[
                                "3_spades",
                                "3_clubs",
                                "3_diamonds",
                                "4_hearts",
                                "4_diamonds",
                            ].map((card) => (
                                <div
                                    key={crypto.randomUUID()}
                                    className={styles["card"]}
                                >
                                    <Image
                                        src={`/images/${card}.png`}
                                        alt={card}
                                        fill
                                        objectFit="contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <hr style={{ width: "5rem" }} />
                        <span className={styles["highlight"]}>
                            {"The Middle"}
                        </span>
                    </div>
                    <div className={styles["card-segment-container"]}>
                        <div className={styles["card-segment"]}>
                            {[
                                "K_spades",
                                "K_clubs",
                                "K_hearts",
                                "K_diamonds",
                                "A_hearts",
                            ].map((card) => (
                                <div
                                    className={styles["card"]}
                                    key={crypto.randomUUID()}
                                >
                                    <Image
                                        src={`/images/${card}.png`}
                                        alt={card}
                                        fill
                                        objectFit="contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <hr style={{ width: "5rem" }} />
                        <span className={styles["highlight"]}>
                            {"The Back"}
                        </span>
                    </div>
                </div>
            </ul>
            <br />
            {howToPlay.p5}
            <br />
            <div style={{ marginTop: "1rem" }}>
                <span className={styles["highlight"]}>Note:</span>{" "}
                {howToPlay.note}
            </div>
        </>
    );
};

const RankingBlock = () => {
    return (
        <>
            {ranking.p1}
            <ul style={{ marginBottom: "1rem", marginTop: "0.2rem" }}>
                <li className={styles["highlight"]}>
                    {ranking.p2}{" "}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[
                            "A",
                            "K",
                            "Q",
                            "J",
                            "10",
                            "9",
                            "8",
                            "7",
                            "6",
                            "5",
                            "4",
                            "3",
                            "2",
                        ].map((card) => (
                            <div key={card} className={styles["card"]}>
                                <Image
                                    src={`/images/${card}_hearts.png`}
                                    alt={`${card}_hearts`}
                                    fill
                                    objectFit="contain"
                                />
                            </div>
                        ))}
                    </div>{" "}
                </li>
                <li className={styles["highlight"]}>
                    {ranking.p4} <br />{" "}
                    <span className={styles["normal-text"]}>
                        Royal Flush - High card
                    </span>
                </li>
            </ul>
            <span className={styles["highlight"]}>NOTE:</span> <br />
            {ranking.note1}
        </>
    );
};

const WinningScoringBlock = ({
    royalties,
    naturals,
}: {
    royalties: RoyaltiesData[];
    naturals: NaturalsData[];
}) => {
    return (
        <>
            {scoring.p1} <br />
            <div
                className={styles["highlight"]}
                style={{
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    marginBottom: "0.5rem",
                    marginTop: "0.5rem",
                }}
            >
                SPECIAL CASE:
            </div>
            <ul className={styles["guide-list-special"]}>
                <li>
                    <h3>ROYALTIES</h3>
                    <span className={styles["normal-text"]}>
                        {scoring.p2}
                        <div className={styles["table-container"]}>
                            <TableContainer className={styles["table"]}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {[
                                                "Front",
                                                "Units",
                                                "Middle",
                                                "Units",
                                                "Back",
                                                "Units",
                                            ].map((title) => (
                                                <TableCell
                                                    key={crypto.randomUUID()}
                                                >
                                                    {title}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {royalties.map((royalty) => (
                                            <TableRow key={crypto.randomUUID()}>
                                                {[
                                                    royalty.front,
                                                    royalty.frontUnits,
                                                    royalty.middle,
                                                    royalty.middleUnits,
                                                    royalty.back,
                                                    royalty.backUnits,
                                                ].map((value) => (
                                                    <TableCell
                                                        key={crypto.randomUUID()}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </span>
                </li>
                <li>
                    <h3>NATURALS</h3>
                    <span className={styles["normal-text"]}>
                        {scoring.p3}
                        <div className={styles["table-container"]}>
                            <TableContainer className={styles["table"]}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Hands</TableCell>
                                            <TableCell>Units</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {naturals.map((natural) => (
                                            <TableRow key={crypto.randomUUID()}>
                                                {[
                                                    natural.name,
                                                    natural.value,
                                                ].map((value) => (
                                                    <TableCell
                                                        key={crypto.randomUUID()}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </span>
                </li>
                <li>
                    <h3>PUSOY</h3>
                    <span className={styles["normal-text"]}>
                        {scoring.p4}
                        <br />
                        X: {scoring.x_note} <br />
                        A: {scoring.a_note} <br />
                        B: {scoring.b_note} <br />
                        C: {scoring.c_note}
                    </span>
                </li>
            </ul>
            <br />
        </>
    );
};
export default GameGuide;

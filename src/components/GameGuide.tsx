import { Container, Modal } from "@mui/material";
import styles from "./GameGuide.module.scss";
import { Barlow } from "next/font/google";
import { showSpecialCase } from "@/helpers";

export interface ScoreConfig {
    id: number;
    break_score: number;
    normal_score: number;
    natural_score: {
        three_flushes: number;
        three_straight: number;
        six_pairs: number;
        three_straight_flushes: number;
        dragon: number;
        super_dragon: number;
    };
    bonus_score: {
        [key: string]: number;
    };
    super_bonus_score: number;
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
                    <h2>Pusoy Settle Rules</h2>
                    <div className={styles["guide-content"]}>
                        With <span className={styles["formular"]}>n</span>{" "}
                        players participating in the game, after receiving the
                        players&apos;s arrangement, proceed with the following
                        steps:
                        <ol className={styles["guide-list"]}>
                            <li>
                                Check to see if the current player&apos;s
                                arrangement is broken. If the arrangement is
                                broken, the other players will have{" "}
                                <span className={styles["formular"]}>
                                    {scoreConfig.break_score}
                                </span>{" "}
                                points added, and the current player will have{" "}
                                <span className={styles["formular"]}>
                                    (n - 1) * {scoreConfig.break_score}
                                </span>{" "}
                                points deducted.
                            </li>
                            <li>
                                Check to see if the current player&apos;s set of
                                cards is natural win or not. If the set is
                                natural win, the other players will have their{" "}
                                <span className={styles["formular"]}>x</span>{" "}
                                points deducted, and the house under
                                consideration will be added to{" "}
                                <span className={styles["formular"]}>
                                    (n - 1) * x
                                </span>{" "}
                                points. The{" "}
                                <span className={styles["formular"]}>x</span> is
                                depends on the natural type:
                                <ul className={styles["guide-list"]}>
                                    <li>
                                        Three Flushes:{" "}
                                        {
                                            scoreConfig.natural_score
                                                .three_flushes
                                        }{" "}
                                        points
                                    </li>
                                    <li>
                                        Three Straight:{" "}
                                        {
                                            scoreConfig.natural_score
                                                .three_straight
                                        }{" "}
                                        points
                                    </li>
                                    <li>
                                        Six Pairs:{" "}
                                        {scoreConfig.natural_score.six_pairs}{" "}
                                        points
                                    </li>
                                    <li>
                                        Dragon:{" "}
                                        {scoreConfig.natural_score.dragon}{" "}
                                        points
                                    </li>
                                    <li>
                                        Super Dragon:{" "}
                                        {scoreConfig.natural_score.super_dragon}{" "}
                                        points
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Each pair of{" "}
                                <span className={styles["formular"]}>n</span>{" "}
                                players compares their hand to each other; the
                                higher hand will be added with{" "}
                                <span className={styles["formular"]}>
                                    {scoreConfig.normal_score}
                                </span>{" "}
                                point, losing will subtract{" "}
                                <span className={styles["formular"]}>
                                    {scoreConfig.normal_score}
                                </span>{" "}
                                point, and drawing will neither add nor
                                subtract. During the comparison process, if that
                                hand wins with special cases, the winner will
                                receive an additional{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                points, and the loser will subtract{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                points. In addition, if three hands lose (the
                                pusoy), the loser will have{" "}
                                <span className={styles["formular"]}>
                                    {scoreConfig.super_bonus_score}
                                </span>{" "}
                                points deducted, and the winner will have{" "}
                                <span className={styles["formular"]}>
                                    {scoreConfig.super_bonus_score}
                                </span>{" "}
                                points added. The{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                depends on the special case:
                                <ul className={styles["guide-list"]}>
                                    {Object.entries(
                                        scoreConfig.bonus_score
                                    ).map(([key, value]) => (
                                        <li key={key}>
                                            {showSpecialCase(key)}: {value}{" "}
                                            points
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ol>
                        <b>Notes:</b>
                        <ul>
                            <li>
                                If the player has a broken arrangement, the
                                player&apos;s set of cards will not be
                                considered a natural win. If the player has a
                                broken arrangement or their set of cards is a
                                natural win, the hand comparison will not
                                proceed.
                            </li>
                            <li>
                                A player can both have points deducted due to a
                                broken arrangement and have points deducted due
                                to a natural win by another player. For example,
                                if player A has a broken arrangement and
                                existing player B in that game has a natural win
                                set of cards, Player A will have{" "}
                                <span className={styles["formular"]}>
                                    x + {scoreConfig.break_score}
                                </span>{" "}
                                points deducted.
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>
        </Modal>
    );
};

export default GameGuide;

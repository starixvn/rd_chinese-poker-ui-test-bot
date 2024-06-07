import { Box, Container, Modal, Typography } from "@mui/material";
import styles from "./GameGuide.module.scss";
import { Barlow } from "next/font/google";

const barlow = Barlow({ weight: "400", subsets: ["latin"] });

const GameGuide = ({
    open,
    handleClose,
}: {
    open: boolean;
    handleClose: () => void;
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
                    <h2>Chinese Poker Settle Rules</h2>
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
                                <span className={styles["formular"]}>6</span>{" "}
                                points added, and the current player will have{" "}
                                <span className={styles["formular"]}>
                                    (n - 1) * 6
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
                                    <li>Three Flushes: 3 points</li>
                                    <li>Three Straight: 3 points</li>
                                    <li>Six Pairs: 6 points</li>
                                    <li>Dragon: 6 points</li>
                                    <li>Super Dragon: 6 points</li>
                                </ul>
                            </li>
                            <li>
                                Each pair of{" "}
                                <span className={styles["formular"]}>n</span>{" "}
                                players compares their hand to each other; the
                                higher hand will be added with{" "}
                                <span className={styles["formular"]}>1</span>{" "}
                                point, losing will subtract{" "}
                                <span className={styles["formular"]}>1</span>{" "}
                                point, and drawing will neither add nor
                                subtract. During the comparison process, if that
                                hand wins with special cases, the winner will
                                receive an additional{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                points, and the loser will subtract{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                points. In addition, if three hands lose (the
                                pusoy), the loser will have{" "}
                                <span className={styles["formular"]}>9</span>{" "}
                                points deducted, and the winner will have{" "}
                                <span className={styles["formular"]}>9</span>{" "}
                                points added. The{" "}
                                <span className={styles["formular"]}>y</span>{" "}
                                depends on the special case:
                                <ul className={styles["guide-list"]}>
                                    <li>Three Of A Kind in front: 4 points</li>
                                    <li>Full House in middle: 7 points</li>
                                    <li>Four Of A Kind in middle: 8 points</li>
                                    <li>Straight Flush in middle: 9 points</li>
                                    <li>Four Of A Kind in back: 8 points</li>
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
                                    x + 6
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

import Phaser from "phaser";
import IconButton from "../components/IconButton";
import Panel from "../components/Panel";
import WindowPanel from "../components/WindowPanel";

import Alert from "../components/Alert";
import GameOverModal from "../components/GameOverModal";
import InfoModal from "../components/InfoModal";
import RegisterForm from "../components/RegisterForm";
import ScrollBarContent from "../components/ScrollBarContent";
import TutorialStep from "../components/TutorialStep";
import WelcomeModal from "../components/WelcomeModal";
import { getLeaderboard, registerUser, updateUserScore } from "../firebase";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });

        this.rotateDom = null;
        this.setInitialValues();
    }
    preload() {

    }
    setInitialValues() {
        this.rotateDom = null;
        this.inventoryList = null;
        this.inboundsList = null;
        this.outboundsList = null;
        this.leaderBoardList = null;
        this.costsList = [];
        this.scoreList = [];
        this.totalTrucks = 4;
        this.currentTime = {
            hours: 6,
            minutes: 0
        }
        this.boundLines = [null, null, null];
        this.isModalOpen = false;
        this.isGameRunning = false;
        this.userId = null;
        this.canStart = true;
        this.canAddIntoLine = true;

        this.inventory = [
            {
                "A": 20
            },
            {
                "B": 20
            },
            {
                "C": 20
            },
            {
                "D": 20
            },
            {
                "E": 20
            }
        ]
        this.inbounds = [
            {
                "Trip": "1",
                "Time on Lot": 21,
                "Items": {
                    "A": 20,
                    "B": 10,
                    "C": null,
                    "D": null,
                    "E": null
                },
                "Work Time": {
                    "hours": 6,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "2",
                "Time on Lot": 15,
                "Items": {
                    "A": null,
                    "B": 10,
                    "C": 10,
                    "D": 10,
                    "E": null
                },
                "Work Time": {
                    "hours": 6,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "3",
                "Time on Lot": 12,
                "Items": {
                    "A": null,
                    "B": null,
                    "C": 10,
                    "D": null,
                    "E": 10
                },
                "Work Time": {
                    "hours": 4,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "4",
                "Time on Lot": 4,
                "Items": {
                    "A": 10,
                    "B": null,
                    "C": null,
                    "D": 10,
                    "E": null
                },
                "Work Time": {
                    "hours": 4,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "5",
                "Time on Lot": 16,
                "Items": {
                    "A": null,
                    "B": null,
                    "C": 10,
                    "D": null,
                    "E": 20
                },
                "Work Time": {
                    "hours": 6,
                    "minutes": 0
                },
                "Status": "Not_Started"
            }
        ]
        this.outbounds = [
            {
                "Trip": "A",
                "Ship Time": {
                    "hours": 8,
                    "minutes": 0
                },
                "Items": {
                    "A": 15,
                    "B": null,
                    "C": 5,
                    "D": 5,
                    "E": null
                },
                "Work Time": {
                    "hours": 5,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "B",
                "Ship Time": {
                    "hours": 11,
                    "minutes": 0
                },
                "Items": {
                    "A": null,
                    "B": 10,
                    "C": null,
                    "D": null,
                    "E": 15
                },
                "Work Time": {
                    "hours": 5,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "C",
                "Ship Time": {
                    "hours": 12,
                    "minutes": 0
                },
                "Items": {
                    "A": 10,
                    "B": null,
                    "C": null,
                    "D": 20,
                    "E": null
                },
                "Work Time": {
                    "hours": 6,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "D",
                "Ship Time": {
                    "hours": 15,
                    "minutes": 0
                },
                "Items": {
                    "A": 5,
                    "B": 5,
                    "C": 5,
                    "D": null,
                    "E": 10
                },
                "Work Time": {
                    "hours": 5,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "E",
                "Ship Time": {
                    "hours": 18,
                    "minutes": 0
                },
                "Items": {
                    "A": null,
                    "B": 10,
                    "C": 5,
                    "D": 5,
                    "E": null
                },
                "Work Time": {
                    "hours": 6,
                    "minutes": 0
                },
                "Status": "Not_Started"
            },
            {
                "Trip": "F",
                "Ship Time": {
                    "hours": 22,
                    "minutes": 0
                },
                "Items": {
                    "A": null,
                    "B": 15,
                    "C": 10,
                    "D": null,
                    "E": null
                },
                "Work Time": {
                    "hours": 5,
                    "minutes": 0
                },
                "Status": "Not_Started"
            }
        ]
        this.costs = [
            {
                "Inbound Not Unloaded (24 Hours)": 100
            },
            {
                "Late Outbound": 500
            },
            {
                "Inventory Not Shipped": 1000
            }
        ]
        this.score = [
            {
                "Late Inbounds": 0
            },
            {
                "Late Outbounds": 0
            },
            {
                "Inventory Not Shipped": 0
            },
            {
                "Total Score": 0
            }
        ]
        this.leaderBoard = [];
    }
    getLeaderboardData = async () => {
        this.leaderBoard = await getLeaderboard();
        this.renderLeaderBoard();
    }
    create() {
        this.setInitialValues();

        this.userId = localStorage.getItem("userId") || null;
        this.bg = this.add.image(430, 90, "bg").setOrigin(0).setScale(0.48, 0.525);
        this.topWindowPanel = new WindowPanel(this, 0, 5, this.game.config.width, 65);
        this.logo = this.add.text(15, 6.25, "WAREHOUSE", {
            font: "64px BitCell",
            fill: "#fff"
        }).setOrigin(0, 0);
        const startBtn = new IconButton(this, this.game.config.width - 82, 32.5, "greenBtn", "greenBtnDown", "greenBtnHover", "play", () => {
            if (this.isGameRunning && !this.isModalOpen && this.canStart) {
                let totalNotNulls = this.boundLines.filter((b) => b !== null).length;
                if (totalNotNulls > 0) {
                    let totalUsedTrucks = this.boundLines.reduce((acc, b) => {
                        return acc + (b !== null ? b.LTO : 0);
                    }, 0);
                    if (totalUsedTrucks === 0) {
                        this.isModalOpen = true;
                        new Alert(this, "NO TRUCKS!", "Please assign trucks to the lines before starting the game.", () => {
                            this.isModalOpen = false;
                        });
                    }
                    else {
                        this.canStart = false;
                        const boundsWorkTimes = this.boundLines.map((b) => {
                            if (b !== null) {
                                return b.bound["Work Time"].hours * 60 + b.bound["Work Time"].minutes;
                            }
                            return 0;
                        });
                        const boundsTrucks = this.boundLines.map((b) => {
                            if (b !== null) {
                                return b.LTO;
                            }
                            return 0;
                        });
                        const totalBoundsWorkTime = boundsWorkTimes.map((b, i) => {
                            if (b === 0 || boundsTrucks[i] === 0) return 0;
                            return b / boundsTrucks[i];
                        });
                        let boundLineIdxs = []
                        let boundLineIdx = 0;
                        let minTime = totalBoundsWorkTime.reduce((acc, b, idx) => {
                            if (b === 0) return acc;
                            if (acc === 0) return b;
                            if (b <= acc) {
                                boundLineIdx = idx;
                                return b;
                            }
                            return acc;
                        }, 100000);
                        const minHours = Math.floor(minTime / 60);
                        const minMinutes = Math.floor(minTime % 60);
                        this.currentTime = this.addTime(this.currentTime.hours, this.currentTime.minutes, minHours, minMinutes);

                        for (let i = 0; i < this.boundLines.length; i++) {
                            if (this.boundLines[i] !== null && this.boundLines[i].LTO > 0 && totalBoundsWorkTime[i] === minTime) {
                                boundLineIdxs.push(i);
                            }
                        }
                        const updateBoundLine = (boundLineIdx) => {
                            for (let i = 0; i < this.boundLines.length; i++) {
                                if (this.boundLines[i] !== null && this.boundLines[i].LTO > 0) {
                                    let t = this.subtractTime(this.boundLines[i].bound["Work Time"].hours, this.boundLines[i].bound["Work Time"].minutes, minHours, minMinutes)
                                    this.boundLines[i].bound["Work Time"] = {
                                        "hours": t.hours,
                                        "minutes": t.minutes
                                    }
                                    this.boundLines[i].bound.Status = "In_Progress";
                                }
                            }
                            for (let i = 0; i < this.inbounds.length; i++) {
                                if (this.inbounds[i]["Status"] !== "Completed") {
                                    this.inbounds[i]["Time on Lot"] += (minHours + Math.ceil(minMinutes / 60));
                                }
                            }
                            this.boundLines[boundLineIdx].bound["Work Time"] = {
                                "hours": 0,
                                "minutes": 0
                            };
                            let boundItems = Object.keys(this.boundLines[boundLineIdx].bound.Items);
                            let totalNotShipped = 0;
                            this.inventory.forEach((item) => {
                                let itemKey = Object.keys(item)[0];
                                if (boundItems.includes(itemKey)) {
                                    if (this.boundLines[boundLineIdx].boundType === "in") {
                                        item[itemKey] += this.boundLines[boundLineIdx].bound.Items[itemKey];
                                    }
                                    else {
                                        item[itemKey] -= this.boundLines[boundLineIdx].bound.Items[itemKey];

                                        if (item[itemKey] < 0) {
                                            totalNotShipped += Math.abs(item[itemKey]);
                                            item[itemKey] = 0;
                                        }
                                    }
                                }
                            });
                            if (this.boundLines[boundLineIdx].boundType === "out") {
                                this.score[2]["Inventory Not Shipped"] += totalNotShipped * this.costs[2]["Inventory Not Shipped"];
                                this.score[3]["Total Score"] += totalNotShipped * this.costs[2]["Inventory Not Shipped"];

                                let totalDeltaTime = this.subtractTime(this.currentTime.hours, this.currentTime.minutes, this.boundLines[boundLineIdx].bound["Ship Time"].hours, this.boundLines[boundLineIdx].bound["Ship Time"].minutes);
                                if (totalDeltaTime.minutes >= 0) {
                                    totalDeltaTime.hours += Math.ceil(totalDeltaTime.minutes / 60);
                                }
                                if (totalDeltaTime.hours > 0) {
                                    this.score[1]["Late Outbounds"] += (totalDeltaTime.hours * this.costs[1]["Late Outbound"]);
                                    this.score[3]["Total Score"] += (totalDeltaTime.hours * this.costs[1]["Late Outbound"]);
                                }
                            }
                            else {
                                if (this.boundLines[boundLineIdx].bound["Time on Lot"] > 24) {
                                    let deltaHours = this.boundLines[boundLineIdx].bound["Time on Lot"] - 24;
                                    this.score[0]["Late Inbounds"] += this.costs[0]["Inbound Not Unloaded (24 Hours)"] * deltaHours;
                                    this.score[3]["Total Score"] += this.costs[0]["Inbound Not Unloaded (24 Hours)"] * deltaHours;
                                }
                            }
                            this.boundLines[boundLineIdx].bound.Status = "Completed";
                            this.totalTrucks += this.boundLines[boundLineIdx].LTO;
                            this.trucksText.setText(`Lift Truck Operators: ${this.totalTrucks}`);
                            this.boundLines[boundLineIdx].destroy();
                            this.boundLines[boundLineIdx] = null;
                            this.renderInBounds();
                            this.renderOutBounds();
                            this.renderInventory();
                            this.renderScore();
                            this.renderTime();
                            this.evaluate();
                        }

                        for (let i = 0; i < boundLineIdxs.length; i++) {
                            updateBoundLine(boundLineIdxs[i]);
                        }
                        this.canStart = true;
                    }
                }
                else {
                    this.isModalOpen = true;
                    new Alert(this, "No trips planned!", "Please add up to 3 trips and assign labor to them to get started!", () => {
                        this.isModalOpen = false;
                    });
                }
            }
        });
        this.infoBtn = new IconButton(this, this.game.config.width - 35, 32.5, "goldBtn", "goldBtnDown", "goldBtnHover", "infoBrown", () => {
            this.isModalOpen = true;
            let infoModal = new InfoModal(this, () => {
                this.isModalOpen = false;
            });
        });
        this.timePanel = new Panel(this, this.game.config.width - 230, 16, "universalPanel1", 120, 35, "universalPanel1TBevel");
        this.clockIcon = this.add.image(20, 18, "clock").setScale(3);
        this.timePanel.add(this.clockIcon);
        this.timeText = this.add.text(40, 18,
            this.getTimeStr(this.currentTime.hours, this.currentTime.minutes), {
            font: "34px VT323",
            fill: "#fff"
        }).setOrigin(0, 0.5);
        this.timePanel.add(this.timeText);
        this.trucksPanel = new Panel(this, this.game.config.width - 475, 16, "universalPanel1", 240, 35, "universalPanel1TBevel");
        this.trucksText = this.add.text(9, 18, "Lift Truck Operators: 4", {
            font: "24px VT323",
            fill: "#fff"
        }).setOrigin(0, 0.5);
        this.trucksPanel.add(this.trucksText);
        this.topWindowPanel.add([this.logo, startBtn, this.infoBtn, this.timePanel, this.trucksPanel]);

        this.inboundsWindowPanel = new WindowPanel(this, 0, 90, 420, 340, "Inbounds");
        this.outboundsWindowPanel = new WindowPanel(this, 0, 445, 420, 340, "Outbounds");

        this.inventoryWindowPanel = new WindowPanel(this, 430, 445, 320, 340, "Inventory");
        this.costsWindowPanel = new WindowPanel(this, 755, 445, 235, 340, "Costs");

        this.scoreWindowPanel = new WindowPanel(this, 1000, 90, 200, 265, "Score");
        this.leaderBoardWindowPanel = new WindowPanel(this, 1000, 370, 200, 415, "Leaderboard");


        this.isModalOpen = true;
        new WelcomeModal(this, () => {
            new TutorialStep(this, -150, -100, null, "Tutorial", "Do you want to take the tutorial?", "NO", "YES", () => {
                this.isModalOpen = false;
                this.isGameRunning = true;
            }, () => {
                new TutorialStep(this, 220, -310, {
                    x: 720,
                    y: 15,
                    width: 375,
                    height: 45,
                    mask2: true,
                    x2: 428,
                    y2: 435,
                    width2: 323,
                    height2: 352
                }, "Step 1/4", "Review how much inventory and labor you have in the facility. Notice that you only have 3 dock doors that you can operate at once!", "SKIP", "NEXT", () => {
                    this.isModalOpen = false;
                    this.isGameRunning = true;
                }, () => {
                    new TutorialStep(this, -170, -210, {
                        x: 0,
                        y: 75,
                        width: 420,
                        height: 710
                    }, "Step 2/4", "Look at all of the Shipments needing to ship and the inbounds needing to be unloaded. Be careful to review what inventory is on each. Click on the inbounds or outbounds you want to work to each lane", "SKIP", "NEXT", () => {
                        this.isModalOpen = false;
                        this.isGameRunning = true;
                    }, () => {
                        let temp = this.createBoundForLine(0, null, this.inbounds[0], "in");
                        new TutorialStep(this, -160, 30, {
                            x: 510,
                            y: 290,
                            width: 155,
                            height: 120
                        }, "Step 3/4", "Assign how many people you want to work each inbound or outbound The more people you assign, the faster they'll get the work done!", "SKIP", "NEXT", () => {
                            this.isModalOpen = false;
                            this.isGameRunning = true;
                            temp.destroy();
                        }, () => {
                            temp.destroy();
                            new TutorialStep(this, 280, -310, {
                                x: 1095,
                                y: 15,
                                width: 46,
                                height: 46
                            }, "Step 4/4", "Click the play button and let the site work! As each load completes, you can put another in the door and rebalance labor across all 3 loads! Play until all of the work is complete, and see your final score! The lower your score, the better you've done!", null, "PLAY", null, () => {
                                this.isModalOpen = false;
                                this.isGameRunning = true;
                            });
                        });
                    });
                });
            });
        });

        this.renderInventory();
        this.renderInBounds();
        this.renderOutBounds();
        this.renderCosts();
        this.renderScore();
        this.renderLeaderBoard();
        void this.getLeaderboardData();
    }
    subtractTime(hour1, mint1, hour2, mint2) {
        let totalMinutes = (hour1 * 60 + mint1) - (hour2 * 60 + mint2);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = Math.floor(totalMinutes % 60);
        return { hours, minutes };
    }
    addTime(hour1, mint1, hour2, mint2) {
        let totalMinutes = (hour1 * 60 + mint1) + (hour2 * 60 + mint2);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = Math.floor(totalMinutes % 60);
        return { hours, minutes };
    }
    async evaluate() {
        let inboundsCompleted = this.inbounds.every((bound) => bound.Status === "Completed");
        let outboundsCompleted = this.outbounds.every((bound) => bound.Status === "Completed");
        if (inboundsCompleted && outboundsCompleted) {
            this.isGameRunning = false;
            this.isModalOpen = true;
            if (this.userId !== null) {
                await updateUserScore(this.userId, this.score[3]["Total Score"]);
                new GameOverModal(this, "Game Over", "Your game has been completed. Your score is " + this.score[3]["Total Score"] + ". Thank you for playing!");
            }
            else {
                let registerationForm = new RegisterForm(this, async (username) => {
                    if (username !== "") {
                        let res = await registerUser(username, this.score[3]["Total Score"]);
                        if (res === false) {
                            alert("Already exists user with this username");
                            return;
                        }
                        if (res === null) {
                            alert("Error in registering user");
                            return;
                        }

                        this.userId = res;
                        localStorage.setItem("userId", this.userId);
                        registerationForm.destroy();
                        new GameOverModal(this, "Game Over", "Your game has been completed. Your score is " + this.score[3]["Total Score"] + ". Thank you for playing!");
                    }
                    else {
                        alert("Please enter username");
                    }
                });
            }
        }
    }
    getTimeStr(hours, mints) {
        return `${hours < 10 ? "0" + hours : hours}:${mints < 10 ? "0" + mints : mints}`;
    }
    renderTime() {
        this.timeText.setText(this.getTimeStr(this.currentTime.hours, this.currentTime.minutes));
    }
    addContainer = (x, y, width, height, key, value, fontSize = 24, paddingX = 5) => {
        let itemContainer = this.add.container(x, y);
        let bg = new Panel(this, 12, 0, "universalPanel1", width, height, "universalPanel1TBevel", "universalPanel1BBevel");
        let text = this.add.text(20 + paddingX, 5, `${key}`, {
            font: fontSize + "px VT323",
            fill: "#fff"
        }).setOrigin(0, 0).setWordWrapWidth(145);
        let itemText = this.add.text(width + 2 - paddingX, 5, `${value}`, {
            font: fontSize + "px VT323",
            fill: "#fff"
        }).setOrigin(1, 0);
        itemContainer.add([bg, text, itemText]);
        return itemContainer;
    }
    addBoundContainer(x, y, width, height, values, fontSize = 20, closeCallback = null) {
        let boundContainer = this.add.container(x, y);
        let bg = new Panel(this, 12, 0, "universalPanel1", width, height, "universalPanel1TBevel", "universalPanel1BBevel");
        boundContainer.add(bg);
        let textWidth = 70;
        let xValue = 20;
        let highestHeight = height;
        values.forEach((value, i) => {
            if (i !== values.length - 1) {
                let textValue = value;
                if (typeof value === 'object') {
                    textValue = Object.keys(value).map((key) => {
                        return value[key] !== null ? `(${key}: ${value[key]})` : null;
                    }).filter((val) => val !== null).join(", ");
                }
                let text = this.add.text(xValue, 10, `${textValue}`, {
                    font: fontSize + "px VT323",
                    fill: i === 3 ? "#DDC775" : "#fff"
                }).setOrigin(0, 0).setWordWrapWidth(textWidth + (i === 0 ? -20 : 0) + (i === 2 ? 70 : 0));
                boundContainer.add(text);
                xValue = xValue + textWidth + (i === 0 ? -20 : 0) + (i === 2 ? 80 : 0);
                if (text.height + 20 > highestHeight) {
                    highestHeight = text.height + 20;
                    bg.setSize(width, highestHeight);
                }
            }
        });
        if (values[4] === "Completed") {
            let closeButton = new IconButton(this, width - 1, 13, "goldBtn", "goldBtnDown", "goldBtnHover", "x", () => {
                if (this.isModalOpen) return;
                if (closeCallback !== null) {
                    closeCallback();
                }
            }, true, 0.5);
            boundContainer.add(closeButton);
        }
        boundContainer.height = highestHeight;
        return boundContainer;
    }
    setBoundTint = (boundContainer, bound) => {
        const panelBg = boundContainer.getAt(0);
        if (bound.Status === "Not_Started") {
            panelBg.changeTint(null);
        }
        else if (bound.Status === "Started" || bound.Status === "In_Progress") {
            panelBg.changeTint(0x9c8340, 0x382d0e, 0x382d0e);
        }
        else if (bound.Status === "Completed") {
            panelBg.changeTint(0x328a58, 0x0f301d, 0x0f301d);
        }
    }
    createBoundForLine(idx, boundContainer, bound, boundType) {
        const container = this.add.container(590 + idx * 130, 340 + (idx == 1 ? - 30 : 0));
        container.boundContainer = boundContainer;
        container.bound = bound;
        container.boundType = boundType;
        container.LTO = 0;
        const item = this.add.image(-5, 0, "item").setScale(0.25);
        const closeBtn = new IconButton(this, 35, -30, "goldBtn", "goldBtnDown", "goldBtnHover", "x", () => {
            if (this.isModalOpen) return;
            if (!this.isGameRunning) return;
            if (bound.Status === "In_Progress" || bound.Status === "Completed") {
                this.isModalOpen = true;
                new Alert(this, "Trip In Progress!!", "You can't stop work that's already started!", () => {
                    this.isModalOpen = false;
                });
            }
            else {
                this.removeBoundToLine(this.boundLines[idx].boundContainer, this.boundLines[idx].bound);
            }
        }, true, 0.5)
        const panel = new Panel(this, -60, 20, "universalPanel1", 100, 40, "universalPanel1TBevel", "universalPanel1BBevel");
        const title = this.add.text(7, 2, `${boundType === "in" ? "Inbound" : "Outbound"}: ${bound.Trip}`, {
            font: "18px VT323",
            fill: "#fff",
            align: "start"
        }).setOrigin(0, 0);
        const textLTO = this.add.text(7, 20, `LTO: ${container.LTO}`, {
            font: "14px VT323",
            fill: "#fff",
            align: "start"
        }).setOrigin(0, 0);
        panel.add([title, textLTO]);
        const incrementBtn = new IconButton(this, 50, 30, "greenBtn", "greenBtnDown", "greenBtnHover", "plus", () => {
            if (this.isModalOpen) return;
            if (this.totalTrucks - 1 < 0) return;
            container.LTO++;
            this.totalTrucks--;
            this.trucksText.setText(`Lift Truck Operators: ${this.totalTrucks}`);
            textLTO.setText(`LTO: ${container.LTO}`);
        }, true, 0.45);
        const decrementBtn = new IconButton(this, 50, 50, "greenBtn", "greenBtnDown", "greenBtnHover", "minus", () => {
            if (container.LTO === 0) return;
            if (this.isModalOpen) return;
            container.LTO--;
            this.totalTrucks++;
            this.trucksText.setText(`Lift Truck Operators: ${this.totalTrucks}`);
            textLTO.setText(`LTO: ${container.LTO}`);
        }, true, 0.45);
        container.add([item, closeBtn, panel, incrementBtn, decrementBtn]);
        return container;
    }
    addBoundToLine(boundContainer, bound, boundType) {
        let boundLineIdx = this.boundLines.findIndex((b) => b === null);
        if (boundLineIdx === -1) {
            this.isModalOpen = true;
            new Alert(this, "LINES ARE FULL!", "Please complete/remove a inbound/outbound from any line before adding new.", () => {
                this.isModalOpen = false;
            });
        }
        else {
            if (boundContainer !== null) {
                bound.Status = "Started";
                this.boundLines[boundLineIdx] = this.createBoundForLine(boundLineIdx, boundContainer, bound, boundType);
                this.setBoundTint(boundContainer, bound);
                return true;
            }
        }
        return false;
    }
    removeBoundToLine(boundContainer) {
        let findBoundLineIdx = this.boundLines.findIndex((b) => b !== null && b.boundContainer === boundContainer);
        if (findBoundLineIdx !== -1) {
            let bound = this.boundLines[findBoundLineIdx].bound;
            bound.Status = "Not_Started";
            this.totalTrucks += this.boundLines[findBoundLineIdx].LTO;
            this.trucksText.setText(`Lift Truck Operators: ${this.totalTrucks}`);
            this.setBoundTint(boundContainer, bound);
            this.boundLines[findBoundLineIdx].destroy();
            this.boundLines[findBoundLineIdx] = null;
        }
    }
    renderInBounds() {
        if (this.inboundsList !== null) {
            this.inboundsList.destroy();
        }

        this.inboundsList = this.add.container(0, 0);
        let header = this.addBoundContainer(0, 0, 375, 40, ["Trip", "Time on Lot", "Items", "Work Time", ""]);
        header.getAt(0).changeTint(0x5F768E, 0x202C3D, 0x202C3D);
        this.inboundsList.add(header);

        let y = header.height + 5;
        if (this.inbounds.length > 0) {
            this.inbounds.forEach((inbound, index) => {
                let inboundValues = Object.values(inbound);
                inboundValues[3] = `${inboundValues[3].hours} hours ${inboundValues[3].minutes}`;
                let inboundContainer = this.addBoundContainer(0, y, 375, 40, inboundValues, 16, () => {
                    if (this.isModalOpen) return;
                    if (!this.isGameRunning) return;
                    if (inbound.Status === "Completed") {
                        this.inbounds.splice(index, 1);
                        this.renderInBounds();

                        this.canAddIntoLine = false;
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.canAddIntoLine = true;
                            },
                            callbackScope: this
                        });
                    }
                });
                this.inboundsList.add(inboundContainer);
                y = y + inboundContainer.height + 5;
                this.setBoundTint(inboundContainer, inbound);

                let panelBg = inboundContainer.getAt(0);
                panelBg.panel.setInteractive();
                panelBg.panel.on("pointerup", (pointer) => {
                    if (this.isModalOpen) return;
                    if (!this.canAddIntoLine) return;
                    if (pointer.downX !== pointer.upX || pointer.downY !== pointer.upY) return;
                    if (!this.isGameRunning) return;
                    if (inbound.Status === "Not_Started") {
                        let res = this.addBoundToLine(inboundContainer, inbound, "in");
                        if (!res) {
                            this.setBoundTint(inboundContainer, inbound);
                        }
                    }
                });
                panelBg.panel.on("pointerover", () => {
                    if (this.isModalOpen) return;
                    if (!this.canAddIntoLine) return;
                    if (!this.isGameRunning) return;
                    if (inbound.Status === "Not_Started" || inbound.Status === "Started") {
                        panelBg.changeTint(0x9c8340, 0x382d0e, 0x382d0e);
                        this.game.canvas.style.cursor = "pointer";
                    }
                });
                panelBg.panel.on("pointerout", () => {
                    if (this.isModalOpen) return;
                    this.setBoundTint(inboundContainer, inbound);
                    this.game.canvas.style.cursor = "default";
                });

                this.boundLines.forEach((boundLine, idx) => {
                    if (boundLine !== null && boundLine.bound === inbound) {
                        this.boundLines[idx].boundContainer = inboundContainer;
                    }
                });
            });
        }
        else {
            let inboundContainer = this.addBoundContainer(0, y, 375, 40, ["Not Found", "", "", "", "", "", ""], 16);
            this.inboundsList.add(inboundContainer);
        }
        let scrollbar = new ScrollBarContent(this, 5, 25, 400, 300, { x: this.inboundsWindowPanel.x, y: this.inboundsWindowPanel.y }, this.inboundsList);
        this.inboundsWindowPanel.add(scrollbar);
    }
    renderOutBounds() {
        if (this.outboundsList !== null) {
            this.outboundsList.destroy();
        }

        this.outboundsList = this.add.container(0, 0);
        let header = this.addBoundContainer(0, 0, 375, 40, ["Trip", "Ship Time", "Items", "Work Time", ""]);
        header.getAt(0).changeTint(0x5F768E, 0x202C3D, 0x202C3D);
        this.outboundsList.add(header);

        let y = header.height + 5;
        if (this.outbounds.length > 0) {
            this.outbounds.forEach((outbound, index) => {
                let outboundValues = Object.values(outbound);
                outboundValues[1] = this.getTimeStr(outboundValues[1].hours, outboundValues[1].minutes);
                outboundValues[3] = `${outboundValues[3].hours} hours ${outboundValues[3].minutes}`;
                let outboundContainer = this.addBoundContainer(0, y, 375, 40, outboundValues, 16, () => {
                    // remove this outbound
                    if (this.isModalOpen) return;
                    if (!this.isGameRunning) return;
                    if (outbound.Status === "Completed") {
                        this.outbounds.splice(index, 1);
                        this.renderOutBounds();

                        this.canAddIntoLine = false;
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.canAddIntoLine = true;
                            },
                            callbackScope: this
                        });
                    }
                });
                this.outboundsList.add(outboundContainer);
                y = y + outboundContainer.height + 5;
                this.setBoundTint(outboundContainer, outbound);

                let panelBg = outboundContainer.getAt(0);
                panelBg.panel.setInteractive().on("pointerup", (pointer) => {
                    if (this.isModalOpen) return;
                    if (!this.canAddIntoLine) return;
                    let diff = Math.abs(pointer.downX - pointer.upX) + Math.abs(pointer.downY - pointer.upY);
                    if (diff > 5) return;
                    if (!this.isGameRunning) return;
                    if (outbound.Status === "Not_Started") {
                        let res = this.addBoundToLine(outboundContainer, outbound, "out");
                        if (!res) {
                            this.setBoundTint(outboundContainer, outbound);
                        }
                    }
                });
                panelBg.panel.on("pointerover", () => {
                    if (this.isModalOpen) return;
                    if (!this.isGameRunning) return;
                    if (!this.canAddIntoLine) return;
                    if (outbound.Status === "Not_Started") {
                        panelBg.changeTint(0x9c8340, 0x382d0e, 0x382d0e);
                        this.game.canvas.style.cursor = "pointer";
                    }
                });
                panelBg.panel.on("pointerout", () => {
                    if (this.isModalOpen) return;
                    this.setBoundTint(outboundContainer, outbound);
                    this.game.canvas.style.cursor = "default";
                });

                this.boundLines.forEach((boundLine, idx) => {
                    if (boundLine !== null && boundLine.bound === outbound) {
                        this.boundLines[idx].boundContainer = outboundContainer;
                    }
                });
            });
        }
        else {
            let outboundContainer = this.addBoundContainer(0, y, 375, 40, ["Not Found", "", "", "", "", "", "", ""], 16);
            this.outboundsList.add(outboundContainer);
        }
        let scrollbar = new ScrollBarContent(this, 5, 25, 400, 300, { x: this.outboundsWindowPanel.x, y: this.outboundsWindowPanel.y }, this.outboundsList);
        this.outboundsWindowPanel.add(scrollbar);
    }
    renderInventory() {
        if (this.inventoryList !== null) {
            this.inventory.forEach((item, i) => {
                this.inventoryList.getAt(i + 1).getAt(2).setText(`${Object.values(item)[0]}`);
            });
            return;
        }

        this.inventoryList = this.add.container(0, 0);
        let header = this.addContainer(0, 0, 275, 35, "Item", "Stock");
        header.getAt(0).changeTint(0x5F768E, 0x202C3D, 0x202C3D);
        this.inventoryList.add(header);

        let y = 40;
        if (this.inventory.length > 0) {
            this.inventory.forEach((item) => {
                let key = Object.keys(item)[0];
                let value = Object.values(item)[0];
                let itemContainer = this.addContainer(0, y, 275, 35, key, value);
                this.inventoryList.add(itemContainer);
                y = y + 40;
            });
        }
        else {
            let itemContainer = this.addContainer(0, y, 275, 35, "Not Found", "");
            this.inventoryList.add(itemContainer);
        }
        let scrollbar = new ScrollBarContent(this, 5, 25, 300, 300, { x: this.inventoryWindowPanel.x, y: this.inventoryWindowPanel.y }, this.inventoryList);
        this.inventoryWindowPanel.add(scrollbar);
    }
    renderCosts() {
        if (this.costsList.length > 0) {
            this.costs.forEach((cost, i) => {
                let key = Object.keys(cost)[0];
                this.costsList[i].getAt(2).setText(`$${cost[key]} / ${i < 2 ? "hour" : "pellet"}`);
            });
            return;
        }

        this.costsList = [];
        let y = 22;
        this.costs.forEach((cost, i) => {
            let key = Object.keys(cost)[0];
            let costContainer = this.add.container(0, y);
            let bg = new Panel(this, 12, 0, "universalPanel1", 170, 40, "universalPanel1TBevel", "universalPanel1BBevel");
            let text = this.add.text(17, 3, `${key}`, {
                font: "22px VT323",
                fill: "#fff"
            }).setOrigin(0, 0).setWordWrapWidth(210);
            bg.setSize(210, text.height + 52);
            let costText = this.add.text(215, text.height + 20, `$${cost[key]} / ${i < 2 ? "hour" : "pellet"}`, {
                font: "26px VT323",
                fill: "#DDC775"
            }).setOrigin(1, 0);
            costContainer.add([bg, text, costText]);
            this.costsWindowPanel.add(costContainer);
            this.costsList.push(costContainer);
            y = y + text.height + 58;
        });
    }
    renderScore() {
        if (this.scoreList.length > 0) {
            this.score.forEach((score, i) => {
                let key = Object.keys(score)[0];
                this.scoreList[i].getAt(2).setText(`$${score[key]}`);
            });
            return;
        }

        this.scoreList = [];
        let y = 22;
        this.score.forEach((score, i) => {
            let key = Object.keys(score)[0];
            let scoreContainer = this.add.container(0, y);
            let bg = new Panel(this, 12, 0, "universalPanel1", 165, 40, "universalPanel1TBevel", "universalPanel1BBevel");
            if (i == 3) {
                bg.changeTint(null, 0x8E7436, 0x8E7436);
            }
            let text = this.add.text(17, 3, `${key}`, {
                font: i == 3 ? "20px VT323" : "16px VT323",
                fill: "#fff"
            }).setOrigin(0, 0).setWordWrapWidth(145);
            bg.setSize(175, text.height + 35);
            let scoreText = this.add.text(180, text.height + 6, `$${score[key]}`, {
                font: "26px VT323",
                fill: "#DDC775"
            }).setOrigin(1, 0);
            scoreContainer.add([bg, text, scoreText]);
            this.scoreWindowPanel.add(scoreContainer);
            this.scoreList.push(scoreContainer);
            y = y + text.height + 40;
        });
    }
    renderLeaderBoard() {
        if (this.leaderBoardList !== null) {
            this.leaderBoardList.destroy();
        }

        this.leaderBoardList = this.add.container(0, 0);
        const header = this.addContainer(0, 0, 166, 40, "Username", "Score", 24, 0);
        header.getAt(0).changeTint(0x5F768E, 0x202C3D, 0x202C3D);
        this.leaderBoardList.add(header);

        let y = 45;
        if (this.leaderBoard.length > 0) {
            this.leaderBoard.forEach((leader) => {
                let leaderContainer = this.addContainer(0, y, 166, 35, leader.username, leader.score, 20, 0);
                this.leaderBoardList.add(leaderContainer);
                y = y + 40;
            });
        }
        else {
            let leaderContainer = this.addContainer(0, y, 166, 35, "Not Found", "", 18, 0);
            this.leaderBoardList.add(leaderContainer);
        }
        let scrollbar = new ScrollBarContent(this, 0, 25, 188, 380, { x: this.leaderBoardWindowPanel.x, y: this.leaderBoardWindowPanel.y }, this.leaderBoardList, 4);
        this.leaderBoardWindowPanel.add(scrollbar);
    }
    update() {
        if (this.game.scale.isPortrait && this.rotateDom === null) {
            this.rotateDom = this.add.dom(this.game.config.width / 2, this.game.config.height / 2).createFromHTML(`
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M21.323 8.616l-4.94-4.94a1.251 1.251 0 0 0-1.767 0l-10.94 10.94a1.251 1.251 0 0 0 0 1.768l4.94 4.94a1.25 1.25 0 0 0 1.768 0l10.94-10.94a1.251 1.251 0 0 0 0-1.768zM14 5.707L19.293 11 11.5 18.793 6.207 13.5zm-4.323 14.91a.25.25 0 0 1-.354 0l-1.47-1.47.5-.5-2-2-.5.5-1.47-1.47a.25.25 0 0 1 0-.354L5.5 14.207l5.293 5.293zm10.94-10.94l-.617.616L14.707 5l.616-.616a.25.25 0 0 1 .354 0l4.94 4.94a.25.25 0 0 1 0 .353zm1.394 6.265V18a3.003 3.003 0 0 1-3 3h-3.292l1.635 1.634-.707.707-2.848-2.847 2.848-2.848.707.707L15.707 20h3.304a2.002 2.002 0 0 0 2-2v-2.058zM4 9H3V7a3.003 3.003 0 0 1 3-3h3.293L7.646 2.354l.707-.707 2.848 2.847L8.354 7.34l-.707-.707L9.28 5H6a2.002 2.002 0 0 0-2 2z"
                    />
                    <path fill="none" d="M0 0h24v24H0z" />
                </svg>
                <span>Please rotate your device to landscape mode</span>
            `, "div");
            this.rotateDom.node.setAttribute("id", "rotateAlert");
        }
        if (this.game.scale.isLandscape && this.rotateDom !== null) {
            this.rotateDom.destroy();
            this.rotateDom = null;
        }

        if (this.isModalOpen) {
            document.body.style.backgroundColor = "#12161f";
        }
        else {
            document.body.style.backgroundColor = "#202C3D";
        }
    }
}
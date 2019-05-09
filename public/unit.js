// import { start } from "repl";

// IMPORTANT NOTE: Game is played with White starting on rows 0 and 1, Black starting on rows 6 and 7.

const colors = {
    WHITE: 'white',
    BLACK: 'black',
    INVALID: 'invald',
    EMPTY: 'empty'
}

// Parent unit class
class Unit {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(color == colors.BLACK || color == colors.WHITE) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
        this.possibleMoves = [];
        this.meshScene;
        this.animation;        
    }

    getPosition() { return [this.position_x, this.position_y]; }
    setPosition(position_x, position_y) { this.position_x = position_x; this.position_y = position_y;}
    getPossibleMoves() { return []; }

    makeMove(position_x, position_y) {
        for(i = 0; i < this.possibleMoves.length; i++) {
            if(this.possibleMoves[i][0] == position_x && this.possibleMoves[i][1] == position_y) {
                if(currentMove !== undefined) {
                    throw "Unable to make move"
                } else {
                    console.log("Moving " + this.constructor.name + " to " + position_x + ", " + position_y);
                    currentMove = new Move(this, [this.position_x, this.position_y], [position_x, position_y]);
                }
                // this.mesh.position.set(x - 3.5, y - 3.5, .5);
            }
        }
    }

    setMesh(meshScene) {
        this.meshScene = meshScene;
    }

    getMesh() {
        return this.meshScene.children[0];
    }

    removeMesh() {
        scene.remove(this.meshScene);
        this.meshScene.children[0].geometry.dispose();
        this.meshScene.children[0].material.dispose();
        this.meshScene.children[0] = undefined;
    }

    printValidMoves() {
        var printstring = this.constructor.name + "@[" + this.position_x + ", " + this.position_y + "]: ";
        for(var i = 0; i < this.possibleMoves.length; i++) {
            printstring = printstring + "[" + this.possibleMoves[i] + "] ";
        }
        console.log(printstring);
    }

    setAnimation(animation) {
        this.animation = animation;
        console.log(this.animation);
        for(i = 0; i < this.animation.scene.children.length; i++) {
            this.animation.scene.children[i].visible = false;
        }
    }

    animateUnit() {
        if(this.animation) {
            this.animation.scene.position.set(unit.getPosition()[0] - 3.5, unit.getPosition()[1] - 3.5, .5);
            for(i = 0; i < this.animation.scene.children.length; i++) {
                this.animation.scene.children[i].visible = true;
            }
            this.getMesh().visible = false;
            updateMixer(this.animation.scene);
            console.log(this.animation.scene); 
            this.animation.animations.forEach((clip) => {
                var ca = getMixer().clipAction(clip);
                ca.clampWhenFinished = true;
                ca.repetitions = 1;
                ca.play();
            });
        }
    }
}

// Class for Pawn - Unit
class Pawn extends Unit {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        super(position_x, position_y, color);
        if(this.color == colors.WHITE) {
            this.direction = 1;
        } else {
            this.direction = -1;
        }
        this.possibleMoves = [];
    }

    getPossibleMoves() {
        this.possibleMoves = [];
        var move_forward = checkBoardColor(this.position_x, this.position_y + this.direction);
        // Check if pawn is free to move forward.
        if(move_forward == colors.EMPTY) {
            this.possibleMoves.push([this.position_x, this.position_y + this.direction]);
        }
        // Check the two attacking directions for pawns.
        var attack1 = checkBoardColor(this.position_x + 1, this.position_y + this.direction);
        if(isOppositeColor(this.color, attack1)) {
            this.possibleMoves.push([this.position_x + 1, this.position_y + this.direction]);
        }
        var attack2 = checkBoardColor(this.position_x - 1, this.position_y + this.direction);
        if(isOppositeColor(this.color, attack2)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y + this.direction]);
        }
        // Check if it can move two spaces for first move.
        var move_forward2;
        if(this.color == colors.WHITE && this.position_y == 1) {
            move_forward2 = checkBoardColor(this.position_x, this.position_y + this.direction * 2);
        } else if (this.color == colors.BLACK && this.position_y == 6) {
            move_forward2 = checkBoardColor(this.position_x, this.position_y + this.direction * 2);
        } else {
            move_forward2 = colors.INVALID;
        }
        if(move_forward == colors.EMPTY && move_forward2 == colors.EMPTY) {
            this.possibleMoves.push([this.position_x, this.position_y + this.direction * 2]);
        }
        return this.possibleMoves;
    }
}

class Rook extends Unit {
    getPossibleMoves() {
        this.possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right
        while(x < 7) {
            x++;
            move = checkBoardColor(x, this.position_y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, this.position_y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left
        while(x > 0) {
            x--;
            move = checkBoardColor(x, this.position_y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, this.position_y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Up
        while(y < 7) {
            y++;
            move = checkBoardColor(this.position_x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([this.position_x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Down
        while(y > 0) {
            y--;
            move = checkBoardColor(this.position_x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([this.position_x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        return this.possibleMoves;
    }
}

class Bishop extends Unit {
    getPossibleMoves() {
        this.possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right-Up
        while(x < 7 && y < 7) {
            x++;
            y++;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left-Up
        while(x > 0 && y < 7) {
            x--;
            y++;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left-Down
        while(x > 0 && y > 0) {
            x--;
            y--;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Right-Down
        while(x < 7 && y > 0) {
            x++;
            y--;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        return this.possibleMoves;
    }
}

class Queen extends Unit {
    getPossibleMoves() {
        this.possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right
        while(x < 7) {
            x++;
            move = checkBoardColor(x, this.position_y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, this.position_y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left
        while(x > 0) {
            x--;
            move = checkBoardColor(x, this.position_y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, this.position_y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Up
        while(y < 7) {
            y++;
            move = checkBoardColor(this.position_x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([this.position_x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Down
        while(y > 0) {
            y--;
            move = checkBoardColor(this.position_x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([this.position_x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Right-Up
        while(x < 7 && y < 7) {
            x++;
            y++;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left-Up
        while(x > 0 && y < 7) {
            x--;
            y++;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left-Down
        while(x > 0 && y > 0) {
            x--;
            y--;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Right-Down
        while(x < 7 && y > 0) {
            x++;
            y--;
            move = checkBoardColor(x, y);
            if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
                this.possibleMoves.push([x, y]);
                // If piece is of opposite color then stop checking in that direction.
                if(isOppositeColor(this.color, move)) {
                    break;
                }
            } else {
                break;
            }
        }
        return this.possibleMoves;
    }
}

class King extends Unit {
    getPossibleMoves() {
        this.possibleMoves = [];
        var move;
        // Right
        move = checkBoardColor(this.position_x + 1, this.position_y);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x + 1, this.position_y]);
        }
        // Left
        move = checkBoardColor(this.position_x - 1, this.position_y);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y]);
        }
        // Up
        move = checkBoardColor(this.position_x, this.position_y + 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x, this.position_y + 1]);
        }
        // Down
        move = checkBoardColor(this.position_x, this.position_y - 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x, this.position_y - 1]);
        }
        // Left-Up
        move = checkBoardColor(this.position_x - 1, this.position_y + 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y + 1]);
        }
        // Left-Down
        move = checkBoardColor(this.position_x - 1, this.position_y - 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y - 1]);
        }
        // Right-Up
        move = checkBoardColor(this.position_x + 1, this.position_y +  1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x  + 1, this.position_y  + 1]);
        }
        // Right-Down
        move = checkBoardColor(this.position_x + 1, this.position_y - 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x + 1, this.position_y - 1]);
        }
        return this.possibleMoves;
    }
}

class Knight extends Unit {
    getPossibleMoves() {
        this.possibleMoves = [];
        var move;
        // Right2Up1
        move = checkBoardColor(this.position_x + 2, this.position_y + 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x + 2, this.position_y + 1]);
        }
        // Right1Up2
        move = checkBoardColor(this.position_x + 1, this.position_y + 2);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x + 1, this.position_y + 2]);
        }
        // Left2Up1
        move = checkBoardColor(this.position_x - 2, this.position_y + 1);
        //console.log(this.position_x - 2, this.position_y + 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 2, this.position_y + 1]);
        }
        // Left1Up2
        move = checkBoardColor(this.position_x - 1, this.position_y + 2);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y + 2]);
        }
        // Left2Down1
        move = checkBoardColor(this.position_x - 2, this.position_y - 1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 2, this.position_y - 1]);
        }
        // Left1Down2
        move = checkBoardColor(this.position_x - 1, this.position_y - 2);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x - 1, this.position_y - 2]);
        }
        // Right2Down1
        move = checkBoardColor(this.position_x + 2, this.position_y -  1);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x  + 2, this.position_y - 1]);
        }
        // Right1Down2
        move = checkBoardColor(this.position_x + 1, this.position_y - 2);
        if(move == colors.EMPTY || isOppositeColor(this.color, move)) {
            this.possibleMoves.push([this.position_x + 1, this.position_y - 2]);
        }
        return this.possibleMoves;
    }
}

function checkBoardColor(position_x, position_y) {
    if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
        for(i=0; i < chessPieces.length; i++) {
            if(chessPieces[i].position_x == position_x && chessPieces[i].position_y == position_y) {
                return chessPieces[i].color;
            }
        }
        return colors.EMPTY;
    } else {
        return colors.INVALID;
    }
}

function checkBoardUnit(position_x, position_y) {
    if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
        for(i=0; i < chessPieces.length; i++) {
            if(chessPieces[i].position_x == position_x && chessPieces[i].position_y == position_y) {
                return chessPieces[i];
            }
        }
    }
    return null;
}

function isOppositeColor(myColor, otherColor) {
    return otherColor != colors.INVALID && otherColor != colors.EMPTY && otherColor != myColor;
}

class Move {
    constructor(unit, startPosition, endPosition) {
        this.unit = unit;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
    }

    getStartPosition() {
        return this.startPosition;
    }

    getEndPosition() {
        return this.endPosition;
    }

    getUnit() {
        return this.unit;
    }
}
// IMPORTANT NOTE: Game is played with White starting on rows 0 and 1, Black starting on rows 6 and 7.

const colors = {
    WHITE: 'white',
    BLACK: 'black',
    NULL: 'null'
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
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }
    getPossibleMoves() { return this.position; }
}

// Class for Pawn - Unit
class Pawn {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
        if(this.color == colors.WHITE) {
            this.direction = 1;
        } else {
            this.direction = -1;
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move_forward = checkBoard(this.position_x, this.position_y + this.direction);
        // Check if pawn is free to move forward.
        if(!move_forward || move_forward != colors.NULL) {
            possibleMoves.push([this.position_x, this.position_y + this.direction]);
        }
        // Check the two attacking directions for pawns.
        var attack1 = checkBoard(this.position_x + 1, this.position_y + this.direction);
        if(attack1 && attack1 != this.color && attack1 != colors.NULL) {
            possibleMoves.push([position_x + 1, position_y + this.direction]);
        }
        var attack2 = checkBoard(this.position_x + 1, this.position_y + this.direction);
        if(attack2 && attack2 != this.color && attack2 != colors.NULL) {
            possibleMoves.push([position_x - 1, position_y + this.direction]);
        }
        // Check if it can move two spaces for first move.
        var move_forward2;
        if(this.color == colors.WHITE && this.position_y == 1) {
            move_forward2 = checkBoard(this.position_x, this.position_y + this.direction * 2);
        } else if (this.color == colors.BLACK && this.position_y == 6) {
            move_forward2 = checkBoard(this.position_x, this.position_y + this.direction * 2);
        } else {
            move_forward2 = null;
        }
        if(!move_forward && !move_forward2) {
            possibleMoves.push([this.position_x, this.position_y + this.direction * 2]);
        }
        return possibleMoves;
    }
}

class Rook {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right
        while(x < 7) {
            x++;
            move = checkBoard(x, this.position_y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, this.position_y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left
        while(x > 0) {
            x--;
            move = checkBoard(x, this.position_y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, this.position_y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Up
        while(y < 7) {
            y++;
            move = checkBoard(this.position_x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([this.position_x, y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Down
        while(y > 0) {
            y--;
            move = checkBoard(this.position_x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([this.position_x, y]);
            } else {
                break;
            }
        }
        return possibleMoves;
    }
}

class Bishop {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right-Up
        while(x < 7 && y < 7) {
            x++;
            y++;
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
            } else {
                break;
            }
        }
        return possibleMoves;
    }
}

class Queen {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move;
        var x = this.position_x;
        var y = this.position_y;
        // Right
        while(x < 7) {
            x++;
            move = checkBoard(x, this.position_y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, this.position_y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Left
        while(x > 0) {
            x--;
            move = checkBoard(x, this.position_y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, this.position_y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Up
        while(y < 7) {
            y++;
            move = checkBoard(this.position_x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([this.position_x, y]);
            } else {
                break;
            }
        }
        x = this.position_x;
        y = this.position_y;
        // Down
        while(y > 0) {
            y--;
            move = checkBoard(this.position_x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([this.position_x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
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
            move = checkBoard(x, y);
            if(!move || (move != this.color && move != colors.NULL)) {
                possibleMoves.push([x, y]);
            } else {
                break;
            }
        }
        return possibleMoves;
    }
}

class King {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move;
        // Right
        move = checkBoard(this.position_x + 1, this.position_y);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x + 1, this.position_y]);
        }
        // Left
        move = checkBoard(this.position_x - 1, this.position_y);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 1, this.position_y]);
        }
        // Up
        move = checkBoard(this.position_x, this.position_y + 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x, this.position_y + 1]);
        }
        // Down
        move = checkBoard(this.position_x, this.position_y - 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x, this.position_y - 1]);
        }
        // Left-Up
        move = checkBoard(this.position_x - 1, this.position_y + 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 1, this.position_y + 1]);
        }
        // Left-Down
        move = checkBoard(this.position_x - 1, this.position_y - 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 1, this.position_y - 1]);
        }
        // Right-Up
        move = checkBoard(this.position_x + 1, this.position_y +  1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x  + 1, this.position_y  + 1]);
        }
        // Right-Down
        move = checkBoard(this.position_x + 1, this.position_y - 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x + 1, this.position_y - 1]);
        }
        return possibleMoves;
    }

}

class Knight {
    constructor(position_x, position_y, color) {
        // All units must be positioned within the board limits.
        if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
            this.position_x = position_x;
            this.position_y = position_y;
        } else {
            throw "Unit is not positioned on the board."
        }
        // All units must have a valid color.
        if(Object.values(colors).includes(color)) {
            this.color = color;
        } else {
            throw "Color for unit is not black/white."
        }
    }

    getPosition() { return this.position; }

    getPossibleMoves() {
        var possibleMoves = [];
        var move;
        // Right2Up1
        move = checkBoard(this.position_x + 2, this.position_y + 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x + 2, this.position_y + 1]);
        }
        // Right1Up2
        move = checkBoard(this.position_x + 1, this.position_y + 2);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x + 1, this.position_y + 2]);
        }
        // Left2Up1
        move = checkBoard(this.position_x - 2, this.position_y + 1);
        //console.log(this.position_x - 2, this.position_y + 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 2, this.position_y + 1]);
        }
        // Left1Up2
        move = checkBoard(this.position_x - 1, this.position_y + 2);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 1, this.position_y + 2]);
        }
        // Left2Down1
        move = checkBoard(this.position_x - 2, this.position_y - 1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 2, this.position_y - 1]);
        }
        // Left1Down2
        move = checkBoard(this.position_x - 1, this.position_y - 2);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x - 1, this.position_y - 2]);
        }
        // Right2Down1
        move = checkBoard(this.position_x + 2, this.position_y -  1);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x  + 2, this.position_y - 1]);
        }
        // Right1Down2
        move = checkBoard(this.position_x + 1, this.position_y - 2);
        if(!move || (move != this.color && move != colors.NULL)) {
            possibleMoves.push([this.position_x + 1, this.position_y - 2]);
        }
        return possibleMoves;
    }
}

function checkBoard(position_x, position_y) {
    if(position_x >= 0 && position_x <= 7 && position_y >= 0 && position_y <= 7) {
        for(i=0; i < chessPieces.length; i++) {
            if(chessPieces[i].position_x == position_x && chessPieces[i].position_y == position_y) {
                return chessPieces[i].color;
            }
        }
        return null;
    } else {
        return colors.NULL;
    }
}
const FRICTION = .2;
const MOVE_SPEED = .08;
const COLOR_SPEED = 0.2;
const colours = [0xff0065, 0xf890e7, 0xffffff];

export class Particle {
    constructor(pos, texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.p_scale = 0.3;
        this.new_scale = 0;
        this.sprite.scale.set(this.p_scale);
        this.pixelColor = pos.col;

        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;

        this.savedRgb = pos.col;
        this.rgb = 0x000000;
    }

    collide() {
        this.rgb = colours[Math.floor(Math.random()*3)];
        this.new_scale = 0.1;
    }

    draw() {
        this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;
        this.new_scale += (this.p_scale - this.new_scale) * .03;
        this.sprite.scale.set(this.new_scale);

        

        this.x += (this.savedX - this.x) * MOVE_SPEED;
        this.y += (this.savedY - this.y) * MOVE_SPEED;

        this.vx *= FRICTION * getRandom(1,2);
        this.vy *= FRICTION * getRandom(1,2);

        this.x += this.vx;
        this.y += this.vy;

        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.tint = this.rgb;
    }

    setColor() {
        this.sprite.tint = this.pixelColor;
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
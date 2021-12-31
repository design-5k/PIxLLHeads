import {Visual} from './visual.js';
import {MouseV} from './modules/mouse-velocity.js';

var _width = window.innerWidth;
var _height = window.innerHeight;

const app = new  PIXI.Application({
    width: _width,
    height: _height,
    resolution: devicePixelRatio,
    autoDensity: true,
    autoResize : true
});

let renderer = PIXI.autoDetectRenderer();
renderer.resize(_width, _height);
renderer.view.style.position = 'absolute';
document.getElementById('background-id').appendChild(app.view);

let visual = new Visual();
var imgUrl = 'img.png';
var bgUrl = 'bg_img.jpg';
var hoodieUrl = 'hoodie.png';
var pillSheet = 'assets/pillsheet.json';
var spaceSheet = 'assets/spacesheet-3.json';

//audio
const sound = PIXI.sound.Sound.from('audio.mp3');
sound.loop = true;
sound.play();

//Pixelate filter for pill anim
const pixelFilter = new PIXI.filters.PixelateFilter([5,5]);

const loader = PIXI.Loader.shared; 
loader.add('baseImg', imgUrl)
      .add('bgImage', bgUrl)
      .add('pillAnim', pillSheet)
      .add('spaceAnim', spaceSheet)
      .add('hoodie', hoodieUrl);
loader.load((loader, resources) => {

    //Adding pill image and setting pixels visual
    const img = new PIXI.Sprite.from(resources.baseImg.texture);
    img.anchor.set(0.5, 0.5);
    img.height = _height/1.2;
    img.width = _width/2;
    img.x = (_width*2)/3;
    img.y = _height/2;
    app.stage.addChild(img);
    let _spaceSheet = resources.spaceAnim.spritesheet;
    visual.show(bgUrl, hoodieUrl, _spaceSheet, _width, _height, app.stage, renderer.plugins.extract.canvas(renderer._lastObjectRendered), app);
    app.stage.removeChild(img);

    //Adding animated pill
    let _pillSheet = resources.pillAnim.spritesheet;
    const _pillAnim = new PIXI.AnimatedSprite(_pillSheet.animations["pill"]);
    _pillAnim.animationSpeed = 0.167;
    _pillAnim.play();
    _pillAnim.x = 0;
    _pillAnim.filters = [pixelFilter, bloomFilter];
    app.ticker.add(() => {
        _pillAnim.height = _height*1.3/2.5;
        _pillAnim.width = _width*1.3/4;
        _pillAnim.y = _height*.6/3;
    });
    app.stage.addChild(_pillAnim);
});

//glitch filter
const colorMatrix1 = new PIXI.filters.ColorMatrixFilter();
colorMatrix1.negative();
colorMatrix1.alpha = 0;

//crt filter
const crtFilter = new PIXI.filters.CRTFilter({
    lineContrast: 0.6,
    lineWidth: 3,
    time: 1,
    vignetting: 0,
    vignettingBlur: 0.4,
    noise: 0,
});

//bloom filter
const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
    threshold: .4,
    bloomScale: 2,
    brightness: 1,
    blur: 12,
});

app.stage.filters = [crtFilter, colorMatrix1, bloomFilter];

//mouse data
var xPos, yPos, mouseSpeed;
var mouseV = new MouseV();
var previousEvent = false;

//mouse move function
window.onmousemove = function(e) {
    xPos = e.clientX;
    yPos = e.clientY;
    e.time = Date.now();
    mouseSpeed = mouseV.getMouseV(e, previousEvent);
    previousEvent = e;
}

window.addEventListener('resize', resize);

function resize() {
    visual.resize(window.innerWidth/_width, window.innerHeight/_height, window.innerWidth, window.innerHeight);
    _width = window.innerWidth;
    _height = window.innerHeight;

    app.renderer.resize(_width, _height);
    renderer.render(app.stage);
}

const pillHue = 0;

app.ticker.add(function(){
    visual.animate();
    crtFilter.time++;

    //glitch
    if(mouseSpeed > 10) {
        colorMatrix1.alpha = 1;
        bloomFilter.bloomScale = 0;
    }
    else {
        colorMatrix1.alpha = 0;
        bloomFilter.bloomScale = 1;
    }

    renderer.render(app.stage);
});
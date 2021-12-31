export class Pixels {

    constructor () {
    }

    dotPos (density, stageWidth, stageHeight, sourceCanvas) {

        var sourceContext = sourceCanvas.getContext('2d');

        const imageData = sourceContext.getImageData (
            0, 0, 
            stageWidth, stageHeight
        ).data;

        const particles = [];
        let i = 0;
        let width = 0;
        let pixel;
        let colour;

        for (let height = 0; height < stageHeight; height += density) {
            ++i;
            const slide = (i%2) == 0;
            width = 0;
            if (slide ==1) {
                width +=6;
            }

            for(width; width<stageWidth; width += density) {
                pixel = imageData[((width + (height * stageWidth)) * 4) - 1];
                if(pixel != 0 && width > 0 && width < stageWidth
                    && height > 0 && height < stageHeight) {
                        var colorIndices = getColorIndicesForCoord(width, height, stageWidth);
                        colour = "0x" + rgbToHex(imageData[colorIndices[0]], imageData[colorIndices[1]], imageData[colorIndices[2]]);
                        particles.push({
                            x: width,
                            y: height,
                            col: colour,
                        });
                    }
            }
        }

        return particles;
    }
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
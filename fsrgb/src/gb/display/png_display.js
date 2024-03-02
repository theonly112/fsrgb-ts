"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PngDisplay = void 0;
var jimp_1 = require("jimp");
var JimpFrameBuffer = /** @class */ (function () {
    function JimpFrameBuffer() {
        this.frame = 0;
        this.buff = new jimp_1.default(160, 144);
    }
    JimpFrameBuffer.prototype.setPixel = function (x, y, c) {
        this.buff.setPixelColor(jimp_1.default.rgbaToInt(c.r, c.g, c.b, 255), x, y);
    };
    JimpFrameBuffer.prototype.save = function () {
        this.buff.write("frames/test".concat(this.frame++, ".png"));
    };
    return JimpFrameBuffer;
}());
var PngDisplay = /** @class */ (function () {
    function PngDisplay() {
    }
    PngDisplay.prototype.createFramebuffer = function () {
        return new JimpFrameBuffer();
    };
    PngDisplay.prototype.draw = function (framebuffer) {
        var buff = framebuffer;
        if (buff != null) {
            buff.save();
        }
    };
    return PngDisplay;
}());
exports.PngDisplay = PngDisplay;

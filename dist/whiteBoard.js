var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BRUSHTYPE, OPERATING_MODE } from './types/types';
var whiteBoardBasic = /** @class */ (function () {
    function whiteBoardBasic() {
        this.serverMode = true; // 是否服务端模式. 服务端模式: 发送数据. 绘制本地路径坐标. 客户端模式: 接收数据. 还原远程路径坐标
        this.color = '#FF799F'; // 笔触颜色
        this.environment = 'mobile'; // 运行环境. mobile: 移动端/没有曲谱标题页的琴端 piano: 曲谱第一页为标题页的琴端
        this.lineSize = 4; // canvas笔触宽度
        this.lineType = BRUSHTYPE.FREE; // 线条类型
        this.drawList = [];
        this.laserPointList = [];
        this.laserRevertEngineStopd = true;
        this.unEmitList = [];
        this.enableEmit = true;
        this.undoList = [];
        this.progressPath = undefined;
        this.measures = [];
        this._mode = OPERATING_MODE.NONE;
        this._canvas = null;
    }
    return whiteBoardBasic;
}());
var whiteBoard = /** @class */ (function (_super) {
    __extends(whiteBoard, _super);
    function whiteBoard(o) {
        var _this = _super.call(this) || this;
        Object.defineProperty.call(_this, _this, 'canvas', {
            configurable: true,
            enumerable: true,
            get: function () { return this._canvas; },
            set: function (obj) {
                if (Object.prototype.toString.call(obj) !== '[object HTMLCanvasElement]') {
                    window.console && console.warn('whiteboard: 未检测到canvas元素. 画板功能不可用');
                    return;
                }
                this._canvas = obj;
                this.ctx = this._canvas.getContext('2d');
            },
        });
        Object.defineProperty.call(_this, _this, 'operatingMode', {
            configurable: true,
            enumerable: true,
            get: function () { return this._mode; },
            set: function (mode) {
                if (mode !== OPERATING_MODE.CANVAS && mode !== OPERATING_MODE.LASER && mode !== OPERATING_MODE.NONE) {
                    throw new TypeError('OPERATING_MODE 设置错误 [canvas, laser, ""]');
                }
                if (mode === OPERATING_MODE.CANVAS && Object.prototype.toString.call(this.canvas) !== '[object HTMLCanvasElement]') {
                    throw new ReferenceError('未检测到canvas画布元素');
                }
                if (mode === OPERATING_MODE.LASER) {
                    var htmlElement = null;
                    if (Object.prototype.toString.call(this.canvas) === '[object HTMLCanvasElement]') {
                        htmlElement = this.canvas.parentNode.querySelector('.wbLaser');
                    }
                    else {
                        htmlElement = document.querySelector('.wbLaser');
                    }
                    if (Object.prototype.toString.call(htmlElement) === '[object HTMLDivElement]') {
                        htmlElement.parentNode.removeChild(htmlElement);
                    }
                    this.laserNode = document.createElement('div');
                    this.laserNode.setAttribute('class', 'wbLaser');
                    this.laserNode.setAttribute('style', 'position:absolute; z-index:1000; width:46px; height:46px; diplay:none;');
                    this.laserNode.style.background = 'url(data:image/png;base64,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)';
                    if (Object.prototype.toString.call(this.canvas) === '[object HTMLCanvasElement]') {
                        this.canvas.parentElement.appendChild(this.laserNode);
                    }
                    else {
                        document.body.appendChild(this.laserNode);
                    }
                }
                else {
                    if (Object.prototype.toString.call(this.laserNode) === '[object HTMLDivElement]') {
                        this.laserNode.parentNode.removeChild(this.laserNode);
                        this.laserNode = null;
                    }
                }
                // this.canvas.style.display = (mode === OPERATING_MODE.CANVAS) ? 'block' : 'none';
                this._mode = mode;
            },
        });
        _this.color = o.color || _this.color;
        _this.lineSize = o.lineSize || _this.lineSize;
        _this.svgScore = o.svgScore;
        _this.canvas = o.canvas;
        // 是否服务器模式. 服务模式: 允许发送绘制数据 绘制本地路径 非服务模式: 不发送绘制数据  绘制接收数据
        _this.serverMode = Object.prototype.toString.call(o.serverMode) == '[object Boolean]' ? o.serverMode : _this.serverMode;
        // 运行环境: piano 琴端  mobile 移动端
        _this.environment = Object.prototype.toString.call(o.environment) === '[object String]' ? o.environment : 'mobile';
        _this.emitDataFn = Object.prototype.toString.call(o.emitData) === '[object Function]' ? o.emitData : function () { };
        _this.drawCtrl = {
            enableDraw: true,
            enableErase: false,
            mouseDown: false,
            trashIndex: null,
        };
        _this.drawPath = {
            id: '',
            start: [0, 0, 0, 0],
            end: [0, 0, 0, 0],
            path: [],
            sectionPoint: { mm: -1, xp: 0, yp: 0 },
            brushSize: _this.lineSize,
            brushType: BRUSHTYPE.FREE,
            color: _this.color,
            shadowBlur: 0,
            shadowColor: 'blue',
            display: true,
        };
        _this.loadMeasuresInfo();
        return _this;
    }
    whiteBoard.prototype.touchStart = function (e) {
        if (this.operatingMode !== OPERATING_MODE.CANVAS || !this.serverMode) {
            return;
        }
        var scale = this.svgScore ? this.svgScore.musScore.scale : 1;
        var pointX = Math.round((e.offsetX || e.clientX) / scale);
        var pointY = Math.round((e.offsetY || e.clientY) / scale);
        var firstPoint = this.transformFirstPoint(e);
        var transPoint = this.transformPoint(e, firstPoint.mm);
        if (this.drawCtrl.enableDraw) {
            this._setDrawCtrl.call(this, {
                mouseDown: true,
            });
            // 创建一条新路径
            this._setDrawPath.call(this, {
                color: this.color,
                brushSize: Math.floor(this.lineSize / scale),
                start: [pointX, pointY, Math.round(transPoint.xp), Math.round(transPoint.yp)],
                sectionPoint: firstPoint,
                brushType: this.lineType,
                path: [],
                display: true,
                id: this._uuid(),
            });
        }
        if (this.drawCtrl.enableErase) {
            var trashIndex = this._checkInPath.call(this, [pointX, pointY]);
            if (trashIndex !== null) {
                this._setDrawCtrl.call(this, {
                    trashIndex: trashIndex,
                });
                var tempDrawPath = Object.assign({}, this.drawList[trashIndex], {
                    shadowBlur: 10,
                    shadowColor: this.drawList[trashIndex].color,
                });
                this._renderPath.call(this, tempDrawPath);
            }
            else {
                this._setDrawCtrl.call(this, {
                    trashIndex: null,
                });
            }
        }
    };
    whiteBoard.prototype.touchMove = function (e) {
        if (this.operatingMode === OPERATING_MODE.LASER && Object.prototype.toString.call(this.laserNode) === '[object HTMLDivElement]') {
            if (this.laserNode.style.display === 'none') {
                this.laserNode.style.display = 'block';
            }
            var transPoint = this.transformFirstPoint(e);
            this.laserPoint = {
                sectionNumber: transPoint.mm,
                clientX: e.offsetX || e.clientX,
                clientY: e.offsetY || e.clientY,
                transpointX: transPoint.xp,
                transpointY: transPoint.yp,
            };
            this.laserMove();
            return;
        }
        if (this.operatingMode === OPERATING_MODE.CANVAS && this.drawCtrl.enableDraw && this.drawCtrl.mouseDown) {
            var scale = this.svgScore ? this.svgScore.musScore.scale : 1;
            var pointX = Math.round((e.offsetX || e.clientX) / scale);
            var pointY = Math.round((e.offsetY || e.clientY) / scale);
            var transPoint = this.transformPoint(e, this.drawPath.sectionPoint.mm);
            if (this.drawPath.brushType === BRUSHTYPE.FREE) {
                var path = this.drawPath.path || [];
                path.push([pointX, pointY, Math.round(transPoint.xp), Math.round(transPoint.yp)]);
                this._setDrawPath.call(this, {
                    path: path,
                    end: [pointX, pointY, Math.round(transPoint.xp), Math.round(transPoint.yp)],
                });
            }
            else {
                this._setDrawPath.call(this, {
                    end: [pointX, pointY, Math.round(transPoint.xp), Math.round(transPoint.yp)],
                });
            }
            this._reRenderAllPath.call(this);
            this._renderPath.call(this, this.drawPath);
            // 保存路径点
            this.unEmitList.push([Math.round(transPoint.xp), Math.round(transPoint.yp)]);
            this.progressPath = this.drawPath;
            this.serverMode && this.emitCanvasData('progress');
        }
    };
    whiteBoard.prototype.touchEnd = function (e) {
        if (this.operatingMode !== OPERATING_MODE.CANVAS || !this.serverMode) {
            if (Object.prototype.toString.call(this.laserNode) === '[object HTMLDivElement]') {
                this.laserNode.style.display = 'none';
            }
            return;
        }
        if (this.drawCtrl.enableDraw && this.drawCtrl.mouseDown) {
            var scale = this.svgScore ? this.svgScore.musScore.scale : 1;
            var pointX = Math.round((e.offsetX || e.clientX) / scale);
            var pointY = Math.round((e.offsetY || e.clientY) / scale);
            var transPoint = this.transformPoint(e, this.drawPath.sectionPoint.mm);
            this._setDrawCtrl.call(this, {
                mouseDown: false,
            });
            var start = this.drawPath.start;
            // 如果抬手时起点和终点没变化 则不保存绘制记录
            if (start[0] != pointX || start[1] != pointY) {
                this._setDrawPath.call(this, {
                    end: [pointX, pointY, Math.round(transPoint.xp), Math.round(transPoint.yp)],
                });
                // 保存绘制记录
                this.drawList.push(this.drawPath);
                // 绘制当前路径
                this._reRenderAllPath.call(this);
                this.progressPath = undefined;
            }
            this.serverMode && this.emitCanvasData('draw');
        }
        if (this.drawCtrl.enableErase && this.drawCtrl.trashIndex !== null) {
            // 在路径列表中找到要擦除的路径
            var s = this.drawList[this.drawCtrl.trashIndex];
            // 隐藏该路径
            s.display = false;
            // 在路径列表中存一条橡皮擦使用记录. 撤销动作会用到
            this.drawList.push({ erase: true, id: s.id, start: [0, 0], end: [0, 0], path: [] });
            // 清除被擦除的路径索引 否则此方法if条件失效
            this.drawCtrl.trashIndex = null;
            // 重绘所有路径
            this._reRenderAllPath.call(this);
            this.serverMode && this.emitCanvasData('erase');
        }
    };
    whiteBoard.prototype.clearFn = function () {
        this.drawList = [];
        this.undoList = [];
        this._reRenderAllPath.call(this);
        this.serverMode && this.emitCanvasData('clear');
    };
    whiteBoard.prototype.eraseFn = function (state) {
        this._setDrawCtrl.call(this, {
            enableDraw: !state,
            enableErase: state,
        });
    };
    whiteBoard.prototype.undoFn = function () {
        if (this.drawList.length > 0) {
            // 删除路径列表最近一条
            var s = this.drawList.pop();
            // 放到已撤销列表里
            this.undoList.push(s);
            // 如果是撤销橡皮擦的动作 根据id匹配被擦掉的路径并显示出来
            if (s.erase) {
                for (var _i = 0, _a = this.drawList; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.id == s.id) {
                        item.display = true;
                        break;
                    }
                }
            }
            this._reRenderAllPath.call(this);
            this.serverMode && this.emitCanvasData('undo');
        }
    };
    whiteBoard.prototype.redoFn = function () {
        if (this.undoList.length > 0) {
            // 删除重做列表里最近的一项
            var s = this.undoList.pop();
            // 放回到路径列表
            this.drawList.push(s);
            // 如果是恢复橡皮擦动作 根据id匹配路径后设置为隐藏
            if (s.erase) {
                for (var _i = 0, _a = this.drawList; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.id == s.id) {
                        item.display = false;
                        break;
                    }
                }
            }
            this._reRenderAllPath.call(this);
            this.serverMode && this.emitCanvasData('redo');
        }
    };
    // 在客户端还原激光笔位置
    whiteBoard.prototype.clientLaserSync = function (recivedData) {
        this.laserPointList = this.laserPointList.concat(recivedData);
        if (this.laserRevertEngineStopd) {
            this.laserRevertEngine();
        }
    };
    // #region 服务端增量接收
    whiteBoard.prototype.clientRerender = function (recivedData) {
        if (recivedData.type == 'undo') {
            // 数据都在 直接按撤回逻辑走
            this.undoFn();
        }
        else if (recivedData.type == 'redo') {
            this.redoFn();
        }
        else if (recivedData.type == 'clear') {
            this.clearFn();
        }
        else if (recivedData.type == 'erase') {
            // 使用橡皮依旧保存一条操作记录 并匹配对应路径进行隐藏
            this.drawList.push(recivedData.drawPath);
            var id = recivedData.drawPath.id;
            for (var _i = 0, _a = this.drawList; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == id) {
                    item.display = false;
                    break;
                }
            }
            this._reRenderAllPath.call(this);
        }
        else {
            // 查找已存在的路径信息
            var currList = this.drawList.filter(function (item) {
                return item.id == recivedData.drawPath.id;
            });
            // 不存在则追加一条
            if (currList.length == 0) {
                this.drawList.push(recivedData.drawPath);
            }
            else {
                // 将传递的增量数据追加
                currList[0].path = currList[0].path.concat(recivedData.drawPath.path);
                // 修改路径终点
                currList[0].end = recivedData.drawPath.end;
            }
            this._reRenderAllPath.call(this);
        }
    };
    whiteBoard.prototype.reRenderAll = function () {
        this._reRenderAllPath();
    };
    // #endregion
    whiteBoard.prototype.loadMeasuresInfo = function () {
        if (typeof (this.svgScore) !== 'object') {
            return;
        }
        var musScore = this.svgScore.musScore;
        this.measures = [];
        for (var _i = 0, _a = musScore.measureInfos; _i < _a.length; _i++) {
            var i = _a[_i];
            var mes = this.svgScore.getMeasurePos(i.mm);
            this.measures.push({
                mm: i.mm,
                x: mes.x,
                y: mes.y,
                w: mes.w,
                h: mes.h,
            });
        }
    };
    whiteBoard.prototype._drawFree = function (ctx, start, end, path) {
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        for (var i = 0; i < path.length; i++) {
            var c = path[i];
            ctx.lineTo(c[0], c[1]);
        }
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    };
    whiteBoard.prototype._drawClientFree = function (ctx, start, end, path, sectionPoint) {
        ctx.beginPath();
        var revertStart = this.revertPoint(sectionPoint.mm, start[2], start[3]);
        ctx.moveTo(revertStart.x, revertStart.y);
        for (var i = 0; i < path.length; i++) {
            var c = path[i];
            // 传输时减少数据量只传输了转换后的坐标.[0]为xp, [1]为yp
            var revertPath = this.revertPoint(sectionPoint.mm, c[0], c[1]);
            ctx.lineTo(revertPath.x, revertPath.y);
        }
        var revertEnd = this.revertPoint(sectionPoint.mm, end[2], end[3]);
        ctx.lineTo(revertEnd.x, revertEnd.y);
        ctx.stroke();
    };
    whiteBoard.prototype._drawLine = function (ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    };
    whiteBoard.prototype._drawClientLine = function (ctx, start, end, sectionPoint) {
        ctx.beginPath();
        var revertStart = this.revertPoint(sectionPoint.mm, start[2], start[3]);
        ctx.moveTo(revertStart.x, revertStart.y);
        var revertEnd = this.revertPoint(sectionPoint.mm, end[2], end[3]);
        ctx.lineTo(revertEnd.x, revertEnd.y);
        ctx.stroke();
    };
    whiteBoard.prototype._drawCircle = function (ctx, start, end) {
        var x = (start[0] + end[0]) / 2; // circle center x
        var y = (start[1] + end[1]) / 2; // circle center y
        var a = Math.abs(end[0] - start[0]) / 2; // circle half width in x
        var b = Math.abs(end[1] - start[1]) / 2; // circle half width in y
        var k = .5522848;
        var ox = a * k;
        var oy = b * k;
        ctx.beginPath();
        ctx.moveTo(x - a, y);
        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        ctx.closePath();
        ctx.stroke();
    };
    whiteBoard.prototype._drawClientCircle = function (ctx, start, end, sectionPoint) {
        var revertStart = this.revertPoint(sectionPoint.mm, start[2], start[3]);
        var revertEnd = this.revertPoint(sectionPoint.mm, end[2], end[3]);
        var x = (revertStart.x + revertEnd.x) / 2; // circle center x
        var y = (revertStart.y + revertEnd.y) / 2; // circle center y
        var a = Math.abs(revertEnd.x - revertStart.x) / 2; // circle half width in x
        var b = Math.abs(revertEnd.y - revertStart.y) / 2; // circle half width in y
        var k = .5522848;
        var ox = a * k;
        var oy = b * k;
        ctx.beginPath();
        ctx.moveTo(x - a, y);
        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        ctx.closePath();
        ctx.stroke();
    };
    whiteBoard.prototype._drawRect = function (ctx, start, end) {
        var width = end[0] - start[0];
        var height = end[1] - start[1];
        ctx.beginPath();
        ctx.rect(start[0], start[1], width, height);
        ctx.stroke();
    };
    whiteBoard.prototype._drawClientRect = function (ctx, start, end, sectionPoint) {
        var revertStart = this.revertPoint(sectionPoint.mm, start[2], start[3]);
        var revertEnd = this.revertPoint(sectionPoint.mm, end[2], end[3]);
        var width = revertEnd.x - revertStart.x;
        var height = revertEnd.y - revertStart.y;
        ctx.beginPath();
        ctx.rect(revertStart.x, revertStart.y, width, height);
        ctx.stroke();
    };
    whiteBoard.prototype._renderPath = function (drawPath) {
        var ctx = this.ctx;
        var start = drawPath.start;
        var end = drawPath.end;
        var path = drawPath.path;
        var color = drawPath.color;
        var brushSize = drawPath.brushSize || 4;
        var brushType = drawPath.brushType;
        var shadowBlur = drawPath.shadowBlur;
        var shadowColor = drawPath.shadowColor;
        var sectionPoint = drawPath.sectionPoint;
        // set render style
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = shadowColor;
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        switch (brushType) {
            case BRUSHTYPE.FREE:
                this.serverMode ? this._drawFree(ctx, start, end, path) : this._drawClientFree(ctx, start, end, path, sectionPoint);
                break;
            case BRUSHTYPE.LINE:
                this.serverMode ? this._drawLine(ctx, start, end) : this._drawClientLine(ctx, start, end, sectionPoint);
                break;
            case BRUSHTYPE.CIRCLE:
                this.serverMode ? this._drawCircle(ctx, start, end) : this._drawClientCircle(ctx, start, end, sectionPoint);
                break;
            case BRUSHTYPE.RECT:
                this.serverMode ? this._drawRect(ctx, start, end) : this._drawClientRect(ctx, start, end, sectionPoint);
                break;
            default:
                break;
        }
    };
    whiteBoard.prototype._reRenderAllPath = function (allPath) {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        var list = allPath || this.drawList;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            // 橡皮擦路径和被擦除的路径不进行绘制
            if (item.display && !item.erase) {
                this._renderPath.call(this, item);
            }
        }
    };
    whiteBoard.prototype._setDrawCtrl = function (ctrl) {
        this.drawCtrl = Object.assign({}, this.drawCtrl, ctrl);
    };
    whiteBoard.prototype._setDrawPath = function (drawPath) {
        this.drawPath = Object.assign({}, this.drawPath, drawPath);
    };
    whiteBoard.prototype._checkInPath = function (point) {
        for (var i = 0; i < this.drawList.length; i++) {
            var item = this.drawList[i];
            // 在没有被擦除的路径上判断点击点
            if (item.brushType === BRUSHTYPE.FREE && item.display && this._checkInFree(item.start, item.end, item.path, point, item.brushSize)) {
                return i;
            }
            if (item.brushType === BRUSHTYPE.LINE && item.display && this._checkInLine(item.start, item.end, point, item.brushSize)) {
                return i;
            }
            if (item.brushType === BRUSHTYPE.CIRCLE && item.display && this._checkInCircle(item.start, item.end, point, item.brushSize)) {
                return i;
            }
            if (item.brushType === BRUSHTYPE.RECT && item.display && this._checkInRect(item.start, item.end, point, item.brushSize)) {
                return i;
            }
        }
        return null;
    };
    whiteBoard.prototype._checkInFree = function (start, end, path, point, d) {
        var diff = d || 4;
        var list = [start].concat(path).concat([end]);
        for (var i = 0; i < list.length - 1; i++) {
            var c = list[i];
            var next = list[i + 1];
            var xDiff = Math.abs(c[0] - next[0]);
            var yDiff = Math.abs(c[1] - next[1]);
            if (xDiff >= diff || yDiff >= diff) {
                var step = xDiff > yDiff ? xDiff : yDiff;
                for (var j = 0; j <= step; j++) {
                    var insertPoint = [c[0] + (c[0] - next[0]) / xDiff * j * ((xDiff) / step), c[1] + (c[1] - next[1]) / yDiff * j * ((yDiff) / step)];
                    if (Math.abs(insertPoint[0] - point[0]) <= diff && Math.abs(insertPoint[1] - point[1]) <= diff) {
                        return true;
                    }
                }
            }
            if (Math.abs(c[0] - point[0]) <= diff && Math.abs(c[1] - point[1]) <= diff) {
                return true;
            }
        }
        return false;
    };
    whiteBoard.prototype._checkInLine = function (start, end, point, d) {
        var diff = d || 4;
        var x1 = start[0];
        var y1 = start[1];
        var x2 = end[0];
        var y2 = end[1];
        var px = point[0];
        var py = point[1];
        var computeY = ((y2 - y1) * (px - x1)) / (x2 - x1) + y1;
        var computeX = ((x2 - x1) * (py - y1)) / (y2 - y1) + x1;
        return (Math.abs(computeY - py) <= diff || Math.abs(computeX - px) <= diff)
            && (x1 > x2 ? (px >= x2 - diff && px <= x1 + diff) : (px >= x1 - diff && px <= x2 + diff))
            && (y1 > y2 ? (py >= y2 - diff && py <= y1 + diff) : (py >= y1 - diff && py <= y2 + diff));
    };
    whiteBoard.prototype._checkInRect = function (start, end, point, d) {
        var diff = d || 4;
        var x1 = start[0];
        var y1 = start[1];
        var x2 = end[0];
        var y2 = end[1];
        return (this._checkInLine([x1, y1], [x2, y1], point, diff)
            || this._checkInLine([x1, y1], [x1, y2], point, diff)
            || this._checkInLine([x1, y2], [x2, y2], point, diff)
            || this._checkInLine([x2, y1], [x2, y2], point, diff));
    };
    whiteBoard.prototype._checkInCircle = function (start, end, point, d) {
        var x = (start[0] + end[0]) / 2;
        var y = (start[1] + end[1]) / 2;
        var a = Math.abs(end[0] - start[0]) / 2;
        var b = Math.abs(end[1] - start[1]) / 2;
        var px = point[0] - x;
        var py = point[1] - y;
        return (Math.abs(1 - (Math.pow(px, 2) / Math.pow(a, 2) + Math.pow(py, 2) / Math.pow(b, 2))) <= 0.2);
    };
    whiteBoard.prototype.laserMove = function () {
        if (this.serverMode) {
            this.laserNode.style.top = this.laserPoint.clientY + 'px';
            this.laserNode.style.left = this.laserPoint.clientX + 'px';
            this.unEmitList.push(this.laserPoint);
            this.emitLaserData();
        }
    };
    whiteBoard.prototype.laserRevertEngine = function () {
        if (this.laserPointList.length !== 0) {
            this.laserRevertEngineStopd = false;
            this.laserPoint = this.laserPointList.shift();
            var pos = this.revertLaserPoint(this.laserPoint.sectionNumber, this.laserPoint.transpointX, this.laserPoint.transpointY);
            this.laserNode.style.top = pos.y + 'px';
            this.laserNode.style.left = pos.x + 'px';
            requestAnimationFrame(this.laserRevertEngine.bind(this));
        }
        else {
            this.laserRevertEngineStopd = true;
        }
    };
    whiteBoard.prototype.transformFirstPoint = function (e) {
        var x = (e.offsetX || e.clientX);
        var y = (e.offsetY || e.clientY);
        if (typeof (this.svgScore) !== 'object') {
            return { mm: -1, xp: x, yp: y };
        }
        var musScore = this.svgScore.musScore;
        var scale = musScore.scale;
        // 曲谱被缩放 但是返回的坐标信息是1:1的信息. 传进来的x值需要除以缩放比例达到位移变化和曲谱统一
        x = x / scale - musScore.page.x;
        // if (this.environment === 'piano') {
        //   // 琴端第一页为标题页 非曲谱 减去一页的宽度
        //   const page = Math.ceil(x / this.findStaff.pageSize.w / scale) - 1;
        //   x = x - (this.findStaff.pageSize.w * page / scale);
        // }
        y = y / scale;
        var xp = 0;
        var yp = 0;
        var mm = this.findNearestPoint(x, y, 0, 20);
        if (mm > -1) {
            xp = x - this.measures[mm].x;
            yp = y - this.measures[mm].y;
        }
        return { mm: mm, xp: xp, yp: yp };
    };
    whiteBoard.prototype.transformPoint = function (e, mm) {
        var x = (e.offsetX || e.clientX);
        var y = (e.offsetY || e.clientY);
        if (mm === -1) {
            return { mm: mm, xp: x, yp: y };
        }
        var musScore = this.svgScore.musScore;
        var scale = musScore.scale;
        x = x / scale - musScore.page.x;
        // if (this.environment === 'piano') {
        //   x = x - (this.findStaff.pageSize.w / scale);
        // }
        y = y / scale;
        var xp = x - this.measures[mm].x;
        var yp = y - this.measures[mm].y;
        return { mm: mm, xp: xp, yp: yp };
    };
    whiteBoard.prototype.findNearestPoint = function (x, y, range, accuracy) {
        // 以x, y为中心点, 扩张度*2为边长, 做碰撞矩形.
        var rect = {
            x: x - range,
            y: y - range,
            w: range * 2,
            h: range * 2
        };
        // 碰撞矩形大于窗口 则全程无碰撞 (避免第一页全屏封面, 判断1.2倍的窗口宽度.)
        if (rect.x < 0 && rect.w > window.innerWidth * 1.2 && rect.y < 0 && rect.h > window.innerHeight * 1.2) {
            return -1;
        }
        var impacted = false; // 是否已发生一次碰撞
        var impactMeasure = -1; // 碰撞小节编号
        for (var _i = 0, _a = this.measures; _i < _a.length; _i++) {
            var item = _a[_i];
            // 当前小节发生碰撞
            if (rect.x < item.x + item.w && rect.x + rect.w > item.x && rect.y < item.y + item.h && rect.h + rect.y > item.y) {
                if (impacted) {
                    // 上一小节也发生碰撞
                    // 连续碰撞的两个小节, Y一定是相同的. 判断x绝对值越大的越远
                    if (Math.abs(x - item.x) < Math.abs(x - this.measures[impactMeasure].x)) {
                        return item.mm;
                    }
                    return impactMeasure;
                }
                impacted = true;
                impactMeasure = item.mm;
            }
            else {
                // 当前小节没有碰撞 但上一小节发生碰撞. 不符合连续碰撞条件. 判定为单次碰撞. 返回碰撞小节.
                if (impacted) {
                    return impactMeasure;
                }
            }
        }
        range += accuracy;
        return this.findNearestPoint(x, y, range, accuracy);
    };
    whiteBoard.prototype.revertPoint = function (mm, xp, yp) {
        var position = {
            x: (this.measures[mm] ? this.measures[mm].x : 0) + xp,
            y: (this.measures[mm] ? this.measures[mm].y : 0) + yp,
        };
        // if (this.environment === 'piano') {
        //   position.x += this.findStaff.pageSize.w / this.findStaff.scale;
        // }
        return position;
    };
    whiteBoard.prototype.revertLaserPoint = function (mm, xp, yp) {
        var scale = this.svgScore ? this.svgScore.musScore.scale : 1;
        var position = {
            x: (this.measures[mm] ? this.measures[mm].x : 0) + xp,
            y: (this.measures[mm] ? this.measures[mm].y : 0) + yp,
        };
        // if (this.environment === 'piano') {
        //   position.x += this.findStaff.pageSize.w / this.findStaff.scale;
        // }
        position.x *= scale;
        position.y *= scale;
        return position;
    };
    whiteBoard.prototype._uuid = function () {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        for (i = 0; i < 8; i++) {
            uuid[i] = chars[0 | Math.random() * 16];
        }
        return uuid.join('');
    };
    whiteBoard.prototype.getBoardData = function () {
        return {
            drawList: this.drawList,
            undoList: this.undoList,
            progressPath: this.progressPath,
        };
    };
    whiteBoard.prototype.emitCanvasData = function (operate) {
        var _this = this;
        if (operate === void 0) { operate = ''; }
        // #region 增量提交
        var increment = {
            type: operate,
            drawPath: [],
        };
        var allData = this.getBoardData();
        if (operate == 'progress' && this.enableEmit) {
            var tempPath = JSON.parse(JSON.stringify(this.progressPath));
            tempPath.path = JSON.parse(JSON.stringify(this.unEmitList));
            increment.drawPath = tempPath;
            this.unEmitList = [];
            this.enableEmit = false;
            this.emitDataFn({ type: 'canvas', data: { increment: increment, allData: allData } });
            setTimeout(function () {
                _this.enableEmit = true;
            }, 100);
        }
        else {
            if (operate == 'clear' || operate == 'undo' || operate == 'redo') {
                increment.drawPath = [];
                this.emitDataFn({ type: 'canvas', data: { increment: increment, allData: allData } });
            }
            else if (operate == 'erase') {
                increment.drawPath = this.drawList[this.drawList.length - 1];
                this.emitDataFn({ type: 'canvas', data: { increment: increment, allData: allData } });
            }
            else if (operate == 'draw') {
                var tempPath = JSON.parse(JSON.stringify(this.drawList[this.drawList.length - 1]));
                tempPath.path = this.unEmitList;
                this.unEmitList = [];
                increment.drawPath = tempPath;
                this.emitDataFn({ type: 'canvas', data: { increment: increment, allData: allData } });
            }
        }
        // #endregion
    };
    whiteBoard.prototype.emitLaserData = function () {
        var _this = this;
        if (this.enableEmit) {
            this.enableEmit = false;
            this.emitDataFn({ type: 'laser', data: this.unEmitList });
            this.unEmitList = [];
            setTimeout(function () {
                _this.enableEmit = true;
            }, 100);
        }
    };
    return whiteBoard;
}(whiteBoardBasic));
export default whiteBoard;

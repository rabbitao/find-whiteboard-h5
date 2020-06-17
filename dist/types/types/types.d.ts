export declare enum BRUSHTYPE {
    LINE = "line",
    FREE = "free",
    CIRCLE = "circle",
    RECT = "rect"
}
export interface sectionPointType {
    mm: number;
    xp: number;
    yp: number;
}
export interface drawObject {
    id: string;
    start: number[];
    end: number[];
    path: Array<[number, number, number, number]>;
    sectionPoint?: sectionPointType;
    brushSize?: number;
    brushType?: BRUSHTYPE;
    color?: string;
    shadowBlur?: number;
    shadowColor?: string;
    display?: boolean;
    erase?: boolean;
}
export interface canvasIncrementData {
    type: string;
    drawPath: drawObject | [];
}
export interface canvasAllData {
    drawList: drawObject[];
    undoList: drawObject[];
    progressPath: drawObject | undefined;
}
export interface canvasEmitData {
    increment: canvasIncrementData;
    allData: canvasAllData;
}
export interface laserPointData {
    sectionNumber: number;
    clientX: number;
    clientY: number;
    transpointX: number;
    transpointY: number;
}
export interface emitData {
    type: string;
    data: canvasEmitData | laserPointData[];
}
export interface drawCtrlData {
    enableDraw: boolean;
    enableErase: boolean;
    mouseDown: boolean;
    trashIndex: number | null;
}
export interface svgMeasureInfos {
    linex: number;
    liney: number;
    w: number;
    h: number;
    x: number;
    mm: number;
}
export interface svgScore {
    musScore: {
        scale: number;
        lines: Array<{
            distance: number;
            x: number;
            y: number;
            w: number;
            h: number;
        }>;
        page: {
            x: number;
            w: number;
            h: number;
        };
        measureInfos: svgMeasureInfos[];
    };
    getMeasurePos(args: number): measuresObject;
}
export interface measuresObject {
    mm: number;
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare enum OPERATING_MODE {
    CANVAS = "canvas",
    LASER = "laser",
    NONE = ""
}

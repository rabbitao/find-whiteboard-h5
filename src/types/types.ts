export enum BRUSHTYPE {
  LINE = 'line',
  FREE = 'free',
  CIRCLE = 'circle',
  RECT = 'rect',
}

export interface sectionPointType {
  mm: number;
  xp: number;
  yp: number;
}

// 路径
export interface drawObject {
  id: string;             // 唯一标识 橡皮相关操作时用来匹配唯一路径
  start: number[];   // 起点 [x, y]
  end: number[];     // 终点 [x, y]
  path: Array<[number, number, number, number]>; // 路径信息 二维数组 [[x, y, staff-x, staff-y]]
  sectionPoint?: sectionPointType;     // 曲谱转化对象 由曲谱对象内置方法提供
  brushSize?: number;      // 笔触宽度
  brushType?: BRUSHTYPE;   // 线条类型
  color?: string;         // 笔触颜色
  shadowBlur?: number;    // 笔触阴影
  shadowColor?: string;   // 阴影颜色
  display?: boolean;      // 路径显示状态 表示是否被橡皮擦擦除
  erase?: boolean;        // 本路径是橡皮擦路径 or 绘制路径
}

// canvas增量提交数据格式
export interface canvasIncrementData {
  type: string;
  drawPath: drawObject | [];
}

// canvas数据格式
export interface canvasAllData {
  drawList: drawObject[];
  undoList: drawObject[];
  progressPath: drawObject | undefined;
}

// canvas提交全部数据格式
export interface canvasEmitData {
  increment: canvasIncrementData;
  allData: canvasAllData;
}

// 激光笔定位数据格式
export interface laserPointData {
  sectionNumber: number;
  clientX: number;
  clientY: number;
  transpointX: number;
  transpointY: number;
}

// 白板提交数据的格式
export interface emitData {
  type: string;
  data: canvasEmitData | laserPointData[];
}

// 绘制控制
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

// 曲谱小节列表定位
export interface measuresObject {
  mm: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

// 操作模式 画板/激光笔
export enum OPERATING_MODE {
  CANVAS = 'canvas',
  LASER = 'laser',
  NONE = '',
}

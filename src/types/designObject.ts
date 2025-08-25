export interface DesignObject {
    type: 'rect' | 'text' | 'button' | 'input' | 'circle';
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string;
    rx?: number;
    ry?: number;
    fontSize?: number;
    text?: string;
    textColor?: string;
    fontFamily?: string;
    fontWeight?: string;
}
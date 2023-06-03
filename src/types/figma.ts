interface FigmaDocument {
  id: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: Document;
  components: Record<string, Component>;
  images: Record<string, string>;
  schemaVersion: number;
  styles: Record<string, Style>;
}

interface Document {
  id: string;
  name: string;
  type: 'DOCUMENT';
  children: Canvas[];
}

interface Canvas {
  id: string;
  name: string;
  type: 'CANVAS';
  children: Frame[];
}

interface Frame {
  id: string;
  name: string;
  type: 'FRAME';
  children: SceneNode[];
  absoluteBoundingBox: AbsoluteBoundingBox;
  constraints: Constraints;
  clipsContent: boolean;
  background: Paint[];
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  backgroundColor: Color;
  effects: Effect[];
}

interface SceneNode {
  id: string;
  name: string;
  type: 'RECTANGLE' | 'TEXT' | 'VECTOR' | 'GROUP' | 'COMPONENT' | 'INSTANCE';
  visible: boolean;
  locked: boolean;
  blendMode: string;
  absoluteBoundingBox: AbsoluteBoundingBox;
  constraints: Constraints;
}

interface AbsoluteBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface GradientStop {
  color: Color;
  position: number;
}

interface VectorNode extends SceneNode {
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  styles: { [key: string]: string };
  effects: Effect[];
  vectorPaths: VectorPaths[];
  vectorNetwork: VectorNetwork;
}

interface VectorPaths {
  windingRule: 'EVENODD' | 'NONZERO';
  data: string;
}

interface VectorNetwork {
  vertices: Vertice[];
  segments: Segment[];
}

interface Vertice {
  x: number;
  y: number;
  strokeCap?: 'NONE' | 'ROUND' | 'SQUARE';
  strokeJoin?: 'MITER' | 'BEVEL' | 'ROUND';
  cornerRadius?: number;
}

interface Segment {
  startVertexId: number;
  endVertexId: number;
  tangentStart?: { x: number; y: number };
  tangentEnd?: { x: number; y: number };
  windingRule?: 'EVENODD' | 'NONZERO';
}

interface GroupNode extends SceneNode {
  children: SceneNode[];
}

interface ComponentNode extends SceneNode {
  description: string;
  instances?: SceneNode[];
}

interface InstanceNode extends SceneNode {
  componentId: string;
}

interface TextNode extends SceneNode {
  characters: string;
  style: Style;
  characterStyleOverrides: number[];
  styleOverrideTable: { [key: string]: Style };
  lineHeight: LineHeight;
  textCase: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  textDecoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  paragraphIndent: number;
  paragraphSpacing: number;
  autoRename: boolean;
  layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
}

interface LineHeight {
  value: number;
  unit: 'PIXELS' | 'FONT_SIZE_%';
}

interface RectangleNode extends SceneNode {
  cornerRadius: number;
  rectangleCornerRadii: number[];
  absoluteBoundingBox: BoundingBox;
  constraints: Constraints;
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  styles: { [key: string]: string };
  effects: Effect[];
  backgroundColor: Color;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Constraints {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'SCALE';
}

interface Paint {
  type: 'SOLID' | 'GRADIENT' | 'IMAGE' | 'EMOJI';
  visible: boolean;
  opacity: number;
  blendMode: string;
  color?: Color;
  gradientStops?: GradientStop[];
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Effect {
  type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  color: Color;
  offset: { x: number; y: number };
  radius: number;
  visible?: boolean;
  blendMode?: 'PASS_THROUGH' | 'NORMAL';
}

interface Component {
  key: string;
  name: string;
  description: string;
}

interface Style {
  key: string;
  name: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  description: string;
  fontFamily: string;
  fontPostScriptName: string;
  fontWeight: number;
  fontSize: number;
  textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  letterSpacing: number;
  lineHeightPx: number;
  lineHeightPercent: number;
  lineHeightUnit: 'PIXELS' | 'FONT_SIZE_%';
  lineHeightPercentFontSize: number;
  textColor?: Color;
}

export type {
  FigmaDocument,
  Document,
  Canvas,
  Frame,
  SceneNode,
  Component,
  Style,
  TextNode,
  RectangleNode,
  AbsoluteBoundingBox,
  Constraints,
  Paint,
  Color,
  GradientStop,
  VectorNode,
  VectorPaths,
  VectorNetwork,
  Vertice,
  Segment,
  GroupNode,
  BoundingBox,
  Effect,
  LineHeight,
  ComponentNode,
  InstanceNode,
};

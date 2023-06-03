import { AbsoluteBoundingBox, Color, RectangleNode, TextNode } from '../types/figma';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const rgbaToHex = (color: Color): string => {
  const { r, g, b, a } = color;

  const red = Math.round(r * 255)
    .toString(16)
    .padStart(2, '0');
  const green = Math.round(g * 255)
    .toString(16)
    .padStart(2, '0');
  const blue = Math.round(b * 255)
    .toString(16)
    .padStart(2, '0');

  const alpha = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  return `[#${red}${green}${blue}${alpha}]`;
};

const absoluteBoundingBoxToTailwind = (absoluteBoundingBox: AbsoluteBoundingBox) => {
  const { width, height, x, y } = absoluteBoundingBox;

  return [
    `w-[${Math.abs(width)}px]`,
    `h-[${Math.abs(height)}px]`,
    `left-[${Math.round(x)}px]`,
    `top-[${Math.round(y)}px]`,
  ];
};

const colorToTailwind = (color: Color, prefix: 'text' | 'bg'): string => `${prefix}-${rgbaToHex(color)}`;

const textNodeToTailwind = (textNode: TextNode): string[] => {
  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeightUnit, lineHeightPx, textAlignHorizontal } =
    textNode.style;

  const classes = [];

  // Convert font family to Tailwind CSS class
  if (fontFamily) {
    classes.push(`font-[${fontFamily}]`);
  }

  // Convert font size to Tailwind CSS class
  if (fontSize) {
    classes.push(`text-[${fontSize}px]`);
  }

  // Convert font weight to Tailwind CSS class
  if (fontWeight) {
    classes.push(`font-[${fontWeight}]`);
  }

  // Convert letter spacing to Tailwind CSS class
  if (letterSpacing) {
    classes.push(`tracking-[${letterSpacing}]`);
  }

  // Convert line height to Tailwind CSS class
  if (lineHeightUnit === 'PIXELS' && lineHeightPx) {
    classes.push(`leading-[${lineHeightPx}px]`);
  }

  // Convert text alignment to Tailwind CSS class
  if (textAlignHorizontal) {
    classes.push(`text-${textAlignHorizontal.toLowerCase()}`);
  }

  return classes;
};

const rectangleNodeToTailwind = (rectangleNode: RectangleNode): string[] => {
  const {
    absoluteBoundingBox,
    cornerRadius,
    rectangleCornerRadii,
    fills,
    strokes,
    strokeWeight,
    strokeAlign,
    backgroundColor,
  } = rectangleNode;

  const classes = [];

  classes.push('absolute');

  // Convert absolute bounding box to Tailwind CSS classes
  if (absoluteBoundingBox) {
    classes.push(...absoluteBoundingBoxToTailwind(absoluteBoundingBox));
  }

  // Convert corner radius to Tailwind CSS class
  if (cornerRadius > 0) {
    classes.push(`rounded-[${cornerRadius}px]`);
  }

  // Convert individual corner radii to Tailwind CSS classes
  if (rectangleCornerRadii && rectangleCornerRadii.length === 4) {
    const [topLeft, topRight, bottomRight, bottomLeft] = rectangleCornerRadii;
    classes.push(
      `rounded-tl-[${topLeft}px]`,
      `rounded-tr-[${topRight}px]`,
      `rounded-br-[${bottomRight}px]`,
      `rounded-bl-[${bottomLeft}px]`,
    );
  }

  // Convert background color to Tailwind CSS class
  if (backgroundColor) {
    const color = rgbaToHex(backgroundColor);
    classes.push(`bg-${color}`);
  }

  // Convert stroke styles to Tailwind CSS classes
  if (strokes && strokes.length > 0) {
    strokes.forEach((stroke: any) => {
      if (stroke.type === 'SOLID') {
        classes.push(`border-[${rgbaToHex(stroke.color)}]`);
      }
    });
  }

  // Convert stroke weight to Tailwind CSS class
  if (strokeWeight) {
    classes.push(`border-[${strokeWeight}]`);
  }

  // Convert stroke alignment to Tailwind CSS class
  if (strokeAlign) {
    classes.push(`border-[${strokeAlign.toLowerCase()}]`);
  }

  // Convert fill styles to Tailwind CSS classes
  if (fills && fills.length > 0) {
    fills.forEach((fill: any) => {
      if (fill.type === 'SOLID') {
        classes.push(colorToTailwind(fill.color, 'bg'));
      }
    });
  }

  return classes;
};

const generateTailwindStyle = async (htmlContent: string) => {
  return (
    await postcss([
      tailwindcss({
        content: [{ raw: htmlContent }],
      }),
      autoprefixer,
      cssnano,
    ]).process(`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `)
  ).css;
};

export { absoluteBoundingBoxToTailwind, textNodeToTailwind, rectangleNodeToTailwind, generateTailwindStyle };

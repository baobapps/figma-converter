import {
  ComponentNode,
  Frame,
  GroupNode,
  InstanceNode,
  RectangleNode,
  SceneNode,
  TextNode,
  VectorNode,
} from '../../types/figma';
import { getFigmaFileComponentImageSvg } from '../api';

const convertFigmaTextIntoHtml = (textNode: TextNode) => {
  // Style properties of the TextNode
  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeightPercentFontSize, textAlignHorizontal, textColor } =
    textNode.style;

  // Convert the color to RGBA format
  const color = textColor
    ? `rgba(${textColor.r * 255}, ${textColor.g * 255}, ${textColor.b * 255}, ${textColor.a})`
    : null;

  // Generate CSS
  const css = `style="font-family: '${fontFamily}'; font-size: ${fontSize}px; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing}em; line-height: ${
    lineHeightPercentFontSize / 100
  }; text-align: ${textAlignHorizontal.toLowerCase()}; ${color ? 'color: ' + color : ''};"`;

  // Generate HTML
  return `<p data-figma-type="text" ${css}>${textNode.characters}</p>`;
};
const convertFigmaVectorIntoHtml = async (vectorNode: VectorNode): Promise<string> => {
  return '<svg data-figma-type="vector"></svg>';
};
const convertFigmaGroupIntoHtml = async (node: GroupNode): Promise<string> => {
  const { children } = node;

  let convertedChildren = '';
  for (const child of children) {
    convertedChildren += (await convertFigmaSceneNodeIntoHtml(child)) + '\n';
  }

  return `
    <div data-figma-type="group">
      ${convertedChildren}
    </div>
`;
};
const convertFigmaComponentIntoHtml = (node: ComponentNode) => {
  // Extract the necessary properties from the ComponentNode
  const { name, description, instances } = node;

  // Generate the HTML representation of the component
  let html = `
    <div data-figma-type="component">
      <h2>${name}</h2>
      <p>${description}</p>
      <div>
        Instances:
        <ul>
  `;

  // Iterate over the instances and add them to the HTML
  instances?.forEach((instance) => {
    html += `<li>${instance.name}</li>`;
    // You can also recursively convert each instance to HTML if needed
    // html += convertFigmaNodeIntoHtml(instance);
  });

  html += `
        </ul>
      </div>
    </div>
  `;

  return html;
};
const convertFigmaInstanceIntoHtml = (node: InstanceNode) => {
  // Extract the necessary properties from the InstanceNode
  const { name, componentId } = node;

  // Generate the HTML representation of the instance
  return `
    <div data-figma-type="instance">
      <h3>${name}</h3>
      <p>Component ID: ${componentId}</p>
    </div>
  `;
};
const convertFigmaRectangleIntoHtml = (rectangleNode: RectangleNode) => {
  const { absoluteBoundingBox, fills, strokes, strokeWeight, strokeAlign, cornerRadius } = rectangleNode;
  const { r, g, b, a } = fills[0]?.color || { r: 0, g: 0, b: 0, a: 1 };

  // Generate the HTML representation of the rectangle
  return `
    <div style="
      position: absolute;
      left: ${absoluteBoundingBox.x}px;
      top: ${absoluteBoundingBox.y}px;
      width: ${absoluteBoundingBox.width}px;
      height: ${absoluteBoundingBox.height}px;
      background-color: rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a});
      border: ${strokeWeight}px ${strokeAlign} ${strokes[0]?.color};
      border-radius: ${cornerRadius}px;
    ">
    </div>
  `;
};

const convertFigmaSceneNodeIntoHtml = async (sceneNode: SceneNode): Promise<string> => {
  switch (sceneNode.type) {
    case 'RECTANGLE':
      return convertFigmaRectangleIntoHtml(sceneNode as RectangleNode);
    case 'TEXT':
      return convertFigmaTextIntoHtml(sceneNode as TextNode);
    case 'VECTOR':
      return await convertFigmaVectorIntoHtml(sceneNode as VectorNode);
    case 'GROUP':
      return convertFigmaGroupIntoHtml(sceneNode as GroupNode);
    case 'COMPONENT':
      return convertFigmaComponentIntoHtml(sceneNode as ComponentNode);
    case 'INSTANCE':
      return convertFigmaInstanceIntoHtml(sceneNode as InstanceNode);
    default:
      return '';
  }
};

const convertFigmaFrameIntoHtml = async (frame: Frame): Promise<string> => {
  const { absoluteBoundingBox, children } = frame;
  const { x, y, width, height } = absoluteBoundingBox;
  const style = `position: relative; left: ${0}px; top: ${0}px; width: ${width}px; height: ${height}px;`;

  let content = '';
  for (const sceneNode of frame.children) {
    content += (await convertFigmaSceneNodeIntoHtml(sceneNode)) + '\n';
  }

  return `
      <!DOCTYPE html>
     <html lang="en">
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <head>
        <title>${frame.name}</title>
      </head>
      <body>
        <main data-figma-type="frame" style="${style}">${content}</main>
      </body>
</html>
  `;
};

export { convertFigmaFrameIntoHtml };

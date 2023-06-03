import {
  ComponentNode,
  Frame,
  GroupNode,
  InstanceNode,
  RectangleNode,
  SceneNode,
  TextNode,
  VectorNode,
} from '../types/figma';
import { getFigmaFileComponentImageSvg } from './api';
import { generateTailwindStyle, rectangleNodeToTailwind, textNodeToTailwind } from './tailwind';

const convertFigmaTextIntoHtml = (textNode: TextNode) => {
  return `
    <p id="${textNode.id}" data-figma-type="text" class="${textNodeToTailwind(textNode).join(' ')}">
      ${textNode.characters}
    </p>`;
};
const convertFigmaVectorIntoHtml = async (vectorNode: VectorNode): Promise<string> => {
  return `<svg id="${vectorNode.id}" data-figma-type="vector"></svg>`;
};
const convertFigmaGroupIntoHtml = async (node: GroupNode): Promise<string> => {
  const { children } = node;

  let convertedChildren = '';
  for (const child of children) {
    convertedChildren += (await convertFigmaSceneNodeIntoHtml(child)) + '\n';
  }

  return `
    <div id="${node.id}" data-figma-type="group">
      ${convertedChildren}
    </div>
`;
};
const convertFigmaComponentIntoHtml = (node: ComponentNode) => {
  // Extract the necessary properties from the ComponentNode
  const { name, description, instances } = node;

  // Generate the HTML representation of the component
  let html = `
    <div id="${node.id}" data-figma-type="component">
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
    <div id="${node.id}" data-figma-type="instance">
      <h3>${name}</h3>
      <p>Component ID: ${componentId}</p>
    </div>
  `;
};
const convertFigmaRectangleIntoHtml = (rectangleNode: RectangleNode) => {
  const classes = rectangleNodeToTailwind(rectangleNode);

  return `
    <div id="${rectangleNode.id}" data-figma-type="rectangle" class="${classes.join(' ')}"></div>
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
  // Extract the necessary properties from the frame
  const {
    id,
    name,
    absoluteBoundingBox,
    constraints,
    clipsContent,
    background,
    fills,
    strokes,
    strokeWeight,
    strokeAlign,
    backgroundColor,
    effects,
    children,
  } = frame;

  // Generate the HTML representation of the frame
  let content = `
    <div id="${id}" class="frame" style="
      position: absolute;
      width: ${absoluteBoundingBox.width}px;
      height: ${absoluteBoundingBox.height}px;
      background-color: ${
        backgroundColor
          ? `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${
              backgroundColor.a
            })`
          : 'transparent'
      };
      clip-path: ${clipsContent ? 'inset(0)' : 'none'};
    ">
  `;

  // Handle background styles
  if (background && background.length > 0) {
    background.forEach((bg: any) => {
      if (bg.type === 'SOLID') {
        content += `
          <div class="background" style="background-color: rgba(${bg.color.r * 255}, ${bg.color.g * 255}, ${
          bg.color.b * 255
        }, ${bg.color.a})"></div>
        `;
      } else if (bg.type === 'GRADIENT_LINEAR' || bg.type === 'GRADIENT_RADIAL') {
        // Handle gradient backgrounds
        const gradientStops = bg.gradientStops.map(
          (stop: any) =>
            `rgba(${stop.color.r * 255}, ${stop.color.g * 255}, ${stop.color.b * 255}, ${stop.color.a}) ${
              stop.position * 100
            }%`,
        );
        const gradientDirection =
          bg.type === 'GRADIENT_LINEAR'
            ? `${bg.gradientHandlePositions[0].x * 100}% ${bg.gradientHandlePositions[0].y * 100}%, ${
                bg.gradientHandlePositions[1].x * 100
              }% ${bg.gradientHandlePositions[1].y * 100}%`
            : 'center center, ellipse cover';

        content += `
          <div class="background" style="background-image: ${bg.type.toLowerCase()}(${gradientDirection}, ${gradientStops.join(
          ', ',
        )});"></div>
        `;
      }
    });
  }

  // Handle fills styles
  if (fills && fills.length > 0) {
    fills.forEach((fill: any) => {
      if (fill.type === 'SOLID') {
        content += `
          <div class="fill" style="background-color: rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${
          fill.color.b * 255
        }, ${fill.color.a})"></div>
        `;
      }
      // Handle other fill types if needed
    });
  }

  // Handle strokes styles
  if (strokes && strokes.length > 0) {
    strokes.forEach((stroke: any) => {
      if (stroke.type === 'SOLID') {
        content += `
          <div class="stroke" style="border: ${strokeWeight}px ${strokeAlign} rgba(${stroke.color.r * 255}, ${
          stroke.color.g * 255
        }, ${stroke.color.b * 255}, ${stroke.color.a})"></div>
        `;
      }
      // Handle other stroke types if needed
    });
  }

  // Handle effects styles
  if (effects && effects.length > 0) {
    effects.forEach((effect: any) => {
      // Handle different effect types if needed
    });
  }

  for (const sceneNode of children) {
    content += (await convertFigmaSceneNodeIntoHtml(sceneNode)) + '\n';
  }

  content += `</div>`;

  const style = await generateTailwindStyle(content);

  return `
<!DOCTYPE html>
<html lang="en">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <head>
    <title>${frame.name}</title>
  </head>
  <style>
    ${style}
  </style>
  <body>
    <main data-figma-type="frame" style="position: relative; background-color: lightpink">
      ${content}
    </main>
  </body>
</html>
  `;
};

export { convertFigmaFrameIntoHtml };

import fs from 'fs';

const isUrl = (path: string) => {
  const regex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return regex.test(path);
};

const stringIntoSnakeCase = (value: string) => {
  return value.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

const stringIntoKebabCase = (value: string) => {
  return value.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
};

const stringIntoPascalCase = (value: string) => {
  return value.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};

const stringIntoCamelCase = (value: string) => {
  return stringIntoPascalCase(value).replace(/^[A-Z]/, (match) => match.toLowerCase());
};

const fileExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export { isUrl, stringIntoSnakeCase, stringIntoPascalCase, stringIntoKebabCase, stringIntoCamelCase, fileExists };

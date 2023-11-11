const extractPath = (path: string): string[] => {
  const components = path.split('/');
  let parentPath: string = '';
  let name: string = '';

  if (components.length == 1) {
    parentPath = null;
    name = path;
  } else {
    parentPath = components.slice(0, -1).join('/');
    name = components[components.length - 1];
  }

  return [name, parentPath];
};

export default extractPath;

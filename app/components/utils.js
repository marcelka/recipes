const EMPTY_IMAGE = 'http://i.imgur.com/jSxvfCe.png'; // TODO put to settings

export function getThumbnail(_image, thumbSuffix) {
  var image = typeof _image === 'undefined' ? EMPTY_IMAGE : _image;
  let dotIndex = image.lastIndexOf('.');
  let lastSlash = image.lastIndexOf('/');
  if (dotIndex === -1 || dotIndex < lastSlash) {
    return image + thumbSuffix;
  }

  let name = image.substr(0, dotIndex);
  let ext = image.substr(dotIndex + 1);
  return `${name}${thumbSuffix}.${ext}`;
}

export function makePath(path) {
  if (typeof path === 'string' || typeof path === 'number') {
    return [path];
  } else if (path.constructor === Array) {
    return path;
  } else {
    throw new Error(`cannot makePath from ${path}`);
  }
}

export function join(path1, path2) {
  return [...makePath(path1), ...makePath(path2)];
}

export function updateIn(obj, path, value) {
  path = makePath(path);
  var key = path[0];
  var result;
  if (typeof key === 'string') result = {...obj};
  if (typeof key === 'number') result = [...obj];
  if (path.length === 1)
    result[key] = value;
  else
    result[key] = updateIn(result[key], path.slice(1), value);
  return result;
}

export function getIn(obj, path, notFound) {
  path = makePath(path);
  if (obj[path[0]]) {
    if (path.length === 1) return obj[path[0]];
    return getIn(obj[path[0]], path.slice(1), notFound);
  }
  return notFound;
}

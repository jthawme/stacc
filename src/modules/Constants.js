export const EVENTS = {
    CONVERT: 'convert',
    FINISHED: 'finished',
    PROGRESS: 'progress',
    ERROR: 'error',
    THUMBNAIL: 'thumbnail',
    INFO_REQUEST: 'info_request',
    INFO: 'info',
    EXTERNAL_FILE: 'external_file',
    VERSION_CHECK: 'version_check',
    UPDATE: 'update'
};

export const FILTERS = {
  VIDEO: [
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov'] }
  ],
  GIF: [
    { name: 'Gifs', extensions: ['gif'] }
  ]
}

export const EXPORTS = {
  VIDEO: 'VIDEO',
  GIF: 'GIF',
}

export const createAcceptsFromFilter = (filter) => {
  return filter.map(f => f.extensions.map(ext => `.${ext}`)).flat();
}

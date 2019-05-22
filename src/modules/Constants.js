export const EVENTS = {
    CONVERT: 'convert',
    FINISHED: 'finished',
    PROGRESS: 'progress',
    ERROR: 'error',
    THUMBNAIL: 'thumbnail',
    INFO_REQUEST: 'info_request',
    INFO: 'info'
};

export const FILTERS = {
  VIDEOS: [
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov'] }
  ],
  GIFS: [
    { name: 'Gifs', extensions: ['gif'] }
  ]
}

export const createAcceptsFromFilter = (filter) => {
  return filter.map(f => f.extensions.map(ext => `.${ext}`)).flat();
}

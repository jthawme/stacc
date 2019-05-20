const ImageLoader = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = src;
  })
};

export default ImageLoader;
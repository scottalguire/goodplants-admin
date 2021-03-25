module.exports = {
  has_length: function (el) {
    return el.length > 1;
  },
  array_to_comma_string: function (arr) {
    return Array.isArray(arr) ? arr.join(", ") : arr;
  },
  array_to_new_line_string: function (arr) {
    return Array.isArray(arr) ? arr.join("\n") : arr;
  },
  format_image_path: function (src) {
    const isAbsolute = new RegExp(/^(http|https|http:|https:|\/\/)/);

    if (isAbsolute.test(src)) {
      // path is absolute, return without adjustment
      return src;
    }

    if (typeof src === "string" && src.length && process.env.IMAGE_BASE_URL) {
      // src is a relative path, append the image base path configured in .env
      return process.env.IMAGE_BASE_URL + src;
    } else {
      // return a default if src attr is empty so we don't render (unknown)
      return "https://source.unsplash.com/200x200?plant";
    }
  },
};

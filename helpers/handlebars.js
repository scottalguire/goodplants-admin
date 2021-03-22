module.exports = {
  has_length: function (el) {
    return el.length > 1;
  },
  array_to_comma_string: function (arr) {
    return Array.isArray(arr) ? arr.join(", ") : [];
  },
};

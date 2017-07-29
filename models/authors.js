module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("authors", {
    name: DataTypes.STRING
  });


  return Author;
};
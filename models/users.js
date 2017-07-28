module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("Users", {
    username: DataTypes.STRING
  },
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Tasks);
      }
    }
  });

  return User;
};
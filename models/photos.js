module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("photos", {
    link: {type: DataTypes.STRING,
      validate: {
        isUrl: true,
        allowNull: false,
      }
    },
    description: DataTypes.TEXT
  });
  Photo.associate = function(models){
    Photo.belongsTo(models.authors);
  };
  return Photo;
};
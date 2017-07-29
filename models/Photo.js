module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photos", {
    link: {type: DataTypes.STRING,
      validate: {
        isUrl: true,
        allowNull: false,
      }
    },
    description: DataTypes.TEXT,
    author_id: {type: DataTypes.INTEGER,
      references: {
        model: Authors,
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.Users);
      }
    }
  });

  return Photo;
};
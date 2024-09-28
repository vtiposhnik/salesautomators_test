import { Sequelize, DataTypes } from 'sequelize'
import sequelize from './db.js';

const Token = sequelize.define('Token', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expiresIn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    apiDomain: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

sequelize.sync()

export default Token;
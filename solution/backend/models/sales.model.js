module.exports = (sequelize, Sequelize) => {
    const Sales = sequelize.define("sales", {
        transactionDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        product: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        paymentType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        accountCreated: {
            type: Sequelize.DATE,
            allowNull: false
        },
        lastLogin: {
            type: Sequelize.DATE,
            allowNull: false
        },
        latitude: {
            type: Sequelize.DECIMAL(11,8),
            allowNull: false
        },
        longitude: {
            type: Sequelize.DECIMAL(11,8),
            allowNull: false
        },
        position: {
            type: Sequelize.GEOMETRY,
            allowNull: false
        }
    });
    
    return Sales;
};
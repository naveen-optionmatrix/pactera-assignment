/** This controller handles the file processing actions */
const responseHandler = require("../handlers/responseHandler");
const fs = require('fs');
const csv = require('fast-csv');
const db = require("../models");

/**
 * Uploads the file to the server and saves the data into DB
 * @param req - Object - Express request
 * @param res - Object - Express response
 * @param next - Function - Express callback
 * @returns string
 */
fileUpload = async (req, res, next) => {
    importCsvData2MySQL('uploads/' + req.file.filename);
    let msg = {
        'msg': 'File uploaded/import successfully!', 'file': req.file
    }
    responseHandler.handleSuccess(res, msg)
}


// -> Import CSV File to MySQL database
async function importCsvData2MySQL(filePath) {
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();

            let insertedRows = 0;

            //looping through the data to prepare the data for db
            if (csvData.length > 0) {
                let formattedData = [];
                for (let i = 0; i < csvData.length; i++) {
                    let indRecord = {
                        transactionDate: csvData[i][0].trim(),
                        product: csvData[i][1].trim(),
                        price: csvData[i][2].trim(),
                        paymentType: csvData[i][3].trim(),
                        name: csvData[i][4].trim(),
                        city: csvData[i][5].trim(),
                        state: csvData[i][6].trim(),
                        country: csvData[i][7],
                        accountCreated: csvData[i][8].trim(),
                        lastLogin: csvData[i][9].trim(),
                        latitude: csvData[i][10].trim(),
                        longitude: csvData[i][11].trim(),
                        position: { type: 'Point', coordinates: [csvData[i][10].trim(), csvData[i][11].trim()] }
                    };
                    formattedData.push(indRecord);
                }
                // console.log(formattedData);
                db.sales.destroy({ truncate: true, cascade: false });

                db.sales.bulkCreate(formattedData).then(function () {
                    return db.sales.findAll()
                })
            }

            // delete file after saving to MySQL database
            fs.unlinkSync(filePath)
        });


    stream.pipe(csvStream);

}

/**
 * Provides data to generate Reports
 * @param req - Object - Express request
 * @param res - Object - Express response
 * @param next - Function - Express callback
 * @returns object
 */
getReports = async (req, res, next) => {

    let productSalesPerMonth = await getProductSalesData()
    let marketComposition = await getMarketSalesData()
    let daywiseAmounts = await getDaywiseAmountsData()
    let preferredPaymentType = await getPreferredPaymentType()
    let countrywiseSales = await getCountrywiseSales()

    responseHandler.handleSuccess(res, {
        'productSalesPerMonth': productSalesPerMonth,
        'marketComposition': marketComposition,
        'daywiseAmounts': daywiseAmounts,
        'preferredPaymentType': preferredPaymentType,
        "countrywiseSales": countrywiseSales
    })
}


/**
 * Sub-function which provides the product sales data
 * @returns array
 */
async function getProductSalesData() {
    let dbProductSalesPerMonth = await db.sequelize.query("SELECT DAY(`transactionDate`) as day, SUM(CASE WHEN product = 'Product1' THEN 1 ELSE 0 END) AS `Product 1`, SUM(CASE WHEN product = 'Product2' THEN 1 ELSE 0 END) AS `Product 2`, SUM(CASE WHEN product = 'Product3' THEN 1 ELSE 0 END) AS `Product 3` FROM `sales` GROUP BY DATE(`transactionDate`)", { type: db.sequelize.QueryTypes.SELECT });

    let productSalesPerMonth = []
    dbProductSalesPerMonth.map(o => {
        let values = Object.values(o).map(Number);
        productSalesPerMonth.push(values)
    })
    return productSalesPerMonth;
}

/**
 * Sub-function which provides the market sales data
 * @returns array
 */
async function getMarketSalesData() {
    let dbMarketComposition = await db.sequelize.query("select `product`, count(`id`) as count from `sales` group by `product` order by `product`", { type: db.sequelize.QueryTypes.SELECT });
    let marketComposition = dbMarketComposition.map(o => { return Object.values(o) });
    return marketComposition;
}

/**
 * Sub-function which provides the day-wise sales data
 * @returns array
 */
async function getDaywiseAmountsData() {
    let dbDayAmounts = await db.sequelize.query("SELECT DAY(`transactionDate`) as date, SUM(CASE WHEN product = 'Product1' THEN `price` ELSE 0 END) AS Product1, SUM(CASE WHEN product = 'Product2' THEN `price` ELSE 0 END) AS Product2, SUM(CASE WHEN product = 'Product3' THEN `price` ELSE 0 END) AS Product3 FROM sales GROUP BY DATE(`transactionDate`)", { type: db.sequelize.QueryTypes.SELECT });
    let daywiseAmounts = dbDayAmounts.map(o => { return Object.values(o).map(Number) });

    return daywiseAmounts
}

/**
 * Sub-function which provides the payment types data
 * @returns array
 */
async function getPreferredPaymentType() {
    let dbPaymentTypes = await db.sequelize.query("select `paymentType`, count(`id`) as count from `sales` group by `paymentType` order by `paymentType`", { type: db.sequelize.QueryTypes.SELECT });
    let paymentTypes = dbPaymentTypes.map(o => { return Object.values(o) });
    return paymentTypes;
}

/**
 * Sub-function which provides the countrywise sales data
 * @returns array
 */
async function getCountrywiseSales() {
    let dbCountrywiseSales = await db.sequelize.query("SELECT `country`, SUM(CASE WHEN product = 'Product1' THEN 1 ELSE 0 END) AS `Product 1`, SUM(CASE WHEN product = 'Product2' THEN 1 ELSE 0 END) AS `Product 2`, SUM(CASE WHEN product = 'Product3' THEN 1 ELSE 0 END) AS `Product 3` FROM `sales` GROUP BY `country`", { type: db.sequelize.QueryTypes.SELECT });

    let countrywiseSales = []
    for (let i = 0; i < dbCountrywiseSales.length; i++) {
        let record = [dbCountrywiseSales[i]['country'], Number(dbCountrywiseSales[i]['Product 1']), Number(dbCountrywiseSales[i]['Product 2']), Number(dbCountrywiseSales[i]['Product 3'])]
        countrywiseSales.push(record)
    }
    return countrywiseSales;
}

/**
 * Exposing the controller actions to the route
 */
module.exports = {
    fileUpload: fileUpload,
    getReports: getReports
}
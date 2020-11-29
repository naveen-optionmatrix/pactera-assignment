/**
 * This module connects rendering modules to routes
 */
const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')

// global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./uploads/`
        fs.mkdirSync(path, { recursive: true })
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({storage: storage});

//error handler
const { catchErrors } = require('../handlers/errorHandlers')

//Importing
// const { testSettings, testSettings2 } = require('../controllers/test.controller');
const { fileUpload, getReports } = require('../controllers/file.controller');

// router.get('/test', catchErrors(testSettings))
// router.get('/test/user', catchErrors(testSettings2))
router.post('/file/upload', upload.single('file'), catchErrors(fileUpload))
router.get('/file/getReports', getReports)

module.exports = router

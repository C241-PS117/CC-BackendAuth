const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Auth = require('../controller/Auth');
const Soal = require('../controller/Soal');
const Nilai = require('../controller/NilaiSiswa');
const router = express.Router();

router.post('/register', upload.single('DataGambar'), Auth.addUser);
router.post('/editprofil', upload.single('DataGambar'), Auth.UbahUser);

router.get('/userdata', Auth.getUser);

router.use(upload.none());
router.post('/login', Auth.loginUser);
router.post('/ubahpassword', Auth.changePassword);
router.post('/tambahsoal', Soal.addSoal);
router.post('/deletesoal', Soal.deleteSoal);
router.post('/tambahnilai', Nilai.addNilaiSiswa);
router.post('/nilai', Nilai.getNilaiSiswa);
router.post('/countGuruAtas', Auth.getCountGuru);
router.post('/deleteNilaiSiswa', Nilai.deleteNilaiSiswa);
router.post('/soal', Soal.getSoal);

module.exports = router;
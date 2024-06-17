const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getSoal =  async (req, res) => {
  const { idGuru} = req.body;
    try {
        const soal = await prisma.$queryRaw`SELECT * FROM soal where idGuru = ${idGuru}`;
        const formattedData = soal.map(soals => ({
        id: soals.id,
        soal: soals.soal,
        jawaban: soals.jawaban,
        totaljawaban: soals.totaljawaban,
        
        }));
        res.json({
          status: 'success',
          message: 'Get Data Berhasil',
          data: formattedData
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

const addSoal = async (req, res) => {
    const {idGuru, soal, jawaban } = req.body;
      try {
        await prisma.$queryRaw`INSERT INTO soal (idGuru, soal, jawaban, totaljawaban) VALUES (${idGuru}, ${soal}, ${jawaban},0)`;
    
        res.json({ message: 'Data added successfully' });
      } catch (error) {
        console.error('Error adding soal: ', error);
        res.status(500).json({ error: 'Failed to add data' });
      }
   
  };

  const deleteSoal = async (req, res) => {
    const { idGuru, soal } = req.body;
    try {
        // Menghapus entri dari tabel soal berdasarkan idGuru dan soal
        const deleteResult = await prisma.$executeRaw`
        DELETE FROM soal 
        WHERE idGuru = ${idGuru} 
        AND soal = ${soal}
    `;

        // Memastikan entri berhasil dihapus
        if (deleteResult) {
            res.json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found or you do not have permission to delete it' });
        }
    } catch (error) {
        console.error('Error deleting soal: ', error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
};

module.exports = {
    getSoal,addSoal,deleteSoal
  };

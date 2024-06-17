const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const getNilaiSiswa =  async (req, res) => {
    const { idSoal, idGuru} = req.body;
    try {
        const nilai = await prisma.$queryRaw` SELECT * FROM nilai
                                            WHERE idGuru = ${idGuru} AND idSoal = ${idSoal};`;
        const formattedData = nilai.map(nilais => ({
        id: nilais.id,
        namaSiswa: nilais.namaSiswa,
        nilaiSiswa: nilais.nilaiSiswa,
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


const addNilaiSiswa = async (req, res) => {
    const { idSoal, idGuru, namaSiswa, nilaiSiswa } = req.body;
      try {
        await prisma.$queryRaw`INSERT INTO nilai (idSoal, idGuru, namaSiswa, nilaiSiswa) VALUES (${idSoal}, ${idGuru}, ${namaSiswa}, ${nilaiSiswa})`;
        
        const updateResult = await prisma.$executeRaw`
        UPDATE soal
        SET totaljawaban = totaljawaban + 1
        WHERE id = ${idSoal}
    `;

    console.log("Update result:", updateResult);


        res.json({ message: 'Data added successfully' });
      } catch (error) {
        console.error('Error adding nilai: ', error);
        res.status(500).json({ error: 'Failed to add data' });
      }
   
  };

const deleteNilaiSiswa = async (req, res) => {
    const { idSoal, idGuru, namaSiswa, nilaiSiswa } = req.body;
    try {
        // Menghapus entri dari tabel nilai berdasarkan idSoal, idGuru, namaSiswa, dan nilaiSiswa
        const deleteResult = await prisma.$executeRaw`
        DELETE FROM nilai 
        WHERE idSoal = ${idSoal} 
        AND idGuru = ${idGuru} 
        AND namaSiswa = ${namaSiswa} 
        AND nilaiSiswa = ${nilaiSiswa}
    `;

        // Memastikan entri berhasil dihapus sebelum mengupdate tabel soal
        if (deleteResult) {
            const updateResult = await prisma.$executeRaw`
            UPDATE soal
            SET totaljawaban = totaljawaban - 1
            WHERE id = ${idSoal}
        `;

            console.log("Update result:", updateResult);

            res.json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found or you do not have permission to delete it' });
        }
    } catch (error) {
        console.error('Error deleting nilai: ', error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
};


module.exports = {
    getNilaiSiswa, addNilaiSiswa, deleteNilaiSiswa
  };
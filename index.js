const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const cors = require('cors')


const app = express();
const prisma = new PrismaClient();
const port = 8080;


app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})
app.use(cors())
app.use(express.urlencoded({ extended: true }));



app.get('/users', async (req, res) => {
    try {
        const users = await prisma.$queryRaw`SELECT * FROM user`;
        const formattedData = users.map(user => ({
          id: user.id,
          username: user.username,
          password: user.password,
          email: user.email,
          jeniskelamin: user.jeniskelamin,
          urlgambar: user.urlgambar
        }));
        res.json({
          status: 'success',
          message: 'Get Data Berhasil',
          data: formattedData
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

const storage = new Storage({
    keyFilename: 'testing-425112-383aa3925370.json', 
  });



const upload = multer({
    dest:'./upload/images',
})

const bucketName = 'nodebucketardi'; 

  app.post('/userdata',upload.single('DataGambar'), async (req, res) => {
      const { username, password, email, jeniskelamin } = req.body;
      const file = req.file; 
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file' });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
    });


    try {
        const uploadedFile = await storage.bucket(bucketName).upload(file.path, {
            destination: `images/${file.filename}_${path.extname(req.file.originalname)}`,
            makePublic: true
        });
    
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${uploadedFile[0].name}`;
    
        await prisma.$queryRaw`INSERT INTO user (username, password, email, jeniskelamin, urlgambar) VALUES (${username}, ${password}, ${email}, ${jeniskelamin}, ${imageUrl})`;
    
        res.json({ message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding user: ', error);
        res.status(500).json({ error: 'Failed to add data' });
    }
    });









app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mengupdate pengguna berdasarkan ID
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk menghapus pengguna berdasarkan ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

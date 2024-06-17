const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');


const storage = new Storage({
    keyFilename: './testing-425112-383aa3925370.json', 
  });
  
const bucketName = 'nodebucketardi'; 

const getUser =  async (req, res) => {
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
};


const addUser = async (req, res) => {
  const { username, password, email, jeniskelamin } = req.body;
  const file = req.file;

  try {
    // Check if the username or email already exists
    const existingUser = await prisma.$queryRaw`
      SELECT * FROM user 
      WHERE username = ${username} 
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let imageUrl = null;
    if (file) {
      try {
        const uploadedFile = await storage.bucket(bucketName).upload(file.path, {
          destination: `images/${file.filename}_${path.extname(req.file.originalname)}`,
          makePublic: true
        });
        imageUrl = `https://storage.googleapis.com/${bucketName}/${uploadedFile[0].name}`;
      } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ error: 'Failed to upload file' });
      }
    }

    await prisma.$queryRaw`
      INSERT INTO user (username, password, email, jeniskelamin, urlgambar) 
      VALUES (${username}, ${password}, ${email}, ${jeniskelamin || null}, ${imageUrl || null})
    `;

    res.json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Error adding user: ', error);
    res.status(500).json({ error: 'Failed to add data' });
  }
};


const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.$queryRaw`SELECT * FROM user WHERE username = ${username} AND password = ${password}`;
  
        if (!user || user.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
  
        res.json({
            status: 'success',
            message: 'Get Data Berhasil',
            data: {
                id: user[0].id,
                username: user[0].username,
                password: user[0].password,
                email: user[0].email,
                jeniskelamin: user[0].jeniskelamin,
                urlgambar: user[0].urlgambar
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};


const changePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.$queryRaw`SELECT * FROM user WHERE id = ${id}`;
        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (oldPassword !== user[0].password) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }
        await prisma.$executeRaw`UPDATE user SET password = ${newPassword} WHERE id = ${id}`;

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

const UbahUser = async (req, res) => {
  const { id, username, email, jeniskelamin } = req.body;
  const file = req.file;

  if (file) {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Failed to read file' });
      }

      try {
        const uploadedFile = await storage.bucket(bucketName).upload(file.path, {
          destination: `images/${file.filename}${path.extname(req.file.originalname)}`,
          makePublic: true
        });

        const imageUrl = `https://storage.googleapis.com/${bucketName}/${uploadedFile[0].name}`;

        await prisma.$queryRaw`UPDATE user 
        SET username = ${username}, email = ${email}, jeniskelamin = ${jeniskelamin}, urlgambar = ${imageUrl}
        WHERE id = ${parseInt(id)}`;

        res.json({ message: 'Data Berhasil Diubah' });
      } catch (error) {
        console.error('Error updating user: ', error);
        res.status(500).json({ error: 'Failed to update data' });
      }
    });
  } else {
    try {
      await prisma.$queryRaw`UPDATE user 
      SET username = ${username}, email = ${email}, jeniskelamin = ${jeniskelamin}
      WHERE id = ${parseInt(id)}`;

      res.json({ message: 'Data Berhasil Diubah' });
    } catch (error) {
      console.error('Error updating user: ', error);
      res.status(500).json({ error: 'Failed to update data' });
    }
  }
};


const getCountGuru =  async (req, res) => {
    const {idGuru} = req.body;
    try {
        const data = await prisma.$queryRaw`SELECT 
    (SELECT COUNT(*) FROM soal WHERE idGuru =  ${idGuru}) AS TotalSoal,
    (SELECT COUNT(*) FROM nilai WHERE idGuru =  ${idGuru}) AS TotalJawaban;`;

        const formattedData = data.map(datas => ({
          TotalSoal: Number(datas.TotalSoal),
          TotalJawaban: Number(datas.TotalJawaban),
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

module.exports = {
  addUser,getUser,loginUser,changePassword,UbahUser,getCountGuru
};
# Backend API Documentation 🧑‍💻

## How to run this API on your local machine 💻

If you want to run this API Server on your local machine, you need to do this steps:

### Backend Service
1. Navigate to the directory
2. Install all required dependencies by typing `npm install` or `npm i` in the terminal.
3. Remember to create your `.env` file according to your settings.
4. If needed, run `npm install express @prisma/client` and `npm install --save-dev prisma`.
5. Start your application by running `node src/server.js` in the terminal.


## Essy API Endpoints

## Authentication

| Endpoint      | Method | Input                                           | Description                           | Status |
|---------------|--------|-------------------------------------------------|---------------------------------------|--------|
| `/login`      | POST   | `username`, `password`                          | Authenticate a teacher account.       | ok     |
| `/register`   | POST   | `username`, `password`, `email`, `jeniskelamin`, `DataGambar` (FILE) | Register a new teacher account.       | ok     |
| `/editprofil` | POST   | `username`, `id`, `email`, `jeniskelamin`, `DataGambar` (FILE) | Update a teacher account.             | ok     |
| `/ubahpassword`| POST  | `id`, `oldPassword`, `newPassword`              | Change the password of a teacher account. | ok     |

## Soal (Questions)

| Endpoint      | Method | Input                                           | Description                           | Status |
|---------------|--------|-------------------------------------------------|---------------------------------------|--------|
| `/soal`       | POST   | `idGuru`                                        | Retrieve question data per account.   | ok     |
| `/tambahsoal` | POST   | `idGuru`, `soal`, `jawaban`                     | Add a new question.                   | ok     |
| `/deletesoal` | DELETE | `idGuru`, `soal`                                | Delete a question.                    | ok     |

## Nilai Siswa (Student Scores)

| Endpoint      | Method | Input                                           | Description                           | Status |
|---------------|--------|-------------------------------------------------|---------------------------------------|--------|
| `/nilai`      | POST   | `idGuru`, `idSoal`                              | Retrieve all scores based on a question. | ok     |
| `/tambahnilai`| POST   | `idSoal`, `idGuru`, `namaSiswa`, `nilaiSiswa`   | Add a new score.                      | ok     |
| `/deletenilai`| DELETE | `idSoal`, `idGuru`, `namaSiswa`, `nilaiSiswa`   | Delete a student score.               | ok     |
| `/countGuruAtas`| POST | `idGuru`                                        | Retrieve the total answer key count and the total number of scores submitted. | ok     |

# Cloud Services

## ![Cloud Architecture]![essy drawio (2)](https://github.com/C241-PS117/CC-BackendAuth/assets/125329725/d8575136-f193-458d-b51b-81fb00d3a843)


## Deskripsi Layanan Cloud

### Cloud Run
Cloud Run is used as a backend service and to deploy machine learning models and API endpoints using containerized services.

### Cloud Storage
Cloud Storage is used to store assets and machine learning models.

### Cloud SQL
Cloud SQL is used to store relational data such as user data, child data, and prediction results from machine learning models.

### Postman
Postman is used to test the backend API. Provides tools for developing, testing, and documenting APIs.

## ![Database Diagram]![Screenshot 2024-06-08 203103](https://github.com/C241-PS117/CC-BackendAuth/assets/125329725/51b8f332-38e8-4a36-becd-d1189c1375d8)


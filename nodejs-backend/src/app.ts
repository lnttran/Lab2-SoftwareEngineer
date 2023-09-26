import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const APP_SECRET = "CS7328";

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// Middleware
const verifyJWT = require('./middleware/jwtVerify');

const app = express();

// email transporter 
const transporter = nodemailer.createTransport({
  // host: process.env.HOST,
  service: 'gmail',
  // port: 587,
  // secure: true,
  auth: {
    user: 'zestybuffalosaucepacket@gmail.com',
    pass: 'zrbmazkofvybdrpb'
  },
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Create a Prisma client instance
const prisma = new PrismaClient();

// Register a new user
app.post('/user/signup', async (req: any, res: any) => {
  const { username, email, password } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Create a new user
    await prisma.user.create({ data: { username, email, password } });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
app.post('/user/login', async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Exclude password and other sensitive fields before sending
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user/forgot-password', async (req: any, res: any) => {
  console.log("hit")
  const email = req.body.email;

  try {

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a random token for the user
    const randomToken = crypto.randomBytes(32).toString('hex');

    // Create a reset token and expiry date for the user
    await prisma.user.update({
      where: { email: user.email },
      data: {
        resetToken: randomToken,
        resetTokenExpiry: Date.now() + 3600000, // 1 hour from now
      },
    });

    const jwtToken = jwt.sign({ user: user.username, email: user.email, token: randomToken }, APP_SECRET, {
      expiresIn: 3600000,
    });

    // Send an email with the token link
    const resetLink = `http://localhost:3000/reset-password/${jwtToken}`;


    //Email content
    const mailOptions = {
      from: 'zestybuffalosaucepacket@gmail.com',
      to: user.email,
      subject: 'Reset Password Link',
      text: `Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.`,
    }

    // Exclude password and other sensitive fields before sending
    const { password: _, ...safeUser } = user;

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: 'Reset email sent successfully.' });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send({ error: 'Failed to send reset email.' });
    }

    // return res.status(201).json({ message: 'Reset link send successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Interal Server Error' });
  }

});

app.get('/user/verify-token/:token', verifyJWT, async (req: any, res: any) => {
  return res.status(200);
})

app.post('/user/reset-password/', verifyJWT, async (req: any, res: any) => {
  const { jwt, newPassword } = req.body; //get information from the front-end input users

  const username = res.locals.decoded.user;

  if (!jwt || !newPassword || !username) {
    return res.status(400).json({ error: 'Token or New password is required.' });
  }

  //then update the information 
  await prisma.user.update({
    where: { username: username, },
    data: {
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null,
    }
  });

  return res.status(200).json({ message: "Reset password successfully." })
})

app.get("/", (req: any, res: any) => {
  res.status(200).send("Hello World!");
});


export default app;
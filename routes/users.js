import express from 'express';
import { hashPassword, comparePassword } from '../lib/utility.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

router.post('/signup', async (req, res) => {

    // get user inputs
    const { email, password, firstName, lastName } = req.body;

    // validate user inputs (to-do: validate email, enforce password policy)
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send('Missing required fields');
    }
    // check if user already exists
    const existingUser = await Prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    // hash password
    const hashedPassword = hashPassword(password);

    // save user to database
    const user = await Prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        }
    });

    // send response
    res.json({ 'user' : email });
});

router.post('/login', async (req, res) => {
    
    // get user inputs
    const { email, password } = req.body;

    // validate the inputs
    if (!email || !password) {
        return res.status(400).send('Missing required fields');
    }
    // find that user in database
    const existingUser = await Prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!existingUser) {
        return res.status(400).send('User not found');
    }

    // compare the password
    const passwordMatch = await comparePassword(password, existingUser.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid password');
    }

    // setup user session data
    req.session.email = existingUser.email;
    req.session.user_id = existingUser.id;
    req.session.first_name = existingUser.firstName;
    req.session.last_name = existingUser.lastName;
    console.log(`Logged in user: ${req.session.email}`);

    // send response
    res.send('Login successful');
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out successfully');
});

router.get('/getSession', (req, res) => {
    if (req.session.email) {
        res.json({
            customer_id: req.session.customer_id,
            email: req.session.email,
            first_name: req.session.first_name,
            last_name: req.session.last_name
        });
    } else {
        res.status(401).send('Not logged in');
    }
});

export default router;
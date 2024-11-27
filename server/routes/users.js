import express from 'express';
import { hashPassword, comparePassword, validatePassword } from '../lib/utility.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
    // get user inputs
    const { email, password, firstName, lastName } = req.body;

    // validate inputs
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send('Missing required fields');
    }

    // validate the password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
        return res.status(400).json({ message: 'Password requires 8 characters, at least 1 digit, 1 uppercase character, and 1 lowercase character', errors: passwordErrors });
    }

    try {
        // check if user already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: {
                email: email
            }
        });

        if (existingCustomer) {
            return res.status(400).send('User already exists');
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // save customer to database
        const customer = await prisma.customer.create({
            data: {
                email: email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName
            }
        });

        // send response
        res.json({ 'user': email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error creating user');
    }
});

router.post('/login', async (req, res) => {
    // get user inputs
    const { email, password } = req.body;

    // validate the inputs
    if (!email || !password) {
        return res.status(400).send('Missing required fields');
    }

    try {
        // find that customer in database
        const customer = await prisma.customer.findUnique({
            where: {
                email: email
            }
        });

        if (!customer) {
            return res.status(400).send('User not found');
        }

        // compare the password
        const passwordMatch = await comparePassword(password, customer.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid password');
        }

        // setup user session data
        req.session.email = customer.email;
        req.session.customer_id = customer.customer_id;
        req.session.first_name = customer.first_name;
        req.session.last_name = customer.last_name;
        console.log(`Logged in user: ${req.session.email}`);
        res.send('Login successful');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login');
    }
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
import express from 'express';
import { hashPassword, comparePassword, validatePassword } from '../lib/utility.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send('Missing required fields');
    }
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
        return res.status(400).json({ message: 'Password requires 8 characters, at least 1 digit, 1 uppercase character, and 1 lowercase character', errors: passwordErrors });
    }
    try {
        const existingCustomer = await prisma.customer.findUnique({
            where: {
                email: email
            }
        });
        if (existingCustomer) {
            return res.status(400).send('User already exists');
        }
        const hashedPassword = await hashPassword(password);
        const customer = await prisma.customer.create({
            data: {
                email: email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName
            }
        });

        res.json({ 'user': email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error creating user');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                email: email
            }
        });
        if (!customer) {
            return res.status(400).send('User not found');
        }
        const passwordMatch = await comparePassword(password, customer.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid password');
        }
        req.session.email = customer.email;
        req.session.userId = customer.customer_id;
        req.session.first_name = customer.first_name;
        req.session.last_name = customer.last_name;
        res.json({
            isLoggedIn: true,
            user: {
                email: customer.email,
                firstName: customer.first_name,
                lastName: customer.last_name
            }
        });
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
            userId: req.session.userId,
            email: req.session.email,
            first_name: req.session.first_name,
            last_name: req.session.last_name
        });
    } else {
        res.status(401).send('Not logged in');
    }
});

export default router;
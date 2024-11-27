import express from 'express';
import cors from 'cors';
import session from 'express-session';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';

// server setup
const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('../client/dist'));

// cors middleware
app.use(cors({
  credentials: true // allow cookies
}));

// express-session middleware
app.use(session({
  secret: 'hjbby^we643gDrsdf#9Hjdh',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // set to true if using https
    sameSite: 'lax', // consider 'none' if client/server different origins
    maxAge: 3600000
  }
}))

// routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
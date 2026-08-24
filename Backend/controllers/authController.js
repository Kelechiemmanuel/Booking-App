const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(`INSERT INTO users (name, email, password) 
            VALUES($1, $2, $3) RETURNING id, name, email, password`, [name, email, hashPassword])
        return res.status(200).json({
            message: 'User created successfully',
            user: result.rows[0]
        })
    } catch (error) {
        console.log("Login Error", error);

        return res.status(409).json({ message: 'User already exist' })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]
        if (!user) {
            return res.status(401).json({ message: 'Invalid user, user not found' })
        }
        const foundUser = await bcrypt.compare(password, user.password)
        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )
        return res.status(200).json({ token })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}





module.exports = { Register, Login }
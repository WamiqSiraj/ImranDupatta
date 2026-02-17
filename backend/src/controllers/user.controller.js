import User from '../models/userSchema.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

export async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Error while generating tokens: " + error.message);
    }
}

export async function registerUser(req, res) {
    //get data from req.body
    //check if fields not empty
    //check if user already exists
    //check file uploaded to multer
    const { email, password, fullname, city, address } = req.body
    // 2. Validate input
    if (![password, email, fullname, city, address]) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const exixtedUser = await User.findOne({
        email
    })

    if (exixtedUser) {
        return res.status(400).json({
            success: false,
            message: "Email already exixts"
        })
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Files not found"
        })
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        return res.status(400).json({
            success: false,
            message: "Avatar file not found"
        })
    }

    const user = await User.create({
        email,
        fullname,
        password,
        city,
        address,
        avatar: avatar.url,    //if we send just avatar full obj will insereted intoDB
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        return res.status(400).json({
            success: false,
            message: "User not created"
        })
    }

    res.status(201).json({
        success: true,
        data: createdUser,
        meassage: "User created sussessfully"
    })
}

export async function loginUser(req, res) {
    console.log("req body", req.body)
    console.log("req body", req.headers)
    try {
        const { email, password } = req.body

        if (!email) {
            return res.json({
                success: false,
                message: "Email or Password required"
            })
        }

        const user = await User.findOne({
            email
        })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        if (!password || !user.password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const passwordValid = await user.isPasswordCorrect(password)
        if (!passwordValid) {
            return res.json({
                success: false,
                message: "Password is invalid"
            })
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                meassage: "Access and Refresh token set Successfully"
            })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while logging in",
            error: error.message
        });
    }
}

export async function logOutUser(req, res) {
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true })

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            data: {},
            message: "user loggedout successfully"
        })
}

export async function refreshAccessToken(req, res) {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            return res.json({
                message: "unauthorized req"
            })
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken._id)
        if (!user) {
            return res.json({
                message: "invalid refresh token"
            })
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.json({
                message: "refresh token expired or used"
            })
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .cookie("accessToken", accessToken, options,)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "access token refresh successfully"
            })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

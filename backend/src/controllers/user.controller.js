import User from '../models/userSchema.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import Cart from "../models/cartSchema.js"; 

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

// export async function registerUser(req, res) {
//     //get data from req.body
//     //check if fields not empty
//     //check if user already exists
//     //check file uploaded to multer
//     const { email, password, fullname, city, address } = req.body
//     // 2. Validate input
//     if (![password, email, fullname, city, address]) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required"
//         })
//     }

//     const exixtedUser = await User.findOne({
//         email
//     })

//     if (exixtedUser) {
//         return res.status(400).json({
//             success: false,
//             message: "Email already exixts"
//         })
//     }
//     const avatarLocalPath = req.files?.avatar[0]?.path
//     const coverImageLocalPath = req.files?.coverImage[0]?.path

//     if (!avatarLocalPath) {
//         return res.status(400).json({
//             success: false,
//             message: "Files not found"
//         })
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//         return res.status(400).json({
//             success: false,
//             message: "Avatar file not found"
//         })
//     }

//     const user = await User.create({
//         email,
//         fullname,
//         password,
//         city,
//         address,
//         avatar: avatar.url,    //if we send just avatar full obj will insereted intoDB
//         coverImage: coverImage?.url || ""
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )
//     if (!createdUser) {
//         return res.status(400).json({
//             success: false,
//             message: "User not created"
//         })
//     }

//     res.status(201).json({
//         success: true,
//         data: createdUser,
//         meassage: "User created sussessfully"
//     })
// }

// export async function loginUser(req, res) {
//     console.log("req body", req.body)
//     console.log("req body", req.headers)
//     try {
//         const { email, password } = req.body

//         if (!email) {
//             return res.json({
//                 success: false,
//                 message: "Email or Password required"
//             })
//         }

//         const user = await User.findOne({
//             email
//         })
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "User not found"
//             })
//         }
//         if (!password || !user.password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password is required"
//             });
//         }

//         const passwordValid = await user.isPasswordCorrect(password)
//         if (!passwordValid) {
//             return res.json({
//                 success: false,
//                 message: "Password is invalid"
//             })
//         }

//         const { accessToken, refreshToken } =
//             await generateAccessAndRefreshToken(user._id)

//         const options = {
//             httpOnly: true,
//             secure: true
//         }
//         return res
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", refreshToken, options)
//             .json({
//                 success: true, 
//                 user: {
//                     _id: user._id,
//                     email: user.email,
//                     role: user.role
//                 },
//                 meassage: "Login Successfull, Access and Refresh token set Successfully"
//             })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Error while logging in",
//             error: error.message
//         });
//     }
// }

export async function registerUser(req, res) {
    try {
        // 1. Get data from req.body (added guestId)
        const { email, password, fullname, city, address, guestId } = req.body;

        // 2. Validate input
        if ([email, password, fullname, city, address].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3. Check if user already exists
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 4. Create User (Avatar/Cover logic removed)
        const user = await User.create({
            email,
            fullname,
            password, // Assuming your model has a pre-save hook to hash this
            city,
            address
        });

        // 5. Verify user creation
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        
        if (!createdUser) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong while registering the user"
            });
        }

        // --- GUEST CART MERGE LOGIC ---
        // Since this is a new user, they won't have an existing user cart yet.
        // We just need to check if they have a guest cart and assign it to them.
        if (guestId) {
            const guestCart = await Cart.findOne({ guestId });
            if (guestCart) {
                guestCart.userId = createdUser._id;
                guestCart.guestId = null; // Convert guest cart to registered user cart
                await guestCart.save();
            }
        }

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
}

export async function loginUser(req, res) {
    try {
        // 1. Extract guestId along with email and password
        const { email, password, guestId } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passwordValid = await user.isPasswordCorrect(password);
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // --- GUEST CART MERGE LOGIC START ---
        if (guestId) {
            const guestCart = await Cart.findOne({ guestId });
            
            if (guestCart && guestCart.items.length > 0) {
                let userCart = await Cart.findOne({ userId: user._id });

                if (!userCart) {
                    // Option A: User has no cart, transfer guest cart to user
                    guestCart.userId = user._id;
                    guestCart.guestId = null; // Remove guest association
                    await guestCart.save();
                } else {
                    // Option B: Both carts exist, merge items
                    guestCart.items.forEach(gItem => {
                        const existingItem = userCart.items.find(uItem => 
                            uItem.productId.toString() === gItem.productId.toString()
                        );
                        
                        if (existingItem) {
                            existingItem.quantity += gItem.quantity;
                        } else {
                            userCart.items.push(gItem);
                        }
                    });

                    userCart.totalPrice = userCart.items.reduce((acc, item) => 
                        acc + (item.price * item.quantity), 0
                    );
                    
                    await userCart.save();
                    await Cart.findByIdAndDelete(guestCart._id); // Cleanup guest cart
                }
            }
        }
        // --- GUEST CART MERGE LOGIC END ---

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None' // Useful if frontend/backend are on different domains
        };

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true, 
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                },
                message: "Login Successful. Cart merged (if any)."
            });

    } catch (error) {
        console.error("Login Error:", error);
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

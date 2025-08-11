import asynchandler from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiErr.js';
import { user } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/Apiresponse.js';
const registerUser = asynchandler(async (req, res) => {
    //get user details from frontend
    //validation -not empty
    //check if user already exists-username  and email
    //check for images, check for avtar
    //upload thme to cloudinary,  avatar
    //create user in object- create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response
    const { fullname, username, email, password } = req.body
    console.log("email:", email)

    // if(fullname===''){
    //     throw new ApiError(400,"full name is required")
    // }
    if ([
        fullname, email, username, password
    ].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "the field is required")
    }
    //this statement check that if user already exist 
    //vaise toh findone bas ek hi argument check karta h par jab hum isme $or karke likhte h toh yeh usme multiple argumet bhi check kar leta h aur uska return true ya false m deta h
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "the user with email or the username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverimageLocalPath = req.files?.coverimage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverimageLocalPath)

    if (!avatar)
        throw new ApiError(400, "the Avatar field is required")
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    if (!createduser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "user registered successfully")
    )

})
export { registerUser }
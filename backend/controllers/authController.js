const registerUser = async (req, res) => {

    console.log("🔥 registerUser called");
    console.log(req.body);

    res.status(200).json({
        success: true,
        message: "Register API Working Successfully"
    });

};

module.exports = { registerUser };
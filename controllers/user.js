const user = require("../models/user.js");


module.exports.signUpRenderForm = (req, res)=>{

    res.render("./users/signup.ejs");

};


module.exports.signUp = async(req, res)=>{
    
    try{
        let {username, email, password} =req.body;
        const newUser= new user({email, username});

        const registeredUser = await user.register(newUser, password);   //passport method 



        req.login(registeredUser, (err)=>{              //documentation passport

            if(err){
            return next(err);
        }
            
            req.flash("success" , "user registered, Welcome!");
            res.redirect("/listings");

        });



    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
         

};





module.exports.loginRenderForm = (req, res)=>{

    res.render("./users/login.ejs");

};


module.exports.login = async(req, res)=>{

    req.flash("success" , "welcome back to wonder");

    let redirectUrl= res.locals.redirectUrl || "/listings";   //if not then /listings

    res.redirect(redirectUrl);


};



module.exports.logout =(req, res)=>{
    req.logout((err)=>{    //passport

        if(err){
            next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings");
    });
};
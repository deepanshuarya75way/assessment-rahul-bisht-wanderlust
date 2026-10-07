const User = require("../models/user.js");

module.exports.rendersignupform =  (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to the app!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};



module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
 let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.checkActiveSession = async(req,res,next)=>{
  try{
    const user=await User.findById(req.user._id);

    if (user.activeSessionId && user.activeSessionId !== req.sessionID){
      return res.render("users/takeover",{
        device:user.activeDevice || "another device"
      });
      }
      user.activeSessionId=req.sessionID;
      user.activeDevice=req.get("User-Agent");
      await user.save();
      
      req.flash("success","Welcome back!");
      const redirectUrl =res.locals.redirectUrl || "/listings";
      
      res.redirect(redirectUrl);}
      catch(err){
        next(err);
    }
  };

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};

module.exports.takeover = async(req,res,next)=>{try{const user=await User.findById(req.user._id);
  
  user.activeSessionId=req.sessionID;
  user.activeDevice=req.get("Uer-Agent");

  await user.save();
  
  req.flash("sucess","Session take over successfully!");
  res.redirect("/listings");
}catch(err){
  next(err);
}
};


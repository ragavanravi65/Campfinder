var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comments");
var methodOverride=require("method-override");
var passport=require("passport"),
    localStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose");
var seedDB=require("./seeds");
var flash=require("connect-flash");
var User=require("./models/user");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelpcamp" , { useNewUrlParser : true});
//mongoose.connect("mongodb://localhost/yelpcamp" , { useNewUrlParser : true});
//mongodb+srv://ragavkutti777:<password>@yelpcamp-m4p2o.mongodb.net/test?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));

//schema setup


//seedDB();

// Campground.create( {
    //     image:"https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
//     description:"this is the second establishment"
//     },function(err,campground){
    //     name:"second",
//     if(err){
//         console.log(err);
//             }
//     else{
//         console.log(campground)
//         }
// });
//====================PASSPORT CONFIG

app.use(require("express-session")({
    secret:"shreeja",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
app.use(flash());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentUser=req.user;
    res.locals.message=req.flash("good");
    next();
});




//ROUTES
app.get("/",function (req,res) {
   res.render("landing");
});


app.get("/campgrounds",function (req,res) {
    Campground.find({},function (err,camps) {
        if(err){
            console.log("ewww error");
        }
        else{
            
            res.render("campground/campgrounds",{campgrounds:camps,currentUser:req.user});
        } 
    });
});


app.post("/campgrounds",isLoggedIn,function (req,res) {
    var name=req.body.campground_name;
    var image=req.body.image;
    var description=req.body.description;
    var username=req.user.username;
    var userid=req.user._id;
    var author={
        id:userid,
        username:username
    }
    var newCamp={name:name,image:image,description:description,author:author};
    console.log(newCamp);
    //campgrounds.push(newCamp);
   Campground.create(newCamp,function (err,addnew) {
       if(err){console.log("campground page err");}
       else{console.log("addnew");
       
           res.redirect("/campgrounds");}

   });
});

app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campground/new");
});
//edit campgrounds
app.get("/campgrounds/:id/details/edit",checkowner,function(req,res){
    Campground.findById(req.params.id,function (err,campground) {
            res.render("campground/edit",{campground:campground});
            });

});

app.put("/campgrounds/:id/details/edit",checkowner,function(req,res){
Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,campedit){
if(err){console.log("updating error");}
else{
    console.log(campedit._id);
    res.redirect("/campgrounds/"+req.params.id+"/details");
}
});
});

//delete=====================================***************************-============================
app.delete("/campgrounds/:id/details",checkowner,function (req,res) {
    Campground.findByIdAndRemove(req.params.id,function (err) {
        if(err){console.log("err");}
        else{
            res.redirect("/campgrounds");
        }
    });
    });
//=========================================================================================
//show campgrounds
app.get("/campgrounds/:id/details",function (req,res) {
Campground.findById(req.params.id).populate("comments").exec(function (err,foundcamp) {
    if(err){console.log("details err");}
    else{
        console.log(foundcamp);
        res.render("campground/show",{campground:foundcamp});
    }

});
});

//=================================================comment routes=======================
app.get("/campgrounds/:id/details/addcomment",isLoggedIn,function (req,res) {
Campground.findById(req.params.id,function(err,campground){
   if(err){console.log("comment site err");}
   else{
       res.render("comments/new",{campground:campground});
   }
});
});

//post comment

app.post("/campgrounds/:id/comments",isLoggedIn,function (req,res) {
    Campground.findById(req.params.id ,function (err,campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function (err,comment) {
               if(err){
                   console.log("err");
               }
                else{
                   comment.author.id=req.user.id;
                   comment.author.username=req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id+"/details");
               }
            });
        }

    });
});

//Auth ROUTES
//register
app.get("/register",function (req,res) {
   res.render("register");
});

app.post("/register",function (req,res) {
    User.register(new User({username:req.body.username}),req.body.password,function (err,user) {
        if(err){console.log(err);
            return res.render("register");}
        passport.authenticate("local")(req,res,function () {
            res.redirect("/campgrounds");
        });
    });
});
//post
app.get("/login",function (req,res) {
   res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}) ,function (req,res) {

});


app.get("/logout",function(req,res){
   req.logOut();
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();

    }
    req.flash("good","welcome to campgrounds");
    res.redirect("/login");
}

//edit,put,delete
function checkowner(req,res,next){
if(req.isAuthenticated()){
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            if(req.user._id.equals(campground.author.id)){ 
            next();
            }
            else{
                res.redirect("back");
            }
        }

    });
}else{
    res.redirect("back");
}
}
//=============================================
app.listen(process.env.PORT|| 5000,function () {
    console.log("yelpCamp is running");
});
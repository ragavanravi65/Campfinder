var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comments");
var data=[
    { name:"Journey to center",
    image:"https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},
    { name:"Earthy views",
    image:"https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},
    { name:"yelpcamp sucks",
    image:"https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
];

function seedDB() {

    Campground.deleteMany({},function (err) {
        if(err) {
            console.log(err);
        }
        // data.forEach(function (data) {
        //     Campground.create(data,function (err,eachcamp) {
        //         if(err){
        //             console.log("error with creation");
        //         }
        //         else{
        //             console.log("done");
        //         Comment.create({author:"raymond",
        //             text:"this is a blablabla"},function (err,commentpost) {
        //           if(err){
        //               console.log("comments not updated");
        //           }
        //           else{
        //               eachcamp.comments.push(commentpost);
        //               eachcamp.save();
        //               console.log("comments created");
        //           }
        //         });
        //         }
        //
        //     });
        //
        // });
    });

}
module.exports=seedDB;



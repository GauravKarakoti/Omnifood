const Hotel = require('../models/hotelModel')

const getFood = async(req,res)=>{
try{

    const {request} = req.query
    const searchTerm = request.trim();
    
   
    
    if(!request)return res.status(400).send("please prvode a reques")
    const hotels = await Hotel.find({
$or:[
    {name:{$regex:searchTerm,$options:'i'}},
    {city:{$regex:searchTerm,$options:'i'}},
    {'items.foodName':{$regex:searchTerm,$options:'i'}}

]})
if (hotels.length === 0) {
    return res.status(404).send("No matching hotels found");
}
res.status(200).send(hotels)
  
//res.status(200).send(hotels)
}
catch(err){
console.log(err)
res.status(500).send(err.message)
}

}
module.exports ={getFood}
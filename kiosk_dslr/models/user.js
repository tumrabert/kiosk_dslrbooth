import mongoose,{Schema} from 'mongoose';   
const userSchema = new Schema({
    username:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:false,default:'user'}
},{timestamps:true});

const User = mongoose.models.User || mongoose.model('User',userSchema);
export default User;
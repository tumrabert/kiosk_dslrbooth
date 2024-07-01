import mongoose, { Schema } from 'mongoose';

const userInformationSchema = new Schema({
  username: { type: String, ref: 'User', required: true },
  price: { type: Number, required: true }, // Corrected required property
  paymentAPI: { type: String, required: true }, // Corrected required property
  appAPI: { type: String, required: true }, // Corrected required property
}, { timestamps: true });

const UserInformation = mongoose.models.UserInformation || mongoose.model('UserInformation', userInformationSchema);
export default UserInformation;

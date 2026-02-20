import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    role: 'creator' | 'viewer' | 'admin';
    streamKey?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['creator', 'viewer', 'admin'], default: 'viewer' },
    streamKey: { type: String }, // For creators
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
